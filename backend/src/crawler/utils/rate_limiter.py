#!/usr/bin/env python3
"""
请求频率控制模块

用于实现合理的请求间隔与随机延迟策略，降低爬虫被识别风险
"""

import time
import random
import threading
from typing import Optional, Dict, Any


class RateLimiter:
    """请求频率限制器类
    
    提供多种请求频率控制策略，包括基础延迟、随机抖动、指数退避和自适应调整
    
    Attributes:
        min_delay: 最小延迟时间（秒）
        max_delay: 最大延迟时间（秒）
        enable_jitter: 是否启用随机抖动
        enable_exponential_backoff: 是否启用指数退避
        enable_adaptive: 是否启用自适应调整
        backoff_factor: 指数退避因子
        max_concurrent: 最大并发数
    """
    
    def __init__(
        self,
        min_delay: float = 1.0,
        max_delay: float = 10.0,
        enable_jitter: bool = True,
        enable_exponential_backoff: bool = False,
        enable_adaptive: bool = False,
        backoff_factor: float = 2.0,
        max_concurrent: int = 1
    ):
        """初始化请求频率限制器
        
        Args:
            min_delay: 最小延迟时间（秒）
            max_delay: 最大延迟时间（秒）
            enable_jitter: 是否启用随机抖动
            enable_exponential_backoff: 是否启用指数退避
            enable_adaptive: 是否启用自适应调整
            backoff_factor: 指数退避因子
            max_concurrent: 最大并发数
            
        Raises:
            ValueError: 当参数无效时抛出
        """
        if min_delay < 0:
            raise ValueError("min_delay必须大于等于0")
        
        if max_delay < min_delay:
            raise ValueError("max_delay必须大于等于min_delay")
        
        if backoff_factor < 1.0:
            raise ValueError("backoff_factor必须大于等于1.0")
        
        if max_concurrent < 1:
            raise ValueError("max_concurrent必须大于等于1")
        
        self.min_delay = min_delay
        self.max_delay = max_delay
        self.enable_jitter = enable_jitter
        self.enable_exponential_backoff = enable_exponential_backoff
        self.enable_adaptive = enable_adaptive
        self.backoff_factor = backoff_factor
        self.max_concurrent = max_concurrent
        
        # 统计信息
        self.success_count = 0
        self.failure_count = 0
        self._last_request_time = 0
        
        # 自适应调整相关
        self._current_delay = min_delay
        self._consecutive_failures = 0
        self._consecutive_successes = 0
        
        # 并发控制
        self._semaphore = threading.Semaphore(max_concurrent)
        self._lock = threading.Lock()
    
    def wait(self, attempt: int = 0) -> float:
        """等待指定时间
        
        根据配置计算等待时间并执行等待
        
        Args:
            attempt: 当前尝试次数（用于指数退避）
            
        Returns:
            实际等待的时间（秒）
        """
        with self._semaphore:
            delay = self._calculate_delay(attempt)
            
            # 确保距离上次请求有足够间隔
            with self._lock:
                current_time = time.time()
                time_since_last = current_time - self._last_request_time
                
                # 如果是第一次请求（_last_request_time为0），则等待完整的delay
                if self._last_request_time == 0:
                    actual_delay = delay
                elif time_since_last < delay:
                    actual_delay = delay - time_since_last
                else:
                    actual_delay = 0
                
                if actual_delay > 0:
                    time.sleep(actual_delay)
                
                self._last_request_time = time.time()
            
            return delay
    
    def _calculate_delay(self, attempt: int = 0) -> float:
        """计算延迟时间
        
        Args:
            attempt: 当前尝试次数
            
        Returns:
            计算后的延迟时间（秒）
        """
        delay = self._current_delay
        
        # 指数退避
        if self.enable_exponential_backoff and attempt > 0:
            delay = self.min_delay * (self.backoff_factor ** attempt)
            delay = min(delay, self.max_delay)
        
        # 随机抖动
        if self.enable_jitter:
            jitter = random.uniform(0, delay * 0.3)  # 最多30%的抖动
            delay = delay + jitter
        
        # 确保在范围内
        delay = max(self.min_delay, min(delay, self.max_delay))
        
        return delay
    
    def record_success(self) -> None:
        """记录成功请求
        
        用于自适应调整，成功时降低延迟
        """
        with self._lock:
            self.success_count += 1
            self._consecutive_successes += 1
            self._consecutive_failures = 0
            
            if self.enable_adaptive:
                # 多次成功后降低延迟
                if self._consecutive_successes >= 3:
                    self._current_delay = max(
                        self.min_delay,
                        self._current_delay * 0.9  # 减少10%
                    )
                    self._consecutive_successes = 0
    
    def record_failure(self) -> None:
        """记录失败请求
        
        用于自适应调整，失败时增加延迟
        """
        with self._lock:
            self.failure_count += 1
            self._consecutive_failures += 1
            self._consecutive_successes = 0
            
            if self.enable_adaptive:
                # 失败后增加延迟
                increase_factor = min(self._consecutive_failures, 5) * 0.2 + 1.0
                self._current_delay = min(
                    self.max_delay,
                    self._current_delay * increase_factor
                )
    
    def reset(self) -> None:
        """重置限制器状态"""
        with self._lock:
            self.success_count = 0
            self.failure_count = 0
            self._current_delay = self.min_delay
            self._consecutive_failures = 0
            self._consecutive_successes = 0
            self._last_request_time = 0
    
    def get_stats(self) -> Dict[str, Any]:
        """获取统计信息
        
        Returns:
            包含统计信息的字典
        """
        with self._lock:
            return {
                'success_count': self.success_count,
                'failure_count': self.failure_count,
                'current_delay': self._current_delay,
                'min_delay': self.min_delay,
                'max_delay': self.max_delay,
                'consecutive_failures': self._consecutive_failures,
                'consecutive_successes': self._consecutive_successes,
            }
    
    def update_config(
        self,
        min_delay: Optional[float] = None,
        max_delay: Optional[float] = None,
        enable_jitter: Optional[bool] = None,
        enable_adaptive: Optional[bool] = None
    ) -> None:
        """更新配置
        
        Args:
            min_delay: 新的最小延迟
            max_delay: 新的最大延迟
            enable_jitter: 是否启用抖动
            enable_adaptive: 是否启用自适应调整
        """
        with self._lock:
            if min_delay is not None:
                if min_delay < 0:
                    raise ValueError("min_delay必须大于等于0")
                self.min_delay = min_delay
            
            if max_delay is not None:
                if max_delay < self.min_delay:
                    raise ValueError("max_delay必须大于等于min_delay")
                self.max_delay = max_delay
            
            if enable_jitter is not None:
                self.enable_jitter = enable_jitter
            
            if enable_adaptive is not None:
                self.enable_adaptive = enable_adaptive
            
            # 确保当前延迟在新范围内
            self._current_delay = max(self.min_delay, min(self._current_delay, self.max_delay))
    
    def get_current_delay(self) -> float:
        """获取当前延迟时间
        
        Returns:
            当前延迟时间（秒）
        """
        with self._lock:
            return self._current_delay

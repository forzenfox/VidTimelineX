#!/usr/bin/env python3
"""
请求频率控制模块测试

使用TDD方法编写测试，确保请求频率控制功能正常工作
"""

import pytest
import time
from unittest.mock import patch, MagicMock


class TestRateLimiter:
    """请求频率限制器测试类"""
    
    def test_import_module(self):
        """测试模块是否能正常导入"""
        try:
            from src.crawler.utils.rate_limiter import RateLimiter
            assert True
        except ImportError as e:
            pytest.fail(f"无法导入RateLimiter模块: {e}")
    
    def test_class_exists(self):
        """测试RateLimiter类是否存在"""
        from src.crawler.utils.rate_limiter import RateLimiter
        assert hasattr(RateLimiter, '__init__')
        assert hasattr(RateLimiter, 'wait')
    
    def test_initialization_default(self):
        """测试默认初始化"""
        from src.crawler.utils.rate_limiter import RateLimiter
        
        limiter = RateLimiter()
        assert limiter is not None
        assert limiter.min_delay >= 0
    
    def test_initialization_custom(self):
        """测试自定义参数初始化"""
        from src.crawler.utils.rate_limiter import RateLimiter
        
        limiter = RateLimiter(min_delay=1.0, max_delay=3.0, enable_jitter=True)
        assert limiter.min_delay == 1.0
        assert limiter.max_delay == 3.0
        assert limiter.enable_jitter == True
    
    def test_wait_basic(self):
        """测试基础等待功能"""
        from src.crawler.utils.rate_limiter import RateLimiter
        
        limiter = RateLimiter(min_delay=0.1)
        start_time = time.time()
        limiter.wait()
        elapsed = time.time() - start_time
        
        # 应该至少等待min_delay
        assert elapsed >= 0.1
    
    def test_wait_respects_min_delay(self):
        """测试等待时间不小于最小延迟"""
        from src.crawler.utils.rate_limiter import RateLimiter
        
        limiter = RateLimiter(min_delay=0.2)
        start_time = time.time()
        limiter.wait()
        elapsed = time.time() - start_time
        
        assert elapsed >= 0.2
    
    def test_wait_with_jitter(self):
        """测试带抖动的等待"""
        from src.crawler.utils.rate_limiter import RateLimiter
        
        limiter = RateLimiter(min_delay=0.1, max_delay=0.3, enable_jitter=True)
        
        # 多次等待，验证有变化
        delays = []
        for _ in range(5):
            start_time = time.time()
            limiter.wait()
            delays.append(time.time() - start_time)
        
        # 应该有不同延迟（由于随机抖动）
        unique_delays = set([round(d, 2) for d in delays])
        assert len(unique_delays) > 1
    
    def test_exponential_backoff(self):
        """测试指数退避功能"""
        from src.crawler.utils.rate_limiter import RateLimiter
        
        limiter = RateLimiter(
            min_delay=0.1,
            max_delay=2.0,
            backoff_factor=2.0,
            enable_exponential_backoff=True
        )
        
        # 模拟多次失败
        delays = []
        for attempt in range(3):
            start_time = time.time()
            limiter.wait(attempt=attempt)
            delays.append(time.time() - start_time)
        
        # 延迟应该递增
        assert delays[1] > delays[0]
        assert delays[2] > delays[1]
    
    def test_exponential_backoff_max_limit(self):
        """测试指数退避不超过最大值"""
        from src.crawler.utils.rate_limiter import RateLimiter
        
        limiter = RateLimiter(
            min_delay=0.1,
            max_delay=0.5,
            backoff_factor=2.0,
            enable_exponential_backoff=True
        )
        
        # 高尝试次数应该被限制在max_delay
        start_time = time.time()
        limiter.wait(attempt=10)
        elapsed = time.time() - start_time
        
        # 应该接近但不超过max_delay
        assert elapsed >= 0.4  # 允许一些误差
        assert elapsed < 1.0   # 但不应该太长
    
    def test_adaptive_delay_increase(self):
        """测试自适应延迟增加"""
        from src.crawler.utils.rate_limiter import RateLimiter
        
        limiter = RateLimiter(min_delay=0.1, enable_adaptive=True)
        
        # 记录失败
        limiter.record_failure()
        limiter.record_failure()
        
        start_time = time.time()
        limiter.wait()
        elapsed = time.time() - start_time
        
        # 失败后延迟应该增加
        assert elapsed > 0.1
    
    def test_adaptive_delay_decrease(self):
        """测试自适应延迟减少"""
        from src.crawler.utils.rate_limiter import RateLimiter
        
        limiter = RateLimiter(min_delay=0.1, enable_adaptive=True)
        
        # 先记录一些失败增加延迟
        limiter.record_failure()
        
        # 然后记录成功
        for _ in range(5):
            limiter.record_success()
        
        start_time = time.time()
        limiter.wait()
        elapsed = time.time() - start_time
        
        # 多次成功后延迟应该回到接近min_delay
        assert elapsed >= 0.1
        assert elapsed < 0.5
    
    def test_record_success(self):
        """测试记录成功"""
        from src.crawler.utils.rate_limiter import RateLimiter
        
        limiter = RateLimiter(enable_adaptive=True)
        limiter.record_success()
        
        assert limiter.success_count >= 1
    
    def test_record_failure(self):
        """测试记录失败"""
        from src.crawler.utils.rate_limiter import RateLimiter
        
        limiter = RateLimiter(enable_adaptive=True)
        limiter.record_failure()
        
        assert limiter.failure_count >= 1
    
    def test_reset(self):
        """测试重置功能"""
        from src.crawler.utils.rate_limiter import RateLimiter
        
        limiter = RateLimiter(min_delay=0.1, enable_adaptive=True)
        
        # 记录一些状态
        limiter.record_failure()
        limiter.record_success()
        
        # 重置
        limiter.reset()
        
        assert limiter.success_count == 0
        assert limiter.failure_count == 0
    
    def test_get_stats(self):
        """测试获取统计信息"""
        from src.crawler.utils.rate_limiter import RateLimiter
        
        limiter = RateLimiter(enable_adaptive=True)
        limiter.record_success()
        limiter.record_failure()
        
        stats = limiter.get_stats()
        
        assert isinstance(stats, dict)
        assert 'success_count' in stats
        assert 'failure_count' in stats
        assert stats['success_count'] >= 1
        assert stats['failure_count'] >= 1
    
    def test_concurrent_wait(self):
        """测试并发等待（信号量控制）"""
        from src.crawler.utils.rate_limiter import RateLimiter
        import threading
        
        limiter = RateLimiter(min_delay=0.1, max_concurrent=2)
        
        results = []
        
        def worker():
            start_time = time.time()
            limiter.wait()
            results.append(time.time() - start_time)
        
        # 启动多个线程
        threads = [threading.Thread(target=worker) for _ in range(4)]
        for t in threads:
            t.start()
        for t in threads:
            t.join()
        
        # 所有线程应该完成
        assert len(results) == 4
    
    def test_invalid_min_delay_raises_error(self):
        """测试无效的最小延迟参数抛出异常"""
        from src.crawler.utils.rate_limiter import RateLimiter
        
        with pytest.raises((ValueError, AssertionError)):
            RateLimiter(min_delay=-1)
    
    def test_invalid_max_delay_raises_error(self):
        """测试无效的最大延迟参数抛出异常"""
        from src.crawler.utils.rate_limiter import RateLimiter
        
        with pytest.raises((ValueError, AssertionError)):
            RateLimiter(min_delay=1.0, max_delay=0.5)

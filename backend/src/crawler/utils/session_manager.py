#!/usr/bin/env python3
"""
Session管理模块

用于处理网站的Cookie验证与Session维持，实现Session轮换和自动刷新功能
"""

import time
import random
import threading
from typing import Dict, List, Optional, Any
import requests

from .user_agent_rotator import UserAgentRotator


class SessionManager:
    """Session管理器类
    
    管理多个requests.Session实例，支持Session轮换、Cookie管理和自动刷新
    
    Attributes:
        session_count: Session池大小
        rotate_interval: Session轮换间隔（秒）
        sessions: Session实例列表
        current_index: 当前使用的Session索引
        user_agent_rotator: User-Agent轮换器
    """
    
    def __init__(
        self,
        session_count: int = 3,
        rotate_interval: int = 300,
        proxies: Optional[Dict[str, str]] = None
    ):
        """初始化Session管理器
        
        Args:
            session_count: Session池大小
            rotate_interval: Session轮换间隔（秒）
            proxies: 代理配置
            
        Raises:
            ValueError: 当参数无效时抛出
        """
        if session_count < 1:
            raise ValueError("session_count必须大于等于1")
        
        if rotate_interval < 1:
            raise ValueError("rotate_interval必须大于等于1")
        
        self.session_count = session_count
        self.rotate_interval = rotate_interval
        self.proxies = proxies or {}
        
        self._sessions: List[requests.Session] = []
        self._current_index = 0
        self._last_rotate_time = 0
        self._lock = threading.Lock()
        
        # User-Agent轮换器
        self._user_agent_rotator = UserAgentRotator()
        
        # 初始化Session池
        self._init_sessions()
    
    def _init_sessions(self) -> None:
        """初始化Session池"""
        for _ in range(self.session_count):
            session = self._create_session()
            self._sessions.append(session)
    
    def _create_session(self) -> requests.Session:
        """创建新的Session实例
        
        Returns:
            配置好的requests.Session实例
        """
        session = requests.Session()
        
        # 设置User-Agent
        headers = self._user_agent_rotator.get_full_headers()
        session.headers.update(headers)
        
        # 设置代理
        if self.proxies:
            session.proxies.update(self.proxies)
        
        return session
    
    def get_session(self) -> requests.Session:
        """获取当前Session
        
        根据轮换策略返回合适的Session实例
        
        Returns:
            requests.Session实例
        """
        with self._lock:
            # 检查是否需要轮换
            current_time = time.time()
            if current_time - self._last_rotate_time >= self.rotate_interval:
                self._rotate_session()
            
            return self._sessions[self._current_index]
    
    def _rotate_session(self) -> None:
        """轮换到下一个Session"""
        self._current_index = (self._current_index + 1) % self.session_count
        self._last_rotate_time = time.time()
    
    def force_rotate(self) -> None:
        """强制轮换Session"""
        with self._lock:
            self._rotate_session()
    
    def get_current_session_index(self) -> int:
        """获取当前Session索引
        
        Returns:
            当前Session的索引
        """
        with self._lock:
            return self._current_index
    
    def add_cookie(self, name: str, value: str, domain: str = '', path: str = '/') -> None:
        """添加Cookie到所有Session
        
        Args:
            name: Cookie名称
            value: Cookie值
            domain: Cookie域名
            path: Cookie路径
        """
        with self._lock:
            for session in self._sessions:
                session.cookies.set(name, value, domain=domain, path=path)
    
    def clear_cookies(self) -> None:
        """清除所有Session的Cookie"""
        with self._lock:
            for session in self._sessions:
                session.cookies.clear()
    
    def update_headers(self, headers: Dict[str, str]) -> None:
        """更新所有Session的请求头
        
        Args:
            headers: 要更新的请求头字典
        """
        with self._lock:
            for session in self._sessions:
                session.headers.update(headers)
    
    def reset(self) -> None:
        """重置所有Session"""
        with self._lock:
            self._sessions.clear()
            self._current_index = 0
            self._last_rotate_time = 0
            self._init_sessions()
    
    def get_stats(self) -> Dict[str, Any]:
        """获取Session统计信息
        
        Returns:
            包含统计信息的字典
        """
        with self._lock:
            return {
                'session_count': self.session_count,
                'current_index': self._current_index,
                'rotate_interval': self.rotate_interval,
                'last_rotate_time': self._last_rotate_time,
                'time_since_last_rotate': time.time() - self._last_rotate_time,
            }
    
    def refresh_session(self, index: Optional[int] = None) -> None:
        """刷新指定Session
        
        Args:
            index: Session索引，为None时刷新当前Session
        """
        with self._lock:
            if index is None:
                index = self._current_index
            
            if 0 <= index < len(self._sessions):
                # 创建新Session替换旧的
                self._sessions[index] = self._create_session()

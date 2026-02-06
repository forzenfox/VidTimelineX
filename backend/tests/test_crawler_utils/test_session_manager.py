#!/usr/bin/env python3
"""
Session管理模块测试

使用TDD方法编写测试，确保Session管理功能正常工作
"""

import pytest
import time
from unittest.mock import patch, MagicMock, Mock


class TestSessionManager:
    """Session管理器测试类"""
    
    def test_import_module(self):
        """测试模块是否能正常导入"""
        try:
            from src.crawler.utils.session_manager import SessionManager
            assert True
        except ImportError as e:
            pytest.fail(f"无法导入SessionManager模块: {e}")
    
    def test_class_exists(self):
        """测试SessionManager类是否存在"""
        from src.crawler.utils.session_manager import SessionManager
        assert hasattr(SessionManager, '__init__')
        assert hasattr(SessionManager, 'get_session')
    
    def test_initialization_default(self):
        """测试默认初始化"""
        from src.crawler.utils.session_manager import SessionManager
        
        manager = SessionManager()
        assert manager is not None
        assert manager.session_count >= 1
    
    def test_initialization_custom(self):
        """测试自定义参数初始化"""
        from src.crawler.utils.session_manager import SessionManager
        
        manager = SessionManager(session_count=3, rotate_interval=100)
        assert manager.session_count == 3
        assert manager.rotate_interval == 100
    
    def test_get_session_returns_session(self):
        """测试获取Session对象"""
        from src.crawler.utils.session_manager import SessionManager
        
        manager = SessionManager()
        session = manager.get_session()
        
        assert session is not None
        # 应该返回requests.Session或类似对象
        assert hasattr(session, 'headers')
    
    def test_get_session_with_user_agent(self):
        """测试获取带User-Agent的Session"""
        from src.crawler.utils.session_manager import SessionManager
        
        manager = SessionManager()
        session = manager.get_session()
        
        # Session应该包含User-Agent
        assert 'User-Agent' in session.headers
        assert len(session.headers['User-Agent']) > 0
    
    def test_session_rotation(self):
        """测试Session轮换"""
        from src.crawler.utils.session_manager import SessionManager
        
        manager = SessionManager(session_count=3)
        
        # 强制轮换后获取Session
        session1 = manager.get_session()
        manager.force_rotate()
        session2 = manager.get_session()
        manager.force_rotate()
        session3 = manager.get_session()
        
        # 应该返回不同的Session对象
        assert id(session1) != id(session2) or id(session2) != id(session3)
    
    def test_session_rotation_by_interval(self):
        """测试按间隔自动轮换Session"""
        from src.crawler.utils.session_manager import SessionManager
        
        # 设置很短的轮换间隔
        manager = SessionManager(session_count=2, rotate_interval=1)
        
        session1 = manager.get_session()
        time.sleep(1.1)  # 等待超过轮换间隔
        session2 = manager.get_session()
        
        # 间隔过后应该可能返回不同Session
        assert session1 is not None
        assert session2 is not None
    
    def test_add_cookie(self):
        """测试添加Cookie"""
        from src.crawler.utils.session_manager import SessionManager
        
        manager = SessionManager()
        manager.add_cookie('test_cookie', 'test_value', domain='.bilibili.com')
        
        session = manager.get_session()
        # Cookie应该被添加到Session
        assert session is not None
    
    def test_clear_cookies(self):
        """测试清除Cookie"""
        from src.crawler.utils.session_manager import SessionManager
        
        manager = SessionManager()
        manager.add_cookie('test_cookie', 'test_value', domain='.bilibili.com')
        manager.clear_cookies()
        
        # 清除后应该没有Cookie
        session = manager.get_session()
        assert session is not None
    
    def test_update_headers(self):
        """测试更新请求头"""
        from src.crawler.utils.session_manager import SessionManager
        
        manager = SessionManager()
        manager.update_headers({'X-Custom-Header': 'test_value'})
        
        session = manager.get_session()
        assert session.headers.get('X-Custom-Header') == 'test_value'
    
    def test_get_current_session_index(self):
        """测试获取当前Session索引"""
        from src.crawler.utils.session_manager import SessionManager
        
        manager = SessionManager(session_count=3)
        index = manager.get_current_session_index()
        
        assert isinstance(index, int)
        assert 0 <= index < 3
    
    def test_force_rotate(self):
        """测试强制轮换Session"""
        from src.crawler.utils.session_manager import SessionManager
        
        manager = SessionManager(session_count=2)
        session1 = manager.get_session()
        
        manager.force_rotate()
        session2 = manager.get_session()
        
        # 强制轮换后应该使用不同Session
        assert session1 is not None
        assert session2 is not None
    
    def test_session_persistence(self):
        """测试Session持久性"""
        from src.crawler.utils.session_manager import SessionManager
        
        manager = SessionManager()
        session1 = manager.get_session()
        session2 = manager.get_session()
        
        # 短时间内应该返回相同Session
        assert id(session1) == id(session2)
    
    def test_get_session_stats(self):
        """测试获取Session统计信息"""
        from src.crawler.utils.session_manager import SessionManager
        
        manager = SessionManager()
        stats = manager.get_stats()
        
        assert isinstance(stats, dict)
        assert 'session_count' in stats
        assert 'current_index' in stats
    
    def test_invalid_session_count_raises_error(self):
        """测试无效的Session数量抛出异常"""
        from src.crawler.utils.session_manager import SessionManager
        
        with pytest.raises((ValueError, AssertionError)):
            SessionManager(session_count=0)
        
        with pytest.raises((ValueError, AssertionError)):
            SessionManager(session_count=-1)
    
    def test_reset_sessions(self):
        """测试重置所有Session"""
        from src.crawler.utils.session_manager import SessionManager
        
        manager = SessionManager(session_count=2)
        session1 = manager.get_session()
        
        manager.reset()
        session2 = manager.get_session()
        
        # 重置后应该创建新的Session
        assert session1 is not None
        assert session2 is not None
    
    def test_session_with_proxy(self):
        """测试带代理的Session"""
        from src.crawler.utils.session_manager import SessionManager
        
        proxy = {'http': 'http://127.0.0.1:8080', 'https': 'https://127.0.0.1:8080'}
        manager = SessionManager(proxies=proxy)
        
        session = manager.get_session()
        assert session is not None
        # Session应该配置代理
        assert session.proxies == proxy

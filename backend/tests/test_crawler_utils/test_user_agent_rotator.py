#!/usr/bin/env python3
"""
User-Agent随机切换模块测试

使用TDD方法编写测试，确保User-Agent轮换功能正常工作
"""

import pytest
from unittest.mock import patch, MagicMock


class TestUserAgentRotator:
    """User-Agent轮换器测试类"""
    
    def test_import_module(self):
        """测试模块是否能正常导入"""
        try:
            from src.crawler.utils.user_agent_rotator import UserAgentRotator
            assert True
        except ImportError as e:
            pytest.fail(f"无法导入UserAgentRotator模块: {e}")
    
    def test_class_exists(self):
        """测试UserAgentRotator类是否存在"""
        from src.crawler.utils.user_agent_rotator import UserAgentRotator
        assert hasattr(UserAgentRotator, '__init__')
        assert hasattr(UserAgentRotator, 'get_random_user_agent')
    
    def test_initialization(self):
        """测试初始化功能"""
        from src.crawler.utils.user_agent_rotator import UserAgentRotator
        
        rotator = UserAgentRotator()
        assert rotator is not None
    
    def test_get_random_user_agent_returns_string(self):
        """测试随机获取User-Agent返回字符串类型"""
        from src.crawler.utils.user_agent_rotator import UserAgentRotator
        
        rotator = UserAgentRotator()
        ua = rotator.get_random_user_agent()
        
        assert isinstance(ua, str)
        assert len(ua) > 0
        assert 'Mozilla' in ua or 'Chrome' in ua or 'Safari' in ua or 'Firefox' in ua
    
    def test_get_random_user_agent_returns_different_values(self):
        """测试随机获取的User-Agent可能不同（概率性测试）"""
        from src.crawler.utils.user_agent_rotator import UserAgentRotator
        
        rotator = UserAgentRotator()
        uas = [rotator.get_random_user_agent() for _ in range(10)]
        
        # 检查是否至少有两个不同的User-Agent
        unique_uas = set(uas)
        assert len(unique_uas) > 1, "随机获取的User-Agent应该有变化"
    
    def test_get_user_agent_by_platform(self):
        """测试按平台获取User-Agent"""
        from src.crawler.utils.user_agent_rotator import UserAgentRotator
        
        rotator = UserAgentRotator()
        
        # 测试Windows平台
        ua_windows = rotator.get_user_agent_by_platform('windows')
        assert isinstance(ua_windows, str)
        assert 'Windows' in ua_windows
        
        # 测试macOS平台
        ua_mac = rotator.get_user_agent_by_platform('macos')
        assert isinstance(ua_mac, str)
        assert 'Mac' in ua_mac or 'Macintosh' in ua_mac
        
        # 测试Linux平台
        ua_linux = rotator.get_user_agent_by_platform('linux')
        assert isinstance(ua_linux, str)
        assert 'Linux' in ua_linux
    
    def test_get_user_agent_by_browser(self):
        """测试按浏览器类型获取User-Agent"""
        from src.crawler.utils.user_agent_rotator import UserAgentRotator
        
        rotator = UserAgentRotator()
        
        # 测试Chrome浏览器
        ua_chrome = rotator.get_user_agent_by_browser('chrome')
        assert isinstance(ua_chrome, str)
        assert 'Chrome' in ua_chrome
        
        # 测试Firefox浏览器
        ua_firefox = rotator.get_user_agent_by_browser('firefox')
        assert isinstance(ua_firefox, str)
        assert 'Firefox' in ua_firefox
        
        # 测试Safari浏览器
        ua_safari = rotator.get_user_agent_by_browser('safari')
        assert isinstance(ua_safari, str)
        assert 'Safari' in ua_safari
    
    def test_get_full_headers(self):
        """测试获取完整请求头"""
        from src.crawler.utils.user_agent_rotator import UserAgentRotator
        
        rotator = UserAgentRotator()
        headers = rotator.get_full_headers()
        
        assert isinstance(headers, dict)
        assert 'User-Agent' in headers
        assert 'Accept' in headers
        assert 'Accept-Language' in headers
        assert 'Accept-Encoding' in headers
    
    def test_get_full_headers_with_custom(self):
        """测试获取完整请求头并添加自定义字段"""
        from src.crawler.utils.user_agent_rotator import UserAgentRotator
        
        rotator = UserAgentRotator()
        custom_headers = {'Referer': 'https://www.bilibili.com/', 'X-Custom': 'test'}
        headers = rotator.get_full_headers(custom_headers=custom_headers)
        
        assert 'User-Agent' in headers
        assert headers.get('Referer') == 'https://www.bilibili.com/'
        assert headers.get('X-Custom') == 'test'
    
    def test_rotate_user_agent(self):
        """测试User-Agent轮换功能"""
        from src.crawler.utils.user_agent_rotator import UserAgentRotator
        
        rotator = UserAgentRotator()
        
        # 获取多个User-Agent
        ua1 = rotator.rotate_user_agent()
        ua2 = rotator.rotate_user_agent()
        ua3 = rotator.rotate_user_agent()
        
        # 验证都是有效的User-Agent
        for ua in [ua1, ua2, ua3]:
            assert isinstance(ua, str)
            assert len(ua) > 0
    
    def test_get_user_agent_pool_size(self):
        """测试获取User-Agent池大小"""
        from src.crawler.utils.user_agent_rotator import UserAgentRotator
        
        rotator = UserAgentRotator()
        size = rotator.get_pool_size()
        
        assert isinstance(size, int)
        assert size > 0
    
    def test_add_custom_user_agent(self):
        """测试添加自定义User-Agent"""
        from src.crawler.utils.user_agent_rotator import UserAgentRotator
        
        rotator = UserAgentRotator()
        custom_ua = "Mozilla/5.0 (Custom Test) AppleWebKit/537.36"
        
        initial_size = rotator.get_pool_size()
        rotator.add_user_agent(custom_ua, platform='windows', browser='chrome')
        new_size = rotator.get_pool_size()
        
        assert new_size == initial_size + 1
    
    def test_invalid_platform_raises_error(self):
        """测试无效平台参数抛出异常"""
        from src.crawler.utils.user_agent_rotator import UserAgentRotator, PlatformNotFoundError
        
        rotator = UserAgentRotator()
        
        with pytest.raises((PlatformNotFoundError, ValueError, KeyError)):
            rotator.get_user_agent_by_platform('invalid_platform')
    
    def test_invalid_browser_raises_error(self):
        """测试无效浏览器参数抛出异常"""
        from src.crawler.utils.user_agent_rotator import UserAgentRotator, BrowserNotFoundError
        
        rotator = UserAgentRotator()
        
        with pytest.raises((BrowserNotFoundError, ValueError, KeyError)):
            rotator.get_user_agent_by_browser('invalid_browser')
    
    def test_user_agent_format_valid(self):
        """测试User-Agent格式有效性"""
        from src.crawler.utils.user_agent_rotator import UserAgentRotator
        
        rotator = UserAgentRotator()
        ua = rotator.get_random_user_agent()
        
        # User-Agent应该以Mozilla开头
        assert ua.startswith('Mozilla/')
        
        # 应该包含版本信息
        assert 'Mozilla/5.0' in ua or 'Mozilla/4.0' in ua
    
    def test_get_headers_with_referer(self):
        """测试获取带Referer的请求头"""
        from src.crawler.utils.user_agent_rotator import UserAgentRotator
        
        rotator = UserAgentRotator()
        headers = rotator.get_headers_with_referer('https://www.bilibili.com/video/BV123456')
        
        assert 'User-Agent' in headers
        assert headers.get('Referer') == 'https://www.bilibili.com/video/BV123456'

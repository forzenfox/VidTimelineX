#!/usr/bin/env python3
"""
验证码处理模块测试

使用TDD方法编写测试，确保验证码检测和处理功能正常工作
"""

import pytest
from unittest.mock import patch, MagicMock


class TestCaptchaHandler:
    """验证码处理器测试类"""
    
    def test_import_module(self):
        """测试模块是否能正常导入"""
        try:
            from src.crawler.utils.captcha_handler import CaptchaHandler
            assert True
        except ImportError as e:
            pytest.fail(f"无法导入CaptchaHandler模块: {e}")
    
    def test_class_exists(self):
        """测试CaptchaHandler类是否存在"""
        from src.crawler.utils.captcha_handler import CaptchaHandler
        assert hasattr(CaptchaHandler, '__init__')
        assert hasattr(CaptchaHandler, 'detect_captcha')
    
    def test_initialization_default(self):
        """测试默认初始化"""
        from src.crawler.utils.captcha_handler import CaptchaHandler
        
        handler = CaptchaHandler()
        assert handler is not None
    
    def test_initialization_custom(self):
        """测试自定义参数初始化"""
        from src.crawler.utils.captcha_handler import CaptchaHandler
        
        handler = CaptchaHandler(
            detection_keywords=['验证码', 'captcha', 'verify'],
            alert_callback=lambda x: None
        )
        assert handler is not None
    
    def test_detect_captcha_in_html(self):
        """测试从HTML中检测验证码"""
        from src.crawler.utils.captcha_handler import CaptchaHandler
        
        handler = CaptchaHandler()
        
        html_with_captcha = '''
        <html>
            <body>
                <div class="captcha-container">
                    <img src="/captcha.jpg" />
                    <input type="text" name="captcha" />
                </div>
            </body>
        </html>
        '''
        
        result = handler.detect_captcha(html=html_with_captcha)
        assert result is True
    
    def test_detect_captcha_in_url(self):
        """测试从URL中检测验证码"""
        from src.crawler.utils.captcha_handler import CaptchaHandler
        
        handler = CaptchaHandler()
        
        captcha_url = 'https://example.com/captcha/verify'
        result = handler.detect_captcha(url=captcha_url)
        
        assert result is True
    
    def test_no_captcha_detected(self):
        """测试没有验证码的情况"""
        from src.crawler.utils.captcha_handler import CaptchaHandler
        
        # 使用空的检测关键词列表，确保不会误检测
        handler = CaptchaHandler(detection_keywords=['captcha_test_only'])
        
        normal_html = '''
        <html>
            <body>
                <h1>正常页面内容</h1>
                <p>没有任何验证码</p>
            </body>
        </html>
        '''
        
        result = handler.detect_captcha(html=normal_html)
        assert result is False
    
    def test_detect_captcha_by_response_code(self):
        """测试通过响应状态码检测验证码"""
        from src.crawler.utils.captcha_handler import CaptchaHandler
        
        handler = CaptchaHandler()
        
        # 某些网站在需要验证码时返回特定状态码
        result = handler.detect_captcha(status_code=403)
        assert isinstance(result, bool)
    
    def test_get_captcha_info(self):
        """测试获取验证码信息"""
        from src.crawler.utils.captcha_handler import CaptchaHandler
        
        handler = CaptchaHandler()
        
        html_with_captcha = '''
        <html>
            <body>
                <img id="captcha-img" src="/captcha.jpg?token=abc123" />
            </body>
        </html>
        '''
        
        info = handler.get_captcha_info(html=html_with_captcha)
        
        assert isinstance(info, dict)
        assert 'detected' in info
    
    def test_alert_on_captcha(self):
        """测试检测到验证码时触发告警"""
        from src.crawler.utils.captcha_handler import CaptchaHandler
        
        alert_triggered = []
        
        def mock_alert(message):
            alert_triggered.append(message)
        
        handler = CaptchaHandler(alert_callback=mock_alert)
        
        html_with_captcha = '<div>请输入验证码</div>'
        handler.detect_captcha(html=html_with_captcha)
        
        # 告警应该被触发
        assert len(alert_triggered) > 0
    
    def test_add_detection_keyword(self):
        """测试添加自定义检测关键词"""
        from src.crawler.utils.captcha_handler import CaptchaHandler
        
        handler = CaptchaHandler()
        handler.add_detection_keyword('安全验证')
        
        html = '<div>请完成安全验证</div>'
        result = handler.detect_captcha(html=html)
        
        assert result is True
    
    def test_remove_detection_keyword(self):
        """测试移除检测关键词"""
        from src.crawler.utils.captcha_handler import CaptchaHandler
        
        handler = CaptchaHandler()
        handler.add_detection_keyword('temp_keyword')
        handler.remove_detection_keyword('temp_keyword')
        
        html = '<div>temp_keyword</div>'
        result = handler.detect_captcha(html=html)
        
        # 移除后应该检测不到
        assert result is False
    
    def test_detect_image_captcha(self):
        """测试检测图片验证码"""
        from src.crawler.utils.captcha_handler import CaptchaHandler
        
        handler = CaptchaHandler()
        
        html = '<img src="captcha.png" class="captcha-image" />'
        result = handler.detect_captcha(html=html)
        
        assert result is True
    
    def test_detect_slider_captcha(self):
        """测试检测滑块验证码"""
        from src.crawler.utils.captcha_handler import CaptchaHandler
        
        handler = CaptchaHandler()
        
        html = '<div class="slider-captcha">滑块验证</div>'
        result = handler.detect_captcha(html=html)
        
        assert result is True
    
    def test_get_detection_stats(self):
        """测试获取检测统计信息"""
        from src.crawler.utils.captcha_handler import CaptchaHandler
        
        handler = CaptchaHandler()
        
        # 模拟几次检测
        handler.detect_captcha(html='<div>验证码</div>')
        handler.detect_captcha(html='<div>正常内容</div>')
        
        stats = handler.get_stats()
        
        assert isinstance(stats, dict)
        assert 'total_checks' in stats
        assert 'captcha_detected_count' in stats
    
    def test_reset_stats(self):
        """测试重置统计信息"""
        from src.crawler.utils.captcha_handler import CaptchaHandler
        
        handler = CaptchaHandler()
        
        # 进行一些检测
        handler.detect_captcha(html='<div>验证码</div>')
        
        # 重置
        handler.reset_stats()
        
        stats = handler.get_stats()
        assert stats['total_checks'] == 0
    
    def test_detect_chinese_captcha(self):
        """测试检测中文验证码提示"""
        from src.crawler.utils.captcha_handler import CaptchaHandler
        
        handler = CaptchaHandler()
        
        html = '<div>请输入验证码继续访问</div>'
        result = handler.detect_captcha(html=html)
        
        assert result is True
    
    def test_detect_english_captcha(self):
        """测试检测英文验证码提示"""
        from src.crawler.utils.captcha_handler import CaptchaHandler
        
        handler = CaptchaHandler()
        
        html = '<div>Please enter captcha to continue</div>'
        result = handler.detect_captcha(html=html)
        
        assert result is True

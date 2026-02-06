#!/usr/bin/env python3
"""
验证码处理模块

用于检测验证码并触发告警，支持多种验证码类型的识别
"""

import re
from typing import Dict, List, Optional, Callable, Any


class CaptchaHandler:
    """验证码处理器类
    
    检测网页中的验证码并提供告警机制
    
    Attributes:
        detection_keywords: 验证码检测关键词列表
        alert_callback: 检测到验证码时的回调函数
        stats: 检测统计信息
    """
    
    # 默认检测关键词
    DEFAULT_KEYWORDS = [
        '验证码', 'captcha', 'verify', 'verification',
        '安全验证', '人机验证', '请验证', 'please verify',
        '滑动验证', '滑块验证', '点击验证', '图片验证',
        '请输入验证码', '请完成验证', 'security check'
    ]
    
    # 验证码相关HTML特征
    CAPTCHA_PATTERNS = [
        r'<img[^>]*captcha[^>]*>',  # 验证码图片
        r'<div[^>]*slider[^>]*>',   # 滑块验证码
        r'<div[^>]*verify[^>]*>',   # 验证容器
        r'class="[^"]*captcha[^"]*"',  # 验证码类名
        r'id="[^"]*captcha[^"]*"',      # 验证码ID
    ]
    
    def __init__(
        self,
        detection_keywords: Optional[List[str]] = None,
        alert_callback: Optional[Callable[[str], None]] = None
    ):
        """初始化验证码处理器
        
        Args:
            detection_keywords: 自定义检测关键词列表
            alert_callback: 检测到验证码时的回调函数
        """
        self.detection_keywords = detection_keywords or self.DEFAULT_KEYWORDS.copy()
        self.alert_callback = alert_callback
        
        # 统计信息
        self._stats = {
            'total_checks': 0,
            'captcha_detected_count': 0,
        }
    
    def detect_captcha(
        self,
        html: Optional[str] = None,
        url: Optional[str] = None,
        status_code: Optional[int] = None
    ) -> bool:
        """检测验证码
        
        Args:
            html: 页面HTML内容
            url: 页面URL
            status_code: HTTP状态码
            
        Returns:
            是否检测到验证码
        """
        self._stats['total_checks'] += 1
        detected = False
        
        # 检查HTML内容
        if html:
            detected = self._detect_in_html(html)
        
        # 检查URL
        if not detected and url:
            detected = self._detect_in_url(url)
        
        # 检查状态码
        if not detected and status_code:
            detected = self._detect_by_status_code(status_code)
        
        if detected:
            self._stats['captcha_detected_count'] += 1
            self._trigger_alert("检测到验证码")
        
        return detected
    
    def _detect_in_html(self, html: str) -> bool:
        """从HTML中检测验证码
        
        Args:
            html: HTML内容
            
        Returns:
            是否检测到验证码
        """
        html_lower = html.lower()
        
        # 检查关键词
        for keyword in self.detection_keywords:
            if keyword.lower() in html_lower:
                return True
        
        # 检查HTML特征
        for pattern in self.CAPTCHA_PATTERNS:
            if re.search(pattern, html, re.IGNORECASE):
                return True
        
        return False
    
    def _detect_in_url(self, url: str) -> bool:
        """从URL中检测验证码
        
        Args:
            url: URL字符串
            
        Returns:
            是否检测到验证码
        """
        url_lower = url.lower()
        captcha_indicators = ['captcha', 'verify', 'verification', 'validate']
        return any(indicator in url_lower for indicator in captcha_indicators)
    
    def _detect_by_status_code(self, status_code: int) -> bool:
        """通过状态码检测验证码
        
        Args:
            status_code: HTTP状态码
            
        Returns:
            是否可能需要验证码
        """
        # 403可能表示需要验证码
        return status_code == 403
    
    def get_captcha_info(self, html: Optional[str] = None) -> Dict[str, Any]:
        """获取验证码详细信息
        
        Args:
            html: 页面HTML内容
            
        Returns:
            验证码信息字典
        """
        info = {
            'detected': False,
            'type': None,
            'keywords_found': [],
        }
        
        if not html:
            return info
        
        html_lower = html.lower()
        
        # 检测关键词
        for keyword in self.detection_keywords:
            if keyword.lower() in html_lower:
                info['keywords_found'].append(keyword)
        
        info['detected'] = len(info['keywords_found']) > 0
        
        # 检测验证码类型
        if info['detected']:
            if 'slider' in html_lower or '滑块' in html:
                info['type'] = 'slider'
            elif 'image' in html_lower or '图片' in html or '<img' in html:
                info['type'] = 'image'
            elif 'click' in html_lower or '点击' in html:
                info['type'] = 'click'
            else:
                info['type'] = 'unknown'
        
        return info
    
    def _trigger_alert(self, message: str) -> None:
        """触发验证码告警
        
        Args:
            message: 告警消息
        """
        if self.alert_callback:
            self.alert_callback(message)
        else:
            print(f"[验证码告警] {message}")
    
    def add_detection_keyword(self, keyword: str) -> None:
        """添加检测关键词
        
        Args:
            keyword: 要添加的关键词
        """
        if keyword not in self.detection_keywords:
            self.detection_keywords.append(keyword)
    
    def remove_detection_keyword(self, keyword: str) -> bool:
        """移除检测关键词
        
        Args:
            keyword: 要移除的关键词
            
        Returns:
            是否成功移除
        """
        if keyword in self.detection_keywords:
            self.detection_keywords.remove(keyword)
            return True
        return False
    
    def get_stats(self) -> Dict[str, int]:
        """获取检测统计信息
        
        Returns:
            统计信息字典
        """
        return self._stats.copy()
    
    def reset_stats(self) -> None:
        """重置统计信息"""
        self._stats = {
            'total_checks': 0,
            'captcha_detected_count': 0,
        }

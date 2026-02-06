#!/usr/bin/env python3
"""
User-Agent随机切换模块

用于实现动态User-Agent随机切换机制，降低爬虫被识别风险
"""

import random
from typing import Dict, List, Optional, Any


class PlatformNotFoundError(Exception):
    """平台不存在异常"""
    pass


class BrowserNotFoundError(Exception):
    """浏览器类型不存在异常"""
    pass


class UserAgentRotator:
    """User-Agent轮换器类
    
    提供多种User-Agent随机切换策略，支持按平台、浏览器类型筛选
    
    Attributes:
        user_agents: User-Agent池，按平台和浏览器分类存储
        accept_languages: 可随机选择的Accept-Language值
        accept_encodings: 可随机选择的Accept-Encoding值
    """
    
    # 预定义的User-Agent池
    DEFAULT_USER_AGENTS = {
        'windows': {
            'chrome': [
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36',
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36',
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36',
            ],
            'firefox': [
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:120.0) Gecko/20100101 Firefox/120.0',
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:119.0) Gecko/20100101 Firefox/119.0',
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:118.0) Gecko/20100101 Firefox/118.0',
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:117.0) Gecko/20100101 Firefox/117.0',
            ],
            'edge': [
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0',
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36 Edg/119.0.0.0',
            ],
        },
        'macos': {
            'chrome': [
                'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
                'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36',
            ],
            'safari': [
                'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Safari/605.1.15',
                'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Safari/605.1.15',
                'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.5 Safari/605.1.15',
            ],
            'firefox': [
                'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:120.0) Gecko/20100101 Firefox/120.0',
                'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:119.0) Gecko/20100101 Firefox/119.0',
            ],
        },
        'linux': {
            'chrome': [
                'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
            ],
            'firefox': [
                'Mozilla/5.0 (X11; Linux x86_64; rv:120.0) Gecko/20100101 Firefox/120.0',
                'Mozilla/5.0 (X11; Linux x86_64; rv:119.0) Gecko/20100101 Firefox/119.0',
            ],
        },
    }
    
    # Accept-Language选项
    ACCEPT_LANGUAGES = [
        'zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7',
        'zh-CN,zh;q=0.9,en;q=0.8',
        'zh-CN,zh-HK;q=0.9,zh;q=0.8,en-US;q=0.7,en;q=0.6',
        'en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7',
        'zh-TW,zh;q=0.9,en-US;q=0.8,en;q=0.7',
    ]
    
    # Accept-Encoding选项
    ACCEPT_ENCODINGS = [
        'gzip, deflate, br',
        'gzip, deflate',
        'gzip, deflate, br, zstd',
    ]
    
    def __init__(self):
        """初始化User-Agent轮换器"""
        self.user_agents = self._deep_copy_user_agents(self.DEFAULT_USER_AGENTS)
        self._current_index = 0
    
    def _deep_copy_user_agents(self, source: Dict) -> Dict:
        """深拷贝User-Agent池
        
        Args:
            source: 源User-Agent池
            
        Returns:
            深拷贝后的User-Agent池
        """
        result = {}
        for platform, browsers in source.items():
            result[platform] = {}
            for browser, agents in browsers.items():
                result[platform][browser] = agents.copy()
        return result
    
    def get_random_user_agent(self) -> str:
        """随机获取一个User-Agent
        
        从所有可用的User-Agent中随机选择一个
        
        Returns:
            随机User-Agent字符串
        """
        all_agents = []
        for platform in self.user_agents.values():
            for agents in platform.values():
                all_agents.extend(agents)
        
        return random.choice(all_agents)
    
    def get_user_agent_by_platform(self, platform: str) -> str:
        """按平台获取User-Agent
        
        Args:
            platform: 平台名称 ('windows', 'macos', 'linux')
            
        Returns:
            该平台下的随机User-Agent
            
        Raises:
            PlatformNotFoundError: 当平台不存在时抛出
        """
        if platform not in self.user_agents:
            raise PlatformNotFoundError(f"不支持的平台: {platform}")
        
        # 从该平台的所有浏览器中随机选择
        all_agents = []
        for agents in self.user_agents[platform].values():
            all_agents.extend(agents)
        
        return random.choice(all_agents)
    
    def get_user_agent_by_browser(self, browser: str) -> str:
        """按浏览器类型获取User-Agent
        
        Args:
            browser: 浏览器名称 ('chrome', 'firefox', 'safari', 'edge')
            
        Returns:
            该浏览器类型的随机User-Agent
            
        Raises:
            BrowserNotFoundError: 当浏览器类型不存在时抛出
        """
        all_agents = []
        for platform in self.user_agents.values():
            if browser in platform:
                all_agents.extend(platform[browser])
        
        if not all_agents:
            raise BrowserNotFoundError(f"不支持的浏览器类型: {browser}")
        
        return random.choice(all_agents)
    
    def get_user_agent(self, platform: Optional[str] = None, browser: Optional[str] = None) -> str:
        """获取指定条件的User-Agent
        
        Args:
            platform: 平台名称，为None时随机选择平台
            browser: 浏览器名称，为None时随机选择浏览器
            
        Returns:
            符合条件的随机User-Agent
        """
        if platform and browser:
            if platform not in self.user_agents:
                raise PlatformNotFoundError(f"不支持的平台: {platform}")
            if browser not in self.user_agents[platform]:
                raise BrowserNotFoundError(f"平台 {platform} 不支持浏览器 {browser}")
            return random.choice(self.user_agents[platform][browser])
        elif platform:
            return self.get_user_agent_by_platform(platform)
        elif browser:
            return self.get_user_agent_by_browser(browser)
        else:
            return self.get_random_user_agent()
    
    def rotate_user_agent(self) -> str:
        """轮换User-Agent
        
        按顺序轮换User-Agent，确保每个User-Agent都被使用
        
        Returns:
            轮换后的User-Agent
        """
        all_agents = []
        for platform in self.user_agents.values():
            for agents in platform.values():
                all_agents.extend(agents)
        
        if not all_agents:
            return ''
        
        ua = all_agents[self._current_index % len(all_agents)]
        self._current_index += 1
        return ua
    
    def get_full_headers(self, custom_headers: Optional[Dict[str, str]] = None) -> Dict[str, str]:
        """获取完整的请求头
        
        生成包含随机User-Agent和其他必要请求头的完整请求头字典
        
        Args:
            custom_headers: 自定义请求头字段
            
        Returns:
            完整的请求头字典
        """
        headers = {
            'User-Agent': self.get_random_user_agent(),
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
            'Accept-Language': random.choice(self.ACCEPT_LANGUAGES),
            'Accept-Encoding': random.choice(self.ACCEPT_ENCODINGS),
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1',
            'Sec-Fetch-Dest': 'document',
            'Sec-Fetch-Mode': 'navigate',
            'Sec-Fetch-Site': 'none',
            'Sec-Fetch-User': '?1',
        }
        
        # 添加自定义请求头
        if custom_headers:
            headers.update(custom_headers)
        
        return headers
    
    def get_headers_with_referer(self, referer: str) -> Dict[str, str]:
        """获取带Referer的请求头
        
        Args:
            referer: Referer URL
            
        Returns:
            包含Referer的完整请求头
        """
        return self.get_full_headers({'Referer': referer})
    
    def get_pool_size(self) -> int:
        """获取User-Agent池大小
        
        Returns:
            User-Agent池中的User-Agent总数
        """
        count = 0
        for platform in self.user_agents.values():
            for agents in platform.values():
                count += len(agents)
        return count
    
    def add_user_agent(self, user_agent: str, platform: str = 'windows', browser: str = 'chrome') -> None:
        """添加自定义User-Agent
        
        Args:
            user_agent: User-Agent字符串
            platform: 所属平台
            browser: 浏览器类型
        """
        if platform not in self.user_agents:
            self.user_agents[platform] = {}
        
        if browser not in self.user_agents[platform]:
            self.user_agents[platform][browser] = []
        
        self.user_agents[platform][browser].append(user_agent)
    
    def remove_user_agent(self, user_agent: str) -> bool:
        """移除指定的User-Agent
        
        Args:
            user_agent: 要移除的User-Agent字符串
            
        Returns:
            是否成功移除
        """
        for platform in self.user_agents.values():
            for browser, agents in platform.items():
                if user_agent in agents:
                    agents.remove(user_agent)
                    return True
        return False
    
    def get_platforms(self) -> List[str]:
        """获取所有支持的平台
        
        Returns:
            平台名称列表
        """
        return list(self.user_agents.keys())
    
    def get_browsers(self, platform: Optional[str] = None) -> List[str]:
        """获取支持的浏览器类型
        
        Args:
            platform: 平台名称，为None时返回所有平台的浏览器
            
        Returns:
            浏览器类型列表
        """
        if platform:
            if platform not in self.user_agents:
                raise PlatformNotFoundError(f"不支持的平台: {platform}")
            return list(self.user_agents[platform].keys())
        else:
            browsers = set()
            for platform_data in self.user_agents.values():
                browsers.update(platform_data.keys())
            return list(browsers)

#!/usr/bin/env python3
"""
收藏夹爬虫模块
用于爬取B站收藏夹中的视频BV号
"""

import re
import time
from pathlib import Path
from playwright.sync_api import sync_playwright
import requests
from src.utils.path_manager import get_favorites_config
from src.crawler.utils.user_agent_rotator import UserAgentRotator
from src.crawler.utils.rate_limiter import RateLimiter
from src.crawler.utils.session_manager import SessionManager


class FavoritesCrawler:
    """收藏夹爬虫类
    
    用于爬取B站收藏夹中的视频BV号，集成反爬机制
    """
    
    def __init__(self, use_anti_crawler=True):
        """初始化收藏夹爬虫
        
        Args:
            use_anti_crawler: 是否启用反爬机制
        """
        self.use_anti_crawler = use_anti_crawler
        
        # 初始化反爬组件
        if use_anti_crawler:
            # User-Agent轮换器
            self.user_agent_rotator = UserAgentRotator()
            # 请求频率限制器
            self.rate_limiter = RateLimiter(
                min_delay=1.0,
                max_delay=3.0,
                enable_jitter=True,
                enable_adaptive=True
            )
            # Session管理器
            self.session_manager = SessionManager(
                session_count=2,
                rotate_interval=300
            )
        else:
            self.user_agent_rotator = None
            self.rate_limiter = None
            self.session_manager = None
        
        # API配置（内置，不依赖config.json）
        self.api_config = {
            'base_url': 'https://api.bilibili.com/x/v3/fav/resource/list',
            'headers': {
                'accept': '*/*',
                'referer': 'https://space.bilibili.com/',
                'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36'
            },
            'cookies': {},  # 空Cookie，公开收藏夹不需要登录
            'params': {
                'ps': 36,  # 每页数量
                'keyword': '',
                'order': 'mtime',
                'type': 0,
                'tid': 0,
                'platform': 'web',
                'web_location': '333.1387'
            }
        }
    
    def get_favorites_config(self):
        """获取收藏夹配置
        
        Returns:
            dict: 收藏夹配置
        """
        return get_favorites_config()
    
    def crawl_favorites(self, url):
        """爬取收藏夹页面
        
        Args:
            url: 收藏夹URL
            
        Returns:
            str: 页面HTML内容
        """
        print(f"爬取收藏夹: {url}")
        try:
            with sync_playwright() as p:
                # 启动浏览器
                browser = p.chromium.launch(headless=True)
                page = browser.new_page()
                
                # 导航到页面
                page.goto(url, timeout=60000)
                
                # 等待页面加载完成
                page.wait_for_load_state('networkidle', timeout=60000)
                
                # 等待视频列表加载
                page.wait_for_timeout(5000)
                
                # 滚动页面以加载更多内容
                for i in range(3):
                    page.mouse.wheel(0, 1000)
                    page.wait_for_timeout(2000)
                
                # 获取页面HTML
                html = page.content()
                
                # 关闭浏览器
                browser.close()
                
                return html
        except Exception as e:
            print(f"爬取收藏夹失败: {e}")
            return None
    
    def extract_bv_codes(self, html):
        """从HTML中提取BV号
        
        Args:
            html: 页面HTML内容
            
        Returns:
            list: BV号列表
        """
        bv_codes = []
        
        # 匹配视频链接中的BV号
        pattern = r'/video/BV([0-9A-Za-z]+)'
        matches = re.findall(pattern, html)
        
        for match in matches:
            if match:
                bv_codes.append(match)
        
        # 去重
        return list(set(bv_codes))
    
    def save_bv_codes(self, bv_codes, output_file):
        """保存BV号到文件
        
        Args:
            bv_codes: BV号列表
            output_file: 输出文件路径
            
        Returns:
            bool: 保存成功返回True，否则返回False
        """
        try:
            # 确保输出目录存在
            output_file.parent.mkdir(parents=True, exist_ok=True)
            
            # 保存BV号
            with open(output_file, 'w', encoding='utf-8') as f:
                for bv_code in bv_codes:
                    if not bv_code.startswith('BV'):
                        f.write(f"BV{bv_code}\n")
                    else:
                        f.write(f"{bv_code}\n")
            
            print(f"成功保存 {len(bv_codes)} 个BV号到 {output_file}")
            return True
        except Exception as e:
            print(f"保存BV号失败: {e}")
            return False
    
    def _get_api_headers(self):
        """获取API请求头（支持User-Agent轮换）
        
        Returns:
            dict: 请求头字典
        """
        headers = self.api_config['headers'].copy()
        
        if self.use_anti_crawler and self.user_agent_rotator:
            # 使用随机User-Agent
            random_headers = self.user_agent_rotator.get_full_headers({
                'Referer': 'https://space.bilibili.com/'
            })
            headers.update(random_headers)
        
        return headers
    
    def _rate_limit(self, attempt=0):
        """请求频率限制
        
        Args:
            attempt: 当前尝试次数
        """
        if self.use_anti_crawler and self.rate_limiter:
            self.rate_limiter.wait(attempt=attempt)
        else:
            time.sleep(1)
    
    def _record_success(self):
        """记录请求成功"""
        if self.use_anti_crawler and self.rate_limiter:
            self.rate_limiter.record_success()
    
    def _record_failure(self):
        """记录请求失败"""
        if self.use_anti_crawler and self.rate_limiter:
            self.rate_limiter.record_failure()
    
    def fetch_favorites_api(self, media_id, page=1):
        """使用API获取收藏夹数据
        
        Args:
            media_id: 收藏夹ID
            page: 页码
            
        Returns:
            dict: API响应数据
        """
        params = self.api_config['params'].copy()
        params['media_id'] = media_id
        params['pn'] = page
        
        # 获取请求头
        headers = self._get_api_headers()
        
        # 频率限制
        self._rate_limit()
        
        try:
            # 如果启用反爬，使用SessionManager的session
            if self.use_anti_crawler and self.session_manager:
                session = self.session_manager.get_session()
                response = session.get(
                    self.api_config['base_url'],
                    params=params,
                    headers=headers,
                    cookies=self.api_config['cookies'],
                    timeout=30
                )
            else:
                response = requests.get(
                    self.api_config['base_url'],
                    params=params,
                    headers=headers,
                    cookies=self.api_config['cookies'],
                    timeout=30
                )
            
            response.raise_for_status()
            
            # 记录成功
            self._record_success()
            
            return response.json()
        except Exception as e:
            print(f"API请求失败: {e}")
            # 记录失败
            self._record_failure()
            return None
    
    def extract_bv_from_api(self, response_data):
        """从API响应中提取BV号
        
        Args:
            response_data: API响应数据
            
        Returns:
            list: BV号列表
        """
        bv_codes = []
        
        if not response_data:
            return bv_codes
        
        # 检查响应状态
        if response_data.get('code') != 0:
            print(f"API返回错误: {response_data.get('message')}")
            return bv_codes
        
        # 提取媒体数据
        medias = response_data.get('data', {}).get('medias', [])
        
        for media in medias:
            bvid = media.get('bvid')
            if bvid:
                bv_codes.append(bvid)
        
        return bv_codes
    
    def get_all_bv_from_api(self, media_id):
        """从API获取所有BV号
        
        Args:
            media_id: 收藏夹ID
            
        Returns:
            list: 所有BV号列表
        """
        all_bv_codes = []
        page = 1
        
        print(f"反爬机制: {'已启用' if self.use_anti_crawler else '已禁用'}")
        
        while True:
            print(f"API获取第 {page} 页数据...")
            response = self.fetch_favorites_api(media_id, page)
            
            if not response:
                break
            
            bv_codes = self.extract_bv_from_api(response)
            
            if not bv_codes:
                break
            
            all_bv_codes.extend(bv_codes)
            
            # 检查是否还有更多数据
            total = response.get('data', {}).get('info', {}).get('media_count', 0)
            if len(all_bv_codes) >= total:
                break
            
            page += 1
        
        # 打印统计信息
        if self.use_anti_crawler and self.rate_limiter:
            stats = self.rate_limiter.get_stats()
            print(f"请求统计: 成功 {stats['success_count']}, 失败 {stats['failure_count']}")
        
        # 去重
        return list(set(all_bv_codes))
    
    def _extract_media_id(self, url):
        """从收藏夹URL中提取media_id
        
        Args:
            url: 收藏夹URL
            
        Returns:
            str: media_id，如果无法提取返回None
        """
        match = re.search(r'fid=(\d+)', url)
        if match:
            return match.group(1)
        return None
    
    def _crawl_with_playwright(self, url, data_type):
        """使用原有Playwright方式爬取
        
        Args:
            url: 收藏夹URL
            data_type: 数据类型
            
        Returns:
            dict: 爬取结果
        """
        # 爬取收藏夹页面
        html = self.crawl_favorites(url)
        if not html:
            return {"success": False, "message": "爬取失败"}
        
        # 提取BV号
        bv_codes = self.extract_bv_codes(html)
        if not bv_codes:
            return {"success": False, "message": "未提取到BV号"}
        
        # 内存处理模式下直接返回结果
        return {"success": True, "count": len(bv_codes), "bv_list": bv_codes}
    
    def crawl_favorites_to_memory(self, data_type):
        """爬取收藏夹并直接返回BV号列表
        
        Args:
            data_type: 数据类型（lvjiang 或 tiantong）
            
        Returns:
            list: 提取的BV号列表
        """
        favorites_config = self.get_favorites_config()
        url = favorites_config.get(data_type)
        
        if not url:
            print(f"警告: 未找到 {data_type} 的收藏夹配置")
            return []
        
        print(f"\n=== 爬取 {data_type} 收藏夹到内存 ===")
        
        # 从URL中提取media_id
        media_id = self._extract_media_id(url)
        if not media_id:
            # 如果无法提取media_id，使用网页爬取方式
            print("无法从URL中提取media_id，使用网页爬取方式")
            # 爬取收藏夹页面
            html = self.crawl_favorites(url)
            if not html:
                print("网页爬取失败")
                return []
            
            # 提取BV号
            bv_codes = self.extract_bv_codes(html)
            if not bv_codes:
                print("未提取到BV号")
                return []
            
            print(f"成功提取 {len(bv_codes)} 个BV号")
            return bv_codes
        
        # 优先使用API方式
        try:
            print(f"使用API方式获取收藏夹数据，media_id: {media_id}")
            bv_codes = self.get_all_bv_from_api(media_id)
            
            if bv_codes:
                print(f"成功获取 {len(bv_codes)} 个BV号")
                return bv_codes
            else:
                # API方式失败，使用网页爬取方式
                print("API方式获取失败，切换到网页爬取方式")
                # 爬取收藏夹页面
                html = self.crawl_favorites(url)
                if not html:
                    print("网页爬取失败")
                    return []
                
                # 提取BV号
                bv_codes = self.extract_bv_codes(html)
                if not bv_codes:
                    print("未提取到BV号")
                    return []
                
                print(f"成功提取 {len(bv_codes)} 个BV号")
                return bv_codes
        except Exception as e:
            print(f"API方式执行失败: {e}")
            # 异常时使用网页爬取方式
            html = self.crawl_favorites(url)
            if not html:
                print("网页爬取失败")
                return []
            
            # 提取BV号
            bv_codes = self.extract_bv_codes(html)
            if not bv_codes:
                print("未提取到BV号")
                return []
            
            print(f"成功提取 {len(bv_codes)} 个BV号")
            return bv_codes

    def run_with_memory(self):
        """运行爬取任务并直接返回BV号字典
        
        Returns:
            dict: 包含各数据类型BV号列表的字典
        """
        result = {}
        favorites_config = self.get_favorites_config()
        
        for data_type, url in favorites_config.items():
            print(f"\n=== 爬取 {data_type} 收藏夹 ===")
            
            # 直接爬取到内存
            bv_codes = self.crawl_favorites_to_memory(data_type)
            
            if bv_codes:
                result[data_type] = {
                    "success": True,
                    "count": len(bv_codes),
                    "bv_list": bv_codes
                }
            else:
                result[data_type] = {
                    "success": False,
                    "message": "未提取到BV号"
                }
        
        return result

    def run(self):
        """运行爬取任务
        
        Returns:
            dict: 爬取结果
        """
        result = {}
        favorites_config = self.get_favorites_config()
        
        for data_type, url in favorites_config.items():
            print(f"\n=== 爬取 {data_type} 收藏夹 ===")
            
            # 从URL中提取media_id
            media_id = self._extract_media_id(url)
            if not media_id:
                # 如果无法提取media_id，使用原有爬取方式
                print("无法从URL中提取media_id，使用网页爬取方式")
                result[data_type] = self._crawl_with_playwright(url, data_type)
                continue
            
            # 优先使用API方式
            try:
                print(f"使用API方式获取收藏夹数据，media_id: {media_id}")
                bv_codes = self.get_all_bv_from_api(media_id)
                
                if bv_codes:
                    # 内存处理模式下直接返回结果
                    result[data_type] = {"success": True, "count": len(bv_codes), "bv_list": bv_codes}
                else:
                    # API方式失败，使用原有爬取方式
                    print("API方式获取失败，切换到网页爬取方式")
                    result[data_type] = self._crawl_with_playwright(url, data_type)
            except Exception as e:
                print(f"API方式执行失败: {e}")
                # 异常时使用原有爬取方式
                result[data_type] = self._crawl_with_playwright(url, data_type)
        
        return result

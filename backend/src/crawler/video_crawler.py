#!/usr/bin/env python3
"""
视频元数据爬虫模块
用于爬取B站视频的元数据
"""

import requests
import json
import time
import re
from bs4 import BeautifulSoup
from pathlib import Path
from datetime import datetime
from src.utils.config import REQUEST_TIMEOUT, MAX_RETRIES, INITIAL_RETRY_DELAY, HEADERS


class VideoCrawler:
    """视频爬虫类
    
    用于爬取B站视频的元数据
    """
    
    def __init__(self):
        """初始化视频爬虫"""
        self.session = requests.Session()
        self.session.headers.update(HEADERS)
        self.crawled_bvs_cache = {}  # 缓存已爬取的BV号
        # API配置
        self.api_config = {
            'base_url': 'https://api.bilibili.com/x/web-interface/wbi/view/detail',
            'headers': {
                'accept': 'application/json, text/plain, */*',
                'accept-language': 'zh-CN,zh;q=0.9',
                'origin': 'https://www.bilibili.com',
                'priority': 'u=1, i',
                'referer': 'https://www.bilibili.com/',
                'sec-ch-ua': '"Not(A:Brand";v="8", "Chromium";v="144", "Google Chrome";v="144"',
                'sec-ch-ua-mobile': '?0',
                'sec-ch-ua-platform': '"Windows"',
                'sec-fetch-dest': 'empty',
                'sec-fetch-mode': 'cors',
                'sec-fetch-site': 'same-site',
                'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36'
            },
            'cookies': {}  # 空Cookie，公开视频不需要登录
        }
        # 速率限制
        self.last_api_call_time = 0
        self.api_call_interval = 1  # API调用间隔（秒）
        # API重试配置
        self.api_max_retries = 3
        self.api_retry_delay = 2
        # 必要字段配置
        self.required_fields = ['bv', 'title', 'url', 'up主']
    
    def _extract_bv_from_item(self, item):
        """从时间线条目中提取 BV 号
        
        Args:
            item: 时间线条目
            
        Returns:
            str: BV 号，未找到返回空字符串
        """
        if not isinstance(item, dict):
            return ''
        
        import re
        bv = None
        
        # 1. 从 videoUrl 字段提取（优先级最高）
        if not bv and 'videoUrl' in item:
            url = item.get('videoUrl', '')
            match = re.search(r'(BV[0-9A-Za-z]+)', url)
            if match:
                bv = match.group(1)
        
        # 2. 从 cover 字段提取（支持带或不带 BV 前缀的格式）
        if not bv and 'cover' in item:
            cover = item.get('cover', '')
            # 检查是否带 BV 前缀
            if cover.startswith('BV'):
                bv = cover.split('.')[0]
            else:
                # 尝试从文件名中提取可能的 BV 号格式
                # 匹配类似 15NzrBBEJQ.jpg 的格式
                match = re.search(r'([0-9A-Za-z]{10,})\.[a-zA-Z]+$', cover)
                if match:
                    # 假设这是一个 BV 号（不带前缀）
                    bv = f"BV{match.group(1)}"
        
        # 3. 从嵌套的 video 对象中提取
        if not bv and 'video' in item:
            video_info = item.get('video')
            if isinstance(video_info, dict):
                bv = video_info.get('bv')
        
        # 4. 从顶级 bv 字段提取
        if not bv and 'bv' in item:
            bv = item.get('bv')
        
        return bv if bv else ''

    def is_video_crawled(self, bv_code, timeline_file):
        """检查视频是否已经被爬取
        
        Args:
            bv_code: BV号
            timeline_file: 时间线文件路径
            
        Returns:
            bool: 已爬取返回True，否则返回False
        """
        try:
            # 生成缓存键
            cache_key = str(timeline_file)
            
            # 检查缓存是否存在
            if cache_key not in self.crawled_bvs_cache:
                if not timeline_file.exists():
                    self.crawled_bvs_cache[cache_key] = set()
                else:
                    with open(timeline_file, 'r', encoding='utf-8') as f:
                        timeline_data = json.load(f)
                    
                    # 提取所有已爬取的BV号
                    crawled_bvs = set()
                    for item in timeline_data:
                        if isinstance(item, dict):
                            # 使用统一的 BV 号提取逻辑
                            existing_bv = self._extract_bv_from_item(item)
                            if existing_bv:
                                crawled_bvs.add(existing_bv)
                    
                    self.crawled_bvs_cache[cache_key] = crawled_bvs
            
            # 检查BV号是否在缓存中
            return bv_code in self.crawled_bvs_cache[cache_key]
        except Exception as e:
            print(f"检查视频是否已爬取失败: {e}")
            return False
    
    def clear_cache(self):
        """清除缓存
        
        当时间线文件可能发生变化时调用
        """
        self.crawled_bvs_cache.clear()
        print("已清除爬取状态缓存")
    
    def _rate_limit(self):
        """速率限制"""
        current_time = time.time()
        elapsed = current_time - self.last_api_call_time
        if elapsed < self.api_call_interval:
            time.sleep(self.api_call_interval - elapsed)
        self.last_api_call_time = time.time()
    
    def load_bv_list(self, file_path):
        """从文件中加载BV号列表
        
        Args:
            file_path: BV号文件路径
            
        Returns:
            list: BV号列表
        """
        bv_list = []
        
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                for line in f:
                    stripped_line = line.strip()
                    if not stripped_line or stripped_line.startswith('#'):
                        continue
                    
                    # 提取BV号
                    bv_match = re.search(r'(BV)?([0-9A-Za-z]+)', stripped_line)
                    if bv_match:
                        bv_code = bv_match.group(2)
                        if bv_code:
                            bv_list.append(bv_code)
            
            print(f"成功加载 {len(bv_list)} 个BV号")
            return bv_list
        except Exception as e:
            print(f"加载BV号文件失败: {e}")
            return []
    
    def _fetch_video_info_api(self, bv_code):
        """使用API获取视频信息
        
        Args:
            bv_code: BV号
            
        Returns:
            dict: 视频信息，失败返回None
        """
        print(f"使用API获取视频信息: BV{bv_code}")
        
        # 速率限制
        self._rate_limit()
        
        params = {
            'bvid': f"BV{bv_code}",
            'need_view': 1,
            'isGaiaAvoided': False,
            'web_location': 1315873
        }
        
        for retry in range(self.api_max_retries):
            try:
                response = requests.get(
                    self.api_config['base_url'],
                    params=params,
                    headers=self.api_config['headers'],
                    cookies=self.api_config['cookies'],
                    timeout=REQUEST_TIMEOUT
                )
                
                response.raise_for_status()
                data = response.json()
                
                if data.get('code') != 0:
                    print(f"API返回错误: {data.get('message')}")
                    if retry < self.api_max_retries - 1:
                        print(f"{self.api_retry_delay}秒后重试")
                        time.sleep(self.api_retry_delay)
                        continue
                    return None
                
                # 解析API返回数据
                return self._parse_api_response(data, bv_code)
            except requests.exceptions.Timeout:
                print(f"API请求超时，{self.api_retry_delay}秒后重试")
                time.sleep(self.api_retry_delay)
            except requests.exceptions.HTTPError as e:
                print(f"API HTTP错误: {e}")
                if retry < self.api_max_retries - 1:
                    print(f"{self.api_retry_delay}秒后重试")
                    time.sleep(self.api_retry_delay)
                else:
                    return None
            except Exception as e:
                print(f"API调用错误: {e}")
                if retry < self.api_max_retries - 1:
                    print(f"{self.api_retry_delay}秒后重试")
                    time.sleep(self.api_retry_delay)
                else:
                    return None
        
        return None
    
    def _parse_api_response(self, response_data, bv_code):
        """解析API响应数据
        
        Args:
            response_data: API响应数据
            bv_code: BV号
            
        Returns:
            dict: 视频元数据
        """
        data = response_data.get('data', {})
        view_detail = data.get('View', {})
        
        # 提取视频信息
        metadata = {
            "bv": bv_code,
            "url": f"https://www.bilibili.com/video/BV{bv_code}",
            "title": view_detail.get('title', ""),  # 未找到标题时保存空字符串
            "description": view_detail.get('desc', ""),
            "publish_date": view_detail.get('pubdate', datetime.now().strftime("%Y-%m-%d")),
            "views": view_detail.get('stat', {}).get('view', 0),
            "danmaku": view_detail.get('stat', {}).get('danmaku', 0),
            "up主": view_detail.get('owner', {}).get('name', ""),
            "cover_url": view_detail.get('pic', ""),
            "thumbnail": view_detail.get('pic', ""),
            "duration": view_detail.get('duration', 0),
            "crawled_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        }
        
        # 处理发布时间
        if isinstance(metadata['publish_date'], int):
            try:
                metadata['publish_date'] = datetime.fromtimestamp(metadata['publish_date']).strftime("%Y-%m-%d")
            except:
                metadata['publish_date'] = datetime.now().strftime("%Y-%m-%d")
        
        # 处理视频时长
        if isinstance(metadata['duration'], int):
            seconds = metadata['duration']
            hours = seconds // 3600
            minutes = (seconds % 3600) // 60
            seconds = seconds % 60
            if hours > 0:
                metadata['duration'] = f"{hours:02d}:{minutes:02d}:{seconds:02d}"
            else:
                metadata['duration'] = f"{minutes:02d}:{seconds:02d}"
        
        return metadata
    
    def _validate_metadata(self, metadata, bv_code, source):
        """校验元信息
        
        Args:
            metadata: 视频元数据
            bv_code: BV号
            source: 数据来源（API或Crawl）
        """
        if not metadata:
            return
        
        print(f"\n--- 校验 {source} 方式获取的元信息 ---")
        
        # 检查必要字段
        missing_fields = []
        for field in self.required_fields:
            if not metadata.get(field):
                missing_fields.append(field)
        
        if missing_fields:
            print(f"警告: BV{bv_code} 缺少必要字段: {', '.join(missing_fields)}")
        else:
            print(f"BV{bv_code} 元信息完整")
        
        # 检查其他重要字段
        important_fields = ['description', 'publish_date', 'views', 'cover_url', 'duration']
        for field in important_fields:
            if not metadata.get(field):
                print(f"警告: BV{bv_code} 缺少字段 '{field}'")
    
    def crawl_video_metadata(self, bv_code):
        """爬取视频元数据（优化版）
        
        Args:
            bv_code: BV号
            
        Returns:
            dict: 视频元数据
        """
        print(f"获取视频元数据: BV{bv_code}")
        
        # 1. 优先使用API方式
        try:
            metadata = self._fetch_video_info_api(bv_code)
            if metadata:
                print("API获取成功")
                # 校验元信息
                self._validate_metadata(metadata, bv_code, 'API')
                return metadata
        except Exception as e:
            print(f"API方式执行失败: {e}")
        
        # 2. API失败，使用原有爬取方式
        print("API获取失败，切换到网页爬取方式")
        metadata = self._crawl_with_playwright(bv_code)
        if metadata:
            # 校验元信息
            self._validate_metadata(metadata, bv_code, 'Crawl')
        return metadata
    
    def _crawl_with_playwright(self, bv_code):
        """使用原有爬取方式
        
        Args:
            bv_code: BV号
            
        Returns:
            dict: 视频元数据
        """
        video_url = f"https://www.bilibili.com/video/BV{bv_code}"
        
        for retry in range(MAX_RETRIES):
            try:
                response = self.session.get(video_url, timeout=REQUEST_TIMEOUT)
                response.raise_for_status()
                response.encoding = response.apparent_encoding
                
                # 解析视频页面
                metadata = self._parse_video_page(response.text, bv_code)
                return metadata
            except requests.exceptions.Timeout:
                print(f"请求超时，{INITIAL_RETRY_DELAY}秒后重试")
                time.sleep(INITIAL_RETRY_DELAY)
            except requests.exceptions.HTTPError as e:
                print(f"HTTP错误: {e}")
                if retry < MAX_RETRIES - 1:
                    print(f"{INITIAL_RETRY_DELAY}秒后重试")
                    time.sleep(INITIAL_RETRY_DELAY)
                else:
                    print("达到最大重试次数，放弃爬取")
            except Exception as e:
                print(f"爬取错误: {e}")
                if retry < MAX_RETRIES - 1:
                    print(f"{INITIAL_RETRY_DELAY}秒后重试")
                    time.sleep(INITIAL_RETRY_DELAY)
                else:
                    print("达到最大重试次数，放弃爬取")
        
        return None
    
    def _parse_video_page(self, html, bv_code):
        """解析视频页面
        
        Args:
            html: 页面HTML内容
            bv_code: BV号
            
        Returns:
            dict: 视频元数据
        """
        soup = BeautifulSoup(html, 'html.parser')
        
        # 提取标题
        title = self._extract_title(soup, html)
        
        # 提取描述
        description = self._extract_description(soup, html)
        
        # 提取发布时间
        publish_date = self._extract_publish_date(soup, html)
        
        # 提取统计信息
        stats = self._extract_stats(soup, html)
        
        # 提取UP主信息
        up_info = self._extract_up_info(soup, html)
        
        # 提取缩略图
        thumbnail = self._extract_thumbnail(soup, html, bv_code)
        
        # 提取视频时长
        duration = self._extract_duration(html)
        
        # 构建元数据
        metadata = {
            "bv": bv_code,
            "url": f"https://www.bilibili.com/video/BV{bv_code}",
            "title": title,
            "description": description,
            "publish_date": publish_date,
            "views": stats.get('views', 0),
            "danmaku": stats.get('danmaku', 0),
            "up主": up_info.get('name', ''),
            "cover_url": thumbnail,
            "thumbnail": thumbnail,
            "duration": duration,
            "crawled_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        }
        
        return metadata
    
    def _extract_title(self, soup, html):
        """提取视频标题"""
        # 方法1: 从<h1>标签提取
        h1_title = soup.find('h1', class_='video-title')
        if h1_title:
            return h1_title.get_text(strip=True)
        
        # 方法2: 从<title>标签提取
        title_tag = soup.find('title')
        if title_tag:
            title = title_tag.get_text(strip=True)
            title = re.sub(r'_哔哩哔哩_bilibili$', '', title)
            return title
        
        # 方法3: 从JavaScript变量提取
        title_match = re.search(r'"title"*:*"([^"\\]+)"', html)
        if title_match:
            return title_match.group(1)
        
        return ""  # 未找到标题时返回空字符串
    
    def _extract_description(self, soup, html):
        """提取视频描述"""
        # 方法1: 从描述标签提取
        desc_tag = soup.find('div', class_='video-desc')
        if desc_tag:
            return desc_tag.get_text(strip=True)
        
        # 方法2: 从JavaScript变量提取
        desc_match = re.search(r'"desc"*:*"([^"\\]+)"', html)
        if desc_match:
            return desc_match.group(1)
        
        return ""
    
    def _extract_publish_date(self, soup, html):
        """提取发布时间"""
        # 方法1: 从页面元素提取
        date_tags = soup.find_all(['span', 'div'], class_=re.compile(r'date|time'))
        for tag in date_tags:
            text = tag.get_text(strip=True)
            if re.search(r'\d{4}-\d{2}-\d{2}', text):
                return text
            elif re.search(r'\d{4}年\d{1,2}月\d{1,2}日', text):
                return text
        
        # 方法2: 从JavaScript变量提取
        date_match = re.search(r'"pubdate"*:*"([^"\\]+)"', html)
        if date_match:
            return date_match.group(1)
        
        return datetime.now().strftime("%Y-%m-%d")
    
    def _extract_stats(self, soup, html):
        """提取统计信息"""
        stats = {'views': 0, 'danmaku': 0}
        
        # 从JavaScript变量提取
        view_match = re.search(r'"view"*:*"?([0-9,]+)"?', html)
        if view_match:
            views = view_match.group(1).replace(',', '')
            if views.isdigit():
                stats['views'] = int(views)
        
        danmaku_match = re.search(r'"danmaku"*:*"?([0-9,]+)"?', html)
        if danmaku_match:
            danmaku = danmaku_match.group(1).replace(',', '')
            if danmaku.isdigit():
                stats['danmaku'] = int(danmaku)
        
        return stats
    
    def _extract_up_info(self, soup, html):
        """提取UP主信息"""
        up_info = {}
        
        # 从页面元素提取
        up_tags = soup.find_all(['a', 'span'], class_=re.compile(r'up|owner|author'))
        for tag in up_tags:
            text = tag.get_text(strip=True)
            if text and 'UP' not in text:
                up_info['name'] = text
                break
        
        # 从JavaScript变量提取
        if not up_info:
            up_match = re.search(r'"owner"*:\s*\{[^\}]*"name"*:\s*"([^"\\]+)"', html)
            if up_match:
                up_info['name'] = up_match.group(1)
        
        return up_info
    
    def _extract_thumbnail(self, soup, html, bv_code):
        """提取视频缩略图"""
        # 从<meta>标签提取
        og_image = soup.find('meta', property='og:image')
        if og_image and og_image.get('content'):
            thumbnail_url = og_image.get('content')
            # 添加协议前缀（如果缺少）
            if thumbnail_url.startswith('//'):
                thumbnail_url = 'https:' + thumbnail_url
            # 去掉尺寸参数，获取原始封面图
            if '@' in thumbnail_url:
                thumbnail_url = thumbnail_url.split('@')[0]
            return thumbnail_url
        
        # 从Twitter标签提取
        twitter_image = soup.find('meta', name='twitter:image')
        if twitter_image and twitter_image.get('content'):
            thumbnail_url = twitter_image.get('content')
            # 添加协议前缀（如果缺少）
            if thumbnail_url.startswith('//'):
                thumbnail_url = 'https:' + thumbnail_url
            # 去掉尺寸参数，获取原始封面图
            if '@' in thumbnail_url:
                thumbnail_url = thumbnail_url.split('@')[0]
            return thumbnail_url
        
        # 构建默认封面图URL
        return f"https://i0.hdslb.com/bfs/archive/{bv_code}.jpg"
    
    def _extract_duration(self, html):
        """提取视频时长"""
        # 从页面源码中提取时长
        duration_match = re.search(r'"duration"\s*:\s*(\d+)', html)
        if duration_match:
            # 转换秒数为 HH:MM:SS 格式
            seconds = int(duration_match.group(1))
            hours = seconds // 3600
            minutes = (seconds % 3600) // 60
            seconds = seconds % 60
            if hours > 0:
                return f"{hours:02d}:{minutes:02d}:{seconds:02d}"
            else:
                return f"{minutes:02d}:{seconds:02d}"
        
        # 从视频播放器中提取
        player_duration_match = re.search(r'"duration"\s*:\s*"([\d:]+)"', html)
        if player_duration_match:
            return player_duration_match.group(1)
        
        return "00:00"

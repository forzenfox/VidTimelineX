#!/usr/bin/env python3
"""
自动化爬取脚本
用于定时从B站根据关键词搜索视频，爬取视频信息，存储到JSON文件
"""

import requests
import json
import time
import os
import re
from bs4 import BeautifulSoup
from pathlib import Path
from datetime import datetime

# 导入配置文件
from src.utils.config import (
    DATA_DIR, PENDING_FILE, APPROVED_FILE, REJECTED_FILE,
    REQUEST_TIMEOUT, MAX_RETRIES, INITIAL_RETRY_DELAY, REQUEST_INTERVAL,
    HEADERS, TIMELINE_OUTPUT_FILE, BV_FILE_PATH
)

# 导入封面下载模块
from src.downloader.download_thumbs import download_all_covers

class BiliBiliAutoCrawler:
    def __init__(self):
        self.headers = HEADERS
        self.session = requests.Session()
        self.session.headers.update(self.headers)
        
        # 数据存储路径
        self.data_dir = DATA_DIR
        self.data_dir.mkdir(exist_ok=True)
        self.pending_file = PENDING_FILE
        self.approved_file = APPROVED_FILE
        self.rejected_file = REJECTED_FILE
        
        # 初始化存储文件
        self._init_storage_files()
    
    def _init_storage_files(self):
        """初始化存储文件"""
        for file_path in [self.pending_file, self.approved_file, self.rejected_file]:
            if not file_path.exists():
                with open(file_path, 'w', encoding='utf-8') as f:
                    json.dump({"videos": []}, f, ensure_ascii=False, indent=2)
    
    def search_videos(self, keyword, page=1, order='totalrank'):
        """搜索视频"""
        print(f"搜索视频: {keyword}, 页码: {page}, 排序: {order}")
        
        search_url = "https://search.bilibili.com/video"
        
        params = {
            'keyword': keyword,
            'order': order,  # totalrank: 综合, click: 播放量, pubdate: 最新, stow: 收藏
            'page': page,
            'page_size': 20,
            'tids_1': '',  # 分区ID
            'tids_2': '',  # 子分区ID
            'duration': 0,  # 视频时长: 0-全部, 1-0-10分钟, 2-10-30分钟, 3-30分钟以上
            'ftime': 0,  # 时间范围: 0-全部, 1-一天, 7-一周, 30-一月, 365-一年
            'highlight': 1,
            'single_column': 0
        }
        
        try:
            response = self.session.get(search_url, params=params, timeout=15)
            response.raise_for_status()
            
            # 提取BV号
            bv_codes = self._extract_bv_codes(response.text)
            print(f"找到 {len(bv_codes)} 个视频")
            
            return bv_codes
            
        except Exception as e:
            print(f"搜索错误: {e}")
            return []
    
    def _extract_bv_codes(self, html):
        """从HTML中提取BV号"""
        bv_pattern = r'BV([0-9A-Za-z]+)'
        bv_codes = re.findall(bv_pattern, html)
        
        # 去重并返回前20个结果
        unique_bv_codes = list(set(bv_codes))[:20]
        return unique_bv_codes
    
    def crawl_video_metadata(self, bv_code):
        """爬取视频元数据，添加超时和重试机制
        
        Args:
            bv_code (str): 视频BV号
            
        Returns:
            dict or None: 视频元数据或None（如果爬取失败）
        """
        print(f"爬取视频元数据: BV{bv_code}")
        
        video_url = f"https://www.bilibili.com/video/BV{bv_code}"
        
        for retry in range(MAX_RETRIES):
            try:
                print(f"  尝试 {retry + 1}/{MAX_RETRIES}")
                response = self.session.get(video_url, timeout=REQUEST_TIMEOUT)
                response.raise_for_status()
                
                # 解析视频页面
                metadata = self._parse_video_page(response.text, bv_code)
                return metadata
                
            except requests.exceptions.Timeout:
                print(f"  请求超时，{INITIAL_RETRY_DELAY}秒后重试")
                time.sleep(INITIAL_RETRY_DELAY)
            except requests.exceptions.HTTPError as e:
                print(f"  HTTP错误: {e}")
                if retry < MAX_RETRIES - 1:
                    print(f"  {INITIAL_RETRY_DELAY}秒后重试")
                    time.sleep(INITIAL_RETRY_DELAY)
                else:
                    print(f"  达到最大重试次数，放弃爬取")
            except Exception as e:
                print(f"  爬取错误: {e}")
                if retry < MAX_RETRIES - 1:
                    print(f"  {INITIAL_RETRY_DELAY}秒后重试")
                    time.sleep(INITIAL_RETRY_DELAY)
                else:
                    print(f"  达到最大重试次数，放弃爬取")
        
        return None
    
    def _parse_video_page(self, html, bv_code):
        """解析视频页面，提取元数据"""
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
            "cover_url": thumbnail,  # B站CDN封面图URL（前端优先加载）
            "thumbnail": thumbnail,   # 封面图URL（本地下载路径或CDN URL）
            "duration": duration,
            "crawled_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "review_status": "pending",
            "review_note": ""
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
        
        return "未找到标题"
    
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
        """提取视频封面图"""
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
        
        # 从页面源码中提取图片哈希值
        # B站缩略图格式: //i0.hdslb.com/bfs/archive/{hash}.jpg@100w_100h_1c.png
        thumbnail_pattern = r'//i\d+\.hdslb\.com/bfs/archive/([a-f0-9]+\.(?:jpg|png))@\d+w_\d+h_\d+c\.(?:jpg|png)'
        thumbnail_match = re.search(thumbnail_pattern, html)
        if thumbnail_match:
            thumbnail_hash = thumbnail_match.group(1)
            return f"https://i0.hdslb.com/bfs/archive/{thumbnail_hash}"
        
        # 构建默认封面图URL（使用哈希值格式，不带尺寸参数）
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
        
        # 从页面元素中提取
        duration_element_match = re.search(r'<span\s+class="duration">([\d:]+)</span>', html)
        if duration_element_match:
            return duration_element_match.group(1)
        
        return "00:00"
    
    def save_to_pending(self, metadata):
        """保存到待审核列表"""
        # 加载现有数据
        with open(self.pending_file, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        # 检查是否已存在
        existing_bvs = [video['bv'] for video in data['videos']]
        if metadata['bv'] in existing_bvs:
            print(f"视频 BV{metadata['bv']} 已存在，跳过")
            return False
        
        # 添加新视频
        data['videos'].append(metadata)
        
        # 保存数据
        with open(self.pending_file, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        
        print(f"视频 BV{metadata['bv']} 已保存到待审核列表")
        return True
    
    def save_to_approved(self, metadata):
        """直接保存到已通过列表
        
        Args:
            metadata (dict): 视频元数据
            
        Returns:
            bool: 保存成功返回True，否则返回False
        """
        # 加载现有数据
        with open(self.approved_file, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        # 检查是否已存在
        existing_bvs = [video['bv'] for video in data['videos']]
        if metadata['bv'] in existing_bvs:
            print(f"视频 BV{metadata['bv']} 已存在，跳过")
            return False
        
        # 添加新视频
        data['videos'].append(metadata)
        
        # 保存数据
        with open(self.approved_file, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        
        print(f"视频 BV{metadata['bv']} 已保存到已通过列表")
        return True
    
    def run_crawl(self, keywords, max_pages=1):
        """运行爬取任务"""
        print(f"开始爬取任务，关键词: {keywords}")
        
        total_crawled = 0
        total_saved = 0
        
        for keyword in keywords:
            print(f"\n=== 处理关键词: {keyword} ===")
            
            for page in range(1, max_pages + 1):
                # 搜索视频
                bv_codes = self.search_videos(keyword, page=page, order='pubdate')
                
                for bv_code in bv_codes:
                    # 爬取视频元数据
                    metadata = self.crawl_video_metadata(bv_code)
                    
                    if metadata:
                        total_crawled += 1
                        
                        # 保存到待审核列表
                        if self.save_to_pending(metadata):
                            total_saved += 1
                        
                        # 遵守请求频率限制
                        time.sleep(2)
        
        print(f"\n爬取任务完成")
        print(f"总共爬取: {total_crawled} 个视频")
        print(f"新保存: {total_saved} 个视频")
        
        return total_saved
    
    def run_crawl_from_file(self, file_path):
        """从文件中读取BV号列表并爬取对应视频的元数据
        
        Args:
            file_path (str): BV号文件路径
            
        Returns:
            int: 新保存的视频数量
        """
        print(f"\n=== 从文件爬取视频元数据: {file_path} ===")
        
        # 读取BV号列表
        bv_list = self.load_bv_list(file_path)
        
        if not bv_list:
            print("没有有效的BV号，爬取任务终止")
            return 0
        
        total_crawled = 0
        total_saved = 0
        
        for bv_code in bv_list:
            print(f"\n--- 处理BV号: {bv_code} ---")
            
            # 爬取视频元数据
            metadata = self.crawl_video_metadata(bv_code)
            
            if metadata:
                total_crawled += 1
                
                # 直接保存到已通过列表
                if self.save_to_approved(metadata):
                    total_saved += 1
                
                # 遵守请求频率限制
                time.sleep(2)
        
        print(f"\n=== 从文件爬取任务完成 ===")
        print(f"总共爬取: {total_crawled} 个视频")
        print(f"新保存: {total_saved} 个视频")
        
        return total_saved
    
    def load_bv_list(self, file_path):
        """从文件中读取BV号列表
        
        Args:
            file_path (str): BV号文件路径
            
        Returns:
            list: 处理后的BV号列表，去除了注释和空行，确保格式正确
        """
        print(f"从文件中读取BV号列表: {file_path}")
        
        bv_list = []
        
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                for line in f:
                    # 去除行首尾空格
                    stripped_line = line.strip()
                    
                    # 跳过空行和注释行（以#开头）
                    if not stripped_line or stripped_line.startswith('#'):
                        continue
                    
                    # 提取BV号
                    # 匹配完整的BV号格式，支持带或不带BV前缀
                    bv_match = re.search(r'(BV)?([0-9A-Za-z]+)', stripped_line)
                    if bv_match:
                        bv_code = bv_match.group(2)
                        # 确保BV号格式正确
                        if len(bv_code) > 0:
                            bv_list.append(bv_code)
            
            print(f"读取到 {len(bv_list)} 个有效的BV号")
            return bv_list
            
        except Exception as e:
            print(f"读取BV号文件失败: {e}")
            return []
    
    def generate_timeline(self, download_covers: bool = True):
        """生成时间线数据
        
        Args:
            download_covers: 是否下载视频封面到前端目录，默认True
            
        Returns:
            int: 时间线包含的视频数量
        """
        print("生成时间线数据...")
        
        # 加载已通过的视频数据
        with open(self.approved_file, 'r', encoding='utf-8') as f:
            approved_data = json.load(f)
        
        videos = approved_data.get('videos', [])
        
        # 按照发布日期排序（降序）
        videos.sort(key=lambda x: x.get('publish_date', ''), reverse=True)
        
        # 生成与前端videos.json相同格式的数据
        timeline_data = []
        for idx, video in enumerate(videos):
            # 修复BV前缀重复问题
            bv_code = video.get('bv', '')
            if bv_code.startswith('BV'):
                bvid = bv_code
            else:
                bvid = f"BV{bv_code}"
            
            # 统一日期格式为YYYY-MM-DD
            publish_date = video.get('publish_date', '')
            if len(publish_date) > 10:
                date = publish_date[:10]
            else:
                date = publish_date
            
            timeline_item = {
                "id": str(idx + 1),  # 按时间倒序排列的字符串序号
                "title": video.get('title'),
                "date": date,
                "videoUrl": f"https://www.bilibili.com/video/{bvid}",
                "cover": video.get('cover', f"{bvid}.jpg"),  # 封面文件名（本地缓存），从cover_url推断扩展名
                "cover_url": video.get('cover_url'),  # B站CDN封面图URL（前端优先加载）
                "tags": [],  # 初始为空列表，供人工填写
                "duration": video.get('duration', "00:00")  # 视频时长
            }
            timeline_data.append(timeline_item)
        
        # 保存到时间线数据目录
        TIMELINE_OUTPUT_FILE.parent.mkdir(parents=True, exist_ok=True)
        
        with open(TIMELINE_OUTPUT_FILE, 'w', encoding='utf-8') as f:
            json.dump(timeline_data, f, ensure_ascii=False, indent=2)
        
        print(f"生成了时间线数据，保存到: {TIMELINE_OUTPUT_FILE}")
        print(f"时间线包含 {len(timeline_data)} 个视频")
        
        # 下载视频封面到前端目录
        if download_covers:
            print("\n开始下载视频封面...")
            
            # 计算前端thumbs目录路径
            backend_dir = Path(__file__).parent.parent.parent.parent
            frontend_public = backend_dir / "frontend" / "public"
            thumbs_dir = frontend_public / "thumbs"
            
            # 调用封面下载函数
            results = download_all_covers(TIMELINE_OUTPUT_FILE, thumbs_dir, quiet=False)
            
            print(f"封面下载完成: 成功 {results['success']}, 失败 {results['failed']}, 跳过 {results['skipped']}")
        
        return len(timeline_data)

def main():
    """主函数，支持从文件爬取和关键词爬取
    
    支持两种模式：
    1. 从文件爬取：读取指定路径的BV号文件，爬取对应视频元数据
    2. 关键词爬取：根据关键词搜索视频并爬取元数据
    """
    import argparse
    
    parser = argparse.ArgumentParser(description='B站视频爬虫工具')
    parser.add_argument('--mode', type=str, default='file', choices=['file', 'keyword'],
                        help='爬取模式：file（从文件读取BV号）或keyword（关键词搜索）')
    parser.add_argument('--bv-file', type=str, 
                        default=str(BV_FILE_PATH),
                        help='BV号文件路径')
    parser.add_argument('--keywords', type=str, nargs='+',
                        default=['原神', '崩坏星穹铁道', '塞尔达传说'],
                        help='搜索关键词列表')
    parser.add_argument('--max-pages', type=int, default=1,
                        help='关键词搜索的最大页码')
    parser.add_argument('--no-download-covers', action='store_true',
                        help='不下载视频封面图片')
    
    args = parser.parse_args()
    
    # 控制是否下载封面
    download_covers = not args.no_download_covers
    
    crawler = BiliBiliAutoCrawler()
    
    print("=== B站视频爬虫工具 ===")
    print(f"爬取模式: {args.mode}")
    print(f"下载封面: {'是' if download_covers else '否'}")
    
    if args.mode == 'file':
        print(f"BV号文件: {args.bv_file}")
        crawler.run_crawl_from_file(args.bv_file)
    else:
        print(f"关键词: {args.keywords}")
        print(f"最大页码: {args.max_pages}")
        crawler.run_crawl(args.keywords, max_pages=args.max_pages)
    
    # 生成时间线数据
    print("\n=== 生成时间线数据 ===")
    crawler.generate_timeline(download_covers=download_covers)
    
    print("\n=== 任务完成 ===")

if __name__ == "__main__":
    main()

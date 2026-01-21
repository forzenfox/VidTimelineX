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

class BiliBiliAutoCrawler:
    def __init__(self):
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
            'Referer': 'https://www.bilibili.com/',
            'Connection': 'keep-alive'
        }
        self.session = requests.Session()
        self.session.headers.update(self.headers)
        
        # 数据存储路径
        self.data_dir = Path('data')
        self.data_dir.mkdir(exist_ok=True)
        self.pending_file = self.data_dir / 'pending.json'
        self.approved_file = self.data_dir / 'approved.json'
        self.rejected_file = self.data_dir / 'rejected.json'
        
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
        """爬取视频元数据"""
        print(f"爬取视频元数据: BV{bv_code}")
        
        video_url = f"https://www.bilibili.com/video/BV{bv_code}"
        
        try:
            response = self.session.get(video_url, timeout=15)
            response.raise_for_status()
            
            # 解析视频页面
            metadata = self._parse_video_page(response.text, bv_code)
            return metadata
            
        except Exception as e:
            print(f"爬取错误: {e}")
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
            "thumbnail": thumbnail,
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
        """提取缩略图"""
        # 从<meta>标签提取
        og_image = soup.find('meta', property='og:image')
        if og_image and og_image.get('content'):
            return og_image.get('content')
        
        # 从Twitter标签提取
        twitter_image = soup.find('meta', name='twitter:image')
        if twitter_image and twitter_image.get('content'):
            return twitter_image.get('content')
        
        # 构建默认缩略图URL
        return f"https://i0.hdslb.com/bfs/archive/{bv_code}.jpg"
    
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
    
    def generate_timeline(self):
        """生成时间线数据"""
        print("生成时间线数据...")
        
        # 加载已通过的视频数据
        with open(self.approved_file, 'r', encoding='utf-8') as f:
            approved_data = json.load(f)
        
        videos = approved_data.get('videos', [])
        
        # 按照发布日期排序（降序）
        videos.sort(key=lambda x: x.get('publish_date', ''), reverse=True)
        
        # 生成timeline数据
        timeline_data = []
        for video in videos:
            timeline_item = {
                "id": len(timeline_data) + 1,
                "date": video.get('publish_date'),
                "title": video.get('title'),
                "content": video.get('description', ''),
                "video": {
                    "bv": video.get('bv'),
                    "url": video.get('url')
                },
                "thumbnail": video.get('thumbnail'),
                "views": video.get('views'),
                "danmaku": video.get('danmaku'),
                "up主": video.get('up主')
            }
            timeline_data.append(timeline_item)
        
        # 保存到前端目录
        timeline_path = Path('../frontend/public/timeline.json')
        timeline_path.parent.mkdir(exist_ok=True)
        
        with open(timeline_path, 'w', encoding='utf-8') as f:
            json.dump(timeline_data, f, ensure_ascii=False, indent=2)
        
        print(f"生成了时间线数据，保存到: {timeline_path}")
        print(f"时间线包含 {len(timeline_data)} 个视频")
        
        return len(timeline_data)

def main():
    """主函数"""
    crawler = BiliBiliAutoCrawler()
    
    # 配置关键词
    keywords = ["原神", "崩坏星穹铁道", "塞尔达传说"]
    
    # 运行爬取任务
    crawler.run_crawl(keywords, max_pages=1)
    
    # 生成时间线数据
    crawler.generate_timeline()
    
    print("\n自动化爬取任务完成!")

if __name__ == "__main__":
    main()

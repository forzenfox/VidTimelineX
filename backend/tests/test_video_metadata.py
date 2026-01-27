#!/usr/bin/env python3
"""
B站视频元数据爬取测试脚本
用于分析B站视频页面的结构，提取元数据信息
"""

import requests
import json
import re
from bs4 import BeautifulSoup

class BiliBiliVideoTester:
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
    
    def test_video_page(self, bv_code):
        """测试视频页面"""
        print(f"测试视频: BV{bv_code}")
        
        # 构建视频URL
        video_url = f"https://www.bilibili.com/video/BV{bv_code}"
        
        try:
            response = self.session.get(video_url, timeout=15)
            response.raise_for_status()
            
            print(f"状态码: {response.status_code}")
            print(f"URL: {response.url}")
            print(f"响应长度: {len(response.text)} 字符")
            
            # 分析视频页面
            self.analyze_video_page(response.text, bv_code)
            
            return True
            
        except Exception as e:
            print(f"错误: {e}")
            return False
    
    def analyze_video_page(self, html, bv_code):
        """分析视频页面"""
        print("\n分析视频页面...")
        
        # 使用BeautifulSoup解析
        soup = BeautifulSoup(html, 'html.parser')
        
        # 1. 提取标题
        title = self.extract_title(soup, html)
        print(f"标题: {title}")
        
        # 2. 提取描述
        description = self.extract_description(soup, html)
        print(f"描述: {description[:100]}..." if description else "描述: 未找到")
        
        # 3. 提取发布时间
        publish_date = self.extract_publish_date(soup, html)
        print(f"发布时间: {publish_date}")
        
        # 4. 提取统计信息
        stats = self.extract_stats(soup, html)
        print(f"统计信息: {stats}")
        
        # 5. 提取UP主信息
        up_info = self.extract_up_info(soup, html)
        print(f"UP主信息: {up_info}")
        
        # 6. 提取缩略图
        thumbnail = self.extract_thumbnail(soup, html, bv_code)
        print(f"缩略图: {thumbnail}")
        
        # 7. 提取JSON-LD数据
        json_ld = self.extract_json_ld(soup)
        if json_ld:
            print("✓ 找到JSON-LD数据")
        else:
            print("✗ 未找到JSON-LD数据")
    
    def extract_title(self, soup, html):
        """提取视频标题"""
        # 方法1: 从<h1>标签提取
        h1_title = soup.find('h1', class_='video-title')
        if h1_title:
            return h1_title.get_text(strip=True)
        
        # 方法2: 从<title>标签提取
        title_tag = soup.find('title')
        if title_tag:
            title = title_tag.get_text(strip=True)
            # 移除B站后缀
            title = re.sub(r'_哔哩哔哩_bilibili$', '', title)
            return title
        
        # 方法3: 从JSON-LD提取
        json_ld = self.extract_json_ld(soup)
        if json_ld and 'name' in json_ld:
            return json_ld['name']
        
        # 方法4: 从JavaScript变量提取
        title_match = re.search(r'"title"*:*"([^"]+)"', html)
        if title_match:
            return title_match.group(1)
        
        return "未找到标题"
    
    def extract_description(self, soup, html):
        """提取视频描述"""
        # 方法1: 从描述标签提取
        desc_tag = soup.find('div', class_='video-desc')
        if desc_tag:
            return desc_tag.get_text(strip=True)
        
        # 方法2: 从JSON-LD提取
        json_ld = self.extract_json_ld(soup)
        if json_ld and 'description' in json_ld:
            return json_ld['description']
        
        # 方法3: 从JavaScript变量提取
        desc_match = re.search(r'"desc"*:*"([^"]+)"', html)
        if desc_match:
            return desc_match.group(1)
        
        return ""
    
    def extract_publish_date(self, soup, html):
        """提取发布时间"""
        # 方法1: 从JSON-LD提取
        json_ld = self.extract_json_ld(soup)
        if json_ld and 'uploadDate' in json_ld:
            return json_ld['uploadDate']
        
        # 方法2: 从页面元素提取
        date_tags = soup.find_all(['span', 'div'], class_=re.compile(r'date|time'))
        for tag in date_tags:
            text = tag.get_text(strip=True)
            if re.search(r'\d{4}-\d{2}-\d{2}', text):
                return text
            elif re.search(r'\d{4}年\d{1,2}月\d{1,2}日', text):
                return text
        
        # 方法3: 从JavaScript变量提取
        date_match = re.search(r'"pubdate"*:*"([^"]+)"', html)
        if date_match:
            return date_match.group(1)
        
        return "未找到发布时间"
    
    def extract_stats(self, soup, html):
        """提取统计信息"""
        stats = {}
        
        # 方法1: 从页面元素提取
        stat_tags = soup.find_all(['span', 'div'], class_=re.compile(r'view|play|danmaku|like|coin|collect|share'))
        for tag in stat_tags:
            text = tag.get_text(strip=True)
            if '播放' in text:
                stats['播放量'] = text
            elif '弹幕' in text:
                stats['弹幕数'] = text
            elif '点赞' in text:
                stats['点赞数'] = text
            elif '投币' in text:
                stats['投币数'] = text
            elif '收藏' in text:
                stats['收藏数'] = text
            elif '分享' in text:
                stats['分享数'] = text
        
        # 方法2: 从JavaScript变量提取
        if not stats:
            view_match = re.search(r'"view"*:*"([^"]+)"', html)
            if view_match:
                stats['播放量'] = view_match.group(1)
            
            danmaku_match = re.search(r'"danmaku"*:*"([^"]+)"', html)
            if danmaku_match:
                stats['弹幕数'] = danmaku_match.group(1)
        
        return stats or "未找到统计信息"
    
    def extract_up_info(self, soup, html):
        """提取UP主信息"""
        up_info = {}
        
        # 方法1: 从页面元素提取
        up_tags = soup.find_all(['a', 'span'], class_=re.compile(r'up|owner|author'))
        for tag in up_tags:
            text = tag.get_text(strip=True)
            if text and 'UP' not in text:
                up_info['name'] = text
                break
        
        # 方法2: 从JavaScript变量提取
        if not up_info:
            up_match = re.search(r'"owner"*:\s*\{[^\}]*"name"*:\s*"([^"]+)"', html)
            if up_match:
                up_info['name'] = up_match.group(1)
        
        return up_info or "未找到UP主信息"
    
    def extract_thumbnail(self, soup, html, bv_code):
        """提取缩略图"""
        # 方法1: 从<meta>标签提取
        og_image = soup.find('meta', property='og:image')
        if og_image and og_image.get('content'):
            return og_image.get('content')
        
        # 方法2: 从Twitter标签提取
        twitter_image = soup.find('meta', name='twitter:image')
        if twitter_image and twitter_image.get('content'):
            return twitter_image.get('content')
        
        # 方法3: 构建默认缩略图URL
        return f"https://i0.hdslb.com/bfs/archive/{bv_code}.jpg"
    
    def extract_json_ld(self, soup):
        """提取JSON-LD数据"""
        script_tags = soup.find_all('script', type='application/ld+json')
        for script in script_tags:
            try:
                json_data = json.loads(script.string)
                if isinstance(json_data, list):
                    for item in json_data:
                        if item.get('@type') == 'VideoObject':
                            return item
                elif json_data.get('@type') == 'VideoObject':
                    return json_data
            except:
                pass
        return None
    
    def test_multiple_videos(self):
        """测试多个视频"""
        # 测试BV号列表
        test_bvs = ['1ZHiyBkExG', '16SveBSEyi', '1rbi8BrE7p']
        
        for bv in test_bvs:
            print("\n" + "="*50)
            self.test_video_page(bv)
            print("="*50 + "\n")

if __name__ == "__main__":
    tester = BiliBiliVideoTester()
    tester.test_multiple_videos()
    print("测试完成!")

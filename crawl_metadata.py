#!/usr/bin/env python3
"""
网络爬虫程序，用于爬取 Bilibili 视频的元数据信息

功能：
1. 读取配置文件 config.json
2. 检查目标网站的 robots.txt 协议
3. 爬取指定视频的元数据信息
4. 生成 timeline.json 文件

使用方法：
python crawl_metadata.py
"""

import json
import time
import re
import subprocess
from datetime import datetime
from pathlib import Path
from urllib.robotparser import RobotFileParser
from urllib.parse import urlparse

import requests
from bs4 import BeautifulSoup


class VideoCrawler:
    """视频元数据爬虫类"""
    
    def __init__(self, config_path):
        """
        初始化爬虫
        
        Args:
            config_path: 配置文件路径
        """
        self.config_path = config_path
        self.config = self._load_config()
        self.robot_parser = RobotFileParser()
        self.headers = {
            'User-Agent': self.config['crawler']['user_agent'],
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8'
        }
    
    def _load_config(self):
        """
        加载配置文件
        
        Returns:
            配置文件内容
        """
        try:
            with open(self.config_path, 'r', encoding='utf-8') as f:
                config = json.load(f)
            return config
        except Exception as e:
            print(f"错误：加载配置文件失败 - {e}")
            raise
    
    def check_robots(self, url):
        """
        检查 robots.txt 协议
        
        Args:
            url: 目标 URL
            
        Returns:
            bool: 是否允许爬取
        """
        try:
            parsed_url = urlparse(url)
            robots_url = f"{parsed_url.scheme}://{parsed_url.netloc}/robots.txt"
            
            response = requests.get(robots_url, headers=self.headers, timeout=10)
            if response.status_code == 200:
                self.robot_parser.parse(response.text.splitlines())
                return self.robot_parser.can_fetch(self.headers['User-Agent'], url)
            return True  # 如果没有 robots.txt，默认允许
        except Exception as e:
            print(f"警告：检查 robots.txt 失败 - {e}，默认允许爬取")
            return True
    
    def crawl_video_metadata(self, url):
        """
        爬取视频元数据
        
        Args:
            url: 视频 URL
            
        Returns:
            dict: 视频元数据
        """
        max_retries = self.config['crawler']['max_retries']
        timeout = self.config['crawler']['timeout']
        
        for retry in range(max_retries):
            try:
                print(f"爬取视频：{url} (尝试 {retry+1}/{max_retries})")
                response = requests.get(url, headers=self.headers, timeout=timeout)
                response.raise_for_status()
                
                soup = BeautifulSoup(response.text, 'html.parser')
                
                # 提取视频元数据
                metadata = {
                    'url': url,
                    'type': 'bilibili',
                    'title': self._extract_title(soup),
                    'description': '',  # 默认设置为空
                    'publish_date': self._extract_publish_date(soup)
                }
                
                print(f"成功爬取视频：{metadata['title']}")
                return metadata
                
            except requests.exceptions.RequestException as e:
                print(f"网络错误：{e}")
                if retry < max_retries - 1:
                    print(f"等待 {self.config['crawler']['delay_seconds']} 秒后重试...")
                    time.sleep(self.config['crawler']['delay_seconds'])
                else:
                    print(f"错误：爬取 {url} 失败，已达到最大重试次数")
                    return None
            except Exception as e:
                print(f"解析错误：{e}")
                return None
    
    def _extract_title(self, soup):
        """
        提取视频标题
        
        Args:
            soup: BeautifulSoup 对象
            
        Returns:
            str: 视频标题
        """
        # 尝试从多个位置提取标题
        title = None
        
        # 方法 1: 从 <h1> 标签提取
        h1_title = soup.find('h1', class_='video-title')
        if h1_title:
            title = h1_title.get_text(strip=True)
        
        # 方法 2: 从 <title> 标签提取
        if not title:
            title_tag = soup.find('title')
            if title_tag:
                title = title_tag.get_text(strip=True)
                # 移除 Bilibili 后缀
                title = re.sub(r'_哔哩哔哩_bilibili$', '', title)
        
        # 方法 3: 从 JSON-LD 提取
        if not title:
            script_tags = soup.find_all('script', type='application/ld+json')
            for script in script_tags:
                try:
                    json_data = json.loads(script.string)
                    if isinstance(json_data, list):
                        for item in json_data:
                            if item.get('@type') == 'VideoObject' and 'name' in item:
                                title = item['name']
                                break
                    elif json_data.get('@type') == 'VideoObject' and 'name' in json_data:
                        title = json_data['name']
                    if title:
                        break
                except:
                    pass
        
        return title or '未获取到标题'
    
    def _extract_publish_date(self, soup):
        """
        提取视频发布时间
        
        Args:
            soup: BeautifulSoup 对象
            
        Returns:
            str: 发布时间，格式为 "YYYY-MM-DD"
        """
        # 尝试从多个位置提取发布时间
        publish_date = None
        
        # 方法 1: 从 JSON-LD 提取
        script_tags = soup.find_all('script', type='application/ld+json')
        for script in script_tags:
            try:
                json_data = json.loads(script.string)
                if isinstance(json_data, list):
                    for item in json_data:
                        if item.get('@type') == 'VideoObject' and 'uploadDate' in item:
                            publish_date = item['uploadDate']
                            # 提取 YYYY-MM-DD 部分
                            if len(publish_date) >= 10:
                                publish_date = publish_date[:10]
                            break
                elif json_data.get('@type') == 'VideoObject' and 'uploadDate' in json_data:
                    publish_date = json_data['uploadDate']
                    if len(publish_date) >= 10:
                        publish_date = publish_date[:10]
                if publish_date:
                    break
            except:
                pass
        
        # 方法 2: 从页面其他位置提取
        if not publish_date:
            # 尝试匹配发布时间的正则表达式
            date_patterns = [
                r'发布于\s*([\d{4}年\d{1,2}月\d{1,2}日])',
                r'上传于\s*([\d{4}年\d{1,2}月\d{1,2}日])',
                r'([\d{4}年\d{1,2}月\d{1,2}日])\s*发布',
                r'(\d{4}-\d{2}-\d{2})'
            ]
            
            for pattern in date_patterns:
                match = re.search(pattern, str(soup))
                if match:
                    publish_date = match.group(1)
                    # 转换中文日期格式为 YYYY-MM-DD
                    if '年' in publish_date and '月' in publish_date:
                        publish_date = publish_date.replace('年', '-').replace('月', '-').replace('日', '')
                    break
        
        return publish_date
    
    def generate_timeline(self, output_path):
        """
        生成 timeline.json 文件
        
        Args:
            output_path: 输出文件路径
        """
        timeline_data = {
            "title": {
                "media": { "url": "", "caption": "", "credit": "" },
                "text": {
                    "headline": self.config['output']['title'],
                    "text": self.config['output']['description']
                }
            },
            "events": []
        }
        
        for target in self.config['targets']:
            url = target['url']
            
            # 检查 robots 协议
            if not self.check_robots(url):
                print(f"警告：根据 robots.txt，不允许爬取 {url}")
                continue
            
            # 爬取元数据
            metadata = self.crawl_video_metadata(url)
            if not metadata:
                print(f"错误：无法获取 {url} 的元数据")
                continue
            
            # 解析日期 - 优先使用爬取到的发布时间
            publish_date = metadata.get('publish_date')
            if publish_date:
                try:
                    year, month, day = publish_date.split('-')
                    start_date = {
                        "year": year,
                        "month": month.zfill(2),
                        "day": day.zfill(2)
                    }
                    print(f"使用爬取的发布时间：{publish_date}")
                except:
                    # 发布时间格式错误，使用当前日期
                    current_date = datetime.now().strftime('%Y-%m-%d')
                    year, month, day = current_date.split('-')
                    start_date = {
                        "year": year,
                        "month": month,
                        "day": day
                    }
                    print(f"警告：发布时间格式错误 - {publish_date}，使用当前日期：{current_date}")
            else:
                # 无法获取发布时间，使用当前日期
                current_date = datetime.now().strftime('%Y-%m-%d')
                year, month, day = current_date.split('-')
                start_date = {
                    "year": year,
                    "month": month,
                    "day": day
                }
                print(f"无法获取发布时间，使用当前日期：{current_date}")
            
            # 构建事件数据
            event = {
                "start_date": start_date,
                "text": {
                    "headline": metadata['title'],
                    "text": metadata['description']
                },
                "media": {
                    "url": metadata['url'],
                    "type": metadata['type'],
                    "thumbnail": ""
                }
            }
            
            timeline_data['events'].append(event)
            
            # 延迟，避免请求过快
            time.sleep(self.config['crawler']['delay_seconds'])
        
        # 保存 timeline.json
        try:
            with open(output_path, 'w', encoding='utf-8') as f:
                json.dump(timeline_data, f, ensure_ascii=False, indent=2)
            print(f"成功生成 timeline.json 文件：{output_path}")
            print(f"共爬取 {len(timeline_data['events'])} 个视频")
        except Exception as e:
            print(f"错误：保存 timeline.json 失败 - {e}")
            raise


def main():
    """
    主函数
    """
    # 配置文件和输出文件路径
    config_path = Path('data/config.json')
    output_path = Path('data/timeline.json')
    
    # 检查配置文件是否存在
    if not config_path.exists():
        print(f"错误：配置文件不存在 - {config_path}")
        return
    
    try:
        # 创建爬虫实例
        crawler = VideoCrawler(config_path)
        
        # 生成 timeline.json
        crawler.generate_timeline(output_path)
        
        # 调用 download_thumbs.py 下载缩略图
        print("\n调用 download_thumbs.py 下载缩略图...")
        download_script = Path(__file__).parent / "download_thumbs.py"
        thumbs_dir = Path(__file__).parent / "media" / "thumbs"
        
        # 运行 download_thumbs.py 脚本
        subprocess.run([
            "python",
            str(download_script),
            str(output_path),
            str(thumbs_dir)
        ], check=True)
        
        print("\n所有操作完成！")
        
    except subprocess.CalledProcessError as e:
        print(f"错误：下载缩略图失败 - {e}")
    except Exception as e:
        print(f"错误：程序执行失败 - {e}")


if __name__ == "__main__":
    main()

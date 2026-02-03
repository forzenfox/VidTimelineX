#!/usr/bin/env python3
"""
收藏夹爬虫模块
用于爬取B站收藏夹中的视频BV号
"""

import re
from pathlib import Path
from playwright.sync_api import sync_playwright
from src.utils.path_manager import get_bv_file_path, get_favorites_config


class FavoritesCrawler:
    """收藏夹爬虫类
    
    用于爬取B站收藏夹中的视频BV号
    """
    
    def __init__(self):
        """初始化收藏夹爬虫"""
        pass
    
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
                    f.write(f"BV{bv_code}\n")
            
            print(f"成功保存 {len(bv_codes)} 个BV号到 {output_file}")
            return True
        except Exception as e:
            print(f"保存BV号失败: {e}")
            return False
    
    def run(self):
        """运行爬取任务
        
        Returns:
            dict: 爬取结果
        """
        result = {}
        favorites_config = self.get_favorites_config()
        
        for data_type, url in favorites_config.items():
            print(f"\n=== 爬取 {data_type} 收藏夹 ===")
            
            # 爬取收藏夹页面
            html = self.crawl_favorites(url)
            if not html:
                result[data_type] = {"success": False, "message": "爬取失败"}
                continue
            
            # 提取BV号
            bv_codes = self.extract_bv_codes(html)
            if not bv_codes:
                result[data_type] = {"success": False, "message": "未提取到BV号"}
                continue
            
            # 保存BV号
            output_file = get_bv_file_path(data_type)
            saved = self.save_bv_codes(bv_codes, output_file)
            
            if saved:
                result[data_type] = {"success": True, "count": len(bv_codes)}
            else:
                result[data_type] = {"success": False, "message": "保存失败"}
        
        return result

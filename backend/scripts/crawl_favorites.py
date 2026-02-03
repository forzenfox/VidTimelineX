#!/usr/bin/env python3
"""
爬取B站收藏夹视频BV号脚本
用于从指定的B站收藏夹页面爬取所有视频的BV号，并保存为txt文件
"""

import re
from bs4 import BeautifulSoup
from pathlib import Path
import time
from playwright.sync_api import sync_playwright

class BiliBiliFavoritesCrawler:
    def __init__(self):
        """初始化爬虫"""
        # 目标收藏夹URL
        self.favorites_url = "https://space.bilibili.com/57320454/favlist?fid=3869352154&ftype=create"
        
        # 输出文件路径
        self.output_file = Path("backend/data/sources/tiantong-bv.txt")
        
        # 确保输出目录存在
        self.output_file.parent.mkdir(parents=True, exist_ok=True)
    
    def get_page(self, page_url):
        """获取页面HTML（使用Playwright执行JavaScript）
        
        Args:
            page_url: 页面URL
            
        Returns:
            str: 页面HTML内容
        """
        print(f"获取页面: {page_url}")
        try:
            with sync_playwright() as p:
                # 启动浏览器（使用headless=False以便查看页面状态）
                browser = p.chromium.launch(headless=False)  # 改为有界面运行，便于调试
                page = browser.new_page()
                
                # 导航到页面
                page.goto(page_url, timeout=60000)
                
                # 等待页面加载完成
                page.wait_for_load_state('networkidle', timeout=60000)
                
                # 等待视频列表加载
                print("等待视频列表加载...")
                time.sleep(10)  # 增加等待时间
                
                # 尝试滚动页面以触发加载
                print("滚动页面...")
                for i in range(3):
                    page.mouse.wheel(0, 1000)
                    time.sleep(2)
                
                # 等待可能的登录弹窗
                print("检查是否有登录弹窗...")
                try:
                    # 尝试关闭登录弹窗
                    close_button = page.locator('button:has-text("取消")').first
                    if close_button.is_visible():
                        close_button.click()
                        print("已关闭登录弹窗")
                        time.sleep(2)
                except Exception:
                    print("没有登录弹窗或关闭失败")
                
                # 获取页面HTML
                html = page.content()
                
                # 保存完整页面内容用于调试
                with open('full_page.html', 'w', encoding='utf-8') as f:
                    f.write(html)
                print("完整页面内容已保存到 full_page.html 用于调试")
                
                # 关闭浏览器
                browser.close()
                
                return html
        except Exception as e:
            print(f"获取页面失败: {e}")
            return None
    
    def extract_bv_codes(self, html):
        """从HTML中提取BV号
        
        Args:
            html: 页面HTML内容
            
        Returns:
            list: BV号列表
        """
        bv_codes = []
        
        # 保存页面内容到临时文件，用于调试
        with open('temp_page.html', 'w', encoding='utf-8') as f:
            f.write(html[:50000])  # 只保存前50000字符，避免文件过大
        print("页面内容已保存到 temp_page.html 用于调试")
        
        # 使用BeautifulSoup解析HTML
        soup = BeautifulSoup(html, 'html.parser')
        
        # 尝试多种方式查找视频链接
        print("尝试查找视频链接...")
        
        # 方式1: 查找所有包含/video/的链接
        video_links = soup.find_all('a', href=re.compile(r'/video/'))
        print(f"方式1 - 找到 {len(video_links)} 个视频链接")
        
        # 方式2: 查找所有包含BV的链接
        bv_links = soup.find_all('a', href=re.compile(r'BV'))
        print(f"方式2 - 找到 {len(bv_links)} 个包含BV的链接")
        
        # 方式3: 查找所有class包含video的元素
        video_elements = soup.find_all(class_=re.compile(r'video'))
        print(f"方式3 - 找到 {len(video_elements)} 个class包含video的元素")
        
        # 合并所有找到的链接
        all_links = video_links + bv_links
        
        # 提取BV号
        for link in all_links:
            href = link.get('href', '')
            # 使用正则表达式提取BV号
            bv_match = re.search(r'BV([0-9A-Za-z]+)', href)
            if bv_match:
                bv_code = bv_match.group(1)
                if bv_code:
                    bv_codes.append(bv_code)
        
        # 去重
        unique_bv_codes = list(set(bv_codes))
        print(f"提取到 {len(unique_bv_codes)} 个唯一的BV号")
        
        return unique_bv_codes
    
    def get_total_pages(self, html):
        """获取总页数
        
        Args:
            html: 页面HTML内容
            
        Returns:
            int: 总页数
        """
        soup = BeautifulSoup(html, 'html.parser')
        
        # 查找分页元素
        pagination = soup.find('div', class_='be-pager')
        if not pagination:
            print("未找到分页元素，假设只有1页")
            return 1
        
        # 查找所有页码链接
        page_links = pagination.find_all('a', href=re.compile(r'page='))
        
        max_page = 1
        for link in page_links:
            href = link.get('href', '')
            page_match = re.search(r'page=(\d+)', href)
            if page_match:
                page_num = int(page_match.group(1))
                if page_num > max_page:
                    max_page = page_num
        
        print(f"总页数: {max_page}")
        return max_page
    
    def crawl_all_pages(self):
        """爬取所有页面的BV号
        
        Returns:
            list: 所有页面的BV号列表
        """
        all_bv_codes = []
        
        # 获取第一页
        first_page_html = self.get_page(self.favorites_url)
        if not first_page_html:
            print("获取第一页失败，终止爬取")
            return all_bv_codes
        
        # 提取第一页的BV号
        first_page_bv_codes = self.extract_bv_codes(first_page_html)
        all_bv_codes.extend(first_page_bv_codes)
        
        # 获取总页数
        total_pages = self.get_total_pages(first_page_html)
        
        # 爬取剩余页面
        for page in range(2, total_pages + 1):
            print(f"\n爬取第 {page} 页")
            page_url = f"https://space.bilibili.com/57320454/favlist?fid=3869352154&ftype=create&page={page}"
            page_html = self.get_page(page_url)
            
            if page_html:
                page_bv_codes = self.extract_bv_codes(page_html)
                all_bv_codes.extend(page_bv_codes)
                
                # 遵守请求频率限制
                time.sleep(2)
            else:
                print(f"获取第 {page} 页失败，跳过")
        
        # 最终去重
        unique_bv_codes = list(set(all_bv_codes))
        print(f"\n爬取完成，总共提取到 {len(unique_bv_codes)} 个唯一的BV号")
        
        return unique_bv_codes
    
    def save_bv_codes(self, bv_codes):
        """保存BV号到文件
        
        Args:
            bv_codes: BV号列表
        """
        print(f"\n保存BV号到文件: {self.output_file}")
        
        try:
            # 读取现有BV号，避免重复
            existing_bvs = set()
            if self.output_file.exists():
                with open(self.output_file, 'r', encoding='utf-8') as f:
                    for line in f:
                        stripped_line = line.strip()
                        if stripped_line:
                            # 提取BV号
                            bv_match = re.search(r'(BV)?([0-9A-Za-z]+)', stripped_line)
                            if bv_match:
                                existing_bvs.add(bv_match.group(2))
                print(f"已存在 {len(existing_bvs)} 个BV号")
            
            # 过滤掉已存在的BV号
            new_bv_codes = [bv for bv in bv_codes if bv not in existing_bvs]
            print(f"新增 {len(new_bv_codes)} 个BV号")
            
            # 合并所有BV号
            all_bvs = list(existing_bvs) + new_bv_codes
            
            # 按字母顺序排序
            all_bvs.sort()
            
            # 保存到文件
            with open(self.output_file, 'w', encoding='utf-8') as f:
                for bv in all_bvs:
                    f.write(f"BV{bv}\n")
            
            print(f"保存成功，共 {len(all_bvs)} 个BV号")
            return True
        except Exception as e:
            print(f"保存文件失败: {e}")
            return False
    
    def run(self):
        """运行爬取任务
        
        Returns:
            bool: 爬取成功返回True，否则返回False
        """
        print("=== B站收藏夹BV号爬取任务开始 ===")
        
        # 爬取所有页面的BV号
        bv_codes = self.crawl_all_pages()
        
        if not bv_codes:
            print("未提取到任何BV号")
            return False
        
        # 保存BV号到文件
        success = self.save_bv_codes(bv_codes)
        
        print("=== B站收藏夹BV号爬取任务完成 ===")
        return success

def main():
    """主函数"""
    crawler = BiliBiliFavoritesCrawler()
    crawler.run()

if __name__ == "__main__":
    main()

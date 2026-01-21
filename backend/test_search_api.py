#!/usr/bin/env python3
"""
B站搜索API测试脚本
用于分析B站搜索接口的参数、返回格式和反爬机制
"""

import requests
import json
import time
from urllib.parse import urlencode

class BiliBiliSearchTester:
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
    
    def test_search_request(self, keyword, page=1, order='totalrank'):
        """测试搜索请求"""
        print(f"测试搜索: {keyword}, 页码: {page}, 排序: {order}")
        
        # B站搜索URL
        search_url = "https://search.bilibili.com/video"
        
        # 搜索参数
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
            
            print(f"状态码: {response.status_code}")
            print(f"URL: {response.url}")
            print(f"响应长度: {len(response.text)} 字符")
            
            # 检查是否被反爬
            if '验证码' in response.text or '请稍后再试' in response.text:
                print("警告: 可能触发了反爬机制")
                return False
            
            # 分析响应内容
            self.analyze_search_response(response.text)
            
            return True
            
        except Exception as e:
            print(f"错误: {e}")
            return False
    
    def analyze_search_response(self, html):
        """分析搜索响应"""
        print("\n分析搜索响应...")
        
        # 检查是否包含视频链接 (使用更宽松的匹配)
        import re
        video_pattern = r'https?://www\.bilibili\.com/video/[a-zA-Z0-9]+'
        video_links = re.findall(video_pattern, html)
        
        if video_links:
            print(f"✓ 找到 {len(video_links)} 个视频链接")
            print(f"示例链接: {video_links[:3]}")
        else:
            print("✗ 未找到视频链接")
        
        # 检查是否包含BV号
        bv_pattern = r'BV[0-9A-Za-z]+'
        bv_codes = re.findall(bv_pattern, html)
        
        if bv_codes:
            print(f"✓ 找到 {len(bv_codes)} 个BV号")
            print(f"示例BV号: {bv_codes[:3]}")
        else:
            print("✗ 未找到BV号")
        
        # 检查是否包含JSON数据
        if 'window.' in html and '=' in html:
            print("✓ 找到可能的JavaScript变量")
        else:
            print("✗ 未找到JavaScript变量")
        
        # 保存一小部分HTML用于分析
        if len(html) > 1000:
            with open('search_response_sample.html', 'w', encoding='utf-8') as f:
                f.write(html[:5000])  # 只保存前5000字符
            print("✓ 保存了HTML样本到 search_response_sample.html")
    
    def test_rate_limit(self, keyword):
        """测试请求频率限制"""
        print("\n测试请求频率限制...")
        
        success_count = 0
        failed_count = 0
        
        for i in range(1, 11):
            print(f"\n第 {i} 次请求")
            success = self.test_search_request(keyword, page=i)
            if success:
                success_count += 1
            else:
                failed_count += 1
            
            # 等待一段时间
            time.sleep(1)
        
        print(f"\n请求频率测试结果:")
        print(f"成功: {success_count}")
        print(f"失败: {failed_count}")
        
        if failed_count > 0:
            print("警告: 可能存在请求频率限制")
        else:
            print("✓ 未检测到明显的请求频率限制")
    
    def test_different_orders(self, keyword):
        """测试不同排序方式"""
        print("\n测试不同排序方式...")
        
        orders = {
            'totalrank': '综合排序',
            'click': '播放量排序',
            'pubdate': '最新排序',
            'stow': '收藏排序'
        }
        
        for order_key, order_name in orders.items():
            print(f"\n测试 {order_name}")
            self.test_search_request(keyword, order=order_key)
            time.sleep(2)
    
    def test_different_time_ranges(self, keyword):
        """测试不同时间范围"""
        print("\n测试不同时间范围...")
        
        # 注意：时间范围参数在B站搜索中可能不是直接通过URL参数传递的
        # 这里我们测试不同的ftime值
        time_ranges = {
            0: '全部时间',
            1: '一天内',
            7: '一周内',
            30: '一月内',
            365: '一年内'
        }
        
        for ftime, time_name in time_ranges.items():
            print(f"\n测试 {time_name}")
            
            search_url = "https://search.bilibili.com/video"
            params = {
                'keyword': keyword,
                'order': 'totalrank',
                'page': 1,
                'ftime': ftime
            }
            
            try:
                response = self.session.get(search_url, params=params, timeout=15)
                response.raise_for_status()
                print(f"状态码: {response.status_code}")
                print(f"URL: {response.url}")
            except Exception as e:
                print(f"错误: {e}")
            
            time.sleep(1)

if __name__ == "__main__":
    tester = BiliBiliSearchTester()
    
    # 测试关键词
    keyword = "原神"
    
    # 测试基本搜索
    print("=== 测试基本搜索 ===")
    tester.test_search_request(keyword)
    
    # 测试不同排序方式
    print("\n=== 测试不同排序方式 ===")
    tester.test_different_orders(keyword)
    
    # 测试不同时间范围
    print("\n=== 测试不同时间范围 ===")
    tester.test_different_time_ranges(keyword)
    
    # 测试请求频率限制
    print("\n=== 测试请求频率限制 ===")
    tester.test_rate_limit(keyword)
    
    print("\n测试完成!")

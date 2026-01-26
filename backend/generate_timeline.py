#!/usr/bin/env python3
"""
测试生成时间线数据
"""

from auto_crawler import BiliBiliAutoCrawler

def main():
    # 创建爬虫实例
    crawler = BiliBiliAutoCrawler()
    
    # 生成时间线数据
    count = crawler.generate_timeline()
    
    print(f"\n生成时间线数据完成，共包含 {count} 个视频")

if __name__ == "__main__":
    main()

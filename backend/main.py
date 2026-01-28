#!/usr/bin/env python3
"""
B站视频爬虫主入口脚本
提供命令行界面，方便用户执行各种爬虫功能
"""

import sys
import os
import argparse

# 添加当前目录到Python路径
sys.path.append(os.path.dirname(os.path.abspath(__file__)))


# 导入爬虫功能
from src.crawler.auto_crawler import BiliBiliAutoCrawler
from src.utils.config import BV_FILE_PATH


def main():
    """主函数，提供命令行界面"""
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
    
    args = parser.parse_args()
    
    # 创建爬虫实例
    crawler = BiliBiliAutoCrawler()
    
    print("=== B站视频爬虫工具 ===")
    print(f"爬取模式: {args.mode}")
    
    if args.mode == 'file':
        print(f"BV号文件: {args.bv_file}")
        # 从文件爬取
        crawler.run_crawl_from_file(args.bv_file)
    else:
        print(f"关键词: {args.keywords}")
        print(f"最大页码: {args.max_pages}")
        # 关键词爬取
        crawler.run_crawl(args.keywords, max_pages=args.max_pages)
    
    # 生成时间线数据
    print("\n=== 生成时间线数据 ===")
    crawler.generate_timeline()
    
    print("\n=== 任务完成 ===")


if __name__ == "__main__":
    main()
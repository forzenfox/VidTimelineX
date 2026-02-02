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
from src.utils.path_manager import get_bv_file_path


def main():
    """主函数，提供命令行界面"""
    parser = argparse.ArgumentParser(description='B站视频爬虫工具')
    parser.add_argument('--data-type', type=str, default='lvjiang', 
                        choices=['lvjiang', 'tiantong'],
                        help='数据类型：lvjiang（驴酱）或tiantong（甜筒）')
    parser.add_argument('--mode', type=str, default='file', choices=['file', 'keyword'],
                        help='爬取模式：file（从文件读取BV号）或keyword（关键词搜索）')
    parser.add_argument('--bv-file', type=str, 
                        default=str(get_bv_file_path('lvjiang')),
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
    
    # 创建对应数据类型的爬虫实例
    crawler = BiliBiliAutoCrawler(data_type=args.data_type)
    
    print("=== B站视频爬虫工具 ===")
    print(f"数据类型: {args.data_type}")
    print(f"爬取模式: {args.mode}")
    print(f"下载封面: {'是' if download_covers else '否'}")
    
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
    crawler.generate_timeline(download_covers=download_covers)
    
    print("\n=== 任务完成 ===")


if __name__ == "__main__":
    main()
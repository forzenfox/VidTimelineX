#!/usr/bin/env python3
"""
时间线更新脚本
用于更新B站收藏夹视频的时间线数据
"""

import time
from pathlib import Path
from src.crawler.favorites_crawler import FavoritesCrawler
from src.crawler.video_crawler import VideoCrawler
from src.crawler.timeline_generator import TimelineGenerator
from src.utils.path_manager import get_bv_file_path, get_all_data_types, ensure_directories, get_data_paths
from src.utils.config import get_config


def main():
    """主函数"""
    print("=== 开始更新时间线数据 ===")
    
    # 获取配置
    config = get_config()
    full_crawl = config['crawler'].get('full_crawl', False)
    
    print(f"爬取模式: {'全量爬取' if full_crawl else '增量爬取'}")
    
    # 初始化各个模块
    favorites_crawler = FavoritesCrawler()
    video_crawler = VideoCrawler()
    timeline_generator = TimelineGenerator()
    
    # 清除缓存，确保使用最新数据
    video_crawler.clear_cache()
    
    # 获取所有数据类型
    data_types = get_all_data_types()
    
    # 爬取收藏夹
    print("\n=== 1. 爬取收藏夹获取BV号 ===")
    favorites_result = favorites_crawler.run()
    print(f"收藏夹爬取结果: {favorites_result}")
    
    # 处理每个数据类型
    for data_type in data_types:
        print(f"\n=== 处理 {data_type} 数据 ===")
        
        # 确保目录存在
        ensure_directories(data_type)
        
        # 获取BV号文件路径
        bv_file_path = get_bv_file_path(data_type)
        
        # 加载BV号列表
        print(f"\n=== 2. 加载BV号列表 ===")
        bv_list = video_crawler.load_bv_list(bv_file_path)
        
        if not bv_list:
            print(f"没有找到 {data_type} 的BV号")
            continue
        
        # 获取时间线文件路径
        timeline_file = get_data_paths(data_type).get('TIMELINE_FILE')
        
        # 爬取视频元数据
        print(f"\n=== 3. 爬取视频元数据 ===")
        videos = []
        
        for bv_code in bv_list:
            # 增量爬取模式下，检查视频是否已爬取
            if not full_crawl and video_crawler.is_video_crawled(bv_code, timeline_file):
                print(f"视频 BV{bv_code} 已爬取，跳过")
                continue
            
            metadata = video_crawler.crawl_video_metadata(bv_code)
            if metadata:
                videos.append(metadata)
            
            # 避免请求过于频繁
            time.sleep(2)
        
        if not videos:
            if full_crawl:
                print(f"没有爬取到 {data_type} 的视频元数据")
            else:
                print(f"所有 {data_type} 的视频都已爬取，无需更新")
            continue
        
        # 生成时间线数据
        print(f"\n=== 4. 生成时间线数据 ===")
        timeline_result = timeline_generator.run(videos, data_type)
        print(f"时间线生成结果: {timeline_result}")
    
    print("\n=== 时间线更新完成 ===")


if __name__ == "__main__":
    main()

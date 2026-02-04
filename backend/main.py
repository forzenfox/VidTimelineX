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
from src.downloader.download_thumbs import download_all_covers
from src.updater.frontend_updater import update_frontend_files
from src.utils.path_manager import get_all_data_types, ensure_directories, get_data_paths
from src.utils.config import get_config


def download_covers_for_timeline(timeline_file: Path, thumbs_dir: Path) -> dict:
    """根据时间线文件下载封面图片
    
    Args:
        timeline_file: 时间线文件路径
        thumbs_dir: 封面保存目录
        
    Returns:
        dict: 下载结果统计
    """
    import json
    
    if not timeline_file.exists():
        return {'success': 0, 'failed': 0, 'skipped': 0}
    
    with open(timeline_file, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    if not isinstance(data, list):
        return {'success': 0, 'failed': 0, 'skipped': 0}
    
    videos = []
    for item in data:
        if isinstance(item, dict):
            video = {
                'videoUrl': item.get('videoUrl', '')
            }
            videos.append(video)
    
    if not videos:
        return {'success': 0, 'failed': 0, 'skipped': 0}
    
    return download_all_covers(timeline_file, thumbs_dir, quiet=False)


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
    
    # 爬取收藏夹到内存
    print("\n=== 1. 爬取收藏夹获取BV号 ===")
    favorites_result = favorites_crawler.run_with_memory()
    print(f"收藏夹爬取结果: {favorites_result}")
    
    # 添加成功标志，跟踪是否成功生成了时间线数据
    timeline_generated = False
    
    # 处理每个数据类型
    for data_type in data_types:
        print(f"\n=== 处理 {data_type} 数据 ===")
        
        # 确保目录存在
        ensure_directories(data_type)
        
        # 从内存中获取BV号列表
        print(f"\n=== 2. 从内存获取BV号列表 ===")
        bv_list = []
        data_result = favorites_result.get(data_type, {})
        if data_result.get('success'):
            bv_list = data_result.get('bv_list', [])
        
        if not bv_list:
            print(f"没有找到 {data_type} 的BV号")
            continue
        
        # 获取时间线文件路径
        timeline_file = get_data_paths(data_type).get('TIMELINE_FILE')
        
        # 直接从内存中的BV号列表爬取视频元数据
        print(f"\n=== 3. 直接爬取视频元数据 ===")
        videos = video_crawler.crawl_from_bv_list(bv_list, data_type, full_crawl)
        
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
        
        if timeline_result.get('success'):
            # 更新成功标志
            timeline_generated = True
            data_config = get_data_paths(data_type)
            thumbs_dir = data_config.get('THUMBS_DIR')
            
            print(f"\n=== 5. 下载封面图片 ===")
            cover_result = download_covers_for_timeline(timeline_file, thumbs_dir)
            print(f"封面下载结果: 成功 {cover_result.get('success', 0)}, 失败 {cover_result.get('failed', 0)}, 跳过 {cover_result.get('skipped', 0)}")
    
    # 只有当成功生成了时间线数据时，才执行前端文件更新
    if timeline_generated:
        # 更新前端文件
        print("\n=== 更新前端文件 ===")
        config = {
            'backend_data_dir': './data',
            'frontend_data_dir': '../frontend'
        }
        
        for data_type in data_types:
            print(f"\n=== 更新 {data_type} 前端文件 ===")
            result = update_frontend_files(data_type, config)
            
            print(f"结果: {'成功' if result['success'] else '失败'}")
            print(f"消息: {result.get('message', '')}")
            
            if 'merge_result' in result:
                merge_msg = result['merge_result'].get('message', '')
                print(f"合并结果: {merge_msg}")
            
            if 'copy_result' in result:
                copy_msg = result['copy_result'].get('message', '')
                print(f"复制结果: {copy_msg}")
    else:
        print("\n=== 跳过更新前端文件 ===")
        print("原因: 没有成功生成时间线数据，无需更新前端文件")

    print("\n=== 时间线更新完成 ===")


if __name__ == "__main__":
    main()
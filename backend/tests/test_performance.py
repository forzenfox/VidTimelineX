#!/usr/bin/env python3
"""
性能测试

测试内存处理和文件处理的性能差异。
"""

import time
import tempfile
from pathlib import Path
from src.crawler.favorites_crawler import FavoritesCrawler
from src.crawler.video_crawler import VideoCrawler


def test_memory_vs_file_performance():
    """测试内存处理和文件处理的性能差异"""
    print("=== 性能测试：内存处理 vs 文件处理 ===")
    
    # 初始化爬虫
    favorites_crawler = FavoritesCrawler()
    video_crawler = VideoCrawler()
    
    # 测试内存处理性能
    print("\n1. 测试内存处理性能")
    start_time = time.time()
    
    # 爬取收藏夹到内存
    memory_result = favorites_crawler.run_with_memory()
    
    memory_time = time.time() - start_time
    print(f"内存处理耗时: {memory_time:.2f} 秒")
    
    # 统计BV号数量
    total_bv_count = 0
    for data_type, result in memory_result.items():
        if result.get('success'):
            bv_count = len(result.get('bv_list', []))
            total_bv_count += bv_count
            print(f"{data_type}: {bv_count} 个BV号")
    print(f"总计: {total_bv_count} 个BV号")
    
    # 测试文件处理性能
    print("\n2. 测试文件处理性能")
    start_time = time.time()
    
    # 爬取收藏夹到文件
    file_result = favorites_crawler.run()
    
    file_time = time.time() - start_time
    print(f"文件处理耗时: {file_time:.2f} 秒")
    
    # 比较性能
    print("\n3. 性能比较")
    print(f"内存处理比文件处理快: {((file_time - memory_time) / file_time * 100):.1f}%")
    print(f"内存处理速度提升: {(file_time / memory_time):.1f}x")
    
    # 清理临时文件（可选）
    print("\n4. 清理测试数据")
    print("性能测试完成")


if __name__ == "__main__":
    test_memory_vs_file_performance()

#!/usr/bin/env python3
"""
测试load_bv_list方法，验证BV号文件读取功能
"""

import sys
import os

# 添加当前目录到Python路径
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from src.crawler.auto_crawler import BiliBiliAutoCrawler
from src.utils.config import BV_FILE_PATH


def test_load_bv_list():
    """测试load_bv_list方法"""
    print("=== 测试load_bv_list方法 ===")
    
    # 创建爬虫实例
    crawler = BiliBiliAutoCrawler()
    
    # 测试文件路径
    bv_file_path = str(BV_FILE_PATH)
    
    print(f"测试文件: {bv_file_path}")
    
    # 测试文件读取
    bv_list = crawler.load_bv_list(bv_file_path)
    
    print(f"读取结果:")
    print(f"  读取到 {len(bv_list)} 个BV号")
    print(f"  BV号列表: {bv_list}")
    
    # 验证读取结果
    if len(bv_list) > 0:
        print("✓ 文件读取成功")
        return True
    else:
        print("✗ 文件读取失败")
        return False


if __name__ == "__main__":
    test_load_bv_list()
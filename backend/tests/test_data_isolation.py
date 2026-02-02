#!/usr/bin/env python3
"""
数据隔离功能测试
测试甜筒和驴酱数据的隔离功能
"""

import os
import json
import unittest
from src.utils.path_manager import get_data_paths, ensure_directories
from src.crawler.auto_crawler import BiliBiliAutoCrawler


class TestDataIsolation(unittest.TestCase):
    """测试数据隔离功能"""
    
    def setUp(self):
        """设置测试环境"""
        # 确保目录结构存在
        ensure_directories('lvjiang')
        ensure_directories('tiantong')
    
    def test_data_paths_isolation(self):
        """测试数据路径隔离"""
        # 获取驴酱数据路径
        lvjiang_paths = get_data_paths('lvjiang')
        # 获取甜筒数据路径
        tiantong_paths = get_data_paths('tiantong')
        
        # 验证路径不同
        self.assertNotEqual(lvjiang_paths['DATA_TYPE_DIR'], tiantong_paths['DATA_TYPE_DIR'])
        self.assertNotEqual(lvjiang_paths['THUMBS_DIR'], tiantong_paths['THUMBS_DIR'])
        self.assertNotEqual(lvjiang_paths['TIMELINE_FILE'], tiantong_paths['TIMELINE_FILE'])
        
        # 验证路径包含正确的数据类型
        self.assertIn('lvjiang', str(lvjiang_paths['DATA_TYPE_DIR']))
        self.assertIn('tiantong', str(tiantong_paths['DATA_TYPE_DIR']))
    
    def test_crawler_data_isolation(self):
        """测试爬虫数据隔离"""
        # 创建驴酱爬虫实例
        lvjiang_crawler = BiliBiliAutoCrawler(data_type='lvjiang')
        # 创建甜筒爬虫实例
        tiantong_crawler = BiliBiliAutoCrawler(data_type='tiantong')
        
        # 验证爬虫使用的数据路径不同
        self.assertNotEqual(
            lvjiang_crawler.config['DATA_TYPE_DIR'],
            tiantong_crawler.config['DATA_TYPE_DIR']
        )
    
    def test_directory_creation(self):
        """测试目录创建功能"""
        # 确保目录结构存在
        ensure_directories('lvjiang')
        ensure_directories('tiantong')
        
        # 获取路径
        lvjiang_paths = get_data_paths('lvjiang')
        tiantong_paths = get_data_paths('tiantong')
        
        # 验证目录存在
        self.assertTrue(os.path.exists(lvjiang_paths['DATA_TYPE_DIR']))
        self.assertTrue(os.path.exists(lvjiang_paths['THUMBS_DIR']))
        
        self.assertTrue(os.path.exists(tiantong_paths['DATA_TYPE_DIR']))
        self.assertTrue(os.path.exists(tiantong_paths['THUMBS_DIR']))


if __name__ == '__main__':
    unittest.main()

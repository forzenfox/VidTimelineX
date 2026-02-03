#!/usr/bin/env python3
"""
配置管理爬取模式测试
测试 full_crawl 配置选项的功能
"""

import unittest
import json
from pathlib import Path
from src.utils.config import get_config, save_config, DEFAULT_CONFIG, CONFIG_FILE


class TestConfigCrawlMode(unittest.TestCase):
    """配置管理爬取模式测试类"""
    
    def setUp(self):
        """测试初始化"""
        # 保存原始配置文件（如果存在）
        self.original_config = None
        if CONFIG_FILE.exists():
            with open(CONFIG_FILE, 'r', encoding='utf-8') as f:
                self.original_config = json.load(f)
    
    def tearDown(self):
        """测试清理"""
        # 恢复原始配置文件
        if self.original_config:
            with open(CONFIG_FILE, 'w', encoding='utf-8') as f:
                json.dump(self.original_config, f, ensure_ascii=False, indent=2)
        elif CONFIG_FILE.exists():
            # 如果原始配置不存在，删除测试创建的配置文件
            CONFIG_FILE.unlink()
    
    def test_default_config_has_full_crawl(self):
        """测试默认配置包含 full_crawl 选项"""
        # 检查默认配置结构
        self.assertIn('crawler', DEFAULT_CONFIG)
        self.assertIn('full_crawl', DEFAULT_CONFIG['crawler'])
        self.assertFalse(DEFAULT_CONFIG['crawler']['full_crawl'])
    
    def test_get_config_with_full_crawl(self):
        """测试获取配置包含 full_crawl 选项"""
        config = get_config()
        
        # 验证配置结构
        self.assertIn('crawler', config)
        self.assertIn('full_crawl', config['crawler'])
        
        # 验证默认值
        self.assertFalse(config['crawler']['full_crawl'])
    
    def test_custom_full_crawl_config(self):
        """测试自定义 full_crawl 配置"""
        # 创建自定义配置
        custom_config = {
            "crawler": {
                "full_crawl": True
            }
        }
        
        # 保存配置
        save_config(custom_config)
        
        # 获取配置
        config = get_config()
        
        # 验证配置
        self.assertTrue(config['crawler']['full_crawl'])
    
    def test_full_crawl_false_config(self):
        """测试 full_crawl 为 false 的配置"""
        # 创建自定义配置
        custom_config = {
            "crawler": {
                "full_crawl": False
            }
        }
        
        # 保存配置
        save_config(custom_config)
        
        # 获取配置
        config = get_config()
        
        # 验证配置
        self.assertFalse(config['crawler']['full_crawl'])
    
    def test_config_merge_with_full_crawl(self):
        """测试配置合并时保留 full_crawl 选项"""
        # 创建部分配置
        partial_config = {
            "favorites": {
                "tiantong": "https://space.bilibili.com/57320454/favlist?fid=3869352154&ftype=create"
            }
        }
        
        # 保存配置
        save_config(partial_config)
        
        # 获取配置
        config = get_config()
        
        # 验证配置合并
        self.assertIn('crawler', config)
        self.assertIn('full_crawl', config['crawler'])
        self.assertFalse(config['crawler']['full_crawl'])
        self.assertIn('tiantong', config['favorites'])


if __name__ == "__main__":
    unittest.main()

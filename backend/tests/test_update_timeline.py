#!/usr/bin/env python3
"""
主更新脚本测试
测试全量爬取和增量爬取模式
"""

import pytest
import json
from pathlib import Path
from src.utils.config import get_config, save_config, CONFIG_FILE


class TestUpdateTimeline:
    """主更新脚本测试类"""
    
    def setup_method(self):
        """测试初始化"""
        # 保存原始配置
        self.original_config = None
        if CONFIG_FILE.exists():
            with open(CONFIG_FILE, 'r', encoding='utf-8') as f:
                self.original_config = json.load(f)
    
    def teardown_method(self):
        """测试清理"""
        # 恢复原始配置
        if self.original_config:
            with open(CONFIG_FILE, 'w', encoding='utf-8') as f:
                json.dump(self.original_config, f, ensure_ascii=False, indent=2)
        elif CONFIG_FILE.exists():
            CONFIG_FILE.unlink()
    
    def test_full_crawl_config(self):
        """测试全量爬取配置"""
        # 设置全量爬取配置
        test_config = {
            "crawler": {
                "full_crawl": True
            }
        }
        save_config(test_config)
        
        # 获取配置
        config = get_config()
        assert config['crawler']['full_crawl'] is True
    
    def test_incremental_crawl_config(self):
        """测试增量爬取配置"""
        # 设置增量爬取配置
        test_config = {
            "crawler": {
                "full_crawl": False
            }
        }
        save_config(test_config)
        
        # 获取配置
        config = get_config()
        assert config['crawler']['full_crawl'] is False
    
    def test_default_crawl_config(self):
        """测试默认爬取配置"""
        # 确保配置文件不存在
        if CONFIG_FILE.exists():
            CONFIG_FILE.unlink()
        
        # 获取默认配置
        config = get_config()
        assert config['crawler']['full_crawl'] is False
    
    def test_config_merge_with_crawl_mode(self):
        """测试配置合并时保留爬取模式"""
        # 创建部分配置
        partial_config = {
            "favorites": {
                "tiantong": "https://space.bilibili.com/57320454/favlist?fid=3869352154&ftype=create"
            }
        }
        save_config(partial_config)
        
        # 获取配置
        config = get_config()
        
        # 验证配置合并
        assert config['crawler']['full_crawl'] is False
        assert 'tiantong' in config['favorites']

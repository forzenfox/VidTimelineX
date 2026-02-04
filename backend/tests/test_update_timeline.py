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
            "datatype": {
                "lvjiang": {
                    "favorites_url": "https://space.bilibili.com/57320454/favlist?fid=3965175154&ftype=create&ctype=21",
                    "backend_timeline_file": "data/lvjiang/videos.json",
                    "frontend_timeline_file": "../frontend/src/features/lvjiang/data/videos.json"
                },
                "tiantong": {
                    "favorites_url": "https://space.bilibili.com/57320454/favlist?fid=3869352154&ftype=create&ctype=21",
                    "backend_timeline_file": "data/tiantong/videos.json",
                    "frontend_timeline_file": "../frontend/src/features/tiantong/data/videos.json"
                }
            },
            "crawler": {
                "timeout": 15,
                "retry": 3,
                "interval": 2,
                "full_crawl": True
            },
            "frontend": {
                "thumbs_dir": "../frontend/public/thumbs"
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
            "datatype": {
                "lvjiang": {
                    "favorites_url": "https://space.bilibili.com/57320454/favlist?fid=3965175154&ftype=create&ctype=21",
                    "backend_timeline_file": "data/lvjiang/videos.json",
                    "frontend_timeline_file": "../frontend/src/features/lvjiang/data/videos.json"
                },
                "tiantong": {
                    "favorites_url": "https://space.bilibili.com/57320454/favlist?fid=3869352154&ftype=create&ctype=21",
                    "backend_timeline_file": "data/tiantong/videos.json",
                    "frontend_timeline_file": "../frontend/src/features/tiantong/data/videos.json"
                }
            },
            "crawler": {
                "timeout": 15,
                "retry": 3,
                "interval": 2,
                "full_crawl": False
            },
            "frontend": {
                "thumbs_dir": "../frontend/public/thumbs"
            }
        }
        save_config(test_config)
        
        # 获取配置
        config = get_config()
        assert config['crawler']['full_crawl'] is False
    
    def test_default_crawl_config(self):
        """测试默认爬取配置"""
        # 确保配置文件存在
        assert CONFIG_FILE.exists(), f"配置文件不存在: {CONFIG_FILE}"
        
        # 获取配置
        config = get_config()
        assert config['crawler']['full_crawl'] is False
    
    def test_config_merge_with_crawl_mode(self):
        """测试配置合并时保留爬取模式"""
        # 创建完整配置
        full_config = {
            "datatype": {
                "lvjiang": {
                    "favorites_url": "https://space.bilibili.com/57320454/favlist?fid=3965175154&ftype=create&ctype=21",
                    "backend_timeline_file": "data/lvjiang/videos.json",
                    "frontend_timeline_file": "../frontend/src/features/lvjiang/data/videos.json"
                },
                "tiantong": {
                    "favorites_url": "https://space.bilibili.com/57320454/favlist?fid=3869352154&ftype=create&ctype=21",
                    "backend_timeline_file": "data/tiantong/videos.json",
                    "frontend_timeline_file": "../frontend/src/features/tiantong/data/videos.json"
                }
            },
            "crawler": {
                "timeout": 15,
                "retry": 3,
                "interval": 2,
                "full_crawl": False
            },
            "frontend": {
                "thumbs_dir": "../frontend/public/thumbs"
            }
        }
        save_config(full_config)
        
        # 获取配置
        config = get_config()
        
        # 验证配置
        assert config['crawler']['full_crawl'] is False
        assert 'tiantong' in config['datatype']

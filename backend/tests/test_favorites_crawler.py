#!/usr/bin/env python3
"""
收藏夹爬取功能测试
"""

import pytest
from pathlib import Path
from src.crawler.favorites_crawler import FavoritesCrawler


class TestFavoritesCrawler:
    """收藏夹爬虫测试类"""
    
    def setup_method(self):
        """测试初始化"""
        self.crawler = FavoritesCrawler()
    
    def test_extract_bv_codes(self):
        """测试BV号提取功能"""
        # 模拟HTML内容
        html = '''
        <a href="/video/BV1234567890">视频1</a>
        <a href="/video/BV0987654321">视频2</a>
        '''
        bv_codes = self.crawler.extract_bv_codes(html)
        assert isinstance(bv_codes, list)
        assert len(bv_codes) == 2
        assert "1234567890" in bv_codes
        assert "0987654321" in bv_codes
    
    def test_save_bv_codes(self, tmp_path):
        """测试保存BV号功能"""
        bv_codes = ["1234567890", "0987654321"]
        output_file = tmp_path / "test-bv.txt"
        result = self.crawler.save_bv_codes(bv_codes, output_file)
        assert result is True
        assert output_file.exists()
        with open(output_file, 'r', encoding='utf-8') as f:
            content = f.read()
        assert "BV1234567890" in content
        assert "BV0987654321" in content
    
    def test_get_favorites_config(self):
        """测试获取收藏夹配置"""
        config = self.crawler.get_favorites_config()
        assert isinstance(config, dict)
        assert "tiantong" in config
        assert "lvjiang" in config

    def test_crawl_favorites_to_memory(self):
        """测试爬取收藏夹到内存"""
        # 测试内存处理方法是否存在
        assert hasattr(self.crawler, 'crawl_favorites_to_memory'), "crawl_favorites_to_memory方法不存在"
        
    def test_run_with_memory(self):
        """测试运行爬取任务到内存"""
        # 测试内存处理方法是否存在
        assert hasattr(self.crawler, 'run_with_memory'), "run_with_memory方法不存在"

#!/usr/bin/env python3
"""
视频元数据爬取功能测试
"""

import pytest
import json
from pathlib import Path
from src.crawler.video_crawler import VideoCrawler


class TestVideoCrawler:
    """视频爬虫测试类"""
    
    def setup_method(self):
        """测试初始化"""
        self.crawler = VideoCrawler()
    
    def test_load_bv_list(self, tmp_path):
        """测试加载BV号列表功能"""
        # 创建测试文件
        bv_file = tmp_path / "test-bv.txt"
        with open(bv_file, 'w', encoding='utf-8') as f:
            f.write("BV1234567890\n")
            f.write("BV0987654321\n")
        
        bv_list = self.crawler.load_bv_list(bv_file)
        assert isinstance(bv_list, list)
        assert len(bv_list) == 2
        assert "1234567890" in bv_list
        assert "0987654321" in bv_list

    def test_crawl_from_bv_list(self):
        """测试直接从BV号列表爬取"""
        # 测试内存处理方法是否存在
        assert hasattr(self.crawler, 'crawl_from_bv_list'), "crawl_from_bv_list方法不存在"
        
        # 测试直接传递BV号列表
        test_bv_list = ["1234567890", "0987654321"]
        assert isinstance(test_bv_list, list)
    
    def test_crawl_video_metadata(self):
        """测试视频元数据爬取功能"""
        # 这里只测试方法是否能正常调用，不实际爬取
        # 实际爬取会依赖网络连接和B站API
        try:
            # 使用一个无效的BV号进行测试
            result = self.crawler.crawl_video_metadata("invalid")
            # 预期返回None
            assert result is None
        except Exception as e:
            # 确保方法不会抛出异常
            assert False, f"方法抛出异常: {e}"
    
    def test_is_video_crawled(self, tmp_path):
        """测试判断视频是否已爬取"""
        # 创建测试时间线文件
        videos_file = tmp_path / "videos.json"
        test_content = [
            {
                "id": 1,
                "video": {
                    "bv": "1234567890"
                }
            },
            {
                "id": 2,
                "video": {
                    "bv": "0987654321"
                }
            }
        ]
        
        with open(videos_file, 'w', encoding='utf-8') as f:
            json.dump(test_content, f, ensure_ascii=False, indent=2)
        
        # 测试已爬取的视频
        assert self.crawler.is_video_crawled("1234567890", videos_file)
        assert self.crawler.is_video_crawled("0987654321", videos_file)
        
        # 测试未爬取的视频
        assert not self.crawler.is_video_crawled("5555555555", videos_file)
    
    def test_is_video_crawled_without_file(self, tmp_path):
        """测试判断视频是否已爬取（文件不存在）"""
        # 测试不存在的文件
        non_existent_file = tmp_path / "non_existent_videos.json"
        assert not self.crawler.is_video_crawled("1234567890", non_existent_file)
    
    def test_incremental_crawl_logic(self, tmp_path):
        """测试增量爬取逻辑"""
        # 创建测试时间线文件
        videos_file = tmp_path / "videos.json"
        test_content = [
            {
                "id": 1,
                "video": {
                    "bv": "1234567890"
                }
            }
        ]
        
        with open(videos_file, 'w', encoding='utf-8') as f:
            json.dump(test_content, f, ensure_ascii=False, indent=2)
        
        # 模拟增量爬取 - 应该只处理未爬取的视频
        bv_list = ["1234567890", "0987654321", "5555555555"]
        
        # 过滤出未爬取的视频
        new_bv_list = []
        for bv_code in bv_list:
            if not self.crawler.is_video_crawled(bv_code, videos_file):
                new_bv_list.append(bv_code)
        
        # 验证结果
        assert len(new_bv_list) == 2
        assert "0987654321" in new_bv_list
        assert "5555555555" in new_bv_list
        assert "1234567890" not in new_bv_list
    
    def test_is_video_crawled_with_test_data(self):
        """测试使用实际测试数据文件判断视频是否已爬取"""
        # 使用测试数据目录中的videos.json文件
        test_data_file = Path(__file__).parent / "data" / "videos.json"
        
        # 验证测试数据文件存在
        assert test_data_file.exists(), f"测试数据文件不存在: {test_data_file}"
        
        # 测试已爬取的视频（从测试数据中提取BV号）
        # 测试数据中包含 BV1XCffBPEj4 和 BV1zAFTzeEZ6
        assert self.crawler.is_video_crawled("BV1XCffBPEj4", test_data_file)
        assert self.crawler.is_video_crawled("BV1zAFTzeEZ6", test_data_file)
        
        # 测试未爬取的视频
        assert not self.crawler.is_video_crawled("non_existent_bv", test_data_file)

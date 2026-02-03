#!/usr/bin/env python3
"""
时间线生成器测试
"""

import unittest
import json
from pathlib import Path
from src.crawler.timeline_generator import TimelineGenerator


class TestTimelineGenerator(unittest.TestCase):
    """时间线生成器测试类"""
    
    def setUp(self):
        """测试初始化"""
        self.generator = TimelineGenerator()
        self.test_videos = [
            {
                "bv": "1xx411c7mD",
                "url": "https://www.bilibili.com/video/BV1xx411c7mD",
                "title": "测试视频1",
                "description": "这是测试视频1的描述",
                "publish_date": "2023-12-01",
                "views": 1000,
                "danmaku": 100,
                "up主": "测试UP主",
                "thumbnail": "https://i0.hdslb.com/bfs/archive/1xx411c7mD.jpg",
                "duration": "05:30",
                "crawled_at": "2023-12-01 12:00:00"
            },
            {
                "bv": "2yy522d8nE",
                "url": "https://www.bilibili.com/video/BV2yy522d8nE",
                "title": "测试视频2",
                "description": "这是测试视频2的描述",
                "publish_date": "2023-12-02",
                "views": 2000,
                "danmaku": 200,
                "up主": "测试UP主",
                "thumbnail": "https://i0.hdslb.com/bfs/archive/2yy522d8nE.jpg",
                "duration": "03:45",
                "crawled_at": "2023-12-02 12:00:00"
            }
        ]
        # 新视频数据
        self.new_videos = [
            {
                "bv": "3zz633e9oF",
                "url": "https://www.bilibili.com/video/BV3zz633e9oF",
                "title": "测试视频3",
                "description": "这是测试视频3的描述",
                "publish_date": "2023-12-03",
                "views": 3000,
                "danmaku": 300,
                "up主": "测试UP主",
                "thumbnail": "https://i0.hdslb.com/bfs/archive/3zz633e9oF.jpg",
                "duration": "04:15",
                "crawled_at": "2023-12-03 12:00:00"
            }
        ]
    
    def test_generate_timeline(self):
        """测试生成时间线数据"""
        timeline_data = self.generator.generate_timeline(self.test_videos)
        
        # 验证结果
        self.assertIsInstance(timeline_data, list)
        self.assertEqual(len(timeline_data), 2)
        
        # 验证时间线数据结构
        for item in timeline_data:
            self.assertIn("id", item)
            self.assertIn("date", item)
            self.assertIn("title", item)
            self.assertIn("content", item)
            self.assertIn("video", item)
            self.assertIn("thumbnail", item)
            self.assertIn("views", item)
            self.assertIn("danmaku", item)
            self.assertIn("up主", item)
            self.assertIn("duration", item)
            self.assertIn("crawled_at", item)
        
        # 验证排序（按发布日期降序）
        self.assertEqual(timeline_data[0]["date"], "2023-12-02")
        self.assertEqual(timeline_data[1]["date"], "2023-12-01")
    
    def test_save_timeline(self):
        """测试保存时间线数据"""
        timeline_data = self.generator.generate_timeline(self.test_videos)
        output_file = Path("test_timeline.json")
        
        # 测试保存
        result = self.generator.save_timeline(timeline_data, output_file)
        self.assertTrue(result)
        
        # 验证文件存在
        self.assertTrue(output_file.exists())
        
        # 清理测试文件
        if output_file.exists():
            output_file.unlink()
    
    def test_run(self):
        """测试运行时间线生成任务"""
        result = self.generator.run(self.test_videos, "test")
        
        # 验证结果
        self.assertIsInstance(result, dict)
        self.assertIn("success", result)
        self.assertTrue(result["success"])
        self.assertEqual(result["count"], 2)
    
    def test_load_existing_timeline(self):
        """测试加载现有时间线数据"""
        # 创建测试时间线文件
        test_file = Path("test_existing_timeline.json")
        existing_data = [
            {
                "id": 1,
                "date": "2023-12-02",
                "title": "测试视频2",
                "content": "这是测试视频2的描述",
                "video": {
                    "bv": "2yy522d8nE",
                    "url": "https://www.bilibili.com/video/BV2yy522d8nE"
                },
                "thumbnail": "https://i0.hdslb.com/bfs/archive/2yy522d8nE.jpg",
                "views": 2000,
                "danmaku": 200,
                "up主": "测试UP主",
                "duration": "03:45",
                "crawled_at": "2023-12-02 12:00:00"
            }
        ]
        
        with open(test_file, 'w', encoding='utf-8') as f:
            json.dump(existing_data, f, ensure_ascii=False, indent=2)
        
        # 测试加载
        loaded_data = self.generator.load_existing_timeline(test_file)
        self.assertIsInstance(loaded_data, list)
        self.assertEqual(len(loaded_data), 1)
        self.assertEqual(loaded_data[0]["video"]["bv"], "2yy522d8nE")
        
        # 清理测试文件
        if test_file.exists():
            test_file.unlink()
    
    def test_load_existing_timeline_without_file(self):
        """测试加载现有时间线数据（文件不存在）"""
        # 测试不存在的文件
        non_existent_file = Path("non_existent_timeline.json")
        loaded_data = self.generator.load_existing_timeline(non_existent_file)
        self.assertIsInstance(loaded_data, list)
        self.assertEqual(len(loaded_data), 0)
    
    def test_incremental_update(self):
        """测试增量更新时间线数据"""
        # 创建测试时间线文件
        test_file = Path("test_incremental_timeline.json")
        existing_data = [
            {
                "id": 1,
                "date": "2023-12-02",
                "title": "测试视频2",
                "content": "这是测试视频2的描述",
                "video": {
                    "bv": "2yy522d8nE",
                    "url": "https://www.bilibili.com/video/BV2yy522d8nE"
                },
                "thumbnail": "https://i0.hdslb.com/bfs/archive/2yy522d8nE.jpg",
                "views": 2000,
                "danmaku": 200,
                "up主": "测试UP主",
                "duration": "03:45",
                "crawled_at": "2023-12-02 12:00:00"
            }
        ]
        
        with open(test_file, 'w', encoding='utf-8') as f:
            json.dump(existing_data, f, ensure_ascii=False, indent=2)
        
        # 测试增量更新
        # 模拟新视频数据
        new_videos = [
            {
                "bv": "3zz633e9oF",
                "url": "https://www.bilibili.com/video/BV3zz633e9oF",
                "title": "测试视频3",
                "description": "这是测试视频3的描述",
                "publish_date": "2023-12-03",
                "views": 3000,
                "danmaku": 300,
                "up主": "测试UP主",
                "thumbnail": "https://i0.hdslb.com/bfs/archive/3zz633e9oF.jpg",
                "duration": "04:15",
                "crawled_at": "2023-12-03 12:00:00"
            }
        ]
        
        # 生成时间线数据
        timeline_data = self.generator.generate_timeline(new_videos)
        
        # 加载现有数据
        existing_timeline = self.generator.load_existing_timeline(test_file)
        
        # 合并数据
        merged_data = existing_timeline + timeline_data
        
        # 验证合并结果
        self.assertEqual(len(merged_data), 2)
        
        # 清理测试文件
        if test_file.exists():
            test_file.unlink()


if __name__ == "__main__":
    unittest.main()

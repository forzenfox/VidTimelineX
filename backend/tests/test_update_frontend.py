#!/usr/bin/env python3
"""
前端文件更新功能测试
"""

import os
import json
import shutil
import tempfile
import unittest
from pathlib import Path
from src.updater.frontend_updater import merge_videos_json, update_frontend_files


class TestFrontendUpdater(unittest.TestCase):
    """前端文件更新功能测试类"""

    def setUp(self):
        """设置测试环境"""
        # 创建临时目录
        self.test_dir = tempfile.TemporaryDirectory()
        self.test_path = Path(self.test_dir.name)
        
        # 创建后端数据目录
        self.backend_data_dir = self.test_path / "backend_data"
        self.backend_data_dir.mkdir()
        
        # 创建前端数据目录
        self.frontend_data_dir = self.test_path / "frontend_data"
        self.frontend_data_dir.mkdir()
        
        # 创建前端 thumbs 目录
        self.frontend_thumbs_dir = self.frontend_data_dir / "public" / "thumbs"
        self.frontend_thumbs_dir.mkdir(parents=True)
        
        # 创建前端 features 目录结构
        self.lvjiang_data_dir = self.frontend_data_dir / "src" / "features" / "lvjiang" / "data"
        self.lvjiang_data_dir.mkdir(parents=True)
        
        self.tiantong_data_dir = self.frontend_data_dir / "src" / "features" / "tiantong" / "data"
        self.tiantong_data_dir.mkdir(parents=True)
        
        # 创建测试数据
        self._create_test_data()

    def tearDown(self):
        """清理测试环境"""
        self.test_dir.cleanup()

    def _create_test_data(self):
        """创建测试数据"""
        # 后端 lvjiang videos.json
        backend_lvjiang_data = [
            {
                "id": "1",
                "date": "2026-01-26",
                "title": "测试视频1",
                "videoUrl": "https://www.bilibili.com/video/BV1234567890",
                "cover": "BV1234567890.jpg",
                "cover_url": "https://example.com/cover1.jpg",
                "tags": [],
                "duration": "01:00"
            },
            {
                "id": "2",
                "date": "2026-01-25",
                "title": "测试视频2",
                "videoUrl": "https://www.bilibili.com/video/BV0987654321",
                "cover": "BV0987654321.jpg",
                "cover_url": "https://example.com/cover2.jpg",
                "tags": [],
                "duration": "02:00"
            }
        ]
        
        backend_lvjiang_file = self.backend_data_dir / "lvjiang" / "videos.json"
        backend_lvjiang_file.parent.mkdir()
        with open(backend_lvjiang_file, 'w', encoding='utf-8') as f:
            json.dump(backend_lvjiang_data, f, ensure_ascii=False, indent=2)
        
        # 前端 lvjiang videos.json（带 tags）
        frontend_lvjiang_data = [
            {
                "id": "1",
                "date": "2026-01-26",
                "title": "旧测试视频1",
                "videoUrl": "https://www.bilibili.com/video/BV1234567890",
                "cover": "BV1234567890.jpg",
                "cover_url": "https://example.com/old_cover1.jpg",
                "tags": ["tag1", "tag2"],
                "duration": "01:00"
            }
        ]
        
        frontend_lvjiang_file = self.lvjiang_data_dir / "videos.json"
        with open(frontend_lvjiang_file, 'w', encoding='utf-8') as f:
            json.dump(frontend_lvjiang_data, f, ensure_ascii=False, indent=2)
        
        # 创建后端封面图片
        backend_thumbs_dir = self.backend_data_dir / "lvjiang" / "thumbs"
        backend_thumbs_dir.mkdir()
        
        # 创建测试图片文件
        with open(backend_thumbs_dir / "BV1234567890.jpg", 'wb') as f:
            f.write(b'test image 1')
        
        with open(backend_thumbs_dir / "BV0987654321.jpg", 'wb') as f:
            f.write(b'test image 2')

    def test_merge_videos_json(self):
        """测试 videos.json 合并功能"""
        backend_file = self.backend_data_dir / "lvjiang" / "videos.json"
        frontend_file = self.lvjiang_data_dir / "videos.json"
        
        # 执行合并
        result = merge_videos_json(backend_file, frontend_file)
        
        # 验证结果
        self.assertTrue(result['success'])
        self.assertEqual(result['merged_count'], 2)
        
        # 检查合并后的数据
        with open(frontend_file, 'r', encoding='utf-8') as f:
            merged_data = json.load(f)
        
        self.assertEqual(len(merged_data), 2)
        
        # 验证第一个视频保留了 tags
        video1 = merged_data[0]
        self.assertEqual(video1['title'], "测试视频1")  # 标题应该被更新
        self.assertEqual(video1['tags'], ["tag1", "tag2"])  # tags 应该被保留
        
        # 验证第二个视频是新增的
        video2 = merged_data[1]
        self.assertEqual(video2['title'], "测试视频2")
        self.assertEqual(video2['tags'], [])  # 新增视频没有 tags



    def test_update_frontend_files(self):
        """测试完整的前端文件更新功能"""
        # 构造配置
        config = {
            'backend_data_dir': str(self.backend_data_dir),
            'frontend_data_dir': str(self.frontend_data_dir)
        }
        
        # 执行更新
        result = update_frontend_files('lvjiang', config)
        
        # 验证结果
        self.assertTrue(result['success'])
        self.assertTrue('merge_result' in result)
        
        # 检查 videos.json 是否更新
        frontend_file = self.lvjiang_data_dir / "videos.json"
        with open(frontend_file, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        self.assertEqual(len(data), 2)


if __name__ == '__main__':
    unittest.main()

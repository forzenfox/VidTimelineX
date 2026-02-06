#!/usr/bin/env python3
"""
封面下载模块测试 - TDD 方式
测试新的 bv 字段使用和 WebP 转换功能
"""

import pytest
import sys
import json
import tempfile
import shutil
from pathlib import Path
from unittest.mock import patch, MagicMock

# 添加 src 到路径
sys.path.insert(0, str(Path(__file__).parent.parent / 'src'))

from downloader.download_thumbs import (
    download_cover,
    download_all_covers,
    convert_to_webp,
    get_existing_cover_filename,
    extract_bvid
)


class TestExtractBvid:
    """测试 BV 号提取功能"""
    
    def test_extract_bvid_from_video_url(self):
        """测试从 videoUrl 提取 BV 号"""
        url = "https://www.bilibili.com/video/BV1XCffBPEj4"
        result = extract_bvid(url)
        assert result == "BV1XCffBPEj4"
    
    def test_extract_bvid_from_cover_field(self):
        """测试从 cover 字段提取 BV 号"""
        cover = "BV1XCffBPEj4.jpg"
        result = extract_bvid(cover)
        assert result == "BV1XCffBPEj4"
    
    def test_extract_bvid_from_av_url_returns_none(self):
        """测试从 av 号 URL 提取返回 None"""
        url = "https://www.bilibili.com/video/av116012955473501"
        result = extract_bvid(url)
        assert result is None


class TestDownloadCover:
    """测试单个封面下载功能"""
    
    def setup_method(self):
        """每个测试方法前执行"""
        self.temp_dir = Path(tempfile.mkdtemp())
    
    def teardown_method(self):
        """每个测试方法后执行"""
        if self.temp_dir.exists():
            shutil.rmtree(self.temp_dir)
    
    @patch('downloader.download_thumbs.download_binary')
    def test_download_cover_uses_bv_field(self, mock_download):
        """测试使用 bv 字段下载封面"""
        # Arrange
        video = {
            'bv': 'BV1XCffBPEj4',
            'cover_url': 'https://i2.hdslb.com/bfs/archive/test.jpg',
            'videoUrl': 'https://www.bilibili.com/video/av116012955473501'  # av 号格式
        }
        mock_download.return_value = True
        
        # Act
        result = download_cover(video, self.temp_dir, quiet=True, enable_webp_conversion=False)
        
        # Assert
        assert result['status'] == 'success'
        assert result['bvid'] == 'BV1XCffBPEj4'
    
    @patch('downloader.download_thumbs.download_binary')
    def test_download_cover_fallback_to_cover_field(self, mock_download):
        """测试当 bv 字段缺失时，从 cover 字段提取"""
        # Arrange
        video = {
            'cover': 'BV1XCffBPEj4.jpg',
            'cover_url': 'https://i2.hdslb.com/bfs/archive/test.jpg',
            'videoUrl': 'https://www.bilibili.com/video/av116012955473501'
        }
        mock_download.return_value = True
        
        # Act
        result = download_cover(video, self.temp_dir, quiet=True, enable_webp_conversion=False)
        
        # Assert
        assert result['status'] == 'success'
        assert result['bvid'] == 'BV1XCffBPEj4'
    
    def test_download_cover_skips_existing(self):
        """测试跳过已存在的封面"""
        # Arrange
        video = {
            'bv': 'BV1XCffBPEj4',
            'cover_url': 'https://i2.hdslb.com/bfs/archive/test.jpg'
        }
        # 创建已存在的封面文件
        existing_file = self.temp_dir / 'BV1XCffBPEj4.jpg'
        existing_file.write_bytes(b'fake image data')
        
        # Act
        result = download_cover(video, self.temp_dir, quiet=True)
        
        # Assert
        assert result['status'] == 'skipped'
        assert result['bvid'] == 'BV1XCffBPEj4'
    
    def test_download_cover_returns_actual_filename(self):
        """测试返回实际文件名用于更新 cover 字段"""
        # Arrange
        video = {
            'bv': 'BV1XCffBPEj4',
            'cover_url': 'https://i2.hdslb.com/bfs/archive/test.jpg'
        }
        
        # Act - 使用模拟下载
        with patch('downloader.download_thumbs.download_binary') as mock_download:
            mock_download.return_value = True
            result = download_cover(video, self.temp_dir, quiet=True, enable_webp_conversion=False)
        
        # Assert
        assert result['status'] == 'success'
        assert result['cover'] == result['filename']
        assert result['cover'] is not None
    
    def test_download_cover_fails_without_bv(self):
        """测试没有 BV 号时下载失败"""
        # Arrange
        video = {
            'cover_url': 'https://i2.hdslb.com/bfs/archive/test.jpg',
            'videoUrl': 'https://www.bilibili.com/video/av116012955473501'
        }
        
        # Act
        result = download_cover(video, self.temp_dir, quiet=True)
        
        # Assert
        assert result['status'] == 'failed'
        assert result['bvid'] is None


class TestConvertToWebp:
    """测试 WebP 转换功能"""
    
    def setup_method(self):
        """每个测试方法前执行"""
        self.temp_dir = Path(tempfile.mkdtemp())
    
    def teardown_method(self):
        """每个测试方法后执行"""
        if self.temp_dir.exists():
            shutil.rmtree(self.temp_dir)
    
    def test_convert_jpg_to_webp(self):
        """测试 JPG 转换为 WebP"""
        # 创建一个简单的测试图片
        try:
            from PIL import Image
            
            # Arrange
            input_path = self.temp_dir / 'test.jpg'
            output_path = self.temp_dir / 'test.webp'
            
            # 创建测试图片
            img = Image.new('RGB', (100, 100), color='red')
            img.save(input_path, 'JPEG')
            
            # Act
            result = convert_to_webp(input_path, output_path)
            
            # Assert
            assert result is True
            assert output_path.exists()
            assert output_path.suffix == '.webp'
        except ImportError:
            pytest.skip("PIL not installed")
    
    def test_convert_png_to_webp(self):
        """测试 PNG 转换为 WebP"""
        try:
            from PIL import Image
            
            # Arrange
            input_path = self.temp_dir / 'test.png'
            output_path = self.temp_dir / 'test.webp'
            
            # 创建测试图片
            img = Image.new('RGB', (100, 100), color='blue')
            img.save(input_path, 'PNG')
            
            # Act
            result = convert_to_webp(input_path, output_path)
            
            # Assert
            assert result is True
            assert output_path.exists()
        except ImportError:
            pytest.skip("PIL not installed")


class TestDownloadAllCovers:
    """测试批量下载功能"""
    
    def setup_method(self):
        """每个测试方法前执行"""
        self.temp_dir = Path(tempfile.mkdtemp())
        self.thumbs_dir = self.temp_dir / 'thumbs'
        self.thumbs_dir.mkdir()
        
        # 创建测试用的 videos.json
        self.videos_data = [
            {
                'id': '1',
                'bv': 'BV1XCffBPEj4',
                'cover': '',
                'cover_url': 'https://i2.hdslb.com/bfs/archive/test1.jpg',
                'title': '视频1'
            },
            {
                'id': '2',
                'bv': 'BV2XXXXXXX',
                'cover': '',
                'cover_url': 'https://i2.hdslb.com/bfs/archive/test2.jpg',
                'title': '视频2'
            }
        ]
        self.videos_json_path = self.temp_dir / 'videos.json'
        with open(self.videos_json_path, 'w', encoding='utf-8') as f:
            json.dump(self.videos_data, f, ensure_ascii=False, indent=2)
    
    def teardown_method(self):
        """每个测试方法后执行"""
        if self.temp_dir.exists():
            shutil.rmtree(self.temp_dir)
    
    @patch('downloader.download_thumbs.download_binary')
    def test_download_all_covers_updates_videos_json(self, mock_download):
        """测试下载后更新 videos.json 的 cover 字段"""
        # Arrange
        mock_download.return_value = True
        
        # Act
        result = download_all_covers(
            self.videos_json_path,
            self.thumbs_dir,
            quiet=True,
            max_workers=1,
            update_videos_json=True,
            enable_webp_conversion=False
        )
        
        # Assert
        assert result['success'] == 2
        
        # 验证 videos.json 被更新
        with open(self.videos_json_path, 'r', encoding='utf-8') as f:
            updated_data = json.load(f)
        
        assert updated_data[0]['cover'] != ''
        assert updated_data[1]['cover'] != ''
    
    @patch('downloader.download_thumbs.download_binary')
    def test_download_all_covers_skips_existing(self, mock_download):
        """测试跳过已存在的封面"""
        # Arrange - 创建一个已存在的封面
        existing_file = self.thumbs_dir / 'BV1XCffBPEj4.jpg'
        existing_file.write_bytes(b'fake image data')
        mock_download.return_value = True
        
        # Act
        result = download_all_covers(
            self.videos_json_path,
            self.thumbs_dir,
            quiet=True,
            max_workers=1,
            enable_webp_conversion=False
        )
        
        # Assert
        assert result['skipped'] >= 1
        assert result['success'] == 1  # 只有第二个视频需要下载


class TestGetExistingCoverFilename:
    """测试获取已存在封面文件名功能"""
    
    def setup_method(self):
        """每个测试方法前执行"""
        self.temp_dir = Path(tempfile.mkdtemp())
    
    def teardown_method(self):
        """每个测试方法后执行"""
        if self.temp_dir.exists():
            shutil.rmtree(self.temp_dir)
    
    def test_get_existing_jpg_filename(self):
        """测试获取已存在的 jpg 文件名"""
        # Arrange
        bvid = 'BV1XCffBPEj4'
        existing_file = self.temp_dir / f'{bvid}.jpg'
        existing_file.write_bytes(b'fake image data')
        
        # Act
        result = get_existing_cover_filename(self.temp_dir, bvid)
        
        # Assert
        assert result == f'{bvid}.jpg'
    
    def test_get_existing_webp_filename(self):
        """测试获取已存在的 webp 文件名"""
        # Arrange
        bvid = 'BV1XCffBPEj4'
        existing_file = self.temp_dir / f'{bvid}.webp'
        existing_file.write_bytes(b'fake image data')
        
        # Act
        result = get_existing_cover_filename(self.temp_dir, bvid)
        
        # Assert
        assert result == f'{bvid}.webp'
    
    def test_get_nonexistent_filename_returns_none(self):
        """测试获取不存在的封面返回 None"""
        # Arrange
        bvid = 'BV1XCffBPEj4'
        
        # Act
        result = get_existing_cover_filename(self.temp_dir, bvid)
        
        # Assert
        assert result is None


if __name__ == '__main__':
    pytest.main([__file__, '-v'])

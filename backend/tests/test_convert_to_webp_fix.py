#!/usr/bin/env python3
"""
测试 convert_to_webp 命名冲突修复
"""

import pytest
import sys
import tempfile
import shutil
from pathlib import Path
from unittest.mock import patch

sys.path.insert(0, str(Path(__file__).parent.parent / 'src'))

from downloader.download_thumbs import download_cover, download_all_covers


class TestConvertToWebpFix:
    """测试 convert_to_webp 命名冲突修复"""
    
    def setup_method(self):
        self.temp_dir = Path(tempfile.mkdtemp())
    
    def teardown_method(self):
        if self.temp_dir.exists():
            shutil.rmtree(self.temp_dir)
    
    @patch('downloader.download_thumbs.download_binary')
    def test_download_cover_with_webp_conversion_enabled(self, mock_download):
        """测试启用 WebP 转换的下载 - 使用新参数名 enable_webp_conversion"""
        video = {
            'bv': 'BV1XCffBPEj4',
            'cover_url': 'https://i2.hdslb.com/bfs/archive/test.jpg'
        }
        mock_download.return_value = True
        
        # 使用新参数名 enable_webp_conversion
        result = download_cover(video, self.temp_dir, quiet=True, enable_webp_conversion=True)
        
        assert result['status'] == 'success'
        assert result['bvid'] == 'BV1XCffBPEj4'
    
    @patch('downloader.download_thumbs.download_binary')
    def test_download_cover_with_webp_conversion_disabled(self, mock_download):
        """测试禁用 WebP 转换的下载 - 使用新参数名 enable_webp_conversion"""
        video = {
            'bv': 'BV1XCffBPEj4',
            'cover_url': 'https://i2.hdslb.com/bfs/archive/test.jpg'
        }
        mock_download.return_value = True
        
        # 使用新参数名 enable_webp_conversion
        result = download_cover(video, self.temp_dir, quiet=True, enable_webp_conversion=False)
        
        assert result['status'] == 'success'
        assert result['bvid'] == 'BV1XCffBPEj4'
    
    @patch('downloader.download_thumbs.download_binary')
    def test_download_cover_default_webp_conversion(self, mock_download):
        """测试默认 WebP 转换行为"""
        video = {
            'bv': 'BV1XCffBPEj4',
            'cover_url': 'https://i2.hdslb.com/bfs/archive/test.jpg'
        }
        mock_download.return_value = True
        
        # 不传递 enable_webp_conversion 参数，使用默认值
        result = download_cover(video, self.temp_dir, quiet=True)
        
        assert result['status'] == 'success'
        assert result['bvid'] == 'BV1XCffBPEj4'


if __name__ == '__main__':
    pytest.main([__file__, '-v'])

#!/usr/bin/env python3
"""
TimelineGenerator 测试 - TDD 方式
测试新的 bv 和 author 字段
"""

import pytest
import sys
from pathlib import Path
from datetime import datetime

# 添加 src 到路径
sys.path.insert(0, str(Path(__file__).parent.parent / 'src'))

from crawler.timeline_generator import TimelineGenerator


class TestTimelineGenerator:
    """TimelineGenerator 测试类"""
    
    def setup_method(self):
        """每个测试方法前执行"""
        self.generator = TimelineGenerator()
    
    def test_generate_timeline_includes_bv_field(self):
        """测试生成的时间线包含 bv 字段"""
        # Arrange
        videos = [
            {
                'bv': 'BV1XCffBPEj4',
                'title': '测试视频',
                'url': 'https://www.bilibili.com/video/av116012955473501',
                'thumbnail': 'https://example.com/cover.jpg',
                'publish_date': '2026-02-04',
                'duration': '7:16',
                'author': '测试作者'
            }
        ]
        
        # Act
        result = self.generator.generate_timeline(videos)
        
        # Assert
        assert len(result) == 1
        assert result[0]['bv'] == 'BV1XCffBPEj4'
    
    def test_generate_timeline_includes_author_field(self):
        """测试生成的时间线包含 author 字段"""
        # Arrange
        videos = [
            {
                'bv': 'BV1XCffBPEj4',
                'title': '测试视频',
                'url': 'https://www.bilibili.com/video/av116012955473501',
                'thumbnail': 'https://example.com/cover.jpg',
                'publish_date': '2026-02-04',
                'duration': '7:16',
                'author': '测试作者'
            }
        ]
        
        # Act
        result = self.generator.generate_timeline(videos)
        
        # Assert
        assert len(result) == 1
        assert result[0]['author'] == '测试作者'
    
    def test_generate_timeline_default_cover(self):
        """测试 cover 字段默认使用BV号作为文件名"""
        # Arrange
        videos = [
            {
                'bv': 'BV1XCffBPEj4',
                'title': '测试视频',
                'url': 'https://www.bilibili.com/video/av116012955473501',
                'thumbnail': 'https://i2.hdslb.com/bfs/archive/test.jpg',
                'publish_date': '2026-02-04',
                'duration': '7:16',
                'author': '测试作者'
            }
        ]
        
        # Act
        result = self.generator.generate_timeline(videos)
        
        # Assert
        assert len(result) == 1
        assert result[0]['cover'] == 'BV1XCffBPEj4.webp'
    
    def test_generate_timeline_preserves_cover_url(self):
        """测试 cover_url 字段被正确保留"""
        # Arrange
        videos = [
            {
                'bv': 'BV1XCffBPEj4',
                'title': '测试视频',
                'url': 'https://www.bilibili.com/video/av116012955473501',
                'thumbnail': 'https://i2.hdslb.com/bfs/archive/test.jpg',
                'publish_date': '2026-02-04',
                'duration': '7:16',
                'author': '测试作者'
            }
        ]
        
        # Act
        result = self.generator.generate_timeline(videos)
        
        # Assert
        assert len(result) == 1
        assert result[0]['cover_url'] == 'https://i2.hdslb.com/bfs/archive/test.jpg'
    
    def test_generate_timeline_handles_missing_author(self):
        """测试处理缺少 author 字段的情况"""
        # Arrange
        videos = [
            {
                'bv': 'BV1XCffBPEj4',
                'title': '测试视频',
                'url': 'https://www.bilibili.com/video/av116012955473501',
                'thumbnail': 'https://example.com/cover.jpg',
                'publish_date': '2026-02-04',
                'duration': '7:16'
                # 注意：没有 author 字段
            }
        ]
        
        # Act
        result = self.generator.generate_timeline(videos)
        
        # Assert
        assert len(result) == 1
        assert result[0]['author'] == ''  # 应该默认为空字符串
    
    def test_generate_timeline_multiple_videos(self):
        """测试生成多个视频的时间线"""
        # Arrange
        videos = [
            {
                'bv': 'BV1XCffBPEj4',
                'title': '视频1',
                'url': 'https://www.bilibili.com/video/av1',
                'thumbnail': 'https://example.com/cover1.jpg',
                'publish_date': '2026-02-04',
                'duration': '7:16',
                'author': '作者1'
            },
            {
                'bv': 'BV2XXXXXXX',
                'title': '视频2',
                'url': 'https://www.bilibili.com/video/av2',
                'thumbnail': 'https://example.com/cover2.jpg',
                'publish_date': '2026-02-03',
                'duration': '5:30',
                'author': '作者2'
            }
        ]
        
        # Act
        result = self.generator.generate_timeline(videos)
        
        # Assert
        assert len(result) == 2
        assert result[0]['bv'] == 'BV1XCffBPEj4'
        assert result[0]['author'] == '作者1'
        assert result[1]['bv'] == 'BV2XXXXXXX'
        assert result[1]['author'] == '作者2'


if __name__ == '__main__':
    pytest.main([__file__, '-v'])

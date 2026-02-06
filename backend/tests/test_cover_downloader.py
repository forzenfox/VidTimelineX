#!/usr/bin/env python3
"""
封面下载器测试

测试封面下载功能，包括HTML解析、文件下载等功能。
参考原 backend/src/downloader/download_thumbs.py 实现。
"""

import unittest
import tempfile
import shutil
from pathlib import Path
from unittest.mock import Mock, patch, MagicMock


class TestCoverDownloader(unittest.TestCase):
    """封面下载器测试类"""

    def setUp(self):
        """测试初始化"""
        self.test_dir = tempfile.mkdtemp()
        self.thumbs_dir = Path(self.test_dir) / "thumbs"
        self.thumbs_dir.mkdir()

    def tearDown(self):
        """测试清理"""
        if Path(self.test_dir).exists():
            shutil.rmtree(self.test_dir)

    def test_get_og_image_from_html(self):
        """测试从HTML中提取og:image URL"""
        from src.downloader.download_thumbs import get_og_image

        html_with_og_image = '''
        <html>
        <head>
            <meta property="og:image" content="https://i0.hdslb.com/bfs/archive/test.jpg">
        </head>
        <body></body>
        </html>
        '''
        result = get_og_image(html_with_og_image)
        self.assertEqual(result, "https://i0.hdslb.com/bfs/archive/test.jpg")

    def test_get_og_image_from_twitter_meta(self):
        """测试从twitter:image元标签提取URL"""
        from src.downloader.download_thumbs import get_og_image

        html_with_twitter = '''
        <html>
        <head>
            <meta name="twitter:image" content="https://i0.hdslb.com/bfs/archive/twitter.jpg">
        </head>
        <body></body>
        </html>
        '''
        result = get_og_image(html_with_twitter)
        self.assertEqual(result, "https://i0.hdslb.com/bfs/archive/twitter.jpg")

    def test_get_og_image_from_pic_json(self):
        """测试从页面JSON提取pic字段"""
        from src.downloader.download_thumbs import get_og_image

        html_with_pic = '''
        <html>
        <head></head>
        <body><script>window.__INITIAL_STATE__={"videoData":{"pic":"//i0.hdslb.com/bfs/archive/pic.jpg"}}</script></body>
        </html>
        '''
        result = get_og_image(html_with_pic)
        self.assertEqual(result, "//i0.hdslb.com/bfs/archive/pic.jpg")

    def test_get_og_image_not_found(self):
        """测试未找到封面URL的情况"""
        from src.downloader.download_thumbs import get_og_image

        html_without_image = '''
        <html>
        <head><title>Test</title></head>
        <body></body>
        </html>
        '''
        result = get_og_image(html_without_image)
        self.assertIsNone(result)

    def test_sanitize_extraction_jpg(self):
        """测试从URL提取.jpg扩展名"""
        from src.downloader.download_thumbs import sanitize_ext

        result = sanitize_ext("https://i0.hdslb.com/bfs/archive/test.jpg")
        self.assertEqual(result, ".jpg")

    def test_sanitize_extraction_png(self):
        """测试从URL提取.png扩展名"""
        from src.downloader.download_thumbs import sanitize_ext

        result = sanitize_ext("https://i0.hdslb.com/bfs/archive/test.png")
        self.assertEqual(result, ".png")

    def test_sanitize_extraction_no_ext(self):
        """测试URL没有扩展名的情况"""
        from src.downloader.download_thumbs import sanitize_ext

        result = sanitize_ext("https://i0.hdslb.com/bfs/archive/test")
        self.assertEqual(result, ".jpg")

    def test_ensure_protocol_http(self):
        """测试确保URL有正确协议（已有http）"""
        from src.downloader.download_thumbs import ensure_protocol

        result = ensure_protocol("http://example.com/test.jpg")
        self.assertEqual(result, "http://example.com/test.jpg")

    def test_ensure_protocol_https(self):
        """测试确保URL有正确协议（已有https）"""
        from src.downloader.download_thumbs import ensure_protocol

        result = ensure_protocol("https://example.com/test.jpg")
        self.assertEqual(result, "https://example.com/test.jpg")

    def test_ensure_protocol_double_slash(self):
        """测试确保URL有正确协议（双斜杠开头）"""
        from src.downloader.download_thumbs import ensure_protocol

        result = ensure_protocol("//example.com/test.jpg")
        self.assertEqual(result, "https://example.com/test.jpg")

    def test_extract_bvid(self):
        """测试从URL提取BV号"""
        from src.downloader.download_thumbs import extract_bvid

        result = extract_bvid("https://www.bilibili.com/video/BV19YzYBjELJ")
        self.assertEqual(result, "BV19YzYBjELJ")

    def test_extract_bvid_no_match(self):
        """测试URL中没有BV号"""
        from src.downloader.download_thumbs import extract_bvid

        result = extract_bvid("https://www.example.com/video/123")
        self.assertIsNone(result)

    def test_choose_filename(self):
        """测试生成封面文件名"""
        from src.downloader.download_thumbs import choose_filename

        result = choose_filename("BV19YzYBjELJ", ".jpg")
        self.assertEqual(result, "BV19YzYBjELJ.jpg")

    def test_choose_filename_png(self):
        """测试生成png封面文件名"""
        from src.downloader.download_thumbs import choose_filename

        result = choose_filename("BV19YzYBjELJ", ".png")
        self.assertEqual(result, "BV19YzYBjELJ.png")

    def test_is_cover_exists_true(self):
        """测试封面已存在的情况"""
        from src.downloader.download_thumbs import is_cover_exists

        cover_file = self.thumbs_dir / "BV19YzYBjELJ.jpg"
        cover_file.write_text("fake image content")

        result = is_cover_exists(self.thumbs_dir, "BV19YzYBjELJ")
        self.assertTrue(result)

    def test_is_cover_exists_false(self):
        """测试封面不存在的情况"""
        from src.downloader.download_thumbs import is_cover_exists

        result = is_cover_exists(self.thumbs_dir, "BV19YzYBjELJ")
        self.assertFalse(result)

    def test_is_cover_exists_with_different_ext(self):
        """测试封面存在但扩展名不同"""
        from src.downloader.download_thumbs import is_cover_exists

        cover_file = self.thumbs_dir / "BV19YzYBjELJ.png"
        cover_file.write_text("fake image content")

        result = is_cover_exists(self.thumbs_dir, "BV19YzYBjELJ")
        self.assertTrue(result)

    def test_download_binary_success(self):
        """测试成功下载二进制文件"""
        from src.downloader.download_thumbs import download_binary

        mock_response = Mock()
        mock_response.iter_content = Mock(return_value=[b"fake", b"image", b"data"])
        mock_response.__enter__ = Mock(return_value=mock_response)
        mock_response.__exit__ = Mock(return_value=False)

        with patch('requests.get', return_value=mock_response):
            result = download_binary(
                "https://i0.hdslb.com/bfs/archive/test.jpg",
                self.thumbs_dir / "test.jpg"
            )
            self.assertTrue(result)

    def test_download_binary_failure(self):
        """测试下载二进制文件失败"""
        from src.downloader.download_thumbs import download_binary

        with patch('requests.get', side_effect=Exception("Network error")):
            result = download_binary(
                "https://i0.hdslb.com/bfs/archive/test.jpg",
                self.thumbs_dir / "test.jpg"
            )
            self.assertFalse(result)

    def test_get_cover_filename_with_ext(self):
        """测试根据视频信息生成封面文件名（带扩展名）"""
        from src.downloader.download_thumbs import get_cover_filename

        html = '''
        <html>
        <head>
            <meta property="og:image" content="https://i0.hdslb.com/bfs/archive/test.png">
        </head>
        </html>
        '''
        result = get_cover_filename("BV19YzYBjELJ", html)
        self.assertEqual(result, "BV19YzYBjELJ.png")

    def test_get_cover_filename_default_ext(self):
        """测试根据视频信息生成封面文件名（默认jpg）"""
        from src.downloader.download_thumbs import get_cover_filename

        html = '<html><head></head></html>'
        result = get_cover_filename("BV19YzYBjELJ", html)
        self.assertEqual(result, "BV19YzYBjELJ.jpg")

    def test_download_cover_success(self):
        """测试下载单个视频封面成功"""
        from src.downloader.download_thumbs import download_cover

        video = {
            "bv": "BV19YzYBjELJ",
            "cover_url": "https://i0.hdslb.com/bfs/archive/test.jpg"
        }

        mock_img_response = Mock()
        mock_img_response.iter_content = Mock(return_value=[b"fake", b"image", b"data"])
        mock_img_response.__enter__ = Mock(return_value=mock_img_response)
        mock_img_response.__exit__ = Mock(return_value=False)

        with patch('requests.get', return_value=mock_img_response):
            result = download_cover(video, self.thumbs_dir, quiet=True)
            self.assertEqual(result['status'], 'success')
            self.assertEqual(result['bvid'], 'BV19YzYBjELJ')

    def test_download_cover_with_cover_url(self):
        """测试使用cover_url下载封面"""
        from src.downloader.download_thumbs import download_cover

        video = {
            "bv": "BV19YzYBjELJ",
            "cover_url": "https://i0.hdslb.com/bfs/archive/test_cover.jpg"
        }

        mock_img_response = Mock()
        mock_img_response.iter_content = Mock(return_value=[b"fake", b"image", b"data"])
        mock_img_response.__enter__ = Mock(return_value=mock_img_response)
        mock_img_response.__exit__ = Mock(return_value=False)

        with patch('requests.get', return_value=mock_img_response):
            result = download_cover(video, self.thumbs_dir, quiet=True)
            self.assertEqual(result['status'], 'success')
            self.assertEqual(result['bvid'], 'BV19YzYBjELJ')

    def test_download_cover_with_thumbnail_fallback(self):
        """测试使用thumbnail字段作为封面URL"""
        from src.downloader.download_thumbs import download_cover

        # 当cover_url不存在时，应该使用thumbnail字段
        video = {
            "bv": "BV19YzYBjELJ",
            "thumbnail": "https://i0.hdslb.com/bfs/archive/test.jpg"
        }

        mock_img_response = Mock()
        mock_img_response.iter_content = Mock(return_value=[b"fake", b"image", b"data"])
        mock_img_response.__enter__ = Mock(return_value=mock_img_response)
        mock_img_response.__exit__ = Mock(return_value=False)

        with patch('requests.get', return_value=mock_img_response):
            result = download_cover(video, self.thumbs_dir, quiet=True)
            self.assertEqual(result['status'], 'success')
            self.assertEqual(result['bvid'], 'BV19YzYBjELJ')

    def test_download_cover_already_exists(self):
        """测试封面已存在的情况"""
        from src.downloader.download_thumbs import download_cover

        video = {
            "videoUrl": "https://www.bilibili.com/video/BV19YzYBjELJ"
        }

        cover_file = self.thumbs_dir / "BV19YzYBjELJ.jpg"
        cover_file.write_text("fake image content")

        result = download_cover(video, self.thumbs_dir, quiet=True)
        self.assertEqual(result['status'], 'skipped')

    def test_download_all_covers(self):
        """测试批量下载所有视频封面"""
        from src.downloader.download_thumbs import download_all_covers

        videos_path = Path(self.test_dir) / "videos.json"
        videos_data = [
            {
                "bv": "BV19YzYBjELJ",
                "cover_url": "https://i0.hdslb.com/bfs/archive/BV19YzYBjELJ.jpg"
            },
            {
                "bv": "BV15NzrBBEJQ",
                "cover_url": "https://i0.hdslb.com/bfs/archive/BV15NzrBBEJQ.jpg"
            }
        ]

        with open(videos_path, 'w', encoding='utf-8') as f:
            import json
            json.dump(videos_data, f, ensure_ascii=False)

        def mock_get(url, **kwargs):
            img_response = Mock()
            img_response.iter_content = Mock(return_value=[b"fake", b"image"])
            img_response.__enter__ = Mock(return_value=img_response)
            img_response.__exit__ = Mock(return_value=False)
            return img_response

        with patch('requests.get', side_effect=mock_get):
            results = download_all_covers(videos_path, self.thumbs_dir, quiet=True)

            self.assertGreater(results['success'], 0)
            self.assertIn('BV19YzYBjELJ', results['downloaded_files'])

    def test_download_all_covers_with_concurrent(self):
        """测试并发下载所有视频封面"""
        from src.downloader.download_thumbs import download_all_covers

        videos_path = Path(self.test_dir) / "videos.json"
        videos_data = [
            {
                "videoUrl": "https://www.bilibili.com/video/BV19YzYBjELJ",
                "cover_url": "https://i0.hdslb.com/bfs/archive/BV19YzYBjELJ.jpg"
            },
            {
                "videoUrl": "https://www.bilibili.com/video/BV15NzrBBEJQ",
                "cover_url": "https://i0.hdslb.com/bfs/archive/BV15NzrBBEJQ.jpg"
            }
        ]

        with open(videos_path, 'w', encoding='utf-8') as f:
            import json
            json.dump(videos_data, f, ensure_ascii=False)

        mock_img_response = Mock()
        mock_img_response.iter_content = Mock(return_value=[b"fake", b"image"])
        mock_img_response.__enter__ = Mock(return_value=mock_img_response)
        mock_img_response.__exit__ = Mock(return_value=False)

        with patch('requests.get', return_value=mock_img_response):
            results = download_all_covers(videos_path, self.thumbs_dir, quiet=True, max_workers=2)

            self.assertGreater(results['success'], 0)
            self.assertIn('BV19YzYBjELJ', results['downloaded_files'])
            self.assertIn('BV15NzrBBEJQ', results['downloaded_files'])

    def test_download_all_covers_file_not_exists(self):
        """测试videos.json文件不存在"""
        from src.downloader.download_thumbs import download_all_covers

        videos_path = Path(self.test_dir) / "not_exists.json"

        results = download_all_covers(videos_path, self.thumbs_dir, quiet=True)

        self.assertEqual(results['success'], 0)
        self.assertEqual(results['failed'], 0)
        self.assertEqual(results['skipped'], 0)

    def test_get_existing_covers(self):
        """测试获取已存在的封面列表"""
        from src.downloader.download_thumbs import get_existing_covers

        # 创建测试图片文件
        cover_file1 = self.thumbs_dir / "BV19YzYBjELJ.jpg"
        cover_file1.write_text("fake image content")
        cover_file2 = self.thumbs_dir / "BV15NzrBBEJQ.png"
        cover_file2.write_text("fake image content")

        existing_covers = get_existing_covers(self.thumbs_dir)
        self.assertIsInstance(existing_covers, set)
        self.assertIn("BV19YzYBjELJ", existing_covers)
        self.assertIn("BV15NzrBBEJQ", existing_covers)

    def test_get_existing_covers_empty(self):
        """测试获取空目录的封面列表"""
        from src.downloader.download_thumbs import get_existing_covers

        existing_covers = get_existing_covers(self.thumbs_dir)
        self.assertIsInstance(existing_covers, set)
        self.assertEqual(len(existing_covers), 0)

    def test_batch_compare_covers(self):
        """测试批量对比封面"""
        from src.downloader.download_thumbs import get_existing_covers

        # 创建测试图片文件
        cover_file = self.thumbs_dir / "BV19YzYBjELJ.jpg"
        cover_file.write_text("fake image content")

        existing_covers = get_existing_covers(self.thumbs_dir)
        
        # 测试已存在的封面
        self.assertIn("BV19YzYBjELJ", existing_covers)
        # 测试不存在的封面
        self.assertNotIn("BV15NzrBBEJQ", existing_covers)


if __name__ == "__main__":
    unittest.main()

#!/usr/bin/env python3
"""
前端格式测试

验证时间线生成器的输出格式与前端 videos.json 保持一致。
目标格式参考: frontend/src/features/lvjiang/data/videos.json
"""

import unittest
import json
from pathlib import Path
from src.crawler.timeline_generator import TimelineGenerator


class TestFrontendFormat(unittest.TestCase):
    """前端格式测试类"""

    def setUp(self):
        """测试初始化"""
        self.generator = TimelineGenerator()
        self.test_videos = [
            {
                "bv": "BV19YzYBjELJ",
                "url": "https://www.bilibili.com/video/BV19YzYBjELJ",
                "title": "众多水友来洞主家里~真TM带劲！",
                "publish_date": "2026-01-26",
                "thumbnail": "https://i0.hdslb.com/bfs/archive/2ac0665ec159a258f7e698616569be38a0a025dd.jpg",
                "duration": "01:12"
            },
            {
                "bv": "BV15NzrBBEJQ",
                "url": "https://www.bilibili.com/video/BV15NzrBBEJQ",
                "title": "凯哥遇女水友",
                "publish_date": "2026-01-24",
                "thumbnail": "https://i1.hdslb.com/bfs/archive/1a3c9c865258529ff626993159af00d48270a249.jpg",
                "duration": "00:53"
            }
        ]

    def test_output_format_matches_frontend(self):
        """验证输出格式与前端 videos.json 一致"""
        timeline_data = self.generator.generate_timeline(self.test_videos)

        self.assertIsInstance(timeline_data, list)
        self.assertEqual(len(timeline_data), 2)

        for item in timeline_data:
            item_str = json.dumps(item, ensure_ascii=False)
            self.assertIn("id", item, f"缺少 id 字段: {item_str}")
            self.assertIn("title", item, f"缺少 title 字段: {item_str}")
            self.assertIn("date", item, f"缺少 date 字段: {item_str}")
            self.assertIn("videoUrl", item, f"缺少 videoUrl 字段: {item_str}")
            self.assertIn("cover", item, f"缺少 cover 字段: {item_str}")
            self.assertIn("cover_url", item, f"缺少 cover_url 字段: {item_str}")
            self.assertIn("tags", item, f"缺少 tags 字段: {item_str}")
            self.assertIn("duration", item, f"缺少 duration 字段: {item_str}")

    def test_id_is_string_type(self):
        """验证 id 字段为字符串类型"""
        timeline_data = self.generator.generate_timeline(self.test_videos)

        for item in timeline_data:
            self.assertIsInstance(
                item["id"], str,
                f"id 应该是字符串类型，实际为 {type(item['id']).__name__}: {item['id']}"
            )

    def test_videoUrl_format(self):
        """验证 videoUrl 格式正确"""
        timeline_data = self.generator.generate_timeline(self.test_videos)

        for item in timeline_data:
            self.assertTrue(
                item["videoUrl"].startswith("https://www.bilibili.com/video/"),
                f"videoUrl 格式错误: {item['videoUrl']}"
            )

    def test_no_nested_video_object(self):
        """验证不存在嵌套的 video 对象"""
        timeline_data = self.generator.generate_timeline(self.test_videos)

        for item in timeline_data:
            self.assertNotIn(
                "video", item,
                f"不应存在嵌套的 video 对象: {item}"
            )

    def test_no_incompatible_fields(self):
        """验证不包含不兼容的字段"""
        timeline_data = self.generator.generate_timeline(self.test_videos)

        incompatible_fields = ["content", "views", "danmaku", "up主", "crawled_at"]

        for item in timeline_data:
            for field in incompatible_fields:
                self.assertNotIn(
                    field, item,
                    f"不应包含不兼容字段 '{field}': {item}"
                )

    def test_cover_filename_format(self):
        """验证 cover 字段为文件名格式（不带路径）"""
        timeline_data = self.generator.generate_timeline(self.test_videos)

        for item in timeline_data:
            cover = item["cover"]
            self.assertTrue(
                cover.endswith(".jpg") or cover.endswith(".png"),
                f"cover 应该是图片文件名: {cover}"
            )
            self.assertNotIn(
                "/", cover,
                f"cover 不应包含路径分隔符: {cover}"
            )

    def test_tags_is_empty_list(self):
        """验证 tags 字段为空列表"""
        timeline_data = self.generator.generate_timeline(self.test_videos)

        for item in timeline_data:
            self.assertIsInstance(item["tags"], list)
            self.assertEqual(len(item["tags"]), 0)

    def test_sort_by_date_descending(self):
        """验证按日期降序排序"""
        timeline_data = self.generator.generate_timeline(self.test_videos)

        dates = [item["date"] for item in timeline_data]
        self.assertEqual(dates, sorted(dates, reverse=True))

    def test_duration_format(self):
        """验证 duration 格式正确"""
        timeline_data = self.generator.generate_timeline(self.test_videos)

        for item in timeline_data:
            duration = item["duration"]
            self.assertRegex(
                duration, r"^\d{2}:\d{2}$",
                f"duration 格式错误（应为 MM:SS）: {duration}"
            )

    def test_cover_url_is_valid_url(self):
        """验证 cover_url 是有效的 URL"""
        timeline_data = self.generator.generate_timeline(self.test_videos)

        for item in timeline_data:
            cover_url = item["cover_url"]
            self.assertTrue(
                cover_url.startswith("http://") or cover_url.startswith("https://"),
                f"cover_url 应该是有效 URL: {cover_url}"
            )

    def test_bvid_extracted_from_url(self):
        """验证 cover 文件名基于 BV 号"""
        timeline_data = self.generator.generate_timeline(self.test_videos)

        for item in timeline_data:
            cover = item["cover"]
            video_url = item["videoUrl"]
            self.assertIn("BV", cover)
            self.assertIn(video_url.split("/")[-1], cover)


if __name__ == "__main__":
    unittest.main()

/**
 * 视频测试数据
 * 提供测试用的视频数据
 */

import { Heart, Music, Smile, Zap } from "lucide-react";
import type { Video } from "@/features/tiantong/data/types";

export const mockVideos: Video[] = [
  {
    id: "1",
    title: "测试视频1",
    category: "sing",
    tags: ["测试"],
    cover: "https://example.com/cover1.jpg",
    date: "2024-01-01",
    views: "10万",
    icon: Heart,
    bvid: "BV1xx411c7mD",
    duration: "10:30",
  },
  {
    id: "2",
    title: "测试视频2",
    category: "dance",
    tags: ["测试", "舞蹈"],
    cover: "https://example.com/cover2.jpg",
    date: "2024-01-02",
    views: "20万",
    icon: Music,
    bvid: "BV1yy4y1B7Mm",
    duration: "12:45",
  },
  {
    id: "3",
    title: "测试视频3",
    category: "funny",
    tags: ["测试", "搞笑"],
    cover: "https://example.com/cover3.jpg",
    date: "2024-01-03",
    views: "30万",
    icon: Smile,
    bvid: "BV1zz4y1B7Mm",
    duration: "08:15",
  },
  {
    id: "4",
    title: "测试视频4",
    category: "sing",
    tags: ["测试", "唱歌"],
    cover: "https://example.com/cover4.jpg",
    date: "2024-01-04",
    views: "50万",
    icon: Zap,
    bvid: "BV1aa4y1B7Mm",
    duration: "15:20",
  },
];

export const mockVideo: Video = mockVideos[0];

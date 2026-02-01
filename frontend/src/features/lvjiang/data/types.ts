// 驴酱模块类型定义
export interface Video {
  id: string;
  title: string;
  date: string;
  videoUrl: string;
  cover: string;
  cover_url?: string; // B站CDN封面图URL（前端优先加载）
  tags: string[];
  duration: string;
  bvid?: string; // 视频BV号
}

export type Theme = "dongzhu" | "kaige";

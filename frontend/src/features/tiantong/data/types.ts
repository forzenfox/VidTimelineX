// 甜筒模块类型定义

export interface Video {
  id: string;
  title: string;
  date: string;
  videoUrl: string;
  bv: string; // 视频BV号（必填）
  cover: string;
  cover_url?: string; // B站CDN封面图URL（前端优先加载）
  tags: string[];
  duration: string;
  author?: string; // 视频作者（UP主）
  views?: string; // 观看次数
}

export interface Danmu {
  id: string;
  text: string;
  type: "normal" | "gift" | "super";
  user?: string;
  color?: string;
  colors?: {
    tiger: string;
    sweet: string;
  };
}

export type Theme = "tiger" | "sweet";

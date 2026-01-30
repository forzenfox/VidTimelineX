// 甜筒模块类型定义

export interface Video {
  id: string;
  title: string;
  date: string;
  videoUrl: string;
  cover: string;
  tags: string[];
  duration: string;
  category?: string;
  views?: string;
  icon?: string;
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

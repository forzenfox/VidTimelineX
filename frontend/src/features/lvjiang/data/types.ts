// 驴酱模块类型定义
export interface Video {
  id: string;
  title: string;
  date: string;
  videoUrl: string;
  cover: string;
  tags: string[];
  duration: string;
}

export type Theme = "dongzhu" | "kaige";

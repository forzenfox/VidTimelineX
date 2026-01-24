// 驴酱模块类型定义
export interface Video {
  id: string;
  title: string;
  date: string;
  bvid: string;
  cover: string;
  tags: string[];
  duration: string;
}

export type Theme = "dongzhu" | "kaige";

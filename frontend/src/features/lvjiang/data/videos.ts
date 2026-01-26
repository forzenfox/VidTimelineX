export interface Video {
  id: string;
  title: string;
  date: string;
  bvid: string;
  cover: string;
  tags: string[];
  duration: string;
}

// 从 JSON 文件导入数据
import videosData from "./videos.json";

export const videos: Video[] = videosData;

export * from "./types";

export interface Video {
  id: string;
  title: string;
  date: string;
  bvid: string;
  cover: string;
  tags: string[];
  duration: string;
}

export interface Danmu {
  id: string;
  text: string;
  type: "normal" | "gift" | "super";
  user?: string;
  color?: string;
}

// 从 JSON 文件导入数据
import videosData from "./videos.json";
import danmuData from "./danmaku.json";
import usersData from "./users.json";

export const videos: Video[] = videosData;
export const danmuPool: Danmu[] = danmuData;
export const users = usersData;

export * from "./types";

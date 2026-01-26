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
  text: string;
  type: "normal" | "gift" | "super";
  user?: string;
  color?: string;
}

// 从文件导入数据
import videosData from "./videos.json";
import usersData from "./users.json";
import { getRandomDanmakuType } from "./danmakuColors";

// 直接导入txt文件内容
import danmuText from "./danmaku.txt?raw";

// 处理弹幕数据，添加随机类型
const processDanmuData = (text: string): Danmu[] => {
  // 按行分割文本
  const lines = text.split('\n').filter(line => line.trim() !== '');
  
  // 为每条弹幕添加随机类型
  return lines.map(text => ({
    text,
    type: getRandomDanmakuType()
  }));
};

// 导出数据
export const videos: Video[] = videosData;
export const danmuPool: Danmu[] = processDanmuData(danmuText);
export const users = usersData;

export * from "./types";

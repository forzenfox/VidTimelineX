// 从文件导入数据
import videosData from "./videos.json";
import usersData from "./users.json";
import danmakuProcessedData from "./danmaku-processed.json";

// 导出数据
export * from "./types";
export const videos = videosData;
export const danmuPool = danmakuProcessedData;
export const users = usersData;

// 从 types.ts 导入类型定义
import type { Video } from "./types";

// 从 JSON 文件导入数据
import videosData from "./videos.json";

export const videos: Video[] = videosData;

export * from "./types";

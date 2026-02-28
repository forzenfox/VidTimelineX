// 驴酱模块导出入口
export * from "./videos";
export * from "./danmaku";
export * from "./types";

// 导出用户数据
export { default as users } from "./users.json";

// 已弃用：弹幕颜色工具函数
// 请使用共享弹幕库：import { getThemeColor, getSizeByTextLength } from '@/shared/danmaku';
export * from "./danmakuColors";

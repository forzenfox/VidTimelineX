/**
 * 弹幕颜色系统模块
 * 已弃用：请使用共享弹幕库中的工具函数
 * @deprecated 使用 @/shared/danmaku 中的 getThemeColor 和 getSizeByTextLength 替代
 */

// 此文件已弃用，保留仅用于向后兼容
// 新代码请使用共享弹幕库：import { getThemeColor, getSizeByTextLength } from '@/shared/danmaku';

/** 洞主主题弹幕颜色池（蓝色系） */
const dongzhuColors = [
  "#5DADE2", // 浅蓝
  "#3498DB", // 中蓝
  "#2E86C1", // 深蓝
  "#2874A6", // 暗蓝
  "#85C1E9", // 天蓝
];

/** 凯哥主题弹幕颜色池（红色系） */
const kaigeColors = [
  "#E74C3C", // 鲜红
  "#C0392B", // 深红
  "#A93226", // 暗红
  "#943126", // 棕红
  "#EC7063", // 浅红
];

/**
 * 获取指定主题的随机弹幕颜色
 * @param theme - 主题类型："dongzhu" | "kaige"
 * @returns 颜色值（十六进制字符串）
 * @deprecated 使用共享弹幕库的 getThemeColor 替代
 */
export function getDanmakuColor(theme: "dongzhu" | "kaige"): string {
  const colors = theme === "dongzhu" ? dongzhuColors : kaigeColors;
  return colors[Math.floor(Math.random() * colors.length)];
}

/**
 * 获取洞主主题的随机颜色
 * @returns 颜色值（十六进制字符串）
 * @deprecated 使用共享弹幕库的 getThemeColor 替代
 */
export function getDongzhuColor(): string {
  return dongzhuColors[Math.floor(Math.random() * dongzhuColors.length)];
}

/**
 * 获取凯哥主题的随机颜色
 * @returns 颜色值（十六进制字符串）
 * @deprecated 使用共享弹幕库的 getThemeColor 替代
 */
export function getKaigeColor(): string {
  return kaigeColors[Math.floor(Math.random() * kaigeColors.length)];
}

/**
 * 根据文本长度分配弹幕大小
 * @param text - 弹幕文本
 * @returns 大小等级："small" | "medium" | "large"
 * @deprecated 使用共享弹幕库的 getSizeByTextLength 替代
 */
export function getSizeByTextLength(text: string): "small" | "medium" | "large" {
  const length = text.length;
  if (length <= 3) return "large";
  if (length <= 8) return "medium";
  return "small";
}

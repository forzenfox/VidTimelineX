/**
 * 余小C模块弹幕颜色配置
 * 集中管理不同主题下的弹幕颜色和样式配置
 */

import type { Theme } from "./types";

// 弹幕类型定义
export type DanmakuType = "normal" | "highlight" | "super";

// 弹幕类型权重配置
export const danmakuTypeWeights = {
  normal: 70, // 70% 概率
  highlight: 20, // 20% 概率
  super: 10, // 10% 概率
};

// 血怒主题颜色配置 - 红色系，在深色背景上清晰可见
export const bloodDanmakuColors = {
  // 主要红色
  primary: "#E11D48", // 玫瑰红
  secondary: "#DC2626", // 深红
  accent: "#F87171", // 浅红
  // 高对比度颜色
  highlight: "#FBBF24", // 琥珀黄，高亮
  super: "#F59E0B", // 橙色，超级弹幕
};

// 混躺主题颜色配置 - 蓝/绿/琥珀色系，在亮色背景上清晰可见
export const mixDanmakuColors = {
  // 主要颜色
  primary: "#F59E0B", // 琥珀色
  secondary: "#3B82F6", // 蓝色
  accent: "#10B981", // 绿色
  // 高对比度颜色
  highlight: "#7C3AED", // 紫色，高亮
  super: "#EC4899", // 粉色，超级弹幕
};

// 公共弹幕颜色 - 中性色，适用于所有主题
export const commonDanmakuColors = [
  "#6B7280", // 灰色
  "#8B5CF6", // 紫色
  "#EC4899", // 粉色
  "#10B981", // 绿色
  "#3B82F6", // 蓝色
];

/**
 * 获取主题对应的弹幕颜色
 * @param theme 当前主题
 * @param type 弹幕类型
 * @returns 颜色值
 */
export const getDanmakuColor = (theme: Theme, type: DanmakuType = "normal"): string => {
  const colors = theme === "blood" ? bloodDanmakuColors : mixDanmakuColors;

  switch (type) {
    case "super":
      return colors.super;
    case "highlight":
      return colors.highlight;
    default:
      // normal 类型随机返回主要颜色
      const normalColors = [colors.primary, colors.secondary, colors.accent];
      return normalColors[Math.floor(Math.random() * normalColors.length)];
  }
};

/**
 * 获取公共弹幕颜色
 * @returns 随机公共颜色
 */
export const getCommonDanmakuColor = (): string => {
  return commonDanmakuColors[Math.floor(Math.random() * commonDanmakuColors.length)];
};

/**
 * 随机分配弹幕类型
 * @returns 随机弹幕类型
 */
export const getRandomDanmakuType = (): DanmakuType => {
  const totalWeight = Object.values(danmakuTypeWeights).reduce((sum, weight) => sum + weight, 0);
  let random = Math.random() * totalWeight;

  for (const [type, weight] of Object.entries(danmakuTypeWeights)) {
    random -= weight;
    if (random <= 0) {
      return type as DanmakuType;
    }
  }

  return "normal";
};

/**
 * 获取弹幕文字阴影样式
 * @param color 弹幕颜色
 * @param theme 当前主题
 * @returns CSS text-shadow 值
 */
export const getDanmakuTextShadow = (color: string, theme: Theme): string => {
  if (theme === "blood") {
    // 血怒主题：深色背景，使用发光效果
    return `0 0 10px ${color}80, 0 0 20px ${color}40, 2px 2px 4px rgba(0,0,0,0.8)`;
  }
  // 混躺主题：亮色背景，使用描边效果增强可读性
  return `0 0 8px ${color}60, -1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff, 1px 1px 0 #fff`;
};

/**
 * 获取弹幕背景样式
 * @param color 弹幕颜色
 * @returns CSS background 值
 */
export const getDanmakuBackground = (color: string): string => {
  return `${color}15`;
};

/**
 * 获取弹幕边框样式
 * @param color 弹幕颜色
 * @returns CSS border 值
 */
export const getDanmakuBorder = (color: string): string => {
  return `1px solid ${color}40`;
};

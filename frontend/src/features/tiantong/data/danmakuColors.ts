// 甜筒模块弹幕配置
// 集中管理不同主题下的弹幕颜色和类型配置

import { Theme } from "./types";

// 弹幕类型定义
export type DanmakuType = "normal" | "gift" | "super";

// 弹幕类型权重配置
export const danmakuTypeWeights = {
  normal: 60, // 60% 概率
  gift: 20, // 20% 概率
  super: 20, // 20% 概率
};

// super类型弹幕颜色配置
export const superDanmakuColors = {
  // 老虎主题：橙色调为主
  tiger: [
    "rgb(255, 95, 0)", // 亮橙色
    "rgb(255, 215, 0)", // 金黄色
    "rgb(255, 165, 0)", // 橙色
    "rgb(255, 140, 0)", // 深橙色
    "rgb(255, 190, 40)", // 浅橙色
  ],
  // 甜筒主题：粉色调为主
  sweet: [
    "rgb(255, 140, 180)", // 浅粉色
    "rgb(255, 192, 203)", // 淡粉色
    "rgb(255, 105, 180)", // 亮粉色
    "rgb(255, 127, 80)", // 珊瑚色
    "rgb(255, 20, 147)", // 深粉色
  ],
};

/**
 * 获取随机的super弹幕颜色
 * @param theme 当前主题
 * @returns 随机颜色值
 */
export const getRandomSuperDanmakuColor = (theme: Theme): string => {
  const colors = superDanmakuColors[theme];
  const randomIndex = Math.floor(Math.random() * colors.length);
  return colors[randomIndex];
};

/**
 * 随机分配弹幕类型
 * @returns 随机弹幕类型
 */
export const getRandomDanmakuType = (): DanmakuType => {
  // 计算总权重
  const totalWeight = Object.values(danmakuTypeWeights).reduce((sum, weight) => sum + weight, 0);

  // 生成随机数
  let random = Math.random() * totalWeight;

  // 根据权重分配类型
  for (const [type, weight] of Object.entries(danmakuTypeWeights)) {
    random -= weight;
    if (random <= 0) {
      return type as DanmakuType;
    }
  }

  // 默认返回normal类型
  return "normal";
};

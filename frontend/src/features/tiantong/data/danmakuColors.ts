// 甜筒模块弹幕颜色配置
// 集中管理不同主题下的super类型弹幕颜色

import { Theme } from "./types";

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

/**
 * 弹幕工具函数模块
 * 提供弹幕相关的通用工具函数
 */

import type { DanmakuSize, DanmakuTheme, DanmakuType, ColorType } from './types';
import { THEME_COLORS } from './config';

/**
 * 根据文本长度判断弹幕尺寸
 * @param text 弹幕文本
 * @returns 弹幕尺寸：<=3 为 large, <=8 为 medium, >8 为 small
 */
export function getSizeByTextLength(text: string): DanmakuSize {
  const length = text.length;
  
  if (length <= 3) {
    return 'large';
  } else if (length <= 8) {
    return 'medium';
  } else {
    return 'small';
  }
}

/**
 * 获取主题颜色
 * @param theme 主题类型
 * @param type 颜色类型（primary、secondary、accent）
 * @returns 对应的颜色值（十六进制格式）
 */
export function getThemeColor(theme: DanmakuTheme, type: ColorType): string {
  const themeConfig = THEME_COLORS[theme] || THEME_COLORS.mix;
  return themeConfig[type];
}

/**
 * 随机获取弹幕类型
 * @returns 随机的弹幕类型（sidebar 或 horizontal）
 */
export function getRandomDanmakuType(): DanmakuType {
  const types: DanmakuType[] = ['sidebar', 'horizontal'];
  const randomIndex = Math.floor(Math.random() * types.length);
  return types[randomIndex];
}

/**
 * 生成时间戳字符串
 * @param date 日期对象，可选，默认为当前时间
 * @returns 格式化的时间字符串（格式："HH:MM:SS"）
 */
export function generateTimestamp(date?: Date): string {
  const targetDate = date || new Date();
  
  const hours = targetDate.getHours().toString().padStart(2, '0');
  const minutes = targetDate.getMinutes().toString().padStart(2, '0');
  const seconds = targetDate.getSeconds().toString().padStart(2, '0');
  
  return `${hours}:${minutes}:${seconds}`;
}

/**
 * 获取弹幕颜色（从主题颜色中随机选择）
 * @param theme 主题类型
 * @returns 随机选择的主题颜色值（十六进制格式）
 */
export function getDanmakuColor(theme: DanmakuTheme): string {
  const themeConfig = THEME_COLORS[theme] || THEME_COLORS.mix;
  const colorTypes: ColorType[] = ['primary', 'secondary', 'accent'];
  const randomIndex = Math.floor(Math.random() * colorTypes.length);
  return themeConfig[colorTypes[randomIndex]];
}

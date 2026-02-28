/**
 * 弹幕配置管理模块
 * 包含主题颜色、弹幕类型权重、尺寸阈值等配置
 */

/**
 * 主题颜色配置接口
 */
export interface ThemeColorConfig {
  /** 主色调 */
  primary: string;
  /** 辅助色 */
  secondary: string;
  /** 强调色 */
  accent: string;
}

/**
 * 所有主题的颜色配置
 * 包含 6 个主题：blood（热血）、mix（混合）、dongzhu（冬竹）、kaige（凯歌）、tiger（虎）、sweet（甜蜜）
 */
export const THEME_COLORS: Record<string, ThemeColorConfig> = {
  blood: {
    primary: "#FF4444",
    secondary: "#FF8888",
    accent: "#CC0000",
  },
  mix: {
    primary: "#9B59B6",
    secondary: "#BE93D4",
    accent: "#8E44AD",
  },
  dongzhu: {
    primary: "#3498DB",
    secondary: "#85C1E9",
    accent: "#2980B9",
  },
  kaige: {
    primary: "#F39C12",
    secondary: "#F9E79F",
    accent: "#D68910",
  },
  tiger: {
    primary: "#E67E22",
    secondary: "#F5CBA7",
    accent: "#D35400",
  },
  sweet: {
    primary: "#FF69B4",
    secondary: "#FFB6C1",
    accent: "#FF1493",
  },
};

/**
 * 弹幕类型权重配置
 * 用于计算弹幕的优先级和显示权重
 */
export const DANMAKU_TYPE_WEIGHTS: Record<string, number> = {
  normal: 1, // 普通弹幕
  top: 2, // 顶部弹幕
  bottom: 2, // 底部弹幕
  special: 3, // 特殊弹幕
  premium: 4, // 高级弹幕
};

/**
 * 尺寸判断阈值配置
 * 用于根据数值判断弹幕尺寸等级
 * - small（小）: > 8
 * - medium（中）: 4 - 8
 * - large（大）: <= 3
 */
export const SIZE_THRESHOLDS = {
  small: 8, // 大于 8 为小尺寸
  medium: 4, // 4-8 为中尺寸，小于等于 3 为大尺寸
};

/**
 * 主题配置映射表
 * 将主题名称映射到对应的颜色配置
 */
export const THEME_CONFIG_MAP: Record<string, ThemeColorConfig> = {
  blood: THEME_COLORS.blood,
  mix: THEME_COLORS.mix,
  dongzhu: THEME_COLORS.dongzhu,
  kaige: THEME_COLORS.kaige,
  tiger: THEME_COLORS.tiger,
  sweet: THEME_COLORS.sweet,
};

/**
 * 获取指定主题的颜色配置
 * @param themeName 主题名称
 * @returns 主题颜色配置，如果主题不存在则返回默认配置（mix 主题）
 */
export function getThemeColors(themeName: string): ThemeColorConfig {
  return THEME_CONFIG_MAP[themeName] || THEME_COLORS.mix;
}

/**
 * 根据数值获取尺寸等级
 * @param value 尺寸数值
 * @returns 尺寸等级：'small' | 'medium' | 'large'
 */
export function getSizeLevel(value: number): "small" | "medium" | "large" {
  if (value > SIZE_THRESHOLDS.small) {
    return "small";
  } else if (value > SIZE_THRESHOLDS.medium) {
    return "medium";
  } else {
    return "large";
  }
}

/**
 * 获取弹幕类型的权重值
 * @param type 弹幕类型
 * @returns 权重值，如果类型不存在则返回普通弹幕的权重
 */
export function getDanmakuWeight(type: string): number {
  return DANMAKU_TYPE_WEIGHTS[type] || DANMAKU_TYPE_WEIGHTS.normal;
}

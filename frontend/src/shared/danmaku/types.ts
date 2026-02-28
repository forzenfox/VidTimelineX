/**
 * 弹幕消息接口
 * 表示单条弹幕的完整信息
 */
export interface DanmakuMessage {
  /** 弹幕唯一标识 */
  id: string;
  /** 弹幕文本内容 */
  text: string;
  /** 弹幕颜色 */
  color: string;
  /** 弹幕尺寸 */
  size: DanmakuSize;
  /** 用户 ID（侧边栏模式需要） */
  userId?: string;
  /** 用户名（侧边栏模式需要） */
  userName?: string;
  /** 用户头像 URL（侧边栏模式需要） */
  userAvatar?: string;
  /** 发送时间戳（侧边栏模式需要） */
  timestamp?: string;
  /** 弹幕在轨道中的位置（飘屏模式需要） */
  top?: number;
  /** 延迟显示时间（飘屏模式需要，毫秒） */
  delay?: number;
  /** 显示持续时间（飘屏模式需要，毫秒） */
  duration?: number;
}

/**
 * 用户信息接口
 * 表示发送弹幕的用户信息
 */
export interface DanmakuUser {
  /** 用户唯一标识 */
  id: string;
  /** 用户昵称 */
  name: string;
  /** 用户头像 URL */
  avatar: string;
  /** 用户等级 */
  level: number;
  /** 用户徽章列表 */
  badge: string[];
}

/**
 * 弹幕池配置接口
 * 用于配置弹幕池的行为和属性
 */
export interface DanmakuPoolConfig {
  /** 弹幕池最大容量 */
  maxCapacity: number;
  /** 弹幕显示速度（毫秒/条） */
  displaySpeed: number;
  /** 是否启用弹幕合并 */
  enableMerge: boolean;
  /** 是否启用弹幕过滤 */
  enableFilter: boolean;
  /** 弹幕轨道数量 */
  trackCount: number;
  /** 弹幕透明度（0-1） */
  opacity: number;
}

/**
 * 主题类型
 * 定义弹幕的主题样式
 */
export type DanmakuTheme = 'blood' | 'mix' | 'dongzhu' | 'kaige' | 'tiger' | 'sweet';

/**
 * 尺寸类型
 * 定义弹幕的显示尺寸
 */
export type DanmakuSize = 'small' | 'medium' | 'large';

/**
 * 弹幕类型
 * 定义弹幕的显示模式
 */
export type DanmakuType = 'sidebar' | 'horizontal';

/**
 * 批量生成选项接口
 * 用于批量生成弹幕时的配置选项
 */
export interface BatchOptions {
  /** 生成数量 */
  count: number;
  /** 弹幕类型 */
  type: DanmakuType;
  /** 主题样式 */
  theme?: DanmakuTheme;
  /** 时间范围起始（毫秒） */
  timeRangeStart?: number;
  /** 时间范围结束（毫秒） */
  timeRangeEnd?: number;
  /** 是否随机颜色 */
  randomColor?: boolean;
  /** 是否随机尺寸 */
  randomSize?: boolean;
}

/**
 * Hook 配置接口
 * useDanmaku Hook 的配置选项
 */
export interface UseDanmakuConfig {
  /** 弹幕池配置 */
  poolConfig?: DanmakuPoolConfig;
  /** 默认主题 */
  defaultTheme?: DanmakuTheme;
  /** 默认尺寸 */
  defaultSize?: DanmakuSize;
  /** 是否自动播放 */
  autoPlay?: boolean;
  /** 是否循环播放 */
  loop?: boolean;
  /** 弹幕类型 */
  danmakuType?: DanmakuType;
}

/**
 * 生成器配置接口
 * 弹幕生成器的配置选项
 */
export interface GeneratorConfig {
  /** 视频时长（毫秒） */
  videoDuration: number;
  /** 弹幕密度（条/秒） */
  density: number;
  /** 主题样式 */
  theme?: DanmakuTheme;
  /** 颜色类型 */
  colorType?: ColorType;
  /** 最小间隔时间（毫秒） */
  minInterval?: number;
  /** 最大间隔时间（毫秒） */
  maxInterval?: number;
}

/**
 * 颜色类型
 * 定义弹幕颜色的预设类型
 */
export type ColorType = 'primary' | 'secondary' | 'accent';

/**
 * 弹幕生成器模块
 * 用于生成单条或批量生成弹幕消息
 */

import type {
  DanmakuMessage,
  DanmakuUser,
  DanmakuSize,
  DanmakuTheme,
  DanmakuType,
  ColorType,
  BatchOptions,
  GeneratorConfig,
} from "./types";
import { THEME_COLORS, getThemeColors, THEME_CONFIG_MAP } from "./config";
import { getSizeByTextLength, generateTimestamp } from "./utils";

/**
 * 弹幕生成器类
 * 负责根据配置生成单条或批量弹幕消息
 */
export class DanmakuGenerator {
  /** 弹幕文本池 */
  private textPool: string[];

  /** 用户池 */
  private users: DanmakuUser[];

  /** 主题配置 */
  private theme: DanmakuTheme;

  /** 颜色类型 */
  private colorType: ColorType;

  /** 弹幕类型 */
  private danmakuType: DanmakuType;

  /** 是否随机颜色 */
  private randomColor: boolean;

  /** 是否随机尺寸 */
  private randomSize: boolean;

  /**
   * 创建弹幕生成器实例
   * @param config 生成器配置
   * @param config.theme 主题样式，默认为 'mix'
   * @param config.textPool 弹幕文本池
   * @param config.users 用户池
   * @param config.colorType 颜色类型，默认为 'primary'
   * @param config.danmakuType 弹幕类型，默认为 'sidebar'
   * @param config.randomColor 是否随机颜色，默认为 false
   * @param config.randomSize 是否随机尺寸，默认为 false
   */
  constructor(config: {
    theme?: DanmakuTheme;
    textPool: string[];
    users?: DanmakuUser[];
    colorType?: ColorType;
    danmakuType?: DanmakuType;
    randomColor?: boolean;
    randomSize?: boolean;
  }) {
    this.theme = config.theme || "mix";
    this.textPool = config.textPool;
    this.users = config.users || [];
    this.colorType = config.colorType || "primary";
    this.danmakuType = config.danmakuType || "sidebar";
    this.randomColor = config.randomColor || false;
    this.randomSize = config.randomSize || false;
  }

  /**
   * 生成单条弹幕消息
   * @param index 弹幕索引，用于生成唯一 ID
   * @returns 单条弹幕消息对象
   */
  generateMessage(index: number): DanmakuMessage {
    const text = this.getRandomText();
    const user = this.getRandomUser();
    const size = this.getSize(text);
    const color = this.getColor();
    const timestamp = generateTimestamp();

    const message: DanmakuMessage = {
      id: `danmaku-${Date.now()}-${index}`,
      text,
      color,
      size,
      userId: user?.id,
      userName: user?.name,
      userAvatar: user?.avatar,
      timestamp,
    };

    if (this.danmakuType === "horizontal") {
      message.top = this.getRandomTop();
      message.delay = index * 300;
      message.duration = 6000 + Math.random() * 4000;
    }

    return message;
  }

  /**
   * 批量生成弹幕消息
   * @param options 批量生成选项
   * @param options.count 生成数量
   * @param options.type 弹幕类型，覆盖默认类型
   * @param options.theme 主题样式，覆盖默认主题
   * @param options.timeRangeStart 时间范围起始（毫秒）
   * @param options.timeRangeEnd 时间范围结束（毫秒）
   * @param options.randomColor 是否随机颜色，覆盖默认设置
   * @param options.randomSize 是否随机尺寸，覆盖默认设置
   * @returns 弹幕消息数组
   */
  generateBatch(options: BatchOptions): DanmakuMessage[] {
    const { count, type, theme, timeRangeStart, timeRangeEnd, randomColor, randomSize } = options;

    const messages: DanmakuMessage[] = [];
    const previousTheme = this.theme;
    const previousType = this.danmakuType;
    const previousRandomColor = this.randomColor;
    const previousRandomSize = this.randomSize;

    if (theme) this.theme = theme;
    if (type) this.danmakuType = type;
    if (randomColor !== undefined) this.randomColor = randomColor;
    if (randomSize !== undefined) this.randomSize = randomSize;

    const baseTime = timeRangeStart || 0;
    const timeRange = (timeRangeEnd || baseTime) - baseTime;

    for (let i = 0; i < count; i++) {
      const message = this.generateMessage(i);

      if (timeRange > 0) {
        const offsetTime = baseTime + (i / count) * timeRange;
        const date = new Date(offsetTime);
        message.timestamp = generateTimestamp(date);
      }

      messages.push(message);
    }

    this.theme = previousTheme;
    this.danmakuType = previousType;
    this.randomColor = previousRandomColor;
    this.randomSize = previousRandomSize;

    return messages;
  }

  /**
   * 从文本池中随机获取一条弹幕文本
   * @returns 随机弹幕文本
   */
  private getRandomText(): string {
    if (this.textPool.length === 0) {
      return "默认弹幕";
    }

    const randomIndex = Math.floor(Math.random() * this.textPool.length);
    return this.textPool[randomIndex];
  }

  /**
   * 从用户池中随机获取一个用户
   * @returns 随机用户对象，如果用户池为空则返回 undefined
   */
  private getRandomUser(): DanmakuUser | undefined {
    if (this.users.length === 0) {
      return undefined;
    }

    const randomIndex = Math.floor(Math.random() * this.users.length);
    return this.users[randomIndex];
  }

  /**
   * 根据文本长度获取弹幕尺寸
   * @param text 弹幕文本
   * @returns 弹幕尺寸
   */
  private getSize(text: string): DanmakuSize {
    if (this.randomSize) {
      const sizes: DanmakuSize[] = ["small", "medium", "large"];
      const randomIndex = Math.floor(Math.random() * sizes.length);
      return sizes[randomIndex];
    }

    return getSizeByTextLength(text);
  }

  /**
   * 获取弹幕颜色
   * @returns 颜色值（十六进制格式）
   */
  private getColor(): string {
    if (this.randomColor) {
      const themeConfig = THEME_COLORS[this.theme] || THEME_COLORS.mix;
      const colorTypes: ColorType[] = ["primary", "secondary", "accent"];
      const randomIndex = Math.floor(Math.random() * colorTypes.length);
      return themeConfig[colorTypes[randomIndex]];
    }

    const themeConfig = getThemeColors(this.theme);
    return themeConfig[this.colorType];
  }

  /**
   * 获取随机轨道位置（用于横向弹幕）
   * @returns 轨道位置（0-1 之间的小数）
   */
  private getRandomTop(): number {
    const trackCount = 8;
    const trackIndex = Math.floor(Math.random() * trackCount);
    return trackIndex / trackCount;
  }
}

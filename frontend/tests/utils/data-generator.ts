/**
 * 测试数据生成器
 * 提供灵活的测试数据生成功能，支持各种测试场景
 */

/**
 * 生成随机ID
 * @param prefix 前缀
 * @param length 长度
 * @returns 随机ID
 */
export function generateId(prefix: string = "id", length: number = 8): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = prefix;
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * 生成随机字符串
 * @param length 长度
 * @param chars 字符集
 * @returns 随机字符串
 */
export function generateString(
  length: number = 10,
  chars: string = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
): string {
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * 生成随机数字
 * @param min 最小值
 * @param max 最大值
 * @returns 随机数字
 */
export function generateNumber(min: number = 0, max: number = 100): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * 生成随机布尔值
 * @returns 随机布尔值
 */
export function generateBoolean(): boolean {
  return Math.random() > 0.5;
}

/**
 * 生成随机日期
 * @param start 开始日期
 * @param end 结束日期
 * @returns 随机日期
 */
export function generateDate(start: Date = new Date(2020, 0, 1), end: Date = new Date()): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

/**
 * 生成随机邮箱
 * @returns 随机邮箱
 */
export function generateEmail(): string {
  const domains = ["example.com", "test.com", "mail.com", "gmail.com", "yahoo.com"];
  const domain = domains[Math.floor(Math.random() * domains.length)];
  return `${generateString(8)}@${domain}`;
}

/**
 * 生成随机URL
 * @returns 随机URL
 */
export function generateUrl(): string {
  const domains = ["example.com", "test.com", "sample.com"];
  const domain = domains[Math.floor(Math.random() * domains.length)];
  return `https://${domain}/${generateString(10)}`;
}

/**
 * 生成随机颜色
 * @returns 随机颜色（十六进制）
 */
export function generateColor(): string {
  return `#${Math.floor(Math.random() * 16777215)
    .toString(16)
    .padStart(6, "0")}`;
}

/**
 * 从数组中随机选择一个元素
 * @param array 源数组
 * @returns 随机元素
 */
export function randomSelect<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

/**
 * 从数组中随机选择多个元素
 * @param array 源数组
 * @param count 选择数量
 * @returns 随机元素数组
 */
export function randomSelectMultiple<T>(array: T[], count: number = 1): T[] {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

/**
 * 测试视频数据生成器
 */
export interface VideoData {
  id: string;
  title: string;
  category: string;
  tags: string[];
  cover: string;
  date: string;
  views: string;
  bvid: string;
  duration: string;
}

/**
 * 生成视频数据
 * @param overrides 覆盖默认值
 * @returns 视频数据
 */
export function generateVideo(overrides: Partial<VideoData> = {}): VideoData {
  const categories = ["sing", "dance", "funny", "game", "life"];
  const tags = ["测试", "视频", "娱乐", "音乐", "舞蹈", "搞笑", "游戏", "生活"];

  return {
    id: generateId("video"),
    title: `测试视频 ${generateString(5)}`,
    category: randomSelect(categories),
    tags: randomSelectMultiple(tags, generateNumber(1, 3)),
    cover: generateUrl(),
    date: generateDate().toISOString().split("T")[0],
    views: `${generateNumber(1, 100)}万`,
    bvid: `BV${generateString(10).toUpperCase()}`,
    duration: `${generateNumber(1, 59).toString().padStart(2, "0")}:${generateNumber(0, 59).toString().padStart(2, "0")}`,
    ...overrides,
  };
}

/**
 * 生成多个视频数据
 * @param count 数量
 * @param overrides 覆盖默认值
 * @returns 视频数据数组
 */
export function generateVideos(count: number = 5, overrides: Partial<VideoData> = {}): VideoData[] {
  return Array.from({ length: count }, () => generateVideo(overrides));
}

/**
 * 测试弹幕数据生成器
 */
export interface DanmuData {
  id: string;
  text: string;
  type: string;
  user: string;
  color: string;
}

/**
 * 生成弹幕数据
 * @param overrides 覆盖默认值
 * @returns 弹幕数据
 */
export function generateDanmu(overrides: Partial<DanmuData> = {}): DanmuData {
  const types = ["normal", "gift", "super"];
  const texts = [
    "欢迎来到直播间！",
    "主播好厉害！",
    "666666",
    "加油加油！",
    "这个视频太棒了！",
    "支持主播！",
    "哈哈哈笑死我了",
    "这个技巧很有用",
    "谢谢分享！",
    "期待下一期！",
  ];

  return {
    id: generateId("danmu"),
    text: randomSelect(texts),
    type: randomSelect(types),
    user: `user${generateNumber(1, 1000)}`,
    color: generateColor(),
    ...overrides,
  };
}

/**
 * 生成多个弹幕数据
 * @param count 数量
 * @param overrides 覆盖默认值
 * @returns 弹幕数据数组
 */
export function generateDanmaku(
  count: number = 10,
  overrides: Partial<DanmuData> = {}
): DanmuData[] {
  return Array.from({ length: count }, () => generateDanmu(overrides));
}

/**
 * 测试用户数据生成器
 */
export interface UserData {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: string;
}

/**
 * 生成用户数据
 * @param overrides 覆盖默认值
 * @returns 用户数据
 */
export function generateUser(overrides: Partial<UserData> = {}): UserData {
  const roles = ["user", "admin", "moderator", "guest"];

  return {
    id: generateId("user"),
    name: `用户${generateNumber(1, 1000)}`,
    email: generateEmail(),
    avatar: generateUrl(),
    role: randomSelect(roles),
    ...overrides,
  };
}

/**
 * 生成多个用户数据
 * @param count 数量
 * @param overrides 覆盖默认值
 * @returns 用户数据数组
 */
export function generateUsers(count: number = 5, overrides: Partial<UserData> = {}): UserData[] {
  return Array.from({ length: count }, () => generateUser(overrides));
}

/**
 * 测试评论数据生成器
 */
export interface CommentData {
  id: string;
  content: string;
  author: string;
  date: string;
  likes: number;
  replies: number;
}

/**
 * 生成评论数据
 * @param overrides 覆盖默认值
 * @returns 评论数据
 */
export function generateComment(overrides: Partial<CommentData> = {}): CommentData {
  const contents = [
    "这个内容很棒！",
    "学到了很多，谢谢分享",
    "期待更多精彩内容",
    "有个问题想请教一下",
    "支持你！",
    "这个观点很有道理",
    "非常实用的信息",
    "太棒了，收藏了",
    "讲解得很清晰",
    "加油！",
  ];

  return {
    id: generateId("comment"),
    content: randomSelect(contents),
    author: `用户${generateNumber(1, 1000)}`,
    date: generateDate().toISOString(),
    likes: generateNumber(0, 100),
    replies: generateNumber(0, 20),
    ...overrides,
  };
}

/**
 * 生成多个评论数据
 * @param count 数量
 * @param overrides 覆盖默认值
 * @returns 评论数据数组
 */
export function generateComments(
  count: number = 5,
  overrides: Partial<CommentData> = {}
): CommentData[] {
  return Array.from({ length: count }, () => generateComment(overrides));
}

/**
 * 测试主题数据生成器
 */
export interface ThemeData {
  id: string;
  name: string;
  description: string;
  isDefault: boolean;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
  };
}

/**
 * 生成主题数据
 * @param overrides 覆盖默认值
 * @returns 主题数据
 */
export function generateTheme(overrides: Partial<ThemeData> = {}): ThemeData {
  return {
    id: generateId("theme"),
    name: `主题${generateString(5)}`,
    description: `这是一个测试主题${generateString(10)}`,
    isDefault: generateBoolean(),
    colors: {
      primary: generateColor(),
      secondary: generateColor(),
      background: generateColor(),
      text: generateColor(),
    },
    ...overrides,
  };
}

/**
 * 生成多个主题数据
 * @param count 数量
 * @param overrides 覆盖默认值
 * @returns 主题数据数组
 */
export function generateThemes(count: number = 2, overrides: Partial<ThemeData> = {}): ThemeData[] {
  return Array.from({ length: count }, () => generateTheme(overrides));
}

/**
 * 测试配置数据生成器
 */
export interface ConfigData {
  id: string;
  key: string;
  value: unknown;
  description: string;
  type: string;
}

/**
 * 生成配置数据
 * @param overrides 覆盖默认值
 * @returns 配置数据
 */
export function generateConfig(overrides: Partial<ConfigData> = {}): ConfigData {
  const types = ["string", "number", "boolean", "object", "array"];
  const keys = ["feature.enabled", "api.timeout", "ui.theme", "cache.size", "log.level"];

  return {
    id: generateId("config"),
    key: randomSelect(keys),
    value: generateBoolean(),
    description: `测试配置项${generateString(10)}`,
    type: randomSelect(types),
    ...overrides,
  };
}

/**
 * 生成多个配置数据
 * @param count 数量
 * @param overrides 覆盖默认值
 * @returns 配置数据数组
 */
export function generateConfigs(
  count: number = 5,
  overrides: Partial<ConfigData> = {}
): ConfigData[] {
  return Array.from({ length: count }, () => generateConfig(overrides));
}

/**
 * 测试数据生成器工厂
 */
export class TestDataFactory {
  /**
   * 生成指定类型的数据
   * @param type 数据类型
   * @param count 数量
   * @param overrides 覆盖默认值
   * @returns 生成的数据
   */
  static generate<T>(type: string, count: number = 1, overrides: Partial<T> = {}): T | T[] {
    switch (type.toLowerCase()) {
      case "video":
        return count === 1
          ? (generateVideo(overrides) as T)
          : (generateVideos(count, overrides) as T[]);
      case "danmu":
        return count === 1
          ? (generateDanmu(overrides) as T)
          : (generateDanmaku(count, overrides) as T[]);
      case "user":
        return count === 1
          ? (generateUser(overrides) as T)
          : (generateUsers(count, overrides) as T[]);
      case "comment":
        return count === 1
          ? (generateComment(overrides) as T)
          : (generateComments(count, overrides) as T[]);
      case "theme":
        return count === 1
          ? (generateTheme(overrides) as T)
          : (generateThemes(count, overrides) as T[]);
      case "config":
        return count === 1
          ? (generateConfig(overrides) as T)
          : (generateConfigs(count, overrides) as T[]);
      default:
        throw new Error(`Unsupported data type: ${type}`);
    }
  }

  /**
   * 生成随机数据
   * @param type 数据类型
   * @param options 选项
   * @returns 随机数据
   */
  static random<T>(type: string, options: Record<string, unknown> = {}): T {
    switch (type.toLowerCase()) {
      case "id":
        return generateId(options.prefix as string, options.length as number);
      case "string":
        return generateString(options.length as number, options.chars as string);
      case "number":
        return generateNumber(options.min as number, options.max as number);
      case "boolean":
        return generateBoolean() as unknown as T;
      case "date":
        return generateDate(options.start as Date, options.end as Date);
      case "email":
        return generateEmail() as unknown as T;
      case "url":
        return generateUrl() as unknown as T;
      case "color":
        return generateColor() as unknown as T;
      case "select":
        return randomSelect(options.array as unknown[]) as unknown as T;
      case "select-multiple":
        return randomSelectMultiple(
          options.array as unknown[],
          options.count as number
        ) as unknown as T;
      default:
        throw new Error(`Unsupported random type: ${type}`);
    }
  }

  /**
   * 生成批量测试数据
   * @param definitions 数据定义
   * @returns 批量测试数据
   */
  static batch<T extends Record<string, unknown>>(
    definitions: Array<{
      type: string;
      key: string;
      count: number;
      overrides?: Partial<unknown>;
    }>
  ): T {
    const result = {} as T;

    definitions.forEach(def => {
      result[def.key] = TestDataFactory.generate(
        def.type,
        def.count,
        def.overrides
      ) as unknown as T[keyof T];
    });

    return result;
  }
}

/**
 * 测试数据生成器工具
 */
export const testDataGenerator = {
  // 基础生成器
  id: generateId,
  string: generateString,
  number: generateNumber,
  boolean: generateBoolean,
  date: generateDate,
  email: generateEmail,
  url: generateUrl,
  color: generateColor,
  select: randomSelect,
  selectMultiple: randomSelectMultiple,

  // 业务数据生成器
  video: generateVideo,
  videos: generateVideos,
  danmu: generateDanmu,
  danmaku: generateDanmaku,
  user: generateUser,
  users: generateUsers,
  comment: generateComment,
  comments: generateComments,
  theme: generateTheme,
  themes: generateThemes,
  config: generateConfig,
  configs: generateConfigs,

  // 工厂方法
  factory: TestDataFactory,
};

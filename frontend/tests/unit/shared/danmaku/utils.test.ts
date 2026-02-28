/**
 * 弹幕工具函数模块单元测试
 */

import {
  getSizeByTextLength,
  getThemeColor,
  getRandomDanmakuType,
  generateTimestamp,
  getDanmakuColor,
} from "@/shared/danmaku/utils";
import type { DanmakuTheme, ColorType } from "@/shared/danmaku/types";

describe("弹幕工具函数模块", () => {
  describe("getSizeByTextLength 函数", () => {
    it("文本长度小于等于 3 应该返回 large", () => {
      expect(getSizeByTextLength("")).toBe("large");
      expect(getSizeByTextLength("a")).toBe("large");
      expect(getSizeByTextLength("ab")).toBe("large");
      expect(getSizeByTextLength("abc")).toBe("large");
      expect(getSizeByTextLength("你好啊")).toBe("large");
    });

    it("文本长度在 4 到 8 之间应该返回 medium", () => {
      expect(getSizeByTextLength("abcd")).toBe("medium");
      expect(getSizeByTextLength("abcde")).toBe("medium");
      expect(getSizeByTextLength("abcdef")).toBe("medium");
      expect(getSizeByTextLength("abcdefg")).toBe("medium");
      expect(getSizeByTextLength("abcdefgh")).toBe("medium");
      expect(getSizeByTextLength("你好世界")).toBe("medium");
      expect(getSizeByTextLength("这是一段测试文本")).toBe("medium");
    });

    it("文本长度大于 8 应该返回 small", () => {
      expect(getSizeByTextLength("abcdefghi")).toBe("small");
      expect(getSizeByTextLength("abcdefghij")).toBe("small");
      expect(getSizeByTextLength("这是一段很长的测试文本")).toBe("small");
      expect(getSizeByTextLength("Lorem ipsum dolor sit amet")).toBe("small");
    });

    it("应该正确处理中文字符", () => {
      expect(getSizeByTextLength("短")).toBe("large");
      expect(getSizeByTextLength("中等长度")).toBe("medium");
      expect(getSizeByTextLength("这是一个非常长的弹幕文本")).toBe("small");
    });

    it("应该正确处理特殊字符和空格", () => {
      expect(getSizeByTextLength("a b")).toBe("large");
      expect(getSizeByTextLength("a b c d")).toBe("medium");
      expect(getSizeByTextLength("a b c d e f g h i")).toBe("small");
    });
  });

  describe("getThemeColor 函数", () => {
    it("应该返回 blood 主题的正确颜色", () => {
      expect(getThemeColor("blood", "primary")).toBe("#FF4444");
      expect(getThemeColor("blood", "secondary")).toBe("#FF8888");
      expect(getThemeColor("blood", "accent")).toBe("#CC0000");
    });

    it("应该返回 mix 主题的正确颜色", () => {
      expect(getThemeColor("mix", "primary")).toBe("#9B59B6");
      expect(getThemeColor("mix", "secondary")).toBe("#BE93D4");
      expect(getThemeColor("mix", "accent")).toBe("#8E44AD");
    });

    it("应该返回 dongzhu 主题的正确颜色", () => {
      expect(getThemeColor("dongzhu", "primary")).toBe("#3498DB");
      expect(getThemeColor("dongzhu", "secondary")).toBe("#85C1E9");
      expect(getThemeColor("dongzhu", "accent")).toBe("#2980B9");
    });

    it("应该返回 kaige 主题的正确颜色", () => {
      expect(getThemeColor("kaige", "primary")).toBe("#F39C12");
      expect(getThemeColor("kaige", "secondary")).toBe("#F9E79F");
      expect(getThemeColor("kaige", "accent")).toBe("#D68910");
    });

    it("应该返回 tiger 主题的正确颜色", () => {
      expect(getThemeColor("tiger", "primary")).toBe("#E67E22");
      expect(getThemeColor("tiger", "secondary")).toBe("#F5CBA7");
      expect(getThemeColor("tiger", "accent")).toBe("#D35400");
    });

    it("应该返回 sweet 主题的正确颜色", () => {
      expect(getThemeColor("sweet", "primary")).toBe("#FF69B4");
      expect(getThemeColor("sweet", "secondary")).toBe("#FFB6C1");
      expect(getThemeColor("sweet", "accent")).toBe("#FF1493");
    });

    it("当主题不存在时应该返回 mix 主题的颜色", () => {
      expect(getThemeColor("invalid" as DanmakuTheme, "primary")).toBe("#9B59B6");
      expect(getThemeColor("unknown" as DanmakuTheme, "secondary")).toBe("#BE93D4");
    });

    it("应该返回有效的十六进制颜色值", () => {
      const hexColorRegex = /^#[0-9A-F]{6}$/i;
      const themes: DanmakuTheme[] = ["blood", "mix", "dongzhu", "kaige", "tiger", "sweet"];
      const colorTypes: ColorType[] = ["primary", "secondary", "accent"];

      themes.forEach(theme => {
        colorTypes.forEach(type => {
          const color = getThemeColor(theme, type);
          expect(hexColorRegex.test(color)).toBe(true);
        });
      });
    });
  });

  describe("getRandomDanmakuType 函数", () => {
    it("应该返回 sidebar 或 horizontal", () => {
      const validTypes = ["sidebar", "horizontal"];
      const result = getRandomDanmakuType();
      expect(validTypes).toContain(result);
    });

    it("多次调用应该能够返回两种类型的值", () => {
      const results = new Set();
      for (let i = 0; i < 100; i++) {
        results.add(getRandomDanmakuType());
      }
      expect(results.size).toBeGreaterThanOrEqual(1);
      expect(results.size).toBeLessThanOrEqual(2);
    });

    it("返回值类型应该是正确的", () => {
      const result = getRandomDanmakuType();
      expect(typeof result).toBe("string");
      expect(["sidebar", "horizontal"]).toContain(result);
    });
  });

  describe("generateTimestamp 函数", () => {
    it("不传参数时应该使用当前时间", () => {
      const now = new Date();
      const expected = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}:${now.getSeconds().toString().padStart(2, "0")}`;
      expect(generateTimestamp()).toBe(expected);
    });

    it("应该正确格式化指定的日期时间", () => {
      const testDate = new Date("2024-01-15 14:30:25");
      expect(generateTimestamp(testDate)).toBe("14:30:25");
    });

    it("应该正确处理单位数的小时、分钟、秒", () => {
      const testDate = new Date("2024-01-15 01:05:09");
      expect(generateTimestamp(testDate)).toBe("01:05:09");
    });

    it("应该正确处理午夜时间", () => {
      const testDate = new Date("2024-01-15 00:00:00");
      expect(generateTimestamp(testDate)).toBe("00:00:00");
    });

    it("应该正确处理中午时间", () => {
      const testDate = new Date("2024-01-15 12:00:00");
      expect(generateTimestamp(testDate)).toBe("12:00:00");
    });

    it("应该正确处理深夜时间", () => {
      const testDate = new Date("2024-01-15 23:59:59");
      expect(generateTimestamp(testDate)).toBe("23:59:59");
    });

    it("返回的格式应该是 HH:MM:SS", () => {
      const result = generateTimestamp();
      const timeFormatRegex = /^\d{2}:\d{2}:\d{2}$/;
      expect(timeFormatRegex.test(result)).toBe(true);
    });

    it("应该返回字符串类型", () => {
      expect(typeof generateTimestamp()).toBe("string");
    });
  });

  describe("getDanmakuColor 函数", () => {
    it("应该返回 blood 主题的随机颜色", () => {
      const validColors = ["#FF4444", "#FF8888", "#CC0000"];
      const result = getDanmakuColor("blood");
      expect(validColors).toContain(result);
    });

    it("应该返回 mix 主题的随机颜色", () => {
      const validColors = ["#9B59B6", "#BE93D4", "#8E44AD"];
      const result = getDanmakuColor("mix");
      expect(validColors).toContain(result);
    });

    it("应该返回 dongzhu 主题的随机颜色", () => {
      const validColors = ["#3498DB", "#85C1E9", "#2980B9"];
      const result = getDanmakuColor("dongzhu");
      expect(validColors).toContain(result);
    });

    it("应该返回 kaige 主题的随机颜色", () => {
      const validColors = ["#F39C12", "#F9E79F", "#D68910"];
      const result = getDanmakuColor("kaige");
      expect(validColors).toContain(result);
    });

    it("应该返回 tiger 主题的随机颜色", () => {
      const validColors = ["#E67E22", "#F5CBA7", "#D35400"];
      const result = getDanmakuColor("tiger");
      expect(validColors).toContain(result);
    });

    it("应该返回 sweet 主题的随机颜色", () => {
      const validColors = ["#FF69B4", "#FFB6C1", "#FF1493"];
      const result = getDanmakuColor("sweet");
      expect(validColors).toContain(result);
    });

    it("当主题不存在时应该返回 mix 主题的随机颜色", () => {
      const validColors = ["#9B59B6", "#BE93D4", "#8E44AD"];
      const result = getDanmakuColor("invalid" as DanmakuTheme);
      expect(validColors).toContain(result);
    });

    it("多次调用应该能够返回不同的颜色值", () => {
      const results = new Set();
      for (let i = 0; i < 100; i++) {
        results.add(getDanmakuColor("blood"));
      }
      expect(results.size).toBeGreaterThanOrEqual(1);
      expect(results.size).toBeLessThanOrEqual(3);
    });

    it("应该返回有效的十六进制颜色值", () => {
      const hexColorRegex = /^#[0-9A-F]{6}$/i;
      const themes: DanmakuTheme[] = ["blood", "mix", "dongzhu", "kaige", "tiger", "sweet"];

      themes.forEach(theme => {
        const color = getDanmakuColor(theme);
        expect(hexColorRegex.test(color)).toBe(true);
      });
    });

    it("返回值应该是字符串类型", () => {
      expect(typeof getDanmakuColor("blood")).toBe("string");
    });
  });

  describe("函数组合使用", () => {
    it("应该能够组合使用 getSizeByTextLength 和 getDanmakuColor", () => {
      const text = "测试弹幕";
      const size = getSizeByTextLength(text);
      const color = getDanmakuColor("blood");

      expect(size).toBe("medium");
      expect(color).toMatch(/^#[0-9A-F]{6}$/i);
    });

    it("应该能够组合使用 generateTimestamp 和 getRandomDanmakuType", () => {
      const timestamp = generateTimestamp();
      const type = getRandomDanmakuType();

      expect(timestamp).toMatch(/^\d{2}:\d{2}:\d{2}$/);
      expect(["sidebar", "horizontal"]).toContain(type);
    });

    it("应该能够处理完整的弹幕创建流程", () => {
      const text = "Hello";
      const theme: DanmakuTheme = "sweet";

      const size = getSizeByTextLength(text);
      const color = getThemeColor(theme, "primary");
      const timestamp = generateTimestamp();

      expect(size).toBe("medium");
      expect(color).toBe("#FF69B4");
      expect(timestamp).toMatch(/^\d{2}:\d{2}:\d{2}$/);
    });
  });
});

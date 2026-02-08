/**
 * CDN 工具模块测试用例
 * 测试 jsDelivr CDN、JSDMirror 镜像 URL 生成和图片访问性检查功能
 *
 * 注意：部分测试依赖网络访问 CDN
 * 在中国大陆网络环境下可能无法正常访问 jsDelivr，但 JSDMirror 应该可以
 */

import {
  getCdnUrl,
  getCdnImageUrl,
  getCdnFaviconUrl,
  getJsdelivrUrl,
  getJsdelivrImageUrl,
  getJsdelivrFaviconUrl,
  getJsdMirrorUrl,
  getJsdMirrorImageUrl,
  getJsdMirrorFaviconUrl,
  getOptimizedImageUrl,
  isInMainlandChina,
  getCurrentCdnConfig,
  getCdnDiagnostics,
  resetLocationCache,
} from "@/utils/cdn";

// 扩展 Window 接口以包含测试所需的属性
declare global {
  interface Window {
    __USE_JSDELIVR_CDN__?: boolean;
  }
}

describe("CDN 工具模块测试", () => {
  describe("地理位置检测", () => {
    beforeEach(() => {
      // 重置地理位置缓存，确保每次测试都是干净的状态
      resetLocationCache();
    });

    afterEach(() => {
      // 恢复原始值
      jest.restoreAllMocks();
      // 再次重置缓存
      resetLocationCache();
    });

    test("isInMainlandChina 返回布尔值", () => {
      const result = isInMainlandChina();
      expect(typeof result).toBe("boolean");
    });

    describe("时区检测", () => {
      test("Asia/Shanghai 时区应识别为在中国大陆", () => {
        // Mock Intl.DateTimeFormat
        jest.spyOn(Intl, "DateTimeFormat").mockImplementation(
          () =>
            ({
              resolvedOptions: () => ({ timeZone: "Asia/Shanghai" }),
            }) as Intl.DateTimeFormat
        );

        const result = isInMainlandChina();
        expect(result).toBe(true);
      });

      test("Asia/Chongqing 时区应识别为在中国大陆", () => {
        jest.spyOn(Intl, "DateTimeFormat").mockImplementation(
          () =>
            ({
              resolvedOptions: () => ({ timeZone: "Asia/Chongqing" }),
            }) as Intl.DateTimeFormat
        );

        const result = isInMainlandChina();
        expect(result).toBe(true);
      });

      test("Asia/Hong_Kong 时区应识别为在中国大陆", () => {
        jest.spyOn(Intl, "DateTimeFormat").mockImplementation(
          () =>
            ({
              resolvedOptions: () => ({ timeZone: "Asia/Hong_Kong" }),
            }) as Intl.DateTimeFormat
        );

        const result = isInMainlandChina();
        expect(result).toBe(true);
      });

      test("America/New_York 时区不应识别为在中国大陆", () => {
        jest.spyOn(Intl, "DateTimeFormat").mockImplementation(
          () =>
            ({
              resolvedOptions: () => ({ timeZone: "America/New_York" }),
            }) as Intl.DateTimeFormat
        );

        const result = isInMainlandChina();
        expect(result).toBe(false);
      });

      test("Asia/Tokyo 时区不应识别为在中国大陆", () => {
        // 设置非中文语言，确保语言检测不会误判
        Object.defineProperty(window, "navigator", {
          value: {
            language: "ja-jp",
          },
          writable: true,
          configurable: true,
        });

        // Mock 时区偏移为 UTC+9，确保时区偏移检测不会误判
        const mockDateClass = jest.fn(() => ({
          getTimezoneOffset: () => -540, // UTC+9 = -540 分钟
        })) as unknown as typeof Date;
        Object.setPrototypeOf(mockDateClass, Date);
        Object.defineProperty(mockDateClass, "now", {
          value: Date.now,
        });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        jest.spyOn(globalThis, "Date").mockImplementation(mockDateClass as any);

        jest.spyOn(Intl, "DateTimeFormat").mockImplementation(
          () =>
            ({
              resolvedOptions: () => ({ timeZone: "Asia/Tokyo" }),
            }) as Intl.DateTimeFormat
        );

        const result = isInMainlandChina();
        expect(result).toBe(false);
      });

      test("Europe/London 时区不应识别为在中国大陆", () => {
        jest.spyOn(Intl, "DateTimeFormat").mockImplementation(
          () =>
            ({
              resolvedOptions: () => ({ timeZone: "Europe/London" }),
            }) as Intl.DateTimeFormat
        );

        const result = isInMainlandChina();
        expect(result).toBe(false);
      });
    });

    describe("语言检测", () => {
      test("zh-cn 语言应识别为在中国大陆", () => {
        // Mock navigator.language
        Object.defineProperty(window, "navigator", {
          value: {
            language: "zh-cn",
          },
          writable: true,
          configurable: true,
        });

        // Mock 非中国时区，确保语言检测生效
        jest.spyOn(Intl, "DateTimeFormat").mockImplementation(
          () =>
            ({
              resolvedOptions: () => ({ timeZone: "America/New_York" }),
            }) as Intl.DateTimeFormat
        );

        const result = isInMainlandChina();
        expect(result).toBe(true);
      });

      test("zh-CN 语言应识别为在中国大陆", () => {
        Object.defineProperty(window, "navigator", {
          value: {
            language: "zh-CN",
          },
          writable: true,
          configurable: true,
        });

        jest.spyOn(Intl, "DateTimeFormat").mockImplementation(
          () =>
            ({
              resolvedOptions: () => ({ timeZone: "Europe/London" }),
            }) as Intl.DateTimeFormat
        );

        const result = isInMainlandChina();
        expect(result).toBe(true);
      });

      test("zh-tw 语言不应识别为在中国大陆", () => {
        Object.defineProperty(window, "navigator", {
          value: {
            language: "zh-tw",
          },
          writable: true,
          configurable: true,
        });

        // 设置非中国时区，确保时区偏移检测不会误判
        jest.spyOn(Intl, "DateTimeFormat").mockImplementation(
          () =>
            ({
              resolvedOptions: () => ({ timeZone: "America/New_York" }),
            }) as Intl.DateTimeFormat
        );

        const result = isInMainlandChina();
        expect(result).toBe(false);
      });

      test("en-us 语言不应识别为在中国大陆", () => {
        Object.defineProperty(window, "navigator", {
          value: {
            language: "en-us",
          },
          writable: true,
          configurable: true,
        });

        jest.spyOn(Intl, "DateTimeFormat").mockImplementation(
          () =>
            ({
              resolvedOptions: () => ({ timeZone: "America/New_York" }),
            }) as Intl.DateTimeFormat
        );

        const result = isInMainlandChina();
        expect(result).toBe(false);
      });

      test("ja-jp 语言不应识别为在中国大陆", () => {
        Object.defineProperty(window, "navigator", {
          value: {
            language: "ja-jp",
          },
          writable: true,
          configurable: true,
        });

        // 设置非亚洲时区，确保时区偏移检测不会误判
        jest.spyOn(Intl, "DateTimeFormat").mockImplementation(
          () =>
            ({
              resolvedOptions: () => ({ timeZone: "America/New_York" }),
            }) as Intl.DateTimeFormat
        );

        const result = isInMainlandChina();
        expect(result).toBe(false);
      });
    });

    describe("时区偏移检测", () => {
      test("UTC+8 偏移且 Asia 时区应识别为在中国大陆", () => {
        // UTC+8 对应 offset = -480 分钟
        const mockDate = new Date("2024-01-01T12:00:00+08:00");
        jest.spyOn(globalThis, "Date").mockImplementation(() => mockDate);

        jest.spyOn(Intl, "DateTimeFormat").mockImplementation(
          () =>
            ({
              resolvedOptions: () => ({ timeZone: "Asia/Singapore" }),
            }) as Intl.DateTimeFormat
        );

        Object.defineProperty(window, "navigator", {
          value: {
            language: "en-us",
          },
          writable: true,
          configurable: true,
        });

        const result = isInMainlandChina();
        expect(result).toBe(true);
      });

      test("UTC+8 偏移但非 Asia 时区不应识别为在中国大陆", () => {
        const mockDate = new Date("2024-01-01T12:00:00+08:00");
        jest.spyOn(globalThis, "Date").mockImplementation(() => mockDate);

        jest.spyOn(Intl, "DateTimeFormat").mockImplementation(
          () =>
            ({
              resolvedOptions: () => ({ timeZone: "Australia/Perth" }),
            }) as Intl.DateTimeFormat
        );

        Object.defineProperty(window, "navigator", {
          value: {
            language: "en-us",
          },
          writable: true,
          configurable: true,
        });

        const result = isInMainlandChina();
        expect(result).toBe(false);
      });

      test("UTC+9 偏移不应识别为在中国大陆", () => {
        // UTC+9 对应 offset = -540 分钟
        // 创建一个 mock Date 类，使其 getTimezoneOffset 返回 -540
        const mockDateClass = jest.fn(() => ({
          getTimezoneOffset: () => -540,
        })) as unknown as typeof Date;

        // 复制 Date 的静态方法
        Object.setPrototypeOf(mockDateClass, Date);
        Object.defineProperty(mockDateClass, "now", {
          value: Date.now,
        });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        jest.spyOn(globalThis, "Date").mockImplementation(mockDateClass as any);

        jest.spyOn(Intl, "DateTimeFormat").mockImplementation(
          () =>
            ({
              resolvedOptions: () => ({ timeZone: "Asia/Tokyo" }),
            }) as Intl.DateTimeFormat
        );

        Object.defineProperty(window, "navigator", {
          value: {
            language: "ja-jp",
          },
          writable: true,
          configurable: true,
        });

        const result = isInMainlandChina();
        expect(result).toBe(false);
      });

      test("UTC-5 偏移不应识别为在中国大陆", () => {
        // UTC-5 对应 offset = 300 分钟
        const mockDate = new Date("2024-01-01T12:00:00-05:00");
        jest.spyOn(globalThis, "Date").mockImplementation(() => mockDate);

        jest.spyOn(Intl, "DateTimeFormat").mockImplementation(
          () =>
            ({
              resolvedOptions: () => ({ timeZone: "America/New_York" }),
            }) as Intl.DateTimeFormat
        );

        Object.defineProperty(window, "navigator", {
          value: {
            language: "en-us",
          },
          writable: true,
          configurable: true,
        });

        const result = isInMainlandChina();
        expect(result).toBe(false);
      });
    });

    describe("缓存机制", () => {
      test("多次调用应返回相同结果", () => {
        jest.spyOn(Intl, "DateTimeFormat").mockImplementation(
          () =>
            ({
              resolvedOptions: () => ({ timeZone: "Asia/Shanghai" }),
            }) as Intl.DateTimeFormat
        );

        const result1 = isInMainlandChina();
        const result2 = isInMainlandChina();
        const result3 = isInMainlandChina();

        expect(result1).toBe(true);
        expect(result2).toBe(true);
        expect(result3).toBe(true);
        expect(result1).toBe(result2);
        expect(result2).toBe(result3);
      });

      test("缓存应减少 Intl.DateTimeFormat 调用次数", () => {
        const mockFn = jest.spyOn(Intl, "DateTimeFormat").mockImplementation(
          () =>
            ({
              resolvedOptions: () => ({ timeZone: "Asia/Shanghai" }),
            }) as Intl.DateTimeFormat
        );

        // 第一次调用
        isInMainlandChina();
        expect(mockFn).toHaveBeenCalledTimes(1);

        // 第二次调用（应使用缓存）
        isInMainlandChina();
        // 由于缓存，不应该再次调用 Intl.DateTimeFormat
        expect(mockFn).toHaveBeenCalledTimes(1);
      });
    });

    describe("综合场景", () => {
      test("中国大陆典型环境：上海时区 + 中文语言", () => {
        jest.spyOn(Intl, "DateTimeFormat").mockImplementation(
          () =>
            ({
              resolvedOptions: () => ({ timeZone: "Asia/Shanghai" }),
            }) as Intl.DateTimeFormat
        );

        Object.defineProperty(window, "navigator", {
          value: {
            language: "zh-cn",
          },
          writable: true,
          configurable: true,
        });

        const result = isInMainlandChina();
        expect(result).toBe(true);
      });

      test("海外典型环境：纽约时区 + 英文语言", () => {
        jest.spyOn(Intl, "DateTimeFormat").mockImplementation(
          () =>
            ({
              resolvedOptions: () => ({ timeZone: "America/New_York" }),
            }) as Intl.DateTimeFormat
        );

        Object.defineProperty(window, "navigator", {
          value: {
            language: "en-us",
          },
          writable: true,
          configurable: true,
        });

        const result = isInMainlandChina();
        expect(result).toBe(false);
      });

      test("边缘情况：香港时区 + 英文语言", () => {
        jest.spyOn(Intl, "DateTimeFormat").mockImplementation(
          () =>
            ({
              resolvedOptions: () => ({ timeZone: "Asia/Hong_Kong" }),
            }) as Intl.DateTimeFormat
        );

        Object.defineProperty(window, "navigator", {
          value: {
            language: "en-hk",
          },
          writable: true,
          configurable: true,
        });

        const result = isInMainlandChina();
        expect(result).toBe(true);
      });
    });

    test("getCurrentCdnConfig 返回正确的配置结构", () => {
      const config = getCurrentCdnConfig();
      expect(config).toHaveProperty("name");
      expect(config).toHaveProperty("baseUrl");
      expect(config).toHaveProperty("owner");
      expect(config).toHaveProperty("repo");
      expect(config).toHaveProperty("branch");
    });

    test("getCdnDiagnostics 返回诊断信息", () => {
      const diagnostics = getCdnDiagnostics();
      expect(diagnostics).toHaveProperty("location");
      expect(diagnostics).toHaveProperty("cdn");
      expect(diagnostics).toHaveProperty("timezone");
      expect(diagnostics).toHaveProperty("language");
      expect(["china", "global"]).toContain(diagnostics.location);
    });
  });

  describe("智能 CDN URL 生成", () => {
    test("getCdnUrl 生成正确的 URL 格式", () => {
      const path = "frontend/public/thumbs/BV1BofDBpESU.webp";
      const url = getCdnUrl(path);

      // 验证 URL 结构
      expect(url).toMatch(/^https:\/\/cdn\.(jsdelivr\.net|jsdmirror\.com)\/gh\//);
      expect(url).toContain("forzenfox/VidTimelineX@master");
      expect(url).toContain("BV1BofDBpESU.webp");
    });

    test("getCdnImageUrl 生成图片 URL", () => {
      const filename = "BV1BofDBpESU.webp";
      const url = getCdnImageUrl(filename);

      expect(url).toContain("frontend/public/thumbs/");
      expect(url).toContain(filename);
    });

    test("getCdnFaviconUrl 生成图标 URL", () => {
      const filename = "favicon.ico";
      const url = getCdnFaviconUrl(filename);

      expect(url).toContain("frontend/public/");
      expect(url).toContain(filename);
    });
  });

  describe("jsDelivr CDN URL 生成", () => {
    test("getJsdelivrUrl 生成正确的 jsDelivr URL", () => {
      const path = "frontend/public/thumbs/BV1BofDBpESU.webp";
      const url = getJsdelivrUrl(path);

      expect(url).toBe(
        "https://cdn.jsdelivr.net/gh/forzenfox/VidTimelineX@master/frontend/public/thumbs/BV1BofDBpESU.webp"
      );
    });

    test("getJsdelivrImageUrl 生成图片 URL", () => {
      const filename = "BV1BofDBpESU.webp";
      const url = getJsdelivrImageUrl(filename);

      expect(url).toBe(
        "https://cdn.jsdelivr.net/gh/forzenfox/VidTimelineX@master/frontend/public/thumbs/BV1BofDBpESU.webp"
      );
    });

    test("getJsdelivrFaviconUrl 生成图标 URL", () => {
      const filename = "favicon-32x32.png";
      const url = getJsdelivrFaviconUrl(filename);

      expect(url).toBe(
        "https://cdn.jsdelivr.net/gh/forzenfox/VidTimelineX@master/frontend/public/favicon-32x32.png"
      );
    });
  });

  describe("JSDMirror CDN URL 生成", () => {
    test("getJsdMirrorUrl 生成正确的 JSDMirror URL", () => {
      const path = "frontend/public/thumbs/BV1BofDBpESU.webp";
      const url = getJsdMirrorUrl(path);

      expect(url).toBe(
        "https://cdn.jsdmirror.com/gh/forzenfox/VidTimelineX@master/frontend/public/thumbs/BV1BofDBpESU.webp"
      );
    });

    test("getJsdMirrorImageUrl 生成图片 URL", () => {
      const filename = "BV1BofDBpESU.webp";
      const url = getJsdMirrorImageUrl(filename);

      expect(url).toBe(
        "https://cdn.jsdmirror.com/gh/forzenfox/VidTimelineX@master/frontend/public/thumbs/BV1BofDBpESU.webp"
      );
    });

    test("getJsdMirrorFaviconUrl 生成图标 URL", () => {
      const filename = "favicon-32x32.png";
      const url = getJsdMirrorFaviconUrl(filename);

      expect(url).toBe(
        "https://cdn.jsdmirror.com/gh/forzenfox/VidTimelineX@master/frontend/public/favicon-32x32.png"
      );
    });
  });

  describe("路径处理", () => {
    test("带斜杠开头的路径正确处理", () => {
      const path = "/frontend/public/thumbs/test.webp";
      const jsdelivrUrl = getJsdelivrUrl(path);
      const jsdMirrorUrl = getJsdMirrorUrl(path);

      expect(jsdelivrUrl).toBe(
        "https://cdn.jsdelivr.net/gh/forzenfox/VidTimelineX@master/frontend/public/thumbs/test.webp"
      );
      expect(jsdMirrorUrl).toBe(
        "https://cdn.jsdmirror.com/gh/forzenfox/VidTimelineX@master/frontend/public/thumbs/test.webp"
      );
    });

    test("嵌套路径正确处理", () => {
      const path = "frontend/public/thumbs/nested/folder/image.webp";
      const url = getJsdelivrUrl(path);

      expect(url).toBe(
        "https://cdn.jsdelivr.net/gh/forzenfox/VidTimelineX@master/frontend/public/thumbs/nested/folder/image.webp"
      );
    });

    test("空路径处理", () => {
      const url = getJsdelivrUrl("");

      expect(url).toBe("https://cdn.jsdelivr.net/gh/forzenfox/VidTimelineX@master/");
    });
  });

  describe("优化图片 URL 测试", () => {
    // 保存原始 window.__USE_JSDELIVR_CDN__
    const originalUseCdn = globalThis.window?.__USE_JSDELIVR_CDN__;

    beforeEach(() => {
      // 确保 window 对象存在
      if (typeof globalThis.window === "undefined") {
        (globalThis as unknown as { window: Window }).window = {} as Window;
      }
    });

    afterAll(() => {
      // 恢复原始环境
      if (typeof globalThis.window !== "undefined") {
        globalThis.window.__USE_JSDELIVR_CDN__ = originalUseCdn;
      }
    });

    test("启用 CDN 时返回 CDN URL", () => {
      // 模拟启用 CDN
      globalThis.window.__USE_JSDELIVR_CDN__ = true;

      const url = getOptimizedImageUrl("BV1BofDBpESU.webp");

      // 验证返回的是 CDN URL（可能是 jsDelivr 或 JSDMirror）
      expect(url).toMatch(/^https:\/\/cdn\.(jsdelivr\.net|jsdmirror\.com)\/gh\//);
      expect(url).toContain("BV1BofDBpESU.webp");
    });

    test("禁用 CDN 时返回本地 URL", () => {
      // 模拟禁用 CDN
      globalThis.window.__USE_JSDELIVR_CDN__ = false;

      const url = getOptimizedImageUrl("BV1BofDBpESU.webp");

      expect(url).toBe("/thumbs/BV1BofDBpESU.webp");
    });

    test("自定义本地基础 URL", () => {
      globalThis.window.__USE_JSDELIVR_CDN__ = false;

      const url = getOptimizedImageUrl("BV1BofDBpESU.webp", "/app/");

      expect(url).toBe("/app/thumbs/BV1BofDBpESU.webp");
    });
  });

  describe("URL 格式验证", () => {
    test("生成的 jsDelivr URL 格式正确", () => {
      const filename = "test.webp";
      const url = getJsdelivrImageUrl(filename);

      // 验证 URL 结构
      expect(url).toMatch(/^https:\/\/cdn\.jsdelivr\.net\/gh\//);
      expect(url).toContain("forzenfox/VidTimelineX@master");
      expect(url).toContain(filename);
    });

    test("生成的 JSDMirror URL 格式正确", () => {
      const filename = "test.webp";
      const url = getJsdMirrorImageUrl(filename);

      // 验证 URL 结构
      expect(url).toMatch(/^https:\/\/cdn\.jsdmirror\.com\/gh\//);
      expect(url).toContain("forzenfox/VidTimelineX@master");
      expect(url).toContain(filename);
    });

    test("特殊字符文件名处理", () => {
      const filename = "image-with_special.chars.webp";
      const url = getJsdelivrImageUrl(filename);

      expect(url).toContain(filename);
    });
  });

  describe("CDN 自动选择逻辑测试", () => {
    beforeEach(() => {
      resetLocationCache();
    });

    afterEach(() => {
      jest.restoreAllMocks();
      resetLocationCache();
    });

    test("中国大陆用户应该使用 JSDMirror", () => {
      // 模拟中国大陆时区
      jest.spyOn(Intl, "DateTimeFormat").mockImplementation(
        () =>
          ({
            resolvedOptions: () => ({ timeZone: "Asia/Shanghai" }),
          }) as Intl.DateTimeFormat
      );

      const url = getCdnImageUrl("test.webp");

      // 应该使用 JSDMirror
      expect(url).toContain("cdn.jsdmirror.com");
      expect(url).not.toContain("cdn.jsdelivr.net");
    });

    test("海外用户应该使用 jsDelivr", () => {
      // 模拟美国时区
      jest.spyOn(Intl, "DateTimeFormat").mockImplementation(
        () =>
          ({
            resolvedOptions: () => ({ timeZone: "America/New_York" }),
          }) as Intl.DateTimeFormat
      );

      Object.defineProperty(window, "navigator", {
        value: { language: "en-us" },
        writable: true,
        configurable: true,
      });

      const url = getCdnImageUrl("test.webp");

      // 应该使用 jsDelivr
      expect(url).toContain("cdn.jsdelivr.net");
      expect(url).not.toContain("cdn.jsdmirror.com");
    });
  });

  describe("B站 CDN 禁用测试", () => {
    test("getOptimizedImageUrl 不应该返回 B站 CDN URL", () => {
      // 模拟启用 CDN
      globalThis.window.__USE_JSDELIVR_CDN__ = true;

      const url = getOptimizedImageUrl("test.webp");

      // 不应该包含 B站 CDN 域名
      expect(url).not.toContain("hdslb.com");
      expect(url).not.toContain("bilibili.com");
      // 应该使用 jsDelivr 或 JSDMirror
      expect(url).toMatch(/^https:\/\/cdn\.(jsdelivr\.net|jsdmirror\.com)\/gh\//);
    });

    test("禁用 CDN 时应该返回本地 URL，而不是 B站 CDN", () => {
      globalThis.window.__USE_JSDELIVR_CDN__ = false;

      const url = getOptimizedImageUrl("test.webp");

      // 应该返回本地 URL
      expect(url).toBe("/thumbs/test.webp");
      // 不应该包含任何 CDN 域名
      expect(url).not.toContain("hdslb.com");
      expect(url).not.toContain("bilibili.com");
      expect(url).not.toContain("jsdelivr");
      expect(url).not.toContain("jsdmirror");
    });
  });

  describe("本地图片加载测试", () => {
    test("本地图片 URL 格式正确", () => {
      globalThis.window.__USE_JSDELIVR_CDN__ = false;

      const url = getOptimizedImageUrl("BV1BofDBpESU.webp");

      expect(url).toBe("/thumbs/BV1BofDBpESU.webp");
    });

    test("自定义基础 URL 的本地图片路径正确", () => {
      globalThis.window.__USE_JSDELIVR_CDN__ = false;

      const url = getOptimizedImageUrl("test.webp", "/app/");

      expect(url).toBe("/app/thumbs/test.webp");
    });

    test("自定义基础 URL 不带斜杠时正确处理", () => {
      globalThis.window.__USE_JSDELIVR_CDN__ = false;

      const url = getOptimizedImageUrl("test.webp", "/app");

      expect(url).toBe("/app/thumbs/test.webp");
    });
  });
});

/**
 * 手动运行测试的辅助函数
 * 可以在浏览器控制台中运行以验证 CDN 访问
 */
export async function runCdnDiagnostics(): Promise<void> {
  console.log("=== CDN 诊断信息 ===\n");

  // 显示地理位置信息
  const diagnostics = getCdnDiagnostics();
  console.log("地理位置信息:", diagnostics);

  // 测试 jsDelivr
  console.log("\n测试 jsDelivr CDN:");
  const jsdelivrUrl = getJsdelivrImageUrl("BV1BofDBpESU.webp");
  console.log("  URL:", jsdelivrUrl);

  // 测试 JSDMirror
  console.log("\n测试 JSDMirror CDN:");
  const jsdMirrorUrl = getJsdMirrorImageUrl("BV1BofDBpESU.webp");
  console.log("  URL:", jsdMirrorUrl);

  // 测试智能选择
  console.log("\n测试智能 CDN 选择:");
  const smartUrl = getCdnImageUrl("BV1BofDBpESU.webp");
  console.log("  URL:", smartUrl);
  console.log("  使用的 CDN:", diagnostics.cdn);

  console.log("\n=== CDN 诊断完成 ===");
}

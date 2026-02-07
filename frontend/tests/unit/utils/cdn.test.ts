/**
 * CDN 工具模块测试用例
 * 测试 jsDelivr CDN URL 生成和图片访问性检查功能
 *
 * 注意：部分测试依赖网络访问 jsDelivr CDN
 * 在中国大陆网络环境下可能无法正常访问
 */

import {
  getJsdelivrUrl,
  getJsdelivrImageUrl,
  getJsdelivrFaviconUrl,
  getOptimizedImageUrl,
} from "@/utils/cdn";

// 扩展 Window 接口以包含测试所需的属性
declare global {
  interface Window {
    __USE_JSDELIVR_CDN__?: boolean;
  }
}

describe("CDN 工具模块测试", () => {
  describe("URL 生成测试", () => {
    test("本地路径正确转换为 jsDelivr URL", () => {
      const path = "frontend/public/thumbs/BV1BofDBpESU.webp";
      const url = getJsdelivrUrl(path);

      expect(url).toBe(
        "https://cdn.jsdelivr.net/gh/forzenfox/VidTimelineX@master/frontend/public/thumbs/BV1BofDBpESU.webp"
      );
    });

    test("带斜杠开头的路径正确处理", () => {
      const path = "/frontend/public/thumbs/test.webp";
      const url = getJsdelivrUrl(path);

      expect(url).toBe(
        "https://cdn.jsdelivr.net/gh/forzenfox/VidTimelineX@master/frontend/public/thumbs/test.webp"
      );
    });

    test("嵌套路径正确处理", () => {
      const path = "frontend/public/thumbs/nested/folder/image.webp";
      const url = getJsdelivrUrl(path);

      expect(url).toBe(
        "https://cdn.jsdelivr.net/gh/forzenfox/VidTimelineX@master/frontend/public/thumbs/nested/folder/image.webp"
      );
    });

    test("获取图片 jsDelivr URL", () => {
      const filename = "BV1BofDBpESU.webp";
      const url = getJsdelivrImageUrl(filename);

      expect(url).toBe(
        "https://cdn.jsdelivr.net/gh/forzenfox/VidTimelineX@master/frontend/public/thumbs/BV1BofDBpESU.webp"
      );
    });

    test("获取网站图标 jsDelivr URL", () => {
      const filename = "favicon-32x32.png";
      const url = getJsdelivrFaviconUrl(filename);

      expect(url).toBe(
        "https://cdn.jsdelivr.net/gh/forzenfox/VidTimelineX@master/frontend/public/favicon-32x32.png"
      );
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

    test("启用 jsDelivr 时返回 CDN URL", () => {
      // 模拟启用 CDN
      globalThis.window.__USE_JSDELIVR_CDN__ = true;

      const url = getOptimizedImageUrl("BV1BofDBpESU.webp");

      expect(url).toContain("cdn.jsdelivr.net");
      expect(url).toContain("BV1BofDBpESU.webp");
    });

    test("禁用 jsDelivr 时返回本地 URL", () => {
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

    test("特殊字符文件名处理", () => {
      const filename = "image-with_special.chars.webp";
      const url = getJsdelivrImageUrl(filename);

      expect(url).toContain(filename);
    });

    test("空路径处理", () => {
      const url = getJsdelivrUrl("");

      expect(url).toBe("https://cdn.jsdelivr.net/gh/forzenfox/VidTimelineX@master/");
    });
  });
});

/**
 * 手动运行测试的辅助函数
 * 可以在浏览器控制台中运行以验证 CDN 访问
 */
export async function runCdnUrlTests(): Promise<void> {
  console.log("=== 开始 CDN URL 测试 ===\n");

  // 测试 URL 生成
  console.log("1. 测试 URL 生成:");
  const testPath = "frontend/public/thumbs/BV1BofDBpESU.webp";
  const url = getJsdelivrUrl(testPath);
  console.log(`   输入: ${testPath}`);
  console.log(`   输出: ${url}`);

  // 测试图片 URL
  console.log("\n2. 测试图片 URL:");
  const imageUrl = getJsdelivrImageUrl("test.webp");
  console.log(`   输出: ${imageUrl}`);

  // 测试图标 URL
  console.log("\n3. 测试图标 URL:");
  const faviconUrl = getJsdelivrFaviconUrl("favicon.ico");
  console.log(`   输出: ${faviconUrl}`);

  console.log("\n=== CDN URL 测试完成 ===");
}

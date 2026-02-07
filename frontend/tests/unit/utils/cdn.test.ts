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
} from "@/utils/cdn";

// 扩展 Window 接口以包含测试所需的属性
declare global {
  interface Window {
    __USE_JSDELIVR_CDN__?: boolean;
  }
}

describe("CDN 工具模块测试", () => {
  describe("地理位置检测", () => {
    test("isInMainlandChina 返回布尔值", () => {
      const result = isInMainlandChina();
      expect(typeof result).toBe("boolean");
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

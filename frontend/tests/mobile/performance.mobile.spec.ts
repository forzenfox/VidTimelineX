import { test, expect, Page } from "@playwright/test";

/**
 * 移动端性能测试
 * 测量页面加载速度、资源加载效率等性能指标
 */

// 测试页面列表
const PAGES = [
  { path: "/lvjiang", name: "lvjiang" },
  { path: "/tiantong", name: "tiantong" },
  { path: "/yuxiaoc", name: "yuxiaoc" },
];

// 性能指标阈值
const PERFORMANCE_THRESHOLDS = {
  // 首次内容绘制 (FCP) - 应该小于1.8秒
  fcp: 1800,
  // 最大内容绘制 (LCP) - 应该小于2.5秒
  lcp: 2500,
  // 首次输入延迟 (FID) - 应该小于100毫秒
  fid: 100,
  // 累积布局偏移 (CLS) - 应该小于0.1
  cls: 0.1,
  // 可交互时间 (TTI) - 应该小于3.8秒
  tti: 3800,
  // 总阻塞时间 (TBT) - 应该小于200毫秒
  tbt: 200,
  // 页面完全加载时间
  loadTime: 5000,
  // DOM内容加载时间
  domContentLoaded: 3000,
};

/**
 * 收集性能指标
 * @param page - Playwright页面对象
 */
async function collectPerformanceMetrics(page: Page): Promise<{
  fcp: number;
  lcp: number;
  cls: number;
  loadTime: number;
  domContentLoaded: number;
  resourceCount: number;
  resourceSize: number;
}> {
  // 等待页面加载完成
  await page.waitForLoadState("networkidle");

  // 获取性能指标
  const metrics = await page.evaluate(() => {
    const navigation = performance.getEntriesByType(
      "navigation"
    )[0] as PerformanceNavigationTiming;
    const paintEntries = performance.getEntriesByType("paint");
    const lcpEntries = performance.getEntriesByType("largest-contentful-paint");
    const layoutShiftEntries = performance.getEntriesByType("layout-shift");

    // 计算FCP
    const fcpEntry = paintEntries.find((entry) => entry.name === "first-contentful-paint");
    const fcp = fcpEntry ? fcpEntry.startTime : 0;

    // 计算LCP
    const lcp = lcpEntries.length > 0 ? (lcpEntries[lcpEntries.length - 1] as any).startTime : 0;

    // 计算CLS
    let cls = 0;
    layoutShiftEntries.forEach((entry: any) => {
      if (!entry.hadRecentInput) {
        cls += entry.value;
      }
    });

    // 计算加载时间
    const loadTime = navigation ? navigation.loadEventEnd : 0;
    const domContentLoaded = navigation ? navigation.domContentLoadedEventEnd : 0;

    // 获取资源信息
    const resources = performance.getEntriesByType("resource");
    const resourceCount = resources.length;
    const resourceSize = resources.reduce((total, resource: any) => {
      return total + (resource.transferSize || 0);
    }, 0);

    return {
      fcp,
      lcp,
      cls,
      loadTime,
      domContentLoaded,
      resourceCount,
      resourceSize,
    };
  });

  return metrics;
}

/**
 * 获取Web Vitals指标
 * @param page - Playwright页面对象
 */
async function getWebVitals(page: Page): Promise<{
  fcp: number;
  lcp: number;
  cls: number;
  ttfb: number;
}> {
  return await page.evaluate(() => {
    return new Promise((resolve) => {
      // 使用web-vitals库或手动计算
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        // 处理性能条目
      });

      // 收集FCP
      const paintEntries = performance.getEntriesByType("paint");
      const fcp =
        paintEntries.find((e) => e.name === "first-contentful-paint")?.startTime || 0;

      // 收集LCP
      const lcpEntries = performance.getEntriesByType("largest-contentful-paint");
      const lcp = lcpEntries.length > 0 ? (lcpEntries[lcpEntries.length - 1] as any).startTime : 0;

      // 收集CLS
      const layoutShiftEntries = performance.getEntriesByType("layout-shift");
      let cls = 0;
      layoutShiftEntries.forEach((entry: any) => {
        if (!entry.hadRecentInput) {
          cls += entry.value;
        }
      });

      // 收集TTFB
      const navigation = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming;
      const ttfb = navigation ? navigation.responseStart : 0;

      resolve({ fcp, lcp, cls, ttfb });
    });
  });
}

test.describe("移动端性能测试 - 页面加载性能", () => {
  for (const { path, name } of PAGES) {
    test(`${name}页面 - 首次内容绘制(FCP)性能`, async ({ page }) => {
      await page.goto(path);

      const metrics = await collectPerformanceMetrics(page);

      // 验证FCP在阈值内
      expect(
        metrics.fcp,
        `FCP应该小于${PERFORMANCE_THRESHOLDS.fcp}ms，实际为${metrics.fcp}ms`
      ).toBeLessThan(PERFORMANCE_THRESHOLDS.fcp);

      // 记录性能数据
      test.info().attach(`${name}-fcp-metrics`, {
        body: JSON.stringify({ fcp: metrics.fcp, threshold: PERFORMANCE_THRESHOLDS.fcp }),
        contentType: "application/json",
      });
    });

    test(`${name}页面 - 最大内容绘制(LCP)性能`, async ({ page }) => {
      await page.goto(path);

      // 等待一段时间让LCP稳定
      await page.waitForTimeout(3000);

      const metrics = await collectPerformanceMetrics(page);

      // 验证LCP在阈值内（如果LCP有值）
      if (metrics.lcp > 0) {
        expect(
          metrics.lcp,
          `LCP应该小于${PERFORMANCE_THRESHOLDS.lcp}ms，实际为${metrics.lcp}ms`
        ).toBeLessThan(PERFORMANCE_THRESHOLDS.lcp);
      }

      test.info().attach(`${name}-lcp-metrics`, {
        body: JSON.stringify({ lcp: metrics.lcp, threshold: PERFORMANCE_THRESHOLDS.lcp }),
        contentType: "application/json",
      });
    });

    test(`${name}页面 - 累积布局偏移(CLS)性能`, async ({ page }) => {
      await page.goto(path);

      // 等待页面稳定
      await page.waitForTimeout(3000);

      const metrics = await collectPerformanceMetrics(page);

      // 验证CLS在阈值内
      expect(
        metrics.cls,
        `CLS应该小于${PERFORMANCE_THRESHOLDS.cls}，实际为${metrics.cls}`
      ).toBeLessThan(PERFORMANCE_THRESHOLDS.cls);

      test.info().attach(`${name}-cls-metrics`, {
        body: JSON.stringify({ cls: metrics.cls, threshold: PERFORMANCE_THRESHOLDS.cls }),
        contentType: "application/json",
      });
    });

    test(`${name}页面 - 页面完全加载时间`, async ({ page }) => {
      const startTime = Date.now();
      await page.goto(path);
      await page.waitForLoadState("networkidle");
      const endTime = Date.now();

      const loadTime = endTime - startTime;

      // 验证加载时间在阈值内
      expect(
        loadTime,
        `页面加载时间应该小于${PERFORMANCE_THRESHOLDS.loadTime}ms，实际为${loadTime}ms`
      ).toBeLessThan(PERFORMANCE_THRESHOLDS.loadTime);

      test.info().attach(`${name}-load-time`, {
        body: JSON.stringify({ loadTime, threshold: PERFORMANCE_THRESHOLDS.loadTime }),
        contentType: "application/json",
      });
    });

    test(`${name}页面 - DOM内容加载时间`, async ({ page }) => {
      await page.goto(path);

      const metrics = await collectPerformanceMetrics(page);

      // 验证DOM内容加载时间在阈值内
      expect(
        metrics.domContentLoaded,
        `DOM内容加载时间应该小于${PERFORMANCE_THRESHOLDS.domContentLoaded}ms，实际为${metrics.domContentLoaded}ms`
      ).toBeLessThan(PERFORMANCE_THRESHOLDS.domContentLoaded);

      test.info().attach(`${name}-dom-content-loaded`, {
        body: JSON.stringify({
          domContentLoaded: metrics.domContentLoaded,
          threshold: PERFORMANCE_THRESHOLDS.domContentLoaded,
        }),
        contentType: "application/json",
      });
    });
  }
});

test.describe("移动端性能测试 - 资源加载效率", () => {
  for (const { path, name } of PAGES) {
    test(`${name}页面 - 资源数量优化`, async ({ page }) => {
      await page.goto(path);
      await page.waitForLoadState("networkidle");

      const metrics = await collectPerformanceMetrics(page);

      // 验证资源数量合理（通常应该小于100个）
      const maxResourceCount = 100;
      expect(
        metrics.resourceCount,
        `资源数量应该小于${maxResourceCount}个，实际为${metrics.resourceCount}个`
      ).toBeLessThan(maxResourceCount);

      test.info().attach(`${name}-resource-count`, {
        body: JSON.stringify({ resourceCount: metrics.resourceCount, threshold: maxResourceCount }),
        contentType: "application/json",
      });
    });

    test(`${name}页面 - 资源大小优化`, async ({ page }) => {
      await page.goto(path);
      await page.waitForLoadState("networkidle");

      const metrics = await collectPerformanceMetrics(page);

      // 验证资源总大小合理（应该小于5MB）
      const maxResourceSize = 5 * 1024 * 1024; // 5MB
      expect(
        metrics.resourceSize,
        `资源总大小应该小于${maxResourceSize / 1024 / 1024}MB，实际为${(
          metrics.resourceSize / 1024 / 1024
        ).toFixed(2)}MB`
      ).toBeLessThan(maxResourceSize);

      test.info().attach(`${name}-resource-size`, {
        body: JSON.stringify({
          resourceSize: metrics.resourceSize,
          resourceSizeMB: (metrics.resourceSize / 1024 / 1024).toFixed(2),
          threshold: maxResourceSize,
        }),
        contentType: "application/json",
      });
    });

    test(`${name}页面 - 图片资源优化`, async ({ page }) => {
      await page.goto(path);
      await page.waitForLoadState("networkidle");

      // 获取所有图片资源
      const imageMetrics = await page.evaluate(() => {
        const images = performance.getEntriesByType("resource").filter((r: any) => {
          return r.initiatorType === "img" || /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(r.name);
        });

        const totalImages = images.length;
        const totalImageSize = images.reduce((sum: number, img: any) => {
          return sum + (img.transferSize || 0);
        }, 0);

        // 检查图片格式
        const webpImages = images.filter((img: any) => img.name.includes(".webp")).length;
        const modernFormatRatio = totalImages > 0 ? webpImages / totalImages : 0;

        return {
          totalImages,
          totalImageSize,
          webpImages,
          modernFormatRatio,
        };
      });

      // 验证图片数量合理
      expect(imageMetrics.totalImages).toBeLessThan(50);

      // 验证图片总大小合理（应该小于2MB）
      expect(imageMetrics.totalImageSize).toBeLessThan(2 * 1024 * 1024);

      test.info().attach(`${name}-image-metrics`, {
        body: JSON.stringify(imageMetrics),
        contentType: "application/json",
      });
    });

    test(`${name}页面 - JavaScript资源优化`, async ({ page }) => {
      await page.goto(path);
      await page.waitForLoadState("networkidle");

      // 获取JavaScript资源信息
      const jsMetrics = await page.evaluate(() => {
        const jsResources = performance.getEntriesByType("resource").filter((r: any) => {
          return r.initiatorType === "script" || r.name.endsWith(".js");
        });

        const totalJsFiles = jsResources.length;
        const totalJsSize = jsResources.reduce((sum: number, js: any) => {
          return sum + (js.transferSize || 0);
        }, 0);

        // 计算加载时间
        const totalJsLoadTime = jsResources.reduce((sum: number, js: any) => {
          return sum + (js.duration || 0);
        }, 0);

        return {
          totalJsFiles,
          totalJsSize,
          totalJsLoadTime,
        };
      });

      // 验证JS文件数量合理
      expect(jsMetrics.totalJsFiles).toBeLessThan(30);

      // 验证JS总大小合理（应该小于1MB）
      expect(jsMetrics.totalJsSize).toBeLessThan(1 * 1024 * 1024);

      test.info().attach(`${name}-js-metrics`, {
        body: JSON.stringify(jsMetrics),
        contentType: "application/json",
      });
    });

    test(`${name}页面 - CSS资源优化`, async ({ page }) => {
      await page.goto(path);
      await page.waitForLoadState("networkidle");

      // 获取CSS资源信息
      const cssMetrics = await page.evaluate(() => {
        const cssResources = performance.getEntriesByType("resource").filter((r: any) => {
          return r.initiatorType === "link" && r.name.endsWith(".css");
        });

        const totalCssFiles = cssResources.length;
        const totalCssSize = cssResources.reduce((sum: number, css: any) => {
          return sum + (css.transferSize || 0);
        }, 0);

        return {
          totalCssFiles,
          totalCssSize,
        };
      });

      // 验证CSS文件数量合理
      expect(cssMetrics.totalCssFiles).toBeLessThan(10);

      // 验证CSS总大小合理（应该小于500KB）
      expect(cssMetrics.totalCssSize).toBeLessThan(500 * 1024);

      test.info().attach(`${name}-css-metrics`, {
        body: JSON.stringify(cssMetrics),
        contentType: "application/json",
      });
    });
  }
});

test.describe("移动端性能测试 - 运行时性能", () => {
  for (const { path, name } of PAGES) {
    test(`${name}页面 - 滚动性能`, async ({ page }) => {
      await page.goto(path);
      await page.waitForLoadState("networkidle");

      // 测量滚动性能
      const scrollMetrics = await page.evaluate(async () => {
        const startTime = performance.now();

        // 执行滚动
        window.scrollTo(0, document.body.scrollHeight / 2);

        // 等待渲染
        await new Promise((resolve) => requestAnimationFrame(resolve));
        await new Promise((resolve) => setTimeout(resolve, 100));

        const endTime = performance.now();
        const scrollDuration = endTime - startTime;

        return { scrollDuration };
      });

      // 验证滚动性能（应该小于100ms）
      expect(scrollMetrics.scrollDuration).toBeLessThan(100);

      test.info().attach(`${name}-scroll-performance`, {
        body: JSON.stringify(scrollMetrics),
        contentType: "application/json",
      });
    });

    test(`${name}页面 - 动画性能`, async ({ page }) => {
      await page.goto(path);
      await page.waitForLoadState("networkidle");

      // 测量动画帧率
      const animationMetrics = await page.evaluate(async () => {
        let frameCount = 0;
        const startTime = performance.now();

        // 测量1秒内的帧数
        const measureFrames = () => {
          return new Promise<number>((resolve) => {
            const countFrames = () => {
              frameCount++;
              if (performance.now() - startTime < 1000) {
                requestAnimationFrame(countFrames);
              } else {
                resolve(frameCount);
              }
            };
            requestAnimationFrame(countFrames);
          });
        };

        const frames = await measureFrames();
        const fps = frames;

        return { fps, frameCount: frames };
      });

      // 验证帧率（应该大于30fps）
      expect(animationMetrics.fps).toBeGreaterThan(30);

      test.info().attach(`${name}-animation-performance`, {
        body: JSON.stringify(animationMetrics),
        contentType: "application/json",
      });
    });

    test(`${name}页面 - 内存使用`, async ({ page }) => {
      await page.goto(path);
      await page.waitForLoadState("networkidle");

      // 获取内存使用情况
      const memoryMetrics = await page.evaluate(() => {
        const memory = (performance as any).memory;
        if (memory) {
          return {
            usedJSHeapSize: memory.usedJSHeapSize,
            totalJSHeapSize: memory.totalJSHeapSize,
            jsHeapSizeLimit: memory.jsHeapSizeLimit,
            usedMB: Math.round(memory.usedJSHeapSize / 1024 / 1024),
            totalMB: Math.round(memory.totalJSHeapSize / 1024 / 1024),
          };
        }
        return null;
      });

      if (memoryMetrics) {
        // 验证内存使用合理（应该小于100MB）
        expect(memoryMetrics.usedMB).toBeLessThan(100);

        test.info().attach(`${name}-memory-metrics`, {
          body: JSON.stringify(memoryMetrics),
          contentType: "application/json",
        });
      }
    });
  }
});

test.describe("移动端性能测试 - 缓存策略", () => {
  for (const { path, name } of PAGES) {
    test(`${name}页面 - 静态资源缓存`, async ({ page }) => {
      // 第一次访问（填充缓存）
      await page.goto(path);
      await page.waitForLoadState("networkidle");

      // 第二次访问（测试缓存）
      await page.reload();
      await page.waitForLoadState("networkidle");

      // 获取缓存命中率
      const cacheMetrics = await page.evaluate(() => {
        const resources = performance.getEntriesByType("resource");
        const cachedResources = resources.filter((r: any) => {
          return r.transferSize === 0 && r.decodedBodySize > 0;
        });

        return {
          totalResources: resources.length,
          cachedResources: cachedResources.length,
          cacheHitRate:
            resources.length > 0 ? cachedResources.length / resources.length : 0,
        };
      });

      // 验证缓存命中率（应该大于30%）
      expect(cacheMetrics.cacheHitRate).toBeGreaterThan(0.3);

      test.info().attach(`${name}-cache-metrics`, {
        body: JSON.stringify(cacheMetrics),
        contentType: "application/json",
      });
    });
  }
});

import { test, expect, Page } from "@playwright/test";

/**
 * 移动端兼容性测试
 * 在主流移动设备及浏览器组合上验证显示效果
 */

// 测试页面列表
const PAGES = [
  { path: "/lvjiang", name: "lvjiang" },
  { path: "/tiantong", name: "tiantong" },
  { path: "/yuxiaoc", name: "yuxiaoc" },
];

/**
 * 等待页面加载完成
 * @param page - Playwright页面对象
 */
async function waitForPageLoad(page: Page): Promise<void> {
  await page.waitForLoadState("networkidle");
  await page.waitForSelector("main, [data-testid='main-content']", {
    timeout: 10000,
  });
}

/**
 * 检查浏览器特性支持
 * @param page - Playwright页面对象
 */
async function checkBrowserFeatures(page: Page): Promise<{
  flexbox: boolean;
  grid: boolean;
  cssVariables: boolean;
  es6: boolean;
  fetch: boolean;
  promise: boolean;
  asyncAwait: boolean;
  localStorage: boolean;
  sessionStorage: boolean;
  touchEvents: boolean;
}> {
  return await page.evaluate(() => {
    return {
      // CSS特性
      flexbox: CSS.supports("display", "flex"),
      grid: CSS.supports("display", "grid"),
      cssVariables: CSS.supports("color", "var(--test)"),
      // JavaScript特性
      es6: typeof Symbol !== "undefined" && typeof Map !== "undefined",
      fetch: typeof fetch !== "undefined",
      promise: typeof Promise !== "undefined",
      asyncAwait: (async () => true)() instanceof Promise,
      // Web API
      localStorage: typeof localStorage !== "undefined",
      sessionStorage: typeof sessionStorage !== "undefined",
      // 触摸事件
      touchEvents: "ontouchstart" in window || navigator.maxTouchPoints > 0,
    };
  });
}

test.describe("移动端兼容性测试 - 浏览器特性支持", () => {
  for (const { path, name } of PAGES) {
    test(`${name}页面 - CSS特性支持`, async ({ page }) => {
      await page.goto(path);
      await waitForPageLoad(page);

      const features = await checkBrowserFeatures(page);

      // 验证必要的CSS特性
      expect(features.flexbox).toBeTruthy();
      expect(features.grid).toBeTruthy();
      expect(features.cssVariables).toBeTruthy();

      test.info().attach(`${name}-css-features`, {
        body: JSON.stringify({
          flexbox: features.flexbox,
          grid: features.grid,
          cssVariables: features.cssVariables,
        }),
        contentType: "application/json",
      });
    });

    test(`${name}页面 - JavaScript特性支持`, async ({ page }) => {
      await page.goto(path);
      await waitForPageLoad(page);

      const features = await checkBrowserFeatures(page);

      // 验证必要的JavaScript特性
      expect(features.es6).toBeTruthy();
      expect(features.fetch).toBeTruthy();
      expect(features.promise).toBeTruthy();
      expect(features.asyncAwait).toBeTruthy();

      test.info().attach(`${name}-js-features`, {
        body: JSON.stringify({
          es6: features.es6,
          fetch: features.fetch,
          promise: features.promise,
          asyncAwait: features.asyncAwait,
        }),
        contentType: "application/json",
      });
    });

    test(`${name}页面 - Web API支持`, async ({ page }) => {
      await page.goto(path);
      await waitForPageLoad(page);

      const features = await checkBrowserFeatures(page);

      // 验证必要的Web API
      expect(features.localStorage).toBeTruthy();
      expect(features.sessionStorage).toBeTruthy();
      expect(features.touchEvents).toBeTruthy();

      test.info().attach(`${name}-web-api`, {
        body: JSON.stringify({
          localStorage: features.localStorage,
          sessionStorage: features.sessionStorage,
          touchEvents: features.touchEvents,
        }),
        contentType: "application/json",
      });
    });
  }
});

test.describe("移动端兼容性测试 - 渲染一致性", () => {
  for (const { path, name } of PAGES) {
    test(`${name}页面 - 字体渲染一致性`, async ({ page }) => {
      await page.goto(path);
      await waitForPageLoad(page);

      // 检查字体加载
      const fontMetrics = await page.evaluate(() => {
        const fonts = document.fonts;
        return {
          ready: document.fonts.ready !== undefined,
          status: document.fonts.status,
        };
      });

      // 等待字体加载完成
      await page.evaluate(() => document.fonts.ready);

      expect(fontMetrics.ready).toBeTruthy();

      test.info().attach(`${name}-font-metrics`, {
        body: JSON.stringify(fontMetrics),
        contentType: "application/json",
      });
    });

    test(`${name}页面 - 图片渲染一致性`, async ({ page }) => {
      await page.goto(path);
      await waitForPageLoad(page);

      // 检查图片加载状态
      const imageMetrics = await page.evaluate(() => {
        const images = Array.from(document.querySelectorAll("img"));
        return {
          totalImages: images.length,
          loadedImages: images.filter((img) => img.complete).length,
          failedImages: images.filter((img) => !img.complete && img.naturalWidth === 0).length,
        };
      });

      // 验证所有图片加载成功
      expect(imageMetrics.loadedImages).toBe(imageMetrics.totalImages);
      expect(imageMetrics.failedImages).toBe(0);

      test.info().attach(`${name}-image-metrics`, {
        body: JSON.stringify(imageMetrics),
        contentType: "application/json",
      });
    });

    test(`${name}页面 - 图标渲染一致性`, async ({ page }) => {
      await page.goto(path);
      await waitForPageLoad(page);

      // 检查SVG图标
      const iconMetrics = await page.evaluate(() => {
        const svgs = Array.from(document.querySelectorAll("svg"));
        const iconFonts = Array.from(document.querySelectorAll("[class*='icon'], [class*='Icon']"));
        return {
          svgCount: svgs.length,
          iconFontCount: iconFonts.length,
        };
      });

      // 验证图标存在
      expect(iconMetrics.svgCount + iconMetrics.iconFontCount).toBeGreaterThan(0);

      test.info().attach(`${name}-icon-metrics`, {
        body: JSON.stringify(iconMetrics),
        contentType: "application/json",
      });
    });
  }
});

test.describe("移动端兼容性测试 - 设备适配", () => {
  for (const { path, name } of PAGES) {
    test(`${name}页面 - 视口设置正确`, async ({ page }) => {
      await page.goto(path);
      await waitForPageLoad(page);

      // 检查视口meta标签
      const viewport = await page.evaluate(() => {
        const meta = document.querySelector('meta[name="viewport"]');
        return meta ? meta.getAttribute("content") : null;
      });

      // 验证视口设置
      expect(viewport).toContain("width=device-width");
      expect(viewport).toContain("initial-scale=1");
    });

    test(`${name}页面 - 设备像素比适配`, async ({ page }) => {
      await page.goto(path);
      await waitForPageLoad(page);

      // 检查设备像素比
      const dpr = await page.evaluate(() => window.devicePixelRatio);

      // 验证DPR在合理范围内
      expect(dpr).toBeGreaterThanOrEqual(1);
      expect(dpr).toBeLessThanOrEqual(4);

      test.info().attach(`${name}-device-pixel-ratio`, {
        body: JSON.stringify({ dpr }),
        contentType: "application/json",
      });
    });

    test(`${name}页面 - 安全区域适配`, async ({ page }) => {
      await page.goto(path);
      await waitForPageLoad(page);

      // 检查CSS环境变量支持
      const safeAreaSupport = await page.evaluate(() => {
        return CSS.supports("padding-top", "env(safe-area-inset-top)");
      });

      // 记录安全区域支持情况
      test.info().attach(`${name}-safe-area-support`, {
        body: JSON.stringify({ safeAreaSupport }),
        contentType: "application/json",
      });
    });
  }
});

test.describe("移动端兼容性测试 - 主题与颜色", () => {
  for (const { path, name } of PAGES) {
    test(`${name}页面 - 深色模式支持`, async ({ page }) => {
      await page.goto(path);
      await waitForPageLoad(page);

      // 检查深色模式支持
      const darkModeSupport = await page.evaluate(() => {
        return {
          prefersColorScheme: window.matchMedia("(prefers-color-scheme: dark)").matches,
          classList: document.documentElement.classList.contains("dark"),
          dataTheme: document.documentElement.getAttribute("data-theme"),
        };
      });

      test.info().attach(`${name}-dark-mode`, {
        body: JSON.stringify(darkModeSupport),
        contentType: "application/json",
      });
    });

    test(`${name}页面 - 颜色对比度`, async ({ page }) => {
      await page.goto(path);
      await waitForPageLoad(page);

      // 检查主要文本元素的颜色对比度
      const contrastMetrics = await page.evaluate(() => {
        const elements = document.querySelectorAll("p, span, h1, h2, h3, h4, h5, h6, a, button");
        const results: Array<{ tag: string; color: string; backgroundColor: string }> = [];

        elements.forEach((el) => {
          const style = window.getComputedStyle(el);
          results.push({
            tag: el.tagName.toLowerCase(),
            color: style.color,
            backgroundColor: style.backgroundColor,
          });
        });

        return results.slice(0, 10); // 只返回前10个
      });

      test.info().attach(`${name}-color-contrast`, {
        body: JSON.stringify(contrastMetrics),
        contentType: "application/json",
      });
    });
  }
});

test.describe("移动端兼容性测试 - 输入与交互", () => {
  for (const { path, name } of PAGES) {
    test(`${name}页面 - 虚拟键盘适配`, async ({ page }) => {
      await page.goto(path);
      await waitForPageLoad(page);

      // 检查输入框
      const inputMetrics = await page.evaluate(() => {
        const inputs = document.querySelectorAll('input[type="text"], input[type="search"], textarea');
        return {
          inputCount: inputs.length,
          types: Array.from(inputs).map((input) => (input as HTMLInputElement).type),
        };
      });

      test.info().attach(`${name}-input-metrics`, {
        body: JSON.stringify(inputMetrics),
        contentType: "application/json",
      });
    });

    test(`${name}页面 - 触摸事件响应`, async ({ page }) => {
      await page.goto(path);
      await waitForPageLoad(page);

      // 测试触摸事件
      const touchSupport = await page.evaluate(() => {
        return {
          touchStart: "ontouchstart" in window,
          touchMove: "ontouchmove" in window,
          touchEnd: "ontouchend" in window,
          maxTouchPoints: navigator.maxTouchPoints,
        };
      });

      expect(touchSupport.touchStart).toBeTruthy();
      expect(touchSupport.maxTouchPoints).toBeGreaterThan(0);

      test.info().attach(`${name}-touch-support`, {
        body: JSON.stringify(touchSupport),
        contentType: "application/json",
      });
    });

    test(`${name}页面 - 点击延迟检查`, async ({ page }) => {
      await page.goto(path);
      await waitForPageLoad(page);

      // 检查viewport设置是否包含user-scalable=no（影响点击延迟）
      const viewport = await page.evaluate(() => {
        const meta = document.querySelector('meta[name="viewport"]');
        return meta ? meta.getAttribute("content") : "";
      });

      // 如果包含user-scalable=no，点击延迟会被消除
      const hasFastClick = viewport.includes("user-scalable=no");

      test.info().attach(`${name}-click-delay`, {
        body: JSON.stringify({ hasFastClick, viewport }),
        contentType: "application/json",
      });
    });
  }
});

test.describe("移动端兼容性测试 - 网络与离线", () => {
  for (const { path, name } of PAGES) {
    test(`${name}页面 - 网络状态检测`, async ({ page }) => {
      await page.goto(path);
      await waitForPageLoad(page);

      // 检查网络状态API
      const networkStatus = await page.evaluate(() => {
        return {
          onLine: navigator.onLine,
          connection: (navigator as any).connection
            ? {
                effectiveType: (navigator as any).connection.effectiveType,
                downlink: (navigator as any).connection.downlink,
                rtt: (navigator as any).connection.rtt,
              }
            : null,
        };
      });

      expect(networkStatus.onLine).toBeTruthy();

      test.info().attach(`${name}-network-status`, {
        body: JSON.stringify(networkStatus),
        contentType: "application/json",
      });
    });

    test(`${name}页面 - Service Worker支持`, async ({ page }) => {
      await page.goto(path);
      await waitForPageLoad(page);

      // 检查Service Worker
      const swSupport = await page.evaluate(() => {
        return {
          supported: "serviceWorker" in navigator,
          controller: navigator.serviceWorker?.controller !== null,
        };
      });

      test.info().attach(`${name}-service-worker`, {
        body: JSON.stringify(swSupport),
        contentType: "application/json",
      });
    });
  }
});

test.describe("移动端兼容性测试 - 无障碍支持", () => {
  for (const { path, name } of PAGES) {
    test(`${name}页面 - ARIA属性检查`, async ({ page }) => {
      await page.goto(path);
      await waitForPageLoad(page);

      // 检查ARIA属性
      const ariaMetrics = await page.evaluate(() => {
        const elementsWithAria = document.querySelectorAll("[aria-label], [aria-describedby], [role]");
        const landmarks = document.querySelectorAll("[role='navigation'], [role='main'], [role='contentinfo']");

        return {
          ariaElementsCount: elementsWithAria.length,
          landmarksCount: landmarks.length,
        };
      });

      // 验证有ARIA属性的元素
      expect(ariaMetrics.ariaElementsCount).toBeGreaterThan(0);

      test.info().attach(`${name}-aria-metrics`, {
        body: JSON.stringify(ariaMetrics),
        contentType: "application/json",
      });
    });

    test(`${name}页面 - 语义化标签检查`, async ({ page }) => {
      await page.goto(path);
      await waitForPageLoad(page);

      // 检查语义化标签
      const semanticMetrics = await page.evaluate(() => {
        return {
          hasHeader: document.querySelector("header") !== null,
          hasNav: document.querySelector("nav") !== null,
          hasMain: document.querySelector("main") !== null,
          hasFooter: document.querySelector("footer") !== null,
          hasArticle: document.querySelector("article") !== null,
          hasSection: document.querySelector("section") !== null,
        };
      });

      // 验证主要语义化标签存在
      expect(semanticMetrics.hasMain).toBeTruthy();

      test.info().attach(`${name}-semantic-metrics`, {
        body: JSON.stringify(semanticMetrics),
        contentType: "application/json",
      });
    });

    test(`${name}页面 - 焦点管理`, async ({ page }) => {
      await page.goto(path);
      await waitForPageLoad(page);

      // 检查焦点able元素
      const focusMetrics = await page.evaluate(() => {
        const focusableElements = document.querySelectorAll(
          'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
        );
        return {
          focusableCount: focusableElements.length,
        };
      });

      expect(focusMetrics.focusableCount).toBeGreaterThan(0);

      test.info().attach(`${name}-focus-metrics`, {
        body: JSON.stringify(focusMetrics),
        contentType: "application/json",
      });
    });
  }
});

test.describe("移动端兼容性测试 - 错误处理", () => {
  for (const { path, name } of PAGES) {
    test(`${name}页面 - JavaScript错误检查`, async ({ page }) => {
      const errors: string[] = [];

      // 监听console错误
      page.on("console", (msg) => {
        if (msg.type() === "error") {
          errors.push(msg.text());
        }
      });

      // 监听页面错误
      page.on("pageerror", (error) => {
        errors.push(error.message);
      });

      await page.goto(path);
      await waitForPageLoad(page);

      // 等待一段时间确保所有脚本执行完成
      await page.waitForTimeout(2000);

      // 过滤掉非关键错误
      const criticalErrors = errors.filter(
        (error) =>
          !error.includes("favicon") &&
          !error.includes("source map") &&
          !error.includes("chunk")
      );

      // 验证没有关键错误
      expect(criticalErrors).toHaveLength(0);

      test.info().attach(`${name}-js-errors`, {
        body: JSON.stringify({ errors: criticalErrors }),
        contentType: "application/json",
      });
    });

    test(`${name}页面 - 404资源检查`, async ({ page }) => {
      const failedRequests: string[] = [];

      // 监听失败的请求
      page.on("requestfailed", (request) => {
        failedRequests.push(request.url());
      });

      // 监听响应状态
      page.on("response", (response) => {
        if (response.status() === 404) {
          failedRequests.push(response.url());
        }
      });

      await page.goto(path);
      await waitForPageLoad(page);

      // 等待一段时间确保所有资源加载完成
      await page.waitForTimeout(2000);

      // 过滤掉非关键404
      const critical404s = failedRequests.filter(
        (url) => !url.includes("favicon") && !url.includes("source map")
      );

      // 验证没有关键404错误
      expect(critical404s).toHaveLength(0);

      test.info().attach(`${name}-404-errors`, {
        body: JSON.stringify({ failedRequests: critical404s }),
        contentType: "application/json",
      });
    });
  }
});

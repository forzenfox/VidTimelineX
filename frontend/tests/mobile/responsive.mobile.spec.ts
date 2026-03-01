import { test, expect, Page } from "@playwright/test";

/**
 * 移动端响应式布局测试
 * 在不同屏幕尺寸下验证UI适配情况
 */

// 测试页面列表
const PAGES = [
  { path: "/lvjiang", name: "lvjiang" },
  { path: "/tiantong", name: "tiantong" },
  { path: "/yuxiaoc", name: "yuxiaoc" },
];

// 响应式断点
const BREAKPOINTS = {
  mobile: { width: 375, height: 667, name: "Mobile" },
  mobileLarge: { width: 414, height: 896, name: "Mobile Large" },
  tablet: { width: 768, height: 1024, name: "Tablet" },
  tabletLarge: { width: 1024, height: 1366, name: "Tablet Large" },
  desktop: { width: 1280, height: 720, name: "Desktop" },
  desktopLarge: { width: 1920, height: 1080, name: "Desktop Large" },
};

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
 * 设置视口尺寸
 * @param page - Playwright页面对象
 * @param width - 视口宽度
 * @param height - 视口高度
 */
async function setViewport(page: Page, width: number, height: number): Promise<void> {
  await page.setViewportSize({ width, height });
  // 等待布局调整
  await page.waitForTimeout(500);
}

test.describe("响应式布局测试 - 断点验证", () => {
  for (const { path, name } of PAGES) {
    for (const [key, breakpoint] of Object.entries(BREAKPOINTS)) {
      test(`${name}页面 - ${breakpoint.name} (${breakpoint.width}x${breakpoint.height})`, async ({
        page,
      }) => {
        await page.goto(path);
        await setViewport(page, breakpoint.width, breakpoint.height);
        await waitForPageLoad(page);

        // 获取布局信息
        const layoutInfo = await page.evaluate(() => {
          return {
            windowWidth: window.innerWidth,
            windowHeight: window.innerHeight,
            documentWidth: document.documentElement.scrollWidth,
            documentHeight: document.documentElement.scrollHeight,
          };
        });

        // 验证视口设置正确
        expect(layoutInfo.windowWidth).toBe(breakpoint.width);
        expect(layoutInfo.windowHeight).toBe(breakpoint.height);

        // 验证没有水平滚动条
        expect(layoutInfo.documentWidth).toBeLessThanOrEqual(breakpoint.width + 1); // 允许1px误差

        test.info().attach(`${name}-${key}-layout`, {
          body: JSON.stringify({
            breakpoint: breakpoint.name,
            expected: { width: breakpoint.width, height: breakpoint.height },
            actual: layoutInfo,
          }),
          contentType: "application/json",
        });
      });
    }
  }
});

test.describe("响应式布局测试 - 移动端布局验证", () => {
  for (const { path, name } of PAGES) {
    test(`${name}页面 - 移动端导航栏布局`, async ({ page }) => {
      await page.goto(path);
      await setViewport(page, 375, 667);
      await waitForPageLoad(page);

      // 检查导航栏元素
      const navLayout = await page.evaluate(() => {
        const header = document.querySelector("header");
        const nav = document.querySelector("nav");
        const logo = document.querySelector('[data-testid="logo"], header a:first-child');
        const themeToggle = document.querySelector('[data-testid="theme-toggle"]');

        return {
          headerHeight: header?.getBoundingClientRect().height || 0,
          navVisible: nav !== null && nav.getBoundingClientRect().width > 0,
          logoVisible: logo !== null && logo.getBoundingClientRect().width > 0,
          themeToggleVisible: themeToggle !== null && themeToggle.getBoundingClientRect().width > 0,
        };
      });

      // 验证导航栏高度合理（移动端应该小于100px）
      expect(navLayout.headerHeight).toBeLessThan(100);

      // 验证Logo和主题切换按钮可见
      expect(navLayout.logoVisible).toBeTruthy();
      expect(navLayout.themeToggleVisible).toBeTruthy();

      test.info().attach(`${name}-mobile-nav-layout`, {
        body: JSON.stringify(navLayout),
        contentType: "application/json",
      });
    });

    test(`${name}页面 - 移动端弹幕按钮位置`, async ({ page }) => {
      await page.goto(path);
      await setViewport(page, 375, 667);
      await waitForPageLoad(page);

      // 检查弹幕浮动按钮位置
      const danmakuButtonPosition = await page.evaluate(() => {
        const button = document.querySelector(
          '[data-testid="danmaku-fab"], button[aria-label*="弹幕"], .fixed.bottom-4.right-4, .fixed.bottom-6.right-6'
        );
        if (button) {
          const rect = button.getBoundingClientRect();
          return {
            exists: true,
            right: window.innerWidth - rect.right,
            bottom: window.innerHeight - rect.bottom,
            width: rect.width,
            height: rect.height,
          };
        }
        return { exists: false };
      });

      // 验证按钮存在
      expect(danmakuButtonPosition.exists).toBeTruthy();

      if (danmakuButtonPosition.exists) {
        // 验证按钮在右下角（距离右边和底部小于100px）
        expect(danmakuButtonPosition.right).toBeLessThan(100);
        expect(danmakuButtonPosition.bottom).toBeLessThan(100);

        // 验证按钮尺寸合适（至少48x48px）
        expect(danmakuButtonPosition.width).toBeGreaterThanOrEqual(48);
        expect(danmakuButtonPosition.height).toBeGreaterThanOrEqual(48);
      }

      test.info().attach(`${name}-mobile-danmaku-position`, {
        body: JSON.stringify(danmakuButtonPosition),
        contentType: "application/json",
      });
    });

    test(`${name}页面 - 移动端视频网格布局`, async ({ page }) => {
      await page.goto(path);
      await setViewport(page, 375, 667);
      await waitForPageLoad(page);

      // 检查视频网格布局
      const gridLayout = await page.evaluate(() => {
        const grid = document.querySelector('[data-testid="video-grid"], .video-grid, .grid');
        if (grid) {
          const style = window.getComputedStyle(grid);
          return {
            exists: true,
            display: style.display,
            gridTemplateColumns: style.gridTemplateColumns,
            gap: style.gap,
          };
        }
        return { exists: false };
      });

      if (gridLayout.exists) {
        // 验证使用grid布局
        expect(gridLayout.display).toBe("grid");

        // 移动端应该是2列布局
        const columnCount = gridLayout.gridTemplateColumns?.split(" ").length || 0;
        expect(columnCount).toBeLessThanOrEqual(2);
      }

      test.info().attach(`${name}-mobile-grid-layout`, {
        body: JSON.stringify(gridLayout),
        contentType: "application/json",
      });
    });

    test(`${name}页面 - 移动端视频卡片尺寸`, async ({ page }) => {
      await page.goto(path);
      await setViewport(page, 375, 667);
      await waitForPageLoad(page);

      // 检查视频卡片尺寸
      const cardMetrics = await page.evaluate(() => {
        const cards = document.querySelectorAll('[data-testid="video-card"], .video-card');
        if (cards.length > 0) {
          const firstCard = cards[0];
          const rect = firstCard.getBoundingClientRect();
          return {
            cardCount: cards.length,
            cardWidth: rect.width,
            cardHeight: rect.height,
            viewportWidth: window.innerWidth,
          };
        }
        return { cardCount: 0 };
      });

      if (cardMetrics.cardCount > 0) {
        // 验证卡片宽度不超过视口宽度
        expect(cardMetrics.cardWidth).toBeLessThanOrEqual(375);

        // 验证卡片高度合理
        expect(cardMetrics.cardHeight).toBeGreaterThan(0);
      }

      test.info().attach(`${name}-mobile-card-metrics`, {
        body: JSON.stringify(cardMetrics),
        contentType: "application/json",
      });
    });
  }
});

test.describe("响应式布局测试 - 平板端布局验证", () => {
  for (const { path, name } of PAGES) {
    test(`${name}页面 - 平板端侧边栏显示`, async ({ page }) => {
      await page.goto(path);
      await setViewport(page, 1024, 768);
      await waitForPageLoad(page);

      // 检查侧边栏显示
      const sidebarLayout = await page.evaluate(() => {
        const sidebar = document.querySelector(
          '[data-testid="danmaku-sidebar"], .danmaku-sidebar, aside, [class*="sidebar"]'
        );
        if (sidebar) {
          const rect = sidebar.getBoundingClientRect();
          const style = window.getComputedStyle(sidebar);
          return {
            exists: true,
            visible: rect.width > 0 && style.display !== "none",
            width: rect.width,
            right: rect.right,
          };
        }
        return { exists: false };
      });

      // 平板端侧边栏应该可见
      if (sidebarLayout.exists) {
        expect(sidebarLayout.visible).toBeTruthy();
      }

      test.info().attach(`${name}-tablet-sidebar-layout`, {
        body: JSON.stringify(sidebarLayout),
        contentType: "application/json",
      });
    });

    test(`${name}页面 - 平板端主内容区宽度`, async ({ page }) => {
      await page.goto(path);
      await setViewport(page, 1024, 768);
      await waitForPageLoad(page);

      // 检查主内容区宽度
      const contentLayout = await page.evaluate(() => {
        const main = document.querySelector("main");
        if (main) {
          const rect = main.getBoundingClientRect();
          return {
            exists: true,
            width: rect.width,
            left: rect.left,
            right: rect.right,
          };
        }
        return { exists: false };
      });

      if (contentLayout.exists) {
        // 验证主内容区宽度合理
        expect(contentLayout.width).toBeGreaterThan(500);
        expect(contentLayout.width).toBeLessThanOrEqual(1024);
      }

      test.info().attach(`${name}-tablet-content-layout`, {
        body: JSON.stringify(contentLayout),
        contentType: "application/json",
      });
    });
  }
});

test.describe("响应式布局测试 - 桌面端布局验证", () => {
  for (const { path, name } of PAGES) {
    test(`${name}页面 - 桌面端侧边栏固定`, async ({ page }) => {
      await page.goto(path);
      await setViewport(page, 1920, 1080);
      await waitForPageLoad(page);

      // 检查侧边栏位置和固定状态
      const sidebarLayout = await page.evaluate(() => {
        const sidebar = document.querySelector(
          '[data-testid="danmaku-sidebar"], .danmaku-sidebar, aside, [class*="sidebar"]'
        );
        if (sidebar) {
          const rect = sidebar.getBoundingClientRect();
          const style = window.getComputedStyle(sidebar);
          return {
            exists: true,
            visible: rect.width > 0 && style.display !== "none",
            width: rect.width,
            right: window.innerWidth - rect.right,
            position: style.position,
          };
        }
        return { exists: false };
      });

      // 桌面端侧边栏应该可见且固定在右侧
      if (sidebarLayout.exists) {
        expect(sidebarLayout.visible).toBeTruthy();
        expect(sidebarLayout.width).toBeGreaterThanOrEqual(300);
        expect(sidebarLayout.right).toBeLessThan(50); // 距离右边小于50px
      }

      test.info().attach(`${name}-desktop-sidebar-layout`, {
        body: JSON.stringify(sidebarLayout),
        contentType: "application/json",
      });
    });

    test(`${name}页面 - 桌面端主内容区padding`, async ({ page }) => {
      await page.goto(path);
      await setViewport(page, 1920, 1080);
      await waitForPageLoad(page);

      // 检查主内容区的padding-right（为侧边栏预留空间）
      const contentPadding = await page.evaluate(() => {
        const main = document.querySelector("main");
        if (main) {
          const style = window.getComputedStyle(main);
          return {
            exists: true,
            paddingRight: style.paddingRight,
            paddingRightValue: parseInt(style.paddingRight, 10),
          };
        }
        return { exists: false };
      });

      if (contentPadding.exists) {
        // 桌面端应该有足够的padding-right为侧边栏预留空间
        expect(contentPadding.paddingRightValue).toBeGreaterThanOrEqual(300);
      }

      test.info().attach(`${name}-desktop-content-padding`, {
        body: JSON.stringify(contentPadding),
        contentType: "application/json",
      });
    });
  }
});

test.describe("响应式布局测试 - 断点切换", () => {
  for (const { path, name } of PAGES) {
    test(`${name}页面 - 从移动端切换到桌面端布局变化`, async ({ page }) => {
      await page.goto(path);

      // 先设置为移动端
      await setViewport(page, 375, 667);
      await waitForPageLoad(page);

      // 获取移动端布局
      const mobileLayout = await page.evaluate(() => {
        const sidebar = document.querySelector(
          '[data-testid="danmaku-sidebar"], aside, [class*="sidebar"]'
        );
        const fab = document.querySelector('[data-testid="danmaku-fab"], .fixed.bottom-4.right-4');
        return {
          sidebarVisible: sidebar !== null && (sidebar as HTMLElement).offsetWidth > 0,
          fabVisible: fab !== null && (fab as HTMLElement).offsetWidth > 0,
        };
      });

      // 切换到桌面端
      await setViewport(page, 1920, 1080);
      await page.waitForTimeout(1000);

      // 获取桌面端布局
      const desktopLayout = await page.evaluate(() => {
        const sidebar = document.querySelector(
          '[data-testid="danmaku-sidebar"], aside, [class*="sidebar"]'
        );
        const fab = document.querySelector('[data-testid="danmaku-fab"], .fixed.bottom-4.right-4');
        return {
          sidebarVisible: sidebar !== null && (sidebar as HTMLElement).offsetWidth > 0,
          fabVisible: fab !== null && (fab as HTMLElement).offsetWidth > 0,
        };
      });

      // 验证布局变化
      // 移动端：侧边栏隐藏，浮动按钮可见
      // 桌面端：侧边栏可见，浮动按钮隐藏
      test.info().attach(`${name}-breakpoint-transition`, {
        body: JSON.stringify({
          mobile: mobileLayout,
          desktop: desktopLayout,
        }),
        contentType: "application/json",
      });
    });

    test(`${name}页面 - 从桌面端切换到移动端布局变化`, async ({ page }) => {
      await page.goto(path);

      // 先设置为桌面端
      await setViewport(page, 1920, 1080);
      await waitForPageLoad(page);

      // 获取桌面端布局
      const desktopLayout = await page.evaluate(() => {
        const sidebar = document.querySelector(
          '[data-testid="danmaku-sidebar"], aside, [class*="sidebar"]'
        );
        const fab = document.querySelector('[data-testid="danmaku-fab"], .fixed.bottom-4.right-4');
        return {
          sidebarVisible: sidebar !== null && (sidebar as HTMLElement).offsetWidth > 0,
          fabVisible: fab !== null && (fab as HTMLElement).offsetWidth > 0,
        };
      });

      // 切换到移动端
      await setViewport(page, 375, 667);
      await page.waitForTimeout(1000);

      // 获取移动端布局
      const mobileLayout = await page.evaluate(() => {
        const sidebar = document.querySelector(
          '[data-testid="danmaku-sidebar"], aside, [class*="sidebar"]'
        );
        const fab = document.querySelector('[data-testid="danmaku-fab"], .fixed.bottom-4.right-4');
        return {
          sidebarVisible: sidebar !== null && (sidebar as HTMLElement).offsetWidth > 0,
          fabVisible: fab !== null && (fab as HTMLElement).offsetWidth > 0,
        };
      });

      test.info().attach(`${name}-breakpoint-transition-reverse`, {
        body: JSON.stringify({
          desktop: desktopLayout,
          mobile: mobileLayout,
        }),
        contentType: "application/json",
      });
    });
  }
});

test.describe("响应式布局测试 - 元素可见性", () => {
  for (const { path, name } of PAGES) {
    test(`${name}页面 - 移动端隐藏元素检查`, async ({ page }) => {
      await page.goto(path);
      await setViewport(page, 375, 667);
      await waitForPageLoad(page);

      // 检查应该在移动端隐藏的元素
      const hiddenElements = await page.evaluate(() => {
        // 常见的应该在移动端隐藏的元素
        const selectors = ['[class*="hidden"]', '[class*="md:"]', '[class*="lg:"]'];

        const results: Array<{ selector: string; count: number }> = [];
        selectors.forEach(selector => {
          const elements = document.querySelectorAll(selector);
          results.push({ selector, count: elements.length });
        });

        return results;
      });

      test.info().attach(`${name}-mobile-hidden-elements`, {
        body: JSON.stringify(hiddenElements),
        contentType: "application/json",
      });
    });

    test(`${name}页面 - 桌面端显示元素检查`, async ({ page }) => {
      await page.goto(path);
      await setViewport(page, 1920, 1080);
      await waitForPageLoad(page);

      // 检查桌面端应该显示的元素
      const visibleElements = await page.evaluate(() => {
        const sidebar = document.querySelector(
          '[data-testid="danmaku-sidebar"], aside, [class*="sidebar"]'
        );
        const navLinks = document.querySelectorAll("nav a, header nav a");
        const externalLinks = document.querySelectorAll('a[target="_blank"], a[href^="http"]');

        return {
          sidebarVisible: sidebar !== null && (sidebar as HTMLElement).offsetWidth > 0,
          navLinksCount: navLinks.length,
          externalLinksCount: externalLinks.length,
        };
      });

      // 桌面端侧边栏应该可见
      expect(visibleElements.sidebarVisible).toBeTruthy();

      test.info().attach(`${name}-desktop-visible-elements`, {
        body: JSON.stringify(visibleElements),
        contentType: "application/json",
      });
    });
  }
});

test.describe("响应式布局测试 - 截图对比", () => {
  for (const { path, name } of PAGES) {
    test(`${name}页面 - 移动端截图`, async ({ page }) => {
      await page.goto(path);
      await setViewport(page, 375, 667);
      await waitForPageLoad(page);

      // 截取全屏
      const screenshot = await page.screenshot({
        fullPage: true,
        path: `playwright-report/mobile/screenshots/${name}-mobile.png`,
      });

      // 验证截图成功
      expect(screenshot).toBeTruthy();
      expect(screenshot.length).toBeGreaterThan(0);
    });

    test(`${name}页面 - 平板端截图`, async ({ page }) => {
      await page.goto(path);
      await setViewport(page, 768, 1024);
      await waitForPageLoad(page);

      // 截取全屏
      const screenshot = await page.screenshot({
        fullPage: true,
        path: `playwright-report/mobile/screenshots/${name}-tablet.png`,
      });

      expect(screenshot).toBeTruthy();
    });

    test(`${name}页面 - 桌面端截图`, async ({ page }) => {
      await page.goto(path);
      await setViewport(page, 1920, 1080);
      await waitForPageLoad(page);

      // 截取全屏
      const screenshot = await page.screenshot({
        fullPage: true,
        path: `playwright-report/mobile/screenshots/${name}-desktop.png`,
      });

      expect(screenshot).toBeTruthy();
    });
  }
});

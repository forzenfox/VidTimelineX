import { test, expect, Page } from "@playwright/test";

/**
 * 移动端功能测试
 * 验证所有交互元素在移动设备上正常工作
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
  // 等待网络空闲
  await page.waitForLoadState("networkidle");
  // 等待页面主要内容可见
  await page.waitForSelector("main, [data-testid='main-content']", {
    timeout: 10000,
  });
}

/**
 * 检查元素是否可点击
 * @param page - Playwright页面对象
 * @param selector - 元素选择器
 */
async function checkElementClickable(page: Page, selector: string): Promise<boolean> {
  const element = await page.locator(selector).first();
  try {
    await element.waitFor({ state: "visible", timeout: 5000 });
    const isEnabled = await element.isEnabled();
    const box = await element.boundingBox();
    // 检查触摸目标尺寸（最小44x44px）
    const hasProperSize = box ? box.width >= 44 && box.height >= 44 : false;
    return isEnabled && hasProperSize;
  } catch {
    return false;
  }
}

test.describe("移动端功能测试 - 导航与主题切换", () => {
  for (const { path, name } of PAGES) {
    test(`${name}页面 - 主题切换按钮可点击`, async ({ page }) => {
      await page.goto(path);
      await waitForPageLoad(page);

      // 查找主题切换按钮
      const themeButton = page.locator(
        '[data-testid="theme-toggle"], button[aria-label*="主题"], button[aria-label*="theme"]'
      );

      // 验证按钮存在且可见
      await expect(themeButton).toBeVisible({ timeout: 5000 });

      // 验证按钮可点击
      const isClickable = await checkElementClickable(
        page,
        '[data-testid="theme-toggle"], button[aria-label*="主题"], button[aria-label*="theme"]'
      );
      expect(isClickable).toBeTruthy();

      // 点击主题切换按钮
      await themeButton.click();

      // 等待主题切换动画
      await page.waitForTimeout(300);

      // 验证页面仍然正常（没有错误）
      const errorElements = await page.locator(".error, [role='alert']").count();
      expect(errorElements).toBe(0);
    });

    test(`${name}页面 - Logo可点击返回首页`, async ({ page }) => {
      await page.goto(path);
      await waitForPageLoad(page);

      // 查找Logo链接
      const logo = page.locator('a[href="/"], [data-testid="logo"], header a:first-child');

      // 验证Logo存在
      const logoCount = await logo.count();
      if (logoCount > 0) {
        await expect(logo.first()).toBeVisible();

        // 点击Logo
        await logo.first().click();

        // 验证导航到首页
        await page.waitForURL("/", { timeout: 10000 });
        expect(page.url()).toBe("http://localhost:3000/");
      }
    });
  }
});

test.describe("移动端功能测试 - 弹幕抽屉交互", () => {
  for (const { path, name } of PAGES) {
    test(`${name}页面 - 弹幕浮动按钮可点击`, async ({ page }) => {
      await page.goto(path);
      await waitForPageLoad(page);

      // 查找弹幕浮动按钮（通常在右下角）
      const danmakuButton = page.locator(
        '[data-testid="danmaku-fab"], button[aria-label*="弹幕"], button[aria-label*="danmaku"], .fixed.bottom-4.right-4, .fixed.bottom-6.right-6'
      );

      // 验证按钮存在且可见
      await expect(danmakuButton).toBeVisible({ timeout: 5000 });

      // 验证按钮可点击且触摸目标尺寸合适
      const isClickable = await checkElementClickable(
        page,
        '[data-testid="danmaku-fab"], button[aria-label*="弹幕"], button[aria-label*="danmaku"], .fixed.bottom-4.right-4, .fixed.bottom-6.right-6'
      );
      expect(isClickable).toBeTruthy();
    });

    test(`${name}页面 - 弹幕抽屉可打开和关闭`, async ({ page }) => {
      await page.goto(path);
      await waitForPageLoad(page);

      // 点击弹幕浮动按钮
      const danmakuButton = page.locator(
        '[data-testid="danmaku-fab"], button[aria-label*="弹幕"], button[aria-label*="danmaku"], .fixed.bottom-4.right-4, .fixed.bottom-6.right-6'
      );
      await danmakuButton.click();

      // 等待抽屉打开
      await page.waitForTimeout(300);

      // 验证抽屉可见
      const drawer = page.locator(
        '[data-testid="danmaku-drawer"], [role="dialog"], .fixed.inset-0'
      );
      await expect(drawer).toBeVisible({ timeout: 5000 });

      // 验证抽屉内容
      const drawerContent = page.locator(
        '[data-testid="danmaku-content"], .danmaku-content, .drawer-content'
      );
      const contentCount = await drawerContent.count();
      expect(contentCount).toBeGreaterThan(0);

      // 点击遮罩层关闭抽屉
      const overlay = page.locator(
        '[data-testid="drawer-overlay"], .drawer-overlay, .fixed.inset-0.bg-black'
      );
      if ((await overlay.count()) > 0) {
        await overlay.click();
      } else {
        // 如果没有遮罩层，点击关闭按钮
        const closeButton = page.locator(
          '[data-testid="drawer-close"], button[aria-label*="关闭"], button[aria-label*="close"]'
        );
        if ((await closeButton.count()) > 0) {
          await closeButton.click();
        }
      }

      // 等待抽屉关闭
      await page.waitForTimeout(300);

      // 验证抽屉已关闭（不再可见或不存在）
      const isDrawerVisible = await drawer.isVisible().catch(() => false);
      expect(isDrawerVisible).toBeFalsy();
    });
  }
});

test.describe("移动端功能测试 - 视频列表交互", () => {
  for (const { path, name } of PAGES) {
    test(`${name}页面 - 视频卡片可点击`, async ({ page }) => {
      await page.goto(path);
      await waitForPageLoad(page);

      // 查找视频卡片
      const videoCards = page.locator('[data-testid="video-card"], .video-card, a[href*="video"]');

      // 验证至少有一个视频卡片
      const cardCount = await videoCards.count();
      expect(cardCount).toBeGreaterThan(0);

      if (cardCount > 0) {
        // 验证第一个卡片可点击
        const firstCard = videoCards.first();
        await expect(firstCard).toBeVisible();

        // 验证触摸目标尺寸
        const box = await firstCard.boundingBox();
        if (box) {
          expect(box.width).toBeGreaterThanOrEqual(44);
          expect(box.height).toBeGreaterThanOrEqual(44);
        }
      }
    });

    test(`${name}页面 - 视图切换按钮可点击`, async ({ page }) => {
      await page.goto(path);
      await waitForPageLoad(page);

      // 查找视图切换按钮（网格/列表）
      const viewButtons = page.locator(
        '[data-testid="view-switcher"], button[aria-label*="视图"], button[aria-label*="view"], .view-toggle'
      );

      // 如果有视图切换按钮，验证其功能
      const buttonCount = await viewButtons.count();
      if (buttonCount > 0) {
        // 验证按钮可点击
        const isClickable = await checkElementClickable(
          page,
          '[data-testid="view-switcher"], button[aria-label*="视图"], button[aria-label*="view"], .view-toggle'
        );
        expect(isClickable).toBeTruthy();

        // 点击视图切换按钮
        await viewButtons.first().click();
        await page.waitForTimeout(300);

        // 验证页面没有错误
        const errorElements = await page.locator(".error, [role='alert']").count();
        expect(errorElements).toBe(0);
      }
    });
  }
});

test.describe("移动端功能测试 - 搜索功能", () => {
  for (const { path, name } of PAGES) {
    test(`${name}页面 - 搜索按钮可点击`, async ({ page }) => {
      await page.goto(path);
      await waitForPageLoad(page);

      // 查找搜索按钮
      const searchButton = page.locator(
        '[data-testid="search-button"], button[aria-label*="搜索"], button[aria-label*="search"], .search-toggle'
      );

      // 验证搜索按钮存在且可点击
      const buttonCount = await searchButton.count();
      if (buttonCount > 0) {
        await expect(searchButton.first()).toBeVisible();

        const isClickable = await checkElementClickable(
          page,
          '[data-testid="search-button"], button[aria-label*="搜索"], button[aria-label*="search"], .search-toggle'
        );
        expect(isClickable).toBeTruthy();
      }
    });

    test(`${name}页面 - 搜索输入框可输入`, async ({ page }) => {
      await page.goto(path);
      await waitForPageLoad(page);

      // 点击搜索按钮打开搜索
      const searchButton = page.locator(
        '[data-testid="search-button"], button[aria-label*="搜索"], button[aria-label*="search"], .search-toggle'
      );

      if ((await searchButton.count()) > 0) {
        await searchButton.first().click();
        await page.waitForTimeout(300);

        // 查找搜索输入框
        const searchInput = page.locator(
          'input[type="search"], input[placeholder*="搜索"], [data-testid="search-input"]'
        );

        if ((await searchInput.count()) > 0) {
          // 验证输入框可见且可输入
          await expect(searchInput.first()).toBeVisible();
          await expect(searchInput.first()).toBeEnabled();

          // 输入测试文本
          await searchInput.first().fill("测试搜索");

          // 验证输入成功
          const inputValue = await searchInput.first().inputValue();
          expect(inputValue).toBe("测试搜索");

          // 清空输入
          await searchInput.first().clear();
          const clearedValue = await searchInput.first().inputValue();
          expect(clearedValue).toBe("");
        }
      }
    });
  }
});

test.describe("移动端功能测试 - 页面滚动", () => {
  for (const { path, name } of PAGES) {
    test(`${name}页面 - 页面可垂直滚动`, async ({ page }) => {
      await page.goto(path);
      await waitForPageLoad(page);

      // 获取页面高度
      const pageHeight = await page.evaluate(() => document.body.scrollHeight);
      const viewportHeight = await page.evaluate(() => window.innerHeight);

      // 如果页面内容超过视口高度，测试滚动
      if (pageHeight > viewportHeight) {
        // 滚动到页面底部
        await page.evaluate(() => {
          window.scrollTo(0, document.body.scrollHeight);
        });

        // 等待滚动完成
        await page.waitForTimeout(500);

        // 验证滚动位置
        const scrollPosition = await page.evaluate(() => window.scrollY);
        expect(scrollPosition).toBeGreaterThan(0);

        // 滚动回顶部
        await page.evaluate(() => {
          window.scrollTo(0, 0);
        });

        await page.waitForTimeout(500);

        // 验证回到顶部
        const finalPosition = await page.evaluate(() => window.scrollY);
        expect(finalPosition).toBe(0);
      }
    });

    test(`${name}页面 - 水平方向无滚动条`, async ({ page }) => {
      await page.goto(path);
      await waitForPageLoad(page);

      // 验证页面宽度不超过视口宽度
      const hasHorizontalScroll = await page.evaluate(() => {
        return document.documentElement.scrollWidth > window.innerWidth;
      });

      expect(hasHorizontalScroll).toBeFalsy();
    });
  }
});

test.describe("移动端功能测试 - 触摸手势", () => {
  for (const { path, name } of PAGES) {
    test(`${name}页面 - 支持触摸滑动`, async ({ page }) => {
      await page.goto(path);
      await waitForPageLoad(page);

      // 模拟触摸滑动
      await page.evaluate(() => {
        const touchStart = new TouchEvent("touchstart", {
          touches: [{ clientX: 100, clientY: 300 } as Touch],
        });
        const touchMove = new TouchEvent("touchmove", {
          touches: [{ clientX: 100, clientY: 200 } as Touch],
        });
        const touchEnd = new TouchEvent("touchend", {});

        document.dispatchEvent(touchStart);
        document.dispatchEvent(touchMove);
        document.dispatchEvent(touchEnd);
      });

      // 验证页面没有错误
      const errorElements = await page.locator(".error, [role='alert']").count();
      expect(errorElements).toBe(0);
    });
  }
});

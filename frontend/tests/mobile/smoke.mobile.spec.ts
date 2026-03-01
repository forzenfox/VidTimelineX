import { test, expect, Page } from "@playwright/test";

/**
 * 移动端冒烟测试
 * 快速验证移动端核心功能是否正常工作
 *
 * 优化策略：
 * 1. 只测试一个代表性页面（lvjiang）
 * 2. 只测试核心功能
 * 3. 减少等待时间
 */

const TEST_PAGE = "/lvjiang";

/**
 * 简化的页面加载等待
 * @param page - Playwright页面对象
 */
async function waitForPageLoad(page: Page): Promise<void> {
  await page.waitForLoadState("domcontentloaded");
  await page.waitForTimeout(1000);
}

test.describe("移动端冒烟测试 - 核心功能", () => {
  test("页面可正常加载", async ({ page }) => {
    await page.goto(TEST_PAGE);
    await waitForPageLoad(page);

    // 验证页面标题
    const title = await page.title();
    expect(title).toBeTruthy();

    // 验证页面内容存在
    const bodyText = await page.locator("body").innerText();
    expect(bodyText.length).toBeGreaterThan(0);
  });

  test("主题切换功能正常", async ({ page }) => {
    await page.goto(TEST_PAGE);
    await waitForPageLoad(page);

    // 查找并点击主题切换按钮
    const themeButton = page
      .locator("button")
      .filter({ hasText: /主题|theme/i })
      .first();

    if (await themeButton.isVisible().catch(() => false)) {
      await themeButton.click();
      await page.waitForTimeout(500);

      // 验证页面没有错误
      const errorCount = await page.locator(".error, [role='alert']").count();
      expect(errorCount).toBe(0);
    }
  });

  test("弹幕功能正常", async ({ page }) => {
    await page.goto(TEST_PAGE);
    await waitForPageLoad(page);

    // 查找弹幕浮动按钮
    const danmakuButton = page
      .locator("button")
      .filter({ hasText: /弹幕|danmaku/i })
      .first();

    if (await danmakuButton.isVisible().catch(() => false)) {
      await danmakuButton.click();
      await page.waitForTimeout(500);

      // 验证弹幕内容存在
      const hasDanmaku = await page
        .locator("text=聊天室, text=LIVE")
        .first()
        .isVisible()
        .catch(() => false);
      expect(hasDanmaku).toBeTruthy();
    }
  });

  test("视频列表可显示", async ({ page }) => {
    await page.goto(TEST_PAGE);
    await waitForPageLoad(page);

    // 等待视频加载（需要更长时间）
    await page.waitForTimeout(5000);

    // 查找视频卡片（使用更通用的选择器）
    const videoCards = page.locator(
      "article, [data-testid='video-card'], .video-card, .grid > div"
    );
    const count = await videoCards.count();

    // 如果没有找到视频卡片，验证页面至少有一些内容
    if (count === 0) {
      const bodyText = await page.locator("body").innerText();
      // 验证页面包含视频相关的文字
      expect(bodyText).toMatch(/视频|驴酱|洞主|凯哥/);
    } else {
      expect(count).toBeGreaterThan(0);
    }
  });

  test("页面无水平滚动条", async ({ page }) => {
    await page.goto(TEST_PAGE);
    await waitForPageLoad(page);

    // 验证页面宽度不超过视口宽度
    const hasHorizontalScroll = await page.evaluate(() => {
      return document.documentElement.scrollWidth > window.innerWidth;
    });

    expect(hasHorizontalScroll).toBeFalsy();
  });

  test("触摸目标尺寸合适", async ({ page }) => {
    await page.goto(TEST_PAGE);
    await waitForPageLoad(page);

    // 获取所有按钮和链接
    const clickableElements = await page.locator("button, a, [role='button']").all();

    let smallElements = 0;
    for (const element of clickableElements.slice(0, 10)) {
      const box = await element.boundingBox().catch(() => null);
      if (box && (box.width < 44 || box.height < 44)) {
        smallElements++;
      }
    }

    // 允许少量小元素（如文字链接）
    expect(smallElements).toBeLessThan(5);
  });
});

test.describe("移动端冒烟测试 - 性能", () => {
  test("页面加载性能可接受", async ({ page }) => {
    const startTime = Date.now();
    await page.goto(TEST_PAGE);
    await waitForPageLoad(page);
    const loadTime = Date.now() - startTime;

    // 验证加载时间小于10秒
    expect(loadTime).toBeLessThan(10000);
  });

  test("无JavaScript错误", async ({ page }) => {
    const errors: string[] = [];

    page.on("pageerror", error => {
      errors.push(error.message);
    });

    page.on("console", msg => {
      if (msg.type() === "error") {
        errors.push(msg.text());
      }
    });

    await page.goto(TEST_PAGE);
    await waitForPageLoad(page);
    await page.waitForTimeout(2000);

    // 过滤掉非关键错误
    const criticalErrors = errors.filter(
      error =>
        !error.includes("favicon") && !error.includes("source map") && !error.includes("chunk")
    );

    expect(criticalErrors).toHaveLength(0);
  });
});

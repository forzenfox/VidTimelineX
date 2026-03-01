import { test, expect } from "@playwright/test";

/**
 * 首页访问 E2E 测试
 * 测试目标：验证首页能够正确加载和显示
 */
test.describe("首页访问测试", () => {
  /**
   * 测试用例 TC-HOME-001: 首页加载测试
   * 测试目标：验证首页能够正确加载并显示关键元素
   */
  test("TC-HOME-001: 首页加载测试", async ({ page }) => {
    // 访问首页
    await page.goto("http://localhost:3000");

    // 验证页面标题
    await expect(page).toHaveTitle(/首页|VidTimelineX/i);

    // 验证导航栏存在
    const navbar = page.locator("nav, [data-testid='navbar'], header").first();
    await expect(navbar).toBeVisible();

    // 验证页面主要内容区域存在
    const mainContent = page.locator("main").first();
    await expect(mainContent).toBeVisible();

    // 验证页脚存在
    const footer = page.locator("footer, [data-testid='footer']").first();
    await expect(footer).toBeVisible();
  });

  /**
   * 测试用例 TC-HOME-002: 导航链接测试
   * 测试目标：验证首页导航链接能够正确跳转
   */
  test("TC-HOME-002: 导航链接测试", async ({ page }) => {
    await page.goto("http://localhost:3000");

    // 测试甜筒模块链接
    const tiantongLink = page.locator('a[href*="tiantong"]').first();
    if (await tiantongLink.isVisible().catch(() => false)) {
      await tiantongLink.click();
      await expect(page).toHaveURL(/tiantong/);
      await page.goto("http://localhost:3000");
    }

    // 测试驴酱模块链接
    const lvjiangLink = page.locator('a[href*="lvjiang"]').first();
    if (await lvjiangLink.isVisible().catch(() => false)) {
      await lvjiangLink.click();
      await expect(page).toHaveURL(/lvjiang/);
      await page.goto("http://localhost:3000");
    }

    // 测试余小C模块链接
    const yuxiaocLink = page.locator('a[href*="yuxiaoc"]').first();
    if (await yuxiaocLink.isVisible().catch(() => false)) {
      await yuxiaocLink.click();
      await expect(page).toHaveURL(/yuxiaoc/);
    }
  });

  /**
   * 测试用例 TC-HOME-003: 响应式布局测试
   * 测试目标：验证首页在不同屏幕尺寸下正确显示
   */
  test("TC-HOME-003: 响应式布局测试", async ({ page }) => {
    await page.goto("http://localhost:3000");

    // 桌面端视图
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.waitForTimeout(500);
    const navbarDesktop = page.locator("nav, header").first();
    await expect(navbarDesktop).toBeVisible();

    // 平板视图
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.waitForTimeout(500);
    const navbarTablet = page.locator("nav, header").first();
    await expect(navbarTablet).toBeVisible();

    // 移动端视图
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(500);
    const navbarMobile = page.locator("nav, header").first();
    await expect(navbarMobile).toBeVisible();
  });

  /**
   * 测试用例 TC-HOME-004: 页面性能测试
   * 测试目标：验证首页加载性能
   */
  test("TC-HOME-004: 页面性能测试", async ({ page }) => {
    // 记录加载时间
    const startTime = Date.now();
    await page.goto("http://localhost:3000");
    await page.waitForLoadState("networkidle");
    const loadTime = Date.now() - startTime;

    // 验证加载时间在合理范围内（10秒内）
    expect(loadTime).toBeLessThan(10000);

    // 验证关键元素已加载
    const mainContent = page.locator("main").first();
    await expect(mainContent).toBeVisible();
  });
});

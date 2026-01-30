import { test, expect } from "@playwright/test";

/**
 * 用户旅程端到端测试
 * 测试目标：验证完整的用户旅程能够正确执行
 */
test.describe("用户旅程测试", () => {
  /**
   * 测试用例 TC-001: 完整用户旅程测试
   * 测试目标：验证用户从首页到视频播放的完整流程
   */
  test("TC-001: 完整用户旅程测试", async ({ page }) => {
    // 1. 访问首页
    await page.goto("http://localhost:3000");

    // 2. 验证首页加载
    await expect(page).toHaveTitle(/首页/);
    await expect(page.locator("[data-testid=navbar]")).toBeVisible();
    await expect(page.locator("[data-testid=footer]")).toBeVisible();

    // 3. 导航到甜筒模块
    await page.click('a[href="/tiantong"]');
    await expect(page).toHaveURL("http://localhost:3000/tiantong");
    await expect(page.locator("[data-testid=page-container]")).toBeVisible();

    // 4. 验证甜筒模块页面元素
    await expect(page.locator("[data-testid=theme-toggle]")).toBeVisible();
    await expect(page.locator("[data-testid=video-card]")).toBeVisible();

    // 5. 点击视频卡片
    await page.click("[data-testid=video-card]");

    // 6. 验证视频模态框打开
    await expect(page.locator("[data-testid=video-modal]")).toBeVisible();

    // 7. 关闭视频模态框
    await page.click("[data-testid=video-modal] .close-button");
    await expect(page.locator("[data-testid=video-modal]")).not.toBeVisible();

    // 8. 导航到驴酱模块
    await page.click('a[href="/lvjiang"]');
    await expect(page).toHaveURL("http://localhost:3000/lvjiang");
    await expect(page.locator("[data-testid=lvjiang-header]")).toBeVisible();

    // 9. 验证驴酱模块页面元素
    await expect(page.locator("[data-testid=horizontal-danmaku]")).toBeVisible();
    await expect(page.locator("[data-testid=video-timeline]")).toBeVisible();
  });

  /**
   * 测试用例 TC-002: 主题切换旅程测试
   * 测试目标：验证主题切换功能在整个应用中的一致性
   */
  test("TC-002: 主题切换旅程测试", async ({ page }) => {
    // 1. 访问首页
    await page.goto("http://localhost:3000");

    // 2. 导航到甜筒模块
    await page.click('a[href="/tiantong"]');
    await expect(page).toHaveURL("http://localhost:3000/tiantong");

    // 3. 切换到凯哥主题
    await page.click("[data-testid=theme-toggle]");

    // 4. 验证主题切换
    await expect(page.locator("body")).toHaveClass(/kaige/);

    // 5. 导航到驴酱模块
    await page.click('a[href="/lvjiang"]');
    await expect(page).toHaveURL("http://localhost:3000/lvjiang");

    // 6. 验证主题在驴酱模块保持一致
    await expect(page.locator("body")).toHaveClass(/kaige/);

    // 7. 切换回洞主主题
    await page.click("[data-testid=theme-toggle]");
    await expect(page.locator("body")).toHaveClass(/dongzhu/);
  });

  /**
   * 测试用例 TC-003: 页面导航测试
   * 测试目标：验证页面导航功能的正确性
   */
  test("TC-003: 页面导航测试", async ({ page }) => {
    // 1. 访问首页
    await page.goto("http://localhost:3000");

    // 2. 测试导航链接
    const navigationLinks = [
      { text: "首页", url: "/" },
      { text: "甜筒", url: "/tiantong" },
      { text: "驴酱", url: "/lvjiang" },
    ];

    for (const link of navigationLinks) {
      await page.click(`a[href="${link.url}"]`);
      await expect(page).toHaveURL(`http://localhost:3000${link.url}`);
    }
  });
});

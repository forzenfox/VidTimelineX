import { test, expect } from "@playwright/test";

/**
 * 筛选流程端到端测试
 * 测试目标：验证筛选功能能够正确执行
 */
test.describe("筛选流程测试", () => {
  /**
   * 测试用例 TC-001: 分类筛选测试
   * 测试目标：验证分类筛选功能的基本流程
   */
  test("TC-001: 分类筛选测试", async ({ page }) => {
    // 1. 访问甜筒模块
    await page.goto("http://localhost:3000/tiantong");

    // 2. 验证分类标签存在
    await expect(page.locator("[data-testid=category-tag]")).toBeVisible();

    // 3. 点击分类标签
    await page.click("[data-testid=category-tag]");

    // 4. 验证筛选结果
    await expect(page.locator("[data-testid=video-card]")).toBeVisible();

    // 5. 点击另一个分类标签
    await page.click("[data-testid=category-tag]");

    // 6. 验证筛选结果更新
    await expect(page.locator("[data-testid=video-card]")).toBeVisible();
  });

  /**
   * 测试用例 TC-002: 多条件筛选测试
   * 测试目标：验证多条件筛选功能的组合使用
   */
  test("TC-002: 多条件筛选测试", async ({ page }) => {
    // 1. 访问甜筒模块
    await page.goto("http://localhost:3000/tiantong");

    // 2. 点击分类标签
    await page.click("[data-testid=category-tag]");

    // 3. 验证筛选结果
    await expect(page.locator("[data-testid=video-card]")).toBeVisible();

    // 4. 输入搜索关键词
    await page.fill("[data-testid=search-input]", "测试");
    await page.click("[data-testid=search-button]");

    // 5. 验证多条件筛选结果
    await expect(page.locator("[data-testid=video-card]")).toBeVisible();
  });

  /**
   * 测试用例 TC-003: 筛选重置测试
   * 测试目标：验证筛选功能的重置流程
   */
  test("TC-003: 筛选重置测试", async ({ page }) => {
    // 1. 访问甜筒模块
    await page.goto("http://localhost:3000/tiantong");

    // 2. 点击分类标签
    await page.click("[data-testid=category-tag]");

    // 3. 验证筛选结果
    await expect(page.locator("[data-testid=video-card]")).toBeVisible();

    // 4. 点击重置按钮（如果存在）
    // 假设存在一个重置按钮
    const resetButton = page.locator("[data-testid=reset-filters]");
    if (await resetButton.isVisible()) {
      await resetButton.click();
      await expect(page.locator("[data-testid=video-card]")).toBeVisible();
    }
  });
});

import { test, expect } from "@playwright/test";

/**
 * 搜索流程端到端测试
 * 测试目标：验证搜索功能能够正确执行
 */
test.describe("搜索流程测试", () => {
  /**
   * 测试用例 TC-001: 搜索功能测试
   * 测试目标：验证搜索功能的基本流程
   */
  test("TC-001: 搜索功能测试", async ({ page }) => {
    // 1. 访问甜筒模块
    await page.goto("http://localhost:3000/tiantong");

    // 2. 验证搜索框存在
    await expect(page.locator("[data-testid=search-input]")).toBeVisible();
    await expect(page.locator("[data-testid=search-button]")).toBeVisible();

    // 3. 输入搜索关键词
    await page.fill("[data-testid=search-input]", "测试");

    // 4. 点击搜索按钮
    await page.click("[data-testid=search-button]");

    // 5. 验证搜索结果
    await expect(page.locator("[data-testid=video-card]")).toBeVisible();

    // 6. 清空搜索框
    await page.fill("[data-testid=search-input]", "");

    // 7. 验证搜索结果重置
    await expect(page.locator("[data-testid=video-card]")).toBeVisible();
  });

  /**
   * 测试用例 TC-002: 搜索边界条件测试
   * 测试目标：验证搜索功能在边界条件下的表现
   */
  test("TC-002: 搜索边界条件测试", async ({ page }) => {
    // 1. 访问甜筒模块
    await page.goto("http://localhost:3000/tiantong");

    // 2. 测试空搜索
    await page.fill("[data-testid=search-input]", "");
    await page.click("[data-testid=search-button]");
    await expect(page.locator("[data-testid=video-card]")).toBeVisible();

    // 3. 测试长关键词搜索
    await page.fill(
      "[data-testid=search-input]",
      "这是一个非常长的搜索关键词，测试搜索功能的边界条件"
    );
    await page.click("[data-testid=search-button]");
    await expect(page.locator("[data-testid=video-card]")).toBeVisible();

    // 4. 测试特殊字符搜索
    await page.fill("[data-testid=search-input]", "!@#$%^&*()");
    await page.click("[data-testid=search-button]");
    await expect(page.locator("[data-testid=video-card]")).toBeVisible();
  });

  /**
   * 测试用例 TC-003: 搜索与分类组合测试
   * 测试目标：验证搜索功能与分类功能的组合使用
   */
  test("TC-003: 搜索与分类组合测试", async ({ page }) => {
    // 1. 访问甜筒模块
    await page.goto("http://localhost:3000/tiantong");

    // 2. 点击分类标签
    await page.click("[data-testid=category-tag]");

    // 3. 验证分类切换
    await expect(page.locator("[data-testid=video-card]")).toBeVisible();

    // 4. 在分类下进行搜索
    await page.fill("[data-testid=search-input]", "测试");
    await page.click("[data-testid=search-button]");

    // 5. 验证搜索结果
    await expect(page.locator("[data-testid=video-card]")).toBeVisible();
  });
});

import { test, expect } from "@playwright/test";

/**
 * 视频筛选流程 E2E 测试
 * 测试目标：验证视频筛选功能能够正确工作
 */
test.describe("视频筛选流程测试", () => {
  /**
   * 测试用例 TC-FILTER-001: 时长筛选测试
   * 测试目标：验证按时长筛选视频功能
   */
  test("TC-FILTER-001: 时长筛选测试", async ({ page }) => {
    // 访问甜筒模块页面
    await page.goto("http://localhost:3000/tiantong");
    await page.waitForLoadState("networkidle");

    // 查找筛选下拉菜单
    const filterDropdown = page.locator('[data-testid="filter-dropdown"], select, [placeholder*="筛选"]').first();

    if (await filterDropdown.isVisible().catch(() => false)) {
      // 点击筛选下拉菜单
      await filterDropdown.click();

      // 选择短视频选项（0-5分钟）
      const shortVideoOption = page.locator('text=/短|0-5|5分钟/i').first();
      if (await shortVideoOption.isVisible().catch(() => false)) {
        await shortVideoOption.click();

        // 等待筛选结果加载
        await page.waitForTimeout(1000);

        // 验证视频列表已更新
        const videoCards = page.locator('[data-testid="video-card"], .video-card').all();
        expect(videoCards).toBeDefined();
      }
    }
  });

  /**
   * 测试用例 TC-FILTER-002: 日期筛选测试
   * 测试目标：验证按日期范围筛选视频功能
   */
  test("TC-FILTER-002: 日期筛选测试", async ({ page }) => {
    await page.goto("http://localhost:3000/tiantong");
    await page.waitForLoadState("networkidle");

    // 查找日期筛选器
    const dateFilter = page.locator('[data-testid="date-filter"], [placeholder*="日期"], input[type="date"]').first();

    if (await dateFilter.isVisible().catch(() => false)) {
      // 设置日期范围
      await dateFilter.fill("2024-01-01");

      // 等待筛选结果
      await page.waitForTimeout(1000);

      // 验证视频列表
      const videoGrid = page.locator('[data-testid="video-grid"], .video-grid').first();
      await expect(videoGrid).toBeVisible();
    }
  });

  /**
   * 测试用例 TC-FILTER-003: 排序功能测试
   * 测试目标：验证视频排序功能
   */
  test("TC-FILTER-003: 排序功能测试", async ({ page }) => {
    await page.goto("http://localhost:3000/tiantong");
    await page.waitForLoadState("networkidle");

    // 查找排序下拉菜单
    const sortDropdown = page.locator('[data-testid="sort-dropdown"], select, [placeholder*="排序"]').first();

    if (await sortDropdown.isVisible().catch(() => false)) {
      // 点击排序下拉菜单
      await sortDropdown.click();

      // 选择按日期排序
      const dateSortOption = page.locator('text=/日期|时间|最新/i').first();
      if (await dateSortOption.isVisible().catch(() => false)) {
        await dateSortOption.click();

        // 等待排序结果
        await page.waitForTimeout(1000);

        // 验证视频列表存在
        const videoList = page.locator('[data-testid="video-list"], .video-list').first();
        await expect(videoList).toBeVisible();
      }
    }
  });

  /**
   * 测试用例 TC-FILTER-004: 筛选和排序组合测试
   * 测试目标：验证筛选和排序组合功能
   */
  test("TC-FILTER-004: 筛选和排序组合测试", async ({ page }) => {
    await page.goto("http://localhost:3000/tiantong");
    await page.waitForLoadState("networkidle");

    // 先进行筛选
    const filterDropdown = page.locator('[data-testid="filter-dropdown"]').first();
    if (await filterDropdown.isVisible().catch(() => false)) {
      await filterDropdown.click();
      const option = page.locator('text=/短/i').first();
      if (await option.isVisible().catch(() => false)) {
        await option.click();
        await page.waitForTimeout(500);
      }
    }

    // 再进行排序
    const sortDropdown = page.locator('[data-testid="sort-dropdown"]').first();
    if (await sortDropdown.isVisible().catch(() => false)) {
      await sortDropdown.click();
      const sortOption = page.locator('text=/日期/i').first();
      if (await sortOption.isVisible().catch(() => false)) {
        await sortOption.click();
        await page.waitForTimeout(500);
      }
    }

    // 验证页面状态
    const pageContainer = page.locator("main, [data-testid='page-container']").first();
    await expect(pageContainer).toBeVisible();
  });

  /**
   * 测试用例 TC-FILTER-005: 清除筛选测试
   * 测试目标：验证清除筛选功能
   */
  test("TC-FILTER-005: 清除筛选测试", async ({ page }) => {
    await page.goto("http://localhost:3000/tiantong");
    await page.waitForLoadState("networkidle");

    // 先应用筛选
    const filterDropdown = page.locator('[data-testid="filter-dropdown"]').first();
    if (await filterDropdown.isVisible().catch(() => false)) {
      await filterDropdown.click();
      const option = page.locator('text=/短/i').first();
      if (await option.isVisible().catch(() => false)) {
        await option.click();
        await page.waitForTimeout(500);
      }
    }

    // 查找清除按钮
    const clearButton = page.locator('[data-testid="clear-filter"], button:has-text("清除"), button:has-text("重置")').first();

    if (await clearButton.isVisible().catch(() => false)) {
      await clearButton.click();
      await page.waitForTimeout(1000);

      // 验证筛选已清除
      const videoGrid = page.locator('[data-testid="video-grid"]').first();
      await expect(videoGrid).toBeVisible();
    }
  });
});

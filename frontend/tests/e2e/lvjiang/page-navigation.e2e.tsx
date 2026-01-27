import { test, expect } from '@playwright/test';

test('驴酱模块页面导航功能测试', async ({ page }) => {
  // 导航到驴酱页面
  await page.goto('http://localhost:5173/lvjiang');

  // 验证页面加载成功
  await expect(page).toHaveTitle(/驴酱/);

  // 验证页面内容
  await expect(page.locator('h1')).toBeVisible();

  // 等待视频时间线加载
  await page.waitForSelector('.video-timeline');

  // 验证视频时间线存在
  await expect(page.locator('.video-timeline')).toBeVisible();

  // 验证弹幕功能存在
  await expect(page.locator('.danmaku-container')).toBeVisible();
});

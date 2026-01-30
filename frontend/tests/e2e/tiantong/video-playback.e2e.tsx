import { test, expect } from "@playwright/test";

test("甜筒模块视频播放功能测试", async ({ page }) => {
  // 导航到甜筒页面
  await page.goto("http://localhost:5173/tiantong");

  // 验证页面加载成功
  await expect(page).toHaveTitle(/甜筒/);

  // 等待视频卡片加载
  await page.waitForSelector(".video-card");

  // 点击第一个视频卡片
  const videoCard = page.locator(".video-card").first();
  await videoCard.click();

  // 验证视频模态框出现
  await expect(page.locator('[role="dialog"]')).toBeVisible();

  // 验证视频嵌入成功
  await expect(page.locator("iframe")).toBeVisible();

  // 关闭视频模态框
  const closeButton = page.locator('[role="dialog"] button').first();
  await closeButton.click();

  // 验证视频模态框关闭
  await expect(page.locator('[role="dialog"]')).not.toBeVisible();
});

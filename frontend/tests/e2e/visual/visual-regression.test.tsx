import { test, expect } from '@playwright/test';

/**
 * 视觉回归测试
 * 测试目标：验证UI在不同场景下的一致性
 */
test.describe('视觉回归测试', () => {
  /**
   * 测试用例 TC-001: 首页视觉回归测试
   * 测试目标：验证首页UI的一致性
   */
  test('TC-001: 首页视觉回归测试', async ({ page }) => {
    // 访问首页
    await page.goto('http://localhost:3000');
    
    // 设置视口大小
    await page.setViewportSize({ width: 1280, height: 720 });
    
    // 等待页面加载完成
    await page.waitForLoadState('networkidle');
    
    // 截取首页屏幕截图并与基准截图比较
    await expect(page).toHaveScreenshot('homepage.png', {
      fullPage: true,
      maxDiffPixelRatio: 0.1,
    });
  });

  /**
   * 测试用例 TC-002: 甜筒模块视觉回归测试
   * 测试目标：验证甜筒模块UI的一致性
   */
  test('TC-002: 甜筒模块视觉回归测试', async ({ page }) => {
    // 访问甜筒模块
    await page.goto('http://localhost:3000/tiantong');
    
    // 设置视口大小
    await page.setViewportSize({ width: 1280, height: 720 });
    
    // 等待页面加载完成
    await page.waitForLoadState('networkidle');
    
    // 截取甜筒模块屏幕截图并与基准截图比较
    await expect(page).toHaveScreenshot('tiantong-module.png', {
      fullPage: true,
      maxDiffPixelRatio: 0.1,
    });
  });

  /**
   * 测试用例 TC-003: 驴酱模块视觉回归测试
   * 测试目标：验证驴酱模块UI的一致性
   */
  test('TC-003: 驴酱模块视觉回归测试', async ({ page }) => {
    // 访问驴酱模块
    await page.goto('http://localhost:3000/lvjiang');
    
    // 设置视口大小
    await page.setViewportSize({ width: 1280, height: 720 });
    
    // 等待页面加载完成
    await page.waitForLoadState('networkidle');
    
    // 截取驴酱模块屏幕截图并与基准截图比较
    await expect(page).toHaveScreenshot('lvjiang-module.png', {
      fullPage: true,
      maxDiffPixelRatio: 0.1,
    });
  });

  /**
   * 测试用例 TC-004: 主题切换视觉回归测试
   * 测试目标：验证不同主题下UI的一致性
   */
  test('TC-004: 主题切换视觉回归测试', async ({ page }) => {
    // 访问甜筒模块
    await page.goto('http://localhost:3000/tiantong');
    
    // 设置视口大小
    await page.setViewportSize({ width: 1280, height: 720 });
    
    // 等待页面加载完成
    await page.waitForLoadState('networkidle');
    
    // 截取洞主主题屏幕截图
    await expect(page).toHaveScreenshot('tiantong-dongzhu-theme.png', {
      fullPage: true,
      maxDiffPixelRatio: 0.1,
    });
    
    // 切换到凯哥主题
    await page.click('[data-testid=theme-toggle]');
    await page.waitForLoadState('networkidle');
    
    // 截取凯哥主题屏幕截图
    await expect(page).toHaveScreenshot('tiantong-kaige-theme.png', {
      fullPage: true,
      maxDiffPixelRatio: 0.1,
    });
  });

  /**
   * 测试用例 TC-005: 视频模态框视觉回归测试
   * 测试目标：验证视频模态框UI的一致性
   */
  test('TC-005: 视频模态框视觉回归测试', async ({ page }) => {
    // 访问甜筒模块
    await page.goto('http://localhost:3000/tiantong');
    
    // 设置视口大小
    await page.setViewportSize({ width: 1280, height: 720 });
    
    // 等待页面加载完成
    await page.waitForLoadState('networkidle');
    
    // 点击视频卡片打开模态框
    await page.click('[data-testid=video-card]');
    await page.waitForLoadState('networkidle');
    
    // 截取视频模态框屏幕截图
    await expect(page).toHaveScreenshot('video-modal.png', {
      fullPage: true,
      maxDiffPixelRatio: 0.1,
    });
  });

  /**
   * 测试用例 TC-006: 响应式布局视觉回归测试
   * 测试目标：验证不同屏幕尺寸下UI的一致性
   */
  test('TC-006: 响应式布局视觉回归测试', async ({ page }) => {
    // 访问首页
    await page.goto('http://localhost:3000');
    
    // 测试桌面端布局
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveScreenshot('responsive-desktop.png', {
      fullPage: true,
      maxDiffPixelRatio: 0.1,
    });
    
    // 测试平板端布局
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveScreenshot('responsive-tablet.png', {
      fullPage: true,
      maxDiffPixelRatio: 0.1,
    });
    
    // 测试移动端布局
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveScreenshot('responsive-mobile.png', {
      fullPage: true,
      maxDiffPixelRatio: 0.1,
    });
  });
});

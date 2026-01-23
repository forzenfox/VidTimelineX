import { test, expect } from '@playwright/test';

test.describe('Responsive Layout Tests', () => {
  // 测试不同设备尺寸
  const deviceSizes = [
    { name: '平板设备 (768x1024)', width: 768, height: 1024 },
    { name: '桌面设备 (1024x768)', width: 1024, height: 768 },
    { name: '大屏幕桌面 (1440x900)', width: 1440, height: 900 }
  ];

  deviceSizes.forEach(({ name, width, height }) => {
    test(`测试 ${name} 布局`, async ({ page }) => {
      // 设置视口大小
      await page.setViewportSize({ width, height });
      
      // 导航到应用
      await page.goto('http://localhost:5173');
      
      // 等待页面加载完成
      await page.waitForSelector('header', { timeout: 5000 });
      
      // 1. 测试头部布局
      const header = page.locator('header');
      await expect(header).toBeVisible();
      
      // 2. 测试搜索框可见性
      const searchInput = page.locator('input#search');
      await expect(searchInput).toBeVisible();
      
      // 3. 测试主题切换按钮可见性
      const themeToggle = page.locator('button[role="switch"]');
      await expect(themeToggle).toBeVisible();
      
      // 4. 测试主要内容区域布局
      const mainContent = page.locator('main');
      await expect(mainContent).toBeVisible();
      
      // 5. 测试视频时间线可见性
      const timelineTitle = page.locator('h2#timeline-title');
      await expect(timelineTitle).toBeVisible();
      await expect(timelineTitle).toHaveText('时光视频集');
      
      // 6. 测试分类过滤按钮
      const categoryButtons = page.locator('[role="navigation"][aria-label="视频分类"] button');
      await expect(categoryButtons).toHaveCount(5); // 假设5个分类按钮
      
      // 7. 测试侧边栏可见性
      const sidebar = page.locator('aside');
      await expect(sidebar).toBeVisible();
      
      // 8. 测试视频卡片可见性
      const videoCards = page.locator('[role="feed"] [role="article"]');
      await expect(videoCards).toHaveCount(6); // 验证视频卡片数量
      await expect(videoCards.first()).toBeVisible(); // 验证第一个视频卡片可见
      
      // 9. 测试搜索功能
      await searchInput.fill('甜筒');
      await page.keyboard.press('Enter');
      
      // 等待搜索结果
      await page.waitForTimeout(1000);
      
      // 10. 测试搜索结果是否显示
      const searchResultsCount = page.locator('.text-gray-600 span.font-bold');
      await expect(searchResultsCount).toBeVisible();
      
      console.log(`✅ ${name} 布局测试通过`);
    });
  });

  test('测试主题切换功能', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 768 });
    await page.goto('http://localhost:5173');
    
    // 等待页面加载
    await page.waitForSelector('header', { timeout: 5000 });
    
    // 获取主题切换按钮
    const themeToggle = page.locator('button[role="switch"]');
    
    // 点击切换主题
    await themeToggle.click();
    await page.waitForTimeout(500);
    
    // 验证主题是否切换（通过检查html元素类名）
    const html = page.locator('html');
    await expect(html).toHaveClass(/theme-sweet/);
    
    // 再次切换回原主题
    await themeToggle.click();
    await page.waitForTimeout(500);
    await expect(html).not.toHaveClass(/theme-sweet/);
    
    console.log('✅ 主题切换功能测试通过');
  });

  test('测试分类过滤功能', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 768 });
    await page.goto('http://localhost:5173');
    
    // 等待页面加载
    await page.waitForSelector('header', { timeout: 5000 });
    
    // 获取分类按钮
    const categoryButtons = page.locator('[role="navigation"][aria-label="视频分类"] button');
    
    // 点击第二个分类
    await categoryButtons.nth(1).click();
    await page.waitForTimeout(1000);
    
    // 验证结果计数是否更新
    const resultsCount = page.locator('.text-gray-600 span.font-bold');
    await expect(resultsCount).toBeVisible();
    
    console.log('✅ 分类过滤功能测试通过');
  });
});

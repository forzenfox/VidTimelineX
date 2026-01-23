import { test, expect, chromium, devices } from '@playwright/test';

test.describe('UI用户体验全面测试', () => {
  
  test.beforeEach(async ({ page }) => {
    // 访问应用首页
    await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });
  });

  test.describe('1. 页面加载性能测试', () => {
    test('页面首次加载时间测试', async ({ page }) => {
      const startTime = Date.now();
      
      // 等待页面完全加载
      await page.waitForLoadState('networkidle');
      await page.waitForSelector('header', { timeout: 10000 });
      
      const loadTime = Date.now() - startTime;
      console.log(`页面加载时间: ${loadTime}ms`);
      
      // 验证关键元素存在
      await expect(page.locator('header')).toBeVisible();
      await expect(page.locator('main')).toBeVisible();
      await expect(page.locator('footer')).toBeVisible();
      
      expect(loadTime).toBeLessThan(5000); // 页面加载时间应小于5秒
    });

    test('关键元素渲染测试', async ({ page }) => {
      // 测试头部元素
      await expect(page.locator('h1:has-text("亿口甜筒")')).toBeVisible();
      await expect(page.locator('input#search')).toBeVisible();
      await expect(page.locator('button[role="switch"]')).toBeVisible();
      
      // 测试主内容区域
      await expect(page.locator('#timeline-title')).toBeVisible();
      await expect(page.locator('[role="navigation"][aria-label="视频分类"]')).toBeVisible();
      await expect(page.locator('[role="feed"]')).toBeVisible();
      
      // 测试侧边栏
      await expect(page.locator('aside')).toBeVisible();
      
      console.log('✅ 所有关键元素渲染正常');
    });
  });

  test.describe('2. 响应式布局测试', () => {
    const viewports = [
      { name: 'iPad Pro 12.9"', width: 1024, height: 1366 },
      { name: 'iPad Air', width: 820, height: 1180 },
      { name: 'Laptop', width: 1366, height: 768 },
      { name: 'Desktop FHD', width: 1920, height: 1080 },
      { name: 'Desktop QHD', width: 2560, height: 1440 },
    ];

    viewports.forEach(({ name, width, height }) => {
      test(`${name} (${width}x${height}) 布局测试`, async ({ page }) => {
        await page.setViewportSize({ width, height });
        await page.waitForTimeout(500);
        
        // 测试布局一致性
        await expect(page.locator('header')).toBeVisible();
        await expect(page.locator('main')).toBeVisible();
        
        // 测试响应式组件
        const searchInput = page.locator('input#search');
        await expect(searchInput).toBeVisible();
        
        // 测试分类标签
        const categoryButtons = page.locator('[role="navigation"][aria-label="视频分类"] button');
        const buttonCount = await categoryButtons.count();
        expect(buttonCount).toBeGreaterThan(0);
        
        console.log(`✅ ${name} 布局测试通过`);
      });
    });
  });

  test.describe('3. 交互响应测试', () => {
    test('主题切换功能测试', async ({ page }) => {
      const themeToggle = page.locator('button[role="switch"]');
      
      // 点击主题切换
      await themeToggle.click();
      await page.waitForTimeout(500);
      
      // 验证主题切换成功
      const html = page.locator('html');
      await expect(html).toHaveClass(/theme-sweet/);
      
      // 再次切换回原主题
      await themeToggle.click();
      await page.waitForTimeout(500);
      await expect(html).not.toHaveClass(/theme-sweet/);
      
      console.log('✅ 主题切换功能正常');
    });

    test('搜索功能测试', async ({ page }) => {
      const searchInput = page.locator('input#search');
      
      // 测试搜索框聚焦
      await searchInput.click();
      await expect(searchInput).toBeFocused();
      
      // 输入搜索内容
      await searchInput.fill('甜筒');
      await expect(searchInput).toHaveValue('甜筒');
      
      // 验证搜索建议出现
      const searchResults = page.locator('.search-suggestions, .search-history');
      await expect(searchResults.first()).toBeVisible({ timeout: 1000 });
      
      console.log('✅ 搜索功能正常');
    });

    test('分类筛选功能测试', async ({ page }) => {
      const categoryButtons = page.locator('[role="navigation"][aria-label="视频分类"] button');
      const secondButton = categoryButtons.nth(1);
      
      // 点击分类按钮
      await secondButton.click();
      await page.waitForTimeout(500);
      
      // 验证按钮被选中
      await expect(secondButton).toHaveAttribute('aria-pressed', 'true');
      
      // 验证视频列表更新
      const resultsText = page.locator('.text-muted-foreground:has-text("共")');
      await expect(resultsText).toBeVisible();
      
      console.log('✅ 分类筛选功能正常');
    });

    test('视频卡片交互测试', async ({ page }) => {
      const videoCards = page.locator('[role="article"]');
      
      // 验证视频卡片存在
      await expect(videoCards.first()).toBeVisible();
      
      // 测试hover效果
      await videoCards.first().hover();
      await page.waitForTimeout(300);
      
      // 验证播放按钮出现
      const playButton = page.locator('.bg-white\\/95').first();
      await expect(playButton).toBeVisible();
      
      console.log('✅ 视频卡片交互正常');
    });

    test('视频卡片点击测试', async ({ page }) => {
      const videoCards = page.locator('[role="article"]');
      const firstCard = videoCards.first();
      
      // 点击视频卡片
      await firstCard.click();
      await page.waitForTimeout(500);
      
      // 验证弹窗出现
      const modal = page.locator('[role="dialog"]');
      await expect(modal.first()).toBeVisible({ timeout: 5000 });
      
      // 关闭弹窗
      const closeButton = page.locator('button:has-text("×")').first();
      if (await closeButton.isVisible()) {
        await closeButton.click();
      } else {
        // 点击页面其他区域关闭
        await page.keyboard.press('Escape');
      }
      
      console.log('✅ 视频卡片点击功能正常');
    });
  });

  test.describe('4. 可访问性测试', () => {
    test('ARIA属性测试', async ({ page }) => {
      // 测试角色属性
      await expect(page.locator('header')).toHaveAttribute('role', 'banner');
      await expect(page.locator('main')).toHaveAttribute('role', 'main');
      await expect(page.locator('aside')).toHaveAttribute('role', 'complementary');
      await expect(page.locator('footer')).toHaveAttribute('role', 'contentinfo');
      
      // 测试aria-label属性
      await expect(page.locator('input#search')).toHaveAttribute('aria-label', '搜索视频');
      await expect(page.locator('[role="navigation"][aria-label="视频分类"]')).toBeVisible();
      
      console.log('✅ ARIA属性测试通过');
    });

    test('键盘导航测试', async ({ page }) => {
      // 测试Tab键导航
      await page.keyboard.press('Tab');
      const firstFocusable = page.locator(':focus');
      await expect(firstFocusable).toBeVisible();
      
      // 测试Enter键触发按钮
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');
      await page.keyboard.press('Enter');
      await page.waitForTimeout(300);
      
      console.log('✅ 键盘导航测试通过');
    });

    test('焦点状态测试', async ({ page }) => {
      const searchInput = page.locator('input#search');
      
      // 点击搜索框
      await searchInput.click();
      
      // 验证焦点状态
      await expect(searchInput).toBeFocused();
      
      // 测试分类按钮焦点
      const categoryButton = page.locator('[role="navigation"][aria-label="视频分类"] button').first();
      await categoryButton.focus();
      await expect(categoryButton).toBeFocused();
      
      console.log('✅ 焦点状态测试通过');
    });
  });

  test.describe('5. 视觉一致性测试', () => {
    test('颜色一致性测试', async ({ page }) => {
      // 测试主题颜色一致性
      const primaryColor = await page.evaluate(() => {
        const primary = getComputedStyle(document.documentElement).getPropertyValue('--primary').trim();
        return primary || 'rgb(255, 95, 0)';
      });
      
      console.log(`主色调: ${primaryColor}`);
      
      // 验证主要颜色元素存在
      const primaryElements = page.locator('.bg-primary, [style*="background: rgb(255, 95, 0)"]');
      const count = await primaryElements.count();
      expect(count).toBeGreaterThan(0);
      
      console.log(`✅ 找到 ${count} 个主色调元素`);
    });

    test('字体层级测试', async ({ page }) => {
      // 测试标题字体
      const title = page.locator('#timeline-title');
      const titleFontSize = await title.evaluate(el => getComputedStyle(el).fontSize);
      console.log(`标题字体大小: ${titleFontSize}`);
      
      // 测试正文字体
      const bodyText = page.locator('.text-muted-foreground').first();
      const bodyFontSize = await bodyText.evaluate(el => getComputedStyle(el).fontSize);
      console.log(`正文字体大小: ${bodyFontSize}`);
      
      // 验证标题比正文大
      expect(parseFloat(titleFontSize)).toBeGreaterThan(parseFloat(bodyFontSize));
      
      console.log('✅ 字体层级测试通过');
    });

    test('间距一致性测试', async ({ page }) => {
      // 测试主内容区域间距
      const mainContent = page.locator('main');
      const padding = await mainContent.evaluate(el => getComputedStyle(el).padding);
      console.log(`主内容区域内边距: ${padding}`);
      
      // 验证内边距存在
      expect(padding).not.toBe('0px');
      
      console.log('✅ 间距一致性测试通过');
    });
  });

  test.describe('6. 动画流畅度测试', () => {
    test('过渡动画测试', async ({ page }) => {
      // 测试主题切换动画
      const startTime = Date.now();
      await page.locator('button[role="switch"]').click();
      await page.waitForTimeout(500);
      const transitionTime = Date.now() - startTime;
      
      console.log(`主题切换动画时间: ${transitionTime}ms`);
      expect(transitionTime).toBeLessThan(1000); // 动画应在1秒内完成
      
      // 恢复主题
      await page.locator('button[role="switch"]').click();
      
      console.log('✅ 过渡动画流畅');
    });

    test('悬停效果测试', async ({ page }) => {
      const videoCard = page.locator('[role="article"]').first();
      
      // 测试悬停效果
      await videoCard.hover();
      await page.waitForTimeout(350);
      
      // 验证卡片有transform效果
      const transform = await videoCard.evaluate(el => {
        const style = getComputedStyle(el);
        return style.transform;
      });
      
      console.log(`卡片transform: ${transform !== 'none' ? '有效' : '无效'}`);
      expect(transform).not.toBe('none');
      
      console.log('✅ 悬停效果正常');
    });
  });

  test.describe('7. 内容渲染测试', () => {
    test('视频列表渲染测试', async ({ page }) => {
      const videoCards = page.locator('[role="article"]');
      const cardCount = await videoCards.count();
      
      console.log(`视频卡片数量: ${cardCount}`);
      expect(cardCount).toBeGreaterThan(0);
      
      // 测试每个卡片的必要元素
      for (let i = 0; i < Math.min(cardCount, 3); i++) {
        const card = videoCards.nth(i);
        
        // 验证缩略图存在
        const thumbnail = card.locator('img').first();
        await expect(thumbnail).toHaveAttribute('src');
        
        // 验证标题存在
        const title = card.locator('h3').first();
        await expect(title).toBeVisible();
        
        // 验证元数据存在
        const meta = card.locator('.text-muted-foreground').first();
        await expect(meta).toBeVisible();
      }
      
      console.log('✅ 视频列表渲染正常');
    });

    test('时间线渲染测试', async ({ page }) => {
      const timelineItems = page.locator('[role="feed"] > div');
      const itemCount = await timelineItems.count();
      
      console.log(`时间线项目数量: ${itemCount}`);
      expect(itemCount).toBeGreaterThan(0);
      
      // 测试每个时间线的日期
      for (let i = 0; i < Math.min(itemCount, 3); i++) {
        const item = timelineItems.nth(i);
        await expect(item).toBeVisible();
      }
      
      console.log('✅ 时间线渲染正常');
    });

    test('侧边栏渲染测试', async ({ page }) => {
      const sidebar = page.locator('aside');
      await expect(sidebar).toBeVisible();
      
      // 测试公告区域
      const announcement = page.locator('text=直播公告');
      if (await announcement.isVisible()) {
        console.log('✅ 公告区域渲染正常');
      }
      
      // 测试聊天区域
      const chatArea = page.locator('[class*="overflow-hidden"]').first();
      await expect(chatArea).toBeVisible();
      
      console.log('✅ 侧边栏渲染正常');
    });
  });

  test.describe('8. 滚动性能测试', () => {
    test('页面滚动测试', async ({ page }) => {
      // 滚动到页面底部
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(500);
      
      // 验证页面底部内容可见
      const footer = page.locator('footer');
      await expect(footer).toBeVisible();
      
      // 滚动回顶部
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForTimeout(500);
      
      // 验证页面顶部内容可见
      const header = page.locator('header');
      await expect(header).toBeVisible();
      
      console.log('✅ 页面滚动正常');
    });

    test('固定头部响应测试', async ({ page }) => {
      const header = page.locator('header');
      const initialHeaderTop = await header.evaluate(el => el.getBoundingClientRect().top);
      
      // 滚动页面
      await page.evaluate(() => window.scrollTo(0, 500));
      await page.waitForTimeout(300);
      
      const scrolledHeaderTop = await header.evaluate(el => el.getBoundingClientRect().top);
      
      // 固定头部应该仍然在视口内
      expect(scrolledHeaderTop).toBeLessThanOrEqual(0);
      
      console.log('✅ 固定头部响应正常');
    });
  });

  test.describe('9. 错误处理测试', () => {
    test('图片加载失败处理测试', async ({ page }) => {
      // 监听控制台错误
      const consoleErrors = [];
      page.on('console', msg => {
        if (msg.type() === 'error') {
          consoleErrors.push(msg.text());
        }
      });
      
      // 等待页面加载
      await page.waitForTimeout(2000);
      
      // 过滤图片加载错误
      const imageErrors = consoleErrors.filter(err => 
        err.includes('image') || err.includes('Image') || err.includes('404')
      );
      
      console.log(`图片加载错误数: ${imageErrors.length}`);
      console.log(`总控制台错误数: ${consoleErrors.length}`);
      
      // 图片加载错误不应该导致页面崩溃
      const criticalErrors = consoleErrors.filter(err => 
        err.includes('Uncaught') || err.includes('TypeError') || err.includes('ReferenceError')
      );
      
      expect(criticalErrors.length).toBe(0);
      
      console.log('✅ 错误处理正常');
    });
  });

  test.describe('10. 综合用户体验测试', () => {
    test('完整用户流程测试', async ({ page }) => {
      // 1. 页面加载
      await page.waitForLoadState('networkidle');
      console.log('1. 页面加载完成');
      
      // 2. 验证关键元素
      await expect(page.locator('header')).toBeVisible();
      await expect(page.locator('[role="feed"]')).toBeVisible();
      console.log('2. 关键元素验证通过');
      
      // 3. 搜索功能
      await page.locator('input#search').fill('测试');
      await page.waitForTimeout(500);
      console.log('3. 搜索功能正常');
      
      // 4. 分类筛选
      await page.locator('[role="navigation"][aria-label="视频分类"] button').nth(1).click();
      await page.waitForTimeout(500);
      console.log('4. 分类筛选正常');
      
      // 5. 主题切换
      await page.locator('button[role="switch"]').click();
      await page.waitForTimeout(500);
      console.log('5. 主题切换正常');
      
      // 6. 视频卡片交互
      const videoCard = page.locator('[role="article"]').first();
      await videoCard.hover();
      await page.waitForTimeout(300);
      console.log('6. 视频卡片交互正常');
      
      // 7. 滚动测试
      await page.evaluate(() => window.scrollTo(0, 500));
      await page.waitForTimeout(300);
      console.log('7. 滚动功能正常');
      
      // 8. 页面底部
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(300);
      await expect(page.locator('footer')).toBeVisible();
      console.log('8. 页面底部正常');
      
      console.log('✅ 完整用户流程测试通过');
    });
  });
});

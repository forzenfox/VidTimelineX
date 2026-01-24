import { chromium, expect } from '@playwright/test';

async function testTigerTheme() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // 访问构建后的页面
    await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
    
    console.log('页面加载完成，开始验证老虎主题 UI 优化...');
    
    // 1. 验证老虎主题的配色是否正确应用
    console.log('\n1. 验证老虎主题配色...');
    const computedStyle = await page.evaluate(() => {
      const body = document.body;
      const computed = window.getComputedStyle(body);
      return {
        backgroundColor: computed.backgroundColor,
        color: computed.color
      };
    });
    console.log('   背景颜色:', computedStyle.backgroundColor);
    console.log('   文字颜色:', computedStyle.color);
    
    // 2. 验证虎纹背景是否显示
    console.log('\n2. 验证虎纹背景...');
    const hasTigerStripe = await page.evaluate(() => {
      return document.querySelector('.tiger-stripe') !== null;
    });
    console.log('   虎纹背景:', hasTigerStripe ? '✅ 存在' : '❌ 不存在');
    
    // 3. 验证主题切换按钮是否正常工作
    console.log('\n3. 验证主题切换按钮...');
    const themeToggle = page.locator('button[aria-label*="切换到"]');
    const isThemeToggleVisible = await themeToggle.isVisible();
    console.log('   主题切换按钮可见性:', isThemeToggleVisible ? '✅ 可见' : '❌ 不可见');
    
    // 4. 验证视频卡片是否有虎纹效果
    console.log('\n4. 验证视频卡片虎纹效果...');
    const videoCards = page.locator('[role="article"]');
    const videoCardCount = await videoCards.count();
    console.log(`   视频卡片数量: ${videoCardCount}`);
    
    if (videoCardCount > 0) {
      const firstCard = videoCards.first();
      const hasTigerStripeOverlay = await firstCard.locator('.tiger-stripe-overlay').count() > 0;
      console.log('   视频卡片虎纹overlay:', hasTigerStripeOverlay ? '✅ 存在' : '❌ 不存在');
    }
    
    // 5. 验证分类标签是否有虎纹背景
    console.log('\n5. 验证分类标签虎纹背景...');
    const categoryTags = page.locator('[role="badge"]');
    const categoryTagCount = await categoryTags.count();
    console.log(`   分类标签数量: ${categoryTagCount}`);
    
    if (categoryTagCount > 0) {
      const firstTag = categoryTags.first();
      const hasTigerTagBg = await firstTag.evaluate(tag => {
        return tag.classList.contains('tiger-tag-bg') || 
               tag.style.backgroundImage.includes('linear-gradient');
      });
      console.log('   分类标签虎纹背景:', hasTigerTagBg ? '✅ 存在' : '❌ 不存在');
    }
    
    // 6. 验证页面边角装饰图标
    console.log('\n6. 验证页面边角装饰图标...');
    const cornerIcons = page.locator('div[class*="absolute"]:has-text("🐯")');
    const cornerIconCount = await cornerIcons.count();
    console.log(`   页面边角装饰图标数量: ${cornerIconCount}`);
    
    // 7. 验证主题切换功能
    console.log('\n7. 验证主题切换功能...');
    if (isThemeToggleVisible) {
      await themeToggle.click();
      await page.waitForTimeout(1000);
      console.log('   主题切换按钮点击成功');
      
      // 切换回老虎主题
      await themeToggle.click();
      await page.waitForTimeout(1000);
      console.log('   切换回老虎主题成功');
    }
    
    console.log('\n🎉 老虎主题 UI 优化验证完成！');
    
  } catch (error) {
    console.error('验证过程中发生错误:', error);
  } finally {
    await browser.close();
  }
}

testTigerTheme();

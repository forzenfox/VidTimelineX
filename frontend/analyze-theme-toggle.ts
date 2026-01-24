import { test } from '@playwright/test';

test('分析主题切换按钮', async ({ page }) => {
  // 访问本地开发服务器
  await page.goto('http://localhost:3001/');
  
  // 等待页面加载完成
  await page.waitForLoadState('networkidle');
  
  // 查找主题切换按钮
  const themeToggle = page.locator('button[role="switch"]');
  
  // 获取按钮的尺寸和位置
  const buttonBoundingBox = await themeToggle.boundingBox();
  console.log('按钮尺寸和位置:', buttonBoundingBox);
  
  // 获取按钮的CSS样式
  const buttonComputedStyle = await themeToggle.evaluate(
    'element => window.getComputedStyle(element)'
  );
  console.log('按钮样式:', `${buttonComputedStyle.width} x ${buttonComputedStyle.height}`);
  console.log('按钮边框圆角:', buttonComputedStyle.borderRadius);
  
  // 获取甜筒主题下的爱心图标
  const heartIcon = page.locator('button[role="switch"] .lucide-heart');
  const heartBoundingBox = await heartIcon.boundingBox();
  console.log('爱心图标尺寸和位置:', heartBoundingBox);
  
  // 获取SWEET文字
  const sweetText = page.locator('button[role="switch"] span:text("SWEET")');
  const sweetTextBoundingBox = await sweetText.boundingBox();
  console.log('SWEET文字尺寸和位置:', sweetTextBoundingBox);
  
  // 切换到老虎主题
  await themeToggle.click();
  
  // 等待主题切换完成
  await page.waitForTimeout(1000);
  
  // 获取老虎主题下的皇冠图标
  const crownIcon = page.locator('button[role="switch"] .lucide-crown');
  const crownBoundingBox = await crownIcon.boundingBox();
  console.log('皇冠图标尺寸和位置:', crownBoundingBox);
  
  // 获取TIGER文字
  const tigerText = page.locator('button[role="switch"] span:text("TIGER")');
  const tigerTextBoundingBox = await tigerText.boundingBox();
  console.log('TIGER文字尺寸和位置:', tigerTextBoundingBox);
  
  // 计算间距
  if (heartBoundingBox && sweetTextBoundingBox) {
    const heartToTextDistance = sweetTextBoundingBox.x - (heartBoundingBox.x + heartBoundingBox.width);
    console.log('爱心图标到SWEET文字的距离:', `${heartToTextDistance}px`);
  }
  
  if (crownBoundingBox && tigerTextBoundingBox) {
    const crownToTextDistance = crownBoundingBox.x - (tigerTextBoundingBox.x + tigerTextBoundingBox.width);
    console.log('皇冠图标到TIGER文字的距离:', `${crownToTextDistance}px`);
  }
  
  // 分析最合适的调整方案
  console.log('\n--- 调整方案分析 ---');
  console.log('问题: 爱心图标遮挡SWEET文字');
  console.log('建议调整:');
  console.log('1. 调整滑块宽度：从w-9调整为w-8或更小');
  console.log('2. 调整甜筒主题下文字位置：从justify-end调整为justify-center或增加右侧内边距');
  console.log('3. 调整爱心图标位置：向左移动，减少左侧内边距或增加负外边距');
  console.log('4. 调整SWEET文字样式：增加左侧外边距或调整字体大小');
});

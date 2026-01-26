// Playwright主题切换测试脚本
const { chromium } = require('playwright');

async function testThemeToggle() {
  console.log('=== 甜筒页面主题切换修复测试 ===');
  
  // 启动浏览器
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  try {
    // 导航到甜筒页面
    await page.goto('http://localhost:3001/tiantong', { waitUntil: 'networkidle' });
    console.log('已导航到甜筒页面');
    
    // 等待页面加载完成
    await page.waitForSelector('.flex-1 > .flex-shrink-0 > .flex-shrink-0 > button');
    console.log('页面加载完成，找到主题切换按钮');
    
    // 检查初始主题
    const initialTheme = await page.evaluate(() => {
      return document.documentElement.classList.contains('theme-sweet') ? 'sweet' : 'tiger';
    });
    console.log(`初始主题: ${initialTheme}`);
    
    // 点击主题切换按钮
    await page.click('.flex-1 > .flex-shrink-0 > .flex-shrink-0 > button');
    console.log('点击主题切换按钮');
    
    // 等待主题切换完成
    await page.waitForTimeout(500);
    
    // 检查主题是否切换
    const newTheme = await page.evaluate(() => {
      return document.documentElement.classList.contains('theme-sweet') ? 'sweet' : 'tiger';
    });
    console.log(`切换后主题: ${newTheme}`);
    
    // 验证主题是否切换成功
    if (newTheme !== initialTheme) {
      console.log('✅ 主题切换成功！');
      
      // 再次点击切换回原主题
      await page.click('.flex-1 > .flex-shrink-0 > .flex-shrink-0 > button');
      await page.waitForTimeout(500);
      
      const finalTheme = await page.evaluate(() => {
        return document.documentElement.classList.contains('theme-sweet') ? 'sweet' : 'tiger';
      });
      console.log(`最终主题: ${finalTheme}`);
      
      if (finalTheme === initialTheme) {
        console.log('✅ 主题切换双向功能正常！');
        console.log('\n=== 测试结果: 主题切换功能已修复 ===');
        return true;
      } else {
        console.error('❌ 主题切换回原主题失败！');
        return false;
      }
    } else {
      console.error('❌ 主题切换失败！');
      return false;
    }
  } catch (error) {
    console.error('测试过程中发生错误:', error);
    return false;
  } finally {
    // 关闭浏览器
    await browser.close();
  }
}

// 运行测试
testThemeToggle()
  .then(result => {
    console.log(result ? '测试通过！' : '测试失败！');
    process.exit(result ? 0 : 1);
  })
  .catch(error => {
    console.error('测试失败:', error);
    process.exit(1);
  });

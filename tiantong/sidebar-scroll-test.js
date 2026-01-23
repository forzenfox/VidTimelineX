// 简单的侧边栏滚动测试脚本
import { chromium } from 'playwright';

async function testSidebarScroll() {
  console.log('开始侧边栏滚动测试...');
  
  // 启动浏览器
  const browser = await chromium.launch({
    headless: false,
    timeout: 30000
  });
  
  try {
    // 创建新页面
    const page = await browser.newPage({
      viewport: { width: 1920, height: 1080 }
    });
    
    console.log('正在导航到本地服务器...');
    
    // 导航到本地开发服务器，设置较短的超时时间
    await page.goto('http://localhost:5173/', {
      waitUntil: 'domcontentloaded', // 使用domcontentloaded而不是networkidle，更快
      timeout: 10000
    });
    
    console.log('页面加载完成，等待主要内容出现...');
    
    // 等待主要内容出现
    await page.waitForSelector('h1', { timeout: 5000 });
    
    console.log('开始测试滚动效果...');
    
    // 初始位置截图
    await page.screenshot({
      path: '../screenshots/sidebar-initial.png',
      fullPage: false
    });
    console.log('已保存初始位置截图');
    
    // 滚动到页面25%位置
    await page.evaluate(() => {
      window.scrollTo(0, window.innerHeight * 0.25);
    });
    await page.waitForTimeout(500);
    await page.screenshot({
      path: '../screenshots/sidebar-scroll-25.png',
      fullPage: false
    });
    console.log('已保存25%位置截图');
    
    // 滚动到页面50%位置
    await page.evaluate(() => {
      window.scrollTo(0, window.innerHeight * 0.5);
    });
    await page.waitForTimeout(500);
    await page.screenshot({
      path: '../screenshots/sidebar-scroll-50.png',
      fullPage: false
    });
    console.log('已保存50%位置截图');
    
    // 滚动到页面75%位置
    await page.evaluate(() => {
      window.scrollTo(0, window.innerHeight * 0.75);
    });
    await page.waitForTimeout(500);
    await page.screenshot({
      path: '../screenshots/sidebar-scroll-75.png',
      fullPage: false
    });
    console.log('已保存75%位置截图');
    
    // 滚动到页面底部
    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight);
    });
    await page.waitForTimeout(500);
    await page.screenshot({
      path: '../screenshots/sidebar-scroll-bottom.png',
      fullPage: false
    });
    console.log('已保存底部位置截图');
    
    console.log('\n测试完成！');
    console.log('查看screenshots目录下的截图，分析侧边栏在不同滚动位置的展示效果。');
    
  } catch (error) {
    console.error('测试过程中出错:', error);
  } finally {
    // 关闭浏览器
    await browser.close();
  }
}

// 运行测试
testSidebarScroll();

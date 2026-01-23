import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

// 测试配置
const LVJIANG_URL = 'http://localhost:3000/dongzhu-kaige';
const FRONTEND_URL = 'http://localhost:5173/dongzhu-kaige';
const OUTPUT_DIR = path.join(__dirname, 'output');

// 确保输出目录存在
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// 保存截图
async function saveScreenshot(page: any, name: string) {
  await page.screenshot({
    path: path.join(OUTPUT_DIR, `${name}.png`),
    fullPage: true
  });
}

// 保存DOM结构
async function saveDOM(page: any, name: string) {
  const html = await page.content();
  fs.writeFileSync(path.join(OUTPUT_DIR, `${name}.html`), html, 'utf-8');
}

// 保存CSS样式
async function saveCSS(page: any, name: string) {
  const styles = await page.evaluate(() => {
    const styleSheets = Array.from(document.styleSheets);
    let css = '';
    styleSheets.forEach(sheet => {
      try {
        const rules = Array.from(sheet.cssRules);
        rules.forEach(rule => {
          css += rule.cssText + '\n';
        });
      } catch (e) {
        // 忽略跨域样式表
      }
    });
    return css;
  });
  fs.writeFileSync(path.join(OUTPUT_DIR, `${name}.css`), styles, 'utf-8');
}

// 保存页面信息
async function savePageInfo(page: any, name: string) {
  const info = await page.evaluate(() => {
    return {
      title: document.title,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      },
      elementsCount: document.querySelectorAll('*').length,
      imagesCount: document.querySelectorAll('img').length,
      linksCount: document.querySelectorAll('a').length,
      scriptsCount: document.querySelectorAll('script').length,
      stylesheetsCount: document.querySelectorAll('link[rel="stylesheet"]').length
    };
  });
  fs.writeFileSync(path.join(OUTPUT_DIR, `${name}-info.json`), JSON.stringify(info, null, 2), 'utf-8');
}

test('Compare DongZhuKaiGe pages', async ({ page }) => {
  console.log('开始爬取和对比页面...');

  // 1. 爬取 lvjiang 项目页面
  console.log(`访问 lvjiang 页面: ${LVJIANG_URL}`);
  await page.goto(LVJIANG_URL, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000); // 等待页面加载完成
  
  // 保存 lvjiang 页面信息
  await saveScreenshot(page, 'lvjiang-screenshot');
  await saveDOM(page, 'lvjiang-dom');
  await saveCSS(page, 'lvjiang-css');
  await savePageInfo(page, 'lvjiang');

  // 2. 爬取 frontend 项目页面
  console.log(`访问 frontend 页面: ${FRONTEND_URL}`);
  await page.goto(FRONTEND_URL, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000); // 等待页面加载完成
  
  // 保存 frontend 页面信息
  await saveScreenshot(page, 'frontend-screenshot');
  await saveDOM(page, 'frontend-dom');
  await saveCSS(page, 'frontend-css');
  await savePageInfo(page, 'frontend');

  // 3. 进行响应式测试
  const viewportSizes = [
    { width: 320, height: 568 }, // 手机
    { width: 768, height: 1024 }, // 平板
    { width: 1280, height: 720 }, // 桌面
    { width: 1920, height: 1080 } // 大屏幕
  ];

  for (const size of viewportSizes) {
    console.log(`测试响应式布局: ${size.width}x${size.height}`);
    
    // 设置视口大小
    await page.setViewportSize(size);
    
    // 测试 lvjiang 页面
    await page.goto(LVJIANG_URL, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);
    await saveScreenshot(page, `lvjiang-responsive-${size.width}x${size.height}`);
    
    // 测试 frontend 页面
    await page.goto(FRONTEND_URL, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);
    await saveScreenshot(page, `frontend-responsive-${size.width}x${size.height}`);
  }

  // 4. 交互行为测试
  console.log('测试交互行为...');
  
  // 测试主题切换
  await page.goto(LVJIANG_URL, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  // 尝试找到主题切换按钮并点击
  try {
    const themeToggleButton = await page.$('button[aria-label="切换主题"]');
    if (themeToggleButton) {
      await themeToggleButton.click();
      await page.waitForTimeout(1000);
      await saveScreenshot(page, 'lvjiang-theme-toggle');
    }
  } catch (e) {
    console.log('lvjiang 页面主题切换按钮未找到或无法点击');
  }
  
  await page.goto(FRONTEND_URL, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  try {
    const themeToggleButton = await page.$('button[class*="group relative overflow-hidden"]');
    if (themeToggleButton) {
      await themeToggleButton.click();
      await page.waitForTimeout(1000);
      await saveScreenshot(page, 'frontend-theme-toggle');
    }
  } catch (e) {
    console.log('frontend 页面主题切换按钮未找到或无法点击');
  }

  // 5. 性能测试
  console.log('测试页面性能...');
  
  await page.goto(LVJIANG_URL, { waitUntil: 'networkidle' });
  const lvjiangPerf = await page.evaluate(() => {
    return performance.timing;
  });
  fs.writeFileSync(path.join(OUTPUT_DIR, 'lvjiang-performance.json'), JSON.stringify(lvjiangPerf, null, 2), 'utf-8');
  
  await page.goto(FRONTEND_URL, { waitUntil: 'networkidle' });
  const frontendPerf = await page.evaluate(() => {
    return performance.timing;
  });
  fs.writeFileSync(path.join(OUTPUT_DIR, 'frontend-performance.json'), JSON.stringify(frontendPerf, null, 2), 'utf-8');

  console.log('页面爬取和对比数据收集完成！');
  console.log(`输出文件已保存到: ${OUTPUT_DIR}`);
});
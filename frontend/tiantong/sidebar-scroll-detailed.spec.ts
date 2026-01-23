import { test, expect, chromium, firefox, webkit } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

// 测试配置
const browsers = ['chromium', 'firefox', 'webkit'] as const;
const scrollPositions = [
  { name: 'initial', percentage: 0 },
  { name: '25%', percentage: 0.25 },
  { name: '50%', percentage: 0.5 },
  { name: '75%', percentage: 0.75 },
  { name: 'bottom', percentage: 1 }
];

// 报告数据结构
interface SidebarState {
  browser: string;
  scrollPosition: string;
  scrollPercentage: number;
  timestamp: number;
  isVisible: boolean;
  styles: {
    position: string;
    top: string;
    height: string;
    zIndex: string;
    visibility: string;
    opacity: string;
  };
  position: {
    top: number;
    left: number;
    right: number;
    bottom: number;
    width: number;
    height: number;
  };
  elements: {
    announcement: boolean;
    chatArea: boolean;
    inputArea: boolean;
    topBar: boolean;
  };
  cssClasses: string[];
}

// 创建报告目录
const reportDir = path.join(process.cwd(), 'sidebar-scroll-reports');
const screenshotsDir = path.join(reportDir, 'screenshots');
if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir, { recursive: true });
}

// 生成HTML报告
function generateHtmlReport(data: SidebarState[]) {
  const html = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>侧边栏滚动测试报告</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      background-color: #f5f5f5;
      color: #333;
      line-height: 1.6;
    }
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }
    h1 {
      text-align: center;
      margin-bottom: 30px;
      color: #2c3e50;
    }
    .report-info {
      background: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      margin-bottom: 30px;
    }
    .browser-tabs {
      display: flex;
      gap: 10px;
      margin-bottom: 20px;
      overflow-x: auto;
    }
    .browser-tab {
      padding: 10px 20px;
      background: white;
      border: 1px solid #e0e0e0;
      border-radius: 4px;
      cursor: pointer;
      white-space: nowrap;
      transition: all 0.2s;
    }
    .browser-tab.active {
      background: #3498db;
      color: white;
      border-color: #3498db;
    }
    .test-results {
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      overflow: hidden;
    }
    .scroll-section {
      margin-bottom: 30px;
      padding: 20px;
      border-bottom: 1px solid #e0e0e0;
    }
    .scroll-section:last-child {
      border-bottom: none;
    }
    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15px;
      padding-bottom: 10px;
      border-bottom: 2px solid #3498db;
    }
    .scroll-position {
      font-size: 1.2em;
      font-weight: bold;
      color: #2c3e50;
    }
    .status {
      padding: 5px 15px;
      border-radius: 20px;
      font-weight: bold;
    }
    .status.visible {
      background: #2ecc71;
      color: white;
    }
    .status.hidden {
      background: #e74c3c;
      color: white;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
      margin-bottom: 20px;
    }
    .card {
      background: #f8f9fa;
      padding: 15px;
      border-radius: 6px;
      border: 1px solid #e9ecef;
    }
    .card h3 {
      margin-bottom: 10px;
      font-size: 1em;
      color: #495057;
    }
    .card p {
      margin-bottom: 5px;
      font-size: 0.9em;
    }
    .screenshot-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 15px;
    }
    .screenshot-item {
      background: #f8f9fa;
      padding: 10px;
      border-radius: 6px;
      text-align: center;
    }
    .screenshot-item img {
      max-width: 100%;
      border-radius: 4px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .screenshot-caption {
      margin-top: 10px;
      font-size: 0.9em;
      color: #6c757d;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 15px;
      font-size: 0.9em;
    }
    th, td {
      padding: 8px 12px;
      text-align: left;
      border-bottom: 1px solid #e0e0e0;
    }
    th {
      background: #f8f9fa;
      font-weight: 600;
      color: #495057;
    }
    tr:hover {
      background: #f8f9fa;
    }
    .code {
      font-family: 'Courier New', Courier, monospace;
      background: #f1f3f4;
      padding: 2px 6px;
      border-radius: 3px;
      font-size: 0.85em;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>侧边栏滚动测试报告</h1>
    
    <div class="report-info">
      <p><strong>测试时间:</strong> ${new Date().toLocaleString()}</p>
      <p><strong>测试浏览器:</strong> ${browsers.join(', ')}</p>
      <p><strong>测试滚动位置:</strong> ${scrollPositions.map(p => p.name).join(', ')}</p>
      <p><strong>总测试用例数:</strong> ${data.length}</p>
      <p><strong>通过测试数:</strong> ${data.filter(d => d.isVisible).length}</p>
    </div>
    
    <div class="browser-tabs">
      ${browsers.map(browser => `
        <div class="browser-tab" onclick="showBrowser('${browser}')">
          ${browser.charAt(0).toUpperCase() + browser.slice(1)}
        </div>
      `).join('')}
    </div>
    
    <div class="test-results">
      ${browsers.map(browser => `
        <div id="${browser}" class="browser-results" ${browser !== 'chromium' ? 'style="display: none;"' : ''}>
          ${scrollPositions.map(position => {
            const state = data.find(d => d.browser === browser && d.scrollPosition === position.name);
            if (!state) return '';
            return `
            <div class="scroll-section">
              <div class="section-header">
                <div class="scroll-position">滚动位置: ${position.name} (${position.percentage * 100}%)</div>
                <div class="status ${state.isVisible ? 'visible' : 'hidden'}">
                  ${state.isVisible ? '可见' : '隐藏'}
                </div>
              </div>
              
              <div class="grid">
                <div class="card">
                  <h3>基本信息</h3>
                  <p><strong>浏览器:</strong> ${state.browser}</p>
                  <p><strong>时间戳:</strong> ${new Date(state.timestamp).toLocaleTimeString()}</p>
                  <p><strong>可见性:</strong> ${state.isVisible ? '是' : '否'}</p>
                </div>
                
                <div class="card">
                  <h3>位置信息</h3>
                  <p><strong>顶部距离:</strong> ${Math.round(state.position.top)}px</p>
                  <p><strong>左侧距离:</strong> ${Math.round(state.position.left)}px</p>
                  <p><strong>宽度:</strong> ${Math.round(state.position.width)}px</p>
                  <p><strong>高度:</strong> ${Math.round(state.position.height)}px</p>
                </div>
                
                <div class="card">
                  <h3>样式信息</h3>
                  <p><strong>定位:</strong> ${state.styles.position}</p>
                  <p><strong>Top值:</strong> ${state.styles.top}</p>
                  <p><strong>Z-index:</strong> ${state.styles.zIndex}</p>
                  <p><strong>透明度:</strong> ${state.styles.opacity}</p>
                </div>
              </div>
              
              <div class="card">
                <h3>子元素可见性</h3>
                <table>
                  <tr>
                    <th>元素</th>
                    <th>可见性</th>
                  </tr>
                  <tr>
                    <td>直播公告</td>
                    <td>${state.elements.announcement ? '可见' : '隐藏'}</td>
                  </tr>
                  <tr>
                    <td>聊天区域</td>
                    <td>${state.elements.chatArea ? '可见' : '隐藏'}</td>
                  </tr>
                  <tr>
                    <td>输入区域</td>
                    <td>${state.elements.inputArea ? '可见' : '隐藏'}</td>
                  </tr>
                  <tr>
                    <td>顶部信息栏</td>
                    <td>${state.elements.topBar ? '可见' : '隐藏'}</td>
                  </tr>
                </table>
              </div>
              
              <div class="card">
                <h3>CSS类名</h3>
                <p>${state.cssClasses.map(cls => `<span class="code">${cls}</span>`).join(' ')}</p>
              </div>
              
              <div class="screenshot-grid">
                <div class="screenshot-item">
                  <img src="screenshots/${browser}-sidebar-${position.name}.png" alt="${browser} - ${position.name}">
                  <div class="screenshot-caption">${browser} - ${position.name}</div>
                </div>
              </div>
            </div>
            `;
          }).join('')}
        </div>
      `).join('')}
    </div>
  </div>
  
  <script>
    function showBrowser(browser) {
      // 隐藏所有浏览器结果
      document.querySelectorAll('.browser-results').forEach(el => {
        el.style.display = 'none';
      });
      // 移除所有标签的active类
      document.querySelectorAll('.browser-tab').forEach(el => {
        el.classList.remove('active');
      });
      // 显示当前浏览器结果
      document.getElementById(browser).style.display = 'block';
      // 添加当前标签的active类
      event.target.classList.add('active');
    }
  </script>
</body>
</html>
  `;
  
  fs.writeFileSync(path.join(reportDir, 'index.html'), html);
}

// 测试主函数
async function runSidebarScrollTest(browserName: typeof browsers[number]) {
  let browser;
  
  // 启动浏览器
  switch (browserName) {
    case 'chromium':
      browser = await chromium.launch({ headless: false });
      break;
    case 'firefox':
      browser = await firefox.launch({ headless: false });
      break;
    case 'webkit':
      browser = await webkit.launch({ headless: false });
      break;
    default:
      throw new Error(`不支持的浏览器: ${browserName}`);
  }
  
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
  });
  
  const page = await context.newPage();
  
  // 导航到本地开发服务器
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
  // 等待页面加载完成，使用更通用的选择器
  await page.waitForSelector('#root', { timeout: 5000 });
  
  const results: SidebarState[] = [];
  
  // 遍历所有滚动位置
  for (const position of scrollPositions) {
    // 滚动到指定位置
    if (position.percentage === 1) {
      // 滚动到底部
      await page.mouse.wheel(0, 10000);
    } else {
      // 滚动到指定百分比位置
      await page.evaluate((percentage) => {
        const scrollAmount = window.innerHeight * percentage;
        window.scrollTo(0, scrollAmount);
      }, position.percentage);
    }
    
    // 等待滚动动画完成
    await page.waitForTimeout(800);
    
    // 截图
    await page.screenshot({
      path: path.join(screenshotsDir, `${browserName}-sidebar-${position.name}.png`),
      fullPage: false,
    });
    
    // 获取侧边栏元素（使用更可靠的定位方式）
    const sidebar = page.locator('.sticky.border-2.flex.flex-col'); // 使用多个常见类组合定位
    
    // 收集侧边栏状态
    const state: SidebarState = {
      browser: browserName,
      scrollPosition: position.name,
      scrollPercentage: position.percentage,
      timestamp: Date.now(),
      isVisible: await sidebar.isVisible(),
      styles: await sidebar.evaluate((el) => {
        const style = window.getComputedStyle(el);
        return {
          position: style.position,
          top: style.top,
          height: style.height,
          zIndex: style.zIndex,
          visibility: style.visibility,
          opacity: style.opacity,
        };
      }),
      position: await sidebar.evaluate((el) => {
        const rect = el.getBoundingClientRect();
        return {
          top: rect.top,
          left: rect.left,
          right: rect.right,
          bottom: rect.bottom,
          width: rect.width,
          height: rect.height,
        };
      }),
      elements: {
        announcement: await page.locator('.bg-gradient-to-br.from-secondary\\/10.to-primary\\/5').isVisible(),
        chatArea: await page.locator('.flex-1.overflow-hidden').isVisible(),
        inputArea: await page.locator('.p-3.border-t').isVisible(),
        topBar: await page.locator('.tiger-stripe').isVisible(),
      },
      cssClasses: await sidebar.evaluate((el) => {
        return el.className.split(' ').filter(cls => cls.trim() !== '');
      }),
    };
    
    results.push(state);
    
    // 验证侧边栏始终可见
    expect(state.isVisible).toBe(true);
    
    // 验证侧边栏样式保持一致
    expect(state.styles.position).toBe('sticky');
    expect(state.styles.top).toBe('16px'); // top-4 对应 16px
  }
  
  // 关闭浏览器
  await page.close();
  await context.close();
  await browser.close();
  
  return results;
}

// 运行所有浏览器测试
test('侧边栏滚动测试 - 多浏览器', async ({}, testInfo) => {
  testInfo.setTimeout(60000); // 设置超时时间
  
  let allResults: SidebarState[] = [];
  
  // 遍历所有浏览器
  for (const browser of browsers) {
    console.log(`开始测试浏览器: ${browser}`);
    const results = await runSidebarScrollTest(browser);
    allResults = [...allResults, ...results];
    console.log(`完成测试浏览器: ${browser}`);
  }
  
  // 保存原始数据
  fs.writeFileSync(
    path.join(reportDir, 'sidebar-scroll-data.json'),
    JSON.stringify(allResults, null, 2),
    'utf-8'
  );
  
  // 生成HTML报告
  generateHtmlReport(allResults);
  
  console.log('测试完成！');
  console.log(`报告生成位置: ${reportDir}`);
  console.log(`HTML报告: ${path.join(reportDir, 'index.html')}`);
  console.log(`原始数据: ${path.join(reportDir, 'sidebar-scroll-data.json')}`);
});

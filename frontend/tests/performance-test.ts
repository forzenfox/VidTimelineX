import { test, expect } from '@playwright/test';
import { chromium } from 'playwright';

// 性能测试配置
const PERFORMANCE_TEST_OPTIONS = {
  headless: false,
  slowMo: 0,
  args: ['--enable-features=NetworkService,NetworkServiceInProcess'],
  ignoreDefaultArgs: ['--enable-automation'],
  defaultViewport: { width: 1920, height: 1080 },
};

// 性能测试结果存储
interface PerformanceResult {
  page: string;
  metric: string;
  value: number;
  unit: string;
}

const performanceResults: PerformanceResult[] = [];

// 测量页面加载性能
async function measurePageLoadPerformance(pageUrl: string, pageName: string) {
  const browser = await chromium.launch(PERFORMANCE_TEST_OPTIONS);
  const context = await browser.newContext();
  const page = await context.newPage();

  // 启动性能追踪
  await page.tracing.start({
    screenshots: true,
    snapshots: true,
    sources: true,
  });

  // 测量页面加载时间
  const startTime = Date.now();
  await page.goto(pageUrl, { waitUntil: 'networkidle' });
  const endTime = Date.now();
  const loadTime = endTime - startTime;

  // 记录结果
  performanceResults.push({
    page: pageName,
    metric: 'loadTime',
    value: loadTime,
    unit: 'ms',
  });

  console.log(`${pageName} 页面加载时间: ${loadTime}ms`);

  // 测量First Contentful Paint (FCP)
  const fcp = await page.evaluate(() => {
    return new Promise<number>(resolve => {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.name === 'first-contentful-paint') {
            observer.disconnect();
            resolve(entry.startTime);
          }
        }
      });
      observer.observe({ entryTypes: ['paint'] });
    });
  });

  performanceResults.push({
    page: pageName,
    metric: 'firstContentfulPaint',
    value: fcp,
    unit: 'ms',
  });

  console.log(`${pageName} First Contentful Paint: ${fcp}ms`);

  // 测量Largest Contentful Paint (LCP)
  const lcp = await page.evaluate(() => {
    return new Promise<number>(resolve => {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.name === 'largest-contentful-paint') {
            observer.disconnect();
            resolve(entry.startTime);
          }
        }
      });
      observer.observe({ entryTypes: ['largest-contentful-paint'] });
    });
  });

  performanceResults.push({
    page: pageName,
    metric: 'largestContentfulPaint',
    value: lcp,
    unit: 'ms',
  });

  console.log(`${pageName} Largest Contentful Paint: ${lcp}ms`);

  // 停止性能追踪并保存结果
  await page.tracing.stop({
    path: `./test-results/performance-${pageName}-${Date.now()}.zip`,
  });

  await browser.close();
}

// 测量主题切换性能
async function measureThemeTogglePerformance(pageUrl: string, pageName: string, toggleSelector: string) {
  const browser = await chromium.launch(PERFORMANCE_TEST_OPTIONS);
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto(pageUrl, { waitUntil: 'networkidle' });

  // 测量主题切换时间
  const themeToggleTimes: number[] = [];

  // 执行多次主题切换以获得平均时间
  for (let i = 0; i < 5; i++) {
    const startTime = Date.now();
    await page.click(toggleSelector);
    // 等待主题切换动画完成
    await page.waitForTimeout(1000);
    const endTime = Date.now();
    themeToggleTimes.push(endTime - startTime);
  }

  // 计算平均主题切换时间
  const averageToggleTime = themeToggleTimes.reduce((sum, time) => sum + time, 0) / themeToggleTimes.length;

  performanceResults.push({
    page: pageName,
    metric: 'averageThemeToggleTime',
    value: averageToggleTime,
    unit: 'ms',
  });

  console.log(`${pageName} 平均主题切换时间: ${averageToggleTime}ms`);

  await browser.close();
}

// 运行性能测试
async function runPerformanceTests() {
  console.log('开始性能基准测试...');

  // 1. 测试甜筒页面性能
  console.log('\n=== 测试甜筒页面性能 ===');
  await measurePageLoadPerformance('http://localhost:3001/tiantong', 'tiantong');
  await measureThemeTogglePerformance('http://localhost:3001/tiantong', 'tiantong', '.flex-1 > .flex-shrink-0 > .flex-shrink-0 > button');

  // 2. 测试驴酱页面性能
  console.log('\n=== 测试驴酱页面性能 ===');
  await measurePageLoadPerformance('http://localhost:3001/lvjiang', 'lvjiang');
  await measureThemeTogglePerformance('http://localhost:3001/lvjiang', 'lvjiang', '.flex.items-center.justify-center > button');

  // 3. 生成性能报告
  console.log('\n=== 性能测试结果 ===');
  console.table(performanceResults);

  // 保存结果到文件
  const fs = require('fs');
  fs.writeFileSync(
    `./test-results/performance-report-${Date.now()}.json`,
    JSON.stringify(performanceResults, null, 2)
  );

  console.log('\n性能测试完成！报告已保存到 test-results 目录。');
}

// 执行测试
runPerformanceTests().catch(console.error);

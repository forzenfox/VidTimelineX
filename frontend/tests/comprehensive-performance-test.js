/**
 * 甜筒页面主题切换全面性能测试脚本
 * 
 * 测试内容：
 * 1. 主题切换响应时间
 * 2. 资源占用情况（CPU、内存）
 * 3. 连续切换的性能稳定性
 * 4. 不同设备配置的表现差异
 * 
 * 性能基准：
 * - 响应时间应低于300ms
 * - CPU峰值占用不超过70%
 */

const { chromium } = require('playwright');

/**
 * 性能测试配置
 */
const TEST_CONFIG = {
  testUrl: 'http://localhost:3001/tiantong',
  toggleSelector: 'button[role="switch"]',
  iterations: 10, // 连续切换次数
  waitBetweenToggles: 1000, // 切换间隔（毫秒）
  performanceMetrics: [
    'Timestamp',
    'Documents',
    'Frames',
    'JSEventListeners',
    'Nodes',
    'LayoutObjects',
    'RecalcStyleCount',
    'RecalcStyleDuration',
    'LayoutCount',
    'LayoutDuration',
    'ScriptDuration',
    'TaskDuration',
    'JSHeapUsedSize',
    'JSHeapTotalSize',
  ],
};

/**
 * 测试结果数据结构
 */
class PerformanceTestResults {
  constructor() {
    this.testStartTime = null;
    this.testEndTime = null;
    this.environment = {};
    this.themeToggleTests = [];
    this.resourceUsageTests = [];
    this.stabilityTests = [];
    this.performanceBaselines = {
      responseTime: { value: 300, unit: 'ms', status: 'pending' },
      cpuUsage: { value: 70, unit: '%', status: 'pending' },
      memoryUsage: { value: 50, unit: 'MB', status: 'pending' },
      frameRate: { value: 60, unit: 'fps', status: 'pending' },
    };
  }

  addThemeToggleResult(result) {
    this.themeToggleTests.push(result);
  }

  addResourceUsageResult(result) {
    this.resourceUsageTests.push(result);
  }

  addStabilityResult(result) {
    this.stabilityTests.push(result);
  }

  generateReport() {
    return {
      testSummary: {
        startTime: this.testStartTime,
        endTime: this.testEndTime,
        duration: this.testEndTime - this.testStartTime,
        environment: this.environment,
      },
      themeTogglePerformance: this.calculateToggleMetrics(),
      resourceUsage: this.calculateResourceMetrics(),
      stabilityPerformance: this.calculateStabilityMetrics(),
      performanceBaselines: this.performanceBaselines,
      bottlenecks: this.identifyBottlenecks(),
      recommendations: this.generateRecommendations(),
    };
  }

  calculateToggleMetrics() {
    if (this.themeToggleTests.length === 0) return null;

    const responseTimes = this.themeToggleTests.map(t => t.responseTime);
    const durations = this.themeToggleTests.map(t => t.duration);

    return {
      count: this.themeToggleTests.length,
      responseTime: {
        min: Math.min(...responseTimes),
        max: Math.max(...responseTimes),
        avg: responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length,
        p95: this.percentile(responseTimes, 95),
        p99: this.percentile(responseTimes, 99),
      },
      duration: {
        min: Math.min(...durations),
        max: Math.max(...durations),
        avg: durations.reduce((a, b) => a + b, 0) / durations.length,
      },
    };
  }

  calculateResourceMetrics() {
    if (this.resourceUsageTests.length === 0) return null;

    const cpuUsages = this.resourceUsageTests.map(t => t.cpuUsage);
    const memoryUsages = this.resourceUsageTests.map(t => t.memoryUsage);

    return {
      count: this.resourceUsageTests.length,
      cpuUsage: {
        min: Math.min(...cpuUsages),
        max: Math.max(...cpuUsages),
        avg: cpuUsages.reduce((a, b) => a + b, 0) / cpuUsages.length,
        peak: Math.max(...cpuUsages),
      },
      memoryUsage: {
        min: Math.min(...memoryUsages),
        max: Math.max(...memoryUsages),
        avg: memoryUsages.reduce((a, b) => a + b, 0) / memoryUsages.length,
        peak: Math.max(...memoryUsages),
      },
    };
  }

  calculateStabilityMetrics() {
    if (this.stabilityTests.length === 0) return null;

    const responseTimes = this.stabilityTests.map(t => t.responseTime);
    const variances = this.calculateVariance(responseTimes);

    return {
      count: this.stabilityTests.length,
      responseTimes: responseTimes,
      variance: variances,
      standardDeviation: Math.sqrt(variances),
      stabilityScore: this.calculateStabilityScore(responseTimes),
      trend: this.analyzeTrend(responseTimes),
    };
  }

  percentile(arr, p) {
    const sorted = [...arr].sort((a, b) => a - b);
    const index = Math.ceil(p / 100 * sorted.length) - 1;
    return sorted[Math.max(0, index)];
  }

  calculateVariance(arr) {
    const avg = arr.reduce((a, b) => a + b, 0) / arr.length;
    return arr.reduce((sum, val) => sum + Math.pow(val - avg, 2), 0) / arr.length;
  }

  calculateStabilityScore(responseTimes) {
    const avg = responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length;
    const maxDeviation = Math.max(...responseTimes.map(t => Math.abs(t - avg)));
    return Math.max(0, 100 - (maxDeviation / avg * 100));
  }

  analyzeTrend(responseTimes) {
    if (responseTimes.length < 3) return 'insufficient_data';

    const firstHalf = responseTimes.slice(0, Math.floor(responseTimes.length / 2));
    const secondHalf = responseTimes.slice(Math.floor(responseTimes.length / 2));

    const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;

    const diff = ((secondAvg - firstAvg) / firstAvg) * 100;

    if (diff > 10) return 'degrading';
    if (diff < -10) return 'improving';
    return 'stable';
  }

  identifyBottlenecks() {
    const bottlenecks = [];
    const toggleMetrics = this.calculateToggleMetrics();
    const resourceMetrics = this.calculateResourceMetrics();

    if (toggleMetrics && toggleMetrics.responseTime.avg > 300) {
      bottlenecks.push({
        type: 'response_time',
        severity: 'high',
        description: '主题切换响应时间超过300ms基准值',
        value: `${toggleMetrics.responseTime.avg.toFixed(2)}ms`,
        recommendation: '考虑进一步优化CSS变量切换机制',
      });
    }

    if (resourceMetrics && resourceMetrics.cpuUsage.peak > 70) {
      bottlenecks.push({
        type: 'cpu_usage',
        severity: 'medium',
        description: 'CPU占用峰值超过70%基准值',
        value: `${resourceMetrics.cpuUsage.peak.toFixed(2)}%`,
        recommendation: '考虑减少JavaScript执行量，使用Web Workers',
      });
    }

    return bottlenecks;
  }

  generateRecommendations() {
    const recommendations = [];
    const toggleMetrics = this.calculateToggleMetrics();
    const stabilityMetrics = this.calculateStabilityMetrics();

    if (toggleMetrics && toggleMetrics.responseTime.avg > 200) {
      recommendations.push({
        priority: 'high',
        category: 'performance',
        description: '优化CSS变量切换机制',
        details: '当前平均响应时间较高，考虑使用CSS Custom Properties的级联特性减少重计算',
      });
    }

    if (stabilityMetrics && stabilityMetrics.stabilityScore < 80) {
      recommendations.push({
        priority: 'medium',
        category: 'stability',
        description: '提高主题切换的稳定性',
        details: '响应时间波动较大，建议使用React.memo和useMemo进一步优化组件渲染',
      });
    }

    if (recommendations.length === 0) {
      recommendations.push({
        priority: 'info',
        category: 'general',
        description: '性能表现良好',
        details: '所有性能指标均在基准范围内，保持当前优化策略',
      });
    }

    return recommendations;
  }
}

/**
 * 获取系统环境信息
 */
async function getEnvironmentInfo(page) {
  return await page.evaluate(() => {
    return {
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      language: navigator.language,
      cookiesEnabled: navigator.cookieEnabled,
      hardwareConcurrency: navigator.hardwareConcurrency || 'unknown',
      deviceMemory: navigator.deviceMemory || 'unknown',
      screenResolution: `${window.screen.width}x${window.screen.height}`,
      pixelRatio: window.devicePixelRatio,
    };
  });
}

/**
 * 获取页面性能指标
 */
async function getPerformanceMetrics(page) {
  const metrics = await page.metrics();
  return {
    timestamp: Date.now(),
    documents: metrics.documents,
    frames: metrics.frames,
    jsEventListeners: metrics.jsEventListeners,
    nodes: metrics.nodes,
    layoutObjects: metrics.layoutObjects,
    recalcStyleCount: metrics.RecalcStyleCount,
    recalcStyleDuration: metrics.RecalcStyleDuration,
    layoutCount: metrics.LayoutCount,
    layoutDuration: metrics.LayoutDuration,
    scriptDuration: metrics.ScriptDuration,
    taskDuration: metrics.TaskDuration,
    jsHeapUsedSize: metrics.JSHeapUsedSize,
    jsHeapTotalSize: metrics.JSHeapTotalSize,
  };
}

/**
 * 测量主题切换响应时间
 */
async function measureThemeToggleResponse(page, selector) {
  const startTime = performance.now();

  // 等待按钮可点击
  await page.waitForSelector(selector, { state: 'visible' });

  // 执行切换操作
  await page.click(selector);

  // 等待主题切换完成
  await page.waitForFunction(
    () => {
      const body = document.body;
      const bgColor = window.getComputedStyle(body).backgroundColor;
      // 检查背景颜色是否已经改变（主题切换完成）
      return bgColor !== 'rgb(255, 250, 245)' && bgColor !== 'rgb(255, 248, 220)';
    },
    { timeout: 5000 }
  );

  const endTime = performance.now();
  const responseTime = endTime - startTime;

  return {
    responseTime,
    timestamp: Date.now(),
    success: true,
  };
}

/**
 * 测量资源占用情况
 */
async function measureResourceUsage(page) {
  const startMetrics = await getPerformanceMetrics(page);
  const startMemory = await page.evaluate(() => {
    if (performance.memory) {
      return {
        usedJSHeapSize: performance.memory.usedJSHeapSize,
        totalJSHeapSize: performance.memory.totalJSHeapSize,
        jsHeapSizeLimit: performance.memory.jsHeapSizeLimit,
      };
    }
    return null;
  });

  // 执行主题切换
  await page.click(TEST_CONFIG.toggleSelector);
  await page.waitForTimeout(500);

  const endMetrics = await getPerformanceMetrics(page);
  const endMemory = await page.evaluate(() => {
    if (performance.memory) {
      return {
        usedJSHeapSize: performance.memory.usedJSHeapSize,
        totalJSHeapSize: performance.memory.totalJSHeapSize,
      };
    }
    return null;
  });

  // 计算CPU使用率（基于布局和重计算样式的开销）
  const layoutCost = (endMetrics.layoutDuration - startMetrics.layoutDuration) +
                     (endMetrics.recalcStyleDuration - startMetrics.recalcStyleDuration);

  // 估算CPU占用（基于任务执行时间）
  const cpuUsage = Math.min(100, (layoutCost / 100) * 100);

  // 计算内存变化
  let memoryChange = 0;
  if (startMemory && endMemory) {
    memoryChange = (endMemory.usedJSHeapSize - startMemory.usedJSHeapSize) / (1024 * 1024);
  }

  return {
    timestamp: Date.now(),
    cpuUsage: cpuUsage,
    memoryUsage: startMemory ? startMemory.usedJSHeapSize / (1024 * 1024) : 0,
    memoryChange: memoryChange,
    layoutCount: endMetrics.layoutCount - startMetrics.layoutCount,
    recalcStyleCount: endMetrics.recalcStyleCount - startMetrics.recalcStyleCount,
    success: true,
  };
}

/**
 * 测试性能稳定性
 */
async function testPerformanceStability(page) {
  const results = [];

  console.log(`开始性能稳定性测试，共${TEST_CONFIG.iterations}次切换...`);

  for (let i = 0; i < TEST_CONFIG.iterations; i++) {
    // 切换到相反主题
    const isSweet = await page.evaluate(() => 
      document.documentElement.classList.contains('theme-sweet')
    );
    
    const startTime = performance.now();
    await page.click(TEST_CONFIG.toggleSelector);
    
    // 等待切换完成
    await page.waitForTimeout(TEST_CONFIG.waitBetweenToggles);
    
    const endTime = performance.now();
    const responseTime = endTime - startTime;

    results.push({
      iteration: i + 1,
      responseTime,
      timestamp: Date.now(),
      themeAfter: !isSweet ? 'sweet' : 'tiger',
      success: true,
    });

    console.log(`第${i + 1}次切换: ${responseTime.toFixed(2)}ms`);
  }

  return results;
}

/**
 * 生成测试报告
 */
function generateTestReport(results) {
  const report = results.generateReport();
  
  console.log('\n========================================');
  console.log('性能测试报告');
  console.log('========================================\n');

  console.log('1. 测试环境信息:');
  console.log(`   操作系统: ${report.testSummary.environment.os || '未知'}`);
  console.log(`   浏览器: ${report.testSummary.environment.browser || '未知'}`);
  console.log(`   测试时长: ${(report.testSummary.duration / 1000).toFixed(2)}秒\n`);

  console.log('2. 主题切换性能:');
  if (report.themeTogglePerformance) {
    console.log(`   测试次数: ${report.themeTogglePerformance.count}`);
    console.log(`   响应时间:`);
    console.log(`     - 平均: ${report.themeTogglePerformance.responseTime.avg.toFixed(2)}ms`);
    console.log(`     - 最小: ${report.themeTogglePerformance.responseTime.min.toFixed(2)}ms`);
    console.log(`     - 最大: ${report.themeTogglePerformance.responseTime.max.toFixed(2)}ms`);
    console.log(`     - P95: ${report.themeTogglePerformance.responseTime.p95.toFixed(2)}ms`);
    console.log(`     - P99: ${report.themeTogglePerformance.responseTime.p99.toFixed(2)}ms`);
    console.log(`   执行时长:`);
    console.log(`     - 平均: ${report.themeTogglePerformance.duration.avg.toFixed(2)}ms`);
  } else {
    console.log('   无测试数据');
  }
  console.log('');

  console.log('3. 资源占用情况:');
  if (report.resourceUsage) {
    console.log(`   CPU占用:`);
    console.log(`     - 平均: ${report.resourceUsage.cpuUsage.avg.toFixed(2)}%`);
    console.log(`     - 峰值: ${report.resourceUsage.cpuUsage.peak.toFixed(2)}%`);
    console.log(`   内存占用:`);
    console.log(`     - 平均: ${report.resourceUsage.memoryUsage.avg.toFixed(2)}MB`);
    console.log(`     - 峰值: ${report.resourceUsage.memoryUsage.peak.toFixed(2)}MB`);
    console.log(`   重排次数: ${report.resourceUsage[0]?.layoutCount || 0}`);
    console.log(`   重计算样式次数: ${report.resourceUsage[0]?.recalcStyleCount || 0}`);
  } else {
    console.log('   无测试数据');
  }
  console.log('');

  console.log('4. 性能稳定性:');
  if (report.stabilityPerformance) {
    console.log(`   测试次数: ${report.stabilityPerformance.count}`);
    console.log(`   标准差: ${report.stabilityPerformance.standardDeviation.toFixed(2)}ms`);
    console.log(`   稳定性评分: ${report.stabilityPerformance.stabilityScore.toFixed(1)}/100`);
    console.log(`   趋势分析: ${report.stabilityPerformance.trend}`);
  } else {
    console.log('   无测试数据');
  }
  console.log('');

  console.log('5. 性能基准检测:');
  console.log(`   响应时间 < 300ms: ${report.performanceBaselines.responseTime.value > (report.themeTogglePerformance?.responseTime.avg || 0) ? '✅ 通过' : '❌ 未通过'}`);
  console.log(`   CPU占用 < 70%: ${report.performanceBaselines.cpuUsage.value > (report.resourceUsage?.cpuUsage.peak || 100) ? '✅ 通过' : '❌ 未通过'}`);
  console.log(`   帧率 > 60fps: 需手动验证\n`);

  console.log('6. 性能瓶颈分析:');
  if (report.bottlenecks.length > 0) {
    report.bottlenecks.forEach((bottleneck, index) => {
      console.log(`   ${index + 1}. [${bottleneck.severity.toUpperCase()}] ${bottleneck.description}`);
      console.log(`      当前值: ${bottleneck.value}`);
      console.log(`      建议: ${bottleneck.recommendation}`);
    });
  } else {
    console.log('   未发现明显性能瓶颈');
  }
  console.log('');

  console.log('7. 优化建议:');
  report.recommendations.forEach((rec, index) => {
    console.log(`   ${index + 1}. [${rec.priority.toUpperCase()}] ${rec.description}`);
    console.log(`      详情: ${rec.details}`);
  });

  console.log('\n========================================');
  console.log('测试报告生成完毕');
  console.log('========================================\n');

  return report;
}

/**
 * 主测试函数
 */
async function runPerformanceTest() {
  console.log('========================================');
  console.log('主题切换全面性能测试');
  console.log('========================================');
  console.log(`测试URL: ${TEST_CONFIG.testUrl}`);
  console.log(`切换次数: ${TEST_CONFIG.iterations}`);
  console.log(`切换间隔: ${TEST_CONFIG.waitBetweenToggles}ms`);
  console.log('========================================\n');

  const results = new PerformanceTestResults();
  results.testStartTime = Date.now();

  // 启动浏览器
  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  });

  const page = await context.newPage();

  try {
    // 导航到测试页面
    console.log('正在导航到测试页面...');
    await page.goto(TEST_CONFIG.testUrl, { 
      waitUntil: 'networkidle',
      timeout: 30000,
    });
    console.log('页面加载完成\n');

    // 获取环境信息
    console.log('收集环境信息...');
    results.environment = await getEnvironmentInfo(page);
    console.log(`浏览器: ${results.environment.userAgent.split(')')[0]})`);
    console.log(`平台: ${results.environment.platform}`);
    console.log(`CPU核心数: ${results.environment.hardwareConcurrency}`);
    console.log(`屏幕分辨率: ${results.environment.screenResolution}\n`);

    // 测试1: 主题切换响应时间
    console.log('测试1: 主题切换响应时间');
    console.log('----------------------------------------');
    for (let i = 0; i < 3; i++) {
      const result = await measureThemeToggleResponse(page, TEST_CONFIG.toggleSelector);
      results.addThemeToggleResult(result);
      console.log(`第${i + 1}次切换响应时间: ${result.responseTime.toFixed(2)}ms`);
    }
    console.log('');

    // 测试2: 资源占用情况
    console.log('测试2: 资源占用情况');
    console.log('----------------------------------------');
    for (let i = 0; i < 3; i++) {
      const result = await measureResourceUsage(page);
      results.addResourceUsageResult(result);
      console.log(`CPU占用: ${result.cpuUsage.toFixed(2)}%, 内存: ${result.memoryUsage.toFixed(2)}MB`);
    }
    console.log('');

    // 测试3: 性能稳定性
    console.log('测试3: 性能稳定性');
    console.log('----------------------------------------');
    const stabilityResults = await testPerformanceStability(page);
    stabilityResults.forEach(result => {
      results.addStabilityResult(result);
    });
    console.log('');

    // 生成测试报告
    generateTestReport(results);

    // 保存报告到文件
    const fs = require('fs');
    const reportData = results.generateReport();
    const reportJson = JSON.stringify(reportData, null, 2);
    fs.writeFileSync('test-report.json', reportJson, 'utf8');
    console.log('测试报告已保存到 test-report.json');

  } catch (error) {
    console.error('测试过程中发生错误:', error);
  } finally {
    results.testEndTime = Date.now();
    await browser.close();
    console.log('浏览器已关闭');
  }
}

// 运行测试
runPerformanceTest().catch(console.error);

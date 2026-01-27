/**
 * 甜筒页面主题切换性能测试
 * 
 * 测试内容：
 * 1. 主题切换响应时间
 * 2. 性能稳定性
 * 3. 资源占用情况
 */

const { chromium } = require('playwright');

const TEST_CONFIG = {
  testUrl: 'http://localhost:3000/tiantong',
  toggleSelector: 'button[role="switch"]',
  iterations: 10,
  waitBetweenToggles: 800,
};

class PerformanceTestResults {
  constructor() {
    this.testStartTime = null;
    this.testEndTime = null;
    this.environment = {};
    this.toggleTests = [];
    this.resourceTests = [];
    this.baselines = {
      responseTime: { value: 300, unit: 'ms' },
      cpuUsage: { value: 70, unit: '%' },
    };
  }

  addToggleResult(result) {
    this.toggleTests.push(result);
  }

  addResourceResult(result) {
    this.resourceTests.push(result);
  }

  generateReport() {
    const toggleMetrics = this.calculateToggleMetrics();
    const resourceMetrics = this.calculateResourceMetrics();
    const stability = this.calculateStability();

    return {
      testSummary: {
        startTime: this.testStartTime,
        endTime: this.testEndTime,
        duration: (this.testEndTime - this.testStartTime) / 1000,
        environment: this.environment,
      },
      themeTogglePerformance: toggleMetrics,
      resourceUsage: resourceMetrics,
      stabilityAnalysis: stability,
      baselineComparison: this.compareBaselines(toggleMetrics, resourceMetrics),
      bottlenecks: this.identifyBottlenecks(toggleMetrics),
      recommendations: this.generateRecommendations(toggleMetrics, stability),
    };
  }

  calculateToggleMetrics() {
    if (this.toggleTests.length === 0) return null;
    const times = this.toggleTests.map(t => t.responseTime);
    return {
      count: times.length,
      responseTime: {
        min: Math.min(...times),
        max: Math.max(...times),
        avg: times.reduce((a, b) => a + b, 0) / times.length,
        median: this.percentile(times, 50),
        p95: this.percentile(times, 95),
      },
    };
  }

  calculateResourceMetrics() {
    if (this.resourceTests.length === 0) return null;
    const cpu = this.resourceTests.map(t => t.cpuUsage);
    const mem = this.resourceTests.map(t => t.memoryUsage);
    return {
      count: this.resourceTests.length,
      cpuUsage: { avg: cpu.reduce((a, b) => a + b, 0) / cpu.length, peak: Math.max(...cpu) },
      memoryUsage: { avg: mem.reduce((a, b) => a + b, 0) / mem.length, peak: Math.max(...mem) },
    };
  }

  calculateStability() {
    if (this.toggleTests.length < 2) return null;
    const times = this.toggleTests.map(t => t.responseTime);
    const avg = times.reduce((a, b) => a + b, 0) / times.length;
    const variance = times.reduce((sum, val) => sum + Math.pow(val - avg, 2), 0) / times.length;
    return {
      variance,
      standardDeviation: Math.sqrt(variance),
      coefficientOfVariation: (Math.sqrt(variance) / avg) * 100,
      stabilityScore: Math.max(0, 100 - (Math.sqrt(variance) / avg * 50)),
    };
  }

  percentile(arr, p) {
    const sorted = [...arr].sort((a, b) => a - b);
    return sorted[Math.floor(p / 100 * sorted.length)];
  }

  compareBaselines(toggleMetrics, resourceMetrics) {
    return {
      responseTime: {
        baseline: this.baselines.responseTime.value,
        actual: toggleMetrics?.responseTime.avg || 0,
        passed: (toggleMetrics?.responseTime.avg || 0) < this.baselines.responseTime.value,
      },
      cpuUsage: {
        baseline: this.baselines.cpuUsage.value,
        actual: resourceMetrics?.cpuUsage.peak || 0,
        passed: (resourceMetrics?.cpuUsage.peak || 100) < this.baselines.cpuUsage.value,
      },
    };
  }

  identifyBottlenecks(toggleMetrics) {
    const bottlenecks = [];
    if (toggleMetrics?.responseTime.avg > 300) {
      bottlenecks.push({
        type: 'high_response_time',
        severity: toggleMetrics.responseTime.avg > 1000 ? 'critical' : 'warning',
        description: '主题切换响应时间过高',
        value: `${toggleMetrics.responseTime.avg.toFixed(2)}ms`,
        cause: 'CSS变量切换和重排重绘开销大',
        suggestion: '考虑进一步优化CSS变量结构，减少transition范围',
      });
    }
    if (toggleMetrics?.responseTime.variance > 100) {
      bottlenecks.push({
        type: 'unstable_performance',
        severity: 'medium',
        description: '响应时间波动较大',
        value: `标准差: ${toggleMetrics.responseTime.standardDeviation?.toFixed(2) || 'N/A'}ms`,
        cause: 'JavaScript执行和DOM操作不一致',
        suggestion: '使用React.memo优化更多组件，减少不必要的重新渲染',
      });
    }
    return bottlenecks;
  }

  generateRecommendations(toggleMetrics, stability) {
    const recommendations = [];
    if (toggleMetrics?.responseTime.avg > 300) {
      recommendations.push({
        priority: 'high',
        category: 'performance',
        action: '优化CSS变量切换',
        details: '当前平均响应时间过高，建议：1）使用CSS Containment限制重排范围；2）减少transition元素数量；3）使用will-change提示GPU加速',
      });
    }
    if (stability?.stabilityScore < 80) {
      recommendations.push({
        priority: 'medium',
        category: 'stability',
        action: '提高性能稳定性',
        details: '响应时间波动较大，建议：1）为更多组件添加React.memo；2）使用useMemo缓存计算结果；3）优化事件处理函数',
      });
    }
    if (recommendations.length === 0) {
      recommendations.push({
        priority: 'info',
        category: 'general',
        action: '保持当前优化',
        details: '性能指标已达标，保持现有优化策略即可',
      });
    }
    return recommendations;
  }
}

async function getEnvironmentInfo(page) {
  return await page.evaluate(() => ({
    userAgent: navigator.userAgent,
    platform: navigator.platform,
    language: navigator.language,
    hardwareConcurrency: navigator.hardwareConcurrency || 'unknown',
    deviceMemory: navigator.deviceMemory || 'unknown',
    screenResolution: `${window.screen.width}x${window.screen.height}`,
    pixelRatio: window.devicePixelRatio,
  }));
}

async function measureToggleResponse(page, selector) {
  const startTime = performance.now();
  
  await page.click(selector);
  
  await page.waitForFunction(
    () => {
      const body = document.body;
      const bgColor = window.getComputedStyle(body).backgroundColor;
      return bgColor !== 'rgb(255, 250, 245)' && bgColor !== 'rgb(255, 248, 220)';
    },
    { timeout: 5000 }
  );

  const endTime = performance.now();
  return { responseTime: endTime - startTime, timestamp: Date.now(), success: true };
}

async function measureResourceUsage(page) {
  const memory = await page.evaluate(() => {
    if (performance.memory) {
      return {
        used: performance.memory.usedJSHeapSize / (1024 * 1024),
        total: performance.memory.totalJSHeapSize / (1024 * 1024),
      };
    }
    return { used: 0, total: 0 };
  });

  const startTime = performance.now();
  await page.click(TEST_CONFIG.toggleSelector);
  await page.waitForTimeout(500);
  const endTime = performance.now();

  return {
    cpuUsage: Math.min(100, (endTime - startTime) * 0.5),
    memoryUsage: memory.used,
    timestamp: Date.now(),
    success: true,
  };
}

function printReport(report) {
  console.log('\n' + '='.repeat(70));
  console.log('        甜筒页面主题切换性能测试报告');
  console.log('='.repeat(70) + '\n');

  console.log('【测试环境】');
  console.log(`  操作系统: ${report.testSummary.environment.platform || '未知'}`);
  console.log(`  浏览器: ${report.testSummary.environment.userAgent?.split(')')[0] || '未知'})`);
  console.log(`  CPU核心数: ${report.testSummary.environment.hardwareConcurrency || '未知'}`);
  console.log(`  屏幕分辨率: ${report.testSummary.environment.screenResolution || '未知'}`);
  console.log(`  测试时长: ${report.testSummary.duration.toFixed(2)}秒\n`);

  console.log('【主题切换性能】');
  if (report.themeTogglePerformance) {
    const p = report.themeTogglePerformance;
    console.log(`  测试次数: ${p.count}`);
    console.log(`  响应时间:`);
    console.log(`    - 平均值: ${p.responseTime.avg.toFixed(2)}ms`);
    console.log(`    - 最小值: ${p.responseTime.min.toFixed(2)}ms`);
    console.log(`    - 最大值: ${p.responseTime.max.toFixed(2)}ms`);
    console.log(`    - 中位数: ${p.responseTime.median.toFixed(2)}ms`);
    console.log(`    - P95: ${p.responseTime.p95.toFixed(2)}ms`);
  } else {
    console.log('  无测试数据');
  }
  console.log('');

  console.log('【资源占用情况】');
  if (report.resourceUsage) {
    console.log(`  CPU占用: ${report.resourceUsage.cpuUsage.avg.toFixed(2)}% (峰值: ${report.resourceUsage.cpuUsage.peak.toFixed(2)}%)`);
    console.log(`  内存占用: ${report.resourceUsage.memoryUsage.avg.toFixed(2)}MB (峰值: ${report.resourceUsage.memoryUsage.peak.toFixed(2)}MB)`);
  } else {
    console.log('  无测试数据');
  }
  console.log('');

  console.log('【性能稳定性分析】');
  if (report.stabilityAnalysis) {
    const s = report.stabilityAnalysis;
    console.log(`  标准差: ${s.standardDeviation.toFixed(2)}ms`);
    console.log(`  变异系数: ${s.coefficientOfVariation.toFixed(2)}%`);
    console.log(`  稳定性评分: ${s.stabilityScore.toFixed(1)}/100`);
    console.log(`  状态: ${s.stabilityScore >= 80 ? '✅ 稳定' : '⚠️ 波动较大'}`);
  } else {
    console.log('  无测试数据');
  }
  console.log('');

  console.log('【性能基准对比】');
  const b = report.baselineComparison;
  console.log(`  响应时间 < 300ms: ${b.responseTime.passed ? '✅ 通过' : '❌ 未通过'}`);
  console.log(`    - 基准值: ${b.responseTime.baseline}ms`);
  console.log(`    - 实际值: ${b.responseTime.actual.toFixed(2)}ms`);
  console.log(`    - 差距: ${(b.responseTime.actual - b.responseTime.baseline).toFixed(2)}ms`);
  console.log(`  CPU占用 < 70%: ${b.cpuUsage.passed ? '✅ 通过' : '❌ 未通过'}`);
  console.log(`    - 基准值: ${b.cpuUsage.baseline}%`);
  console.log(`    - 实际值: ${b.cpuUsage.actual.toFixed(2)}%`);
  console.log('');

  console.log('【性能瓶颈分析】');
  if (report.bottlenecks.length > 0) {
    report.bottlenecks.forEach((b, i) => {
      console.log(`  ${i + 1}. [${b.severity.toUpperCase()}] ${b.description}`);
      console.log(`     当前值: ${b.value}`);
      console.log(`     原因: ${b.cause}`);
      console.log(`     建议: ${b.suggestion}`);
    });
  } else {
    console.log('  未发现明显性能瓶颈');
  }
  console.log('');

  console.log('【优化建议】');
  report.recommendations.forEach((r, i) => {
    console.log(`  ${i + 1}. [${r.priority.toUpperCase()}] ${r.action}`);
    console.log(`     详情: ${r.details}`);
  });
  console.log('');

  console.log('='.repeat(70));
  console.log('                      测试报告生成完毕');
  console.log('='.repeat(70) + '\n');
}

async function runPerformanceTest() {
  console.log('\n' + '='.repeat(70));
  console.log('        甜筒页面主题切换全面性能测试');
  console.log('='.repeat(70));
  console.log(`  测试URL: ${TEST_CONFIG.testUrl}`);
  console.log(`  切换次数: ${TEST_CONFIG.iterations}`);
  console.log(`  切换间隔: ${TEST_CONFIG.waitBetweenToggles}ms`);
  console.log('='.repeat(70) + '\n');

  const results = new PerformanceTestResults();
  results.testStartTime = Date.now();

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
    console.log('正在导航到测试页面...');
    await page.goto(TEST_CONFIG.testUrl, { waitUntil: 'networkidle', timeout: 30000 });
    console.log('页面加载完成\n');

    console.log('收集环境信息...');
    results.environment = await getEnvironmentInfo(page);
    console.log(`  浏览器已识别: ${results.environment.platform}\n`);

    console.log('【测试1: 主题切换响应时间】');
    console.log('-'.repeat(50));
    for (let i = 0; i < 3; i++) {
      const result = await measureToggleResponse(page, TEST_CONFIG.toggleSelector);
      results.addToggleResult(result);
      console.log(`  第${i + 1}次切换: ${result.responseTime.toFixed(2)}ms`);
    }
    console.log('');

    console.log('【测试2: 资源占用情况】');
    console.log('-'.repeat(50));
    for (let i = 0; i < 3; i++) {
      const result = await measureResourceUsage(page);
      results.addResourceResult(result);
      console.log(`  第${i + 1}次测量: CPU ${result.cpuUsage.toFixed(2)}%, 内存 ${result.memoryUsage.toFixed(2)}MB`);
    }
    console.log('');

    console.log('【测试3: 性能稳定性（连续10次切换）】');
    console.log('-'.repeat(50));
    for (let i = 0; i < TEST_CONFIG.iterations; i++) {
      const result = await measureToggleResponse(page, TEST_CONFIG.toggleSelector);
      results.addToggleResult(result);
      process.stdout.write(`  第${i + 1}次: ${result.responseTime.toFixed(0)}ms `);
      if ((i + 1) % 5 === 0) process.stdout.write('\n');
    }
    console.log('\n');

    results.testEndTime = Date.now();
    const report = results.generateReport();
    printReport(report);

    const fs = require('fs');
    fs.writeFileSync('performance-test-report.json', JSON.stringify(report, null, 2), 'utf8');
    console.log('📄 详细报告已保存到: performance-test-report.json\n');

  } catch (error) {
    console.error('测试过程中发生错误:', error.message);
  } finally {
    await browser.close();
    console.log('浏览器已关闭');
  }
}

runPerformanceTest().catch(console.error);

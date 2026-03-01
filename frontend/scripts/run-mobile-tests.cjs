#!/usr/bin/env node

/**
 * 移动端测试执行脚本
 * 执行Playwright移动端测试并生成详细报告
 */

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

// 配置（默认使用冒烟测试配置以加快执行速度）
const CONFIG = {
  // 可以通过环境变量 MOBILE_TEST_TYPE=full 切换到完整测试
  configFile: process.env.MOBILE_TEST_TYPE === "full" 
    ? "playwright.mobile.config.ts" 
    : "playwright.mobile-smoke.config.ts",
  reportDir: "playwright-report/mobile",
  screenshotsDir: "playwright-report/mobile/screenshots",
};

/**
 * 创建目录
 * @param dir - 目录路径
 */
function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`✓ 创建目录: ${dir}`);
  }
}

/**
 * 执行命令
 * @param command - 命令
 * @param options - 选项
 */
function runCommand(command, options = {}) {
  console.log(`\n> ${command}\n`);
  try {
    execSync(command, {
      stdio: "inherit",
      ...options,
    });
    return true;
  } catch (error) {
    console.error(`✗ 命令执行失败: ${command}`);
    return false;
  }
}

/**
 * 生成测试报告摘要
 */
function generateReportSummary() {
  console.log("\n📊 生成测试报告摘要...\n");

  const reportPath = path.join(CONFIG.reportDir, "mobile-results.json");

  if (!fs.existsSync(reportPath)) {
    console.log("⚠️ 测试结果文件不存在");
    return;
  }

  try {
    const results = JSON.parse(fs.readFileSync(reportPath, "utf-8"));

    // 统计测试结果
    const stats = {
      total: 0,
      passed: 0,
      failed: 0,
      skipped: 0,
      duration: 0,
    };

    results.suites?.forEach((suite) => {
      suite.specs?.forEach((spec) => {
        spec.tests?.forEach((test) => {
          stats.total++;
          stats.duration += test.results?.[0]?.duration || 0;

          const status = test.results?.[0]?.status;
          if (status === "passed") stats.passed++;
          else if (status === "failed") stats.failed++;
          else if (status === "skipped") stats.skipped++;
        });
      });
    });

    // 输出统计信息
    console.log("=".repeat(60));
    console.log("📱 移动端测试报告摘要");
    console.log("=".repeat(60));
    console.log(`\n总测试数: ${stats.total}`);
    console.log(`✅ 通过: ${stats.passed}`);
    console.log(`❌ 失败: ${stats.failed}`);
    console.log(`⏭️ 跳过: ${stats.skipped}`);
    console.log(`\n⏱️ 总耗时: ${(stats.duration / 1000).toFixed(2)}秒`);
    console.log(`📈 通过率: ${((stats.passed / stats.total) * 100).toFixed(2)}%`);
    console.log("\n" + "=".repeat(60));

    // 生成Markdown报告
    generateMarkdownReport(stats, results);
  } catch (error) {
    console.error("生成报告摘要失败:", error.message);
  }
}

/**
 * 生成Markdown格式报告
 * @param stats - 统计数据
 * @param results - 测试结果
 */
function generateMarkdownReport(stats, results) {
  const reportPath = path.join(CONFIG.reportDir, "MOBILE_TEST_REPORT.md");

  const markdown = `# 📱 移动端测试报告

## 测试概览

| 指标 | 数值 |
|------|------|
| 总测试数 | ${stats.total} |
| ✅ 通过 | ${stats.passed} |
| ❌ 失败 | ${stats.failed} |
| ⏭️ 跳过 | ${stats.skipped} |
| ⏱️ 总耗时 | ${(stats.duration / 1000).toFixed(2)}秒 |
| 📈 通过率 | ${((stats.passed / stats.total) * 100).toFixed(2)}% |

## 测试环境

### 测试设备
${process.env.MOBILE_TEST_TYPE === "full" ? `
- iPhone 12 - Safari
- Pixel 7 - Chrome
- iPad Pro 11 - Safari` : `
- iPhone 12 - Safari (冒烟测试模式)`}

### 测试页面
- /lvjiang
- /tiantong
- /yuxiaoc

## 测试类型

### 1. 功能测试
- 导航与主题切换
- 弹幕抽屉交互
- 视频列表交互
- 搜索功能
- 页面滚动
- 触摸手势

### 2. 性能测试
- 页面加载性能 (FCP, LCP, CLS)
- 资源加载效率
- 运行时性能
- 缓存策略

### 3. 兼容性测试
- 浏览器特性支持
- 渲染一致性
- 设备适配
- 主题与颜色
- 输入与交互
- 网络与离线
- 无障碍支持
- 错误处理

### 4. 响应式布局测试
- 断点验证
- 移动端布局验证
- 平板端布局验证
- 桌面端布局验证
- 断点切换
- 元素可见性
- 截图对比

## 详细结果

### 通过测试
${stats.passed} 个测试通过

### 失败测试
${stats.failed} 个测试失败

### 跳过测试
${stats.skipped} 个测试跳过

## 优化建议

### 性能优化
1. 优化图片加载，使用WebP格式
2. 减少JavaScript文件数量和大小
3. 启用资源压缩和缓存
4. 优化关键渲染路径

### 兼容性优化
1. 确保所有浏览器支持必要的CSS特性
2. 测试不同设备上的触摸事件响应
3. 验证深色模式在各设备上的一致性

### 布局优化
1. 确保移动端触摸目标尺寸至少44x44px
2. 优化小屏幕设备上的文字可读性
3. 确保所有交互元素在移动设备上可访问

## 报告文件

- HTML报告: \`playwright-report/mobile/index.html\`
- JSON结果: \`playwright-report/mobile/mobile-results.json\`
- JUnit结果: \`playwright-report/mobile/mobile-results.xml\`
- 截图: \`playwright-report/mobile/screenshots/\`

---

*报告生成时间: ${new Date().toLocaleString()}*
`;

  fs.writeFileSync(reportPath, markdown);
  console.log(`✓ Markdown报告已生成: ${reportPath}`);
}

/**
 * 主函数
 */
async function main() {
  console.log("\n🚀 开始执行移动端测试\n");
  console.log("=".repeat(60));

  // 创建必要的目录
  ensureDir(CONFIG.reportDir);
  ensureDir(CONFIG.screenshotsDir);

  // 检查Playwright是否安装
  console.log("\n📦 检查Playwright安装...\n");
  if (!runCommand("npx playwright --version")) {
    console.error("✗ Playwright未安装，请先运行: npm install -D @playwright/test");
    process.exit(1);
  }

  // 显示测试模式
  const testMode = process.env.MOBILE_TEST_TYPE === "full" ? "完整测试" : "冒烟测试";
  console.log(`\n🧪 执行移动端${testMode}...\n`);
  console.log(`📋 配置文件: ${CONFIG.configFile}\n`);
  
  const testCommand = `npx playwright test --config=${CONFIG.configFile}`;
  const testSuccess = runCommand(testCommand);

  // 生成报告摘要
  generateReportSummary();

  // 显示报告位置
  console.log("\n📁 测试报告位置:\n");
  console.log(`  - HTML报告: ${path.resolve(CONFIG.reportDir, "index.html")}`);
  console.log(`  - Markdown报告: ${path.resolve(CONFIG.reportDir, "MOBILE_TEST_REPORT.md")}`);
  console.log(`  - 截图: ${path.resolve(CONFIG.screenshotsDir)}`);

  if (testSuccess) {
    console.log("\n✅ 所有测试执行完成\n");
    process.exit(0);
  } else {
    console.log("\n⚠️ 部分测试失败，请查看详细报告\n");
    process.exit(1);
  }
}

// 运行主函数
main().catch((error) => {
  console.error("执行测试时出错:", error);
  process.exit(1);
});

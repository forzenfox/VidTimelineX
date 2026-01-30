#!/usr/bin/env node

/**
 * MobileNotSupported 组件自动化测试脚本
 *
 * 功能：
 * - 自动执行测试用例
 * - 生成详细的测试报告
 * - 验证测试结果
 * - 支持覆盖率分析
 */

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

// 配置
const CONFIG = {
  testFile: "tests/unit/components/MobileNotSupported.test.tsx",
  outputDir: "test-reports",
  reportFile: "mobile-not-supported-test-report.html",
  jsonReportFile: "mobile-not-supported-test-report.json",
};

/**
 * 颜色工具类
 */
class ColorUtils {
  static reset = "\x1b[0m";
  static red = "\x1b[31m";
  static green = "\x1b[32m";
  static yellow = "\x1b[33m";
  static blue = "\x1b[34m";
  static magenta = "\x1b[35m";
  static cyan = "\x1b[36m";
}

/**
 * 日志工具类
 */
class Logger {
  static info(message) {
    console.log(`${ColorUtils.blue}[INFO]${ColorUtils.reset} ${message}`);
  }

  static success(message) {
    console.log(`${ColorUtils.green}[SUCCESS]${ColorUtils.reset} ${message}`);
  }

  static warning(message) {
    console.log(`${ColorUtils.yellow}[WARNING]${ColorUtils.reset} ${message}`);
  }

  static error(message) {
    console.log(`${ColorUtils.red}[ERROR]${ColorUtils.reset} ${message}`);
  }

  static test(message) {
    console.log(`${ColorUtils.cyan}[TEST]${ColorUtils.reset} ${message}`);
  }

  static result(message) {
    console.log(`${ColorUtils.magenta}[RESULT]${ColorUtils.reset} ${message}`);
  }
}

/**
 * 执行测试命令
 */
function runTest(testPattern = null) {
  Logger.info("开始执行 MobileNotSupported 组件测试...");

  try {
    let command = "npm test -- tests/unit/components/MobileNotSupported.test.tsx --json";

    if (testPattern) {
      command += ` -- --testNamePattern="${testPattern}"`;
    }

    const startTime = Date.now();
    const result = execSync(command, {
      stdio: "pipe",
      encoding: "utf-8",
      maxBuffer: 10 * 1024 * 1024,
    });
    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);

    Logger.success(`测试执行完成，耗时: ${duration}秒`);

    return {
      success: true,
      duration: parseFloat(duration),
      output: result,
      error: null,
    };
  } catch (error) {
    Logger.error(`测试执行失败: ${error.message}`);
    return {
      success: false,
      error: error.message,
      output: error.stdout || "",
    };
  }
}

/**
 * 解析测试结果
 */
function parseTestResults(output) {
  const results = {
    total: 0,
    passed: 0,
    failed: 0,
    skipped: 0,
    tests: [],
  };

  try {
    // Jest JSON 输出前面可能有进度信息，需要找到 JSON 开始的位置
    // Jest 的 JSON 输出通常以 {"numFailedTestSuites": 或 {"success": 开头
    const jsonPatterns = ['{"numFailedTestSuites":', '{"success":'];
    let jsonStartIndex = -1;
    
    for (const pattern of jsonPatterns) {
      const index = output.indexOf(pattern);
      if (index !== -1) {
        jsonStartIndex = index;
        break;
      }
    }
    
    if (jsonStartIndex === -1) {
      Logger.warning("无法找到 Jest JSON 输出");
      return results;
    }

    const jsonOutput = JSON.parse(output.substring(jsonStartIndex));

    if (jsonOutput.testResults && Array.isArray(jsonOutput.testResults)) {
      jsonOutput.testResults.forEach(suite => {
        if (suite.assertionResults && Array.isArray(suite.assertionResults)) {
          suite.assertionResults.forEach(test => {
            const testName = test.title;
            const tcMatch = testName.match(/^(TC-\d+):/);
            results.tests.push({
              id: tcMatch ? tcMatch[1] : "",
              name: testName,
              status: test.status === "passed" ? "passed" : test.status === "failed" ? "failed" : "skipped",
            });
            if (test.status === "passed") results.passed++;
            else if (test.status === "failed") results.failed++;
            else results.skipped++;
            results.total++;
          });
        }
      });
    } else if (jsonOutput.numTotalTests) {
      results.total = jsonOutput.numTotalTests || 0;
      results.passed = jsonOutput.numPassedTests || 0;
      results.failed = jsonOutput.numFailedTests || 0;
      results.skipped = jsonOutput.numPendingTests || 0;
    }

    return results;
  } catch (e) {
    Logger.warning(`测试结果解析失败: ${e.message}`);
    return results;
  }
}

/**
 * 生成 HTML 测试报告
 */
function generateHtmlReport(results, duration) {
  const html = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MobileNotSupported 组件测试报告</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: #333;
            line-height: 1.6;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 4px 6px rgba(0, 0, 0.1);
            margin-bottom: 30px;
        }
        .header h1 {
            margin: 0 0 20px 0;
            color: #667eea;
            font-size: 28px;
        }
        .summary {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }
        .summary-card {
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0.1);
        }
        .summary-card h3 {
            margin: 0 0 15px 0;
            color: #667eea;
            font-size: 18px;
        }
        .summary-card .number {
            font-size: 32px;
            font-weight: bold;
            color: #667eea;
        }
        .progress-bar {
            height: 20px;
            background: #e0e0e0;
            border-radius: 10px;
            overflow: hidden;
            margin-top: 15px;
        }
        .progress-bar-fill {
            height: 100%;
            background: linear-gradient(90deg, #667eea, #764ba2);
            transition: width 0.5s ease;
        }
        .test-list {
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0.1);
            overflow: hidden;
        }
        .test-item {
            padding: 15px 20px;
            border-bottom: 1px solid #e0e0e0;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        .test-item:last-child {
            border-bottom: none;
        }
        .test-item .status {
            padding: 5px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: bold;
            text-transform: uppercase;
        }
        .test-item .status.passed {
            background: #10b981;
            color: white;
        }
        .test-item .status.failed {
            background: #ef4444;
            color: white;
        }
        .test-item .status.skipped {
            background: #f59e0b;
            color: white;
        }
        .test-item .info {
            flex: 1;
        }
        .test-item .id {
            color: #666;
            font-size: 14px;
        }
        .test-item .name {
            flex: 1;
            font-weight: 500;
        }
        .footer {
            text-align: center;
            padding: 30px;
            color: white;
            font-size: 14px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📱 MobileNotSupported 组件测试报告</h1>
            <p style="color: #666; margin: 0;">生成时间: ${new Date().toLocaleString("zh-CN")}</p>
            <p style="color: #666;">测试执行时长: ${duration}秒</p>
        </div>

        <div class="summary">
            <div class="summary-card">
                <h3>总测试数</h3>
                <div class="number">${results.total}</div>
            </div>
            <div class="summary-card">
                <h3>通过</h3>
                <div class="number" style="color: #10b981;">${results.passed}</div>
            </div>
            <div class="summary-card">
                <h3>失败</h3>
                <div class="number" style="color: #ef4444;">${results.failed}</div>
            </div>
            <div class="summary-card">
                <h3>跳过</h3>
                <div class="number" style="color: #f59e0b;">${results.skipped}</div>
            </div>
            <div class="summary-card">
                <h3>通过率</h3>
                <div class="number">${((results.passed / results.total) * 100).toFixed(1)}%</div>
            </div>
        </div>

        <div class="progress-bar">
            <div class="progress-bar-fill" style="width: ${((results.passed / results.total) * 100).toFixed(1)}%;"></div>
        </div>

        <div class="test-list">
            ${results.tests
              .map(
                test => `
                <div class="test-item">
                    <div class="status ${test.status}">${test.status}</div>
                    <div class="info">
                        <div class="id">TC-${test.id}</div>
                        <div class="name">${test.name}</div>
                    </div>
                </div>
              `
              )
              .join("")}
        </div>

        <div class="footer">
            <p>© 2026 哔哩哔哩时间线 - MobileNotSupported 组件测试报告</p>
        </div>
    </div>
</body>
</html>
  `;

  return html;
}

/**
 * 生成 JSON 测试报告
 */
function generateJsonReport(results, duration) {
  const report = {
    timestamp: new Date().toISOString(),
    component: "MobileNotSupported",
    duration: duration,
    summary: {
      total: results.total,
      passed: results.passed,
      failed: results.failed,
      skipped: results.skipped,
      passRate: ((results.passed / results.total) * 100).toFixed(2),
    },
    tests: results.tests,
  };

  return JSON.stringify(report, null, 2);
}

/**
 * 创建输出目录
 */
function ensureOutputDir() {
  if (!fs.existsSync(CONFIG.outputDir)) {
    fs.mkdirSync(CONFIG.outputDir, { recursive: true });
    Logger.info(`创建输出目录: ${CONFIG.outputDir}`);
  }
}

/**
 * 主函数
 */
function main() {
  console.log("\n");
  console.log("╔══════════════════════════════════════════════════════════════╗");
  console.log("║     MobileNotSupported 组件自动化测试脚本                          ║");
  console.log("╚══════════════════════════════════════════════════════════════════╝");
  console.log("\n");

  // 创建输出目录
  ensureOutputDir();

  // 执行测试
  const testResult = runTest();

  if (!testResult.success) {
    Logger.error("测试执行失败，无法生成报告");
    process.exit(1);
  }

  // 解析测试结果
  const results = parseTestResults(testResult.output);

  // 生成报告
  Logger.info("生成测试报告...");

  const htmlReport = generateHtmlReport(results, testResult.duration);
  const jsonReport = generateJsonReport(results, testResult.duration);

  const htmlPath = path.join(CONFIG.outputDir, CONFIG.reportFile);
  const jsonPath = path.join(CONFIG.outputDir, CONFIG.jsonReportFile);

  fs.writeFileSync(htmlPath, htmlReport, "utf-8");
  fs.writeFileSync(jsonPath, jsonReport, "utf-8");

  Logger.success(`HTML 报告已生成: ${htmlPath}`);
  Logger.success(`JSON 报告已生成: ${jsonPath}`);

  // 输出测试摘要
  console.log("\n");
  console.log("╔════════════════════════════════════════════════════════════════╗");
  console.log("║                        测试摘要                                 ║");
  console.log("╠════════════════════════════════════════════════════════════╣");
  console.log(
    `║  总测试数: ${results.total.toString().padStart(4, " ")}                                    ║`
  );
  console.log(
    `║  通过: ${results.passed.toString().padStart(4, " ")}                                        ║`
  );
  console.log(
    `║  失败: ${results.failed.toString().padStart(4, " ")}                                        ║`
  );
  console.log(
    `║  跳过: ${results.skipped.toString().padStart(4, " ")}                                        ║`
  );
  console.log(
    `║  通过率: ${((results.passed / results.total) * 100).toFixed(1)}%${" ".repeat(8)}                          ║`
  );
  console.log(
    `║  执行时长: ${testResult.duration}秒${" ".repeat(8)}                                  ║`
  );
  console.log("╚══════════════════════════════════════════════════════════════════╝");
  console.log("\n");

  // 打开 HTML 报告
  const openCommand = process.platform === "win32" ? "start" : "open";
  Logger.info(`使用以下命令打开报告: ${openCommand} ${htmlPath}`);

  // 根据测试结果设置退出码
  process.exit(results.failed > 0 ? 1 : 0);
}

// 执行主函数
main();

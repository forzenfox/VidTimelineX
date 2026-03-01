import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright 移动端测试配置（优化版）
 * 用于测试移动端网页的功能、性能、兼容性和响应式布局
 *
 * 优化策略：
 * 1. 减少设备数量（保留代表性设备）
 * 2. 减少重试次数
 * 3. 禁用trace和视频以加快速度
 */
export default defineConfig({
  testDir: "./tests/mobile",
  /* 测试文件匹配模式 */
  testMatch: "**/*.mobile.spec.ts",
  /* 并行运行测试 */
  fullyParallel: true,
  /* CI环境下禁止test.only */
  forbidOnly: !!process.env.CI,
  /* 失败重试次数（减少为0以加快测试速度） */
  retries: 0,
  /* 工作进程数 */
  workers: process.env.CI ? 2 : 4,
  /* 测试报告配置 */
  reporter: [
    ["html", { outputFolder: "playwright-report/mobile", open: "never" }],
    ["json", { outputFile: "playwright-report/mobile-results.json" }],
    ["junit", { outputFile: "playwright-report/mobile-results.xml" }],
  ],
  /* 共享配置 */
  use: {
    /* 基础URL */
    baseURL: "http://localhost:3000",
    /* 收集trace信息（仅失败时） */
    trace: "retain-on-failure",
    /* 截图配置（仅失败时） */
    screenshot: "only-on-failure",
    /* 视频录制（禁用以加快速度） */
    video: "off",
    /* 动作超时 */
    actionTimeout: 10000,
    /* 导航超时 */
    navigationTimeout: 20000,
  },

  /* 移动端设备和浏览器配置（优化为3个代表性设备） */
  projects: [
    // iOS 手机 - Safari
    {
      name: "iPhone 12 - Safari",
      use: {
        ...devices["iPhone 12"],
        browserName: "webkit",
      },
    },
    // Android 手机 - Chrome
    {
      name: "Pixel 7 - Chrome",
      use: {
        ...devices["Pixel 7"],
        browserName: "chromium",
      },
    },
    // iOS 平板 - Safari
    {
      name: "iPad Pro 11 - Safari",
      use: {
        ...devices["iPad Pro 11"],
        browserName: "webkit",
      },
    },
  ],

  /* 开发服务器配置 */
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
});

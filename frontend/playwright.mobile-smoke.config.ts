import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright 移动端冒烟测试配置
 * 快速验证移动端核心功能
 */
export default defineConfig({
  testDir: "./tests/mobile",
  /* 只运行冒烟测试 */
  testMatch: "**/smoke.mobile.spec.ts",
  /* 并行运行测试 */
  fullyParallel: true,
  /* 不重试 */
  retries: 0,
  /* 工作进程数 */
  workers: 2,
  /* 测试报告配置 */
  reporter: [
    ["html", { outputFolder: "playwright-report/mobile-smoke" }],
    ["list"],
  ],
  /* 共享配置 */
  use: {
    baseURL: "http://localhost:3000",
    trace: "off",
    screenshot: "off",
    video: "off",
    actionTimeout: 10000,
    navigationTimeout: 20000,
  },
  /* 只测试一个代表性设备 */
  projects: [
    {
      name: "iPhone 12 - Safari",
      use: {
        ...devices["iPhone 12"],
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

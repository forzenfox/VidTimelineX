/**
 * 测试配置文件
 * 提供全局测试设置和Mock配置
 */

import "@testing-library/jest-dom";

// 全局测试超时时间
jest.setTimeout(10000);

// Mock window.matchMedia
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
  })),
});

// 清理函数
afterEach(() => {
  jest.clearAllMocks();
});

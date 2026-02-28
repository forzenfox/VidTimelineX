import React from "react";
import { render, screen } from "@testing-library/react";
import PerformanceMonitor from "@/components/PerformanceMonitor";

jest.mock("web-vitals", () => ({
  onCLS: jest.fn(),
  onINP: jest.fn(),
  onFCP: jest.fn(),
  onLCP: jest.fn(),
  onTTFB: jest.fn(),
}));

describe("PerformanceMonitor 组件测试", () => {
  const originalConsole = console;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    console.error = originalConsole.error;
  });

  test("TC-001: PerformanceMonitor 组件渲染测试", () => {
    render(<PerformanceMonitor />);
    expect(true).toBe(true);
  });

  test("TC-002: 性能指标监听函数被正确调用", async () => {
    const { onCLS, onINP, onFCP, onLCP, onTTFB } = await import("web-vitals");

    render(<PerformanceMonitor />);

    await new Promise(resolve => setTimeout(resolve, 100));

    expect(onCLS).toHaveBeenCalled();
    expect(onINP).toHaveBeenCalled();
    expect(onFCP).toHaveBeenCalled();
    expect(onLCP).toHaveBeenCalled();
    expect(onTTFB).toHaveBeenCalled();
  });
});

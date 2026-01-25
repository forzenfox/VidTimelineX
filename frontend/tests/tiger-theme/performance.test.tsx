/**
 * 性能测试用例
 * 对应测试用例 TC-017 ~ TC-019
 * 验证页面加载时间、动画帧率、主题切换时间等性能指标
 */

import React from "react";
import { render, screen, cleanup, act, fireEvent } from "@testing-library/react";
import ThemeToggle from "@/features/tiantong/components/ThemeToggle";
import "@testing-library/jest-dom";

describe("性能测试", () => {
  /**
   * 测试用例 TC-017: 页面加载时间
   * 测试组件渲染时间
   */
  test("TC-017: 页面加载时间", async () => {
    const onToggle = jest.fn();
    const startTime = performance.now();

    // 模拟页面渲染
    await act(async () => {
      render(<ThemeToggle currentTheme="tiger" onToggle={onToggle} />);
    });

    const endTime = performance.now();
    const renderTime = endTime - startTime;

    // 断言：渲染时间应该合理（这里使用1000ms作为参考）
    expect(renderTime).toBeLessThan(1000);

    // 记录测试结果
    console.log(`✅ TC-017: 页面加载时间测试通过，渲染时间: ${renderTime.toFixed(2)}ms`);
  });

  /**
   * 测试用例 TC-018: 动画帧率
   * 测试组件交互性能
   */
  test("TC-018: 动画帧率", async () => {
    const onToggle = jest.fn();
    const { container } = render(<ThemeToggle currentTheme="tiger" onToggle={onToggle} />);

    const button = screen.getByRole("switch");

    // 模拟多次交互
    const startTime = performance.now();

    for (let i = 0; i < 10; i++) {
      await act(async () => {
        fireEvent.mouseEnter(button);
        await new Promise(resolve => setTimeout(resolve, 10));
        fireEvent.mouseLeave(button);
      });
    }

    const endTime = performance.now();
    const totalTime = endTime - startTime;

    // 计算平均每次交互时间
    const avgTime = totalTime / 10;

    // 断言：平均交互时间应该合理
    expect(avgTime).toBeLessThan(100);

    // 记录测试结果
    console.log(`✅ TC-018: 动画帧率测试通过，平均交互时间: ${avgTime.toFixed(2)}ms`);
  });

  /**
   * 测试用例 TC-019: 主题切换时间
   * 测试主题切换响应时间
   */
  test("TC-019: 主题切换时间", async () => {
    const onToggle = jest.fn();
    const { container } = render(<ThemeToggle currentTheme="tiger" onToggle={onToggle} />);

    const button = screen.getByRole("switch");

    // 多次切换，取平均值
    const switchTimes = [];

    for (let i = 0; i < 5; i++) {
      const startTime = performance.now();

      await act(async () => {
        fireEvent.click(button);
        // 等待主题切换完成
        await new Promise(resolve => setTimeout(resolve, 50));
      });

      const endTime = performance.now();
      const switchTime = endTime - startTime;
      switchTimes.push(switchTime);

      // 等待一段时间再切换
      await new Promise(resolve => setTimeout(resolve, 50));
    }

    // 计算平均切换时间
    const avgSwitchTime = switchTimes.reduce((a, b) => a + b, 0) / switchTimes.length;

    // 断言：平均切换时间应该合理（这里使用500ms作为参考）
    expect(avgSwitchTime).toBeLessThan(500);

    // 记录测试结果
    console.log(`✅ TC-019: 主题切换时间测试通过，平均切换时间: ${avgSwitchTime.toFixed(2)}ms`);
  });

  afterEach(() => {
    cleanup();
  });
});

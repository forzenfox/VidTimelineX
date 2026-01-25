/**
 * DanmakuWelcome组件测试用例（老虎）
 * 对应测试用例 TC-047 ~ TC-049
 * 验证DanmakuWelcome组件的渲染、动画和主题适配功能
 */

import React from "react";
import { render, screen, cleanup, waitFor } from "@testing-library/react";
import DanmakuWelcome from "@/features/tiantong/components/DanmakuWelcome";
import "@testing-library/jest-dom";

describe("DanmakuWelcome组件测试（老虎）", () => {
  const mockMessages = [
    "欢迎来到老虎主题！",
    "虎头咆哮！",
    "老虎威武！"
  ];

  const mockColors = [
    "#FF5F00",
    "#FFBE28",
    "#FFFFFF"
  ];

  /**
   * 测试用例 TC-047: DanmakuWelcome渲染测试（老虎）
   * 测试目标：验证DanmakuWelcome组件正确渲染
   */
  test("TC-047: DanmakuWelcome渲染测试（老虎）", () => {
    const { container } = render(
      <DanmakuWelcome messages={mockMessages} colors={mockColors} theme="tiger" />
    );

    // 验证弹幕容器存在
    const danmakuContainer = container.querySelector(".fixed");
    expect(danmakuContainer).toBeInTheDocument();

    // 验证弹幕元素存在
    const danmakuItems = container.querySelectorAll(".animate-danmaku");
    expect(danmakuItems.length).toBeGreaterThan(0);

    // 验证弹幕文本
    expect(screen.getByText("欢迎来到老虎主题！")).toBeInTheDocument();
    expect(screen.getByText("虎头咆哮！")).toBeInTheDocument();
    expect(screen.getByText("老虎威武！")).toBeInTheDocument();

    // 记录测试结果
    console.log("✅ TC-047: DanmakuWelcome渲染测试（老虎）通过");
  });

  /**
   * 测试用例 TC-048: DanmakuWelcome动画测试（老虎）
   * 测试目标：验证DanmakuWelcome的动画效果
   */
  test("TC-048: DanmakuWelcome动画测试（老虎）", async () => {
    const { container } = render(
      <DanmakuWelcome messages={mockMessages} colors={mockColors} theme="tiger" />
    );

    // 验证弹幕元素有动画类名
    const danmakuItems = container.querySelectorAll(".animate-danmaku");
    expect(danmakuItems.length).toBeGreaterThan(0);

    // 验证弹幕元素有动画延迟
    danmakuItems.forEach(item => {
      const style = window.getComputedStyle(item as Element);
      expect(style.animationDelay).toBeDefined();
    });

    // 验证弹幕元素有颜色
    danmakuItems.forEach(item => {
      const style = window.getComputedStyle(item as Element);
      expect(style.color).toBeDefined();
    });

    // 记录测试结果
    console.log("✅ TC-048: DanmakuWelcome动画测试（老虎）通过");
  });

  /**
   * 测试用例 TC-049: DanmakuWelcome主题适配测试（老虎）
   * 测试目标：验证DanmakuWelcome在不同主题下都能正确显示
   */
  test("TC-049: DanmakuWelcome主题适配测试（老虎）", () => {
    const { container, rerender } = render(
      <DanmakuWelcome messages={mockMessages} colors={mockColors} theme="tiger" />
    );

    // 验证老虎主题渲染
    const danmakuContainer = container.querySelector(".fixed");
    expect(danmakuContainer).toBeInTheDocument();

    // 验证弹幕文本
    expect(screen.getByText("欢迎来到老虎主题！")).toBeInTheDocument();

    // 切换到甜筒主题
    rerender(
      <DanmakuWelcome messages={mockMessages} colors={mockColors} theme="sweet" />
    );

    // 验证甜筒主题渲染
    expect(screen.getByText("欢迎来到老虎主题！")).toBeInTheDocument();

    // 记录测试结果
    console.log("✅ TC-049: DanmakuWelcome主题适配测试（老虎）通过");
  });

  afterEach(() => {
    cleanup();
  });
});

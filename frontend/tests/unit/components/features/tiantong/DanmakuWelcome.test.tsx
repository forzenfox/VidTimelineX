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
  const mockMessages = ["欢迎来到老虎主题！", "虎头咆哮！", "老虎威武！"];
  const mockColors = ["#FF5F00", "#FFBE28", "#FFFFFF"];

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

    // 验证弹幕元素存在（使用内联样式，不是类名）
    const danmakuItems = container.querySelectorAll(".absolute.whitespace-nowrap.font-bold");
    expect(danmakuItems.length).toBeGreaterThan(0);

    // 验证弹幕文本（使用getAllByText因为同一个消息可能出现多次）
    const welcomeTexts = screen.getAllByText("欢迎来到老虎主题！");
    expect(welcomeTexts.length).toBeGreaterThan(0);

    const tigerTexts = screen.getAllByText("虎头咆哮！");
    expect(tigerTexts.length).toBeGreaterThan(0);

    const powerTexts = screen.getAllByText("老虎威武！");
    expect(powerTexts.length).toBeGreaterThan(0);
  });

  /**
   * 测试用例 TC-048: DanmakuWelcome动画测试（老虎）
   * 测试目标：验证DanmakuWelcome的动画效果
   */
  test("TC-048: DanmakuWelcome动画测试（老虎）", () => {
    const { container } = render(
      <DanmakuWelcome messages={mockMessages} colors={mockColors} theme="tiger" />
    );

    // 验证弹幕元素存在（使用内联样式，不是类名）
    const danmakuItems = container.querySelectorAll(".absolute.whitespace-nowrap.font-bold");
    expect(danmakuItems.length).toBeGreaterThan(0);

    // 验证弹幕元素有动画属性
    danmakuItems.forEach(item => {
      const style = window.getComputedStyle(item as Element);
      expect(style.animation).toBeDefined();
      expect(style.animation).toContain("danmaku-move");
    });

    // 验证弹幕元素有颜色
    danmakuItems.forEach(item => {
      const style = window.getComputedStyle(item as Element);
      expect(style.color).toBeDefined();
      expect(style.color).toMatch(/^rgb\(/);
    });
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

    // 验证弹幕文本（使用getAllByText因为同一个消息可能出现多次）
    const welcomeTexts = screen.getAllByText("欢迎来到老虎主题！");
    expect(welcomeTexts.length).toBeGreaterThan(0);

    // 切换到甜筒主题
    rerender(<DanmakuWelcome messages={mockMessages} colors={mockColors} theme="sweet" />);

    // 验证甜筒主题渲染（使用getAllByText因为同一个消息可能出现多次）
    const sweetTexts = screen.getAllByText("欢迎来到老虎主题！");
    expect(sweetTexts.length).toBeGreaterThan(0);
  });

  /**
   * 测试用例 TC-050: DanmakuWelcome自动隐藏测试
   * 测试目标：验证DanmakuWelcome在8秒后自动隐藏
   */
  test("TC-050: DanmakuWelcome自动隐藏测试", async () => {
    const { container } = render(
      <DanmakuWelcome messages={mockMessages} colors={mockColors} theme="tiger" />
    );

    // 验证弹幕容器初始存在
    const danmakuContainer = container.querySelector(".fixed");
    expect(danmakuContainer).toBeInTheDocument();

    // 等待8秒后，弹幕应该被隐藏
    await waitFor(
      () => {
        const hiddenContainer = container.querySelector(".fixed");
        expect(hiddenContainer).toBeNull();
      },
      { timeout: 9000 }
    );
  });

  /**
   * 测试用例 TC-051: DanmakuWelcome空消息测试
   * 测试目标：验证DanmakuWelcome在空消息时不渲染弹幕元素
   */
  test("TC-051: DanmakuWelcome空消息测试", () => {
    const { container } = render(
      <DanmakuWelcome messages={[]} colors={mockColors} theme="tiger" />
    );

    // 验证弹幕容器存在（但内部没有弹幕元素）
    const danmakuContainer = container.querySelector(".fixed");
    expect(danmakuContainer).toBeInTheDocument();

    // 验证弹幕元素不存在
    const danmakuItems = container.querySelectorAll(".absolute.whitespace-nowrap.font-bold");
    expect(danmakuItems.length).toBe(0);
  });

  /**
   * 测试用例 TC-052: DanmakuWelcome弹幕数量测试
   * 测试目标：验证DanmakuWelcome生成20个弹幕元素
   */
  test("TC-052: DanmakuWelcome弹幕数量测试", () => {
    const { container } = render(
      <DanmakuWelcome messages={mockMessages} colors={mockColors} theme="tiger" />
    );

    // 验证弹幕元素数量为20
    const danmakuItems = container.querySelectorAll(".absolute.whitespace-nowrap.font-bold");
    expect(danmakuItems.length).toBe(20);
  });

  /**
   * 测试用例 TC-053: DanmakuWelcome轨道系统测试
   * 测试目标：验证DanmakuWelcome使用8个固定轨道
   */
  test("TC-053: DanmakuWelcome轨道系统测试", () => {
    const { container } = render(
      <DanmakuWelcome messages={mockMessages} colors={mockColors} theme="tiger" />
    );

    // 验证弹幕元素分布在8个轨道上
    const danmakuItems = container.querySelectorAll(".absolute.whitespace-nowrap.font-bold");
    const trackPositions = new Set<number>();

    danmakuItems.forEach(item => {
      const style = (item as HTMLElement).style.top;
      const topValue = parseInt(style, 10);
      trackPositions.add(topValue);
    });

    // 验证有8个不同的轨道位置（10%, 20%, 30%, ..., 80%）
    expect(trackPositions.size).toBe(8);
  });

  afterEach(() => {
    cleanup();
  });
});

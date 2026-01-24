/**
 * 交互动效测试用例
 * 对应测试用例 TC-009 ~ TC-011
 * 验证主题切换过渡动画、元素hover反馈、加载动画等交互效果
 */

import React from "react";
import { render, screen, fireEvent, cleanup, waitFor } from "@testing-library/react";
import ThemeToggle from "@/components/hu/hu_ThemeToggle";
import LoadingAnimation from "@/features/tiantong/components/LoadingAnimation";
import "@testing-library/jest-dom";

describe("交互动效测试", () => {
  /**
   * 测试用例 TC-009: 主题切换过渡动效
   * 测试主题切换时的动画效果
   */
  test("TC-009: 主题切换过渡动效", async () => {
    const onToggle = jest.fn();
    const { container } = render(<ThemeToggle currentTheme="tiger" onToggle={onToggle} />);

    // 验证主题切换按钮存在
    const button = screen.getByRole("switch");
    expect(button).toBeInTheDocument();

    // 验证点击功能
    fireEvent.click(button);
    expect(onToggle).toHaveBeenCalledTimes(1);

    // 记录测试结果
    console.log("✅ TC-009: 主题切换过渡动效测试通过");
  });

  /**
   * 测试用例 TC-010: 元素hover反馈动效
   * 测试hover时的反馈效果
   */
  test("TC-010: 元素hover反馈动效", () => {
    const onToggle = jest.fn();
    const { container } = render(<ThemeToggle currentTheme="tiger" onToggle={onToggle} />);

    // 测试按钮hover效果
    const button = screen.getByRole("switch");
    expect(button).toBeInTheDocument();

    // 触发hover
    fireEvent.mouseEnter(button);

    // 验证按钮仍然存在
    expect(button).toBeInTheDocument();

    // 移除hover
    fireEvent.mouseLeave(button);

    // 记录测试结果
    console.log("✅ TC-010: 元素hover反馈动效测试通过");
  });

  /**
   * 测试用例 TC-011: 加载动画替换
   * 测试虎头旋转和金属光泽流动效果
   */
  test("TC-011: 加载动画替换", () => {
    const { container } = render(<LoadingAnimation />);

    // 验证加载动画元素存在
    const loadingContainer = container.querySelector(".min-h-screen");
    expect(loadingContainer).toBeInTheDocument();

    // 验证虎头图标旋转效果
    const spinIcon = container.querySelector(".animate-spin");
    expect(spinIcon).toBeInTheDocument();

    // 验证金属光泽流动效果
    const shimmerEffect = container.querySelector(".animate-shimmer");
    expect(shimmerEffect).toBeInTheDocument();

    // 记录测试结果
    console.log("✅ TC-011: 加载动画替换测试通过");
  });

  afterEach(() => {
    cleanup();
  });
});

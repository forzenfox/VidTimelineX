/**
 * ThemeToggle组件测试用例（甜筒）
 * 对应测试用例 TC-044 ~ TC-046
 * 验证ThemeToggle组件的渲染、切换和主题状态功能
 */

import React from "react";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import ThemeToggle from "@/features/tiantong/components/ThemeToggle";
import "@testing-library/jest-dom";

describe("ThemeToggle组件测试（甜筒）", () => {
  const mockOnToggle = jest.fn();

  /**
   * 测试用例 TC-044: ThemeToggle渲染测试（甜筒）
   * 测试目标：验证ThemeToggle组件正确渲染
   */
  test("TC-044: ThemeToggle渲染测试（甜筒）", () => {
    render(<ThemeToggle currentTheme="sweet" onToggle={mockOnToggle} />);

    // 验证主题切换按钮存在
    const button = screen.getByRole("switch");
    expect(button).toBeInTheDocument();

    // 验证SWEET文本存在
    expect(screen.getByText("SWEET")).toBeInTheDocument();

    // 验证TIGER文本存在
    expect(screen.getByText("TIGER")).toBeInTheDocument();

    // 验证aria-label属性
    expect(button).toHaveAttribute("aria-label", "切换到老虎主题");

    // 验证aria-checked属性
    expect(button).toHaveAttribute("aria-checked", "true");

    // 记录测试结果
    console.log("✅ TC-044: ThemeToggle渲染测试（甜筒）通过");
  });

  /**
   * 测试用例 TC-045: ThemeToggle切换测试（甜筒）
   * 测试目标：验证点击主题切换按钮时正确触发onToggle事件
   */
  test("TC-045: ThemeToggle切换测试（甜筒）", () => {
    render(<ThemeToggle currentTheme="sweet" onToggle={mockOnToggle} />);

    // 点击主题切换按钮
    const button = screen.getByRole("switch");
    fireEvent.click(button);

    // 验证onToggle回调是否被调用
    expect(mockOnToggle).toHaveBeenCalledTimes(1);

    // 记录测试结果
    console.log("✅ TC-045: ThemeToggle切换测试（甜筒）通过");
  });

  /**
   * 测试用例 TC-046: ThemeToggle主题状态测试（甜筒）
   * 测试目标：验证ThemeToggle在不同主题状态下的正确显示
   */
  test("TC-046: ThemeToggle主题状态测试（甜筒）", () => {
    const { rerender } = render(<ThemeToggle currentTheme="sweet" onToggle={mockOnToggle} />);

    // 验证甜筒主题状态
    let button = screen.getByRole("switch");
    expect(button).toHaveAttribute("aria-checked", "true");
    expect(button).toHaveAttribute("aria-label", "切换到老虎主题");

    // 切换到老虎主题
    rerender(<ThemeToggle currentTheme="tiger" onToggle={mockOnToggle} />);

    // 验证老虎主题状态
    button = screen.getByRole("switch");
    expect(button).toHaveAttribute("aria-checked", "false");
    expect(button).toHaveAttribute("aria-label", "切换到甜筒主题");

    // 记录测试结果
    console.log("✅ TC-046: ThemeToggle主题状态测试（甜筒）通过");
  });

  afterEach(() => {
    cleanup();
  });
});

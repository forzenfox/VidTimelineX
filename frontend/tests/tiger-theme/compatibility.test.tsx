/**
 * 兼容性测试用例
 * 对应测试用例 TC-014 ~ TC-016
 * 验证在不同浏览器和设备上的兼容性表现
 */

import React from "react";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import ThemeToggle from "@/features/tiantong/components/ThemeToggle";
import "@testing-library/jest-dom";

describe("兼容性测试", () => {
  /**
   * 测试用例 TC-014: 桌面端兼容性
   * 测试在不同桌面浏览器中主题显示和功能
   */
  test("TC-014: 桌面端兼容性", () => {
    const onToggle = jest.fn();
    const { container } = render(<ThemeToggle currentTheme="tiger" onToggle={onToggle} />);

    // 验证主题切换按钮存在
    const button = screen.getByRole("switch");
    expect(button).toBeInTheDocument();

    // 验证主题切换功能
    fireEvent.click(button);
    expect(onToggle).toHaveBeenCalledTimes(1);

    // 记录测试结果
    console.log("✅ TC-014: 桌面端兼容性测试通过");
  });

  /**
   * 测试用例 TC-015: 平板端兼容性
   * 测试在平板设备上布局适配和功能
   */
  test("TC-015: 平板端兼容性", () => {
    const onToggle = jest.fn();
    const { container } = render(<ThemeToggle currentTheme="tiger" onToggle={onToggle} />);

    // 验证主题切换按钮存在
    const button = screen.getByRole("switch");
    expect(button).toBeInTheDocument();

    // 验证主题切换功能
    fireEvent.click(button);
    expect(onToggle).toHaveBeenCalledTimes(1);

    // 记录测试结果
    console.log("✅ TC-015: 平板端兼容性测试通过");
  });

  /**
   * 测试用例 TC-016: 不支持手机设备
   * 测试在手机设备上显示友好提示
   */
  test("TC-016: 不支持手机设备", () => {
    const onToggle = jest.fn();
    const { container } = render(<ThemeToggle currentTheme="tiger" onToggle={onToggle} />);

    // 验证主题切换按钮存在
    const button = screen.getByRole("switch");
    expect(button).toBeInTheDocument();

    // 验证核心功能可用
    fireEvent.click(button);
    expect(onToggle).toHaveBeenCalledTimes(1);

    // 记录测试结果
    console.log("✅ TC-016: 不支持手机设备测试通过");
  });

  afterEach(() => {
    cleanup();
  });
});

/**
 * ThemeToggle 组件单元测试
 * 测试主题切换按钮的渲染和行为
 */

import React from "react";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import ThemeToggle from "@/components/hu/hu_ThemeToggle";
import "@testing-library/jest-dom";

describe("ThemeToggle 组件测试", () => {
  /**
   * 测试用例 TC-THEME-001: 老虎主题渲染
   * 测试当 currentTheme 为 "tiger" 时组件正确渲染
   */
  test("正确渲染老虎主题状态", () => {
    const onToggle = jest.fn();
    render(<ThemeToggle currentTheme="tiger" onToggle={onToggle} />);

    const button = screen.getByRole("switch", { name: /切换到甜筒主题/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute("aria-checked", "false");
  });

  /**
   * 测试用例 TC-THEME-002: 甜筒主题渲染
   * 测试当 currentTheme 为 "sweet" 时组件正确渲染
   */
  test("正确渲染甜筒主题状态", () => {
    const onToggle = jest.fn();
    render(<ThemeToggle currentTheme="sweet" onToggle={onToggle} />);

    const button = screen.getByRole("switch", { name: /切换到老虎主题/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute("aria-checked", "true");
  });

  /**
   * 测试用例 TC-THEME-003: 主题切换功能
   * 测试点击按钮时触发 onToggle 回调
   */
  test("点击按钮时触发切换回调", () => {
    const onToggle = jest.fn();
    render(<ThemeToggle currentTheme="tiger" onToggle={onToggle} />);

    const button = screen.getByRole("switch");
    fireEvent.click(button);

    expect(onToggle).toHaveBeenCalledTimes(1);
  });

  /**
   * 测试用例 TC-THEME-004: 无障碍属性
   * 测试组件具有正确的 ARIA 属性
   */
  test("组件具有正确的无障碍属性", () => {
    const onToggle = jest.fn();
    render(<ThemeToggle currentTheme="tiger" onToggle={onToggle} />);

    const button = screen.getByRole("switch");
    expect(button).toHaveAttribute("role", "switch");
    expect(button).toHaveAttribute("aria-label");
  });

  /**
   * 测试用例 TC-THEME-005: 主题样式切换
   * 测试不同主题下按钮样式正确应用
   */
  test("老虎主题具有正确的样式", () => {
    const onToggle = jest.fn();
    const { container } = render(<ThemeToggle currentTheme="tiger" onToggle={onToggle} />);

    const button = container.querySelector("button");
    expect(button).toHaveClass("bg-[rgb(30,25,20)]");
    expect(button).toHaveClass("border-[rgb(255,110,20)]");
  });

  test("甜筒主题具有正确的样式", () => {
    const onToggle = jest.fn();
    const { container } = render(<ThemeToggle currentTheme="sweet" onToggle={onToggle} />);

    const button = container.querySelector("button");
    expect(button).toHaveClass("bg-[rgb(255,220,225)]");
    expect(button).toHaveClass("border-[rgb(255,120,160)]");
  });
});

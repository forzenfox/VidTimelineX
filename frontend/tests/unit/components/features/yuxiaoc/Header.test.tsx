import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Header } from "@/features/yuxiaoc/components/Header";
import "@testing-library/jest-dom";

describe("Header组件测试", () => {
  const mockOnThemeToggle = jest.fn();

  /**
   * 测试用例 TC-001: 组件渲染测试
   * 测试目标：验证Header组件能够正确渲染
   */
  test("TC-001: 组件渲染测试", () => {
    render(<Header theme="blood" onThemeToggle={mockOnThemeToggle} />);

    expect(screen.getByText("C皇驾到")).toBeInTheDocument();
    expect(screen.getByText("斗鱼 123456")).toBeInTheDocument();
  });

  /**
   * 测试用例 TC-002: 血怒模式显示测试
   * 测试目标：验证血怒模式下正确显示
   */
  test("TC-002: 血怒模式显示测试", () => {
    render(<Header theme="blood" onThemeToggle={mockOnThemeToggle} />);

    expect(screen.getByText("血怒模式")).toBeInTheDocument();
  });

  /**
   * 测试用例 TC-003: 混躺模式显示测试
   * 测试目标：验证混躺模式下正确显示
   */
  test("TC-003: 混躺模式显示测试", () => {
    render(<Header theme="mix" onThemeToggle={mockOnThemeToggle} />);

    expect(screen.getByText("混躺模式")).toBeInTheDocument();
  });

  /**
   * 测试用例 TC-004: 主题切换功能测试
   * 测试目标：验证点击主题切换按钮触发回调
   */
  test("TC-004: 主题切换功能测试", () => {
    render(<Header theme="blood" onThemeToggle={mockOnThemeToggle} />);

    const toggleButton = screen.getByText("血怒模式").closest("button");
    if (toggleButton) {
      fireEvent.click(toggleButton);
    }

    expect(mockOnThemeToggle).toHaveBeenCalledTimes(1);
  });

  /**
   * 测试用例 TC-005: 导航链接渲染测试
   * 测试目标：验证导航链接正确显示
   */
  test("TC-005: 导航链接渲染测试", () => {
    render(<Header theme="blood" onThemeToggle={mockOnThemeToggle} />);

    expect(screen.getByText("首页")).toBeInTheDocument();
    expect(screen.getByText("称号")).toBeInTheDocument();
    expect(screen.getByText("食堂")).toBeInTheDocument();
    expect(screen.getByText("语录")).toBeInTheDocument();
  });

  /**
   * 测试用例 TC-006: LIVE标识显示测试
   * 测试目标：验证直播状态标识显示
   */
  test("TC-006: LIVE标识显示测试", () => {
    render(<Header theme="blood" onThemeToggle={mockOnThemeToggle} />);

    expect(screen.getByText("LIVE")).toBeInTheDocument();
  });
});

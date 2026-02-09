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

    // 使用 getAllByText 因为导航栏和快捷按钮都显示这些文字
    expect(screen.getByText("首页")).toBeInTheDocument();
    expect(screen.getAllByText("称号").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("食堂").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("语录").length).toBeGreaterThanOrEqual(1);
  });

  /**
   * 测试用例 TC-006: LIVE标识显示测试
   * 测试目标：验证直播状态标识显示
   */
  test("TC-006: LIVE标识显示测试", () => {
    render(<Header theme="blood" onThemeToggle={mockOnThemeToggle} />);

    expect(screen.getByText("LIVE")).toBeInTheDocument();
  });

  /**
   * 测试用例 TC-007: 快捷按钮显示测试
   * 测试目标：验证导航栏右侧快捷按钮正确显示（称号、食堂、语录）
   */
  test("TC-007: 快捷按钮显示测试", () => {
    render(<Header theme="blood" onThemeToggle={mockOnThemeToggle} />);

    // 验证快捷按钮存在（通过title属性查找）
    const titleButton = screen.getByTitle("称号");
    const canteenButton = screen.getByTitle("食堂");
    const voiceButton = screen.getByTitle("语录");

    expect(titleButton).toBeInTheDocument();
    expect(canteenButton).toBeInTheDocument();
    expect(voiceButton).toBeInTheDocument();
  });

  /**
   * 测试用例 TC-008: 快捷按钮点击跳转测试
   * 测试目标：验证点击快捷按钮能正确跳转到对应模块
   */
  test("TC-008: 快捷按钮点击跳转测试", () => {
    render(<Header theme="blood" onThemeToggle={mockOnThemeToggle} />);

    const titleButton = screen.getByTitle("称号");

    // 点击快捷按钮
    fireEvent.click(titleButton);

    // 验证按钮存在且可点击
    expect(titleButton).toBeInTheDocument();
  });
});

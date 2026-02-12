import React from "react";
import { render, screen } from "@testing-library/react";
import { HeroSection } from "@/features/yuxiaoc/components/HeroSection";
import "@testing-library/jest-dom";

describe("HeroSection组件测试", () => {
  /**
   * 测试用例 TC-001: 组件渲染测试
   * 测试目标：验证HeroSection组件能够正确渲染
   */
  test("TC-001: 组件渲染测试", () => {
    render(<HeroSection theme="blood" />);

    expect(screen.getByText("C皇驾到")).toBeInTheDocument();
  });

  /**
   * 测试用例 TC-002: 血怒模式标题显示测试
   * 测试目标：验证血怒模式下显示正确的副标题
   */
  test("TC-002: 血怒模式标题显示测试", () => {
    render(<HeroSection theme="blood" />);

    expect(screen.getByText("血怒之下，众生平等；无情铁手，致残打击！")).toBeInTheDocument();
    expect(screen.getByText("诺克萨斯即将崛起，大杀四方，断头台！")).toBeInTheDocument();
  });

  /**
   * 测试用例 TC-003: 混躺模式标题显示测试
   * 测试目标：验证混躺模式下显示正确的副标题
   */
  test("TC-003: 混躺模式标题显示测试", () => {
    render(<HeroSection theme="mix" />);

    expect(screen.getByText("混与躺轮回不止，这把混，下把躺")).toBeInTheDocument();
    expect(screen.getByText("峡谷路远，混躺轮回。吃饭要紧，下饭经典。")).toBeInTheDocument();
  });

  /**
   * 测试用例 TC-004: 血怒模式指示器测试
   * 测试目标：验证血怒模式下显示血怒值指示器
   */
  test("TC-004: 血怒模式指示器测试", () => {
    render(<HeroSection theme="blood" />);

    expect(screen.getByText("当前血怒值")).toBeInTheDocument();
    expect(screen.getByText("100%")).toBeInTheDocument();
  });

  /**
   * 测试用例 TC-005: 混躺模式指示器测试
   * 测试目标：验证混躺模式下显示混躺值指示器
   */
  test("TC-005: 混躺模式指示器测试", () => {
    render(<HeroSection theme="mix" />);

    expect(screen.getByText("当前混躺值")).toBeInTheDocument();
    expect(screen.getByText("50%")).toBeInTheDocument();
  });

  /**
   * 测试用例 TC-006: 血怒模式按钮测试
   * 测试目标：验证血怒模式下显示正确的CTA按钮
   */
  test("TC-006: 血怒模式按钮测试", () => {
    render(<HeroSection theme="blood" />);

    expect(screen.getByText("进入直播间")).toBeInTheDocument();
    expect(screen.getByText("观看血怒时刻")).toBeInTheDocument();
  });

  /**
   * 测试用例 TC-007: 混躺模式按钮测试
   * 测试目标：验证混躺模式下显示正确的CTA按钮
   */
  test("TC-007: 混躺模式按钮测试", () => {
    render(<HeroSection theme="mix" />);

    expect(screen.getByText("进入直播间")).toBeInTheDocument();
    expect(screen.getByText("浏览食堂")).toBeInTheDocument();
  });

  /**
   * 测试用例 TC-008: 头像渲染测试
   * 测试目标：验证C皇头像正确渲染
   */
  test("TC-008: 头像渲染测试", () => {
    render(<HeroSection theme="blood" />);

    const avatar = screen.getByAltText("C皇头像");
    expect(avatar).toBeInTheDocument();
    expect(avatar).toHaveAttribute("src");
  });

  /**
   * 测试用例 TC-009: 主题标识徽章测试
   * 测试目标：验证显示当前主题标识徽章
   */
  test("TC-009: 主题标识徽章测试 - 血怒模式", () => {
    render(<HeroSection theme="blood" />);

    expect(screen.getByText("血怒模式")).toBeInTheDocument();
  });

  test("TC-009: 主题标识徽章测试 - 混躺模式", () => {
    render(<HeroSection theme="mix" />);

    expect(screen.getByText("混躺模式")).toBeInTheDocument();
  });

  /**
   * 测试用例 TC-010: 进度条渲染测试
   * 测试目标：验证血怒/混躺值进度条正确渲染
   */
  test("TC-010: 进度条渲染测试", () => {
    const { container } = render(<HeroSection theme="blood" />);

    // 验证进度条容器存在
    const progressBar = container.querySelector("[style*='width: 100%']");
    expect(progressBar).toBeInTheDocument();
  });

  /**
   * 测试用例 TC-011: 直播链接测试
   * 测试目标：验证进入直播间按钮链接正确
   */
  test("TC-011: 直播链接测试", () => {
    render(<HeroSection theme="blood" />);

    const liveLink = screen.getByText("进入直播间").closest("a");
    expect(liveLink).toHaveAttribute("href", "https://www.douyu.com/1126960");
    expect(liveLink).toHaveAttribute("target", "_blank");
    expect(liveLink).toHaveAttribute("rel", "noopener noreferrer");
  });

  /**
   * 测试用例 TC-012: 滚动指示器测试
   * 测试目标：验证页面底部滚动指示器存在
   */
  test("TC-012: 滚动指示器测试", () => {
    const { container } = render(<HeroSection theme="blood" />);

    // 验证滚动指示器容器存在（通过样式类名）
    const scrollIndicator = container.querySelector(".animate-bounce");
    expect(scrollIndicator).toBeInTheDocument();
  });
});

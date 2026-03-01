import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { HeroSection } from "@/features/yuxiaoc/components/HeroSection";
import "@testing-library/jest-dom";

describe("HeroSection组件测试", () => {
  /**
   * 测试用例 TC-001: 组件渲染测试
   * 测试目标：验证HeroSection组件能够正确渲染
   */
  test("TC-001: 组件渲染测试", () => {
    render(<HeroSection theme="blood" />);

    // 验证主标题渲染
    expect(screen.getByText("C皇驾到")).toBeInTheDocument();
    // 验证section元素存在
    expect(document.querySelector("section#hero")).toBeInTheDocument();
  });

  /**
   * 测试用例 TC-002: 标题和描述展示测试 - 血怒模式
   * 测试目标：验证血怒模式下显示正确的标题和描述
   */
  test("TC-002: 标题和描述展示测试 - 血怒模式", () => {
    render(<HeroSection theme="blood" />);

    // 验证血怒模式副标题
    expect(screen.getByText("血怒之下，众生平等；无情铁手，致残打击！")).toBeInTheDocument();
    // 验证血怒模式描述
    expect(screen.getByText("诺克萨斯即将崛起，大杀四方，断头台！")).toBeInTheDocument();
    // 验证主标题
    expect(screen.getByText("C皇驾到")).toBeInTheDocument();
  });

  /**
   * 测试用例 TC-003: 标题和描述展示测试 - 混躺模式
   * 测试目标：验证混躺模式下显示正确的标题和描述
   */
  test("TC-003: 标题和描述展示测试 - 混躺模式", () => {
    render(<HeroSection theme="mix" />);

    // 验证混躺模式副标题
    expect(screen.getByText("混与躺轮回不止，这把混，下把躺")).toBeInTheDocument();
    // 验证混躺模式描述
    expect(screen.getByText("峡谷路远，混躺轮回。吃饭要紧，下饭经典。")).toBeInTheDocument();
    // 验证主标题
    expect(screen.getByText("C皇驾到")).toBeInTheDocument();
  });

  /**
   * 测试用例 TC-004: 背景图片测试 - 头像渲染
   * 测试目标：验证C皇头像正确渲染
   */
  test("TC-004: 背景图片测试 - 头像渲染", () => {
    render(<HeroSection theme="blood" />);

    // 验证头像图片存在
    const avatar = screen.getByAltText("C皇头像");
    expect(avatar).toBeInTheDocument();
    expect(avatar).toHaveAttribute("src");
    // 验证头像容器样式类
    expect(avatar.closest("div")?.parentElement).toHaveClass("relative");
  });

  /**
   * 测试用例 TC-005: 背景图片测试 - 渐变背景
   * 测试目标：验证血怒和混躺模式的渐变背景
   */
  test("TC-005: 背景图片测试 - 渐变背景", () => {
    const { container: bloodContainer } = render(<HeroSection theme="blood" />);
    const bloodSection = bloodContainer.querySelector("section#hero");
    expect(bloodSection).toBeInTheDocument();
    // 验证血怒模式背景样式存在
    const bloodStyle = bloodSection?.getAttribute("style");
    expect(bloodStyle).toContain("linear-gradient");
    expect(bloodStyle).toContain("#0F0F23");

    const { container: mixContainer } = render(<HeroSection theme="mix" />);
    const mixSection = mixContainer.querySelector("section#hero");
    expect(mixSection).toBeInTheDocument();
    // 验证混躺模式背景样式存在
    const mixStyle = mixSection?.getAttribute("style");
    expect(mixStyle).toContain("linear-gradient");
    expect(mixStyle).toContain("#F8FAFC");
  });

  /**
   * 测试用例 TC-006: 自定义类名测试 - section元素
   * 测试目标：验证section元素包含正确的类名
   */
  test("TC-006: 自定义类名测试 - section元素", () => {
    const { container } = render(<HeroSection theme="blood" />);

    // 验证section元素存在并包含正确的类名
    const section = container.querySelector("section#hero");
    expect(section).toBeInTheDocument();
    expect(section).toHaveClass("min-h-screen");
    expect(section).toHaveClass("flex");
    expect(section).toHaveClass("items-center");
    expect(section).toHaveClass("justify-center");
  });

  /**
   * 测试用例 TC-007: 自定义类名测试 - 内容容器
   * 测试目标：验证内容容器包含正确的类名
   */
  test("TC-007: 自定义类名测试 - 内容容器", () => {
    const { container } = render(<HeroSection theme="blood" />);

    // 验证内容容器存在
    const contentContainer = container.querySelector(".max-w-7xl");
    expect(contentContainer).toBeInTheDocument();
    expect(contentContainer).toHaveClass("mx-auto");
    expect(contentContainer).toHaveClass("text-center");
  });

  /**
   * 测试用例 TC-008: 主题标识徽章测试
   * 测试目标：验证显示当前主题标识徽章
   */
  test("TC-008: 主题标识徽章测试", () => {
    // 测试血怒模式
    const { unmount } = render(<HeroSection theme="blood" />);
    expect(screen.getByText("血怒模式")).toBeInTheDocument();
    unmount();

    // 测试混躺模式
    render(<HeroSection theme="mix" />);
    expect(screen.getByText("混躺模式")).toBeInTheDocument();
  });

  /**
   * 测试用例 TC-009: 按钮链接测试
   * 测试目标：验证CTA按钮链接正确
   */
  test("TC-009: 按钮链接测试", () => {
    render(<HeroSection theme="blood" />);

    // 验证进入直播间按钮链接
    const liveLink = screen.getByText("进入直播间").closest("a");
    expect(liveLink).toHaveAttribute("href", "https://www.douyu.com/1126960");
    expect(liveLink).toHaveAttribute("target", "_blank");
    expect(liveLink).toHaveAttribute("rel", "noopener noreferrer");

    // 验证鱼吧链接按钮
    const yubaLink = screen.getByText("鱼吧链接").closest("a");
    expect(yubaLink).toHaveAttribute("href", "https://yuba.douyu.com/discussion/11431/posts");

    // 验证B站合集按钮
    const bilibiliLink = screen.getByText("B站合集").closest("a");
    expect(bilibiliLink).toHaveAttribute("href", "https://space.bilibili.com/8985997");
  });

  /**
   * 测试用例 TC-010: 进度条显示测试
   * 测试目标：验证血怒/混躺值进度条正确渲染
   */
  test("TC-010: 进度条显示测试", () => {
    // 测试血怒模式进度条
    const { container: bloodContainer, unmount } = render(<HeroSection theme="blood" />);
    expect(screen.getByText("当前血怒值")).toBeInTheDocument();
    expect(screen.getByText("100%")).toBeInTheDocument();
    // 验证进度条宽度为100%
    const bloodProgressBar = bloodContainer.querySelector("[style*='width: 100%']");
    expect(bloodProgressBar).toBeInTheDocument();
    unmount();

    // 测试混躺模式进度条
    const { container: mixContainer } = render(<HeroSection theme="mix" />);
    expect(screen.getByText("当前混躺值")).toBeInTheDocument();
    expect(screen.getByText("50%")).toBeInTheDocument();
    // 验证进度条宽度为50%
    const mixProgressBar = mixContainer.querySelector("[style*='width: 50%']");
    expect(mixProgressBar).toBeInTheDocument();
  });
});

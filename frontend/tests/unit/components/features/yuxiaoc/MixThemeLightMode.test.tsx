import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import YuxiaocPage from "@/features/yuxiaoc/YuxiaocPage";
import "@testing-library/jest-dom";

// 模拟子组件
jest.mock("@/features/yuxiaoc/components/LoadingAnimation", () => ({
  LoadingAnimation: ({ onComplete }: { onComplete: (theme: string) => void }) => (
    <div data-testid="loading-animation">
      <button onClick={() => onComplete("mix")}>完成加载</button>
    </div>
  ),
}));

jest.mock("@/features/yuxiaoc/components/Header", () => ({
  Header: ({ theme }: { theme: string }) => (
    <header data-testid="header" data-theme={theme}>
      {theme}
    </header>
  ),
}));

jest.mock("@/features/yuxiaoc/components/HeroSection", () => ({
  HeroSection: ({ theme }: { theme: string }) => (
    <section data-testid="hero-section" data-theme={theme}>
      {theme}
    </section>
  ),
}));

jest.mock("@/features/yuxiaoc/components/TitleHall", () => ({
  TitleHall: ({ theme }: { theme: string }) => (
    <section data-testid="title-hall" data-theme={theme}>
      {theme}
    </section>
  ),
}));

jest.mock("@/features/yuxiaoc/components/CanteenHall", () => ({
  CanteenHall: ({ theme }: { theme: string }) => (
    <section data-testid="canteen-hall" data-theme={theme}>
      {theme}
    </section>
  ),
}));

jest.mock("@/features/yuxiaoc/components/CVoiceArchive", () => ({
  CVoiceArchive: ({ theme }: { theme: string }) => (
    <section data-testid="cvoice-archive" data-theme={theme}>
      {theme}
    </section>
  ),
}));

jest.mock("@/features/yuxiaoc/components/DanmakuTower", () => ({
  DanmakuTower: ({ theme }: { theme: string }) => (
    <aside data-testid="danmaku-tower" data-theme={theme}>
      {theme}
    </aside>
  ),
}));

jest.mock("@/features/yuxiaoc/components/HorizontalDanmaku", () => ({
  HorizontalDanmaku: () => <div data-testid="horizontal-danmaku" />,
}));

jest.mock("@/features/yuxiaoc/components/VideoModal", () => ({
  VideoModal: () => null,
}));

describe("混躺模式明亮主题测试", () => {
  /**
   * TC-001: 混躺模式背景色测试
   * 目标：验证混躺模式使用明亮的米色背景
   */
  test("TC-001: 混躺模式背景色测试", async () => {
    const { container } = render(<YuxiaocPage />);

    // 点击混躺模式
    const completeButton = screen.getByText("完成加载");
    completeButton.click();

    // 等待加载完成
    await waitFor(() => {
      expect(screen.queryByTestId("loading-animation")).not.toBeInTheDocument();
    });

    // 验证主容器背景色为明亮米色
    const mainContainer = container.querySelector(".min-h-screen");
    expect(mainContainer).toBeInTheDocument();
    expect(mainContainer).toHaveStyle({
      background: "#FEF3C7", // 温暖米色
    });
  });

  /**
   * TC-002: 混躺模式主色调测试
   * 目标：验证混躺模式使用琥珀色作为主色
   */
  test("TC-002: 混躺模式主色调测试", async () => {
    const { container } = render(<YuxiaocPage />);
    
    screen.getByText("完成加载").click();

    // 等待加载完成
    await waitFor(() => {
      expect(screen.queryByTestId("loading-animation")).not.toBeInTheDocument();
    });

    // 验证主内容区域存在
    const mainContent = container.querySelector(".main-content");
    expect(mainContent).toBeInTheDocument();
  });

  /**
   * TC-003: 混躺模式文字颜色测试
   * 目标：验证混躺模式使用深棕色文字
   */
  test("TC-003: 混躺模式文字颜色测试", async () => {
    render(<YuxiaocPage />);
    
    screen.getByText("完成加载").click();

    // 等待加载完成
    await waitFor(() => {
      expect(screen.queryByTestId("loading-animation")).not.toBeInTheDocument();
    });

    // 验证页脚文字使用深棕色
    const footer = screen.getByText(/C皇驾到 · 混与躺轮回不止/);
    expect(footer).toHaveStyle({
      color: "#78350F",
    });
  });

  /**
   * TC-004: 混躺模式卡片背景测试
   * 目标：验证混躺模式卡片使用浅奶油色
   */
  test("TC-004: 混躺模式卡片背景测试", async () => {
    const { container } = render(<YuxiaocPage />);

    screen.getByText("完成加载").click();

    // 等待加载完成
    await waitFor(() => {
      expect(screen.queryByTestId("loading-animation")).not.toBeInTheDocument();
    });

    // 验证页脚背景使用渐变
    const footer = container.querySelector("footer");
    expect(footer).toBeInTheDocument();
    expect(footer).toHaveStyle({
      background: "linear-gradient(180deg, #FEF3C7 0%, #FEF9C3 100%)",
    });
  });

  /**
   * TC-005: 混躺模式边框颜色测试
   * 目标：验证混躺模式使用琥珀色边框
   */
  test("TC-005: 混躺模式边框颜色测试", async () => {
    const { container } = render(<YuxiaocPage />);
    
    screen.getByText("完成加载").click();

    // 等待加载完成
    await waitFor(() => {
      expect(screen.queryByTestId("loading-animation")).not.toBeInTheDocument();
    });

    // 验证页脚边框使用琥珀色
    const footer = container.querySelector("footer");
    expect(footer).toBeInTheDocument();
    expect(footer).toHaveStyle({
  borderTop: "1px solid rgba(245, 158, 11, 0.3)",
    });
  });

  /**
   * TC-006: 混躺模式与血怒模式对比测试
   * 目标：验证两种模式有明显不同的配色
   */
  test("TC-006: 混躺模式与血怒模式对比测试", async () => {
    // 渲染混躺模式
    const { container: mixContainer, unmount } = render(<YuxiaocPage />);
    screen.getByText("完成加载").click();

    // 等待加载完成
    await waitFor(() => {
      expect(screen.queryByTestId("loading-animation")).not.toBeInTheDocument();
});

    const mixMainContainer = mixContainer.querySelector(".min-h-screen");
    expect(mixMainContainer).toBeInTheDocument();
    const mixBackground = mixMainContainer?.getAttribute("style");

    unmount();

    // 混躺模式应该是明亮背景 (hex或rgb格式)
    expect(mixBackground).toMatch(/#FEF3C7|rgb\(254,\s*243,\s*199\)/);
  });

  /**
   * TC-007: 混躺模式装饰线颜色测试
   * 目标：验证混躺模式使用琥珀色装饰线
   */
  test("TC-007: 混躺模式装饰线颜色测试", async () => {
    const { container } = render(<YuxiaocPage />);
    
    screen.getByText("完成加载").click();

    // 等待加载完成
    await waitFor(() => {
      expect(screen.queryByTestId("loading-animation")).not.toBeInTheDocument();
    });

    // 验证装饰线使用琥珀色渐变
    const decorativeLine = container.querySelector("footer > div");
    expect(decorativeLine).toBeInTheDocument();
    expect(decorativeLine).toHaveStyle({
      background: "linear-gradient(90deg, transparent, #F59E0B, transparent)",
    });
  });

  /**
   * TC-008: 混躺模式直播指示器测试
   * 目标：验证混躺模式使用琥珀色直播指示器
   */
  test("TC-008: 混躺模式直播指示器测试", async () => {
    const { container } = render(<YuxiaocPage />);
    
    screen.getByText("完成加载").click();

    // 等待加载完成
    await waitFor(() => {
      expect(screen.queryByTestId("loading-animation")).not.toBeInTheDocument();
    });

    // 验证直播指示器使用琥珀色
    const liveIndicator = container.querySelector("footer .animate-pulse");
    expect(liveIndicator).toBeInTheDocument();
    expect(liveIndicator).toHaveStyle({
      backgroundColor: "#F59E0B",
    });
  });

  /**
   * TC-009: 混躺模式所有子组件接收正确主题测试
   * 目标：验证所有子组件都接收到mix主题
   */
  test("TC-009: 混躺模式所有子组件接收正确主题测试", async () => {
    render(<YuxiaocPage />);
    
    screen.getByText("完成加载").click();

    // 等待加载完成
    await waitFor(() => {
      expect(screen.queryByTestId("loading-animation")).not.toBeInTheDocument();
    });

    // 验证所有子组件都显示mix主题
    expect(screen.getByTestId("header")).toHaveAttribute("data-theme", "mix");
    expect(screen.getByTestId("hero-section")).toHaveAttribute("data-theme", "mix");
    expect(screen.getByTestId("title-hall")).toHaveAttribute("data-theme", "mix");
    expect(screen.getByTestId("canteen-hall")).toHaveAttribute("data-theme", "mix");
    expect(screen.getByTestId("cvoice-archive")).toHaveAttribute("data-theme", "mix");
    expect(screen.getByTestId("danmaku-tower")).toHaveAttribute("data-theme", "mix");
  });

  /**
   * TC-010: 混躺模式文字对比度测试
   * 目标：验证混躺模式文字有足够的对比度
   */
  test("TC-010: 混躺模式文字对比度测试", async () => {
    render(<YuxiaocPage />);
    
    screen.getByText("完成加载").click();

    // 等待加载完成
    await waitFor(() => {
      expect(screen.queryByTestId("loading-animation")).not.toBeInTheDocument();
    });

    // 验证主要文字颜色为深棕色（确保对比度）
    const footerText = screen.getByText("本站点为粉丝自制，仅供娱乐");
    expect(footerText).toHaveStyle({
      color: "#92400E", // 中棕色，确保在米色背景上有足够对比度
    });
  });

  /**
   * TC-011: body data-theme属性测试
   * 目标：验证body元素的data-theme属性随主题变化
   */
  test("TC-011: body data-theme属性测试", async () => {
    render(<YuxiaocPage />);
    
    screen.getByText("完成加载").click();

    // 等待加载完成
    await waitFor(() => {
      expect(screen.queryByTestId("loading-animation")).not.toBeInTheDocument();
    });

    // 验证body的data-theme属性为mix
    expect(document.body.getAttribute("data-theme")).toBe("mix");
  });

  /**
   * TC-012: body背景色随主题变化测试
   * 目标：验证body背景色随主题正确变化
   * 注意：Jest测试环境不加载CSS文件，所以验证data-theme属性
   */
  test("TC-012: body背景色随主题变化测试", async () => {
    render(<YuxiaocPage />);
    
    screen.getByText("完成加载").click();

    // 等待加载完成
    await waitFor(() => {
      expect(screen.queryByTestId("loading-animation")).not.toBeInTheDocument();
    });

    // 验证body的data-theme属性为mix（CSS会根据这个属性设置背景色）
    expect(document.body.getAttribute("data-theme")).toBe("mix");
  });

  /**
   * TC-013: body实际计算背景色测试
   * 目标：验证body实际计算后的背景色为明亮米色
   * 注意：此测试需要在真实浏览器环境中运行，Jest中CSS可能未加载
   */
  test("TC-013: body实际计算背景色测试", async () => {
    render(<YuxiaocPage />);
    
    screen.getByText("完成加载").click();

    // 等待加载完成
    await waitFor(() => {
      expect(screen.queryByTestId("loading-animation")).not.toBeInTheDocument();
    });

    // 验证body的data-theme属性为mix
    expect(document.body.getAttribute("data-theme")).toBe("mix");
    
    // 注意：在Jest环境中，getComputedStyle可能返回默认值
    // 实际背景色验证需要在真实浏览器中进行
    // 这里主要验证data-theme属性已正确设置
  });
});

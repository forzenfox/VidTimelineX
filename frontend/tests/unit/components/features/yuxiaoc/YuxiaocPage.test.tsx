import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import YuxiaocPage from "@/features/yuxiaoc/YuxiaocPage";
import "@testing-library/jest-dom";

// 模拟子组件
jest.mock("@/features/yuxiaoc/components/LoadingAnimation", () => ({
  LoadingAnimation: ({ onComplete }: { onComplete: (theme: string) => void }) => (
    <div data-testid="loading-animation">
      <button onClick={() => onComplete("blood")}>完成加载</button>
    </div>
  ),
}));

jest.mock("@/features/yuxiaoc/components/Header", () => ({
  Header: ({ theme, onThemeToggle }: { theme: string; onThemeToggle: () => void }) => (
    <header data-testid="header">
      <span data-testid="header-theme">{theme}</span>
      <button onClick={onThemeToggle}>切换主题</button>
    </header>
  ),
}));

jest.mock("@/features/yuxiaoc/components/HeroSection", () => ({
  HeroSection: ({ theme }: { theme: string }) => <section data-testid="hero-section">{theme}</section>,
}));

jest.mock("@/features/yuxiaoc/components/TitleHall", () => ({
  TitleHall: ({ theme }: { theme: string }) => <section data-testid="title-hall">{theme}</section>,
}));

jest.mock("@/features/yuxiaoc/components/CanteenHall", () => ({
  CanteenHall: ({ theme, onVideoClick }: { theme: string; onVideoClick: (video: any) => void }) => (
    <section data-testid="canteen-hall">
      <span>{theme}</span>
      <button onClick={() => onVideoClick({ id: "1", title: "测试视频" })}>点击视频</button>
    </section>
  ),
}));

jest.mock("@/features/yuxiaoc/components/CVoiceArchive", () => ({
  CVoiceArchive: ({ theme }: { theme: string }) => <section data-testid="cvoice-archive">{theme}</section>,
}));

jest.mock("@/features/yuxiaoc/components/DanmakuTower", () => ({
  DanmakuTower: ({ theme }: { theme: string }) => <aside data-testid="danmaku-tower">{theme}</aside>,
}));

jest.mock("@/features/yuxiaoc/components/HorizontalDanmaku", () => ({
  HorizontalDanmaku: ({ theme, isVisible }: { theme: string; isVisible: boolean }) => (
    <div data-testid="horizontal-danmaku" data-visible={isVisible}>
      {theme}
    </div>
  ),
}));

jest.mock("@/features/yuxiaoc/components/VideoModal", () => ({
  VideoModal: ({ video, theme, onClose }: { video: any; theme: string; onClose: () => void }) => {
    if (!video) return null;
    return (
      <div data-testid="video-modal">
        <span>{video.title}</span>
        <span>{theme}</span>
        <button onClick={onClose}>关闭</button>
      </div>
    );
  },
}));

describe("YuxiaocPage集成测试", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  /**
   * 测试用例 TC-001: 页面加载状态测试
   * 测试目标：验证初始状态显示加载动画
   */
  test("TC-001: 页面加载状态测试", () => {
    render(<YuxiaocPage />);

    expect(screen.getByTestId("loading-animation")).toBeInTheDocument();
  });

  /**
   * 测试用例 TC-002: 加载完成后渲染主页面测试
   * 测试目标：验证加载完成后渲染主页面组件
   */
  test("TC-002: 加载完成后渲染主页面测试", async () => {
    render(<YuxiaocPage />);

    // 点击完成加载按钮
    fireEvent.click(screen.getByText("完成加载"));

    // 验证主页面组件渲染
    await waitFor(() => {
      expect(screen.getByTestId("header")).toBeInTheDocument();
      expect(screen.getByTestId("hero-section")).toBeInTheDocument();
      expect(screen.getByTestId("title-hall")).toBeInTheDocument();
      expect(screen.getByTestId("canteen-hall")).toBeInTheDocument();
      expect(screen.getByTestId("cvoice-archive")).toBeInTheDocument();
      expect(screen.getByTestId("danmaku-tower")).toBeInTheDocument();
    });
  });

  /**
   * 测试用例 TC-003: 默认主题测试
   * 测试目标：验证默认主题为blood
   */
  test("TC-003: 默认主题测试", async () => {
    render(<YuxiaocPage />);

    // 完成加载
    fireEvent.click(screen.getByText("完成加载"));

    // 验证默认主题为blood
    await waitFor(() => {
      expect(screen.getByTestId("header-theme")).toHaveTextContent("blood");
      expect(screen.getByTestId("hero-section")).toHaveTextContent("blood");
    });
  });

  /**
   * 测试用例 TC-004: 主题切换功能测试
   * 测试目标：验证主题切换功能正常工作
   */
  test("TC-004: 主题切换功能测试", async () => {
    render(<YuxiaocPage />);

    // 完成加载
    fireEvent.click(screen.getByText("完成加载"));

    await waitFor(() => {
      expect(screen.getByTestId("header-theme")).toHaveTextContent("blood");
    });

    // 点击切换主题
    fireEvent.click(screen.getByText("切换主题"));

    // 验证主题切换为mix
    await waitFor(() => {
      expect(screen.getByTestId("header-theme")).toHaveTextContent("mix");
      expect(screen.getByTestId("hero-section")).toHaveTextContent("mix");
    });
  });

  /**
   * 测试用例 TC-005: 视频弹窗打开测试
   * 测试目标：验证点击视频后打开弹窗
   */
  test("TC-005: 视频弹窗打开测试", async () => {
    render(<YuxiaocPage />);

    // 完成加载
    fireEvent.click(screen.getByText("完成加载"));

    await waitFor(() => {
      expect(screen.getByTestId("canteen-hall")).toBeInTheDocument();
    });

    // 点击视频
    fireEvent.click(screen.getByText("点击视频"));

    // 验证弹窗打开
    await waitFor(() => {
      expect(screen.getByTestId("video-modal")).toBeInTheDocument();
      expect(screen.getByText("测试视频")).toBeInTheDocument();
    });
  });

  /**
   * 测试用例 TC-006: 视频弹窗关闭测试
   * 测试目标：验证关闭弹窗功能正常
   */
  test("TC-006: 视频弹窗关闭测试", async () => {
    render(<YuxiaocPage />);

    // 完成加载
    fireEvent.click(screen.getByText("完成加载"));

    await waitFor(() => {
      expect(screen.getByTestId("canteen-hall")).toBeInTheDocument();
    });

    // 点击视频打开弹窗
    fireEvent.click(screen.getByText("点击视频"));

    await waitFor(() => {
      expect(screen.getByTestId("video-modal")).toBeInTheDocument();
    });

    // 关闭弹窗
    fireEvent.click(screen.getByText("关闭"));

    // 验证弹窗关闭
    await waitFor(() => {
      expect(screen.queryByTestId("video-modal")).not.toBeInTheDocument();
    });
  });

  /**
   * 测试用例 TC-007: 水平弹幕显示测试
   * 测试目标：验证加载完成后显示水平弹幕
   */
  test("TC-007: 水平弹幕显示测试", async () => {
    render(<YuxiaocPage />);

    // 完成加载
    fireEvent.click(screen.getByText("完成加载"));

    // 等待弹幕显示延迟
    jest.advanceTimersByTime(600);

    await waitFor(() => {
      expect(screen.getByTestId("horizontal-danmaku")).toBeInTheDocument();
      expect(screen.getByTestId("horizontal-danmaku")).toHaveAttribute("data-visible", "true");
    });
  });

  /**
   * 测试用例 TC-008: 页面标题测试
   * 测试目标：验证页面标题和meta标签
   */
  test("TC-008: 页面标题测试", async () => {
    render(<YuxiaocPage />);

    // 完成加载
    fireEvent.click(screen.getByText("完成加载"));

    // 验证标题存在
    await waitFor(() => {
      expect(document.title).toBe("C皇驾到 · 余小C粉丝站");
    });
  });

  /**
   * 测试用例 TC-009: 页脚渲染测试
   * 测试目标：验证页脚正确渲染
   */
  test("TC-009: 页脚渲染测试", async () => {
    render(<YuxiaocPage />);

    // 完成加载
    fireEvent.click(screen.getByText("完成加载"));

    // 验证页脚内容
    await waitFor(() => {
      expect(screen.getByText(/C皇驾到 · 混与躺轮回不止/)).toBeInTheDocument();
      expect(screen.getByText("本站点为粉丝自制，仅供娱乐")).toBeInTheDocument();
      expect(screen.getByText(/斗鱼直播间 1126960/)).toBeInTheDocument();
    });
  });

  /**
   * 测试用例 TC-010: 所有子组件接收正确主题测试
   * 测试目标：验证所有子组件接收正确的theme属性
   */
  test("TC-010: 所有子组件接收正确主题测试", async () => {
    render(<YuxiaocPage />);

    // 完成加载
    fireEvent.click(screen.getByText("完成加载"));

    await waitFor(() => {
      // 验证所有子组件都显示blood主题（默认）
      expect(screen.getByTestId("header-theme")).toHaveTextContent("blood");
      expect(screen.getByTestId("hero-section")).toHaveTextContent("blood");
      expect(screen.getByTestId("title-hall")).toHaveTextContent("blood");
      expect(screen.getByTestId("canteen-hall")).toHaveTextContent("blood");
      expect(screen.getByTestId("cvoice-archive")).toHaveTextContent("blood");
      expect(screen.getByTestId("danmaku-tower")).toHaveTextContent("blood");
    });
  });

  /**
   * 测试用例 TC-011: 主题切换后所有子组件更新测试
   * 测试目标：验证主题切换后所有子组件更新
   */
  test("TC-011: 主题切换后所有子组件更新测试", async () => {
    render(<YuxiaocPage />);

    // 完成加载
    fireEvent.click(screen.getByText("完成加载"));

    await waitFor(() => {
      expect(screen.getByTestId("header-theme")).toHaveTextContent("blood");
    });

    // 切换主题
    fireEvent.click(screen.getByText("切换主题"));

    await waitFor(() => {
      // 验证所有子组件都更新为mix主题
      expect(screen.getByTestId("header-theme")).toHaveTextContent("mix");
      expect(screen.getByTestId("hero-section")).toHaveTextContent("mix");
      expect(screen.getByTestId("title-hall")).toHaveTextContent("mix");
      expect(screen.getByTestId("canteen-hall")).toHaveTextContent("mix");
      expect(screen.getByTestId("cvoice-archive")).toHaveTextContent("mix");
      expect(screen.getByTestId("danmaku-tower")).toHaveTextContent("mix");
    });
  });

  /**
   * 测试用例 TC-012: 视频弹窗接收正确主题测试
   * 测试目标：验证视频弹窗接收正确的theme属性
   */
  test("TC-012: 视频弹窗接收正确主题测试", async () => {
    render(<YuxiaocPage />);

    // 完成加载
    fireEvent.click(screen.getByText("完成加载"));

    await waitFor(() => {
      expect(screen.getByTestId("canteen-hall")).toBeInTheDocument();
    });

    // 点击视频打开弹窗
    fireEvent.click(screen.getByText("点击视频"));

    await waitFor(() => {
      expect(screen.getByTestId("video-modal")).toBeInTheDocument();
      // 验证弹窗显示blood主题（默认）
      expect(screen.getByTestId("video-modal")).toHaveTextContent("blood");
    });
  });

  /**
   * 测试用例 TC-013: 页面布局结构测试
   * 测试目标：验证页面整体布局结构正确
   */
  test("TC-013: 页面布局结构测试", async () => {
    const { container } = render(<YuxiaocPage />);

    // 完成加载
    fireEvent.click(screen.getByText("完成加载"));

    await waitFor(() => {
      // 验证主要结构元素存在
      const mainElement = container.querySelector("main");
      expect(mainElement).toBeInTheDocument();
      const footerElement = container.querySelector("footer");
      expect(footerElement).toBeInTheDocument();
    });
  });

  /**
   * 测试用例 TC-014: CRT扫描线效果测试
   * 测试目标：验证CRT扫描线效果元素存在
   */
  test("TC-014: CRT扫描线效果测试", async () => {
    const { container } = render(<YuxiaocPage />);

    // 完成加载
    fireEvent.click(screen.getByText("完成加载"));

    await waitFor(() => {
      // 验证CRT覆盖层存在
      expect(container.querySelector(".crt-overlay")).toBeInTheDocument();
    });
  });

  /**
   * 测试用例 TC-015: 连续主题切换测试
   * 测试目标：验证连续切换主题功能正常
   */
  test("TC-015: 连续主题切换测试", async () => {
    render(<YuxiaocPage />);

    // 完成加载
    fireEvent.click(screen.getByText("完成加载"));

    await waitFor(() => {
      expect(screen.getByTestId("header-theme")).toHaveTextContent("blood");
    });

    // 第一次切换
    fireEvent.click(screen.getByText("切换主题"));
    await waitFor(() => {
      expect(screen.getByTestId("header-theme")).toHaveTextContent("mix");
    });

    // 第二次切换
    fireEvent.click(screen.getByText("切换主题"));
    await waitFor(() => {
      expect(screen.getByTestId("header-theme")).toHaveTextContent("blood");
    });

    // 第三次切换
    fireEvent.click(screen.getByText("切换主题"));
    await waitFor(() => {
      expect(screen.getByTestId("header-theme")).toHaveTextContent("mix");
    });
  });

  /**
   * 测试用例 TC-016: 单一布局结构测试
   * 测试目标：验证使用单一布局，不再区分桌面端和移动端
   */
  test("TC-016: 单一布局结构测试", async () => {
    const { container } = render(<YuxiaocPage />);

    // 完成加载
    fireEvent.click(screen.getByText("完成加载"));

    await waitFor(() => {
      // 验证主内容区域存在
      const mainContent = container.querySelector(".main-content");
      expect(mainContent).toBeInTheDocument();
      
      // 验证不再有hidden md:block的容器
      const hiddenMdBlock = container.querySelector(".hidden.md\\:block");
      expect(hiddenMdBlock).not.toBeInTheDocument();
      
      // 验证不再有md:hidden的容器
      const mdHidden = container.querySelector(".md\\:hidden");
      expect(mdHidden).not.toBeInTheDocument();
    });
  });
});

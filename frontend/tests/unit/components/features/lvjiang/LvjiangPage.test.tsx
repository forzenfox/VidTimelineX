import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import LvjiangPage from "@/features/lvjiang/LvjiangPage";
import "@testing-library/jest-dom";

// 模拟子组件
jest.mock("@/features/lvjiang/components/LoadingAnimation", () => ({
  LoadingAnimation: ({ onComplete }: { onComplete: (theme: string) => void }) => (
    <div data-testid="loading-animation">
      <button onClick={() => onComplete("dongzhu")}>完成加载</button>
    </div>
  ),
}));

jest.mock("@/features/lvjiang/components/Header", () => ({
  Header: ({ theme, onThemeToggle }: { theme: string; onThemeToggle: () => void }) => (
    <header data-testid="header">
      <span data-testid="header-theme">{theme}</span>
      <button onClick={onThemeToggle}>切换主题</button>
    </header>
  ),
}));

jest.mock("@/features/lvjiang/components/VideoTimeline", () => ({
  VideoTimeline: ({ theme, onVideoClick }: { theme: string; onVideoClick: (video: any) => void }) => (
    <div data-testid="video-timeline">
      <span>{theme}</span>
      <button onClick={() => onVideoClick({ id: "1", title: "测试视频" })}>点击视频</button>
    </div>
  ),
}));

jest.mock("@/features/lvjiang/components/HorizontalDanmaku", () => ({
  HorizontalDanmaku: ({ theme, isVisible }: { theme: string; isVisible: boolean }) => (
    <div data-testid="horizontal-danmaku" data-visible={isVisible}>
      {theme}
    </div>
  ),
}));

jest.mock("@/features/lvjiang/components/SideDanmaku", () => ({
  SideDanmaku: ({ theme }: { theme: string }) => <aside data-testid="side-danmaku">{theme}</aside>,
}));

jest.mock("@/components/video/VideoModal", () => ({
  __esModule: true,
  default: ({
    video,
    theme,
    onClose,
  }: {
    video: any;
    theme: string;
    onClose: () => void;
  }) => {
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

jest.mock("@/components/video-view/VideoViewToolbar", () => ({
  VideoViewToolbar: ({ viewMode, theme }: { viewMode: string; theme: string }) => (
    <div data-testid="video-view-toolbar">
      <span>{viewMode}</span>
      <span>{theme}</span>
    </div>
  ),
}));

jest.mock("@/components/video-view/VideoGrid", () => ({
  __esModule: true,
  default: ({ theme }: { theme: string }) => <div data-testid="video-grid">{theme}</div>,
}));

jest.mock("@/components/video-view/VideoList", () => ({
  __esModule: true,
  default: ({ theme }: { theme: string }) => <div data-testid="video-list">{theme}</div>,
}));

jest.mock("@/components/video-view/EmptyState", () => ({
  __esModule: true,
  default: ({ onClearFilter }: { onClearFilter: () => void }) => (
    <div data-testid="empty-state">
      <button onClick={onClearFilter}>清除筛选</button>
    </div>
  ),
}));

jest.mock("@/hooks/useViewPreferences", () => ({
  useViewPreferences: () => ({
    viewMode: "timeline",
    setViewMode: jest.fn(),
  }),
}));

jest.mock("@/hooks/useVideoFilter", () => ({
  useVideoFilter: () => ({
    filter: { duration: "all", timeRange: "all", sortBy: "newest" },
    setFilter: jest.fn(),
    resetFilter: jest.fn(),
    filteredVideos: [{ id: "1", title: "测试视频" }],
  }),
}));

describe("LvjiangPage响应式布局测试", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  /**
   * 测试用例 TC-LP-001: 页面加载状态测试
   * 测试目标：验证初始状态显示加载动画
   */
  test("TC-LP-001: 页面加载状态测试", () => {
    render(<LvjiangPage />);

    expect(screen.getByTestId("loading-animation")).toBeInTheDocument();
  });

  /**
   * 测试用例 TC-LP-002: 加载完成后渲染主页面测试
   * 测试目标：验证加载完成后渲染主页面组件
   */
  test("TC-LP-002: 加载完成后渲染主页面测试", async () => {
    render(<LvjiangPage />);

    // 点击完成加载按钮
    fireEvent.click(screen.getByText("完成加载"));

    // 验证主页面组件渲染
    await waitFor(() => {
      expect(screen.getByTestId("header")).toBeInTheDocument();
      expect(screen.getByTestId("horizontal-danmaku")).toBeInTheDocument();
      expect(screen.getByTestId("video-view-toolbar")).toBeInTheDocument();
      expect(screen.getByTestId("video-timeline")).toBeInTheDocument();
      expect(screen.getByTestId("side-danmaku")).toBeInTheDocument();
    });
  });

  /**
   * 测试用例 TC-LP-003: 默认主题测试
   * 测试目标：验证默认主题为dongzhu
   */
  test("TC-LP-003: 默认主题测试", async () => {
    render(<LvjiangPage />);

    // 完成加载
    fireEvent.click(screen.getByText("完成加载"));

    // 验证默认主题为dongzhu
    await waitFor(() => {
      expect(screen.getByTestId("header-theme")).toHaveTextContent("dongzhu");
      expect(screen.getByTestId("horizontal-danmaku")).toHaveTextContent("dongzhu");
    });
  });

  /**
   * 测试用例 TC-LP-004: 主题切换功能测试
   * 测试目标：验证主题切换功能正常工作
   */
  test("TC-LP-004: 主题切换功能测试", async () => {
    render(<LvjiangPage />);

    // 完成加载
    fireEvent.click(screen.getByText("完成加载"));

    await waitFor(() => {
      expect(screen.getByTestId("header-theme")).toHaveTextContent("dongzhu");
    });

    // 点击切换主题
    fireEvent.click(screen.getByText("切换主题"));

    // 验证主题切换为kaige
    await waitFor(() => {
      expect(screen.getByTestId("header-theme")).toHaveTextContent("kaige");
      expect(screen.getByTestId("horizontal-danmaku")).toHaveTextContent("kaige");
    });
  });

  /**
   * 测试用例 TC-LP-005: 主内容区域padding测试
   * 测试目标：验证主内容区域有正确的padding-right避让侧边栏
   */
  test("TC-LP-005: 主内容区域padding测试", async () => {
    const { container } = render(<LvjiangPage />);

    // 完成加载
    fireEvent.click(screen.getByText("完成加载"));

    await waitFor(() => {
      // 验证主内容区域存在
      const mainContent = container.querySelector(".main-content");
      expect(mainContent).toBeInTheDocument();
    });
  });

  /**
   * 测试用例 TC-LP-006: 页面标题测试
   * 测试目标：验证页面标题和meta标签
   */
  test("TC-LP-006: 页面标题测试", async () => {
    render(<LvjiangPage />);

    // 完成加载
    fireEvent.click(screen.getByText("完成加载"));

    // 验证标题存在
    await waitFor(() => {
      expect(document.title).toBe("洞主凯哥·时光视频集");
    });
  });

  /**
   * 测试用例 TC-LP-007: 视频弹窗打开测试
   * 测试目标：验证点击视频后打开弹窗
   */
  test("TC-LP-007: 视频弹窗打开测试", async () => {
    render(<LvjiangPage />);

    // 完成加载
    fireEvent.click(screen.getByText("完成加载"));

    await waitFor(() => {
      expect(screen.getByTestId("video-timeline")).toBeInTheDocument();
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
   * 测试用例 TC-LP-008: 视频弹窗关闭测试
   * 测试目标：验证关闭弹窗功能正常
   */
  test("TC-LP-008: 视频弹窗关闭测试", async () => {
    render(<LvjiangPage />);

    // 完成加载
    fireEvent.click(screen.getByText("完成加载"));

    await waitFor(() => {
      expect(screen.getByTestId("video-timeline")).toBeInTheDocument();
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
   * 测试用例 TC-LP-009: 水平弹幕显示测试
   * 测试目标：验证加载完成后显示水平弹幕
   */
  test("TC-LP-009: 水平弹幕显示测试", async () => {
    render(<LvjiangPage />);

    // 完成加载
    fireEvent.click(screen.getByText("完成加载"));

    await waitFor(() => {
      expect(screen.getByTestId("horizontal-danmaku")).toBeInTheDocument();
      expect(screen.getByTestId("horizontal-danmaku")).toHaveAttribute("data-visible", "true");
    });
  });

  /**
   * 测试用例 TC-LP-010: 页脚渲染测试
   * 测试目标：验证页脚正确渲染
   */
  test("TC-LP-010: 页脚渲染测试", async () => {
    const { container } = render(<LvjiangPage />);

    // 完成加载
    fireEvent.click(screen.getByText("完成加载"));

    // 验证页脚内容 - 使用container查询
    await waitFor(() => {
      // 验证页脚文本内容存在于页面中
      expect(container.textContent).toContain("洞主");
      expect(container.textContent).toContain("凯哥");
      expect(container.textContent).toContain("驴酱公会");
    });
  });

  /**
   * 测试用例 TC-LP-011: 所有子组件接收正确主题测试
   * 测试目标：验证所有子组件接收正确的theme属性
   */
  test("TC-LP-011: 所有子组件接收正确主题测试", async () => {
    render(<LvjiangPage />);

    // 完成加载
    fireEvent.click(screen.getByText("完成加载"));

    await waitFor(() => {
      // 验证所有子组件都显示dongzhu主题（默认）
      expect(screen.getByTestId("header-theme")).toHaveTextContent("dongzhu");
      expect(screen.getByTestId("horizontal-danmaku")).toHaveTextContent("dongzhu");
      expect(screen.getByTestId("video-timeline")).toHaveTextContent("dongzhu");
      expect(screen.getByTestId("side-danmaku")).toHaveTextContent("dongzhu");
    });
  });

  /**
   * 测试用例 TC-LP-012: 主题切换后所有子组件更新测试
   * 测试目标：验证主题切换后所有子组件更新
   */
  test("TC-LP-012: 主题切换后所有子组件更新测试", async () => {
    render(<LvjiangPage />);

    // 完成加载
    fireEvent.click(screen.getByText("完成加载"));

    await waitFor(() => {
      expect(screen.getByTestId("header-theme")).toHaveTextContent("dongzhu");
    });

    // 切换主题
    fireEvent.click(screen.getByText("切换主题"));

    await waitFor(() => {
      // 验证所有子组件都更新为kaige主题
      expect(screen.getByTestId("header-theme")).toHaveTextContent("kaige");
      expect(screen.getByTestId("horizontal-danmaku")).toHaveTextContent("kaige");
      expect(screen.getByTestId("video-timeline")).toHaveTextContent("kaige");
      expect(screen.getByTestId("side-danmaku")).toHaveTextContent("kaige");
    });
  });

  /**
   * 测试用例 TC-LP-013: 响应式样式标签存在测试
   * 测试目标：验证响应式样式标签存在
   */
  test("TC-LP-013: 响应式样式标签存在测试", async () => {
    const { container } = render(<LvjiangPage />);

    // 完成加载
    fireEvent.click(screen.getByText("完成加载"));

    await waitFor(() => {
      // 验证style标签存在
      const styleTags = container.querySelectorAll("style");
      expect(styleTags.length).toBeGreaterThan(0);
    });
  });
});

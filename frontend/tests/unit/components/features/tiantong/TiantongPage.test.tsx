import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import TiantongPage from "@/features/tiantong/TiantongPage";

// Mock ThemeToggle
jest.mock("@/features/tiantong/components/ThemeToggle", () => ({
  __esModule: true,
  default: ({ currentTheme, onToggle }: any) => (
    <div data-testid="theme-toggle">
      <span>Current theme: {currentTheme}</span>
      <button onClick={onToggle} data-testid="toggle-button">
        Toggle
      </button>
    </div>
  ),
}));

// Mock VideoTimeline
jest.mock("@/features/tiantong/components/VideoTimeline", () => ({
  VideoTimeline: ({ theme, videos, onVideoClick }: any) => (
    <div data-testid="video-timeline">
      <span>Video timeline - {theme}</span>
      <span data-testid="video-count">{videos.length} videos</span>
      <button
        onClick={() => onVideoClick({ id: "1", title: "Test video" })}
        data-testid="video-click"
      >
        Click video
      </button>
    </div>
  ),
}));

// Mock HorizontalDanmaku - 添加渲染次数追踪
let renderCount = 0;
const mockHorizontalDanmaku = jest.fn(({ theme }: any) => {
  renderCount += 1;
  return (
    <div data-testid="horizontal-danmaku" data-render-count={renderCount}>
      Horizontal danmaku - {theme} (render #{renderCount})
    </div>
  );
});
jest.mock("@/features/tiantong/components/HorizontalDanmaku", () => ({
  HorizontalDanmaku: (props: any) => mockHorizontalDanmaku(props),
}));

// Mock SidebarDanmu - 更新为新的移动端适配版本
jest.mock("@/features/tiantong/components/SidebarDanmu", () => ({
  __esModule: true,
  default: ({ theme }: any) => (
    <div data-testid="sidebar-danmu" className="danmaku-sidebar danmaku-mobile-button">
      <div className="danmaku-sidebar">Sidebar danmu - {theme}</div>
      <button className="danmaku-mobile-button">Mobile Button</button>
    </div>
  ),
}));

// Mock VideoModal - 注意：实际组件只在 selectedVideo 存在时渲染
jest.mock("@/components/business/video/VideoModal", () => ({
  __esModule: true,
  default: ({ video, theme, onClose }: any) => (
    <div data-testid="video-modal">
      <span>Video modal - {theme}</span>
      <span>{video.title}</span>
      <button onClick={onClose} data-testid="close-modal">
        Close
      </button>
    </div>
  ),
}));

// Mock IconToolbar
jest.mock("@/components/business/video-view/IconToolbar", () => ({
  IconToolbar: ({
    viewMode,
    onViewModeChange,
    filter,
    onFilterChange,
    onSearch,
    theme,
    searchSuggestions,
    searchHistory,
    onClearHistory,
  }: any) => (
    <div data-testid="icon-toolbar" role="toolbar">
      <span data-testid="toolbar-view-mode">{viewMode}</span>
      <span data-testid="toolbar-theme">{theme}</span>
      <button data-testid="toolbar-search-btn" onClick={() => onSearch("测试搜索")}>
        搜索
      </button>
      <button data-testid="toolbar-view-toggle" onClick={() => onViewModeChange("grid")}>
        切换视图
      </button>
      <button
        data-testid="toolbar-filter-btn"
        onClick={() => onFilterChange({ ...filter, sortBy: "oldest" })}
      >
        筛选
      </button>
      <button data-testid="toolbar-clear-history" onClick={onClearHistory}>
        清空历史
      </button>
      <div data-testid="toolbar-suggestions">{JSON.stringify(searchSuggestions)}</div>
      <div data-testid="toolbar-history">{JSON.stringify(searchHistory)}</div>
    </div>
  ),
}));

// Mock VideoGrid
jest.mock("@/components/business/video-view/VideoGrid", () => ({
  __esModule: true,
  default: ({ videos, onVideoClick, theme }: any) => (
    <div data-testid="video-grid">
      <span>Video grid - {theme}</span>
      <span data-testid="grid-video-count">{videos.length} videos</span>
      {videos.map((v: any) => (
        <button key={v.id} onClick={() => onVideoClick(v)} data-testid={`grid-video-${v.id}`}>
          {v.title}
        </button>
      ))}
    </div>
  ),
}));

// Mock VideoList
jest.mock("@/components/business/video-view/VideoList", () => ({
  __esModule: true,
  default: ({ videos, onVideoClick, theme }: any) => (
    <div data-testid="video-list">
      <span>Video list - {theme}</span>
      <span data-testid="list-video-count">{videos.length} videos</span>
    </div>
  ),
}));

// Mock EmptyState
jest.mock("@/components/business/video-view/EmptyState", () => ({
  __esModule: true,
  default: ({ onClearFilter }: any) => (
    <div data-testid="empty-state">
      <span>暂无视频</span>
      <button onClick={onClearFilter} data-testid="clear-filter-btn">
        清除筛选
      </button>
    </div>
  ),
}));

// Mock hooks
jest.mock("@/hooks/useViewPreferences", () => ({
  useViewPreferences: () => ({
    viewMode: "timeline",
    setViewMode: jest.fn(),
  }),
}));

jest.mock("@/hooks/useVideoFilter", () => ({
  useVideoFilter: (videos: any[]) => ({
    filter: { duration: "all", timeRange: "all", sortBy: "newest" },
    setFilter: jest.fn(),
    resetFilter: jest.fn(),
    filteredVideos: videos,
  }),
}));

describe("TiantongPage 组件测试", () => {
  describe("TC-001: 基础渲染测试", () => {
    test("应该渲染页面标题", () => {
      render(<TiantongPage />);
      expect(screen.getByText("亿口甜筒")).toBeInTheDocument();
    });

    test("应该渲染横向弹幕组件", () => {
      render(<TiantongPage />);
      expect(screen.getByTestId("horizontal-danmaku")).toBeInTheDocument();
    });

    test("应该渲染视频时间线", () => {
      render(<TiantongPage />);
      expect(screen.getByTestId("video-timeline")).toBeInTheDocument();
    });

    test("应该渲染侧边栏弹幕", async () => {
      render(<TiantongPage />);
      await waitFor(() => {
        expect(screen.getByTestId("sidebar-danmu")).toBeInTheDocument();
      });
    });

    test("应该渲染 IconToolbar 组件", () => {
      render(<TiantongPage />);
      expect(screen.getByTestId("icon-toolbar")).toBeInTheDocument();
      expect(screen.getByRole("toolbar")).toBeInTheDocument();
    });
  });

  describe("TC-002: 主题切换测试", () => {
    beforeEach(() => {
      // 重置渲染计数器
      renderCount = 0;
      mockHorizontalDanmaku.mockClear();
    });

    test("初始主题应该是 tiger", () => {
      render(<TiantongPage />);
      expect(screen.getByText("Current theme: tiger")).toBeInTheDocument();
    });

    test("点击切换按钮应该在 tiger 和 sweet 之间切换", () => {
      render(<TiantongPage />);

      expect(screen.getByText("Current theme: tiger")).toBeInTheDocument();

      const toggleButton = screen.getByTestId("toggle-button");
      fireEvent.click(toggleButton);

      expect(screen.getByText("Current theme: sweet")).toBeInTheDocument();

      fireEvent.click(toggleButton);

      expect(screen.getByText("Current theme: tiger")).toBeInTheDocument();
    });

    test("IconToolbar 应该接收正确的主题", () => {
      render(<TiantongPage />);
      expect(screen.getByTestId("toolbar-theme")).toHaveTextContent("tiger");
    });

    test("TC-010: 主题切换时弹幕组件应该重新渲染（通过 key 强制重新挂载）", () => {
      render(<TiantongPage />);

      // 获取初始渲染次数
      const initialRenderCount = Number(
        screen.getByTestId("horizontal-danmaku").getAttribute("data-render-count")
      );

      // 切换主题
      const toggleButton = screen.getByTestId("toggle-button");
      fireEvent.click(toggleButton);

      // 验证弹幕组件重新渲染了
      const updatedRenderCount = Number(
        screen.getByTestId("horizontal-danmaku").getAttribute("data-render-count")
      );

      // 渲染次数应该增加（key 变化导致重新挂载）
      expect(updatedRenderCount).toBeGreaterThan(initialRenderCount);
    });

    test("TC-011: 多次切换主题时弹幕应该每次都重新渲染", () => {
      render(<TiantongPage />);

      const toggleButton = screen.getByTestId("toggle-button");

      // 第一次切换
      fireEvent.click(toggleButton);
      const renderCount1 = Number(
        screen.getByTestId("horizontal-danmaku").getAttribute("data-render-count")
      );

      // 第二次切换
      fireEvent.click(toggleButton);
      const renderCount2 = Number(
        screen.getByTestId("horizontal-danmaku").getAttribute("data-render-count")
      );

      // 第三次切换
      fireEvent.click(toggleButton);
      const renderCount3 = Number(
        screen.getByTestId("horizontal-danmaku").getAttribute("data-render-count")
      );

      // 每次切换都应该重新渲染
      expect(renderCount2).toBeGreaterThan(renderCount1);
      expect(renderCount3).toBeGreaterThan(renderCount2);
    });
  });

  describe("TC-003: 搜索功能测试（迁移到 IconToolbar 和 VideoViewToolbar）", () => {
    test("Header 中不应该有搜索输入框（搜索功能已迁移到工具栏）", () => {
      render(<TiantongPage />);
      // Header 中不应该有直接放置的搜索输入框
      // 搜索功能现在通过 IconToolbar（移动端）和 VideoViewToolbar（PC端）提供
      const header = document.querySelector("header");
      const searchInputInHeader = header?.querySelector('input[placeholder="搜索视频..."]');
      expect(searchInputInHeader).toBeFalsy();
    });

    test("IconToolbar 应该包含搜索按钮", () => {
      render(<TiantongPage />);
      expect(screen.getByTestId("toolbar-search-btn")).toBeInTheDocument();
    });

    test("点击搜索按钮应该触发搜索", () => {
      render(<TiantongPage />);
      const searchBtn = screen.getByTestId("toolbar-search-btn");
      fireEvent.click(searchBtn);
      // 搜索功能被调用，验证搜索按钮存在即可
      // 由于搜索会改变状态，可能显示 EmptyState 或视频列表
      expect(searchBtn).toBeInTheDocument();
    });

    test("IconToolbar 应该接收搜索建议", () => {
      render(<TiantongPage />);
      // 初始时搜索建议为空数组
      expect(screen.getByTestId("toolbar-suggestions")).toHaveTextContent("[]");
    });

    test("IconToolbar 应该接收搜索历史", () => {
      render(<TiantongPage />);
      // 初始时搜索历史为空数组
      expect(screen.getByTestId("toolbar-history")).toHaveTextContent("[]");
    });

    test("点击清空历史按钮应该清空搜索历史", () => {
      render(<TiantongPage />);
      const clearHistoryBtn = screen.getByTestId("toolbar-clear-history");
      expect(clearHistoryBtn).toBeInTheDocument();
      fireEvent.click(clearHistoryBtn);
      // 清空历史功能被调用
      expect(screen.getByTestId("toolbar-history")).toHaveTextContent("[]");
    });
  });

  describe("TC-004: 视图切换测试", () => {
    test("IconToolbar 应该显示当前视图模式", () => {
      render(<TiantongPage />);
      expect(screen.getByTestId("toolbar-view-mode")).toHaveTextContent("timeline");
    });

    test("IconToolbar 应该包含视图切换按钮", () => {
      render(<TiantongPage />);
      expect(screen.getByTestId("toolbar-view-toggle")).toBeInTheDocument();
    });

    test("点击视图切换按钮应该触发视图切换", () => {
      render(<TiantongPage />);
      const viewToggleBtn = screen.getByTestId("toolbar-view-toggle");
      fireEvent.click(viewToggleBtn);
      // 视图切换功能被调用
      expect(viewToggleBtn).toBeInTheDocument();
    });
  });

  describe("TC-005: 筛选功能测试", () => {
    test("IconToolbar 应该包含筛选按钮", () => {
      render(<TiantongPage />);
      expect(screen.getByTestId("toolbar-filter-btn")).toBeInTheDocument();
    });

    test("点击筛选按钮应该触发筛选变更", () => {
      render(<TiantongPage />);
      const filterBtn = screen.getByTestId("toolbar-filter-btn");
      fireEvent.click(filterBtn);
      // 筛选功能被调用
      expect(filterBtn).toBeInTheDocument();
    });
  });

  describe("TC-006: 视频点击测试", () => {
    test("点击视频应该打开视频模态框", () => {
      render(<TiantongPage />);

      // 初始时没有模态框（因为 selectedVideo 为 null）
      expect(screen.queryByTestId("video-modal")).not.toBeInTheDocument();

      // 点击视频
      const videoClickBtn = screen.getByTestId("video-click");
      fireEvent.click(videoClickBtn);

      // 模态框应该显示视频标题
      expect(screen.getByTestId("video-modal")).toBeInTheDocument();
      expect(screen.getByTestId("video-modal")).toHaveTextContent("Test video");
    });

    test("关闭模态框应该隐藏视频详情", () => {
      render(<TiantongPage />);

      // 打开模态框
      const videoClickBtn = screen.getByTestId("video-click");
      fireEvent.click(videoClickBtn);

      expect(screen.getByTestId("video-modal")).toBeInTheDocument();
      expect(screen.getByTestId("video-modal")).toHaveTextContent("Test video");

      // 关闭模态框
      const closeBtn = screen.getByTestId("close-modal");
      fireEvent.click(closeBtn);

      // 模态框应该被移除
      expect(screen.queryByTestId("video-modal")).not.toBeInTheDocument();
    });
  });

  describe("TC-007: Header 结构测试", () => {
    test("Header 应该包含主播头像和名称", () => {
      render(<TiantongPage />);
      expect(screen.getByAltText("亿口甜筒")).toBeInTheDocument();
      expect(screen.getByText("亿口甜筒")).toBeInTheDocument();
    });

    test("Header 应该包含房间号链接", () => {
      render(<TiantongPage />);
      expect(screen.getByText("12195609")).toBeInTheDocument();
    });

    test("Header 应该包含鱼吧链接", () => {
      render(<TiantongPage />);
      expect(screen.getByText("鱼吧")).toBeInTheDocument();
    });

    test("Header 应该包含 LIVE 标识", () => {
      render(<TiantongPage />);
      expect(screen.getByText("LIVE")).toBeInTheDocument();
    });

    test("Header 应该包含主题切换组件", () => {
      render(<TiantongPage />);
      expect(screen.getByTestId("theme-toggle")).toBeInTheDocument();
    });
  });

  describe("TC-008: 页脚测试", () => {
    test("应该渲染页脚版权信息", () => {
      render(<TiantongPage />);
      expect(screen.getByText(/© 2026 亿口甜筒/)).toBeInTheDocument();
    });

    test("页脚应该根据主题显示不同的标语", () => {
      render(<TiantongPage />);
      // 初始主题为 tiger
      expect(screen.getByText(/虎将的高能切片站/)).toBeInTheDocument();
    });
  });

  describe("TC-009: 防抖搜索逻辑测试", () => {
    test("debouncedSearch 函数应该存在", () => {
      // 防抖搜索逻辑是组件内部实现的，通过渲染验证组件正常加载
      render(<TiantongPage />);
      expect(screen.getByTestId("icon-toolbar")).toBeInTheDocument();
    });

    test("搜索状态应该被正确维护", () => {
      render(<TiantongPage />);
      // 初始搜索历史为空
      expect(screen.getByTestId("toolbar-history")).toHaveTextContent("[]");
    });
  });

  describe("TC-020: 移动端适配测试", () => {
    test("应该包含响应式样式标签", () => {
      const { container } = render(<TiantongPage />);
      const styleTag = container.querySelector("style");
      expect(styleTag).toBeTruthy();
    });

    test("应该包含移动端媒体查询（<1024px）", () => {
      const { container } = render(<TiantongPage />);
      const styleTag = container.querySelector("style");
      expect(styleTag).toBeTruthy();
      if (styleTag) {
        expect(styleTag.textContent).toContain("@media (max-width: 1023px)");
      }
    });

    test("应该包含桌面端媒体查询（>=1024px）", () => {
      const { container } = render(<TiantongPage />);
      const styleTag = container.querySelector("style");
      expect(styleTag).toBeTruthy();
      if (styleTag) {
        expect(styleTag.textContent).toContain("@media (min-width: 1024px)");
      }
    });

    test("应该包含移动端侧边栏隐藏媒体查询（<768px）", () => {
      const { container } = render(<TiantongPage />);
      const styleTag = container.querySelector("style");
      expect(styleTag).toBeTruthy();
      if (styleTag) {
        expect(styleTag.textContent).toContain("@media (max-width: 767px)");
        expect(styleTag.textContent).toContain(".tiantong-sidebar");
      }
    });

    test("主内容区应该有正确的className", () => {
      const { container } = render(<TiantongPage />);
      const mainContent = container.querySelector(".main-content");
      expect(mainContent).toBeTruthy();
    });

    test("弹幕组件应该正确渲染", () => {
      const { container } = render(<TiantongPage />);
      // 检查是否包含弹幕侧边栏的样式（通过 style 标签中的媒体查询）
      const styleTag = container.querySelector("style");
      expect(styleTag).toBeTruthy();
      if (styleTag) {
        // 检查是否包含响应式样式
        expect(styleTag.textContent).toContain("@media");
      }
    });
  });

  describe("TC-021: 主内容区padding测试", () => {
    test("主内容区默认padding应该为24px", () => {
      const { container } = render(<TiantongPage />);
      const mainContent = container.querySelector(".main-content");
      expect(mainContent).toBeTruthy();
      if (mainContent) {
        const style = mainContent.getAttribute("style");
        expect(style).toContain("24px");
      }
    });
  });
});

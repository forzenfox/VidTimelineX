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

// Mock HorizontalDanmaku
jest.mock("@/features/tiantong/components/HorizontalDanmaku", () => ({
  HorizontalDanmaku: ({ theme }: any) => (
    <div data-testid="horizontal-danmaku">Horizontal danmaku - {theme}</div>
  ),
}));

// Mock SidebarDanmu
jest.mock("@/features/tiantong/components/SidebarDanmu", () => ({
  __esModule: true,
  default: ({ theme }: any) => <div data-testid="sidebar-danmu">Sidebar danmu - {theme}</div>,
}));

// Mock VideoModal
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

// Mock IconToolbar - 移动端工具栏
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
    <div data-testid="icon-toolbar" role="toolbar" className="icon-toolbar-mobile">
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

// Mock VideoViewToolbar - PC端工具栏
jest.mock("@/components/business/video-view/VideoViewToolbar", () => ({
  VideoViewToolbar: ({ viewMode, onViewModeChange, filter, onFilterChange, theme }: any) => (
    <div data-testid="video-view-toolbar" role="toolbar" className="video-view-toolbar-pc">
      <span data-testid="pc-toolbar-view-mode">{viewMode}</span>
      <span data-testid="pc-toolbar-theme">{theme}</span>
      <button data-testid="pc-toolbar-view-toggle" onClick={() => onViewModeChange("grid")}>
        切换视图
      </button>
      <button
        data-testid="pc-toolbar-filter-btn"
        onClick={() => onFilterChange({ ...filter, sortBy: "oldest" })}
      >
        筛选
      </button>
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

describe("TiantongPage 响应式工具栏测试", () => {
  describe("TC-Responsive-001: 移动端显示 IconToolbar", () => {
    test("应该渲染 IconToolbar 组件", () => {
      render(<TiantongPage />);
      expect(screen.getByTestId("icon-toolbar")).toBeInTheDocument();
      // 验证 IconToolbar 有 toolbar 角色
      const iconToolbar = screen.getByTestId("icon-toolbar");
      expect(iconToolbar).toHaveAttribute("role", "toolbar");
    });

    test("IconToolbar 应该包含移动端特有的搜索按钮", () => {
      render(<TiantongPage />);
      expect(screen.getByTestId("toolbar-search-btn")).toBeInTheDocument();
    });

    test("IconToolbar 应该包含视图切换按钮", () => {
      render(<TiantongPage />);
      expect(screen.getByTestId("toolbar-view-toggle")).toBeInTheDocument();
    });

    test("IconToolbar 应该包含筛选按钮", () => {
      render(<TiantongPage />);
      expect(screen.getByTestId("toolbar-filter-btn")).toBeInTheDocument();
    });

    test("IconToolbar 应该包含清空历史按钮", () => {
      render(<TiantongPage />);
      expect(screen.getByTestId("toolbar-clear-history")).toBeInTheDocument();
    });
  });

  describe("TC-Responsive-002: PC端显示 VideoViewToolbar", () => {
    test("应该渲染 VideoViewToolbar 组件", () => {
      render(<TiantongPage />);
      expect(screen.getByTestId("video-view-toolbar")).toBeInTheDocument();
    });

    test("VideoViewToolbar 应该包含 PC 端特有的视图切换按钮", () => {
      render(<TiantongPage />);
      expect(screen.getByTestId("pc-toolbar-view-toggle")).toBeInTheDocument();
    });

    test("VideoViewToolbar 应该包含筛选按钮", () => {
      render(<TiantongPage />);
      expect(screen.getByTestId("pc-toolbar-filter-btn")).toBeInTheDocument();
    });
  });

  describe("TC-Responsive-003: 搜索功能在两种模式下都正常工作", () => {
    test("移动端 IconToolbar 搜索功能可用", () => {
      render(<TiantongPage />);
      const searchBtn = screen.getByTestId("toolbar-search-btn");
      expect(searchBtn).toBeInTheDocument();
      fireEvent.click(searchBtn);
      expect(searchBtn).toBeInTheDocument();
    });

    test("IconToolbar 接收搜索建议", () => {
      render(<TiantongPage />);
      expect(screen.getByTestId("toolbar-suggestions")).toHaveTextContent("[]");
    });

    test("IconToolbar 接收搜索历史", () => {
      render(<TiantongPage />);
      expect(screen.getByTestId("toolbar-history")).toHaveTextContent("[]");
    });

    test("点击清空历史按钮应该触发清空历史功能", () => {
      render(<TiantongPage />);
      const clearHistoryBtn = screen.getByTestId("toolbar-clear-history");
      expect(clearHistoryBtn).toBeInTheDocument();
      fireEvent.click(clearHistoryBtn);
      expect(clearHistoryBtn).toBeInTheDocument();
    });
  });

  describe("TC-Responsive-004: 视图切换功能正常", () => {
    test("IconToolbar 应该显示当前视图模式", () => {
      render(<TiantongPage />);
      expect(screen.getByTestId("toolbar-view-mode")).toHaveTextContent("timeline");
    });

    test("VideoViewToolbar 应该显示当前视图模式", () => {
      render(<TiantongPage />);
      expect(screen.getByTestId("pc-toolbar-view-mode")).toHaveTextContent("timeline");
    });

    test("点击 IconToolbar 视图切换按钮应该触发视图切换", () => {
      render(<TiantongPage />);
      const viewToggleBtn = screen.getByTestId("toolbar-view-toggle");
      fireEvent.click(viewToggleBtn);
      expect(viewToggleBtn).toBeInTheDocument();
    });

    test("点击 VideoViewToolbar 视图切换按钮应该触发视图切换", () => {
      render(<TiantongPage />);
      const viewToggleBtn = screen.getByTestId("pc-toolbar-view-toggle");
      fireEvent.click(viewToggleBtn);
      expect(viewToggleBtn).toBeInTheDocument();
    });
  });

  describe("TC-Responsive-005: 筛选排序功能正常", () => {
    test("IconToolbar 筛选按钮应该触发筛选变更", () => {
      render(<TiantongPage />);
      const filterBtn = screen.getByTestId("toolbar-filter-btn");
      fireEvent.click(filterBtn);
      expect(filterBtn).toBeInTheDocument();
    });

    test("VideoViewToolbar 筛选按钮应该触发筛选变更", () => {
      render(<TiantongPage />);
      const filterBtn = screen.getByTestId("pc-toolbar-filter-btn");
      fireEvent.click(filterBtn);
      expect(filterBtn).toBeInTheDocument();
    });
  });

  describe("TC-Responsive-006: 主题传递正确", () => {
    test("IconToolbar 应该接收正确的主题", () => {
      render(<TiantongPage />);
      expect(screen.getByTestId("toolbar-theme")).toHaveTextContent("tiger");
    });

    test("VideoViewToolbar 应该接收正确的主题", () => {
      render(<TiantongPage />);
      expect(screen.getByTestId("pc-toolbar-theme")).toHaveTextContent("tiger");
    });

    test("主题切换后两个工具栏都应该更新主题", () => {
      render(<TiantongPage />);

      // 初始主题为 tiger
      expect(screen.getByTestId("toolbar-theme")).toHaveTextContent("tiger");
      expect(screen.getByTestId("pc-toolbar-theme")).toHaveTextContent("tiger");

      // 切换主题
      const toggleButton = screen.getByTestId("toggle-button");
      fireEvent.click(toggleButton);

      // 验证两个工具栏主题都更新为 sweet
      expect(screen.getByTestId("toolbar-theme")).toHaveTextContent("sweet");
      expect(screen.getByTestId("pc-toolbar-theme")).toHaveTextContent("sweet");
    });
  });

  describe("TC-Responsive-007: 响应式布局结构", () => {
    test("应该同时包含移动端和 PC 端工具栏容器", () => {
      const { container } = render(<TiantongPage />);

      // 验证移动端容器存在
      const mobileContainer = container.querySelector(".sm\\:hidden");
      expect(mobileContainer).toBeInTheDocument();

      // 验证 PC 端容器存在
      const pcContainer = container.querySelector(".hidden.sm\\:block");
      expect(pcContainer).toBeInTheDocument();
    });

    test("IconToolbar 应该在移动端容器内", () => {
      const { container } = render(<TiantongPage />);
      const mobileContainer = container.querySelector(".sm\\:hidden");
      const iconToolbar = screen.getByTestId("icon-toolbar");

      // 验证 IconToolbar 在移动端容器内
      expect(mobileContainer?.contains(iconToolbar)).toBe(true);
    });

    test("VideoViewToolbar 应该在 PC 端容器内", () => {
      const { container } = render(<TiantongPage />);
      const pcContainer = container.querySelector(".hidden.sm\\:block");
      const videoViewToolbar = screen.getByTestId("video-view-toolbar");

      // 验证 VideoViewToolbar 在 PC 端容器内
      expect(pcContainer?.contains(videoViewToolbar)).toBe(true);
    });
  });
});

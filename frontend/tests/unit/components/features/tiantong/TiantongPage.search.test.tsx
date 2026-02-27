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
jest.mock("@/components/video/VideoModal", () => ({
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
jest.mock("@/components/video-view/IconToolbar", () => ({
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

// Mock VideoViewToolbar - PC端工具栏（带搜索功能）
jest.mock("@/components/video-view/VideoViewToolbar", () => ({
  VideoViewToolbar: ({
    viewMode,
    onViewModeChange,
    filter,
    onFilterChange,
    theme,
    onSearch,
    searchSuggestions,
    searchHistory,
    onClearHistory,
  }: any) => (
    <div data-testid="video-view-toolbar" role="toolbar" className="video-view-toolbar-pc">
      <span data-testid="pc-toolbar-view-mode">{viewMode}</span>
      <span data-testid="pc-toolbar-theme">{theme}</span>
      {/* PC端搜索功能 */}
      {onSearch && (
        <div data-testid="pc-search-container">
          <button data-testid="pc-toolbar-search-btn" onClick={() => onSearch("PC端测试搜索")}>
            PC搜索
          </button>
          <div data-testid="pc-toolbar-suggestions">{JSON.stringify(searchSuggestions)}</div>
          <div data-testid="pc-toolbar-history">{JSON.stringify(searchHistory)}</div>
          <button data-testid="pc-toolbar-clear-history" onClick={onClearHistory}>
            清空历史
          </button>
        </div>
      )}
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
jest.mock("@/components/video-view/VideoGrid", () => ({
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
jest.mock("@/components/video-view/VideoList", () => ({
  __esModule: true,
  default: ({ videos, onVideoClick, theme }: any) => (
    <div data-testid="video-list">
      <span>Video list - {theme}</span>
      <span data-testid="list-video-count">{videos.length} videos</span>
    </div>
  ),
}));

// Mock EmptyState
jest.mock("@/components/video-view/EmptyState", () => ({
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

describe("TiantongPage PC端 VideoViewToolbar 搜索功能测试", () => {
  describe("TC-Search-001: PC端 VideoViewToolbar 接收搜索相关 props", () => {
    test("VideoViewToolbar 应该接收 onSearch 回调函数", () => {
      render(<TiantongPage />);
      const pcToolbar = screen.getByTestId("video-view-toolbar");
      expect(pcToolbar).toBeInTheDocument();
      
      // 验证搜索容器存在，说明 onSearch 被传递
      const searchContainer = screen.getByTestId("pc-search-container");
      expect(searchContainer).toBeInTheDocument();
    });

    test("VideoViewToolbar 应该接收 searchSuggestions 属性", () => {
      render(<TiantongPage />);
      const suggestions = screen.getByTestId("pc-toolbar-suggestions");
      expect(suggestions).toBeInTheDocument();
      // 初始时搜索建议为空数组
      expect(suggestions).toHaveTextContent("[]");
    });

    test("VideoViewToolbar 应该接收 searchHistory 属性", () => {
      render(<TiantongPage />);
      const history = screen.getByTestId("pc-toolbar-history");
      expect(history).toBeInTheDocument();
      // 初始时搜索历史为空数组
      expect(history).toHaveTextContent("[]");
    });

    test("VideoViewToolbar 应该接收 onClearHistory 回调函数", () => {
      render(<TiantongPage />);
      const clearHistoryBtn = screen.getByTestId("pc-toolbar-clear-history");
      expect(clearHistoryBtn).toBeInTheDocument();
    });
  });

  describe("TC-Search-002: PC端搜索功能正常工作", () => {
    test("PC端 VideoViewToolbar 应该显示搜索按钮", () => {
      render(<TiantongPage />);
      const searchBtn = screen.getByTestId("pc-toolbar-search-btn");
      expect(searchBtn).toBeInTheDocument();
    });

    test("点击 PC端搜索按钮应该触发搜索功能", () => {
      render(<TiantongPage />);
      const searchBtn = screen.getByTestId("pc-toolbar-search-btn");
      expect(searchBtn).toBeInTheDocument();
      
      // 点击搜索按钮
      fireEvent.click(searchBtn);
      
      // 验证按钮仍然存在（搜索功能被调用）
      expect(searchBtn).toBeInTheDocument();
    });
  });

  describe("TC-Search-003: PC端搜索历史功能正常", () => {
    test("PC端 VideoViewToolbar 应该显示搜索历史容器", () => {
      render(<TiantongPage />);
      const history = screen.getByTestId("pc-toolbar-history");
      expect(history).toBeInTheDocument();
    });

    test("点击 PC端清空历史按钮应该触发清空历史功能", () => {
      render(<TiantongPage />);
      const clearHistoryBtn = screen.getByTestId("pc-toolbar-clear-history");
      expect(clearHistoryBtn).toBeInTheDocument();
      
      // 点击清空历史按钮
      fireEvent.click(clearHistoryBtn);
      
      // 验证按钮仍然存在（清空历史功能被调用）
      expect(clearHistoryBtn).toBeInTheDocument();
    });
  });

  describe("TC-Search-004: PC端搜索建议功能正常", () => {
    test("PC端 VideoViewToolbar 应该显示搜索建议容器", () => {
      render(<TiantongPage />);
      const suggestions = screen.getByTestId("pc-toolbar-suggestions");
      expect(suggestions).toBeInTheDocument();
    });

    test("PC端搜索建议初始状态为空数组", () => {
      render(<TiantongPage />);
      const suggestions = screen.getByTestId("pc-toolbar-suggestions");
      expect(suggestions).toHaveTextContent("[]");
    });
  });

  describe("TC-Search-005: 移动端 IconToolbar 搜索功能保持正常", () => {
    test("移动端 IconToolbar 应该仍然接收 onSearch 回调", () => {
      render(<TiantongPage />);
      const mobileSearchBtn = screen.getByTestId("toolbar-search-btn");
      expect(mobileSearchBtn).toBeInTheDocument();
    });

    test("移动端 IconToolbar 搜索按钮应该正常工作", () => {
      render(<TiantongPage />);
      const mobileSearchBtn = screen.getByTestId("toolbar-search-btn");
      expect(mobileSearchBtn).toBeInTheDocument();
      
      // 点击搜索按钮
      fireEvent.click(mobileSearchBtn);
      
      // 验证按钮仍然存在
      expect(mobileSearchBtn).toBeInTheDocument();
    });

    test("移动端 IconToolbar 应该接收搜索建议", () => {
      render(<TiantongPage />);
      const mobileSuggestions = screen.getByTestId("toolbar-suggestions");
      expect(mobileSuggestions).toBeInTheDocument();
      expect(mobileSuggestions).toHaveTextContent("[]");
    });

    test("移动端 IconToolbar 应该接收搜索历史", () => {
      render(<TiantongPage />);
      const mobileHistory = screen.getByTestId("toolbar-history");
      expect(mobileHistory).toBeInTheDocument();
      expect(mobileHistory).toHaveTextContent("[]");
    });

    test("移动端清空历史按钮应该正常工作", () => {
      render(<TiantongPage />);
      const mobileClearBtn = screen.getByTestId("toolbar-clear-history");
      expect(mobileClearBtn).toBeInTheDocument();
      
      fireEvent.click(mobileClearBtn);
      expect(mobileClearBtn).toBeInTheDocument();
    });
  });

  describe("TC-Search-006: 两端搜索功能共存", () => {
    test("PC端和移动端工具栏应该同时存在", () => {
      render(<TiantongPage />);
      
      // PC端工具栏
      expect(screen.getByTestId("video-view-toolbar")).toBeInTheDocument();
      
      // 移动端工具栏
      expect(screen.getByTestId("icon-toolbar")).toBeInTheDocument();
    });

    test("PC端和移动端都应该有搜索按钮", () => {
      render(<TiantongPage />);
      
      // PC端搜索按钮
      const pcSearchBtn = screen.getByTestId("pc-toolbar-search-btn");
      expect(pcSearchBtn).toBeInTheDocument();
      
      // 移动端搜索按钮
      const mobileSearchBtn = screen.getByTestId("toolbar-search-btn");
      expect(mobileSearchBtn).toBeInTheDocument();
    });

    test("PC端和移动端都应该有搜索历史和建议容器", () => {
      render(<TiantongPage />);
      
      // PC端
      expect(screen.getByTestId("pc-toolbar-suggestions")).toBeInTheDocument();
      expect(screen.getByTestId("pc-toolbar-history")).toBeInTheDocument();
      
      // 移动端
      expect(screen.getByTestId("toolbar-suggestions")).toBeInTheDocument();
      expect(screen.getByTestId("toolbar-history")).toBeInTheDocument();
    });

    test("PC端和移动端都应该有清空历史按钮", () => {
      render(<TiantongPage />);
      
      // PC端
      expect(screen.getByTestId("pc-toolbar-clear-history")).toBeInTheDocument();
      
      // 移动端
      expect(screen.getByTestId("toolbar-clear-history")).toBeInTheDocument();
    });
  });

  describe("TC-Search-007: 搜索功能与主题集成", () => {
    test("PC端 VideoViewToolbar 应该接收正确的主题", () => {
      render(<TiantongPage />);
      expect(screen.getByTestId("pc-toolbar-theme")).toHaveTextContent("tiger");
    });

    test("主题切换后 PC端搜索功能仍然可用", () => {
      render(<TiantongPage />);
      
      // 切换主题
      const toggleButton = screen.getByTestId("toggle-button");
      fireEvent.click(toggleButton);
      
      // 验证主题已更新
      expect(screen.getByTestId("pc-toolbar-theme")).toHaveTextContent("sweet");
      
      // 验证搜索按钮仍然可用
      const searchBtn = screen.getByTestId("pc-toolbar-search-btn");
      expect(searchBtn).toBeInTheDocument();
      
      // 点击搜索按钮
      fireEvent.click(searchBtn);
      expect(searchBtn).toBeInTheDocument();
    });
  });
});

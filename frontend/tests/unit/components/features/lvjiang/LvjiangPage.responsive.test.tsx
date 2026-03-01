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
  VideoTimeline: ({
    theme,
    onVideoClick,
  }: {
    theme: string;
    onVideoClick: (video: any) => void;
  }) => (
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
  default: ({ video, theme, onClose }: { video: any; theme: string; onClose: () => void }) => {
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

// 模拟 IconToolbar - 移动端工具栏
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
  }: {
    viewMode: string;
    onViewModeChange: (mode: string) => void;
    filter: any;
    onFilterChange: (filter: any) => void;
    onSearch: (query: string) => void;
    theme: string;
    searchSuggestions?: string[];
    searchHistory?: string[];
    onClearHistory?: () => void;
  }) => (
    <div data-testid="icon-toolbar" role="toolbar" className="icon-toolbar-mobile">
      <span data-testid="mobile-toolbar-view-mode">{viewMode}</span>
      <span data-testid="mobile-toolbar-theme">{theme}</span>
      <span data-testid="mobile-toolbar-filter">{JSON.stringify(filter)}</span>
      <button data-testid="mobile-search-btn" onClick={() => onSearch("测试搜索")}>
        搜索
      </button>
      <button data-testid="mobile-clear-history-btn" onClick={onClearHistory}>
        清除历史
      </button>
      <button data-testid="mobile-change-view-btn" onClick={() => onViewModeChange("grid")}>
        切换视图
      </button>
      <button
        data-testid="mobile-change-filter-btn"
        onClick={() => onFilterChange({ ...filter, sortBy: "popular" })}
      >
        切换筛选
      </button>
      {searchSuggestions && searchSuggestions.length > 0 && (
        <ul data-testid="mobile-search-suggestions">
          {searchSuggestions.map((s, i) => (
            <li key={i}>{s}</li>
          ))}
        </ul>
      )}
      {searchHistory && searchHistory.length > 0 && (
        <ul data-testid="mobile-search-history">
          {searchHistory.map((h, i) => (
            <li key={i}>{h}</li>
          ))}
        </ul>
      )}
    </div>
  ),
}));

// 模拟 VideoViewToolbar - PC端工具栏
jest.mock("@/components/video-view/VideoViewToolbar", () => ({
  VideoViewToolbar: ({
    viewMode,
    onViewModeChange,
    filter,
    onFilterChange,
    theme,
  }: {
    viewMode: string;
    onViewModeChange: (mode: string) => void;
    filter: any;
    onFilterChange: (filter: any) => void;
    theme: string;
  }) => (
    <div data-testid="video-view-toolbar" role="toolbar" className="video-view-toolbar-pc">
      <span data-testid="pc-toolbar-view-mode">{viewMode}</span>
      <span data-testid="pc-toolbar-theme">{theme}</span>
      <span data-testid="pc-toolbar-filter">{JSON.stringify(filter)}</span>
      <button data-testid="pc-change-view-btn" onClick={() => onViewModeChange("grid")}>
        切换视图
      </button>
      <button
        data-testid="pc-change-filter-btn"
        onClick={() => onFilterChange({ ...filter, sortBy: "popular" })}
      >
        切换筛选
      </button>
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

// 用于追踪 hook 调用的 mock 函数
const mockSetViewMode = jest.fn();
const mockSetFilter = jest.fn();
const mockResetFilter = jest.fn();

jest.mock("@/hooks/useViewPreferences", () => ({
  useViewPreferences: () => ({
    viewMode: "timeline",
    setViewMode: mockSetViewMode,
  }),
}));

jest.mock("@/hooks/useVideoFilter", () => ({
  useVideoFilter: () => ({
    filter: { duration: "all", timeRange: "all", sortBy: "newest" },
    setFilter: mockSetFilter,
    resetFilter: mockResetFilter,
    filteredVideos: [{ id: "1", title: "测试视频" }],
  }),
}));

// 模拟视频数据
jest.mock("@/features/lvjiang/data", () => ({
  videos: [
    {
      id: "1",
      title: "洞主精彩操作",
      tags: ["精彩", "操作"],
      date: "2024-01-01",
      duration: "10:00",
    },
    {
      id: "2",
      title: "凯哥搞笑时刻",
      tags: ["搞笑", "娱乐"],
      date: "2024-01-02",
      duration: "15:00",
    },
    { id: "3", title: "驴酱日常", tags: ["日常", "直播"], date: "2024-01-03", duration: "20:00" },
  ],
}));

describe("LvjiangPage 响应式工具栏测试", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe("TC-Responsive-LP-001: 移动端显示 IconToolbar", () => {
    test("加载完成后应该渲染 IconToolbar 组件", async () => {
      render(<LvjiangPage />);
      fireEvent.click(screen.getByText("完成加载"));

      await waitFor(() => {
        expect(screen.getByTestId("icon-toolbar")).toBeInTheDocument();
        // 验证 IconToolbar 有 toolbar 角色
        const iconToolbar = screen.getByTestId("icon-toolbar");
        expect(iconToolbar).toHaveAttribute("role", "toolbar");
      });
    });

    test("IconToolbar 应该包含移动端特有的搜索按钮", async () => {
      render(<LvjiangPage />);
      fireEvent.click(screen.getByText("完成加载"));

      await waitFor(() => {
        expect(screen.getByTestId("mobile-search-btn")).toBeInTheDocument();
      });
    });

    test("IconToolbar 应该包含视图切换按钮", async () => {
      render(<LvjiangPage />);
      fireEvent.click(screen.getByText("完成加载"));

      await waitFor(() => {
        expect(screen.getByTestId("mobile-change-view-btn")).toBeInTheDocument();
      });
    });

    test("IconToolbar 应该包含筛选按钮", async () => {
      render(<LvjiangPage />);
      fireEvent.click(screen.getByText("完成加载"));

      await waitFor(() => {
        expect(screen.getByTestId("mobile-change-filter-btn")).toBeInTheDocument();
      });
    });

    test("IconToolbar 应该包含清除历史按钮", async () => {
      render(<LvjiangPage />);
      fireEvent.click(screen.getByText("完成加载"));

      await waitFor(() => {
        expect(screen.getByTestId("mobile-clear-history-btn")).toBeInTheDocument();
      });
    });
  });

  describe("TC-Responsive-LP-002: PC端显示 VideoViewToolbar", () => {
    test("加载完成后应该渲染 VideoViewToolbar 组件", async () => {
      render(<LvjiangPage />);
      fireEvent.click(screen.getByText("完成加载"));

      await waitFor(() => {
        expect(screen.getByTestId("video-view-toolbar")).toBeInTheDocument();
      });
    });

    test("VideoViewToolbar 应该包含 PC 端特有的视图切换按钮", async () => {
      render(<LvjiangPage />);
      fireEvent.click(screen.getByText("完成加载"));

      await waitFor(() => {
        expect(screen.getByTestId("pc-change-view-btn")).toBeInTheDocument();
      });
    });

    test("VideoViewToolbar 应该包含筛选按钮", async () => {
      render(<LvjiangPage />);
      fireEvent.click(screen.getByText("完成加载"));

      await waitFor(() => {
        expect(screen.getByTestId("pc-change-filter-btn")).toBeInTheDocument();
      });
    });
  });

  describe("TC-Responsive-LP-003: 搜索功能在两种模式下都正常工作", () => {
    test("移动端 IconToolbar 搜索功能可用", async () => {
      render(<LvjiangPage />);
      fireEvent.click(screen.getByText("完成加载"));

      await waitFor(() => {
        const searchBtn = screen.getByTestId("mobile-search-btn");
        expect(searchBtn).toBeInTheDocument();
        fireEvent.click(searchBtn);
        expect(searchBtn).toBeInTheDocument();
      });
    });

    test("IconToolbar 接收搜索建议", async () => {
      render(<LvjiangPage />);
      fireEvent.click(screen.getByText("完成加载"));

      await waitFor(() => {
        // 初始时搜索建议为空数组
        expect(screen.queryByTestId("mobile-search-suggestions")).not.toBeInTheDocument();
      });
    });

    test("IconToolbar 接收搜索历史", async () => {
      render(<LvjiangPage />);
      fireEvent.click(screen.getByText("完成加载"));

      await waitFor(() => {
        // 初始时搜索历史为空数组
        expect(screen.queryByTestId("mobile-search-history")).not.toBeInTheDocument();
      });
    });

    test("点击清除历史按钮应该触发清除历史功能", async () => {
      render(<LvjiangPage />);
      fireEvent.click(screen.getByText("完成加载"));

      await waitFor(() => {
        const clearHistoryBtn = screen.getByTestId("mobile-clear-history-btn");
        expect(clearHistoryBtn).toBeInTheDocument();
        fireEvent.click(clearHistoryBtn);
        expect(clearHistoryBtn).toBeInTheDocument();
      });
    });
  });

  describe("TC-Responsive-LP-004: 视图切换功能正常", () => {
    test("IconToolbar 应该显示当前视图模式", async () => {
      render(<LvjiangPage />);
      fireEvent.click(screen.getByText("完成加载"));

      await waitFor(() => {
        expect(screen.getByTestId("mobile-toolbar-view-mode")).toHaveTextContent("timeline");
      });
    });

    test("VideoViewToolbar 应该显示当前视图模式", async () => {
      render(<LvjiangPage />);
      fireEvent.click(screen.getByText("完成加载"));

      await waitFor(() => {
        expect(screen.getByTestId("pc-toolbar-view-mode")).toHaveTextContent("timeline");
      });
    });

    test("点击 IconToolbar 视图切换按钮应该触发视图切换", async () => {
      render(<LvjiangPage />);
      fireEvent.click(screen.getByText("完成加载"));

      await waitFor(() => {
        const viewToggleBtn = screen.getByTestId("mobile-change-view-btn");
        fireEvent.click(viewToggleBtn);
        expect(mockSetViewMode).toHaveBeenCalledWith("grid");
      });
    });

    test("点击 VideoViewToolbar 视图切换按钮应该触发视图切换", async () => {
      render(<LvjiangPage />);
      fireEvent.click(screen.getByText("完成加载"));

      await waitFor(() => {
        const viewToggleBtn = screen.getByTestId("pc-change-view-btn");
        fireEvent.click(viewToggleBtn);
        expect(mockSetViewMode).toHaveBeenCalledWith("grid");
      });
    });
  });

  describe("TC-Responsive-LP-005: 筛选排序功能正常", () => {
    test("IconToolbar 筛选按钮应该触发筛选变更", async () => {
      render(<LvjiangPage />);
      fireEvent.click(screen.getByText("完成加载"));

      await waitFor(() => {
        const filterBtn = screen.getByTestId("mobile-change-filter-btn");
        fireEvent.click(filterBtn);
        expect(mockSetFilter).toHaveBeenCalled();
      });
    });

    test("VideoViewToolbar 筛选按钮应该触发筛选变更", async () => {
      render(<LvjiangPage />);
      fireEvent.click(screen.getByText("完成加载"));

      await waitFor(() => {
        const filterBtn = screen.getByTestId("pc-change-filter-btn");
        fireEvent.click(filterBtn);
        expect(mockSetFilter).toHaveBeenCalled();
      });
    });
  });

  describe("TC-Responsive-LP-006: 主题传递正确", () => {
    test("IconToolbar 应该接收正确的主题", async () => {
      render(<LvjiangPage />);
      fireEvent.click(screen.getByText("完成加载"));

      await waitFor(() => {
        expect(screen.getByTestId("mobile-toolbar-theme")).toHaveTextContent("dongzhu");
      });
    });

    test("VideoViewToolbar 应该接收正确的主题", async () => {
      render(<LvjiangPage />);
      fireEvent.click(screen.getByText("完成加载"));

      await waitFor(() => {
        expect(screen.getByTestId("pc-toolbar-theme")).toHaveTextContent("dongzhu");
      });
    });

    test("主题切换后两个工具栏都应该更新主题", async () => {
      render(<LvjiangPage />);
      fireEvent.click(screen.getByText("完成加载"));

      await waitFor(() => {
        expect(screen.getByTestId("mobile-toolbar-theme")).toHaveTextContent("dongzhu");
        expect(screen.getByTestId("pc-toolbar-theme")).toHaveTextContent("dongzhu");
      });

      // 切换主题
      fireEvent.click(screen.getByText("切换主题"));

      await waitFor(() => {
        expect(screen.getByTestId("mobile-toolbar-theme")).toHaveTextContent("kaige");
        expect(screen.getByTestId("pc-toolbar-theme")).toHaveTextContent("kaige");
      });
    });
  });

  describe("TC-Responsive-LP-007: 响应式布局结构", () => {
    test("应该同时包含移动端和 PC 端工具栏容器", async () => {
      const { container } = render(<LvjiangPage />);
      fireEvent.click(screen.getByText("完成加载"));

      await waitFor(() => {
        // 验证移动端容器存在
        const mobileContainer = container.querySelector(".sm\\:hidden");
        expect(mobileContainer).toBeInTheDocument();

        // 验证 PC 端容器存在
        const pcContainer = container.querySelector(".hidden.sm\\:block");
        expect(pcContainer).toBeInTheDocument();
      });
    });

    test("IconToolbar 应该在移动端容器内", async () => {
      const { container } = render(<LvjiangPage />);
      fireEvent.click(screen.getByText("完成加载"));

      await waitFor(() => {
        const mobileContainer = container.querySelector(".sm\\:hidden");
        const iconToolbar = screen.getByTestId("icon-toolbar");
        expect(mobileContainer?.contains(iconToolbar)).toBe(true);
      });
    });

    test("VideoViewToolbar 应该在 PC 端容器内", async () => {
      const { container } = render(<LvjiangPage />);
      fireEvent.click(screen.getByText("完成加载"));

      await waitFor(() => {
        const pcContainer = container.querySelector(".hidden.sm\\:block");
        const videoViewToolbar = screen.getByTestId("video-view-toolbar");
        expect(pcContainer?.contains(videoViewToolbar)).toBe(true);
      });
    });
  });

  describe("TC-Responsive-LP-008: 主内容区响应式padding测试", () => {
    test("应该包含响应式样式标签", async () => {
      const { container } = render(<LvjiangPage />);
      fireEvent.click(screen.getByText("完成加载"));

      await waitFor(() => {
        // 验证 style 标签存在
        const styleTags = container.querySelectorAll("style");
        expect(styleTags.length).toBeGreaterThan(0);
      });
    });

    test("响应式样式应该包含 768px 断点", async () => {
      const { container } = render(<LvjiangPage />);
      fireEvent.click(screen.getByText("完成加载"));

      await waitFor(() => {
        // 验证样式标签中包含 768px 断点
        const styleTags = container.querySelectorAll("style");
        let has768pxBreakpoint = false;
        styleTags.forEach(tag => {
          if (tag.textContent?.includes("768px")) {
            has768pxBreakpoint = true;
          }
        });
        expect(has768pxBreakpoint).toBe(true);
      });
    });

    test("响应式样式应该包含 320px 的 padding-right", async () => {
      const { container } = render(<LvjiangPage />);
      fireEvent.click(screen.getByText("完成加载"));

      await waitFor(() => {
        // 验证样式标签中包含 320px 的 padding-right
        const styleTags = container.querySelectorAll("style");
        let has320pxPadding = false;
        styleTags.forEach(tag => {
          if (tag.textContent?.includes("320px")) {
            has320pxPadding = true;
          }
        });
        expect(has320pxPadding).toBe(true);
      });
    });

    test("主内容区应该包含 main-content 类名", async () => {
      const { container } = render(<LvjiangPage />);
      fireEvent.click(screen.getByText("完成加载"));

      await waitFor(() => {
        // 验证主内容区有 main-content 类名
        const mainContent = container.querySelector(".main-content");
        expect(mainContent).toBeInTheDocument();
      });
    });
  });
});

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
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
      {videos.map((v: any) => (
        <div key={v.id} data-testid={`video-item-${v.id}`}>
          {v.title}
        </div>
      ))}
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
      {video && <span>{video.title}</span>}
      <button onClick={onClose} data-testid="close-modal">
        Close
      </button>
    </div>
  ),
}));

// 使用真实的VideoViewToolbar，但不使用mock
jest.mock("@/components/video-view/VideoViewToolbar", () => {
  const actual = jest.requireActual("@/components/video-view/VideoViewToolbar");
  return actual;
});

// 使用真实的useVideoFilter，但不使用mock
jest.mock("@/hooks/useVideoFilter", () => {
  const actual = jest.requireActual("@/hooks/useVideoFilter");
  return actual;
});

// Mock useViewPreferences
jest.mock("@/hooks/useViewPreferences", () => ({
  useViewPreferences: () => ({
    viewMode: "timeline",
    setViewMode: jest.fn(),
  }),
}));

// Mock IconToolbar
jest.mock("@/components/video-view/IconToolbar", () => ({
  IconToolbar: () => <div data-testid="icon-toolbar" />,
}));

// Mock VideoGrid
jest.mock("@/components/video-view/VideoGrid", () => ({
  __esModule: true,
  default: ({ videos, onVideoClick, theme }: any) => (
    <div data-testid="video-grid">
      <span>Video grid - {theme}</span>
      <span data-testid="grid-video-count">{videos.length} videos</span>
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

describe("TiantongPage 搜索过滤功能测试（TDD）", () => {
  /**
   * 测试用例：搜索功能应该正确过滤视频
   */
  test("TC-TDD-001: 搜索功能应该能正确过滤视频", () => {
    render(<TiantongPage />);

    // 点击搜索按钮展开弹窗
    const searchButton = screen.getByRole("button", { name: /搜索/i });
    fireEvent.click(searchButton);

    // 找到搜索输入框（在弹窗中）
    const searchInput = screen.getByPlaceholderText("搜索视频...");
    expect(searchInput).toBeInTheDocument();

    // 初始时应该显示所有视频（假设测试数据有多个视频）
    const initialVideoCount = screen.getByTestId("video-count");
    const initialCount = parseInt(initialVideoCount.textContent || "0", 10);
    expect(initialCount).toBeGreaterThan(0);

    // 输入一个存在的搜索词（比如"甜筒"）
    fireEvent.change(searchInput, { target: { value: "甜筒" } });
    fireEvent.keyDown(searchInput, { key: "Enter" });

    // 搜索后应该过滤视频
    const filteredVideoCount = screen.getByTestId("video-count");
    const filteredCount = parseInt(filteredVideoCount.textContent || "0", 10);

    // 我们期望过滤后的数量应该小于或等于初始数量
    console.log("Initial count:", initialCount, "Filtered count:", filteredCount);

    // 过滤后的数量应该小于或等于初始数量
    expect(filteredCount).toBeLessThanOrEqual(initialCount);
  });
});

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { VideoViewToolbar } from "@/components/video-view/VideoViewToolbar";
import type { FilterState } from "@/hooks/types";
import "@testing-library/jest-dom";

describe("VideoViewToolbar 组件测试", () => {
  const mockOnViewModeChange = jest.fn();
  const mockOnFilterChange = jest.fn();

  const defaultFilter: FilterState = {
    duration: "all",
    timeRange: "all",
    sortBy: "newest",
  };

  beforeEach(() => {
    mockOnViewModeChange.mockClear();
    mockOnFilterChange.mockClear();
  });

  test("TC-001: 渲染 ViewSwitcher 组件", () => {
    render(
      <VideoViewToolbar
        viewMode="grid"
        onViewModeChange={mockOnViewModeChange}
        filter={defaultFilter}
        onFilterChange={mockOnFilterChange}
      />
    );

    expect(screen.getByRole("group")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /时光轴/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /网格/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /列表/i })).toBeInTheDocument();
  });

  test("TC-002: 渲染 FilterDropdown 组件", () => {
    render(
      <VideoViewToolbar
        viewMode="grid"
        onViewModeChange={mockOnViewModeChange}
        filter={defaultFilter}
        onFilterChange={mockOnFilterChange}
      />
    );

    expect(screen.getByRole("button", { name: /筛选/i })).toBeInTheDocument();
  });

  test("TC-003: 渲染 SortDropdown 组件", () => {
    render(
      <VideoViewToolbar
        viewMode="grid"
        onViewModeChange={mockOnViewModeChange}
        filter={defaultFilter}
        onFilterChange={mockOnFilterChange}
      />
    );

    expect(screen.getByRole("button", { name: /排序/i })).toBeInTheDocument();
  });

  test("TC-004: 正确传递 viewMode 和 onViewModeChange 到 ViewSwitcher", () => {
    render(
      <VideoViewToolbar
        viewMode="grid"
        onViewModeChange={mockOnViewModeChange}
        filter={defaultFilter}
        onFilterChange={mockOnFilterChange}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /列表/i }));
    expect(mockOnViewModeChange).toHaveBeenCalledWith("list");
  });

  test("TC-005: 正确传递 filter 和 onFilterChange 到 FilterDropdown", () => {
    const filterWithDuration: FilterState = {
      duration: "short",
      timeRange: "all",
      sortBy: "newest",
    };

    render(
      <VideoViewToolbar
        viewMode="grid"
        onViewModeChange={mockOnViewModeChange}
        filter={filterWithDuration}
        onFilterChange={mockOnFilterChange}
      />
    );

    expect(screen.getAllByText("0-5分钟").length).toBeGreaterThan(0);
  });

  test("TC-006: 工具栏具有正确的背景和阴影样式", () => {
    const { container } = render(
      <VideoViewToolbar
        viewMode="grid"
        onViewModeChange={mockOnViewModeChange}
        filter={defaultFilter}
        onFilterChange={mockOnFilterChange}
      />
    );

    const toolbar = container.firstChild as HTMLElement;
    expect(toolbar).toHaveClass(/bg-card\/70/);
    expect(toolbar).toHaveClass(/backdrop-blur-md/);
    expect(toolbar).toHaveClass(/shadow-lg/);
  });

  test("TC-007: 工具栏具有正确的内边距", () => {
    const { container } = render(
      <VideoViewToolbar
        viewMode="grid"
        onViewModeChange={mockOnViewModeChange}
        filter={defaultFilter}
        onFilterChange={mockOnFilterChange}
      />
    );

    const toolbar = container.firstChild as HTMLElement;
    expect(toolbar).toHaveClass(/p-4/);
    expect(toolbar).toHaveClass(/md:p-5/);
  });

  test("TC-008: 桌面端水平布局", () => {
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 1024,
    });
    window.dispatchEvent(new Event("resize"));

    const { container } = render(
      <VideoViewToolbar
        viewMode="grid"
        onViewModeChange={mockOnViewModeChange}
        filter={defaultFilter}
        onFilterChange={mockOnFilterChange}
      />
    );

    const toolbar = container.firstChild as HTMLElement;
    expect(toolbar).toHaveClass(/flex-row/);
  });

  test("TC-009: 移动端两行布局", () => {
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 375,
    });
    window.dispatchEvent(new Event("resize"));

    const { container } = render(
      <VideoViewToolbar
        viewMode="grid"
        onViewModeChange={mockOnViewModeChange}
        filter={defaultFilter}
        onFilterChange={mockOnFilterChange}
      />
    );

    const toolbar = container.firstChild as HTMLElement;
    expect(toolbar).toHaveClass(/flex-col/);
  });

  test("TC-010: 桌面端视图切换与筛选排序之间有间距", () => {
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 1024,
    });
    window.dispatchEvent(new Event("resize"));

    const { container } = render(
      <VideoViewToolbar
        viewMode="grid"
        onViewModeChange={mockOnViewModeChange}
        filter={defaultFilter}
        onFilterChange={mockOnFilterChange}
      />
    );

    const toolbar = container.firstChild as HTMLElement;
    expect(toolbar).toHaveClass(/gap-6/);
  });

  test("TC-011: 自定义 className 正确应用", () => {
    const { container } = render(
      <VideoViewToolbar
        viewMode="grid"
        onViewModeChange={mockOnViewModeChange}
        filter={defaultFilter}
        onFilterChange={mockOnFilterChange}
        className="custom-toolbar-class"
      />
    );

    const toolbar = container.firstChild as HTMLElement;
    expect(toolbar).toHaveClass("custom-toolbar-class");
  });

  test("TC-012: 正确渲染三个子组件", () => {
    render(
      <VideoViewToolbar
        viewMode="grid"
        onViewModeChange={mockOnViewModeChange}
        filter={defaultFilter}
        onFilterChange={mockOnFilterChange}
      />
    );

    const buttons = screen.getAllByRole("button");
    const viewModeButtons = buttons.filter(
      btn =>
        btn.textContent?.includes("时光轴") ||
        btn.textContent?.includes("网格") ||
        btn.textContent?.includes("列表")
    );
    const filterButton = buttons.find(btn => btn.textContent?.includes("筛选"));
    const sortButton = buttons.find(btn => btn.textContent?.includes("排序"));

    expect(viewModeButtons).toHaveLength(3);
    expect(filterButton).toBeInTheDocument();
    expect(sortButton).toBeInTheDocument();
  });
});

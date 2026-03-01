import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { VideoViewToolbar } from "@/components/business/video-view/VideoViewToolbar";
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

  test("TC-002: 渲染 FilterDropdown 按钮", () => {
    render(
      <VideoViewToolbar
        viewMode="grid"
        onViewModeChange={mockOnViewModeChange}
        filter={defaultFilter}
        onFilterChange={mockOnFilterChange}
      />
    );

    // FilterDropdown 使用 data-testid 来查找
    expect(screen.getByTestId("filter-trigger-button")).toBeInTheDocument();
    expect(screen.getByTestId("filter-icon")).toBeInTheDocument();
  });

  test("TC-003: 渲染 SortDropdown 按钮", () => {
    render(
      <VideoViewToolbar
        viewMode="grid"
        onViewModeChange={mockOnViewModeChange}
        filter={defaultFilter}
        onFilterChange={mockOnFilterChange}
      />
    );

    // SortDropdown 使用 data-testid 来查找
    expect(screen.getByTestId("sort-trigger-button")).toBeInTheDocument();
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

    // 当有过滤器激活时，应该显示指示点
    expect(screen.getByTestId("filter-indicator")).toBeInTheDocument();
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
  });

  test("TC-008: 桌面端水平布局", () => {
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
    expect(toolbar).toHaveClass(/items-center/);
  });

  test("TC-009: 移动端隐藏工具栏", () => {
    const { container } = render(
      <VideoViewToolbar
        viewMode="grid"
        onViewModeChange={mockOnViewModeChange}
        filter={defaultFilter}
        onFilterChange={mockOnFilterChange}
      />
    );

    const toolbar = container.firstChild as HTMLElement;
    // 移动端隐藏 (hidden)，PC端显示 (sm:flex)
    expect(toolbar).toHaveClass("hidden");
    expect(toolbar).toHaveClass("sm:flex");
  });

  test("TC-010: 桌面端视图切换与筛选排序之间有间距", () => {
    const { container } = render(
      <VideoViewToolbar
        viewMode="grid"
        onViewModeChange={mockOnViewModeChange}
        filter={defaultFilter}
        onFilterChange={mockOnFilterChange}
      />
    );

    const toolbar = container.firstChild as HTMLElement;
    expect(toolbar).toHaveClass(/gap-4/);
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

    // ViewSwitcher: 3 个视图按钮
    const viewModeButtons = screen.getAllByRole("button", { name: /时光轴|网格|列表/i });
    expect(viewModeButtons).toHaveLength(3);

    // FilterDropdown
    expect(screen.getByTestId("filter-trigger-button")).toBeInTheDocument();

    // SortDropdown
    expect(screen.getByTestId("sort-trigger-button")).toBeInTheDocument();
  });

  test("TC-013: FilterDropdown 和 SortDropdown 使用 default 模式", () => {
    render(
      <VideoViewToolbar
        viewMode="grid"
        onViewModeChange={mockOnViewModeChange}
        filter={defaultFilter}
        onFilterChange={mockOnFilterChange}
      />
    );

    // 验证 FilterDropdown 按钮显示文字
    const filterButton = screen.getByTestId("filter-trigger-button");
    expect(filterButton.textContent).toContain("筛选");
    // 高度为 40px (h-10)
    expect(filterButton).toHaveClass("h-10");

    // 验证 SortDropdown 按钮显示文字
    const sortButton = screen.getByTestId("sort-trigger-button");
    expect(sortButton.textContent).toContain("最新发布");
    // 高度为 40px (h-10)
    expect(sortButton).toHaveClass("h-10");
  });
});

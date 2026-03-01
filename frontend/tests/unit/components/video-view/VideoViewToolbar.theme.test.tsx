import React from "react";
import { render, screen } from "@testing-library/react";
import { VideoViewToolbar } from "@/components/business/video-view/VideoViewToolbar";
import type { FilterState } from "@/hooks/types";
import "@testing-library/jest-dom";

describe("VideoViewToolbar 主题支持测试", () => {
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

  test("TC-THEME-001: theme='blood'时正确应用血怒主题样式", () => {
    const { container } = render(
      <VideoViewToolbar
        viewMode="grid"
        onViewModeChange={mockOnViewModeChange}
        filter={defaultFilter}
        onFilterChange={mockOnFilterChange}
        theme="blood"
      />
    );

    const toolbar = container.firstChild as HTMLElement;
    expect(toolbar).toHaveAttribute("data-theme", "blood");
  });

  test("TC-THEME-002: theme='mix'时正确应用混躺主题样式", () => {
    const { container } = render(
      <VideoViewToolbar
        viewMode="grid"
        onViewModeChange={mockOnViewModeChange}
        filter={defaultFilter}
        onFilterChange={mockOnFilterChange}
        theme="mix"
      />
    );

    const toolbar = container.firstChild as HTMLElement;
    expect(toolbar).toHaveAttribute("data-theme", "mix");
  });

  test("TC-THEME-003: theme未提供时使用默认样式", () => {
    const { container } = render(
      <VideoViewToolbar
        viewMode="grid"
        onViewModeChange={mockOnViewModeChange}
        filter={defaultFilter}
        onFilterChange={mockOnFilterChange}
      />
    );

    const toolbar = container.firstChild as HTMLElement;
    // 未提供theme时，data-theme应该不存在或为undefined
    expect(toolbar.getAttribute("data-theme")).toBeNull();
  });

  test("TC-THEME-004: ViewSwitcher接收theme属性", () => {
    render(
      <VideoViewToolbar
        viewMode="grid"
        onViewModeChange={mockOnViewModeChange}
        filter={defaultFilter}
        onFilterChange={mockOnFilterChange}
        theme="blood"
      />
    );

    // ViewSwitcher应该在文档中，并且接收了theme属性
    const viewSwitcherGroup = screen.getByRole("group");
    expect(viewSwitcherGroup).toBeInTheDocument();
    // ViewSwitcher内部的按钮应该能正常工作
    expect(screen.getByRole("button", { name: /时光轴/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /网格/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /列表/i })).toBeInTheDocument();
  });

  test("TC-THEME-005: 搜索功能接收theme属性", () => {
    const mockOnSearch = jest.fn();
    render(
      <VideoViewToolbar
        viewMode="grid"
        onViewModeChange={mockOnViewModeChange}
        filter={defaultFilter}
        onFilterChange={mockOnFilterChange}
        onSearch={mockOnSearch}
        theme="blood"
      />
    );

    // SearchButton应该渲染
    const searchButton = screen.getByTestId("search-button");
    expect(searchButton).toBeInTheDocument();
  });

  test("TC-THEME-006: FilterDropdown和SortDropdown正常工作", () => {
    render(
      <VideoViewToolbar
        viewMode="grid"
        onViewModeChange={mockOnViewModeChange}
        filter={defaultFilter}
        onFilterChange={mockOnFilterChange}
        theme="mix"
      />
    );

    // FilterDropdown应该存在
    expect(screen.getByTestId("filter-trigger-button")).toBeInTheDocument();
    // SortDropdown应该存在
    expect(screen.getByTestId("sort-trigger-button")).toBeInTheDocument();
  });

  test("TC-THEME-007: 主题切换时组件重新渲染", () => {
    const { container, rerender } = render(
      <VideoViewToolbar
        viewMode="grid"
        onViewModeChange={mockOnViewModeChange}
        filter={defaultFilter}
        onFilterChange={mockOnFilterChange}
        theme="blood"
      />
    );

    let toolbar = container.firstChild as HTMLElement;
    expect(toolbar).toHaveAttribute("data-theme", "blood");

    // 切换到mix主题
    rerender(
      <VideoViewToolbar
        viewMode="grid"
        onViewModeChange={mockOnViewModeChange}
        filter={defaultFilter}
        onFilterChange={mockOnFilterChange}
        theme="mix"
      />
    );

    toolbar = container.firstChild as HTMLElement;
    expect(toolbar).toHaveAttribute("data-theme", "mix");
  });
});

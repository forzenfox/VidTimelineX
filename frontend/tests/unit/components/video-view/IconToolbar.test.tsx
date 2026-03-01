import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { IconToolbar } from "@/components/business/video-view/IconToolbar";
import type { ViewMode, FilterState } from "@/hooks/types";
import "@testing-library/jest-dom";

describe("IconToolbar 组件测试", () => {
  const mockOnViewModeChange = jest.fn();
  const mockOnFilterChange = jest.fn();
  const mockOnSearch = jest.fn();

  const defaultFilter: FilterState = {
    duration: "all",
    timeRange: "all",
    sortBy: "newest",
  };

  beforeEach(() => {
    mockOnViewModeChange.mockClear();
    mockOnFilterChange.mockClear();
    mockOnSearch.mockClear();
  });

  test("TC-001: 渲染图标工具栏容器", () => {
    render(
      <IconToolbar
        viewMode="timeline"
        onViewModeChange={mockOnViewModeChange}
        filter={defaultFilter}
        onFilterChange={mockOnFilterChange}
        onSearch={mockOnSearch}
      />
    );

    // 现在有两个 toolbar（移动端和 PC 端）
    const toolbars = screen.getAllByRole("toolbar");
    expect(toolbars.length).toBe(2);
  });

  test("TC-002: 渲染 CycleViewButton 组件", () => {
    render(
      <IconToolbar
        viewMode="timeline"
        onViewModeChange={mockOnViewModeChange}
        filter={defaultFilter}
        onFilterChange={mockOnFilterChange}
        onSearch={mockOnSearch}
      />
    );

    // 移动端使用 CycleViewButton
    expect(screen.getByRole("button", { name: /切换视图/i })).toBeInTheDocument();
  });

  test("TC-003: 渲染 SearchButton 组件", () => {
    render(
      <IconToolbar
        viewMode="timeline"
        onViewModeChange={mockOnViewModeChange}
        filter={defaultFilter}
        onFilterChange={mockOnFilterChange}
        onSearch={mockOnSearch}
      />
    );

    // 使用 getAllByRole 因为有多个搜索按钮（移动端和 PC 端）
    const searchButtons = screen.getAllByRole("button", { name: /搜索/i });
    expect(searchButtons.length).toBeGreaterThanOrEqual(1);
  });

  test("TC-004: 渲染 FilterDropdown 图标按钮", () => {
    render(
      <IconToolbar
        viewMode="timeline"
        onViewModeChange={mockOnViewModeChange}
        filter={defaultFilter}
        onFilterChange={mockOnFilterChange}
        onSearch={mockOnSearch}
      />
    );

    // FilterDropdown 现在是图标按钮，使用 data-testid 来查找
    // 有两个 FilterDropdown（移动端和 PC 端）
    const filterButtons = screen.getAllByTestId("filter-trigger-button");
    expect(filterButtons.length).toBe(2);
    expect(screen.getAllByTestId("filter-icon").length).toBeGreaterThanOrEqual(1);
  });

  test("TC-005: 渲染 SortDropdown 图标按钮", () => {
    render(
      <IconToolbar
        viewMode="timeline"
        onViewModeChange={mockOnViewModeChange}
        filter={defaultFilter}
        onFilterChange={mockOnFilterChange}
        onSearch={mockOnSearch}
      />
    );

    // SortDropdown 使用 data-testid 来查找
    const sortButtons = screen.getAllByTestId("sort-trigger-button");
    expect(sortButtons.length).toBe(2);
  });

  test("TC-006: 点击 CycleViewButton 触发视图切换", () => {
    render(
      <IconToolbar
        viewMode="timeline"
        onViewModeChange={mockOnViewModeChange}
        filter={defaultFilter}
        onFilterChange={mockOnFilterChange}
        onSearch={mockOnSearch}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /切换视图/i }));
    expect(mockOnViewModeChange).toHaveBeenCalledWith("grid");
  });

  test("TC-007: 工具栏使用正确的布局样式", () => {
    const { container } = render(
      <IconToolbar
        viewMode="timeline"
        onViewModeChange={mockOnViewModeChange}
        filter={defaultFilter}
        onFilterChange={mockOnFilterChange}
        onSearch={mockOnSearch}
      />
    );

    // 移动端容器
    const mobileToolbar = container.querySelector(".sm\\:hidden");
    expect(mobileToolbar).toHaveClass(/flex/);
    expect(mobileToolbar).toHaveClass(/items-start/);

    // PC 端容器
    const desktopToolbar = container.querySelector(".hidden.sm\\:flex");
    expect(desktopToolbar).toHaveClass(/flex/);
    expect(desktopToolbar).toHaveClass(/items-center/);
  });

  test("TC-008: 工具栏具有正确的背景和边框样式", () => {
    const { container } = render(
      <IconToolbar
        viewMode="timeline"
        onViewModeChange={mockOnViewModeChange}
        filter={defaultFilter}
        onFilterChange={mockOnFilterChange}
        onSearch={mockOnSearch}
      />
    );

    // 检查移动端工具栏
    const mobileToolbar = container.querySelector(".sm\\:hidden");
    expect(mobileToolbar).toHaveClass(/bg-card/);
    expect(mobileToolbar).toHaveClass(/border/);
    expect(mobileToolbar).toHaveClass(/rounded-2xl/);
  });

  test("TC-009: 自定义 className 正确应用", () => {
    const { container } = render(
      <IconToolbar
        viewMode="timeline"
        onViewModeChange={mockOnViewModeChange}
        filter={defaultFilter}
        onFilterChange={mockOnFilterChange}
        onSearch={mockOnSearch}
        className="custom-toolbar-class"
      />
    );

    // 两个容器都应该有自定义类名
    const elementsWithClass = container.querySelectorAll(".custom-toolbar-class");
    expect(elementsWithClass.length).toBe(2);
  });

  test("TC-010: 支持所有主题", () => {
    const themes = ["tiger", "sweet", "dongzhu", "kaige"];

    themes.forEach(theme => {
      const { container } = render(
        <IconToolbar
          viewMode="timeline"
          onViewModeChange={mockOnViewModeChange}
          filter={defaultFilter}
          onFilterChange={mockOnFilterChange}
          onSearch={mockOnSearch}
          theme={theme}
        />
      );

      // 至少有两个容器有主题属性（移动端和 PC 端 toolbar）
      const themedElements = container.querySelectorAll(`[data-theme="${theme}"]`);
      expect(themedElements.length).toBeGreaterThanOrEqual(2);
    });
  });

  test("TC-011: 响应式布局 - 移动端", () => {
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 375,
    });
    window.dispatchEvent(new Event("resize"));

    const { container } = render(
      <IconToolbar
        viewMode="timeline"
        onViewModeChange={mockOnViewModeChange}
        filter={defaultFilter}
        onFilterChange={mockOnFilterChange}
        onSearch={mockOnSearch}
      />
    );

    // 移动端容器使用 flex-col
    const mobileToolbar = container.querySelector(".sm\\:hidden");
    expect(mobileToolbar).toHaveClass(/flex-col/);

    // PC 端容器使用 flex-row
    const desktopToolbar = container.querySelector(".hidden.sm\\:flex");
    expect(desktopToolbar).toHaveClass(/flex-row/);
  });

  test("TC-012: 图标按钮尺寸为 36x36px", () => {
    render(
      <IconToolbar
        viewMode="timeline"
        onViewModeChange={mockOnViewModeChange}
        filter={defaultFilter}
        onFilterChange={mockOnFilterChange}
        onSearch={mockOnSearch}
      />
    );

    // 检查 CycleViewButton 和 SearchButton 是 36x36px (w-9 h-9)
    const cycleViewButton = screen.getByRole("button", { name: /切换视图/i });
    const searchButtons = screen.getAllByRole("button", { name: /搜索/i });

    expect(cycleViewButton.className).toMatch(/w-9/);
    expect(cycleViewButton.className).toMatch(/h-9/);
    expect(searchButtons[0].className).toMatch(/w-9/);
    expect(searchButtons[0].className).toMatch(/h-9/);
  });

  test("TC-013: 正确传递 searchSuggestions 到 SearchButton", () => {
    const suggestions = ["视频1", "视频2", "视频3"];

    render(
      <IconToolbar
        viewMode="timeline"
        onViewModeChange={mockOnViewModeChange}
        filter={defaultFilter}
        onFilterChange={mockOnFilterChange}
        onSearch={mockOnSearch}
        searchSuggestions={suggestions}
      />
    );

    const searchButtons = screen.getAllByRole("button", { name: /搜索/i });
    fireEvent.click(searchButtons[0]);

    suggestions.forEach(suggestion => {
      expect(screen.getByText(suggestion)).toBeInTheDocument();
    });
  });

  test("TC-014: 正确传递 searchHistory 到 SearchButton", () => {
    const history = ["历史1", "历史2"];

    render(
      <IconToolbar
        viewMode="timeline"
        onViewModeChange={mockOnViewModeChange}
        filter={defaultFilter}
        onFilterChange={mockOnFilterChange}
        onSearch={mockOnSearch}
        searchHistory={history}
      />
    );

    const searchButtons = screen.getAllByRole("button", { name: /搜索/i });
    fireEvent.click(searchButtons[0]);

    expect(screen.getByText(/搜索历史/i)).toBeInTheDocument();
    history.forEach(item => {
      expect(screen.getByText(item)).toBeInTheDocument();
    });
  });
});

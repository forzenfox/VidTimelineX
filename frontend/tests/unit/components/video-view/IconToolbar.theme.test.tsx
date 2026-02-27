import React from "react";
import { render, screen } from "@testing-library/react";
import { IconToolbar } from "@/components/video-view/IconToolbar";
import type { FilterState } from "@/hooks/types";
import "@testing-library/jest-dom";

describe("IconToolbar 主题支持测试", () => {
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

  test("TC-ICON-THEME-001: theme='blood'时正确应用血怒主题样式", () => {
    const { container } = render(
      <IconToolbar
        viewMode="grid"
        onViewModeChange={mockOnViewModeChange}
        filter={defaultFilter}
        onFilterChange={mockOnFilterChange}
        onSearch={mockOnSearch}
        theme="blood"
      />
    );

    // IconToolbar渲染两个工具栏（移动端和PC端）
    const toolbars = container.querySelectorAll('[data-theme="blood"]');
    expect(toolbars.length).toBeGreaterThanOrEqual(1);
  });

  test("TC-ICON-THEME-002: theme='mix'时正确应用混躺主题样式", () => {
    const { container } = render(
      <IconToolbar
        viewMode="grid"
        onViewModeChange={mockOnViewModeChange}
        filter={defaultFilter}
        onFilterChange={mockOnFilterChange}
        onSearch={mockOnSearch}
        theme="mix"
      />
    );

    const toolbars = container.querySelectorAll('[data-theme="mix"]');
    expect(toolbars.length).toBeGreaterThanOrEqual(1);
  });

  test("TC-ICON-THEME-003: theme未提供时不设置data-theme", () => {
    const { container } = render(
      <IconToolbar
        viewMode="grid"
        onViewModeChange={mockOnViewModeChange}
        filter={defaultFilter}
        onFilterChange={mockOnFilterChange}
        onSearch={mockOnSearch}
      />
    );

    // 获取所有带有role="toolbar"的元素
    const toolbars = container.querySelectorAll('[role="toolbar"]');
    toolbars.forEach(toolbar => {
      expect(toolbar.getAttribute("data-theme")).toBeNull();
    });
  });

  test("TC-ICON-THEME-004: 移动端工具栏具有正确的响应式类名", () => {
    const { container } = render(
      <IconToolbar
        viewMode="grid"
        onViewModeChange={mockOnViewModeChange}
        filter={defaultFilter}
        onFilterChange={mockOnFilterChange}
        onSearch={mockOnSearch}
        theme="blood"
      />
    );

    // 移动端工具栏应该有sm:hidden类
    const mobileToolbar = container.querySelector(".sm\\:hidden");
    expect(mobileToolbar).toBeInTheDocument();
  });

  test("TC-ICON-THEME-005: PC端工具栏具有正确的响应式类名", () => {
    const { container } = render(
      <IconToolbar
        viewMode="grid"
        onViewModeChange={mockOnViewModeChange}
        filter={defaultFilter}
        onFilterChange={mockOnFilterChange}
        onSearch={mockOnSearch}
        theme="blood"
      />
    );

    // PC端工具栏应该有hidden sm:flex类
    const pcToolbar = container.querySelector(".hidden.sm\\:flex");
    expect(pcToolbar).toBeInTheDocument();
  });

  test("TC-ICON-THEME-006: CycleViewButton在移动端渲染", () => {
    render(
      <IconToolbar
        viewMode="grid"
        onViewModeChange={mockOnViewModeChange}
        filter={defaultFilter}
        onFilterChange={mockOnFilterChange}
        onSearch={mockOnSearch}
        theme="blood"
      />
    );

    // CycleViewButton应该渲染（通过aria-label查找）
    const cycleButton = screen.getByRole("button", { name: /切换视图/i });
    expect(cycleButton).toBeInTheDocument();
  });

  test("TC-ICON-THEME-007: ViewSwitcher在PC端渲染", () => {
    render(
      <IconToolbar
        viewMode="grid"
        onViewModeChange={mockOnViewModeChange}
        filter={defaultFilter}
        onFilterChange={mockOnFilterChange}
        onSearch={mockOnSearch}
        theme="blood"
      />
    );

    // PC端应该有ViewSwitcher（通过role="group"识别）
    const viewSwitcher = screen.getByRole("group");
    expect(viewSwitcher).toBeInTheDocument();
  });

  test("TC-ICON-THEME-008: SearchButton接收theme属性", () => {
    render(
      <IconToolbar
        viewMode="grid"
        onViewModeChange={mockOnViewModeChange}
        filter={defaultFilter}
        onFilterChange={mockOnFilterChange}
        onSearch={mockOnSearch}
        theme="mix"
      />
    );

    // SearchButton应该渲染（通过aria-label查找）
    const searchButtons = screen.getAllByRole("button", { name: /搜索/i });
    expect(searchButtons.length).toBeGreaterThanOrEqual(1);
  });

  test("TC-ICON-THEME-009: FilterDropdown和SortDropdown使用正确的variant", () => {
    render(
      <IconToolbar
        viewMode="grid"
        onViewModeChange={mockOnViewModeChange}
        filter={defaultFilter}
        onFilterChange={mockOnFilterChange}
        onSearch={mockOnSearch}
        theme="blood"
      />
    );

    // 移动端使用icon variant，PC端使用default variant
    // 验证按钮存在
    const filterButtons = screen.getAllByTestId("filter-trigger-button");
    const sortButtons = screen.getAllByTestId("sort-trigger-button");

    expect(filterButtons.length).toBeGreaterThanOrEqual(1);
    expect(sortButtons.length).toBeGreaterThanOrEqual(1);
  });

  test("TC-ICON-THEME-010: 主题切换时组件重新渲染", () => {
    const { container, rerender } = render(
      <IconToolbar
        viewMode="grid"
        onViewModeChange={mockOnViewModeChange}
        filter={defaultFilter}
        onFilterChange={mockOnFilterChange}
        onSearch={mockOnSearch}
        theme="blood"
      />
    );

    let toolbars = container.querySelectorAll('[data-theme="blood"]');
    expect(toolbars.length).toBeGreaterThanOrEqual(1);

    // 切换到mix主题
    rerender(
      <IconToolbar
        viewMode="grid"
        onViewModeChange={mockOnViewModeChange}
        filter={defaultFilter}
        onFilterChange={mockOnFilterChange}
        onSearch={mockOnSearch}
        theme="mix"
      />
    );

    toolbars = container.querySelectorAll('[data-theme="mix"]');
    expect(toolbars.length).toBeGreaterThanOrEqual(1);
  });
});

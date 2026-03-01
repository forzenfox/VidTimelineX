import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { IconToolbar } from "@/components/business/video-view/IconToolbar";
import type { ViewMode, FilterState } from "@/hooks/types";
import "@testing-library/jest-dom";

describe("IconToolbar 响应式测试", () => {
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

  describe("移动端渲染 (<640px)", () => {
    test("TC-001: 移动端渲染纯图标组件", () => {
      const { container } = render(
        <IconToolbar
          viewMode="timeline"
          onViewModeChange={mockOnViewModeChange}
          filter={defaultFilter}
          onFilterChange={mockOnFilterChange}
          onSearch={mockOnSearch}
        />
      );

      // 移动端容器应该使用 sm:hidden
      const mobileContainer = container.querySelector(".sm\\:hidden");
      expect(mobileContainer).toBeInTheDocument();
    });

    test("TC-002: 移动端使用 CycleViewButton 纯图标模式", () => {
      render(
        <IconToolbar
          viewMode="timeline"
          onViewModeChange={mockOnViewModeChange}
          filter={defaultFilter}
          onFilterChange={mockOnFilterChange}
          onSearch={mockOnSearch}
        />
      );

      // 移动端应该只有一个切换视图按钮（纯图标）
      const viewButtons = screen.getAllByRole("button", { name: /切换视图/i });
      expect(viewButtons.length).toBeGreaterThanOrEqual(1);
    });

    test("TC-003: 移动端使用 SearchButton 纯图标模式", () => {
      render(
        <IconToolbar
          viewMode="timeline"
          onViewModeChange={mockOnViewModeChange}
          filter={defaultFilter}
          onFilterChange={mockOnFilterChange}
          onSearch={mockOnSearch}
        />
      );

      // 移动端搜索按钮应该是纯图标
      const searchButtons = screen.getAllByRole("button", { name: /搜索/i });
      expect(searchButtons.length).toBeGreaterThanOrEqual(1);
    });

    test("TC-004: 移动端使用 FilterDropdown 纯图标模式", () => {
      render(
        <IconToolbar
          viewMode="timeline"
          onViewModeChange={mockOnViewModeChange}
          filter={defaultFilter}
          onFilterChange={mockOnFilterChange}
          onSearch={mockOnSearch}
        />
      );

      // 移动端筛选按钮应该是纯图标
      const filterButtons = screen.getAllByTestId("filter-trigger-button");
      expect(filterButtons.length).toBeGreaterThanOrEqual(1);
    });

    test("TC-005: 移动端使用 SortDropdown 纯图标模式", () => {
      render(
        <IconToolbar
          viewMode="timeline"
          onViewModeChange={mockOnViewModeChange}
          filter={defaultFilter}
          onFilterChange={mockOnFilterChange}
          onSearch={mockOnSearch}
        />
      );

      // 移动端排序按钮应该是纯图标 - 使用 data-testid 查找
      const sortButtons = screen.getAllByTestId("sort-trigger-button");
      expect(sortButtons.length).toBeGreaterThanOrEqual(1);
    });

    test("TC-006: 移动端图标按钮尺寸为 36x36px", () => {
      render(
        <IconToolbar
          viewMode="timeline"
          onViewModeChange={mockOnViewModeChange}
          filter={defaultFilter}
          onFilterChange={mockOnFilterChange}
          onSearch={mockOnSearch}
        />
      );

      // 检查移动端按钮尺寸
      const viewButtons = screen.getAllByRole("button", { name: /切换视图/i });
      expect(viewButtons[0].className).toMatch(/w-9/);
      expect(viewButtons[0].className).toMatch(/h-9/);
    });
  });

  describe("PC端渲染 (≥640px)", () => {
    test("TC-007: PC端渲染图标+文字组件", () => {
      const { container } = render(
        <IconToolbar
          viewMode="timeline"
          onViewModeChange={mockOnViewModeChange}
          filter={defaultFilter}
          onFilterChange={mockOnFilterChange}
          onSearch={mockOnSearch}
        />
      );

      // PC端容器应该使用 hidden sm:flex
      const desktopContainer = container.querySelector(".hidden.sm\\:flex");
      expect(desktopContainer).toBeInTheDocument();
    });

    test("TC-008: PC端使用 ViewSwitcher 图标+文字模式", () => {
      render(
        <IconToolbar
          viewMode="timeline"
          onViewModeChange={mockOnViewModeChange}
          filter={defaultFilter}
          onFilterChange={mockOnFilterChange}
          onSearch={mockOnSearch}
        />
      );

      // PC端应该有三个视图切换按钮带文字
      expect(screen.getByRole("button", { name: /时光轴/i })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /网格/i })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /列表/i })).toBeInTheDocument();
    });

    test("TC-009: PC端使用 FilterDropdown 图标+文字模式", () => {
      render(
        <IconToolbar
          viewMode="timeline"
          onViewModeChange={mockOnViewModeChange}
          filter={defaultFilter}
          onFilterChange={mockOnFilterChange}
          onSearch={mockOnSearch}
        />
      );

      // PC端筛选按钮应该显示文字
      const filterButtons = screen.getAllByTestId("filter-trigger-button");
      // 应该有两个筛选按钮（移动端和PC端）
      expect(filterButtons.length).toBeGreaterThanOrEqual(1);
    });

    test("TC-010: PC端使用 SortDropdown 图标+文字模式", () => {
      render(
        <IconToolbar
          viewMode="timeline"
          onViewModeChange={mockOnViewModeChange}
          filter={defaultFilter}
          onFilterChange={mockOnFilterChange}
          onSearch={mockOnSearch}
        />
      );

      // PC端排序按钮应该显示文字 - 使用 data-testid 查找
      const sortButtons = screen.getAllByTestId("sort-trigger-button");
      expect(sortButtons.length).toBeGreaterThanOrEqual(1);
    });

    test("TC-011: PC端按钮高度为 40px", () => {
      render(
        <IconToolbar
          viewMode="timeline"
          onViewModeChange={mockOnViewModeChange}
          filter={defaultFilter}
          onFilterChange={mockOnFilterChange}
          onSearch={mockOnSearch}
        />
      );

      // PC端视图切换按钮应该有 h-10 类
      const timelineButton = screen.getByRole("button", { name: /时光轴/i });
      expect(timelineButton).toHaveClass(/h-10/);
    });
  });

  describe("响应式切换", () => {
    test("TC-012: 同时渲染移动端和PC端容器", () => {
      const { container } = render(
        <IconToolbar
          viewMode="timeline"
          onViewModeChange={mockOnViewModeChange}
          filter={defaultFilter}
          onFilterChange={mockOnFilterChange}
          onSearch={mockOnSearch}
        />
      );

      // 应该同时存在移动端和PC端容器
      const mobileContainer = container.querySelector(".sm\\:hidden");
      const desktopContainer = container.querySelector(".hidden.sm\\:flex");

      expect(mobileContainer).toBeInTheDocument();
      expect(desktopContainer).toBeInTheDocument();
    });

    test("TC-013: 移动端和PC端使用不同的 ViewSwitcher variant", () => {
      render(
        <IconToolbar
          viewMode="timeline"
          onViewModeChange={mockOnViewModeChange}
          filter={defaultFilter}
          onFilterChange={mockOnFilterChange}
          onSearch={mockOnSearch}
        />
      );

      // PC端应该有三个按钮
      expect(screen.getByRole("button", { name: /时光轴/i })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /网格/i })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /列表/i })).toBeInTheDocument();

      // 移动端应该有一个循环按钮
      const viewButtons = screen.getAllByRole("button", { name: /切换视图/i });
      expect(viewButtons.length).toBeGreaterThanOrEqual(1);
    });

    test("TC-014: 移动端和PC端使用不同的 FilterDropdown variant", () => {
      render(
        <IconToolbar
          viewMode="timeline"
          onViewModeChange={mockOnViewModeChange}
          filter={defaultFilter}
          onFilterChange={mockOnFilterChange}
          onSearch={mockOnSearch}
        />
      );

      // 应该有两个筛选按钮容器
      const filterButtons = screen.getAllByTestId("filter-trigger-button");
      expect(filterButtons.length).toBe(2);
    });

    test("TC-015: 移动端和PC端使用不同的 SortDropdown variant", () => {
      render(
        <IconToolbar
          viewMode="timeline"
          onViewModeChange={mockOnViewModeChange}
          filter={defaultFilter}
          onFilterChange={mockOnFilterChange}
          onSearch={mockOnSearch}
        />
      );

      // 应该有两个排序按钮
      const sortButtons = screen.getAllByTestId("sort-trigger-button");
      expect(sortButtons.length).toBe(2);
    });
  });

  describe("子组件正确集成", () => {
    test("TC-016: CycleViewButton 在移动端正确渲染", () => {
      render(
        <IconToolbar
          viewMode="timeline"
          onViewModeChange={mockOnViewModeChange}
          filter={defaultFilter}
          onFilterChange={mockOnFilterChange}
          onSearch={mockOnSearch}
        />
      );

      const viewButtons = screen.getAllByRole("button", { name: /切换视图/i });
      expect(viewButtons.length).toBeGreaterThanOrEqual(1);

      // 点击应该触发视图切换
      fireEvent.click(viewButtons[0]);
      expect(mockOnViewModeChange).toHaveBeenCalled();
    });

    test("TC-017: SearchButton 在移动端正确渲染", () => {
      render(
        <IconToolbar
          viewMode="timeline"
          onViewModeChange={mockOnViewModeChange}
          filter={defaultFilter}
          onFilterChange={mockOnFilterChange}
          onSearch={mockOnSearch}
        />
      );

      const searchButtons = screen.getAllByRole("button", { name: /搜索/i });
      expect(searchButtons.length).toBeGreaterThanOrEqual(1);
    });

    test("TC-018: FilterDropdown 在移动端正确渲染", () => {
      render(
        <IconToolbar
          viewMode="timeline"
          onViewModeChange={mockOnViewModeChange}
          filter={defaultFilter}
          onFilterChange={mockOnFilterChange}
          onSearch={mockOnSearch}
        />
      );

      const filterButtons = screen.getAllByTestId("filter-trigger-button");
      expect(filterButtons.length).toBe(2);

      // 点击应该打开筛选弹窗
      fireEvent.click(filterButtons[0]);
      expect(screen.getByText(/时长/i)).toBeInTheDocument();
    });

    test("TC-019: SortDropdown 在移动端正确渲染", () => {
      render(
        <IconToolbar
          viewMode="timeline"
          onViewModeChange={mockOnViewModeChange}
          filter={defaultFilter}
          onFilterChange={mockOnFilterChange}
          onSearch={mockOnSearch}
        />
      );

      const sortButtons = screen.getAllByTestId("sort-trigger-button");
      expect(sortButtons.length).toBe(2);

      // 点击应该打开排序弹窗
      fireEvent.click(sortButtons[0]);
      // 弹窗中会有多个"最新发布"，使用 getAllByText
      expect(screen.getAllByText(/最新发布/i).length).toBeGreaterThanOrEqual(1);
    });

    test("TC-020: ViewSwitcher 在 PC 端正确渲染", () => {
      render(
        <IconToolbar
          viewMode="grid"
          onViewModeChange={mockOnViewModeChange}
          filter={defaultFilter}
          onFilterChange={mockOnFilterChange}
          onSearch={mockOnSearch}
        />
      );

      // PC 端应该有三个视图按钮
      const timelineButton = screen.getByRole("button", { name: /时光轴/i });
      const gridButton = screen.getByRole("button", { name: /网格/i });
      const listButton = screen.getByRole("button", { name: /列表/i });

      expect(timelineButton).toBeInTheDocument();
      expect(gridButton).toBeInTheDocument();
      expect(listButton).toBeInTheDocument();

      // 点击应该触发视图切换
      fireEvent.click(timelineButton);
      expect(mockOnViewModeChange).toHaveBeenCalledWith("timeline");
    });

    test("TC-021: 所有子组件正确传递 props", () => {
      const customFilter: FilterState = {
        duration: "short",
        timeRange: "week",
        sortBy: "oldest",
      };

      const { container } = render(
        <IconToolbar
          viewMode="list"
          onViewModeChange={mockOnViewModeChange}
          filter={customFilter}
          onFilterChange={mockOnFilterChange}
          onSearch={mockOnSearch}
          theme="kaige"
          searchSuggestions={["建议1", "建议2"]}
          searchHistory={["历史1"]}
          onClearHistory={jest.fn()}
        />
      );

      // 验证组件正确渲染 - 使用 getAllByRole 因为有多个 toolbar
      const toolbars = screen.getAllByRole("toolbar");
      expect(toolbars.length).toBe(2);

      // 验证视图按钮存在
      const viewButtons = screen.getAllByRole("button", { name: /切换视图/i });
      expect(viewButtons.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe("主题和样式", () => {
    test("TC-022: 正确应用主题到移动端组件", () => {
      const { container } = render(
        <IconToolbar
          viewMode="timeline"
          onViewModeChange={mockOnViewModeChange}
          filter={defaultFilter}
          onFilterChange={mockOnFilterChange}
          onSearch={mockOnSearch}
          theme="kaige"
        />
      );

      const toolbar = container.querySelector('[data-theme="kaige"]');
      expect(toolbar).toBeInTheDocument();
    });

    test("TC-023: 正确应用主题到 PC 端组件", () => {
      const { container } = render(
        <IconToolbar
          viewMode="timeline"
          onViewModeChange={mockOnViewModeChange}
          filter={defaultFilter}
          onFilterChange={mockOnFilterChange}
          onSearch={mockOnSearch}
          theme="kaige"
        />
      );

      // PC 端也应该有主题
      const themedElements = container.querySelectorAll('[data-theme="kaige"]');
      expect(themedElements.length).toBeGreaterThanOrEqual(1);
    });

    test("TC-024: 自定义 className 正确应用到两个容器", () => {
      const { container } = render(
        <IconToolbar
          viewMode="timeline"
          onViewModeChange={mockOnViewModeChange}
          filter={defaultFilter}
          onFilterChange={mockOnFilterChange}
          onSearch={mockOnSearch}
          className="custom-toolbar"
        />
      );

      // 两个容器都应该有自定义类名
      const elementsWithClass = container.querySelectorAll(".custom-toolbar");
      expect(elementsWithClass.length).toBe(2);
    });
  });
});

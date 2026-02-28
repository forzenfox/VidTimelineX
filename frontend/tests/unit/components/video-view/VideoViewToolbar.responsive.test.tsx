import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { VideoViewToolbar } from "@/components/video-view/VideoViewToolbar";
import type { ViewMode, FilterState } from "@/hooks/types";
import "@testing-library/jest-dom";

describe("VideoViewToolbar 响应式测试", () => {
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

  describe("移动端渲染 (<640px)", () => {
    test("TC-001: 移动端隐藏工具栏 (hidden sm:flex)", () => {
      const { container } = render(
        <VideoViewToolbar
          viewMode="grid"
          onViewModeChange={mockOnViewModeChange}
          filter={defaultFilter}
          onFilterChange={mockOnFilterChange}
        />
      );

      // 移动端应该隐藏
      const toolbar = container.firstChild as HTMLElement;
      expect(toolbar).toHaveClass("hidden");
      expect(toolbar).toHaveClass("sm:flex");
    });

    test("TC-002: 移动端不渲染 ViewSwitcher", () => {
      const { container } = render(
        <VideoViewToolbar
          viewMode="grid"
          onViewModeChange={mockOnViewModeChange}
          filter={defaultFilter}
          onFilterChange={mockOnFilterChange}
        />
      );

      // 由于 sm:flex，移动端看不到内容
      const toolbar = container.firstChild as HTMLElement;
      expect(toolbar).toHaveClass("hidden");
    });

    test("TC-003: 移动端不渲染 FilterDropdown", () => {
      const { container } = render(
        <VideoViewToolbar
          viewMode="grid"
          onViewModeChange={mockOnViewModeChange}
          filter={defaultFilter}
          onFilterChange={mockOnFilterChange}
        />
      );

      const toolbar = container.firstChild as HTMLElement;
      expect(toolbar).toHaveClass("hidden");
    });

    test("TC-004: 移动端不渲染 SortDropdown", () => {
      const { container } = render(
        <VideoViewToolbar
          viewMode="grid"
          onViewModeChange={mockOnViewModeChange}
          filter={defaultFilter}
          onFilterChange={mockOnFilterChange}
        />
      );

      const toolbar = container.firstChild as HTMLElement;
      expect(toolbar).toHaveClass("hidden");
    });
  });

  describe("PC端渲染 (≥640px)", () => {
    test("TC-005: PC端显示工具栏 (flex)", () => {
      const { container } = render(
        <VideoViewToolbar
          viewMode="grid"
          onViewModeChange={mockOnViewModeChange}
          filter={defaultFilter}
          onFilterChange={mockOnFilterChange}
        />
      );

      // PC端应该显示
      const toolbar = container.firstChild as HTMLElement;
      expect(toolbar).toHaveClass("sm:flex");
    });

    test("TC-006: PC端渲染 ViewSwitcher 组件", () => {
      render(
        <VideoViewToolbar
          viewMode="grid"
          onViewModeChange={mockOnViewModeChange}
          filter={defaultFilter}
          onFilterChange={mockOnFilterChange}
        />
      );

      // PC端应该有三个视图按钮
      expect(screen.getByRole("button", { name: /时光轴/i })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /网格/i })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /列表/i })).toBeInTheDocument();
    });

    test("TC-007: PC端渲染 FilterDropdown 组件", () => {
      render(
        <VideoViewToolbar
          viewMode="grid"
          onViewModeChange={mockOnViewModeChange}
          filter={defaultFilter}
          onFilterChange={mockOnFilterChange}
        />
      );

      // PC端应该有筛选按钮
      expect(screen.getByTestId("filter-trigger-button")).toBeInTheDocument();
    });

    test("TC-008: PC端渲染 SortDropdown 组件", () => {
      render(
        <VideoViewToolbar
          viewMode="grid"
          onViewModeChange={mockOnViewModeChange}
          filter={defaultFilter}
          onFilterChange={mockOnFilterChange}
        />
      );

      // PC端应该有排序按钮 - 使用 data-testid
      expect(screen.getByTestId("sort-trigger-button")).toBeInTheDocument();
    });

    test("TC-009: PC端使用 variant='default' 模式", () => {
      render(
        <VideoViewToolbar
          viewMode="grid"
          onViewModeChange={mockOnViewModeChange}
          filter={defaultFilter}
          onFilterChange={mockOnFilterChange}
        />
      );

      // ViewSwitcher 应该显示文字
      expect(screen.getByRole("button", { name: /时光轴/i })).toBeInTheDocument();

      // FilterDropdown 应该显示文字
      const filterButton = screen.getByTestId("filter-trigger-button");
      expect(filterButton.textContent).toContain("筛选");

      // SortDropdown 应该显示文字
      const sortButton = screen.getByTestId("sort-trigger-button");
      expect(sortButton.textContent).toContain("最新发布");
    });

    test("TC-010: PC端使用水平布局 (flex-row)", () => {
      const { container } = render(
        <VideoViewToolbar
          viewMode="grid"
          onViewModeChange={mockOnViewModeChange}
          filter={defaultFilter}
          onFilterChange={mockOnFilterChange}
        />
      );

      const toolbar = container.firstChild as HTMLElement;
      expect(toolbar).toHaveClass("flex-row");
    });

    test("TC-011: PC端按钮尺寸为 40px (h-10)", () => {
      render(
        <VideoViewToolbar
          viewMode="grid"
          onViewModeChange={mockOnViewModeChange}
          filter={defaultFilter}
          onFilterChange={mockOnFilterChange}
        />
      );

      // ViewSwitcher 按钮应该有 h-10
      const timelineButton = screen.getByRole("button", { name: /时光轴/i });
      expect(timelineButton).toHaveClass(/h-10/);
    });
  });

  describe("响应式类名", () => {
    test("TC-012: 工具栏有正确的响应式类名", () => {
      const { container } = render(
        <VideoViewToolbar
          viewMode="grid"
          onViewModeChange={mockOnViewModeChange}
          filter={defaultFilter}
          onFilterChange={mockOnFilterChange}
        />
      );

      const toolbar = container.firstChild as HTMLElement;
      // 移动端隐藏，PC端显示
      expect(toolbar).toHaveClass("hidden");
      expect(toolbar).toHaveClass("sm:flex");
    });

    test("TC-013: 工具栏有正确的布局类名", () => {
      const { container } = render(
        <VideoViewToolbar
          viewMode="grid"
          onViewModeChange={mockOnViewModeChange}
          filter={defaultFilter}
          onFilterChange={mockOnFilterChange}
        />
      );

      const toolbar = container.firstChild as HTMLElement;
      expect(toolbar).toHaveClass("items-center");
    });

    test("TC-014: 工具栏有正确的样式类名", () => {
      const { container } = render(
        <VideoViewToolbar
          viewMode="grid"
          onViewModeChange={mockOnViewModeChange}
          filter={defaultFilter}
          onFilterChange={mockOnFilterChange}
        />
      );

      const toolbar = container.firstChild as HTMLElement;
      expect(toolbar).toHaveClass("bg-card/70");
      expect(toolbar).toHaveClass("border");
      expect(toolbar).toHaveClass("rounded-2xl");
      expect(toolbar).toHaveClass("shadow-lg");
    });
  });

  describe("子组件正确渲染", () => {
    test("TC-015: ViewSwitcher 正确渲染并传递 props", () => {
      render(
        <VideoViewToolbar
          viewMode="list"
          onViewModeChange={mockOnViewModeChange}
          filter={defaultFilter}
          onFilterChange={mockOnFilterChange}
          theme="kaige"
        />
      );

      // 应该有三个视图按钮
      const timelineButton = screen.getByRole("button", { name: /时光轴/i });
      const gridButton = screen.getByRole("button", { name: /网格/i });
      const listButton = screen.getByRole("button", { name: /列表/i });

      expect(timelineButton).toBeInTheDocument();
      expect(gridButton).toBeInTheDocument();
      expect(listButton).toBeInTheDocument();

      // list 应该是激活状态
      expect(listButton).toHaveAttribute("aria-pressed", "true");
    });

    test("TC-016: FilterDropdown 正确渲染并传递 props", () => {
      const filterWithDuration: FilterState = {
        duration: "short",
        timeRange: "week",
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

      // 筛选按钮应该显示激活状态
      const filterButton = screen.getByTestId("filter-trigger-button");
      expect(filterButton).toBeInTheDocument();

      // 应该有激活指示器
      expect(screen.getByTestId("filter-indicator")).toBeInTheDocument();
    });

    test("TC-017: SortDropdown 正确渲染并传递 props", () => {
      const filterWithSort: FilterState = {
        duration: "all",
        timeRange: "all",
        sortBy: "oldest",
      };

      render(
        <VideoViewToolbar
          viewMode="grid"
          onViewModeChange={mockOnViewModeChange}
          filter={filterWithSort}
          onFilterChange={mockOnFilterChange}
        />
      );

      // 排序按钮应该显示"最早发布"
      const sortButton = screen.getByTestId("sort-trigger-button");
      expect(sortButton).toBeInTheDocument();
      expect(sortButton.textContent).toContain("最早发布");
    });

    test("TC-018: 点击 ViewSwitcher 触发视图切换", () => {
      render(
        <VideoViewToolbar
          viewMode="timeline"
          onViewModeChange={mockOnViewModeChange}
          filter={defaultFilter}
          onFilterChange={mockOnFilterChange}
        />
      );

      const gridButton = screen.getByRole("button", { name: /网格/i });
      fireEvent.click(gridButton);

      expect(mockOnViewModeChange).toHaveBeenCalledWith("grid");
    });

    test("TC-019: 点击 FilterDropdown 打开筛选弹窗", () => {
      render(
        <VideoViewToolbar
          viewMode="grid"
          onViewModeChange={mockOnViewModeChange}
          filter={defaultFilter}
          onFilterChange={mockOnFilterChange}
        />
      );

      const filterButton = screen.getByTestId("filter-trigger-button");
      fireEvent.click(filterButton);

      // 应该显示筛选选项
      expect(screen.getByText(/时长/i)).toBeInTheDocument();
      expect(screen.getByText(/发布时间/i)).toBeInTheDocument();
    });

    test("TC-020: 点击 SortDropdown 打开排序弹窗", () => {
      render(
        <VideoViewToolbar
          viewMode="grid"
          onViewModeChange={mockOnViewModeChange}
          filter={defaultFilter}
          onFilterChange={mockOnFilterChange}
        />
      );

      const sortButton = screen.getByTestId("sort-trigger-button");
      fireEvent.click(sortButton);

      // 应该显示排序选项
      expect(screen.getAllByText(/最新发布/i).length).toBeGreaterThanOrEqual(1);
      expect(screen.getByText(/最早发布/i)).toBeInTheDocument();
    });
  });

  describe("主题和样式", () => {
    test("TC-021: 正确应用主题", () => {
      const { container } = render(
        <VideoViewToolbar
          viewMode="grid"
          onViewModeChange={mockOnViewModeChange}
          filter={defaultFilter}
          onFilterChange={mockOnFilterChange}
          theme="kaige"
        />
      );

      const toolbar = container.firstChild as HTMLElement;
      expect(toolbar).toHaveAttribute("data-theme", "kaige");
    });

    test("TC-022: 自定义 className 正确应用", () => {
      const { container } = render(
        <VideoViewToolbar
          viewMode="grid"
          onViewModeChange={mockOnViewModeChange}
          filter={defaultFilter}
          onFilterChange={mockOnFilterChange}
          className="custom-class"
        />
      );

      const toolbar = container.firstChild as HTMLElement;
      expect(toolbar).toHaveClass("custom-class");
    });

    test("TC-023: 工具栏有正确的背景和边框", () => {
      const { container } = render(
        <VideoViewToolbar
          viewMode="grid"
          onViewModeChange={mockOnViewModeChange}
          filter={defaultFilter}
          onFilterChange={mockOnFilterChange}
        />
      );

      const toolbar = container.firstChild as HTMLElement;
      expect(toolbar).toHaveClass("bg-card/70");
      expect(toolbar).toHaveClass("border-border/50");
      expect(toolbar).toHaveClass("backdrop-blur-md");
    });
  });

  describe("整合测试", () => {
    test("TC-024: 所有子组件同时正确渲染", () => {
      render(
        <VideoViewToolbar
          viewMode="grid"
          onViewModeChange={mockOnViewModeChange}
          filter={defaultFilter}
          onFilterChange={mockOnFilterChange}
        />
      );

      // ViewSwitcher: 3 个按钮
      expect(screen.getByRole("button", { name: /时光轴/i })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /网格/i })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /列表/i })).toBeInTheDocument();

      // FilterDropdown
      expect(screen.getByTestId("filter-trigger-button")).toBeInTheDocument();

      // SortDropdown
      expect(screen.getByTestId("sort-trigger-button")).toBeInTheDocument();
    });

    test("TC-025: 所有交互功能正常工作", () => {
      render(
        <VideoViewToolbar
          viewMode="timeline"
          onViewModeChange={mockOnViewModeChange}
          filter={defaultFilter}
          onFilterChange={mockOnFilterChange}
        />
      );

      // 测试视图切换
      fireEvent.click(screen.getByRole("button", { name: /网格/i }));
      expect(mockOnViewModeChange).toHaveBeenCalledWith("grid");

      // 测试筛选弹窗
      fireEvent.click(screen.getByTestId("filter-trigger-button"));
      expect(screen.getByText(/时长/i)).toBeInTheDocument();

      // 测试排序弹窗
      fireEvent.click(screen.getByTestId("sort-trigger-button"));
      expect(screen.getAllByText(/最新发布/i).length).toBeGreaterThanOrEqual(1);
    });
  });
});

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { FilterDropdown } from "@/components/video-view/FilterDropdown";
import type { FilterState } from "@/hooks/types";
import "@testing-library/jest-dom";

describe("FilterDropdown 响应式测试", () => {
  const mockOnFilterChange = jest.fn();

  const defaultFilter: FilterState = {
    duration: "all",
    timeRange: "all",
    sortBy: "newest",
  };

  beforeEach(() => {
    mockOnFilterChange.mockClear();
  });

  describe("variant='icon' 模式", () => {
    test("TC-001: 渲染纯图标按钮（无文字）", () => {
      render(
        <FilterDropdown
          filter={defaultFilter}
          onFilterChange={mockOnFilterChange}
          variant="icon"
        />
      );

      const button = screen.getByTestId("filter-trigger-button");
      expect(button).toBeInTheDocument();
      // 图标按钮不应该包含"筛选"文字
      expect(button.textContent).not.toContain("筛选");
    });

    test("TC-002: 按钮尺寸为 36x36px (w-9 h-9)", () => {
      render(
        <FilterDropdown
          filter={defaultFilter}
          onFilterChange={mockOnFilterChange}
          variant="icon"
        />
      );

      const button = screen.getByTestId("filter-trigger-button");
      expect(button).toHaveClass("w-9");
      expect(button).toHaveClass("h-9");
    });

    test("TC-003: 有过滤器激活时显示指示点", () => {
      const activeFilter: FilterState = {
        duration: "short",
        timeRange: "all",
        sortBy: "newest",
      };

      render(
        <FilterDropdown
          filter={activeFilter}
          onFilterChange={mockOnFilterChange}
          variant="icon"
        />
      );

      expect(screen.getByTestId("filter-indicator")).toBeInTheDocument();
    });

    test("TC-004: 点击按钮展开下拉面板", () => {
      render(
        <FilterDropdown
          filter={defaultFilter}
          onFilterChange={mockOnFilterChange}
          variant="icon"
        />
      );

      const button = screen.getByTestId("filter-trigger-button");
      fireEvent.click(button);

      // 下拉面板应该显示
      expect(screen.getByText("时长")).toBeInTheDocument();
      expect(screen.getByText("发布时间")).toBeInTheDocument();
    });
  });

  describe("variant='default' 模式", () => {
    test("TC-005: 渲染图标+文字按钮", () => {
      render(
        <FilterDropdown
          filter={defaultFilter}
          onFilterChange={mockOnFilterChange}
          variant="default"
        />
      );

      const button = screen.getByRole("button", { name: /筛选/i });
      expect(button).toBeInTheDocument();
      // 应该包含"筛选"文字
      expect(button.textContent).toContain("筛选");
    });

    test("TC-006: 按钮高度为 40px (h-10)", () => {
      render(
        <FilterDropdown
          filter={defaultFilter}
          onFilterChange={mockOnFilterChange}
          variant="default"
        />
      );

      const button = screen.getByRole("button", { name: /筛选/i });
      expect(button).toHaveClass("h-10");
    });

    test("TC-007: 有过滤器激活时显示当前筛选文字", () => {
      const activeFilter: FilterState = {
        duration: "short",
        timeRange: "week",
        sortBy: "newest",
      };

      render(
        <FilterDropdown
          filter={activeFilter}
          onFilterChange={mockOnFilterChange}
          variant="default"
        />
      );

      // 应该显示当前筛选状态（使用 textContent 检查）
      const button = screen.getByRole("button", { name: /筛选/i });
      expect(button.textContent).toContain("0-5分钟");
      expect(button.textContent).toContain("最近一周");
    });

    test("TC-008: 点击按钮展开下拉面板", () => {
      render(
        <FilterDropdown
          filter={defaultFilter}
          onFilterChange={mockOnFilterChange}
          variant="default"
        />
      );

      const button = screen.getByRole("button", { name: /筛选/i });
      fireEvent.click(button);

      // 下拉面板应该显示
      expect(screen.getByText("时长")).toBeInTheDocument();
      expect(screen.getByText("发布时间")).toBeInTheDocument();
    });
  });

  describe("默认行为", () => {
    test("TC-009: 不传入 variant 时默认使用 default 模式", () => {
      render(
        <FilterDropdown
          filter={defaultFilter}
          onFilterChange={mockOnFilterChange}
        />
      );

      // 应该渲染图标+文字按钮
      const button = screen.getByRole("button", { name: /筛选/i });
      expect(button).toBeInTheDocument();
      expect(button.textContent).toContain("筛选");
    });
  });

  describe("功能一致性", () => {
    test("TC-010: icon 模式下筛选功能正常工作", () => {
      render(
        <FilterDropdown
          filter={defaultFilter}
          onFilterChange={mockOnFilterChange}
          variant="icon"
        />
      );

      const button = screen.getByTestId("filter-trigger-button");
      fireEvent.click(button);

      // 选择时长筛选
      fireEvent.click(screen.getByText("0-5分钟"));
      fireEvent.click(screen.getByText("应用"));

      expect(mockOnFilterChange).toHaveBeenCalledWith({
        duration: "short",
        timeRange: "all",
        sortBy: "newest",
      });
    });

    test("TC-011: default 模式下筛选功能正常工作", () => {
      render(
        <FilterDropdown
          filter={defaultFilter}
          onFilterChange={mockOnFilterChange}
          variant="default"
        />
      );

      const button = screen.getByRole("button", { name: /筛选/i });
      fireEvent.click(button);

      // 选择时长筛选
      fireEvent.click(screen.getByText("0-5分钟"));
      fireEvent.click(screen.getByText("应用"));

      expect(mockOnFilterChange).toHaveBeenCalledWith({
        duration: "short",
        timeRange: "all",
        sortBy: "newest",
      });
    });

    test("TC-012: 重置功能在两种模式下都正常工作", () => {
      const activeFilter: FilterState = {
        duration: "short",
        timeRange: "week",
        sortBy: "newest",
      };

      const { rerender } = render(
        <FilterDropdown
          filter={activeFilter}
          onFilterChange={mockOnFilterChange}
          variant="icon"
        />
      );

      let button = screen.getByTestId("filter-trigger-button");
      fireEvent.click(button);
      fireEvent.click(screen.getByText("重置"));

      expect(mockOnFilterChange).toHaveBeenCalledWith({
        duration: "all",
        timeRange: "all",
        sortBy: "newest",
      });

      mockOnFilterChange.mockClear();

      rerender(
        <FilterDropdown
          filter={activeFilter}
          onFilterChange={mockOnFilterChange}
          variant="default"
        />
      );

      button = screen.getByRole("button", { name: /筛选/i });
      fireEvent.click(button);
      fireEvent.click(screen.getByText("重置"));

      expect(mockOnFilterChange).toHaveBeenCalledWith({
        duration: "all",
        timeRange: "all",
        sortBy: "newest",
      });
    });
  });
});

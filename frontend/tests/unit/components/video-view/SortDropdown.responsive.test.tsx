import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { SortDropdown } from "@/components/video-view/SortDropdown";
import type { SortOption } from "@/hooks/types";
import "@testing-library/jest-dom";

describe("SortDropdown 响应式测试", () => {
  const mockOnSortChange = jest.fn();

  beforeEach(() => {
    mockOnSortChange.mockClear();
  });

  describe("variant='icon' 模式", () => {
    test("TC-001: 渲染纯图标按钮（无文字）", () => {
      render(<SortDropdown sortBy="newest" onSortChange={mockOnSortChange} variant="icon" />);

      const button = screen.getByTestId("sort-trigger-button");
      expect(button).toBeInTheDocument();
      // 图标按钮不应该包含排序文字
      expect(button.textContent).not.toContain("最新发布");
      expect(button.textContent).not.toContain("最早发布");
    });

    test("TC-002: 按钮尺寸为 36x36px (w-9 h-9)", () => {
      render(<SortDropdown sortBy="newest" onSortChange={mockOnSortChange} variant="icon" />);

      const button = screen.getByTestId("sort-trigger-button");
      expect(button).toHaveClass("w-9");
      expect(button).toHaveClass("h-9");
    });

    test("TC-003: 点击按钮展开下拉面板", () => {
      render(<SortDropdown sortBy="newest" onSortChange={mockOnSortChange} variant="icon" />);

      const button = screen.getByTestId("sort-trigger-button");
      fireEvent.click(button);

      // 下拉面板应该显示
      expect(screen.getByText("最新发布")).toBeInTheDocument();
      expect(screen.getByText("最早发布")).toBeInTheDocument();
    });
  });

  describe("variant='default' 模式", () => {
    test("TC-004: 渲染图标+文字按钮", () => {
      render(<SortDropdown sortBy="newest" onSortChange={mockOnSortChange} variant="default" />);

      const button = screen.getByTestId("sort-trigger-button");
      expect(button).toBeInTheDocument();
      // 应该包含当前排序的文字
      expect(button.textContent).toContain("最新发布");
    });

    test("TC-005: 按钮高度为 40px (h-10)", () => {
      render(<SortDropdown sortBy="newest" onSortChange={mockOnSortChange} variant="default" />);

      const button = screen.getByTestId("sort-trigger-button");
      expect(button).toHaveClass("h-10");
    });

    test("TC-006: 显示当前排序文字", () => {
      render(<SortDropdown sortBy="oldest" onSortChange={mockOnSortChange} variant="default" />);

      const button = screen.getByTestId("sort-trigger-button");
      expect(button.textContent).toContain("最早发布");
    });

    test("TC-007: 点击按钮展开下拉面板", () => {
      render(<SortDropdown sortBy="newest" onSortChange={mockOnSortChange} variant="default" />);

      const button = screen.getByTestId("sort-trigger-button");
      fireEvent.click(button);

      // 下拉面板应该显示（使用 getAllByText 因为按钮和下拉面板都有"最新发布"文字）
      expect(screen.getAllByText("最新发布").length).toBeGreaterThanOrEqual(1);
      expect(screen.getByText("最早发布")).toBeInTheDocument();
    });
  });

  describe("默认行为", () => {
    test("TC-008: 不传入 variant 时默认使用 default 模式", () => {
      render(<SortDropdown sortBy="newest" onSortChange={mockOnSortChange} />);

      // 应该渲染图标+文字按钮
      const button = screen.getByTestId("sort-trigger-button");
      expect(button).toBeInTheDocument();
      expect(button.textContent).toContain("最新发布");
      expect(button).toHaveClass("h-10");
    });
  });

  describe("功能一致性", () => {
    test("TC-009: icon 模式下排序功能正常工作", () => {
      render(<SortDropdown sortBy="newest" onSortChange={mockOnSortChange} variant="icon" />);

      const button = screen.getByTestId("sort-trigger-button");
      fireEvent.click(button);

      // 选择排序选项
      fireEvent.click(screen.getByText("最早发布"));

      expect(mockOnSortChange).toHaveBeenCalledWith("oldest");
    });

    test("TC-010: default 模式下排序功能正常工作", () => {
      render(<SortDropdown sortBy="newest" onSortChange={mockOnSortChange} variant="default" />);

      const button = screen.getByTestId("sort-trigger-button");
      fireEvent.click(button);

      // 选择排序选项
      fireEvent.click(screen.getByText("最早发布"));

      expect(mockOnSortChange).toHaveBeenCalledWith("oldest");
    });

    test("TC-011: 两种模式下切换排序都正常工作", () => {
      const { rerender } = render(
        <SortDropdown sortBy="newest" onSortChange={mockOnSortChange} variant="icon" />
      );

      let button = screen.getByTestId("sort-trigger-button");
      fireEvent.click(button);
      fireEvent.click(screen.getByText("最早发布"));

      expect(mockOnSortChange).toHaveBeenCalledWith("oldest");
      mockOnSortChange.mockClear();

      rerender(<SortDropdown sortBy="oldest" onSortChange={mockOnSortChange} variant="default" />);

      button = screen.getByTestId("sort-trigger-button");
      fireEvent.click(button);
      fireEvent.click(screen.getByText("最新发布"));

      expect(mockOnSortChange).toHaveBeenCalledWith("newest");
    });
  });
});

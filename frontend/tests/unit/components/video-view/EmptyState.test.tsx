import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import EmptyState from "@/components/video-view/EmptyState";
import "@testing-library/jest-dom";

describe("EmptyState组件测试", () => {
  const mockOnClearFilter = jest.fn();

  beforeEach(() => {
    mockOnClearFilter.mockClear();
  });

  describe("TC-001: 渲染图标", () => {
    test("应该渲染Search图标", () => {
      render(<EmptyState onClearFilter={mockOnClearFilter} />);
      const searchIcon = screen.getByTestId("search-icon");
      expect(searchIcon).toBeInTheDocument();
    });

    test("图标应该有正确的大小和颜色样式", () => {
      render(<EmptyState onClearFilter={mockOnClearFilter} />);
      const searchIcon = screen.getByTestId("search-icon");
      expect(searchIcon).toHaveClass("w-16", "h-16", "text-gray-300");
    });
  });

  describe("TC-002: 渲染标题", () => {
    test("应该显示标题文本：未找到相关视频", () => {
      render(<EmptyState onClearFilter={mockOnClearFilter} />);
      const title = screen.getByText("未找到相关视频");
      expect(title).toBeInTheDocument();
    });

    test("标题应该有正确的样式：20px字重600", () => {
      render(<EmptyState onClearFilter={mockOnClearFilter} />);
      const title = screen.getByText("未找到相关视频");
      expect(title).toHaveClass("text-xl", "font-semibold");
    });
  });

  describe("TC-003: 渲染描述文字", () => {
    test("应该显示描述文本：试试调整筛选条件或换个关键词", () => {
      render(<EmptyState onClearFilter={mockOnClearFilter} />);
      const description = screen.getByText("试试调整筛选条件或换个关键词");
      expect(description).toBeInTheDocument();
    });

    test("描述应该有正确的样式：14px灰色", () => {
      render(<EmptyState onClearFilter={mockOnClearFilter} />);
      const description = screen.getByText("试试调整筛选条件或换个关键词");
      expect(description).toHaveClass("text-sm", "text-gray-500");
    });
  });

  describe("TC-004: 渲染清除筛选按钮", () => {
    test("应该显示清除筛选按钮", () => {
      render(<EmptyState onClearFilter={mockOnClearFilter} />);
      const button = screen.getByText("清除筛选");
      expect(button).toBeInTheDocument();
    });

    test("按钮应该有primary样式和8px圆角", () => {
      render(<EmptyState onClearFilter={mockOnClearFilter} />);
      const button = screen.getByText("清除筛选");
      expect(button).toHaveClass("rounded-lg");
    });
  });

  describe("TC-005: 点击按钮触发回调", () => {
    test("点击清除筛选按钮应该触发onClearFilter回调", () => {
      render(<EmptyState onClearFilter={mockOnClearFilter} />);
      const button = screen.getByText("清除筛选");
      fireEvent.click(button);
      expect(mockOnClearFilter).toHaveBeenCalledTimes(1);
    });

    test("多次点击应该触发多次回调", () => {
      render(<EmptyState onClearFilter={mockOnClearFilter} />);
      const button = screen.getByText("清除筛选");
      fireEvent.click(button);
      fireEvent.click(button);
      expect(mockOnClearFilter).toHaveBeenCalledTimes(2);
    });
  });

  describe("TC-006: 可选onClearFilter处理", () => {
    test("不传入onClearFilter时按钮仍然应该渲染", () => {
      render(<EmptyState />);
      const button = screen.getByText("清除筛选");
      expect(button).toBeInTheDocument();
    });

    test("不传入onClearFilter时点击按钮不应该报错", () => {
      render(<EmptyState />);
      const button = screen.getByText("清除筛选");
      expect(() => fireEvent.click(button)).not.toThrow();
    });
  });

  describe("TC-007: className属性支持", () => {
    test("应该支持自定义className", () => {
      const customClass = "custom-empty-state";
      render(<EmptyState onClearFilter={mockOnClearFilter} className={customClass} />);
      const container = screen.getByTestId("empty-state-container");
      expect(container).toHaveClass(customClass);
    });
  });
});

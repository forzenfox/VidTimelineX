import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { SortDropdown } from "@/components/video-view/SortDropdown";
import "@testing-library/jest-dom";

describe("SortDropdown 组件测试", () => {
  const mockOnSortChange = jest.fn();

  beforeEach(() => {
    mockOnSortChange.mockClear();
  });

  describe("默认模式 (variant='default')", () => {
    test("TC-001: 渲染图标+文字按钮", () => {
      render(<SortDropdown sortBy="newest" onSortChange={mockOnSortChange} />);

      const button = screen.getByRole("button");
      expect(button).toBeInTheDocument();
      expect(button).toHaveClass("h-10");
      // 应该包含排序文字
      expect(button.textContent).toContain("最新发布");
    });

    test("TC-002: 按钮显示当前排序文字", () => {
      render(<SortDropdown sortBy="newest" onSortChange={mockOnSortChange} />);

      const button = screen.getByRole("button");
      expect(button.textContent).toContain("最新发布");
    });

    test("TC-003: 点击按钮打开排序菜单", () => {
      render(<SortDropdown sortBy="newest" onSortChange={mockOnSortChange} />);

      const triggerButton = screen.getByRole("button");
      fireEvent.click(triggerButton);

      const menuContent = document.querySelector('[data-state="open"][role="dialog"]');
      expect(menuContent).toHaveTextContent("最新发布");
      expect(menuContent).toHaveTextContent("最早发布");
    });

    test("TC-004: 再次点击按钮关闭排序菜单", () => {
      render(<SortDropdown sortBy="newest" onSortChange={mockOnSortChange} />);

      const triggerButton = screen.getByRole("button");
      fireEvent.click(triggerButton);

      const openMenu = document.querySelector('[data-state="open"][role="dialog"]');
      expect(openMenu).toBeInTheDocument();

      fireEvent.click(triggerButton);

      const closedMenu = document.querySelector('[data-state="closed"][role="dialog"]');
      expect(closedMenu || !document.querySelector('[role="dialog"]')).toBeTruthy();
    });

    test("TC-005: 菜单显示正确的排序选项", () => {
      render(<SortDropdown sortBy="newest" onSortChange={mockOnSortChange} />);

      const triggerButton = screen.getByRole("button");
      fireEvent.click(triggerButton);

      const menuContent = document.querySelector('[data-state="open"][role="dialog"]');
      expect(menuContent).toHaveTextContent("最新发布");
      expect(menuContent).toHaveTextContent("最早发布");
    });

    test("TC-006: 选择排序方式后立即触发 onSortChange", () => {
      render(<SortDropdown sortBy="newest" onSortChange={mockOnSortChange} />);

      const triggerButton = screen.getByRole("button");
      fireEvent.click(triggerButton);

      const oldestOption = screen.getByText("最早发布");
      fireEvent.click(oldestOption);

      expect(mockOnSortChange).toHaveBeenCalledWith("oldest");
    });

    test("TC-007: 当前选中的排序方式有高亮标识", () => {
      render(<SortDropdown sortBy="oldest" onSortChange={mockOnSortChange} />);

      const triggerButton = screen.getByRole("button");
      fireEvent.click(triggerButton);

      const menuContent = document.querySelector('[data-state="open"][role="dialog"]');
      const buttons = menuContent?.querySelectorAll("button");
      const oldestButton = Array.from(buttons || []).find(btn =>
        btn.textContent?.includes("最早发布")
      );
      expect(oldestButton).toHaveClass(/bg-muted\/50/);
    });

    test("TC-008: 按钮显示当前排序选项", () => {
      const { rerender } = render(<SortDropdown sortBy="newest" onSortChange={mockOnSortChange} />);

      let button = screen.getByRole("button");
      expect(button.textContent).toContain("最新发布");

      rerender(<SortDropdown sortBy="oldest" onSortChange={mockOnSortChange} />);

      button = screen.getByRole("button");
      expect(button.textContent).toContain("最早发布");
    });

    test("TC-009: 选择排序后菜单自动关闭", () => {
      render(<SortDropdown sortBy="newest" onSortChange={mockOnSortChange} />);

      const triggerButton = screen.getByRole("button");
      fireEvent.click(triggerButton);

      const menuContent = document.querySelector('[data-state="open"][role="dialog"]');
      const buttons = menuContent?.querySelectorAll("button");
      const oldestButton = Array.from(buttons || []).find(btn =>
        btn.textContent?.includes("最早发布")
      );

      if (oldestButton) {
        fireEvent.click(oldestButton);
      }

      expect(mockOnSortChange).toHaveBeenCalled();
      const closedMenu = document.querySelector('[data-state="closed"][role="dialog"]');
      expect(
        closedMenu || !document.querySelector('[data-state="open"][role="dialog"]')
      ).toBeTruthy();
    });

    test("TC-010: 菜单具有正确的样式类名", () => {
      render(<SortDropdown sortBy="newest" onSortChange={mockOnSortChange} />);

      const triggerButton = screen.getByRole("button");
      fireEvent.click(triggerButton);

      const content = document.querySelector('[data-state="open"][role="dialog"]');
      expect(content).toHaveClass(/w-\[160px\]/);
      expect(content).toHaveClass(/rounded-xl/);
      expect(content).toHaveClass(/shadow-xl/);
      expect(content).toHaveClass(/backdrop-blur-md/);
      expect(content).toHaveClass(/bg-card\/95/);
    });

    test("TC-011: 自定义 className 正确应用", () => {
      render(
        <SortDropdown sortBy="newest" onSortChange={mockOnSortChange} className="custom-class" />
      );

      const triggerButton = screen.getByRole("button");
      expect(triggerButton).toHaveClass("custom-class");
    });

    test("TC-012: 按钮具有正确的主题样式类", () => {
      render(<SortDropdown sortBy="newest" onSortChange={mockOnSortChange} />);

      const button = screen.getByRole("button");
      expect(button).toHaveClass("rounded-lg", "border", "backdrop-blur-md");
      expect(button).toHaveClass("bg-card/60", "border-border", "text-foreground");
      expect(button).toHaveClass("transition-all", "duration-200");
      expect(button).toHaveClass("hover:bg-muted/50");
    });

    test("TC-013: 按钮在打开状态下有高亮样式", () => {
      render(<SortDropdown sortBy="newest" onSortChange={mockOnSortChange} />);

      const triggerButton = screen.getByTestId("sort-trigger-button");
      expect(triggerButton).not.toHaveClass("border-primary/50", "bg-muted/50");

      fireEvent.click(triggerButton);

      // 打开后按钮应该有高亮样式
      const openButton = screen.getByTestId("sort-trigger-button");
      expect(openButton).toHaveClass("border-primary/50", "bg-muted/50");
    });
  });

  describe("图标模式 (variant='icon')", () => {
    test("TC-014: 渲染纯图标按钮", () => {
      render(<SortDropdown sortBy="newest" onSortChange={mockOnSortChange} variant="icon" />);

      const button = screen.getByTestId("sort-trigger-button");
      expect(button).toBeInTheDocument();
      expect(button).toHaveClass("w-9", "h-9");
    });

    test("TC-015: 按钮不显示文字", () => {
      render(<SortDropdown sortBy="newest" onSortChange={mockOnSortChange} variant="icon" />);

      const button = screen.getByTestId("sort-trigger-button");
      expect(button.textContent).not.toContain("排序");
      expect(button.textContent).not.toContain("最新发布");
    });

    test("TC-016: 图标模式下排序功能正常工作", () => {
      render(<SortDropdown sortBy="newest" onSortChange={mockOnSortChange} variant="icon" />);

      const triggerButton = screen.getByTestId("sort-trigger-button");
      fireEvent.click(triggerButton);

      const oldestOption = screen.getByText("最早发布");
      fireEvent.click(oldestOption);

      expect(mockOnSortChange).toHaveBeenCalledWith("oldest");
    });
  });
});

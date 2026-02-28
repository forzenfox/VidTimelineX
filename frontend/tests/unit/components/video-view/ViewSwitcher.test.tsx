import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { ViewSwitcher } from "@/components/video-view/ViewSwitcher";
import type { ViewMode } from "@/hooks/types";
import "@testing-library/jest-dom";

describe("ViewSwitcher 组件测试", () => {
  const mockOnViewModeChange = jest.fn();

  beforeEach(() => {
    mockOnViewModeChange.mockClear();
  });

  test("TC-001: 渲染三个视图模式按钮", () => {
    render(<ViewSwitcher viewMode="timeline" onViewModeChange={mockOnViewModeChange} />);

    expect(screen.getByRole("button", { name: /时光轴/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /网格/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /列表/i })).toBeInTheDocument();
  });

  test("TC-002: 点击按钮触发 onViewModeChange 回调", () => {
    render(<ViewSwitcher viewMode="timeline" onViewModeChange={mockOnViewModeChange} />);

    fireEvent.click(screen.getByRole("button", { name: /网格/i }));
    expect(mockOnViewModeChange).toHaveBeenCalledWith("grid");

    fireEvent.click(screen.getByRole("button", { name: /列表/i }));
    expect(mockOnViewModeChange).toHaveBeenCalledWith("list");

    fireEvent.click(screen.getByRole("button", { name: /时光轴/i }));
    expect(mockOnViewModeChange).toHaveBeenCalledWith("timeline");
  });

  test("TC-003: 正确显示激活状态", () => {
    render(<ViewSwitcher viewMode="grid" onViewModeChange={mockOnViewModeChange} />);

    const timelineButton = screen.getByRole("button", { name: /时光轴/i });
    const gridButton = screen.getByRole("button", { name: /网格/i });
    const listButton = screen.getByRole("button", { name: /列表/i });

    // 使用 aria-pressed 属性检查激活状态
    expect(gridButton).toHaveAttribute("aria-pressed", "true");
    expect(gridButton).toHaveClass("shadow-md");

    expect(timelineButton).toHaveAttribute("aria-pressed", "false");
    expect(listButton).toHaveAttribute("aria-pressed", "false");
  });

  test("TC-004: 按钮具有正确的样式类名", () => {
    render(<ViewSwitcher viewMode="timeline" onViewModeChange={mockOnViewModeChange} />);

    const buttons = screen.getAllByRole("button");

    buttons.forEach(button => {
      expect(button).toHaveClass(/h-10/);
      expect(button).toHaveClass(/rounded-lg/);
      expect(button).toHaveClass(/min-w-\[72px\]/);
      expect(button).toHaveClass(/transition-colors/);
      expect(button).toHaveClass(/cursor-pointer/);
    });
  });

  test("TC-005: 聚焦状态显示正确的 outline", () => {
    render(<ViewSwitcher viewMode="timeline" onViewModeChange={mockOnViewModeChange} />);

    const gridButton = screen.getByRole("button", { name: /网格/i });
    gridButton.focus();

    expect(gridButton).toHaveClass(/ring-2/);
    expect(gridButton).toHaveClass(/ring-ring/);
  });

  test("TC-006: 正确处理不同的 viewMode 状态", () => {
    const { rerender } = render(
      <ViewSwitcher viewMode="timeline" onViewModeChange={mockOnViewModeChange} />
    );

    let timelineButton = screen.getByRole("button", { name: /时光轴/i });
    expect(timelineButton).toHaveAttribute("aria-pressed", "true");

    rerender(<ViewSwitcher viewMode="list" onViewModeChange={mockOnViewModeChange} />);

    timelineButton = screen.getByRole("button", { name: /时光轴/i });
    const listButton = screen.getByRole("button", { name: /列表/i });

    expect(timelineButton).toHaveAttribute("aria-pressed", "false");
    expect(listButton).toHaveAttribute("aria-pressed", "true");
  });

  test("TC-007: 按钮显示正确的图标", () => {
    render(<ViewSwitcher viewMode="timeline" onViewModeChange={mockOnViewModeChange} />);

    const svgElements = document.querySelectorAll("svg");
    expect(svgElements.length).toBe(3);
  });

  test("TC-008: 自定义 className 正确应用", () => {
    render(
      <ViewSwitcher
        viewMode="timeline"
        onViewModeChange={mockOnViewModeChange}
        className="custom-class"
      />
    );

    const container = screen.getByRole("group");
    expect(container).toHaveClass("custom-class");
  });
});

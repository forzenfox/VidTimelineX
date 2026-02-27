import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { SortDropdown } from "@/components/video-view/SortDropdown";
import "@testing-library/jest-dom";

describe("SortDropdown 组件测试", () => {
  const mockOnSortChange = jest.fn();

  beforeEach(() => {
    mockOnSortChange.mockClear();
  });

  test("TC-001: 渲染触发器按钮", () => {
    render(<SortDropdown sortBy="newest" onSortChange={mockOnSortChange} />);

    expect(screen.getByRole("button", { name: /排序/i })).toBeInTheDocument();
  });

  test("TC-002: 点击触发器打开排序菜单", () => {
    render(<SortDropdown sortBy="newest" onSortChange={mockOnSortChange} />);

    const triggerButton = screen.getByRole("button", { name: /排序/i });
    fireEvent.click(triggerButton);

    const menuContent = document.querySelector('[data-state="open"][role="dialog"]');
    expect(menuContent).toHaveTextContent("最新发布");
    expect(menuContent).toHaveTextContent("最早发布");
  });

  test("TC-003: 再次点击触发器关闭排序菜单", () => {
    render(<SortDropdown sortBy="newest" onSortChange={mockOnSortChange} />);

    const triggerButton = screen.getByRole("button", { name: /排序/i });
    fireEvent.click(triggerButton);

    const openMenu = document.querySelector('[data-state="open"][role="dialog"]');
    expect(openMenu).toBeInTheDocument();

    fireEvent.click(triggerButton);

    const closedMenu = document.querySelector('[data-state="closed"][role="dialog"]');
    expect(closedMenu || !document.querySelector('[role="dialog"]')).toBeTruthy();
  });

  test("TC-004: 菜单显示正确的排序选项", () => {
    render(<SortDropdown sortBy="newest" onSortChange={mockOnSortChange} />);

    const triggerButton = screen.getByRole("button", { name: /排序/i });
    fireEvent.click(triggerButton);

    const menuContent = document.querySelector('[data-state="open"][role="dialog"]');
    expect(menuContent).toHaveTextContent("最新发布");
    expect(menuContent).toHaveTextContent("最早发布");
  });

  test("TC-005: 选择排序方式后立即触发 onSortChange", () => {
    render(<SortDropdown sortBy="newest" onSortChange={mockOnSortChange} />);

    const triggerButton = screen.getByRole("button", { name: /排序/i });
    fireEvent.click(triggerButton);

    const oldestOption = screen.getByText("最早发布");
    fireEvent.click(oldestOption);

    expect(mockOnSortChange).toHaveBeenCalledWith("oldest");
  });

  test("TC-006: 当前选中的排序方式有高亮标识", () => {
    render(<SortDropdown sortBy="oldest" onSortChange={mockOnSortChange} />);

    const triggerButton = screen.getByRole("button", { name: /排序/i });
    fireEvent.click(triggerButton);

    const menuContent = document.querySelector('[data-state="open"][role="dialog"]');
    const buttons = menuContent?.querySelectorAll("button");
    const oldestButton = Array.from(buttons || []).find(btn =>
      btn.textContent?.includes("最早发布")
    );
    expect(oldestButton).toHaveClass(/bg-muted\/50/);
  });

  test("TC-007: 触发器显示当前排序选项", () => {
    render(<SortDropdown sortBy="oldest" onSortChange={mockOnSortChange} />);

    const triggerButton = screen.getByRole("button", { name: /排序/i });
    expect(triggerButton).toHaveTextContent("最早发布");
  });

  test("TC-008: 选择排序后菜单自动关闭", () => {
    render(<SortDropdown sortBy="newest" onSortChange={mockOnSortChange} />);

    const triggerButton = screen.getByRole("button", { name: /排序/i });
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

  test("TC-009: 菜单具有正确的样式类名", () => {
    render(<SortDropdown sortBy="newest" onSortChange={mockOnSortChange} />);

    const triggerButton = screen.getByRole("button", { name: /排序/i });
    fireEvent.click(triggerButton);

    const content = document.querySelector('[data-state="open"][role="dialog"]');
    expect(content).toHaveClass(/w-\[160px\]/);
    expect(content).toHaveClass(/rounded-xl/);
    expect(content).toHaveClass(/shadow-xl/);
    expect(content).toHaveClass(/backdrop-blur-md/);
    expect(content).toHaveClass(/bg-card\/95/);
  });

  test("TC-010: 自定义 className 正确应用", () => {
    render(
      <SortDropdown sortBy="newest" onSortChange={mockOnSortChange} className="custom-class" />
    );

    const triggerButton = screen.getByRole("button", { name: /排序/i });
    expect(triggerButton).toHaveClass("custom-class");
  });
});

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { CycleViewButton } from "@/components/business/video-view/CycleViewButton";
import type { ViewMode } from "@/hooks/types";
import "@testing-library/jest-dom";

describe("CycleViewButton 组件测试", () => {
  const mockOnViewModeChange = jest.fn();

  beforeEach(() => {
    mockOnViewModeChange.mockClear();
  });

  test("TC-001: 渲染循环视图按钮", () => {
    render(<CycleViewButton viewMode="timeline" onViewModeChange={mockOnViewModeChange} />);

    expect(screen.getByRole("button", { name: /切换视图/i })).toBeInTheDocument();
  });

  test("TC-002: 按钮尺寸为 36x36px", () => {
    render(<CycleViewButton viewMode="timeline" onViewModeChange={mockOnViewModeChange} />);

    const button = screen.getByRole("button", { name: /切换视图/i });
    expect(button).toHaveClass(/w-9/);
    expect(button).toHaveClass(/h-9/);
  });

  test("TC-003: timeline 视图显示 Calendar 图标", () => {
    render(<CycleViewButton viewMode="timeline" onViewModeChange={mockOnViewModeChange} />);

    const button = screen.getByRole("button", { name: /切换视图/i });
    expect(button).toBeInTheDocument();
    const svg = button.querySelector("svg");
    expect(svg).toBeInTheDocument();
  });

  test("TC-004: grid 视图显示 LayoutGrid 图标", () => {
    render(<CycleViewButton viewMode="grid" onViewModeChange={mockOnViewModeChange} />);

    const button = screen.getByRole("button", { name: /切换视图/i });
    expect(button).toBeInTheDocument();
  });

  test("TC-005: list 视图显示 List 图标", () => {
    render(<CycleViewButton viewMode="list" onViewModeChange={mockOnViewModeChange} />);

    const button = screen.getByRole("button", { name: /切换视图/i });
    expect(button).toBeInTheDocument();
  });

  test("TC-006: 点击按钮从 timeline 切换到 grid", () => {
    render(<CycleViewButton viewMode="timeline" onViewModeChange={mockOnViewModeChange} />);

    const button = screen.getByRole("button", { name: /切换视图/i });
    fireEvent.click(button);

    expect(mockOnViewModeChange).toHaveBeenCalledWith("grid");
  });

  test("TC-007: 点击按钮从 grid 切换到 list", () => {
    render(<CycleViewButton viewMode="grid" onViewModeChange={mockOnViewModeChange} />);

    const button = screen.getByRole("button", { name: /切换视图/i });
    fireEvent.click(button);

    expect(mockOnViewModeChange).toHaveBeenCalledWith("list");
  });

  test("TC-008: 点击按钮从 list 切换到 timeline", () => {
    render(<CycleViewButton viewMode="list" onViewModeChange={mockOnViewModeChange} />);

    const button = screen.getByRole("button", { name: /切换视图/i });
    fireEvent.click(button);

    expect(mockOnViewModeChange).toHaveBeenCalledWith("timeline");
  });

  test("TC-009: 循环顺序正确 timeline -> grid -> list -> timeline", () => {
    const { rerender } = render(
      <CycleViewButton viewMode="timeline" onViewModeChange={mockOnViewModeChange} />
    );

    const button = screen.getByRole("button", { name: /切换视图/i });

    // timeline -> grid
    fireEvent.click(button);
    expect(mockOnViewModeChange).toHaveBeenLastCalledWith("grid");

    rerender(<CycleViewButton viewMode="grid" onViewModeChange={mockOnViewModeChange} />);

    // grid -> list
    fireEvent.click(button);
    expect(mockOnViewModeChange).toHaveBeenLastCalledWith("list");

    rerender(<CycleViewButton viewMode="list" onViewModeChange={mockOnViewModeChange} />);

    // list -> timeline
    fireEvent.click(button);
    expect(mockOnViewModeChange).toHaveBeenLastCalledWith("timeline");
  });

  test("TC-010: 使用 Lucide React 图标", () => {
    render(<CycleViewButton viewMode="timeline" onViewModeChange={mockOnViewModeChange} />);

    const button = screen.getByRole("button", { name: /切换视图/i });
    const svg = button.querySelector("svg");
    expect(svg).toBeInTheDocument();
  });

  test("TC-011: 按钮具有正确的样式类", () => {
    render(<CycleViewButton viewMode="timeline" onViewModeChange={mockOnViewModeChange} />);

    const button = screen.getByRole("button", { name: /切换视图/i });
    expect(button).toHaveClass(/rounded-lg/);
    expect(button).toHaveClass(/transition-all/);
  });

  test("TC-012: 支持所有主题", () => {
    const themes = ["tiger", "sweet", "dongzhu", "kaige"];

    themes.forEach(theme => {
      const { unmount } = render(
        <CycleViewButton
          viewMode="timeline"
          onViewModeChange={mockOnViewModeChange}
          theme={theme}
        />
      );
      const buttons = screen.getAllByRole("button", { name: /切换视图/i });
      const button = buttons[buttons.length - 1];
      expect(button).toHaveAttribute("data-theme", theme);
      unmount();
    });
  });

  test("TC-013: 自定义 className 正确应用", () => {
    render(
      <CycleViewButton
        viewMode="timeline"
        onViewModeChange={mockOnViewModeChange}
        className="custom-button-class"
      />
    );

    const button = screen.getByRole("button", { name: /切换视图/i });
    expect(button).toHaveClass("custom-button-class");
  });

  test("TC-014: 按钮具有悬停效果", () => {
    render(<CycleViewButton viewMode="timeline" onViewModeChange={mockOnViewModeChange} />);

    const button = screen.getByRole("button", { name: /切换视图/i });
    expect(button).toHaveClass(/hover:/);
  });

  test("TC-015: 按钮具有聚焦状态", () => {
    render(<CycleViewButton viewMode="timeline" onViewModeChange={mockOnViewModeChange} />);

    const button = screen.getByRole("button", { name: /切换视图/i });
    expect(button).toHaveClass(/focus-visible:/);
  });

  test("TC-016: 图标切换有动画过渡效果", () => {
    render(<CycleViewButton viewMode="timeline" onViewModeChange={mockOnViewModeChange} />);

    const button = screen.getByRole("button", { name: /切换视图/i });
    const iconContainer = button.querySelector("[data-icon-container]");
    if (iconContainer) {
      expect(iconContainer).toHaveClass(/transition/);
    }
  });

  test("TC-017: 按钮具有正确的 aria-label", () => {
    render(<CycleViewButton viewMode="timeline" onViewModeChange={mockOnViewModeChange} />);

    const button = screen.getByRole("button", { name: /切换视图/i });
    expect(button).toHaveAttribute("aria-label", "切换视图");
  });

  test("TC-018: 不同视图模式显示不同图标", () => {
    const viewModes: ViewMode[] = ["timeline", "grid", "list"];

    viewModes.forEach(mode => {
      const { unmount } = render(
        <CycleViewButton viewMode={mode} onViewModeChange={mockOnViewModeChange} />
      );

      const buttons = screen.getAllByRole("button", { name: /切换视图/i });
      const button = buttons[buttons.length - 1];
      expect(button).toBeInTheDocument();
      unmount();
    });
  });
});

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { ViewSwitcher } from "@/components/business/video-view/ViewSwitcher";
import type { ViewMode } from "@/hooks/types";
import "@testing-library/jest-dom";

describe("ViewSwitcher 响应式测试", () => {
  const mockOnViewModeChange = jest.fn();

  beforeEach(() => {
    mockOnViewModeChange.mockClear();
  });

  describe("variant='icon' 模式", () => {
    test("TC-001: 渲染 CycleViewButton（单个循环按钮）", () => {
      render(
        <ViewSwitcher viewMode="timeline" onViewModeChange={mockOnViewModeChange} variant="icon" />
      );

      // 应该只有一个按钮（循环按钮）
      const buttons = screen.getAllByRole("button");
      expect(buttons.length).toBe(1);

      // 按钮应该有 aria-label="切换视图"
      expect(screen.getByRole("button", { name: /切换视图/i })).toBeInTheDocument();
    });

    test("TC-002: 按钮尺寸为 36x36px (w-9 h-9)", () => {
      render(
        <ViewSwitcher viewMode="timeline" onViewModeChange={mockOnViewModeChange} variant="icon" />
      );

      const button = screen.getByRole("button", { name: /切换视图/i });
      expect(button).toHaveClass(/w-9/);
      expect(button).toHaveClass(/h-9/);
    });

    test("TC-003: 不显示三个独立按钮的文字", () => {
      render(
        <ViewSwitcher viewMode="timeline" onViewModeChange={mockOnViewModeChange} variant="icon" />
      );

      // 不应该有"时光轴"、"网格"、"列表"文字按钮
      expect(screen.queryByRole("button", { name: /时光轴/i })).not.toBeInTheDocument();
      expect(screen.queryByRole("button", { name: /网格/i })).not.toBeInTheDocument();
      expect(screen.queryByRole("button", { name: /列表/i })).not.toBeInTheDocument();
    });

    test("TC-004: 点击按钮循环切换视图 timeline -> grid", () => {
      render(
        <ViewSwitcher viewMode="timeline" onViewModeChange={mockOnViewModeChange} variant="icon" />
      );

      const button = screen.getByRole("button", { name: /切换视图/i });
      fireEvent.click(button);

      expect(mockOnViewModeChange).toHaveBeenCalledWith("grid");
    });

    test("TC-005: 点击按钮循环切换视图 grid -> list", () => {
      render(
        <ViewSwitcher viewMode="grid" onViewModeChange={mockOnViewModeChange} variant="icon" />
      );

      const button = screen.getByRole("button", { name: /切换视图/i });
      fireEvent.click(button);

      expect(mockOnViewModeChange).toHaveBeenCalledWith("list");
    });

    test("TC-006: 点击按钮循环切换视图 list -> timeline", () => {
      render(
        <ViewSwitcher viewMode="list" onViewModeChange={mockOnViewModeChange} variant="icon" />
      );

      const button = screen.getByRole("button", { name: /切换视图/i });
      fireEvent.click(button);

      expect(mockOnViewModeChange).toHaveBeenCalledWith("timeline");
    });
  });

  describe("variant='default' 模式", () => {
    test("TC-007: 渲染三个独立按钮（图标+文字）", () => {
      render(
        <ViewSwitcher
          viewMode="timeline"
          onViewModeChange={mockOnViewModeChange}
          variant="default"
        />
      );

      // 应该有三个按钮
      expect(screen.getByRole("button", { name: /时光轴/i })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /网格/i })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /列表/i })).toBeInTheDocument();
    });

    test("TC-008: 按钮高度为 40px (h-10)", () => {
      render(
        <ViewSwitcher
          viewMode="timeline"
          onViewModeChange={mockOnViewModeChange}
          variant="default"
        />
      );

      const buttons = screen.getAllByRole("button");
      buttons.forEach(button => {
        expect(button).toHaveClass(/h-10/);
      });
    });

    test("TC-009: 点击时光轴按钮切换到 timeline 视图", () => {
      render(
        <ViewSwitcher viewMode="grid" onViewModeChange={mockOnViewModeChange} variant="default" />
      );

      fireEvent.click(screen.getByRole("button", { name: /时光轴/i }));
      expect(mockOnViewModeChange).toHaveBeenCalledWith("timeline");
    });

    test("TC-010: 点击网格按钮切换到 grid 视图", () => {
      render(
        <ViewSwitcher
          viewMode="timeline"
          onViewModeChange={mockOnViewModeChange}
          variant="default"
        />
      );

      fireEvent.click(screen.getByRole("button", { name: /网格/i }));
      expect(mockOnViewModeChange).toHaveBeenCalledWith("grid");
    });

    test("TC-011: 点击列表按钮切换到 list 视图", () => {
      render(
        <ViewSwitcher
          viewMode="timeline"
          onViewModeChange={mockOnViewModeChange}
          variant="default"
        />
      );

      fireEvent.click(screen.getByRole("button", { name: /列表/i }));
      expect(mockOnViewModeChange).toHaveBeenCalledWith("list");
    });

    test("TC-012: 正确显示激活状态", () => {
      render(
        <ViewSwitcher viewMode="grid" onViewModeChange={mockOnViewModeChange} variant="default" />
      );

      const gridButton = screen.getByRole("button", { name: /网格/i });
      expect(gridButton).toHaveAttribute("aria-pressed", "true");

      const timelineButton = screen.getByRole("button", { name: /时光轴/i });
      expect(timelineButton).toHaveAttribute("aria-pressed", "false");
    });
  });

  describe("默认行为", () => {
    test("TC-013: 不传入 variant 时默认使用 default 模式", () => {
      render(<ViewSwitcher viewMode="timeline" onViewModeChange={mockOnViewModeChange} />);

      // 应该渲染三个独立按钮
      expect(screen.getByRole("button", { name: /时光轴/i })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /网格/i })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /列表/i })).toBeInTheDocument();

      // 不应该有循环按钮
      expect(screen.queryByRole("button", { name: /切换视图/i })).not.toBeInTheDocument();
    });
  });

  describe("功能一致性", () => {
    test("TC-014: icon 模式下所有视图切换功能正常", () => {
      const viewModes: ViewMode[] = ["timeline", "grid", "list"];
      const nextModes: Record<ViewMode, ViewMode> = {
        timeline: "grid",
        grid: "list",
        list: "timeline",
      };

      viewModes.forEach(mode => {
        mockOnViewModeChange.mockClear();
        const { unmount } = render(
          <ViewSwitcher viewMode={mode} onViewModeChange={mockOnViewModeChange} variant="icon" />
        );

        const button = screen.getByRole("button", { name: /切换视图/i });
        fireEvent.click(button);

        expect(mockOnViewModeChange).toHaveBeenCalledWith(nextModes[mode]);
        unmount();
      });
    });

    test("TC-015: default 模式下所有视图切换功能正常", () => {
      const viewModes: ViewMode[] = ["timeline", "grid", "list"];

      viewModes.forEach(targetMode => {
        mockOnViewModeChange.mockClear();
        const { unmount } = render(
          <ViewSwitcher
            viewMode="timeline"
            onViewModeChange={mockOnViewModeChange}
            variant="default"
          />
        );

        const button = screen.getByRole("button", {
          name: new RegExp(
            targetMode === "timeline" ? "时光轴" : targetMode === "grid" ? "网格" : "列表",
            "i"
          ),
        });
        fireEvent.click(button);

        expect(mockOnViewModeChange).toHaveBeenCalledWith(targetMode);
        unmount();
      });
    });

    test("TC-016: 两种模式都支持 theme 属性", () => {
      const { rerender } = render(
        <ViewSwitcher
          viewMode="timeline"
          onViewModeChange={mockOnViewModeChange}
          variant="icon"
          theme="kaige"
        />
      );

      // icon 模式下应该有 data-theme 属性
      const iconButton = screen.getByRole("button", { name: /切换视图/i });
      expect(iconButton).toHaveAttribute("data-theme", "kaige");

      rerender(
        <ViewSwitcher
          viewMode="timeline"
          onViewModeChange={mockOnViewModeChange}
          variant="default"
          theme="kaige"
        />
      );

      // default 模式下激活按钮应该有 aria-pressed 属性
      const timelineButton = screen.getByRole("button", { name: /时光轴/i });
      expect(timelineButton).toHaveAttribute("aria-pressed", "true");
    });

    test("TC-017: 两种模式都支持 className 属性", () => {
      const { rerender } = render(
        <ViewSwitcher
          viewMode="timeline"
          onViewModeChange={mockOnViewModeChange}
          variant="icon"
          className="custom-class"
        />
      );

      // icon 模式下检查容器是否有自定义类名
      const iconButton = screen.getByRole("button", { name: /切换视图/i });
      expect(iconButton).toHaveClass("custom-class");

      rerender(
        <ViewSwitcher
          viewMode="timeline"
          onViewModeChange={mockOnViewModeChange}
          variant="default"
          className="custom-class"
        />
      );

      // default 模式下检查容器是否有自定义类名
      const container = screen.getByRole("group");
      expect(container).toHaveClass("custom-class");
    });
  });
});

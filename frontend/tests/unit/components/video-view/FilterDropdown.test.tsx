import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { FilterDropdown } from "@/components/video-view/FilterDropdown";
import type { FilterState } from "@/hooks/types";
import "@testing-library/jest-dom";

// Mock Radix UI Tooltip
jest.mock("@/components/ui/tooltip", () => ({
  Tooltip: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  TooltipTrigger: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  TooltipContent: ({ children, ...props }: { children: React.ReactNode; [key: string]: unknown }) => (
    <div data-testid="filter-tooltip-content" {...props}>
      {children}
    </div>
  ),
}));

describe("FilterDropdown 组件测试", () => {
  const defaultFilter: FilterState = {
    duration: "all",
    timeRange: "all",
    sortBy: "newest",
  };

  const mockOnFilterChange = jest.fn();

  beforeEach(() => {
    mockOnFilterChange.mockClear();
  });

  describe("默认模式 (variant='default')", () => {
    test("TC-001: 渲染图标+文字按钮", () => {
      render(<FilterDropdown filter={defaultFilter} onFilterChange={mockOnFilterChange} />);

      const triggerButton = screen.getByRole("button", { name: /筛选/i });
      expect(triggerButton).toBeInTheDocument();
      expect(triggerButton).toHaveClass("h-10");
    });

    test("TC-002: 按钮显示文字", () => {
      render(<FilterDropdown filter={defaultFilter} onFilterChange={mockOnFilterChange} />);

      const triggerButton = screen.getByRole("button", { name: /筛选/i });
      expect(triggerButton.textContent).toContain("筛选");
    });

    test("TC-003: 按钮显示 Filter 图标", () => {
      render(<FilterDropdown filter={defaultFilter} onFilterChange={mockOnFilterChange} />);

      const filterIcon = screen.getByTestId("filter-icon");
      expect(filterIcon).toBeInTheDocument();
    });
  });

  describe("图标模式 (variant='icon')", () => {
    test("TC-004: 渲染为纯图标按钮（36×36px）", () => {
      render(<FilterDropdown filter={defaultFilter} onFilterChange={mockOnFilterChange} variant="icon" />);

      const triggerButton = screen.getByTestId("filter-trigger-button");
      expect(triggerButton).toBeInTheDocument();
      expect(triggerButton).toHaveClass("w-9");
      expect(triggerButton).toHaveClass("h-9");
    });

    test("TC-005: 图标按钮不显示文字", () => {
      render(<FilterDropdown filter={defaultFilter} onFilterChange={mockOnFilterChange} variant="icon" />);

      const triggerButton = screen.getByTestId("filter-trigger-button");
      expect(triggerButton.textContent).not.toContain("筛选");
    });
  });

  describe("筛选指示点", () => {
    test("TC-006: 无筛选时不显示指示点", () => {
      render(<FilterDropdown filter={defaultFilter} onFilterChange={mockOnFilterChange} />);

      const indicator = screen.queryByTestId("filter-indicator");
      expect(indicator).not.toBeInTheDocument();
    });

    test("TC-007: 有筛选时显示指示点（小红点）", () => {
      const filter: FilterState = {
        duration: "short",
        timeRange: "all",
        sortBy: "newest",
      };

      render(<FilterDropdown filter={filter} onFilterChange={mockOnFilterChange} />);

      const indicator = screen.getByTestId("filter-indicator");
      expect(indicator).toBeInTheDocument();
      expect(indicator).toHaveClass("bg-red-500");
    });

    test("TC-008: 仅时长筛选时显示指示点", () => {
      const filter: FilterState = {
        duration: "medium",
        timeRange: "all",
        sortBy: "newest",
      };

      render(<FilterDropdown filter={filter} onFilterChange={mockOnFilterChange} />);

      const indicator = screen.getByTestId("filter-indicator");
      expect(indicator).toBeInTheDocument();
    });

    test("TC-009: 仅时间范围筛选时显示指示点", () => {
      const filter: FilterState = {
        duration: "all",
        timeRange: "week",
        sortBy: "newest",
      };

      render(<FilterDropdown filter={filter} onFilterChange={mockOnFilterChange} />);

      const indicator = screen.getByTestId("filter-indicator");
      expect(indicator).toBeInTheDocument();
    });

    test("TC-010: 多个筛选条件时显示指示点", () => {
      const filter: FilterState = {
        duration: "long",
        timeRange: "month",
        sortBy: "newest",
      };

      render(<FilterDropdown filter={filter} onFilterChange={mockOnFilterChange} />);

      const indicator = screen.getByTestId("filter-indicator");
      expect(indicator).toBeInTheDocument();
    });
  });

  describe("Tooltip 功能", () => {
    test("TC-011: 无筛选时 tooltip 显示默认文本", () => {
      render(<FilterDropdown filter={defaultFilter} onFilterChange={mockOnFilterChange} />);

      const tooltipContent = screen.getByTestId("filter-tooltip-content");
      expect(tooltipContent).toBeInTheDocument();
      expect(tooltipContent).toHaveTextContent("筛选");
    });

    test("TC-012: 有筛选时 tooltip 显示当前筛选状态", () => {
      const filter: FilterState = {
        duration: "short",
        timeRange: "week",
        sortBy: "newest",
      };

      render(<FilterDropdown filter={filter} onFilterChange={mockOnFilterChange} />);

      const tooltipContent = screen.getByTestId("filter-tooltip-content");
      expect(tooltipContent).toBeInTheDocument();
      expect(tooltipContent).toHaveTextContent("筛选:");
      expect(tooltipContent).toHaveTextContent("0-5分钟");
      expect(tooltipContent).toHaveTextContent("最近一周");
    });

    test("TC-013: 仅时长筛选时 tooltip 显示时长信息", () => {
      const filter: FilterState = {
        duration: "medium",
        timeRange: "all",
        sortBy: "newest",
      };

      render(<FilterDropdown filter={filter} onFilterChange={mockOnFilterChange} />);

      const tooltipContent = screen.getByTestId("filter-tooltip-content");
      expect(tooltipContent).toHaveTextContent("5-30分钟");
    });

    test("TC-014: 仅时间范围筛选时 tooltip 显示时间信息", () => {
      const filter: FilterState = {
        duration: "all",
        timeRange: "year",
        sortBy: "newest",
      };

      render(<FilterDropdown filter={filter} onFilterChange={mockOnFilterChange} />);

      const tooltipContent = screen.getByTestId("filter-tooltip-content");
      expect(tooltipContent).toHaveTextContent("最近一年");
    });
  });

  describe("下拉面板功能", () => {
    test("TC-015: 点击按钮打开筛选面板", () => {
      render(<FilterDropdown filter={defaultFilter} onFilterChange={mockOnFilterChange} />);

      const triggerButton = screen.getByRole("button", { name: /筛选/i });
      fireEvent.click(triggerButton);

      expect(screen.getByText("时长")).toBeInTheDocument();
      expect(screen.getByText("发布时间")).toBeInTheDocument();
    });

    test("TC-016: 再次点击按钮关闭筛选面板", () => {
      render(<FilterDropdown filter={defaultFilter} onFilterChange={mockOnFilterChange} />);

      const triggerButton = screen.getByRole("button", { name: /筛选/i });
      fireEvent.click(triggerButton);
      fireEvent.click(triggerButton);

      expect(screen.queryByText("时长")).not.toBeInTheDocument();
    });

    test("TC-017: 面板显示正确的时长筛选选项", () => {
      render(<FilterDropdown filter={defaultFilter} onFilterChange={mockOnFilterChange} />);

      fireEvent.click(screen.getByRole("button", { name: /筛选/i }));

      const allOptions = screen.getAllByText("全部");
      expect(allOptions.length).toBeGreaterThanOrEqual(1);
      expect(screen.getByText("0-5分钟")).toBeInTheDocument();
      expect(screen.getByText("5-30分钟")).toBeInTheDocument();
      expect(screen.getByText("30分钟以上")).toBeInTheDocument();
    });

    test("TC-018: 面板显示正确的发布时间筛选选项", () => {
      render(<FilterDropdown filter={defaultFilter} onFilterChange={mockOnFilterChange} />);

      fireEvent.click(screen.getByRole("button", { name: /筛选/i }));

      expect(screen.getByText("最近一周")).toBeInTheDocument();
      expect(screen.getByText("最近一月")).toBeInTheDocument();
      expect(screen.getByText("最近一年")).toBeInTheDocument();
    });

    test("TC-019: 点击应用按钮调用 onFilterChange 并关闭面板", () => {
      render(<FilterDropdown filter={defaultFilter} onFilterChange={mockOnFilterChange} />);

      const triggerButton = screen.getByRole("button", { name: /筛选/i });
      fireEvent.click(triggerButton);

      const applyButton = screen.getByRole("button", { name: /应用/i });
      fireEvent.click(applyButton);

      expect(mockOnFilterChange).toHaveBeenCalled();
      expect(screen.queryByText("时长")).not.toBeInTheDocument();
    });

    test("TC-020: 点击重置按钮恢复默认筛选条件", () => {
      const filter: FilterState = {
        duration: "short",
        timeRange: "month",
        sortBy: "newest",
      };

      render(<FilterDropdown filter={filter} onFilterChange={mockOnFilterChange} />);

      const triggerButton = screen.getByRole("button", { name: /筛选/i });
      fireEvent.click(triggerButton);

      const resetButton = screen.getByRole("button", { name: /重置/i });
      fireEvent.click(resetButton);

      expect(mockOnFilterChange).toHaveBeenCalledWith(defaultFilter);
      expect(screen.queryByText("时长")).not.toBeInTheDocument();
    });

    test("TC-021: 选择时长选项后本地状态更新", () => {
      render(<FilterDropdown filter={defaultFilter} onFilterChange={mockOnFilterChange} />);

      const triggerButton = screen.getByRole("button", { name: /筛选/i });
      fireEvent.click(triggerButton);

      const shortOption = screen.getByText("0-5分钟");
      fireEvent.click(shortOption);

      expect(screen.getAllByText("0-5分钟").length).toBeGreaterThanOrEqual(1);
    });
  });

  describe("样式和主题支持", () => {
    test("TC-022: 自定义 className 正确应用", () => {
      render(
        <FilterDropdown
          filter={defaultFilter}
          onFilterChange={mockOnFilterChange}
          className="custom-class"
        />
      );

      const triggerButton = screen.getByRole("button", { name: /筛选/i });
      expect(triggerButton).toHaveClass("custom-class");
    });

    test("TC-023: 按钮使用主题样式", () => {
      render(<FilterDropdown filter={defaultFilter} onFilterChange={mockOnFilterChange} />);

      const triggerButton = screen.getByRole("button", { name: /筛选/i });
      expect(triggerButton).toHaveClass("bg-card/60");
      expect(triggerButton).toHaveClass("border-border");
      expect(triggerButton).toHaveClass("text-foreground");
    });

    test("TC-024: 面板具有正确的样式类名", () => {
      render(<FilterDropdown filter={defaultFilter} onFilterChange={mockOnFilterChange} />);

      const triggerButton = screen.getByRole("button", { name: /筛选/i });
      fireEvent.click(triggerButton);

      const content = document.querySelector('[data-state="open"][role="dialog"]');
      expect(content).toHaveClass(/w-\[280px\]/);
      expect(content).toHaveClass(/rounded-xl/);
      expect(content).toHaveClass(/shadow-xl/);
      expect(content).toHaveClass(/backdrop-blur-md/);
      expect(content).toHaveClass(/bg-card\/95/);
    });

    test("TC-025: 面板具有最大高度并可滚动", () => {
      render(<FilterDropdown filter={defaultFilter} onFilterChange={mockOnFilterChange} />);

      const triggerButton = screen.getByRole("button", { name: /筛选/i });
      fireEvent.click(triggerButton);

      const content = document.querySelector('[data-state="open"][role="dialog"]');
      expect(content).toHaveClass(/max-h-\[400px\]/);
      expect(content).toHaveClass(/overflow-y-auto/);
    });
  });
});

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { FilterDropdown } from "@/components/video-view/FilterDropdown";
import type { FilterState } from "@/hooks/types";
import "@testing-library/jest-dom";

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

  test("TC-001: 渲染触发器按钮", () => {
    render(<FilterDropdown filter={defaultFilter} onFilterChange={mockOnFilterChange} />);

    expect(screen.getByRole("button", { name: /筛选/i })).toBeInTheDocument();
  });

  test("TC-002: 点击触发器打开筛选面板", () => {
    render(<FilterDropdown filter={defaultFilter} onFilterChange={mockOnFilterChange} />);

    const triggerButton = screen.getByRole("button", { name: /筛选/i });
    fireEvent.click(triggerButton);

    expect(screen.getByText("时长")).toBeInTheDocument();
    expect(screen.getByText("发布时间")).toBeInTheDocument();
  });

  test("TC-003: 再次点击触发器关闭筛选面板", () => {
    render(<FilterDropdown filter={defaultFilter} onFilterChange={mockOnFilterChange} />);

    const triggerButton = screen.getByRole("button", { name: /筛选/i });
    fireEvent.click(triggerButton);
    fireEvent.click(triggerButton);

    expect(screen.queryByText("时长")).not.toBeInTheDocument();
  });

  test("TC-004: 面板显示正确的时长筛选选项", () => {
    render(<FilterDropdown filter={defaultFilter} onFilterChange={mockOnFilterChange} />);

    fireEvent.click(screen.getByRole("button", { name: /筛选/i }));

    const allOptions = screen.getAllByText("全部");
    expect(allOptions.length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("0-5分钟")).toBeInTheDocument();
    expect(screen.getByText("5-30分钟")).toBeInTheDocument();
    expect(screen.getByText("30分钟以上")).toBeInTheDocument();
  });

  test("TC-005: 面板显示正确的发布时间筛选选项", () => {
    render(<FilterDropdown filter={defaultFilter} onFilterChange={mockOnFilterChange} />);

    fireEvent.click(screen.getByRole("button", { name: /筛选/i }));

    expect(screen.getByText("最近一周")).toBeInTheDocument();
    expect(screen.getByText("最近一月")).toBeInTheDocument();
    expect(screen.getByText("最近一年")).toBeInTheDocument();
  });

  test("TC-006: 选择筛选条件后触发器显示筛选状态", () => {
    const filter: FilterState = {
      duration: "short",
      timeRange: "week",
      sortBy: "newest",
    };

    render(<FilterDropdown filter={filter} onFilterChange={mockOnFilterChange} />);

    const triggerButton = screen.getByRole("button", { name: /筛选/i });
    expect(triggerButton).toHaveTextContent("0-5分钟");
    expect(triggerButton).toHaveTextContent("最近一周");
  });

  test("TC-007: 点击应用按钮调用 onFilterChange 并关闭面板", () => {
    const filter: FilterState = {
      duration: "all",
      timeRange: "all",
      sortBy: "newest",
    };

    render(<FilterDropdown filter={filter} onFilterChange={mockOnFilterChange} />);

    const triggerButton = screen.getByRole("button", { name: /筛选/i });
    fireEvent.click(triggerButton);

    const applyButton = screen.getByRole("button", { name: /应用/i });
    fireEvent.click(applyButton);

    expect(mockOnFilterChange).toHaveBeenCalled();
    expect(screen.queryByText("时长")).not.toBeInTheDocument();
  });

  test("TC-008: 点击重置按钮恢复默认筛选条件", () => {
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

  test("TC-009: 面板具有正确的样式类名", () => {
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

  test("TC-010: 面板具有最大高度并可滚动", () => {
    render(<FilterDropdown filter={defaultFilter} onFilterChange={mockOnFilterChange} />);

    const triggerButton = screen.getByRole("button", { name: /筛选/i });
    fireEvent.click(triggerButton);

    const content = document.querySelector('[data-state="open"][role="dialog"]');
    expect(content).toHaveClass(/max-h-\[400px\]/);
    expect(content).toHaveClass(/overflow-y-auto/);
  });

  test("TC-011: 选择时长选项后本地状态更新", () => {
    const filter: FilterState = {
      duration: "all",
      timeRange: "all",
      sortBy: "newest",
    };

    render(<FilterDropdown filter={filter} onFilterChange={mockOnFilterChange} />);

    const triggerButton = screen.getByRole("button", { name: /筛选/i });
    fireEvent.click(triggerButton);

    const shortOption = screen.getByText("0-5分钟");
    fireEvent.click(shortOption);

    expect(screen.getAllByText("0-5分钟").length).toBeGreaterThanOrEqual(1);
  });

  test("TC-012: 自定义 className 正确应用", () => {
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
});

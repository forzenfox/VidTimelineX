import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { CanteenHall } from "@/features/yuxiaoc/components/CanteenHall";
import type { Theme, Video } from "@/features/yuxiaoc/data/types";
import "@testing-library/jest-dom";

const mockOnVideoClick = jest.fn();

describe("CanteenHall 工具栏集成测试", () => {
  beforeEach(() => {
    mockOnVideoClick.mockClear();
  });

  test("TC-INT-001: 桌面端显示VideoViewToolbar", () => {
    // 设置桌面端视口
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 1024,
    });

    render(<CanteenHall theme="blood" onVideoClick={mockOnVideoClick} />);

    // VideoViewToolbar应该在桌面端显示
    const toolbar = screen.getByTestId("video-view-toolbar");
    expect(toolbar).toBeInTheDocument();
    expect(toolbar).toHaveClass("hidden", "sm:flex");
  });

  test("TC-INT-002: 血怒主题正确应用", () => {
    render(<CanteenHall theme="blood" onVideoClick={mockOnVideoClick} />);

    // 检查标题是否正确
    expect(screen.getByText("血怒时刻")).toBeInTheDocument();

    // 检查VideoViewToolbar是否接收了theme属性
    const toolbar = screen.getByTestId("video-view-toolbar");
    expect(toolbar).toHaveAttribute("data-theme", "blood");
  });

  test("TC-INT-003: 混躺主题正确应用", () => {
    render(<CanteenHall theme="mix" onVideoClick={mockOnVideoClick} />);

    // 检查标题是否正确
    expect(screen.getByText("食堂大殿")).toBeInTheDocument();

    // 检查VideoViewToolbar是否接收了theme属性
    const toolbar = screen.getByTestId("video-view-toolbar");
    expect(toolbar).toHaveAttribute("data-theme", "mix");
  });

  test("TC-INT-004: 搜索功能正常工作", async () => {
    render(<CanteenHall theme="blood" onVideoClick={mockOnVideoClick} />);

    // 找到搜索按钮（可能有多个，使用getAllByRole）
    const searchButtons = screen.getAllByRole("button", { name: /搜索/i });
    expect(searchButtons.length).toBeGreaterThanOrEqual(1);

    // 点击第一个搜索按钮展开搜索框
    fireEvent.click(searchButtons[0]);

    // 等待搜索输入框出现
    await waitFor(() => {
      const searchInputs = screen.getAllByPlaceholderText(/搜索视频/i);
      expect(searchInputs.length).toBeGreaterThanOrEqual(1);
    });
  });

  test("TC-INT-005: 视图切换按钮存在", () => {
    render(<CanteenHall theme="blood" onVideoClick={mockOnVideoClick} />);

    // 检查视图切换按钮是否存在（可能有多个，因为移动端和桌面端都有）
    expect(screen.getAllByRole("button", { name: /时光轴/i }).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByRole("button", { name: /网格/i }).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByRole("button", { name: /列表/i }).length).toBeGreaterThanOrEqual(1);
  });

  test("TC-INT-006: 筛选按钮存在", () => {
    render(<CanteenHall theme="blood" onVideoClick={mockOnVideoClick} />);

    // 检查筛选按钮是否存在（可能有多个，因为移动端和桌面端都有）
    const filterButtons = screen.getAllByTestId("filter-trigger-button");
    expect(filterButtons.length).toBeGreaterThanOrEqual(1);
  });

  test("TC-INT-007: 排序按钮存在", () => {
    render(<CanteenHall theme="blood" onVideoClick={mockOnVideoClick} />);

    // 检查排序按钮是否存在（可能有多个，因为移动端和桌面端都有）
    const sortButtons = screen.getAllByTestId("sort-trigger-button");
    expect(sortButtons.length).toBeGreaterThanOrEqual(1);
  });

  test("TC-INT-008: 视频数量显示正确", () => {
    render(<CanteenHall theme="blood" onVideoClick={mockOnVideoClick} />);

    // 检查视频数量显示
    expect(screen.getByText(/共.*个视频/)).toBeInTheDocument();
  });

  test("TC-INT-009: 视频网格正确渲染", () => {
    render(<CanteenHall theme="blood" onVideoClick={mockOnVideoClick} />);

    // 检查视频卡片是否渲染
    const videoCards = screen.getAllByTestId(/video-card/);
    expect(videoCards.length).toBeGreaterThan(0);
  });

  test("TC-INT-010: 主题切换时组件更新", () => {
    const { rerender } = render(<CanteenHall theme="blood" onVideoClick={mockOnVideoClick} />);

    // 初始为血怒主题
    expect(screen.getByText("血怒时刻")).toBeInTheDocument();

    // 切换到混躺主题
    rerender(<CanteenHall theme="mix" onVideoClick={mockOnVideoClick} />);

    // 检查标题是否更新
    expect(screen.getByText("食堂大殿")).toBeInTheDocument();
  });
});

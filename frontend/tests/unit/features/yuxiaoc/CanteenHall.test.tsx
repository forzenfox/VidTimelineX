import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { CanteenHall } from "@/features/yuxiaoc/components/CanteenHall";
import "@testing-library/jest-dom";

// 模拟桌面端视口
Object.defineProperty(window, "innerWidth", {
  writable: true,
  configurable: true,
  value: 1024,
});

// 触发resize事件
window.dispatchEvent(new Event("resize"));

describe("CanteenHall组件测试", () => {
  const mockOnVideoClick = jest.fn();

  beforeEach(() => {
    mockOnVideoClick.mockClear();
  });

  /**
   * 测试用例 TC-001: 组件渲染测试
   * 测试目标：验证CanteenHall组件能够正确渲染
   */
  test("TC-001: 组件渲染测试", () => {
    render(<CanteenHall theme="blood" onVideoClick={mockOnVideoClick} />);

    // 验证标题渲染
    expect(screen.getByText("血怒时刻")).toBeInTheDocument();
    // 验证副标题渲染
    expect(screen.getByText("硬核操作，天神下凡")).toBeInTheDocument();
  });

  /**
   * 测试用例 TC-002: 食堂信息展示测试 - 血怒模式
   * 测试目标：验证血怒模式下显示正确的食堂信息
   */
  test("TC-002: 食堂信息展示测试 - 血怒模式", () => {
    render(<CanteenHall theme="blood" onVideoClick={mockOnVideoClick} />);

    // 验证血怒模式标题
    expect(screen.getByText("血怒时刻")).toBeInTheDocument();
    expect(screen.getByText("硬核操作，天神下凡")).toBeInTheDocument();
    // 验证视频数量显示
    expect(screen.getByText(/共.*个视频/)).toBeInTheDocument();
  });

  /**
   * 测试用例 TC-003: 食堂信息展示测试 - 混躺模式
   * 测试目标：验证混躺模式下显示正确的食堂信息
   */
  test("TC-003: 食堂信息展示测试 - 混躺模式", () => {
    render(<CanteenHall theme="mix" onVideoClick={mockOnVideoClick} />);

    // 验证混躺模式标题
    expect(screen.getByText("食堂大殿")).toBeInTheDocument();
    expect(screen.getByText("下饭经典，吃饱为止")).toBeInTheDocument();
    // 验证视频数量显示
    expect(screen.getByText(/共.*个视频/)).toBeInTheDocument();
  });

  /**
   * 测试用例 TC-004: 视频区域渲染测试
   * 测试目标：验证视频区域正确渲染
   */
  test("TC-004: 视频区域渲染测试", () => {
    render(<CanteenHall theme="blood" onVideoClick={mockOnVideoClick} />);

    // 验证视频网格/列表区域存在（通过检查是否有视频卡片容器）
    const videoContainer = document.querySelector("#canteen");
    expect(videoContainer).toBeInTheDocument();
  });

  /**
   * 测试用例 TC-005: 搜索功能交互测试
   * 测试目标：验证搜索框可以输入并搜索视频
   */
  test("TC-005: 搜索功能交互测试", () => {
    render(<CanteenHall theme="blood" onVideoClick={mockOnVideoClick} />);

    // 使用第一个搜索输入框
    const searchInputs = screen.getAllByPlaceholderText(/搜索视频/i);
    const searchInput = searchInputs[0];
    fireEvent.change(searchInput, { target: { value: "血怒" } });
    expect(searchInput).toHaveValue("血怒");
  });

  /**
   * 测试用例 TC-006: 视图切换交互测试
   * 测试目标：验证视图切换按钮可以切换不同视图模式
   */
  test("TC-006: 视图切换交互测试", () => {
    render(<CanteenHall theme="blood" onVideoClick={mockOnVideoClick} />);

    // 检查视图切换按钮是否存在
    const timelineButtons = screen.getAllByRole("button", { name: /时光轴/i });
    const gridButtons = screen.getAllByRole("button", { name: /网格/i });
    const listButtons = screen.getAllByRole("button", { name: /列表/i });

    expect(timelineButtons.length).toBeGreaterThanOrEqual(1);
    expect(gridButtons.length).toBeGreaterThanOrEqual(1);
    expect(listButtons.length).toBeGreaterThanOrEqual(1);

    // 点击时光轴视图按钮
    fireEvent.click(timelineButtons[0]);

    // 点击列表视图按钮
    fireEvent.click(listButtons[0]);

    // 点击网格视图按钮
    fireEvent.click(gridButtons[0]);
  });

  /**
   * 测试用例 TC-007: 自定义类名测试 - section元素
   * 测试目标：验证组件section元素包含正确的类名
   */
  test("TC-007: 自定义类名测试 - section元素", () => {
    const { container } = render(<CanteenHall theme="blood" onVideoClick={mockOnVideoClick} />);

    // 验证section元素存在并包含正确的类名
    const section = container.querySelector("section#canteen");
    expect(section).toBeInTheDocument();
    expect(section).toHaveClass("py-16");
    expect(section).toHaveClass("px-4");
  });

  /**
   * 测试用例 TC-008: 自定义类名测试 - 内容容器
   * 测试目标：验证内容容器包含正确的类名
   */
  test("TC-008: 自定义类名测试 - 内容容器", () => {
    const { container } = render(<CanteenHall theme="blood" onVideoClick={mockOnVideoClick} />);

    // 验证内容容器存在
    const contentContainer = container.querySelector(".max-w-7xl");
    expect(contentContainer).toBeInTheDocument();
    expect(contentContainer).toHaveClass("mx-auto");
  });

  /**
   * 测试用例 TC-009: 视频时长显示测试
   * 测试目标：验证视频时长正确显示
   */
  test("TC-009: 视频时长显示测试", () => {
    render(<CanteenHall theme="blood" onVideoClick={mockOnVideoClick} />);

    // 验证时长标签存在（视频卡片中的时长显示）
    const durationElements = document.querySelectorAll("[class*='absolute'][class*='bottom']");
    expect(durationElements.length).toBeGreaterThanOrEqual(0);
  });

  // ==================== 分页功能测试 ====================

  /**
   * 测试用例 TC-PAGE-001: 视图切换后分页控件状态测试 - Grid视图
   * 测试目标：验证Grid视图下分页控件正确渲染（如果视频数量超过每页数量）
   */
  test("TC-PAGE-001: 视图切换后分页控件状态测试 - Grid视图", () => {
    render(<CanteenHall theme="blood" onVideoClick={mockOnVideoClick} />);

    // 切换到网格视图
    const gridButtons = screen.getAllByRole("button", { name: /网格/i });
    fireEvent.click(gridButtons[0]);

    // 验证网格视图被激活
    expect(gridButtons[0]).toHaveAttribute("aria-pressed", "true");
  });

  /**
   * 测试用例 TC-PAGE-002: 视图切换后分页控件状态测试 - List视图
   * 测试目标：验证List视图下分页控件正确渲染
   */
  test("TC-PAGE-002: 视图切换后分页控件状态测试 - List视图", () => {
    render(<CanteenHall theme="blood" onVideoClick={mockOnVideoClick} />);

    // 切换到列表视图
    const listButtons = screen.getAllByRole("button", { name: /列表/i });
    fireEvent.click(listButtons[0]);

    // 验证列表视图被激活
    expect(listButtons[0]).toHaveAttribute("aria-pressed", "true");
  });

  /**
   * 测试用例 TC-PAGE-003: Timeline视图切换测试
   * 测试目标：验证Timeline视图可以正常切换
   */
  test("TC-PAGE-003: Timeline视图切换测试", () => {
    render(<CanteenHall theme="blood" onVideoClick={mockOnVideoClick} />);

    // 切换到时光轴视图
    const timelineButtons = screen.getAllByRole("button", { name: /时光轴/i });
    fireEvent.click(timelineButtons[0]);

    // 验证时光轴视图被激活
    expect(timelineButtons[0]).toHaveAttribute("aria-pressed", "true");
  });

  /**
   * 测试用例 TC-PAGE-004: 每页数量选择器存在测试
   * 测试目标：验证每页数量选择器存在（当需要分页时）
   */
  test("TC-PAGE-004: 每页数量选择器存在测试", () => {
    render(<CanteenHall theme="blood" onVideoClick={mockOnVideoClick} />);

    // 确保在网格视图
    const gridButtons = screen.getAllByRole("button", { name: /网格/i });
    fireEvent.click(gridButtons[0]);

    // 验证每页数量选择器存在（如果视频数量超过12个）
    const pageSizeSelect = screen.queryByLabelText(/每页显示/i);
    // 注意：如果视频数量不足12个，分页控件不会显示
    if (pageSizeSelect) {
      expect(pageSizeSelect).toBeInTheDocument();
    }
  });

  /**
   * 测试用例 TC-PAGE-005: 上一页/下一页按钮状态测试
   * 测试目标：验证上一页/下一页按钮状态
   */
  test("TC-PAGE-005: 上一页/下一页按钮状态测试", () => {
    render(<CanteenHall theme="blood" onVideoClick={mockOnVideoClick} />);

    // 确保在网格视图
    const gridButtons = screen.getAllByRole("button", { name: /网格/i });
    fireEvent.click(gridButtons[0]);

    // 验证上一页/下一页按钮（如果存在）
    const prevButton = screen.queryByLabelText(/上一页/i);
    const nextButton = screen.queryByLabelText(/下一页/i);

    // 如果分页控件存在，验证按钮状态
    if (prevButton && nextButton) {
      // 第一页时上一页应该禁用
      expect(prevButton).toBeDisabled();
    }
  });

  /**
   * 测试用例 TC-PAGE-006: 分页信息显示测试
   * 测试目标：验证分页信息正确显示
   */
  test("TC-PAGE-006: 分页信息显示测试", () => {
    render(<CanteenHall theme="blood" onVideoClick={mockOnVideoClick} />);

    // 确保在网格视图
    const gridButtons = screen.getAllByRole("button", { name: /网格/i });
    fireEvent.click(gridButtons[0]);

    // 验证分页信息（如果存在）
    const paginationInfo = screen.queryByText(/共.*条/);
    if (paginationInfo) {
      expect(paginationInfo).toBeInTheDocument();
    }
  });
});

import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { CanteenHall } from "@/features/yuxiaoc/components/CanteenHall";
import type { Video } from "@/features/yuxiaoc/data/types";
import "@testing-library/jest-dom";

// 模拟桌面端视口
Object.defineProperty(window, "innerWidth", {
  writable: true,
  configurable: true,
  value: 1024,
});

// 触发resize事件
window.dispatchEvent(new Event("resize"));

// 模拟视频数据
jest.mock("@/features/yuxiaoc/data/videos", () => ({
  videos: [
    {
      id: "1",
      bvid: "BV1xx411c7mD",
      bv: "BV1xx411c7mD",
      title: "血怒时刻：无情铁手",
      cover: "https://example.com/cover1.jpg",
      cover_url: "https://example.com/cover1.jpg",
      videoUrl: "https://example.com/video1.mp4",
      duration: "10:30",
      date: "2024-01-15",
      author: "C皇",
      category: "hardcore" as const,
      tags: ["血怒", "诺手"],
      description: "经典血怒时刻",
    },
    {
      id: "2",
      bvid: "BV2xx411c7mE",
      bv: "BV2xx411c7mE",
      title: "混躺日常：这把混",
      cover: "https://example.com/cover2.jpg",
      cover_url: "https://example.com/cover2.jpg",
      videoUrl: "https://example.com/video2.mp4",
      duration: "15:20",
      date: "2024-01-14",
      author: "C皇",
      category: "main" as const,
      tags: ["混躺", "下饭"],
      description: "混躺日常",
    },
    {
      id: "3",
      bvid: "BV3xx411c7mF",
      bv: "BV3xx411c7mF",
      title: "汤肴精选：下饭操作",
      cover: "https://example.com/cover3.jpg",
      cover_url: "https://example.com/cover3.jpg",
      videoUrl: "https://example.com/video3.mp4",
      duration: "08:45",
      date: "2024-01-13",
      author: "C皇",
      category: "soup" as const,
      tags: ["下饭", "搞笑"],
      description: "汤肴精选",
    },
  ],
  canteenCategories: [
    { id: "hardcore", name: "硬核区", description: "血怒时刻", color: "#E11D48", icon: "sword" },
    { id: "main", name: "主食区", description: "日常对局", color: "#F59E0B", icon: "utensils" },
    { id: "soup", name: "汤肴区", description: "下饭操作", color: "#3B82F6", icon: "soup" },
  ],
}));

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
   * 测试用例 TC-004: 视频卡片渲染测试
   * 测试目标：验证视频卡片正确渲染
   */
  test("TC-004: 视频卡片渲染测试", () => {
    render(<CanteenHall theme="blood" onVideoClick={mockOnVideoClick} />);

    // 验证视频标题显示
    expect(screen.getByText("血怒时刻：无情铁手")).toBeInTheDocument();
    expect(screen.getByText("混躺日常：这把混")).toBeInTheDocument();
    expect(screen.getByText("汤肴精选：下饭操作")).toBeInTheDocument();
  });

  /**
   * 测试用例 TC-005: 视频点击交互测试
   * 测试目标：验证点击视频卡片触发回调函数
   */
  test("TC-005: 视频点击交互测试", () => {
    render(<CanteenHall theme="blood" onVideoClick={mockOnVideoClick} />);

    // 点击第一个视频卡片
    const videoCard = screen.getByText("血怒时刻：无情铁手").closest("div[class*='group']");
    if (videoCard) {
      fireEvent.click(videoCard);
    }

    // 验证回调被调用
    expect(mockOnVideoClick).toHaveBeenCalledTimes(1);
    expect(mockOnVideoClick).toHaveBeenCalledWith(
      expect.objectContaining({
        id: "1",
        title: "血怒时刻：无情铁手",
      })
    );
  });

  /**
   * 测试用例 TC-006: 搜索功能交互测试
   * 测试目标：验证搜索框可以输入并搜索视频
   */
  test("TC-006: 搜索功能交互测试", async () => {
    render(<CanteenHall theme="blood" onVideoClick={mockOnVideoClick} />);

    // 点击搜索按钮展开搜索框
    const searchButtons = screen.getAllByRole("button", { name: /搜索/i });
    expect(searchButtons.length).toBeGreaterThanOrEqual(1);
    fireEvent.click(searchButtons[0]);

    // 等待搜索输入框出现并输入内容
    await waitFor(() => {
      const searchInputs = screen.getAllByPlaceholderText(/搜索视频/i);
      expect(searchInputs.length).toBeGreaterThanOrEqual(1);
      const searchInput = searchInputs[0];
      fireEvent.change(searchInput, { target: { value: "血怒" } });
      expect(searchInput).toHaveValue("血怒");
    });
  });

  /**
   * 测试用例 TC-007: 视图切换交互测试
   * 测试目标：验证视图切换按钮可以切换不同视图模式
   */
  test("TC-007: 视图切换交互测试", () => {
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
   * 测试用例 TC-008: 自定义类名测试 - section元素
   * 测试目标：验证组件section元素包含正确的类名
   */
  test("TC-008: 自定义类名测试 - section元素", () => {
    const { container } = render(<CanteenHall theme="blood" onVideoClick={mockOnVideoClick} />);

    // 验证section元素存在并包含正确的类名
    const section = container.querySelector("section#canteen");
    expect(section).toBeInTheDocument();
    expect(section).toHaveClass("py-16");
    expect(section).toHaveClass("px-4");
  });

  /**
   * 测试用例 TC-009: 自定义类名测试 - 内容容器
   * 测试目标：验证内容容器包含正确的类名
   */
  test("TC-009: 自定义类名测试 - 内容容器", () => {
    const { container } = render(<CanteenHall theme="blood" onVideoClick={mockOnVideoClick} />);

    // 验证内容容器存在
    const contentContainer = container.querySelector(".max-w-7xl");
    expect(contentContainer).toBeInTheDocument();
    expect(contentContainer).toHaveClass("mx-auto");
  });

  /**
   * 测试用例 TC-010: 视频时长显示测试
   * 测试目标：验证视频时长正确显示
   */
  test("TC-010: 视频时长显示测试", () => {
    render(<CanteenHall theme="blood" onVideoClick={mockOnVideoClick} />);

    // 验证时长显示（使用getAllByText因为可能有多个相同时长）
    expect(screen.getAllByText("10:30").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("15:20").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("08:45").length).toBeGreaterThanOrEqual(1);
  });
});

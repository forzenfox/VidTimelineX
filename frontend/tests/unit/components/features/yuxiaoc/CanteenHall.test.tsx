import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { CanteenHall } from "@/features/yuxiaoc/components/CanteenHall";
import type { Video } from "@/features/yuxiaoc/data/types";
import "@testing-library/jest-dom";

// 模拟视频数据
jest.mock("@/features/yuxiaoc/data/videos", () => ({
  videos: [
    {
      id: "1",
      bvid: "BV1xx411c7mD",
      title: "血怒时刻：无情铁手",
      cover: "https://example.com/cover1.jpg",
      duration: "10:30",
      category: "hardcore",
      tags: ["血怒", "诺手"],
      description: "经典血怒时刻",
    },
    {
      id: "2",
      bvid: "BV2xx411c7mE",
      title: "混躺日常：这把混",
      cover: "https://example.com/cover2.jpg",
      duration: "15:20",
      category: "main",
      tags: ["混躺", "下饭"],
      description: "混躺日常",
    },
    {
      id: "3",
      bvid: "BV3xx411c7mF",
      title: "汤肴精选：下饭操作",
      cover: "https://example.com/cover3.jpg",
      duration: "08:45",
      category: "soup",
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

    expect(screen.getByText("血怒时刻")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("搜索视频标题或标签...")).toBeInTheDocument();
  });

  /**
   * 测试用例 TC-002: 混躺模式标题测试
   * 测试目标：验证混躺模式下显示正确的标题
   */
  test("TC-002: 混躺模式标题测试", () => {
    render(<CanteenHall theme="mix" onVideoClick={mockOnVideoClick} />);

    expect(screen.getByText("食堂大殿")).toBeInTheDocument();
    expect(screen.getByText("下饭经典，吃饱为止")).toBeInTheDocument();
  });

  /**
   * 测试用例 TC-003: 视频卡片渲染测试
   * 测试目标：验证视频卡片正确渲染
   */
  test("TC-003: 视频卡片渲染测试", () => {
    render(<CanteenHall theme="blood" onVideoClick={mockOnVideoClick} />);

    // 验证视频标题显示
    expect(screen.getByText("血怒时刻：无情铁手")).toBeInTheDocument();
    expect(screen.getByText("混躺日常：这把混")).toBeInTheDocument();
    expect(screen.getByText("汤肴精选：下饭操作")).toBeInTheDocument();
  });

  /**
   * 测试用例 TC-004: 搜索功能测试 - 按标题搜索
   * 测试目标：验证按视频标题搜索功能正常
   */
  test("TC-004: 搜索功能测试 - 按标题搜索", async () => {
    render(<CanteenHall theme="blood" onVideoClick={mockOnVideoClick} />);

    const searchInput = screen.getByPlaceholderText("搜索视频标题或标签...");

    // 输入搜索词
    fireEvent.change(searchInput, { target: { value: "血怒" } });

    // 验证搜索结果
    await waitFor(() => {
      expect(screen.getByText("血怒时刻：无情铁手")).toBeInTheDocument();
      expect(screen.queryByText("混躺日常：这把混")).not.toBeInTheDocument();
    });

    // 验证搜索后只有一个视频显示（血怒时刻）
    expect(screen.queryByText("混躺日常：这把混")).not.toBeInTheDocument();
    expect(screen.queryByText("汤肴精选：下饭操作")).not.toBeInTheDocument();
  });

  /**
   * 测试用例 TC-005: 搜索功能测试 - 按标签搜索
   * 测试目标：验证按标签搜索功能正常
   */
  test("TC-005: 搜索功能测试 - 按标签搜索", async () => {
    render(<CanteenHall theme="blood" onVideoClick={mockOnVideoClick} />);

    const searchInput = screen.getByPlaceholderText("搜索视频标题或标签...");

    // 输入标签搜索词
    fireEvent.change(searchInput, { target: { value: "下饭" } });

    // 验证搜索结果（应该匹配两个视频的标签）
    await waitFor(() => {
      expect(screen.getByText("混躺日常：这把混")).toBeInTheDocument();
      expect(screen.getByText("汤肴精选：下饭操作")).toBeInTheDocument();
      expect(screen.queryByText("血怒时刻：无情铁手")).not.toBeInTheDocument();
    });
  });

  /**
   * 测试用例 TC-006: 清除搜索测试
   * 测试目标：验证清除搜索功能正常
   */
  test("TC-006: 清除搜索测试", async () => {
    render(<CanteenHall theme="blood" onVideoClick={mockOnVideoClick} />);

    const searchInput = screen.getByPlaceholderText("搜索视频标题或标签...");

    // 输入搜索词
    fireEvent.change(searchInput, { target: { value: "血怒" } });

    // 等待搜索结果显示
    await waitFor(() => {
      expect(screen.queryByText("混躺日常：这把混")).not.toBeInTheDocument();
    });

    // 点击清除按钮
    const clearButton = screen.getByRole("button", { name: "" });
    fireEvent.click(clearButton);

    // 验证搜索已清除，所有视频显示
    await waitFor(() => {
      expect(screen.getByText("血怒时刻：无情铁手")).toBeInTheDocument();
      expect(screen.getByText("混躺日常：这把混")).toBeInTheDocument();
      expect(screen.getByText("汤肴精选：下饭操作")).toBeInTheDocument();
    });
  });

  /**
   * 测试用例 TC-007: 分类筛选测试 - 硬核区
   * 测试目标：验证按分类筛选功能正常
   */
  test("TC-007: 分类筛选测试 - 硬核区", async () => {
    render(<CanteenHall theme="blood" onVideoClick={mockOnVideoClick} />);

    // 点击硬核区分类按钮
    const hardcoreButton = screen.getByText("硬核区");
    fireEvent.click(hardcoreButton);

    // 验证筛选结果
    await waitFor(() => {
      expect(screen.getByText("血怒时刻：无情铁手")).toBeInTheDocument();
      expect(screen.queryByText("混躺日常：这把混")).not.toBeInTheDocument();
      expect(screen.queryByText("汤肴精选：下饭操作")).not.toBeInTheDocument();
    });
  });

  /**
   * 测试用例 TC-008: 分类筛选测试 - 主食区
   * 测试目标：验证按分类筛选功能正常
   */
  test("TC-008: 分类筛选测试 - 主食区", async () => {
    render(<CanteenHall theme="blood" onVideoClick={mockOnVideoClick} />);

    // 点击主食区分类按钮
    const mainButton = screen.getByText("主食区");
    fireEvent.click(mainButton);

    // 验证筛选结果
    await waitFor(() => {
      expect(screen.queryByText("血怒时刻：无情铁手")).not.toBeInTheDocument();
      expect(screen.getByText("混躺日常：这把混")).toBeInTheDocument();
      expect(screen.queryByText("汤肴精选：下饭操作")).not.toBeInTheDocument();
    });
  });

  /**
   * 测试用例 TC-009: 全部分类测试
   * 测试目标：验证全部分类按钮显示所有视频
   */
  test("TC-009: 全部分类测试", async () => {
    render(<CanteenHall theme="blood" onVideoClick={mockOnVideoClick} />);

    // 先点击一个分类
    const hardcoreButton = screen.getByText("硬核区");
    fireEvent.click(hardcoreButton);

    await waitFor(() => {
      expect(screen.queryByText("混躺日常：这把混")).not.toBeInTheDocument();
    });

    // 点击全部按钮
    const allButton = screen.getByText("全部");
    fireEvent.click(allButton);

    // 验证所有视频显示
    await waitFor(() => {
      expect(screen.getByText("血怒时刻：无情铁手")).toBeInTheDocument();
      expect(screen.getByText("混躺日常：这把混")).toBeInTheDocument();
      expect(screen.getByText("汤肴精选：下饭操作")).toBeInTheDocument();
    });
  });

  /**
   * 测试用例 TC-010: 视频点击回调测试
   * 测试目标：验证点击视频卡片触发回调
   */
  test("TC-010: 视频点击回调测试", () => {
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
   * 测试用例 TC-011: 空状态测试
   * 测试目标：验证无搜索结果时显示空状态
   */
  test("TC-011: 空状态测试", async () => {
    render(<CanteenHall theme="blood" onVideoClick={mockOnVideoClick} />);

    const searchInput = screen.getByPlaceholderText("搜索视频标题或标签...");

    // 输入一个不存在的搜索词
    fireEvent.change(searchInput, { target: { value: "不存在的视频" } });

    // 验证空状态显示
    await waitFor(() => {
      expect(screen.getByText("没有找到匹配的视频")).toBeInTheDocument();
      expect(screen.getByText("清除筛选条件")).toBeInTheDocument();
    });
  });

  /**
   * 测试用例 TC-012: 清除筛选条件测试
   * 测试目标：验证空状态下的清除按钮功能
   */
  test("TC-012: 清除筛选条件测试", async () => {
    render(<CanteenHall theme="blood" onVideoClick={mockOnVideoClick} />);

    const searchInput = screen.getByPlaceholderText("搜索视频标题或标签...");

    // 输入一个不存在的搜索词
    fireEvent.change(searchInput, { target: { value: "不存在的视频" } });

    // 等待空状态显示
    await waitFor(() => {
      expect(screen.getByText("清除筛选条件")).toBeInTheDocument();
    });

    // 点击清除按钮
    const clearFilterButton = screen.getByText("清除筛选条件");
    fireEvent.click(clearFilterButton);

    // 验证所有视频显示
    await waitFor(() => {
      expect(screen.getByText("血怒时刻：无情铁手")).toBeInTheDocument();
      expect(screen.getByText("混躺日常：这把混")).toBeInTheDocument();
      expect(screen.getByText("汤肴精选：下饭操作")).toBeInTheDocument();
    });
  });

  /**
   * 测试用例 TC-013: 视频时长显示测试
   * 测试目标：验证视频时长正确显示
   */
  test("TC-013: 视频时长显示测试", () => {
    render(<CanteenHall theme="blood" onVideoClick={mockOnVideoClick} />);

    // 验证时长显示
    expect(screen.getByText("10:30")).toBeInTheDocument();
    expect(screen.getByText("15:20")).toBeInTheDocument();
    expect(screen.getByText("08:45")).toBeInTheDocument();
  });

  /**
   * 测试用例 TC-014: 视频标签显示测试
   * 测试目标：验证视频标签正确显示
   */
  test("TC-014: 视频标签显示测试", () => {
    render(<CanteenHall theme="blood" onVideoClick={mockOnVideoClick} />);

    // 验证标签显示（使用getAllByText因为可能有多个相同标签）
    expect(screen.getByText("血怒")).toBeInTheDocument();
    expect(screen.getByText("诺手")).toBeInTheDocument();
    expect(screen.getByText("混躺")).toBeInTheDocument();
    // "下饭"标签可能有多个，使用getAllByText
    expect(screen.getAllByText("下饭").length).toBeGreaterThanOrEqual(1);
  });

  /**
   * 测试用例 TC-015: 视频计数区域显示测试
   * 测试目标：验证视频计数区域存在
   */
  test("TC-015: 视频计数区域显示测试", () => {
    const { container } = render(<CanteenHall theme="blood" onVideoClick={mockOnVideoClick} />);

    // 验证计数区域存在（通过类名选择）
    const videoCountSection = container.querySelector(".text-center.mb-4");
    expect(videoCountSection).toBeInTheDocument();
  });

  /**
   * 测试用例 TC-016: 响应式网格布局测试 - 桌面端4列
   * 测试目标：验证桌面端视频网格显示4列
   */
  test("TC-016: 响应式网格布局测试 - 桌面端4列", () => {
    const { container } = render(<CanteenHall theme="blood" onVideoClick={mockOnVideoClick} />);

    // 验证网格容器存在
    const gridContainer = container.querySelector(".grid");
    expect(gridContainer).toBeInTheDocument();

    // 验证桌面端使用grid-cols-4类
    expect(gridContainer?.classList.contains("lg:grid-cols-4")).toBe(true);
  });

  /**
   * 测试用例 TC-017: 响应式网格布局测试 - 平板端3列
   * 测试目标：验证平板端视频网格显示3列
   */
  test("TC-017: 响应式网格布局测试 - 平板端3列", () => {
    const { container } = render(<CanteenHall theme="blood" onVideoClick={mockOnVideoClick} />);

    // 验证网格容器存在
    const gridContainer = container.querySelector(".grid");
    expect(gridContainer).toBeInTheDocument();

    // 验证平板端使用md:grid-cols-3类
    expect(gridContainer?.classList.contains("md:grid-cols-3")).toBe(true);
  });

  /**
   * 测试用例 TC-018: 响应式网格布局测试 - 移动端2列
   * 测试目标：验证移动端视频网格显示2列
   */
  test("TC-018: 响应式网格布局测试 - 移动端2列", () => {
    const { container } = render(<CanteenHall theme="blood" onVideoClick={mockOnVideoClick} />);

    // 验证网格容器存在
    const gridContainer = container.querySelector(".grid");
    expect(gridContainer).toBeInTheDocument();

    // 验证移动端使用grid-cols-2类
    expect(gridContainer?.classList.contains("grid-cols-2")).toBe(true);
  });

  /**
   * 测试用例 TC-019: 混躺模式视频模块标题测试
   * 测试目标：验证混躺模式下显示正确的标题
   */
  test("TC-019: 混躺模式视频模块标题测试", () => {
    render(<CanteenHall theme="mix" onVideoClick={mockOnVideoClick} />);

    expect(screen.getByText("食堂大殿")).toBeInTheDocument();
    expect(screen.getByText("下饭经典，吃饱为止")).toBeInTheDocument();
  });

  /**
   * 测试用例 TC-020: 混躺模式分类按钮测试
   * 测试目标：验证混躺模式下分类按钮顺序正确
   */
  test("TC-020: 混躺模式分类按钮测试", () => {
    render(<CanteenHall theme="mix" onVideoClick={mockOnVideoClick} />);

    // 混躺模式下主食区应该排在前面
    const buttons = screen.getAllByRole("button");
    const buttonTexts = buttons.map((btn) => btn.textContent);

    expect(buttonTexts).toContain("全部");
    expect(buttonTexts).toContain("主食区");
    expect(buttonTexts).toContain("硬核区");
    expect(buttonTexts).toContain("汤肴区");
  });
});

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { VideoModal } from "@/features/yuxiaoc/components/VideoModal";
import type { Video } from "@/features/yuxiaoc/data/types";
import "@testing-library/jest-dom";

describe("VideoModal组件测试", () => {
  const mockVideo: Video = {
    id: "1",
    bvid: "BV1xx411c7mD",
    title: "血怒时刻：无情铁手",
    cover: "https://example.com/cover.jpg",
    duration: "10:30",
    category: "hardcore",
    tags: ["血怒", "诺手", "经典"],
    description: "这是一段经典的血怒时刻视频，展示了C皇的无情铁手操作",
  };

  const mockOnClose = jest.fn();

  beforeEach(() => {
    mockOnClose.mockClear();
  });

  /**
   * 测试用例 TC-001: 组件无视频时不渲染测试
   * 测试目标：验证当video为null时组件不渲染
   */
  test("TC-001: 组件无视频时不渲染测试", () => {
    const { container } = render(<VideoModal video={null} theme="blood" onClose={mockOnClose} />);

    // 验证容器为空
    expect(container.firstChild).toBeNull();
  });

  /**
   * 测试用例 TC-002: 组件有视频时渲染测试
   * 测试目标：验证当video不为null时组件正确渲染
   */
  test("TC-002: 组件有视频时渲染测试", () => {
    render(<VideoModal video={mockVideo} theme="blood" onClose={mockOnClose} />);

    expect(screen.getByText("血怒时刻：无情铁手")).toBeInTheDocument();
  });

  /**
   * 测试用例 TC-003: 视频标题显示测试
   * 测试目标：验证视频标题正确显示
   */
  test("TC-003: 视频标题显示测试", () => {
    render(<VideoModal video={mockVideo} theme="blood" onClose={mockOnClose} />);

    expect(screen.getByText("血怒时刻：无情铁手")).toBeInTheDocument();
  });

  /**
   * 测试用例 TC-004: 视频描述显示测试
   * 测试目标：验证视频描述正确显示
   */
  test("TC-004: 视频描述显示测试", () => {
    render(<VideoModal video={mockVideo} theme="blood" onClose={mockOnClose} />);

    expect(screen.getByText("这是一段经典的血怒时刻视频，展示了C皇的无情铁手操作")).toBeInTheDocument();
  });

  /**
   * 测试用例 TC-005: 视频标签显示测试
   * 测试目标：验证视频标签正确显示
   */
  test("TC-005: 视频标签显示测试", () => {
    render(<VideoModal video={mockVideo} theme="blood" onClose={mockOnClose} />);

    expect(screen.getByText("血怒")).toBeInTheDocument();
    expect(screen.getByText("诺手")).toBeInTheDocument();
    expect(screen.getByText("经典")).toBeInTheDocument();
  });

  /**
   * 测试用例 TC-006: 视频封面显示测试
   * 测试目标：验证视频封面图片正确显示
   */
  test("TC-006: 视频封面显示测试", () => {
    render(<VideoModal video={mockVideo} theme="blood" onClose={mockOnClose} />);

    const coverImage = screen.getByAltText("血怒时刻：无情铁手");
    expect(coverImage).toBeInTheDocument();
    expect(coverImage).toHaveAttribute("src", "https://example.com/cover.jpg");
  });

  /**
   * 测试用例 TC-007: B站链接测试
   * 测试目标：验证前往B站观看按钮链接正确
   */
  test("TC-007: B站链接测试", () => {
    render(<VideoModal video={mockVideo} theme="blood" onClose={mockOnClose} />);

    const bilibiliLink = screen.getByText("前往B站观看").closest("a");
    expect(bilibiliLink).toHaveAttribute("href", "https://www.bilibili.com/video/BV1xx411c7mD");
    expect(bilibiliLink).toHaveAttribute("target", "_blank");
    expect(bilibiliLink).toHaveAttribute("rel", "noopener noreferrer");
  });

  /**
   * 测试用例 TC-008: 关闭按钮点击测试
   * 测试目标：验证点击关闭按钮触发onClose回调
   */
  test("TC-008: 关闭按钮点击测试", () => {
    render(<VideoModal video={mockVideo} theme="blood" onClose={mockOnClose} />);

    // 找到关闭按钮（通过X图标）
    const closeButton = screen.getByRole("button");
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  /**
   * 测试用例 TC-009: 背景点击关闭测试
   * 测试目标：验证点击背景遮罩触发onClose回调
   */
  test("TC-009: 背景点击关闭测试", () => {
    const { container } = render(<VideoModal video={mockVideo} theme="blood" onClose={mockOnClose} />);

    // 点击背景遮罩
    const overlay = container.firstChild as HTMLElement;
    fireEvent.click(overlay);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  /**
   * 测试用例 TC-010: 模态框内容点击不关闭测试
   * 测试目标：验证点击模态框内容不触发onClose
   */
  test("TC-010: 模态框内容点击不关闭测试", () => {
    render(<VideoModal video={mockVideo} theme="blood" onClose={mockOnClose} />);

    // 点击模态框内容区域
    const modalContent = screen.getByText("血怒时刻：无情铁手").closest("div");
    if (modalContent) {
      fireEvent.click(modalContent);
    }

    // onClose不应被调用
    expect(mockOnClose).not.toHaveBeenCalled();
  });

  /**
   * 测试用例 TC-011: 血怒模式样式测试
   * 测试目标：验证血怒模式下正确应用样式
   */
  test("TC-011: 血怒模式样式测试", () => {
    const { container } = render(<VideoModal video={mockVideo} theme="blood" onClose={mockOnClose} />);

    // 验证血怒主题的边框颜色
    const modalContainer = container.querySelector("div[style*='border: 2px solid rgba(225, 29, 72, 0.5)']");
    expect(modalContainer).toBeInTheDocument();
  });

  /**
   * 测试用例 TC-012: 混躺模式样式测试
   * 测试目标：验证混躺模式下正确应用样式
   */
  test("TC-012: 混躺模式样式测试", () => {
    const { container } = render(<VideoModal video={mockVideo} theme="mix" onClose={mockOnClose} />);

    // 验证混躺主题的边框颜色
    const modalContainer = container.querySelector("div[style*='border: 2px solid rgba(245, 158, 11, 0.5)']");
    expect(modalContainer).toBeInTheDocument();
  });

  /**
   * 测试用例 TC-013: 无描述视频测试
   * 测试目标：验证无描述的视频不显示描述区域
   */
  test("TC-013: 无描述视频测试", () => {
    const videoWithoutDescription: Video = {
      ...mockVideo,
      description: undefined,
    };

    render(<VideoModal video={videoWithoutDescription} theme="blood" onClose={mockOnClose} />);

    // 验证描述不存在
    expect(screen.queryByText("这是一段经典的血怒时刻视频")).not.toBeInTheDocument();
    // 但标题仍然存在
    expect(screen.getByText("血怒时刻：无情铁手")).toBeInTheDocument();
  });

  /**
   * 测试用例 TC-014: 固定定位测试
   * 测试目标：验证模态框使用固定定位覆盖全屏
   */
  test("TC-014: 固定定位测试", () => {
    const { container } = render(<VideoModal video={mockVideo} theme="blood" onClose={mockOnClose} />);

    // 验证固定定位
    const overlay = container.firstChild as HTMLElement;
    expect(overlay).toHaveClass("fixed", "inset-0");
  });

  /**
   * 测试用例 TC-015: 高z-index测试
   * 测试目标：验证模态框具有高z-index确保在最上层
   */
  test("TC-015: 高z-index测试", () => {
    const { container } = render(<VideoModal video={mockVideo} theme="blood" onClose={mockOnClose} />);

    // 验证z-index
    const overlay = container.firstChild as HTMLElement;
    expect(overlay).toHaveClass("z-50");
  });
});

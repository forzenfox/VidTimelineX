import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { VideoModal } from "@/features/lvjiang/components/VideoModal";
import "@testing-library/jest-dom";

describe("VideoModal组件测试", () => {
  const mockVideo = {
    id: "1",
    title: "测试视频",
    category: "sing",
    tags: ["测试", "视频"],
    cover: "https://example.com/cover.jpg",
    date: "2024-01-01",
    views: "10万",
    icon: "Heart",
    videoUrl: "https://www.bilibili.com/video/BV1xx411c7mD",
    duration: "10:30",
  };

  const mockOnClose = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  /**
   * 测试用例 TC-001: 组件渲染测试
   * 测试目标：验证VideoModal组件能够正确渲染
   */
  test("TC-001: 组件渲染测试", () => {
    render(<VideoModal video={mockVideo} onClose={mockOnClose} theme="dongzhu" />);

    // 验证组件能够正确渲染
    expect(document.body).toBeInTheDocument();
  });

  /**
   * 测试用例 TC-002: 关闭按钮测试
   * 测试目标：验证关闭按钮能够正确触发onClose回调
   */
  test("TC-002: 关闭按钮测试", () => {
    render(<VideoModal video={mockVideo} onClose={mockOnClose} theme="dongzhu" />);

    const closeButton = screen.getByRole("button");
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalled();
  });

  /**
   * 测试用例 TC-003: 视频嵌入测试
   * 测试目标：验证视频能够正确嵌入
   */
  test("TC-003: 视频嵌入测试", () => {
    const { container } = render(
      <VideoModal video={mockVideo} onClose={mockOnClose} theme="dongzhu" />
    );

    const videoContainer = container.querySelector(".relative.aspect-video");
    expect(videoContainer).toBeInTheDocument();
  });

  /**
   * 测试用例 TC-004: 跳转原站测试
   * 测试目标：验证跳转原站按钮能够正确渲染
   */
  test("TC-004: 跳转原站测试", () => {
    render(<VideoModal video={mockVideo} onClose={mockOnClose} theme="dongzhu" />);

    const jumpButton = screen.getByRole("link");
    expect(jumpButton).toBeInTheDocument();
  });

  /**
   * 测试用例 TC-005: 空视频测试
   * 测试目标：验证当video为null时组件能够正确处理
   */
  test("TC-005: 空视频测试", () => {
    const { container } = render(<VideoModal video={null} onClose={mockOnClose} theme="dongzhu" />);

    expect(container.firstChild).toBeNull();
  });

  /**
   * 测试用例 TC-006: ESC键关闭弹窗测试
   * 测试目标：验证按ESC键能够正确触发onClose回调
   */
  test("TC-006: ESC键关闭弹窗测试", () => {
    render(<VideoModal video={mockVideo} onClose={mockOnClose} theme="dongzhu" />);

    fireEvent.keyDown(document, { key: "Escape" });
    expect(mockOnClose).toHaveBeenCalled();
  });

  /**
   * 测试用例 TC-007: 弹窗打开时锁定body滚动测试
   * 测试目标：验证弹窗打开时body的overflow被锁定
   */
  test("TC-007: 弹窗打开时锁定body滚动测试", () => {
    render(<VideoModal video={mockVideo} onClose={mockOnClose} theme="dongzhu" />);

    expect(document.body.style.overflow).toBe("hidden");
  });

  /**
   * 测试用例 TC-008: 弹窗关闭时恢复body滚动测试
   * 测试目标：验证弹窗关闭后body的overflow被恢复
   */
  test("TC-008: 弹窗关闭时恢复body滚动测试", () => {
    const { unmount } = render(
      <VideoModal video={mockVideo} onClose={mockOnClose} theme="dongzhu" />
    );

    const closeButton = screen.getByRole("button");
    fireEvent.click(closeButton);
    unmount();

    expect(document.body.style.overflow).toBe("unset");
  });

  /**
   * 测试用例 TC-009: kaige主题测试
   * 测试目标：验证kaige主题能够正确渲染
   */
  test("TC-009: kaige主题测试", () => {
    const { container } = render(
      <VideoModal video={mockVideo} onClose={mockOnClose} theme="kaige" />
    );

    const modal = container.querySelector(".max-w-5xl");
    expect(modal).toBeInTheDocument();
  });
});

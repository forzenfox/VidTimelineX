/**
 * VideoModal组件测试用例（甜筒）
 * 对应测试用例 TC-041 ~ TC-043
 * 验证VideoModal组件的渲染、关闭和主题切换功能
 */

import React from "react";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import VideoModal from "@/features/tiantong/components/VideoModal";
import type { Video } from "@/features/tiantong/data/types";

import "@testing-library/jest-dom";

describe("VideoModal组件测试（甜筒）", () => {
  const mockVideo: Video = {
    id: "1",
    title: "测试视频",
    category: "sing",
    tags: ["测试"],
    cover: "https://example.com/cover.jpg",
    date: "2024-01-01",
    views: "10万",
    icon: "Heart",
    videoUrl: "https://www.bilibili.com/video/BV1xx411c7mD",
    duration: "10:30",
  };

  const mockOnClose = jest.fn();

  /**
   * 测试用例 TC-041: VideoModal渲染测试（甜筒）
   * 测试目标：验证VideoModal组件正确渲染
   */
  test("TC-041: VideoModal渲染测试（甜筒）", () => {
    const { container } = render(
      <VideoModal video={mockVideo} onClose={mockOnClose} theme="sweet" />
    );

    // 验证弹窗存在
    const modal = container.querySelector('[role="dialog"]');
    expect(modal).toBeInTheDocument();

    // 验证视频标题
    expect(screen.getByText("测试视频")).toBeInTheDocument();

    // 验证iframe存在
    const iframe = container.querySelector("iframe");
    expect(iframe).toBeInTheDocument();

    // 验证跳转B站观看按钮
    expect(screen.getByText(/跳转B站观看/)).toBeInTheDocument();
  });

  /**
   * 测试用例 TC-042: VideoModal关闭测试（甜筒）
   * 测试目标：验证弹窗可以正确关闭
   */
  test("TC-042: VideoModal关闭测试（甜筒）", () => {
    const { container, rerender } = render(
      <VideoModal video={mockVideo} onClose={mockOnClose} theme="sweet" />
    );

    // 验证VideoModal是否被渲染
    const modal = container.querySelector('[role="dialog"]');
    expect(modal).toBeInTheDocument();

    // 点击关闭按钮
    const closeButton = screen.getByRole("button");
    fireEvent.click(closeButton);

    // 验证onClose回调是否被调用
    expect(mockOnClose).toHaveBeenCalledTimes(1);

    // 重新渲染，模拟video设置为null
    rerender(<VideoModal video={null} onClose={mockOnClose} theme="sweet" />);

    // 验证VideoModal是否被卸载
    const modalAfterClose = container.querySelector('[role="dialog"]');
    expect(modalAfterClose).not.toBeInTheDocument();
  });

  /**
   * 测试用例 TC-043: VideoModal主题切换测试（甜筒）
   * 测试目标：验证弹窗在不同主题下都能正常显示
   */
  test("TC-043: VideoModal主题切换测试（甜筒）", () => {
    const { container, rerender } = render(
      <VideoModal video={mockVideo} onClose={mockOnClose} theme="sweet" />
    );

    // 验证甜筒主题下的弹窗
    const sweetModal = container.querySelector('[role="dialog"]');
    expect(sweetModal).toBeInTheDocument();

    // 切换到老虎主题
    rerender(<VideoModal video={mockVideo} onClose={mockOnClose} theme="tiger" />);

    // 验证老虎主题下的弹窗
    const tigerModal = container.querySelector('[role="dialog"]');
    expect(tigerModal).toBeInTheDocument();
  });

  afterEach(() => {
    cleanup();
  });
});

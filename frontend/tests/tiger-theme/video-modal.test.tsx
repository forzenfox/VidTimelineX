/**
 * 视频弹窗功能测试用例
 * 对应测试用例 TC-022 ~ TC-025
 * 验证视频点击事件、弹窗显示、弹窗关闭以及不同主题下的弹窗功能
 */

import React from "react";
import { render, screen, fireEvent, cleanup, waitFor } from "@testing-library/react";
import VideoCard from "@/components/hu/hu_VideoCard";
import VideoModal from "@/components/hu/hu_VideoModal";
import { Heart } from "lucide-react";
import type { Video } from "@/features/tiantong/data/types";
import "@testing-library/jest-dom";

describe("视频弹窗功能测试", () => {
  const mockVideo: Video = {
    id: "1",
    title: "测试视频",
    category: "sing",
    tags: ["测试"],
    cover: "https://example.com/cover.jpg",
    date: "2024-01-01",
    views: "10万",
    icon: Heart
  };

  /**
   * 测试用例 TC-022: 视频点击事件测试
   * 测试目标：验证点击视频卡片时正确触发onClick事件
   */
  test("TC-022: 视频点击事件测试", () => {
    const onClick = jest.fn();
    const { container } = render(<VideoCard video={mockVideo} onClick={onClick} />);

    // 验证视频卡片存在
    const card = screen.getByRole("article");
    expect(card).toBeInTheDocument();

    // 点击视频卡片
    fireEvent.click(card);

    // 验证onClick回调是否被调用
    expect(onClick).toHaveBeenCalledTimes(1);

    // 验证传递的video对象是否正确
    expect(onClick).toHaveBeenCalledWith(mockVideo);

    // 记录测试结果
    console.log("✅ TC-022: 视频点击事件测试通过");
  });

  /**
   * 测试用例 TC-023: 视频弹窗显示测试
   * 测试目标：验证点击视频后弹窗正确显示
   */
  test("TC-023: 视频弹窗显示测试", async () => {
    const onClose = jest.fn();
    const { container } = render(<VideoModal video={mockVideo} onClose={onClose} theme="tiger" />);

    // 验证VideoModal是否被渲染
    const modal = container.querySelector('[role="dialog"]');
    expect(modal).toBeInTheDocument();

    // 验证弹窗可见
    expect(modal).toBeVisible();

    // 记录测试结果
    console.log("✅ TC-023: 视频弹窗显示测试通过");
  });

  /**
   * 测试用例 TC-024: 视频弹窗关闭测试
   * 测试目标：验证弹窗可以正确关闭
   */
  test("TC-024: 视频弹窗关闭测试", async () => {
    const onClose = jest.fn();
    const { container, rerender } = render(<VideoModal video={mockVideo} onClose={onClose} theme="tiger" />);

    // 验证VideoModal是否被渲染
    const modal = container.querySelector('[role="dialog"]');
    expect(modal).toBeInTheDocument();

    // 点击关闭按钮
    const closeButton = screen.getByRole("button");
    fireEvent.click(closeButton);

    // 验证onClose回调是否被调用
    expect(onClose).toHaveBeenCalledTimes(1);

    // 重新渲染，模拟selectedVideo设置为null
    rerender(<VideoModal video={null} onClose={onClose} theme="tiger" />);

    // 验证VideoModal是否被卸载
    const modalAfterClose = container.querySelector('[role="dialog"]');
    expect(modalAfterClose).not.toBeInTheDocument();

    // 记录测试结果
    console.log("✅ TC-024: 视频弹窗关闭测试通过");
  });

  /**
   * 测试用例 TC-025: 不同主题下的弹窗测试
   * 测试目标：验证弹窗在不同主题下都能正常显示
   */
  test("TC-025: 不同主题下的弹窗测试", async () => {
    const onClose = jest.fn();

    // 测试老虎主题
    const { container: tigerContainer, rerender } = render(
      <VideoModal video={mockVideo} onClose={onClose} theme="tiger" />
    );

    // 验证老虎主题下的弹窗
    const tigerModal = tigerContainer.querySelector('[role="dialog"]');
    expect(tigerModal).toBeInTheDocument();

    // 切换到甜筒主题
    rerender(<VideoModal video={mockVideo} onClose={onClose} theme="sweet" />);

    // 验证甜筒主题下的弹窗
    const sweetModal = tigerContainer.querySelector('[role="dialog"]');
    expect(sweetModal).toBeInTheDocument();

    // 记录测试结果
    console.log("✅ TC-025: 不同主题下的弹窗测试通过");
  });

  /**
   * 测试用例 TC-026: 键盘事件测试
   * 测试目标：验证按Enter键可以触发视频点击
   */
  test("TC-026: 键盘事件测试", () => {
    const onClick = jest.fn();
    const { container } = render(<VideoCard video={mockVideo} onClick={onClick} />);

    // 验证视频卡片存在
    const card = screen.getByRole("article");
    expect(card).toBeInTheDocument();

    // 按Enter键
    fireEvent.keyDown(card, { key: "Enter" });

    // 验证onClick回调是否被调用
    expect(onClick).toHaveBeenCalledTimes(1);

    // 验证传递的video对象是否正确
    expect(onClick).toHaveBeenCalledWith(mockVideo);

    // 记录测试结果
    console.log("✅ TC-026: 键盘事件测试通过");
  });

  /**
   * 测试用例 TC-027: ESC键关闭弹窗测试
   * 测试目标：验证按ESC键可以关闭弹窗
   */
  test("TC-027: ESC键关闭弹窗测试", async () => {
    const onClose = jest.fn();
    const { container } = render(<VideoModal video={mockVideo} onClose={onClose} theme="tiger" />);

    // 验证VideoModal是否被渲染
    const modal = container.querySelector('[role="dialog"]');
    expect(modal).toBeInTheDocument();

    // 按ESC键
    fireEvent.keyDown(document, { key: "Escape" });

    // 等待onClose回调被调用
    await waitFor(
      () => {
        expect(onClose).toHaveBeenCalled();
      },
      { timeout: 100 }
    );

    // 验证onClose回调被调用一次
    expect(onClose).toHaveBeenCalledTimes(1);

    // 记录测试结果
    console.log("✅ TC-027: ESC键关闭弹窗测试通过");
  });

  afterEach(() => {
    cleanup();
  });
});

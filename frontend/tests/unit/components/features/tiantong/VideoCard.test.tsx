/**
 * VideoCard组件测试用例（甜筒）
 * 对应测试用例 TC-038 ~ TC-040
 * 验证VideoCard组件的渲染、点击事件和hover效果
 */

import React from "react";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import VideoCard from "@/features/tiantong/components/VideoCard";
import type { Video } from "@/features/tiantong/data/types";

import "@testing-library/jest-dom";

describe("VideoCard组件测试（甜筒）", () => {
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
    bv: "BV1xx411c7mD",
    duration: "10:30",
  };

  const mockOnClick = jest.fn();

  /**
   * 测试用例 TC-038: VideoCard渲染测试（甜筒）
   * 测试目标：验证VideoCard组件正确渲染
   */
  test("TC-038: VideoCard渲染测试（甜筒）", () => {
    const { container } = render(<VideoCard video={mockVideo} onClick={mockOnClick} />);

    // 验证视频卡片存在
    const card = screen.getByRole("article");
    expect(card).toBeInTheDocument();

    // 验证视频标题
    expect(screen.getByText("测试视频")).toBeInTheDocument();

    // 验证视频封面
    const cover = container.querySelector('img[alt="测试视频"]');
    expect(cover).toBeInTheDocument();

    // 验证视频日期
    expect(screen.getByText("2024-01-01")).toBeInTheDocument();

    // 验证视频播放量
    expect(screen.getByText("10万")).toBeInTheDocument();

    // 验证分类标签
    expect(screen.getByText("甜筒天籁")).toBeInTheDocument();
  });

  /**
   * 测试用例 TC-039: VideoCard点击事件测试（甜筒）
   * 测试目标：验证点击视频卡片时正确触发onClick事件
   */
  test("TC-039: VideoCard点击事件测试（甜筒）", () => {
    render(<VideoCard video={mockVideo} onClick={mockOnClick} />);

    // 点击视频卡片
    const card = screen.getByRole("article");
    fireEvent.click(card);

    // 验证onClick回调是否被调用
    expect(mockOnClick).toHaveBeenCalledTimes(1);

    // 验证传递的video对象是否正确
    expect(mockOnClick).toHaveBeenCalledWith(mockVideo);
  });

  /**
   * 测试用例 TC-040: VideoCard hover效果测试（甜筒）
   * 测试目标：验证VideoCard的hover效果
   */
  test("TC-040: VideoCard hover效果测试（甜筒）", () => {
    const { container } = render(<VideoCard video={mockVideo} onClick={mockOnClick} />);

    // 验证视频卡片存在
    const card = screen.getByRole("article");
    expect(card).toBeInTheDocument();

    // 验证hover相关的类名
    expect(card).toHaveClass("group");
    expect(card).toHaveClass("hover:-translate-y-1.5");
    expect(card).toHaveClass("hover:shadow-xl");

    // 验证播放按钮的hover效果
    const playButton = container.querySelector(".group-hover\\:scale-100");
    expect(playButton).toBeInTheDocument();

    // 验证封面图的hover效果
    const cover = container.querySelector(".group-hover\\:scale-110");
    expect(cover).toBeInTheDocument();
  });

  afterEach(() => {
    cleanup();
  });
});

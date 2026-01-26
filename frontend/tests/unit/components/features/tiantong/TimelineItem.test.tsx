/**
 * TimelineItem组件测试用例
 * 对应测试用例 TC-035 ~ TC-037
 * 验证TimelineItem组件的渲染、点击事件和主题适配功能
 */

import React from "react";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import TimelineItem from "@/features/tiantong/components/TimelineItem";
import type { Video } from "@/features/tiantong/data/types";
import { Heart } from "lucide-react";
import "@testing-library/jest-dom";

describe("TimelineItem组件测试", () => {
  const mockVideos: Video[] = [
    {
      id: "1",
      title: "测试视频1",
      category: "sing",
      tags: ["测试"],
      cover: "https://example.com/cover1.jpg",
      date: "2024-01-01",
      views: "10万",
      icon: Heart,
      bvid: "BV1xx411c7mD",
      duration: "10:30"
    },
    {
      id: "2",
      title: "测试视频2",
      category: "sing",
      tags: ["测试"],
      cover: "https://example.com/cover2.jpg",
      date: "2024-01-01",
      views: "20万",
      icon: Heart,
      bvid: "BV1yy4y1B7Mm",
      duration: "12:45"
    }
  ];

  const mockOnVideoClick = jest.fn();

  /**
   * 测试用例 TC-035: TimelineItem渲染测试
   * 测试目标：验证TimelineItem组件正确渲染
   */
  test("TC-035: TimelineItem渲染测试", () => {
    const { container } = render(
      <TimelineItem
        date="2024-01-01"
        videos={mockVideos}
        onVideoClick={mockOnVideoClick}
        theme="tiger"
      />
    );

    // 验证日期显示（使用getAllByText因为日期会渲染多次）
    const dateElements = screen.getAllByText("2024-01-01");
    expect(dateElements.length).toBeGreaterThan(0);

    // 验证视频卡片数量
    const videoCards = container.querySelectorAll('[role="article"]');
    expect(videoCards).toHaveLength(2);
  });

  /**
   * 测试用例 TC-036: TimelineItem点击事件测试
   * 测试目标：验证点击视频时正确触发onClick事件
   */
  test("TC-036: TimelineItem点击事件测试", () => {
    const { container } = render(
      <TimelineItem
        date="2024-01-01"
        videos={mockVideos}
        onVideoClick={mockOnVideoClick}
        theme="tiger"
      />
    );

    // 点击第一个视频卡片
    const firstVideoCard = container.querySelector('[role="article"]');
    fireEvent.click(firstVideoCard as Element);

    // 验证onClick回调是否被调用
    expect(mockOnVideoClick).toHaveBeenCalledTimes(1);

    // 验证传递的video对象是否正确
    expect(mockOnVideoClick).toHaveBeenCalledWith(mockVideos[0]);
  });

  /**
   * 测试用例 TC-037: TimelineItem主题适配测试
   * 测试目标：验证TimelineItem在不同主题下都能正确渲染
   */
  test("TC-037: TimelineItem主题适配测试", () => {
    const { container: tigerContainer, rerender } = render(
      <TimelineItem
        date="2024-01-01"
        videos={mockVideos}
        onVideoClick={mockOnVideoClick}
        theme="tiger"
      />
    );

    // 验证老虎主题渲染（使用getAllByText因为日期会渲染多次）
    const dateElements = screen.getAllByText("2024-01-01");
    expect(dateElements.length).toBeGreaterThan(0);
    expect(tigerContainer.querySelectorAll('[role="article"]')).toHaveLength(2);

    // 切换到甜筒主题
    rerender(
      <TimelineItem
        date="2024-01-01"
        videos={mockVideos}
        onVideoClick={mockOnVideoClick}
        theme="sweet"
      />
    );

    // 验证甜筒主题渲染（使用getAllByText因为日期会渲染多次）
    const sweetDateElements = screen.getAllByText("2024-01-01");
    expect(sweetDateElements.length).toBeGreaterThan(0);
  });

  afterEach(() => {
    cleanup();
  });
});

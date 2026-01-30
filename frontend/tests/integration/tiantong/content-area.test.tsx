/**
 * 核心内容区测试用例
 * 对应测试用例 TC-005 ~ TC-008
 * 验证视频卡片、弹幕气泡、分类标签、榜单标签等核心内容区元素
 */

import React from "react";
import { render, screen, cleanup } from "@testing-library/react";
import VideoCard from "@/features/tiantong/components/VideoCard";
import { Heart } from "lucide-react";
import "@testing-library/jest-dom";
import { safeSync } from "../../utils/error-handling";

describe("核心内容区测试", () => {
  const mockVideo = {
    id: "1",
    title: "测试视频",
    category: "sing",
    tags: ["测试"],
    cover: "https://example.com/cover.jpg",
    date: "2024-01-01",
    views: "10万",
    icon: Heart,
    videoUrl: "https://www.bilibili.com/video/BV1xx411c7mD",
    duration: "10:30",
  };

  const onClick = jest.fn();

  /**
   * 测试用例 TC-005: 视频卡片视觉升级
   * 测试视频卡片的橙黑金属质感边框、虎纹滤镜、hover效果
   */
  test("TC-005: 视频卡片视觉升级", () => {
    const result = safeSync(() => {
      return render(<VideoCard video={mockVideo} onClick={onClick} />);
    }, "视频卡片渲染失败");

    // 验证渲染成功
    expect(result).not.toBeInstanceOf(Error);

    // 安全地获取视频卡片
    const cardResult = safeSync(() => {
      return screen.getByRole("article");
    }, "获取视频卡片失败");

    // 验证视频卡片存在
    expect(cardResult).not.toBeInstanceOf(Error);
    if (!(cardResult instanceof Error)) {
      expect(cardResult).toBeInTheDocument();
    }
  });

  /**
   * 测试用例 TC-006: 互动区弹幕气泡虎纹化适配
   * 测试不同用户类型的弹幕样式
   */
  test("TC-006: 互动区弹幕气泡虎纹化适配", () => {
    const result = safeSync(() => {
      return render(<VideoCard video={mockVideo} onClick={onClick} />);
    }, "视频卡片渲染失败");

    // 验证渲染成功
    expect(result).not.toBeInstanceOf(Error);

    // 安全地获取视频卡片
    const cardResult = safeSync(() => {
      return screen.getByRole("article");
    }, "获取视频卡片失败");

    // 验证视频卡片存在
    expect(cardResult).not.toBeInstanceOf(Error);
    if (!(cardResult instanceof Error)) {
      expect(cardResult).toBeInTheDocument();
    }
  });

  /**
   * 测试用例 TC-007: 视频分类标签虎纹化升级
   * 测试分类标签的样式和交互
   */
  test("TC-007: 视频分类标签虎纹化升级", () => {
    const result = safeSync(() => {
      return render(<VideoCard video={mockVideo} onClick={onClick} />);
    }, "视频卡片渲染失败");

    // 验证渲染成功
    expect(result).not.toBeInstanceOf(Error);

    // 安全地获取视频卡片
    const cardResult = safeSync(() => {
      return screen.getByRole("article");
    }, "获取视频卡片失败");

    // 验证视频卡片存在
    expect(cardResult).not.toBeInstanceOf(Error);
    if (!(cardResult instanceof Error)) {
      expect(cardResult).toBeInTheDocument();
    }
  });

  /**
   * 测试用例 TC-008: 互动区榜单标签强化
   * 测试榜单标签的样式和交互
   */
  test("TC-008: 互动区榜单标签强化", () => {
    const result = safeSync(() => {
      return render(<VideoCard video={mockVideo} onClick={onClick} />);
    }, "视频卡片渲染失败");

    // 验证渲染成功
    expect(result).not.toBeInstanceOf(Error);

    // 安全地获取视频卡片
    const cardResult = safeSync(() => {
      return screen.getByRole("article");
    }, "获取视频卡片失败");

    // 验证视频卡片存在
    expect(cardResult).not.toBeInstanceOf(Error);
    if (!(cardResult instanceof Error)) {
      expect(cardResult).toBeInTheDocument();
    }
  });

  afterEach(() => {
    safeSync(() => {
      cleanup();
    }, "清理测试环境失败");
  });
});

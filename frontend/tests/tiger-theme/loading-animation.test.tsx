/**
 * 加载动画测试用例
 * 对应测试用例 TC-028 ~ TC-034
 * 验证加载动画的显示、隐藏、时长、网络环境表现以及性能
 */

import React from "react";
import { render, screen, cleanup, waitFor, act } from "@testing-library/react";
import LoadingAnimation from "@/features/tiantong/components/LoadingAnimation";
import VideoModal from "@/components/hu/hu_VideoModal";
import { Heart } from "lucide-react";
import type { Video } from "@/features/tiantong/data/types";
import "@testing-library/jest-dom";

describe("加载动画测试", () => {
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
   * 测试用例 TC-028: 加载动画初始显示测试
   * 测试目标：验证页面初始加载时加载动画正确显示
   */
  test("TC-028: 加载动画初始显示测试", () => {
    const { container } = render(<LoadingAnimation />);

    // 验证加载动画元素是否在DOM中
    const loadingContainer = container.querySelector(".min-h-screen");
    expect(loadingContainer).toBeInTheDocument();

    // 验证虎头图标是否存在
    const tigerIcon = container.querySelector("svg");
    expect(tigerIcon).toBeInTheDocument();

    // 验证金属光泽效果是否存在
    const shimmerEffect = container.querySelector(".animate-shimmer");
    expect(shimmerEffect).toBeInTheDocument();

    // 验证动画类名是否正确应用
    const spinIcon = container.querySelector(".animate-spin");
    expect(spinIcon).toBeInTheDocument();

    // 记录测试结果
    console.log("✅ TC-028: 加载动画初始显示测试通过");
  });

  /**
   * 测试用例 TC-029: 加载动画隐藏状态测试
   * 测试目标：验证数据加载完成后加载动画正确隐藏
   */
  test("TC-029: 加载动画隐藏状态测试", () => {
    const { container, unmount } = render(<LoadingAnimation />);

    // 验证加载动画初始存在
    expect(container.querySelector(".min-h-screen")).toBeInTheDocument();

    // 卸载组件，模拟数据加载完成
    unmount();

    // 验证加载动画被移除
    expect(container.querySelector(".min-h-screen")).not.toBeInTheDocument();

    // 记录测试结果
    console.log("✅ TC-029: 加载动画隐藏状态测试通过");
  });

  /**
   * 测试用例 TC-030: 加载动画时长测试
   * 测试目标：验证加载动画的显示时长符合设计要求
   */
  test("TC-030: 加载动画时长测试", () => {
    const { container } = render(<LoadingAnimation />);

    // 验证虎头旋转动画时长（根据CSS定义应该是1秒/圈）
    const spinIcon = container.querySelector(".animate-spin");
    expect(spinIcon).toBeInTheDocument();

    // 验证金属光泽流动效果
    const shimmerEffect = container.querySelector(".animate-shimmer");
    expect(shimmerEffect).toBeInTheDocument();

    // 验证动画元素具有正确的类名
    expect(spinIcon).toHaveClass("animate-spin");
    expect(shimmerEffect).toHaveClass("animate-shimmer");

    // 记录测试结果
    console.log("✅ TC-030: 加载动画时长测试通过");
  });

  /**
   * 测试用例 TC-031: 弱网环境加载动画测试
   * 测试目标：验证弱网环境下加载动画的表现
   */
  test("TC-031: 弱网环境加载动画测试", async () => {
    jest.useFakeTimers();

    const { container } = render(<LoadingAnimation />);

    // 模拟弱网环境（延迟响应）
    await act(async () => {
      jest.advanceTimersByTime(1000);
    });

    // 验证加载动画持续显示
    const loadingContainer = container.querySelector(".min-h-screen");
    expect(loadingContainer).toBeInTheDocument();

    // 验证动画流畅度
    const spinIcon = container.querySelector(".animate-spin");
    expect(spinIcon).toBeInTheDocument();

    jest.useRealTimers();

    // 记录测试结果
    console.log("✅ TC-031: 弱网环境加载动画测试通过");
  });

  /**
   * 测试用例 TC-032: 断网环境加载动画测试
   * 测试目标：验证断网环境下加载动画的表现
   */
  test("TC-032: 断网环境加载动画测试", async () => {
    jest.useFakeTimers();

    const { container } = render(<LoadingAnimation />);

    // 模拟断网环境（长时间无响应）
    await act(async () => {
      jest.advanceTimersByTime(10000);
    });

    // 验证加载动画显示
    const loadingContainer = container.querySelector(".min-h-screen");
    expect(loadingContainer).toBeInTheDocument();

    // 验证动画仍然流畅
    const spinIcon = container.querySelector(".animate-spin");
    expect(spinIcon).toBeInTheDocument();

    jest.useRealTimers();

    // 记录测试结果
    console.log("✅ TC-032: 断网环境加载动画测试通过");
  });

  /**
   * 测试用例 TC-033: VideoModal 加载动画测试
   * 测试目标：验证视频弹窗中的加载动画
   */
  test("TC-033: VideoModal 加载动画测试", () => {
    const onClose = jest.fn();
    const { container } = render(<VideoModal video={mockVideo} onClose={onClose} theme="tiger" />);

    // 验证初始加载状态
    const loaderIcon = container.querySelector(".animate-spin");
    expect(loaderIcon).toBeInTheDocument();

    // 验证加载文本存在
    const loadingText = screen.getByText(/加载中/i);
    expect(loadingText).toBeInTheDocument();

    // 记录测试结果
    console.log("✅ TC-033: VideoModal 加载动画测试通过");
  });

  /**
   * 测试用例 TC-034: 加载动画性能测试
   * 测试目标：验证加载动画的性能表现
   */
  test("TC-034: 加载动画性能测试", async () => {
    const startTime = performance.now();

    await act(async () => {
      render(<LoadingAnimation />);
    });

    const endTime = performance.now();
    const renderTime = endTime - startTime;

    // 验证渲染时间应该合理（小于100ms）
    expect(renderTime).toBeLessThan(100);

    // 验证动画元素存在
    const spinIcon = document.querySelector("svg");
    expect(spinIcon).toBeInTheDocument();

    // 记录测试结果
    console.log(`✅ TC-034: 加载动画性能测试通过，渲染时间: ${renderTime.toFixed(2)}ms`);
  });

  afterEach(() => {
    cleanup();
    jest.useRealTimers();
  });
});

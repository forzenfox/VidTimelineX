import React from "react";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import { LoadingAnimation } from "@/features/yuxiaoc/components/LoadingAnimation";
import "@testing-library/jest-dom";

// Mock timer for progress animation
jest.useFakeTimers();

describe("LoadingAnimation组件测试", () => {
  afterEach(() => {
    jest.clearAllTimers();
  });

  /**
   * 测试用例 TC-001: 组件渲染测试
   * 测试目标：验证LoadingAnimation组件能够正确渲染
   */
  test("TC-001: 组件渲染测试", () => {
    render(<LoadingAnimation onComplete={() => {}} />);

    const loadingContainer = screen.getByTestId("loading-animation");
    expect(loadingContainer).toBeInTheDocument();
  });

  /**
   * 测试用例 TC-002: 血怒进度条渲染测试
   * 测试目标：验证血怒进度条正确显示
   */
  test("TC-002: 血怒进度条渲染测试", () => {
    render(<LoadingAnimation onComplete={() => {}} />);

    const progressBar = screen.getByTestId("blood-rage-progress");
    expect(progressBar).toBeInTheDocument();
  });

  /**
   * 测试用例 TC-003: 主题选择按钮渲染测试
   * 测试目标：验证血怒模式和混躺模式按钮在进度完成后正确显示
   */
  test("TC-003: 主题选择按钮渲染测试", async () => {
    render(<LoadingAnimation onComplete={() => {}} />);

    // Fast-forward timers to complete progress
    act(() => {
      jest.advanceTimersByTime(3000);
    });

    await waitFor(() => {
      const bloodButton = screen.getByTestId("theme-blood");
      const mixButton = screen.getByTestId("theme-mix");

      expect(bloodButton).toBeInTheDocument();
      expect(mixButton).toBeInTheDocument();
    });
  });

  /**
   * 测试用例 TC-004: 主题选择功能测试
   * 测试目标：验证点击主题按钮后触发onComplete回调
   */
  test("TC-004: 主题选择功能测试", async () => {
    const mockOnComplete = jest.fn();
    render(<LoadingAnimation onComplete={mockOnComplete} />);

    // Fast-forward timers to complete progress
    act(() => {
      jest.advanceTimersByTime(3000);
    });

    await waitFor(() => {
      const bloodButton = screen.getByTestId("theme-blood");
      fireEvent.click(bloodButton);
    });

    expect(mockOnComplete).toHaveBeenCalledWith("blood");
  });

  /**
   * 测试用例 TC-005: 混躺主题选择测试
   * 测试目标：验证混躺模式按钮正常工作
   */
  test("TC-005: 混躺主题选择测试", async () => {
    const mockOnComplete = jest.fn();
    render(<LoadingAnimation onComplete={mockOnComplete} />);

    // Fast-forward timers to complete progress
    act(() => {
      jest.advanceTimersByTime(3000);
    });

    await waitFor(() => {
      const mixButton = screen.getByTestId("theme-mix");
      fireEvent.click(mixButton);
    });

    expect(mockOnComplete).toHaveBeenCalledWith("mix");
  });

  /**
   * 测试用例 TC-006: 血怒值文字显示测试
   * 测试目标：验证血怒值标签正确显示
   */
  test("TC-006: 血怒值文字显示测试", () => {
    render(<LoadingAnimation onComplete={() => {}} />);

    expect(screen.getByText("血怒值")).toBeInTheDocument();
  });

  /**
   * 测试用例 TC-007: C皇标题显示测试
   * 测试目标：验证C皇标题正确显示
   */
  test("TC-007: C皇标题显示测试", () => {
    render(<LoadingAnimation onComplete={() => {}} />);

    expect(screen.getByText("C皇驾到")).toBeInTheDocument();
  });
});

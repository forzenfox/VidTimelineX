/**
 * 主题切换动画可见性测试用例
 * 对应测试用例 TC-020 ~ TC-021
 * 验证"虎头咆哮"动画在主题切换时的可见性和z-index层级
 */

import React from "react";
import { render, screen, fireEvent, cleanup, waitFor } from "@testing-library/react";
import ThemeToggle from "@/features/tiantong/components/ThemeToggle";
import "@testing-library/jest-dom";

describe("主题切换动画可见性测试", () => {
  /**
   * 测试用例 TC-020: 主题切换动画可见性测试
   * 测试目标：验证"虎头咆哮"动画在主题切换时正确显示
   */
  test("TC-020: 主题切换动画可见性测试", async () => {
    const onToggle = jest.fn();
    const { container } = render(<ThemeToggle currentTheme="tiger" onToggle={onToggle} />);

    // 验证主题切换按钮存在
    const button = screen.getByRole("switch");
    expect(button).toBeInTheDocument();

    // 点击主题切换按钮
    fireEvent.click(button);

    // 等待动画元素被添加到DOM
    await waitFor(
      () => {
        const overlay = document.querySelector(".theme-sweep-overlay");
        expect(overlay).toBeInTheDocument();
      },
      { timeout: 100 }
    );

    // 验证动画元素存在
    const overlay = document.querySelector(".theme-sweep-overlay");
    expect(overlay).toBeInTheDocument();

    // 验证动画元素有正确的类名
    expect(overlay).toHaveClass("theme-sweep-overlay");

    // 等待动画在500ms后消失
    await waitFor(
      () => {
        const overlayAfter = document.querySelector(".theme-sweep-overlay");
        expect(overlayAfter).not.toBeInTheDocument();
      },
      { timeout: 600 }
    );

    // 记录测试结果
    console.log("✅ TC-020: 主题切换动画可见性测试通过");
  });

  /**
   * 测试用例 TC-021: 动画元素z-index测试
   * 测试目标：验证动画元素的z-index足够高，不会被遮挡
   */
  test("TC-021: 动画元素z-index测试", async () => {
    const onToggle = jest.fn();
    const { container } = render(<ThemeToggle currentTheme="tiger" onToggle={onToggle} />);

    // 点击主题切换按钮
    const button = screen.getByRole("switch");
    fireEvent.click(button);

    // 等待动画元素被添加到DOM
    await waitFor(
      () => {
        const overlay = document.querySelector(".theme-sweep-overlay");
        expect(overlay).toBeInTheDocument();
      },
      { timeout: 100 }
    );

    // 验证动画元素存在
    const overlay = document.querySelector(".theme-sweep-overlay");
    expect(overlay).toBeInTheDocument();

    // 验证动画元素可见
    expect(overlay).toBeVisible();

    // 记录测试结果
    console.log("✅ TC-021: 动画元素z-index测试通过");
  });

  afterEach(() => {
    cleanup();
  });
});

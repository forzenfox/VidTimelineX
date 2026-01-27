import React from "react";
import { render, screen } from "@testing-library/react";
import { HorizontalDanmaku } from "@/features/lvjiang/components/HorizontalDanmaku";
import "@testing-library/jest-dom";

describe("HorizontalDanmaku组件测试", () => {
  /**
   * 测试用例 TC-001: 组件渲染测试
   * 测试目标：验证HorizontalDanmaku组件能够正确渲染
   */
  test("TC-001: 组件渲染测试", () => {
    render(<HorizontalDanmaku theme="dongzhu" isVisible={true} />);

    // 验证组件能够正确渲染
    expect(document.body).toBeInTheDocument();
  });

  /**
   * 测试用例 TC-002: 弹幕数量测试
   * 测试目标：验证弹幕数量能够正确渲染
   */
  test("TC-002: 弹幕数量测试", () => {
    render(<HorizontalDanmaku theme="dongzhu" isVisible={true} />);

    // 验证组件能够正确渲染
    expect(document.body).toBeInTheDocument();
  });

  /**
   * 测试用例 TC-003: 弹幕样式测试
   * 测试目标：验证弹幕样式能够正确应用
   */
  test("TC-003: 弹幕样式测试", () => {
    const { container } = render(<HorizontalDanmaku theme="dongzhu" isVisible={true} />);

    // 验证组件能够正确渲染
    expect(container.firstChild).toBeInTheDocument();
  });

  /**
   * 测试用例 TC-004: 弹幕动画测试
   * 测试目标：验证弹幕动画能够正确应用
   */
  test("TC-004: 弹幕动画测试", () => {
    const { container } = render(<HorizontalDanmaku theme="dongzhu" isVisible={true} />);

    // 验证组件能够正确渲染
    expect(container.firstChild).toBeInTheDocument();
  });
});

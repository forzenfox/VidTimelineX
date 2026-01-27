import React from "react";
import { render, screen } from "@testing-library/react";
import LoadingAnimation from "@/features/tiantong/components/LoadingAnimation";
import "@testing-library/jest-dom";

describe("LoadingAnimation组件测试", () => {
  /**
   * 测试用例 TC-001: 组件渲染测试
   * 测试目标：验证LoadingAnimation组件能够正确渲染
   */
  test("TC-001: 组件渲染测试", () => {
    render(<LoadingAnimation />);

    const loadingContainer = screen.getByTestId("loading-animation");
    expect(loadingContainer).toBeInTheDocument();
  });

  /**
   * 测试用例 TC-002: 组件结构测试
   * 测试目标：验证LoadingAnimation组件的结构
   */
  test("TC-002: 组件结构测试", () => {
    const { container } = render(<LoadingAnimation />);

    const loadingContainer = container.querySelector(".relative");
    expect(loadingContainer).toBeInTheDocument();
  });

  /**
   * 测试用例 TC-003: 动画元素测试
   * 测试目标：验证LoadingAnimation组件的动画元素
   */
  test("TC-003: 动画元素测试", () => {
    const { container } = render(<LoadingAnimation />);

    const svgElement = container.querySelector("svg");
    expect(svgElement).toBeInTheDocument();
  });
});

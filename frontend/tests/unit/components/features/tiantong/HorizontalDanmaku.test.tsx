import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import { HorizontalDanmaku } from "@/features/tiantong/components/HorizontalDanmaku";

describe("HorizontalDanmaku 组件测试", () => {
  test("TC-001: 组件渲染测试（tiger主题）", () => {
    render(<HorizontalDanmaku theme="tiger" />);
    expect(document.body).toBeInTheDocument();
  });

  test("TC-002: 组件渲染测试（sweet主题）", () => {
    render(<HorizontalDanmaku theme="sweet" />);
    expect(document.body).toBeInTheDocument();
  });

  test("TC-003: 容器元素测试", () => {
    const { container } = render(<HorizontalDanmaku theme="tiger" />);
    expect(container.firstChild).toBeInTheDocument();
  });
});

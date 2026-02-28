import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import { HorizontalDanmaku } from "@/features/tiantong/components/HorizontalDanmaku";

// Mock TXT file import
jest.mock("@/features/tiantong/data/danmaku.txt?raw", () => {
  return "测试弹幕 1\n测试弹幕 2\n测试弹幕 3\n测试弹幕 4\n测试弹幕 5";
});

describe("HorizontalDanmaku 组件测试", () => {
  test("TC-001: 组件渲染测试（tiger 主题）", () => {
    render(<HorizontalDanmaku theme="tiger" />);
    expect(document.body).toBeInTheDocument();
  });

  test("TC-002: 组件渲染测试（sweet 主题）", () => {
    render(<HorizontalDanmaku theme="sweet" />);
    expect(document.body).toBeInTheDocument();
  });

  test("TC-003: 容器元素测试", () => {
    const { container } = render(<HorizontalDanmaku theme="tiger" />);
    expect(container.firstChild).toBeInTheDocument();
  });
});

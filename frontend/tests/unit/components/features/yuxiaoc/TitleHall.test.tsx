import React from "react";
import { render, screen } from "@testing-library/react";
import { TitleHall } from "@/features/yuxiaoc/components/TitleHall";
import "@testing-library/jest-dom";

describe("TitleHall组件测试", () => {
  /**
   * 测试用例 TC-001: 组件渲染测试
   * 测试目标：验证TitleHall组件能够正确渲染
   */
  test("TC-001: 组件渲染测试", () => {
    render(<TitleHall theme="blood" />);

    expect(screen.getByText("称号殿堂")).toBeInTheDocument();
    expect(screen.getByText("C皇的荣耀称号集合")).toBeInTheDocument();
  });

  /**
   * 测试用例 TC-002: 称号渲染测试
   * 测试目标：验证所有称号正确显示
   */
  test("TC-002: 称号渲染测试", () => {
    render(<TitleHall theme="blood" />);

    // 检查核心称号
    expect(screen.getByText("C皇")).toBeInTheDocument();
    expect(screen.getByText("鳃皇")).toBeInTheDocument();
    expect(screen.getByText("鱼酱")).toBeInTheDocument();
    expect(screen.getByText("反驴复鱼")).toBeInTheDocument();
    expect(screen.getByText("solo king")).toBeInTheDocument();
    expect(screen.getByText("峡谷第一混")).toBeInTheDocument();
    expect(screen.getByText("峡谷鬼见愁")).toBeInTheDocument();
    expect(screen.getByText("塔下战神")).toBeInTheDocument();
  });

  /**
   * 测试用例 TC-003: 称号描述渲染测试
   * 测试目标：验证称号描述正确显示
   */
  test("TC-003: 称号描述渲染测试", () => {
    render(<TitleHall theme="blood" />);

    expect(screen.getByText("核心尊称")).toBeInTheDocument();
    expect(screen.getByText("混学宗师")).toBeInTheDocument();
    expect(screen.getByText("守塔专家")).toBeInTheDocument();
  });
});

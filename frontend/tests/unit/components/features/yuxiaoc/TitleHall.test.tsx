import React from "react";
import { render, screen } from "@testing-library/react";
import { TitleHall } from "@/features/yuxiaoc/components/TitleHall";
import "@testing-library/jest-dom";

describe("TitleHall组件测试", () => {
  /**
   * 测试用例 TC-001: 血怒模式组件渲染测试
   * 测试目标：验证TitleHall组件在血怒模式下能够正确渲染
   */
  test("TC-001: 血怒模式组件渲染测试", () => {
    render(<TitleHall theme="blood" />);

    expect(screen.getByText("称号殿堂")).toBeInTheDocument();
    expect(screen.getByText("血怒荣耀，战斗称号")).toBeInTheDocument();
  });

  /**
   * 测试用例 TC-001b: 混躺模式组件渲染测试
   * 测试目标：验证TitleHall组件在混躺模式下能够正确渲染
   */
  test("TC-001b: 混躺模式组件渲染测试", () => {
    render(<TitleHall theme="mix" />);

    expect(screen.getByText("称号殿堂")).toBeInTheDocument();
    expect(screen.getByText("C皇的荣耀称号集合")).toBeInTheDocument();
  });

  /**
   * 测试用例 TC-002: 血怒模式称号渲染测试
   * 测试目标：验证血怒模式下的称号正确显示
   */
  test("TC-002: 血怒模式称号渲染测试", () => {
    render(<TitleHall theme="blood" />);

    // 检查血怒模式核心称号
    expect(screen.getByText("C皇")).toBeInTheDocument();
    expect(screen.getByText("血怒战神")).toBeInTheDocument();
    expect(screen.getByText("无情铁手")).toBeInTheDocument();
    expect(screen.getByText("致残打击")).toBeInTheDocument();
    expect(screen.getByText("反驴复鱼")).toBeInTheDocument();
    expect(screen.getByText("solo king")).toBeInTheDocument();
    expect(screen.getByText("峡谷鬼见愁")).toBeInTheDocument();
    expect(screen.getByText("塔下战神")).toBeInTheDocument();
  });

  /**
   * 测试用例 TC-002b: 混躺模式称号渲染测试
   * 测试目标：验证混躺模式下的称号正确显示
   */
  test("TC-002b: 混躺模式称号渲染测试", () => {
    render(<TitleHall theme="mix" />);

    // 检查混躺模式核心称号
    expect(screen.getByText("C皇")).toBeInTheDocument();
    expect(screen.getByText("峡谷第一混")).toBeInTheDocument();
    expect(screen.getByText("塔之子")).toBeInTheDocument();
    expect(screen.getByText("鱼酱")).toBeInTheDocument();
    expect(screen.getByText("鳃皇")).toBeInTheDocument();
    expect(screen.getByText("鱼人")).toBeInTheDocument();
    expect(screen.getByText("峡谷养爹人")).toBeInTheDocument();
    expect(screen.getByText("下饭大师")).toBeInTheDocument();
  });

  /**
   * 测试用例 TC-003: 血怒模式称号描述渲染测试
   * 测试目标：验证血怒模式下的称号描述正确显示
   */
  test("TC-003: 血怒模式称号描述渲染测试", () => {
    render(<TitleHall theme="blood" />);

    expect(screen.getByText("核心尊称")).toBeInTheDocument();
    expect(screen.getByText("血怒模式专属")).toBeInTheDocument();
    expect(screen.getByText("技能专精")).toBeInTheDocument();
    expect(screen.getByText("精准收割")).toBeInTheDocument();
  });

  /**
   * 测试用例 TC-003b: 混躺模式称号描述渲染测试
   * 测试目标：验证混躺模式下的称号描述正确显示
   */
  test("TC-003b: 混躺模式称号描述渲染测试", () => {
    render(<TitleHall theme="mix" />);

    expect(screen.getByText("核心尊称")).toBeInTheDocument();
    expect(screen.getByText("混学宗师")).toBeInTheDocument();
    expect(screen.getByText("守塔专家")).toBeInTheDocument();
    expect(screen.getByText("鱼吧文化")).toBeInTheDocument();
  });
});

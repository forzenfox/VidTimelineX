import React from "react";
import { render, screen } from "@testing-library/react";
import { TitleHall } from "@/features/yuxiaoc/components/TitleHall";
import "@testing-library/jest-dom";

describe("TitleHall组件测试", () => {
  test("TC-001: 血怒模式组件渲染测试", () => {
    render(<TitleHall theme="blood" />);

    expect(screen.getByText("称号殿堂")).toBeInTheDocument();
    expect(screen.getByText("血怒荣耀，战斗称号")).toBeInTheDocument();
  });

  test("TC-001b: 混躺模式组件渲染测试", () => {
    render(<TitleHall theme="mix" />);

    expect(screen.getByText("称号殿堂")).toBeInTheDocument();
    expect(screen.getByText("C皇的荣耀称号集合")).toBeInTheDocument();
  });

  test("TC-002: 血怒模式称号渲染测试", () => {
    render(<TitleHall theme="blood" />);

    expect(screen.getByText("C皇")).toBeInTheDocument();
    expect(screen.getByText("魔丸")).toBeInTheDocument();
    expect(screen.getByText("血怒战神")).toBeInTheDocument();
    expect(screen.getByText("反驴复鱼")).toBeInTheDocument();
    expect(screen.getByText("solo king")).toBeInTheDocument();
    expect(screen.getByText("诺手人柱力")).toBeInTheDocument();
  });

  test("TC-002b: 混躺模式称号渲染测试", () => {
    render(<TitleHall theme="mix" />);

    expect(screen.getByText("鳃哥")).toBeInTheDocument();
    expect(screen.getByText("魔丸")).toBeInTheDocument();
    expect(screen.getByText("愚僵穿")).toBeInTheDocument();
    expect(screen.getByText("塔之子")).toBeInTheDocument();
    expect(screen.getByText("下饭大师")).toBeInTheDocument();
    expect(screen.getByText("峡谷鬼见愁")).toBeInTheDocument();
    expect(screen.getByText("躺赢专家")).toBeInTheDocument();
    expect(screen.getByText("绿豆战神")).toBeInTheDocument();
  });

  test("TC-003: 血怒模式称号描述渲染测试", () => {
    render(<TitleHall theme="blood" />);

    expect(screen.getAllByText("核心尊称")[0]).toBeInTheDocument();
    expect(screen.getByText("历史使命")).toBeInTheDocument();
    expect(screen.getByText("单挑之王")).toBeInTheDocument();
    expect(screen.getByText("英雄专精")).toBeInTheDocument();
  });

  test("TC-003b: 混躺模式称号描述渲染测试", () => {
    render(<TitleHall theme="mix" />);

    expect(screen.getAllByText("核心尊称")[0]).toBeInTheDocument();
    expect(screen.getByText("守塔专家")).toBeInTheDocument();
    expect(screen.getAllByText("食堂主厨")[0]).toBeInTheDocument();
    expect(screen.getByText("躺学巅峰")).toBeInTheDocument();
    expect(screen.getByText("混学宗师")).toBeInTheDocument();
  });
});

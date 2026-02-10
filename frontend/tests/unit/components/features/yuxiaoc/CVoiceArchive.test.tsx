import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { CVoiceArchive } from "@/features/yuxiaoc/components/CVoiceArchive";
import "@testing-library/jest-dom";

// 模拟voices.json数据
jest.mock("@/features/yuxiaoc/data/voices.json", () => ({
  blood: {
    featured: {
      text: "血怒之下，众生平等；无情铁手，致残打击！",
      author: "C皇 · 血怒战神",
      category: "blood",
    },
    list: [
      { id: "b1", text: "无情铁手！", category: "skill" },
      { id: "b2", text: "致残打击！", category: "skill" },
      { id: "b3", text: "大杀四方！", category: "skill" },
      { id: "b4", text: "诺克萨斯断头台！", category: "skill" },
      { id: "b5", text: "血怒已触发！", category: "blood" },
      { id: "b6", text: "这波我必C！", category: "classic" },
    ],
  },
  mix: {
    featured: {
      text: "混与躺轮回不止，这把混，下把躺",
      author: "C皇 · 峡谷哲学家",
      category: "philosophy",
    },
    list: [
      { id: "m1", text: "这把混，下把躺", category: "philosophy" },
      { id: "m2", text: "吃饭要紧", category: "philosophy" },
      { id: "m3", text: "塔之子", category: "classic" },
      { id: "m4", text: "鱼酱救我！", category: "classic" },
      { id: "m5", text: "这波不亏", category: "philosophy" },
      { id: "m6", text: "先混一把", category: "philosophy" },
    ],
  },
}));

describe("CVoiceArchive组件测试", () => {
  /**
   * 测试用例 TC-001: 组件渲染测试
   * 测试目标：验证CVoiceArchive组件能够正确渲染
   */
  test("TC-001: 组件渲染测试", () => {
    render(<CVoiceArchive theme="blood" />);

    expect(screen.getByText("血怒宣言")).toBeInTheDocument();
  });

  /**
   * 测试用例 TC-002: 血怒模式标题测试
   * 测试目标：验证血怒模式下显示正确的标题和描述
   */
  test("TC-002: 血怒模式标题测试", () => {
    render(<CVoiceArchive theme="blood" />);

    expect(screen.getByText("血怒宣言")).toBeInTheDocument();
    expect(screen.getByText("战斗语录，激情澎湃")).toBeInTheDocument();
  });

  /**
   * 测试用例 TC-003: 混躺模式标题测试
   * 测试目标：验证混躺模式下显示正确的标题和描述
   */
  test("TC-003: 混躺模式标题测试", () => {
    render(<CVoiceArchive theme="mix" />);

    expect(screen.getByText("C言C语典藏馆")).toBeInTheDocument();
    expect(screen.getByText("经典语录，永流传")).toBeInTheDocument();
  });

  /**
   * 测试用例 TC-004: 血怒模式特色语录测试
   * 测试目标：验证血怒模式下显示正确的特色语录
   */
  test("TC-004: 血怒模式特色语录测试", () => {
    render(<CVoiceArchive theme="blood" />);

    expect(screen.getByText(/血怒之下，众生平等/)).toBeInTheDocument();
    expect(screen.getByText(/C皇 · 血怒战神/)).toBeInTheDocument();
  });

  /**
   * 测试用例 TC-005: 混躺模式特色语录测试
   * 测试目标：验证混躺模式下显示正确的特色语录
   */
  test("TC-005: 混躺模式特色语录测试", () => {
    render(<CVoiceArchive theme="mix" />);

    expect(screen.getByText(/混与躺轮回不止/)).toBeInTheDocument();
    expect(screen.getByText(/C皇 · 峡谷哲学家/)).toBeInTheDocument();
  });

  /**
   * 测试用例 TC-006: 血怒长廊标签测试
   * 测试目标：验证血怒模式下显示血怒长廊标签
   */
  test("TC-006: 血怒长廊标签测试", () => {
    render(<CVoiceArchive theme="blood" />);

    expect(screen.getByText("血怒长廊")).toBeInTheDocument();
  });

  /**
   * 测试用例 TC-007: 哲学长廊标签测试
   * 测试目标：验证混躺模式下显示哲学长廊标签
   */
  test("TC-007: 哲学长廊标签测试", () => {
    render(<CVoiceArchive theme="mix" />);

    expect(screen.getByText("哲学长廊")).toBeInTheDocument();
  });

  /**
   * 测试用例 TC-008: 血怒模式语录列表测试
   * 测试目标：验证血怒模式下显示正确的语录列表
   */
  test("TC-008: 血怒模式语录列表测试", () => {
    render(<CVoiceArchive theme="blood" />);

    // 验证血怒模式语录显示
    expect(screen.getByText("无情铁手！")).toBeInTheDocument();
    expect(screen.getByText("致残打击！")).toBeInTheDocument();
    expect(screen.getByText("大杀四方！")).toBeInTheDocument();
    expect(screen.getByText("诺克萨斯断头台！")).toBeInTheDocument();
    expect(screen.getByText("血怒已触发！")).toBeInTheDocument();
    expect(screen.getByText("这波我必C！")).toBeInTheDocument();
  });

  /**
   * 测试用例 TC-009: 混躺模式语录列表测试
   * 测试目标：验证混躺模式下显示正确的语录列表
   */
  test("TC-009: 混躺模式语录列表测试", () => {
    render(<CVoiceArchive theme="mix" />);

    // 验证混躺模式语录显示
    expect(screen.getByText("这把混，下把躺")).toBeInTheDocument();
    expect(screen.getByText("吃饭要紧")).toBeInTheDocument();
    expect(screen.getByText("塔之子")).toBeInTheDocument();
    expect(screen.getByText("鱼酱救我！")).toBeInTheDocument();
    expect(screen.getByText("这波不亏")).toBeInTheDocument();
    expect(screen.getByText("先混一把")).toBeInTheDocument();
  });

  /**
   * 测试用例 TC-010: 分类标签显示测试
   * 测试目标：验证语录卡片显示正确的分类标签
   */
  test("TC-010: 分类标签显示测试", () => {
    render(<CVoiceArchive theme="blood" />);

    // 验证分类标签显示
    expect(screen.getAllByText("技能").length).toBeGreaterThan(0);
    expect(screen.getAllByText("血怒").length).toBeGreaterThan(0);
    expect(screen.getAllByText("经典").length).toBeGreaterThan(0);
  });

  /**
   * 测试用例 TC-011: 混躺模式分类标签测试
   * 测试目标：验证混躺模式下显示正确的分类标签
   */
  test("TC-011: 混躺模式分类标签测试", () => {
    render(<CVoiceArchive theme="mix" />);

    // 验证分类标签显示
    expect(screen.getAllByText("哲学").length).toBeGreaterThan(0);
    expect(screen.getAllByText("经典").length).toBeGreaterThan(0);
  });

  /**
   * 测试用例 TC-012: C皇头像显示测试
   * 测试目标：验证特色语录区域显示C皇头像
   */
  test("TC-012: C皇头像显示测试", () => {
    const { container } = render(<CVoiceArchive theme="blood" />);

    // 验证C皇头像存在（通过文字C识别）
    const cAvatar = container.querySelector("div[class*='rounded-full']");
    expect(cAvatar).toBeInTheDocument();
  });

  /**
   * 测试用例 TC-013: 引号装饰测试
   * 测试目标：验证特色语录区域显示引号装饰
   */
  test("TC-013: 引号装饰测试", () => {
    const { container } = render(<CVoiceArchive theme="blood" />);

    // 验证引号图标存在
    const quotes = container.querySelectorAll("svg");
    expect(quotes.length).toBeGreaterThan(0);
  });

  /**
   * 测试用例 TC-014: 语录网格布局测试
   * 测试目标：验证语录以网格形式展示
   */
  test("TC-014: 语录网格布局测试", () => {
    const { container } = render(<CVoiceArchive theme="blood" />);

    // 验证网格容器存在
    const gridContainer = container.querySelector(".grid");
    expect(gridContainer).toBeInTheDocument();
  });

  /**
   * 测试用例 TC-015: 主题切换内容变化测试
   * 测试目标：验证切换主题后语录内容相应变化
   */
  test("TC-015: 主题切换内容变化测试", () => {
    const { rerender } = render(<CVoiceArchive theme="blood" />);

    // 验证血怒内容
    expect(screen.getByText("血怒宣言")).toBeInTheDocument();
    expect(screen.getByText("无情铁手！")).toBeInTheDocument();

    // 切换到混躺模式
    rerender(<CVoiceArchive theme="mix" />);

    // 验证混躺内容
    expect(screen.getByText("C言C语典藏馆")).toBeInTheDocument();
    expect(screen.getByText("这把混，下把躺")).toBeInTheDocument();
    expect(screen.queryByText("无情铁手！")).not.toBeInTheDocument();
  });
});

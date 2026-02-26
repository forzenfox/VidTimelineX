import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { DanmakuTower } from "@/features/yuxiaoc/components/DanmakuTower";
import "@testing-library/jest-dom";

// 模拟danmaku数据 - 简化后的数据结构
jest.mock("@/features/yuxiaoc/data/danmaku.json", () => ({
  bloodDanmaku: ["无情铁手！", "致残打击！"],
  mixDanmaku: ["这把混", "下把躺"],
  commonDanmaku: ["666", "来了来了"],
}));

// 模拟users数据
jest.mock("@/features/yuxiaoc/data/users.json", () => [
  { id: "1", name: "用户1", avatar: "https://example.com/avatar1.png" },
  { id: "2", name: "用户2", avatar: "https://example.com/avatar2.png" },
]);

// 模拟danmakuColors.ts
jest.mock("@/features/yuxiaoc/data/danmakuColors", () => ({
  getDanmakuColor: jest.fn(() => "#E11D48"),
  getCommonDanmakuColor: jest.fn(() => "#6B7280"),
}));

describe("DanmakuTower组件测试", () => {
  test("TC-001: 组件渲染测试", () => {
    render(<DanmakuTower theme="blood" />);

    // 验证侧边栏存在（使用CSS类选择器）
    const sidebar = document.querySelector(".danmaku-sidebar");
    expect(sidebar).toBeInTheDocument();

    // 验证移动端按钮存在
    const mobileButton = document.querySelector(".danmaku-mobile-button");
    expect(mobileButton).toBeInTheDocument();
  });

  test("TC-002: 血怒模式样式测试", () => {
    const { container } = render(<DanmakuTower theme="blood" />);

    const sidebar = container.querySelector(".danmaku-sidebar");
    expect(sidebar).toHaveStyle({
      borderLeft: "3px solid #E11D48",
    });
  });

  test("TC-003: 混躺模式样式测试", () => {
    const { container } = render(<DanmakuTower theme="mix" />);

    const sidebar = container.querySelector(".danmaku-sidebar");
    expect(sidebar).toHaveStyle({
      borderLeft: "3px solid #F59E0B",
    });
  });

  test("TC-004: 弹幕消息渲染测试", async () => {
    render(<DanmakuTower theme="blood" />);

    // 等待初始弹幕加载
    await waitFor(() => {
      expect(screen.getByText("弹幕聊天室")).toBeInTheDocument();
    });
  });

  test("TC-005: 用户头像显示测试", () => {
    render(<DanmakuTower theme="blood" />);

    const avatars = document.querySelectorAll("img");
    expect(avatars.length).toBeGreaterThan(0);
  });

  test("TC-007: 侧边栏定位测试", () => {
    const { container } = render(<DanmakuTower theme="blood" />);

    const sidebar = container.querySelector(".danmaku-sidebar");
    expect(sidebar).toHaveStyle({
      position: "fixed",
      right: "0",
      top: "64px",
      width: "320px",
    });
  });

  test("TC-008: 移动端按钮存在测试", () => {
    const { container } = render(<DanmakuTower theme="blood" />);

    const mobileButton = container.querySelector(".danmaku-mobile-button");
    expect(mobileButton).toBeInTheDocument();
    expect(mobileButton).toHaveAttribute("aria-label", "打开弹幕");
  });

  test("TC-011: 弹幕区域底部标识测试 - 血怒模式", () => {
    render(<DanmakuTower theme="blood" />);

    expect(screen.getByText("🔥 血怒弹幕区 🔥")).toBeInTheDocument();
  });

  test("TC-012: 弹幕区域底部标识测试 - 混躺模式", () => {
    render(<DanmakuTower theme="mix" />);

    expect(screen.getByText("😴 混躺弹幕区 😴")).toBeInTheDocument();
  });

  test("TC-014: 移动端抽屉按钮显示测试", () => {
    render(<DanmakuTower theme="blood" />);

    expect(screen.getByLabelText("打开弹幕")).toBeInTheDocument();
  });
});

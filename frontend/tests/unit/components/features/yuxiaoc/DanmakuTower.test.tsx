import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { DanmakuTower } from "@/features/yuxiaoc/components/DanmakuTower";
import "@testing-library/jest-dom";

// 模拟danmaku.json数据
jest.mock("@/features/yuxiaoc/data/danmaku.json", () => ({
  users: [
    { id: "user1", name: "测试用户1", avatar: "https://example.com/avatar1.png" },
    { id: "user2", name: "测试用户2", avatar: "https://example.com/avatar2.png" },
    { id: "user3", name: "测试用户3", avatar: "https://example.com/avatar3.png" },
  ],
  blood: {
    tower: [
      { text: "血怒弹幕1", color: "#E11D48", size: "medium" },
      { text: "血怒弹幕2", color: "#DC2626", size: "large" },
      { text: "血怒弹幕3", color: "#F87171", size: "small" },
    ],
  },
  mix: {
    tower: [
      { text: "混躺弹幕1", color: "#F59E0B", size: "medium" },
      { text: "混躺弹幕2", color: "#3B82F6", size: "large" },
      { text: "混躺弹幕3", color: "#10B981", size: "small" },
    ],
  },
}));

describe("DanmakuTower组件测试", () => {
  /**
   * 测试用例 TC-001: 组件渲染测试
   * 测试目标：验证DanmakuTower组件能够正确渲染
   */
  test("TC-001: 组件渲染测试", async () => {
    const { container } = render(<DanmakuTower theme="blood" />);

    // 等待组件挂载和初始弹幕加载
    await waitFor(() => {
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  /**
   * 测试用例 TC-002: 右侧固定定位测试
   * 测试目标：验证弹幕天梯固定在页面右侧
   */
  test("TC-002: 右侧固定定位测试", async () => {
    const { container } = render(<DanmakuTower theme="blood" />);

    await waitFor(() => {
      expect(container.firstChild).toBeInTheDocument();
    });

    // 验证容器是固定定位在右侧
    const danmakuContainer = container.firstChild as HTMLElement;
    expect(danmakuContainer).toHaveClass("fixed", "right-0");
  });

  /**
   * 测试用例 TC-003: 聊天室标题显示测试
   * 测试目标：验证聊天室标题正确显示
   */
  test("TC-003: 聊天室标题显示测试", async () => {
    render(<DanmakuTower theme="blood" />);

    await waitFor(() => {
      expect(screen.getByText("弹幕聊天室")).toBeInTheDocument();
    });
  });

  /**
   * 测试用例 TC-004: 血怒主题样式测试
   * 测试目标：验证血怒主题下正确应用样式
   */
  test("TC-004: 血怒主题样式测试", async () => {
    const { container } = render(<DanmakuTower theme="blood" />);

    await waitFor(() => {
      expect(container.firstChild).toBeInTheDocument();
    });

    const danmakuContainer = container.firstChild as HTMLElement;
    // 验证血怒主题的边框颜色
    expect(danmakuContainer).toHaveStyle({
      borderLeft: "3px solid #E11D48",
    });
  });

  /**
   * 测试用例 TC-005: 混躺主题样式测试
   * 测试目标：验证混躺主题下正确应用样式
   */
  test("TC-005: 混躺主题样式测试", async () => {
    const { container } = render(<DanmakuTower theme="mix" />);

    await waitFor(() => {
      expect(container.firstChild).toBeInTheDocument();
    });

    const danmakuContainer = container.firstChild as HTMLElement;
    // 验证混躺主题的边框颜色
    expect(danmakuContainer).toHaveStyle({
      borderLeft: "3px solid #F59E0B",
    });
  });

  /**
   * 测试用例 TC-006: 弹幕消息渲染测试
   * 测试目标：验证弹幕消息能够正确渲染
   */
  test("TC-006: 弹幕消息渲染测试", async () => {
    render(<DanmakuTower theme="blood" />);

    // 等待初始弹幕加载
    await waitFor(() => {
      expect(screen.getByText("弹幕聊天室")).toBeInTheDocument();
    });

    // 验证至少有一条弹幕显示
    await waitFor(() => {
      const danmakuMessages = screen.getAllByText(/血怒弹幕/);
      expect(danmakuMessages.length).toBeGreaterThan(0);
    });
  });

  /**
   * 测试用例 TC-007: 用户头像显示测试
   * 测试目标：验证弹幕消息显示用户头像
   */
  test("TC-007: 用户头像显示测试", async () => {
    const { container } = render(<DanmakuTower theme="blood" />);

    await waitFor(() => {
      expect(container.firstChild).toBeInTheDocument();
    });

    // 验证头像图片存在
    const avatars = container.querySelectorAll("img");
    expect(avatars.length).toBeGreaterThan(0);
  });

  /**
   * 测试用例 TC-008: 实时状态标识测试
   * 测试目标：验证实时状态标识显示
   */
  test("TC-008: 实时状态标识测试", async () => {
    render(<DanmakuTower theme="blood" />);

    await waitFor(() => {
      expect(screen.getByText("LIVE")).toBeInTheDocument();
    });
  });
});

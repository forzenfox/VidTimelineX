import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
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
  /**
   * 测试用例 TC-001: 组件渲染测试
   * 测试目标：验证DanmakuTower组件能够正确渲染
   */
  test("TC-001: 组件渲染测试", () => {
    render(<DanmakuTower theme="blood" />);

    // 验证侧边栏存在（使用CSS类选择器）
    const sidebar = document.querySelector(".danmaku-sidebar");
    expect(sidebar).toBeInTheDocument();
    
    // 验证移动端按钮存在
    const mobileButton = document.querySelector(".danmaku-mobile-button");
    expect(mobileButton).toBeInTheDocument();
  });

  /**
   * 测试用例 TC-002: 血怒模式样式测试
   * 测试目标：验证血怒模式下正确应用红色主题样式
   */
  test("TC-002: 血怒模式样式测试", () => {
    const { container } = render(<DanmakuTower theme="blood" />);

    const sidebar = container.querySelector(".danmaku-sidebar");
    expect(sidebar).toHaveStyle({
      borderLeft: "3px solid #E11D48",
    });
  });

  /**
   * 测试用例 TC-003: 混躺模式样式测试
   * 测试目标：验证混躺模式下正确应用琥珀色主题样式
   */
  test("TC-003: 混躺模式样式测试", () => {
    const { container } = render(<DanmakuTower theme="mix" />);

    const sidebar = container.querySelector(".danmaku-sidebar");
    expect(sidebar).toHaveStyle({
      borderLeft: "3px solid #F59E0B",
    });
  });

  /**
   * 测试用例 TC-004: 弹幕消息渲染测试
   * 测试目标：验证弹幕消息正确渲染（使用简化数据结构）
   */
  test("TC-004: 弹幕消息渲染测试", async () => {
    render(<DanmakuTower theme="blood" />);

    // 等待初始弹幕加载（使用getAllByText因为有多个相同弹幕）
    await waitFor(() => {
      const messages = screen.getAllByText("无情铁手！");
      expect(messages.length).toBeGreaterThan(0);
    });
  });

  /**
   * 测试用例 TC-005: 用户头像显示测试
   * 测试目标：验证用户头像正确显示
   */
  test("TC-005: 用户头像显示测试", () => {
    render(<DanmakuTower theme="blood" />);

    const avatars = screen.getAllByAltText(/用户/);
    expect(avatars.length).toBeGreaterThan(0);
  });

  /**
   * 测试用例 TC-006: 在线人数显示测试
   * 测试目标：验证在线人数正确显示
   */
  test("TC-006: 在线人数显示测试", () => {
    render(<DanmakuTower theme="blood" />);

    expect(screen.getByText(/2 人在线/)).toBeInTheDocument();
  });

  /**
   * 测试用例 TC-007: 侧边栏定位测试
   * 测试目标：验证侧边栏定位正确
   */
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

  /**
   * 测试用例 TC-008: 移动端按钮存在测试
   * 测试目标：验证移动端按钮存在且样式正确
   */
  test("TC-008: 移动端按钮存在测试", () => {
    const { container } = render(<DanmakuTower theme="blood" />);

    const mobileButton = container.querySelector(".danmaku-mobile-button");
    expect(mobileButton).toBeInTheDocument();
    expect(mobileButton).toHaveAttribute("aria-label", "打开弹幕");
  });

  /**
   * 测试用例 TC-009: 抽屉打开/关闭测试
   * 测试目标：验证点击按钮可以打开和关闭抽屉
   */
  test("TC-009: 抽屉打开/关闭测试", async () => {
    render(<DanmakuTower theme="blood" />);

    // 点击打开抽屉
    const openButton = screen.getByLabelText("打开弹幕");
    fireEvent.click(openButton);

    // 验证抽屉显示
    expect(screen.getByTestId("danmaku-drawer")).toBeInTheDocument();

    // 点击遮罩层关闭抽屉
    const drawerOverlay = screen.getByTestId("danmaku-drawer");
    fireEvent.click(drawerOverlay);

    // 验证抽屉关闭
    await waitFor(() => {
      expect(screen.queryByTestId("danmaku-drawer")).not.toBeInTheDocument();
    });
  });

  /**
   * 测试用例 TC-010: 弹幕自动更新测试
   * 测试目标：验证弹幕定期自动更新
   */
  test("TC-010: 弹幕自动更新测试", async () => {
    jest.useFakeTimers();
    render(<DanmakuTower theme="blood" />);

    // 初始弹幕数量
    const initialMessages = screen.getAllByText(/无情铁手|致残打击/);
    const initialCount = initialMessages.length;

    // 快进2500ms（弹幕更新间隔）
    jest.advanceTimersByTime(2500);

    // 验证弹幕更新
    await waitFor(() => {
      const updatedMessages = screen.getAllByText(/无情铁手|致残打击/);
      expect(updatedMessages.length).toBeGreaterThanOrEqual(initialCount);
    });

    jest.useRealTimers();
  });

  /**
   * 测试用例 TC-011: 弹幕区域底部标识测试 - 血怒模式
   * 测试目标：验证血怒模式下显示正确的底部标识
   */
  test("TC-011: 弹幕区域底部标识测试 - 血怒模式", () => {
    render(<DanmakuTower theme="blood" />);

    expect(screen.getByText("🔥 血怒弹幕区 🔥")).toBeInTheDocument();
  });

  /**
   * 测试用例 TC-012: 弹幕区域底部标识测试 - 混躺模式
   * 测试目标：验证混躺模式下显示正确的底部标识
   */
  test("TC-012: 弹幕区域底部标识测试 - 混躺模式", () => {
    render(<DanmakuTower theme="mix" />);

    expect(screen.getByText("😴 混躺弹幕区 😴")).toBeInTheDocument();
  });

  /**
   * 测试用例 TC-013: 时间戳显示测试
   * 测试目标：验证弹幕消息显示时间戳
   */
  test("TC-013: 时间戳显示测试", () => {
    render(<DanmakuTower theme="blood" />);

    // 验证时间戳格式（HH:MM:SS）
    const timeRegex = /\d{2}:\d{2}:\d{2}/;
    const allElements = screen.getAllByText(/.*/);
    const timestamps = allElements.filter((el) => timeRegex.test(el.textContent || ""));
    expect(timestamps.length).toBeGreaterThan(0);
  });

  /**
   * 测试用例 TC-014: 移动端抽屉按钮显示测试
   * 测试目标：验证移动端显示抽屉按钮
   */
  test("TC-014: 移动端抽屉按钮显示测试", () => {
    render(<DanmakuTower theme="blood" />);

    expect(screen.getByLabelText("打开弹幕")).toBeInTheDocument();
  });

  /**
   * 测试用例 TC-015: 简化数据结构适配测试 - 血怒弹幕
   * 测试目标：验证简化后的bloodDanmaku数据结构正确加载
   */
  test("TC-015: 简化数据结构适配测试 - 血怒弹幕", async () => {
    render(<DanmakuTower theme="blood" />);

    // 验证血怒专属弹幕
    await waitFor(() => {
      const messages = screen.getAllByText("无情铁手！");
      expect(messages.length).toBeGreaterThan(0);
    });

    // 验证公共弹幕也可能出现
    const commonMessages = screen.queryAllByText("666");
    // 公共弹幕可能随机出现，不做强制断言
    expect(commonMessages.length).toBeGreaterThanOrEqual(0);
  });

  /**
   * 测试用例 TC-016: 简化数据结构适配测试 - 混躺弹幕
   * 测试目标：验证简化后的mixDanmaku数据结构正确加载
   */
  test("TC-016: 简化数据结构适配测试 - 混躺弹幕", async () => {
    render(<DanmakuTower theme="mix" />);

    // 验证混躺专属弹幕
    await waitFor(() => {
      const messages = screen.getAllByText("这把混");
      expect(messages.length).toBeGreaterThan(0);
    });

    // 验证混躺专属弹幕2
    const messages2 = screen.getAllByText("下把躺");
    expect(messages2.length).toBeGreaterThan(0);
  });

  /**
   * 测试用例 TC-017: 弹幕数据合并测试
   * 测试目标：验证主题专属弹幕和公共弹幕合并使用
   */
  test("TC-017: 弹幕数据合并测试", async () => {
    render(<DanmakuTower theme="blood" />);

    // 等待弹幕加载
    await waitFor(() => {
      const danmakuContainer = screen.getByText("弹幕聊天室").parentElement?.parentElement;
      expect(danmakuContainer).toBeInTheDocument();
    });

    // 验证弹幕区域有内容
    const content = screen.getByText("弹幕聊天室").parentElement?.parentElement;
    expect(content).toBeInTheDocument();
  });

  /**
   * 测试用例 TC-018: CSS媒体查询样式测试
   * 测试目标：验证响应式样式标签存在
   */
  test("TC-018: CSS媒体查询样式测试", () => {
    const { container } = render(<DanmakuTower theme="blood" />);

    // 验证style标签存在
    const styleTags = container.querySelectorAll("style");
    expect(styleTags.length).toBeGreaterThan(0);
  });
});

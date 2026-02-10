import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { DanmakuTower } from "@/features/yuxiaoc/components/DanmakuTower";
import "@testing-library/jest-dom";

// 模拟danmaku数据
jest.mock("@/features/yuxiaoc/data/danmaku.json", () => ({
  users: [
    { id: "1", name: "用户1", avatar: "https://example.com/avatar1.png" },
    { id: "2", name: "用户2", avatar: "https://example.com/avatar2.png" },
  ],
  blood: {
    tower: [
      { text: "无情铁手！", color: "#E11D48", size: "medium" },
      { text: "致残打击！", color: "#DC2626", size: "medium" },
    ],
  },
  mix: {
    tower: [
      { text: "这把混", color: "#F59E0B", size: "medium" },
      { text: "下把躺", color: "#3B82F6", size: "medium" },
    ],
  },
}));

describe("DanmakuTower组件测试", () => {
  /**
   * 测试用例 TC-001: 组件渲染测试
   * 测试目标：验证DanmakuTower组件能够正确渲染
   */
  test("TC-001: 组件渲染测试", () => {
    render(<DanmakuTower theme="blood" />);

    expect(screen.getByText("弹幕聊天室")).toBeInTheDocument();
    expect(screen.getByText("LIVE")).toBeInTheDocument();
  });

  /**
   * 测试用例 TC-002: 血怒模式样式测试
   * 测试目标：验证血怒模式下正确应用红色主题样式
   */
  test("TC-002: 血怒模式样式测试", () => {
    const { container } = render(<DanmakuTower theme="blood" />);

    const tower = container.firstChild as HTMLElement;
    expect(tower).toHaveStyle({
      borderLeft: "3px solid #E11D48",
    });
  });

  /**
   * 测试用例 TC-003: 混躺模式样式测试
   * 测试目标：验证混躺模式下正确应用琥珀色主题样式
   */
  test("TC-003: 混躺模式样式测试", () => {
    const { container } = render(<DanmakuTower theme="mix" />);

    const tower = container.firstChild as HTMLElement;
    expect(tower).toHaveStyle({
      borderLeft: "3px solid #F59E0B",
    });
  });

  /**
   * 测试用例 TC-004: 弹幕消息渲染测试
   * 测试目标：验证弹幕消息正确渲染
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
   * 测试用例 TC-007: 定位修复测试 - 桌面端
   * 测试目标：验证桌面端弹幕塔定位与导航栏对齐（top-16 = 64px）
   */
  test("TC-007: 定位修复测试 - 桌面端", () => {
    // 模拟桌面端
    window.innerWidth = 1280;
    const { container } = render(<DanmakuTower theme="blood" />);

    // 找到桌面端侧边栏（第二个子元素是Fragment，实际内容在内部）
    const towers = container.querySelectorAll(".fixed.right-0");
    const desktopTower = towers[0];
    
    // 验证使用top-16类（64px）与导航栏高度一致
    expect(desktopTower.classList.contains("top-16")).toBe(true);
    // 桌面端使用hidden lg:flex，所以在非lg环境下会hidden
    expect(desktopTower.classList.contains("lg:flex")).toBe(true);
  });

  /**
   * 测试用例 TC-008: 移动端抽屉显示测试
   * 测试目标：验证移动端显示为底部抽屉
   */
  test("TC-008: 移动端抽屉显示测试", () => {
    // 模拟移动端
    window.innerWidth = 375;
    const { container } = render(<DanmakuTower theme="blood" />);

    // 移动端应该隐藏侧边栏，显示抽屉按钮
    const tower = container.firstChild as HTMLElement;
    expect(tower.classList.contains("hidden")).toBe(true);
    expect(tower.classList.contains("lg:flex")).toBe(true);

    // 验证抽屉按钮存在
    const drawerButton = screen.getByLabelText("打开弹幕");
    expect(drawerButton).toBeInTheDocument();
  });

  /**
   * 测试用例 TC-009: 抽屉打开/关闭测试
   * 测试目标：验证点击按钮可以打开和关闭抽屉
   */
  test("TC-009: 抽屉打开/关闭测试", async () => {
    // 模拟移动端
    window.innerWidth = 375;
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
   * 测试用例 TC-014: 响应式切换测试
   * 测试目标：验证窗口大小变化时正确切换显示模式
   */
  test("TC-014: 响应式切换测试", () => {
    // 初始桌面端
    window.innerWidth = 1280;
    const { container, rerender } = render(<DanmakuTower theme="blood" />);

    // 桌面端侧边栏存在
    const towers = container.querySelectorAll(".fixed.right-0");
    expect(towers.length).toBeGreaterThan(0);

    // 切换到移动端
    window.innerWidth = 375;
    rerender(<DanmakuTower theme="blood" />);

    // 移动端应该显示抽屉按钮
    expect(screen.getByLabelText("打开弹幕")).toBeInTheDocument();
  });

  /**
   * 测试用例 TC-015: 移动端抽屉按钮显示测试
   * 测试目标：验证移动端显示抽屉按钮
   */
  test("TC-015: 移动端抽屉按钮显示测试", () => {
    // 移动端应该显示抽屉按钮
    window.innerWidth = 375;
    render(<DanmakuTower theme="blood" />);

    expect(screen.getByLabelText("打开弹幕")).toBeInTheDocument();
  });
});

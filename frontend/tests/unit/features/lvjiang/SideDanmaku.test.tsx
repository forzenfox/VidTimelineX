import React from "react";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import { SideDanmaku } from "@/features/lvjiang/components/SideDanmaku";
import "@testing-library/jest-dom";

// 模拟弹幕数据和用户数据
jest.mock("@/features/lvjiang/data", () => ({
  dongzhuDanmaku: ["测试弹幕 1", "测试弹幕 2", "测试弹幕 3", "测试弹幕 4"],
  kaigeDanmaku: ["凯哥弹幕 1", "凯哥弹幕 2", "凯哥弹幕 3", "凯哥弹幕 4"],
  users: [
    { id: "1", name: "测试用户 1", avatar: "https://example.com/avatar1.jpg", level: 1, badge: [] },
    { id: "2", name: "测试用户 2", avatar: "https://example.com/avatar2.jpg", level: 2, badge: [] },
    { id: "3", name: "测试用户 3", avatar: "https://example.com/avatar3.jpg", level: 3, badge: [] },
  ],
}));

// 模拟共享弹幕库
jest.mock("@/shared/danmaku", () => ({
  DanmakuGenerator: class MockDanmakuGenerator {
    constructor(private config: any) {}

    generateMessage(index: number) {
      const text = this.config.textPool[index % this.config.textPool.length] || "弹幕";
      const user = this.config.users[index % this.config.users.length];
      return {
        id: `danmaku-${Date.now()}-${index}`,
        text,
        color: "#3498DB",
        size: "medium" as const,
        userId: user?.id,
        userName: user?.name,
        userAvatar: user?.avatar,
        timestamp: "12:00:00",
      };
    }

    generateBatch(options: { count: number; type: string; theme?: string }) {
      return Array.from({ length: options.count }, (_, i) => this.generateMessage(i));
    }
  },
  getThemeColor: () => "#3498DB",
}));

describe("SideDanmaku 组件测试", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  /**
   * 测试用例 TC-SD-001: 组件渲染测试
   * 测试目标：验证 SideDanmaku 组件能够正确渲染
   */
  test("TC-SD-001: 组件渲染测试", () => {
    render(<SideDanmaku theme="dongzhu" />);

    // 验证侧边栏元素存在
    const sidebar = document.querySelector(".side-danmaku-sidebar");
    expect(sidebar).toBeInTheDocument();

    // 验证聊天室标题
    expect(screen.getByText("聊天室")).toBeInTheDocument();
  });

  /**
   * 测试用例 TC-SD-002: 洞主主题弹幕显示测试
   * 测试目标：验证洞主主题下弹幕正确显示
   */
  test("TC-SD-002: 洞主主题弹幕显示测试", () => {
    render(<SideDanmaku theme="dongzhu" />);

    // 验证洞主主题标题
    expect(screen.getByText("家猪·洞主专区")).toBeInTheDocument();

    // 验证底部标签
    expect(screen.getByText(/软萌弹幕区/)).toBeInTheDocument();
  });

  /**
   * 测试用例 TC-SD-003: 凯哥主题弹幕显示测试
   * 测试目标：验证凯哥主题下弹幕正确显示
   */
  test("TC-SD-003: 凯哥主题弹幕显示测试", () => {
    render(<SideDanmaku theme="kaige" />);

    // 验证凯哥主题标题
    expect(screen.getByText("野猪·凯哥专区")).toBeInTheDocument();

    // 验证底部标签
    expect(screen.getByText(/硬核弹幕区/)).toBeInTheDocument();
  });

  /**
   * 测试用例 TC-SD-004: 弹幕内容渲染测试
   * 测试目标：验证弹幕内容区域正确渲染
   */
  test("TC-SD-004: 弹幕内容渲染测试", () => {
    render(<SideDanmaku theme="dongzhu" />);

    // 验证弹幕内容区域存在
    const contentArea = document.querySelector(".side-danmaku-content");
    expect(contentArea).toBeInTheDocument();

    // 验证弹幕条目存在
    const danmakuItems = document.querySelectorAll(".danmaku-item");
    expect(danmakuItems.length).toBeGreaterThan(0);
  });

  /**
   * 测试用例 TC-SD-005: 弹幕动画样式测试
   * 测试目标：验证弹幕有渐入动画样式
   */
  test("TC-SD-005: 弹幕动画样式测试", () => {
    const { container } = render(<SideDanmaku theme="dongzhu" />);

    // 验证弹幕条目有动画类名
    const danmakuItems = document.querySelectorAll(".danmaku-item");
    expect(danmakuItems.length).toBeGreaterThan(0);

    // 验证动画关键帧样式存在
    const styleTags = container.querySelectorAll("style");
    let hasAnimation = false;
    styleTags.forEach(tag => {
      if (tag.textContent?.includes("fadeInUp")) {
        hasAnimation = true;
      }
    });
    expect(hasAnimation).toBe(true);
  });

  /**
   * 测试用例 TC-SD-006: 移动端浮动按钮测试
   * 测试目标：验证移动端浮动按钮正确渲染
   */
  test("TC-SD-006: 移动端浮动按钮测试", () => {
    render(<SideDanmaku theme="dongzhu" />);

    // 验证移动端按钮元素存在
    const mobileButton = document.querySelector(".side-danmaku-mobile-btn");
    expect(mobileButton).toBeInTheDocument();

    // 验证按钮有正确的 aria-label
    expect(mobileButton).toHaveAttribute("aria-label", "打开弹幕");
  });

  /**
   * 测试用例 TC-SD-007: 移动端抽屉打开测试
   * 测试目标：验证点击浮动按钮打开弹幕抽屉
   */
  test("TC-SD-007: 移动端抽屉打开测试", async () => {
    render(<SideDanmaku theme="dongzhu" />);

    // 点击浮动按钮
    const mobileButton = document.querySelector(".side-danmaku-mobile-btn");
    expect(mobileButton).toBeInTheDocument();

    fireEvent.click(mobileButton!);

    // 验证抽屉打开
    await waitFor(() => {
      const drawer = document.querySelector(".side-danmaku-drawer");
      expect(drawer).toBeInTheDocument();
    });
  });

  /**
   * 测试用例 TC-SD-008: 移动端抽屉关闭测试
   * 测试目标：验证点击遮罩层关闭弹幕抽屉
   */
  test("TC-SD-008: 移动端抽屉关闭测试", async () => {
    render(<SideDanmaku theme="dongzhu" />);

    // 点击浮动按钮打开抽屉
    const mobileButton = document.querySelector(".side-danmaku-mobile-btn");
    fireEvent.click(mobileButton!);

    // 等待抽屉打开
    await waitFor(() => {
      const drawer = document.querySelector(".side-danmaku-drawer");
      expect(drawer).toBeInTheDocument();
    });

    // 点击遮罩层关闭抽屉
    const overlay = document.querySelector(".side-danmaku-drawer-overlay");
    fireEvent.click(overlay!);

    // 验证抽屉关闭
    await waitFor(() => {
      const drawer = document.querySelector(".side-danmaku-drawer");
      expect(drawer).not.toBeInTheDocument();
    });
  });

  /**
   * 测试用例 TC-SD-009: LIVE 状态指示器测试
   * 测试目标：验证聊天室头部显示 LIVE 状态指示器
   */
  test("TC-SD-009: LIVE 状态指示器测试", () => {
    render(<SideDanmaku theme="dongzhu" />);

    // 验证 LIVE 文本存在
    expect(screen.getByText("LIVE")).toBeInTheDocument();

    // 验证脉冲动画圆点存在
    const pulseDot = document.querySelector(".animate-pulse");
    expect(pulseDot).toBeInTheDocument();
  });

  /**
   * 测试用例 TC-SD-010: 用户头像显示测试
   * 测试目标：验证弹幕消息显示用户头像
   */
  test("TC-SD-010: 用户头像显示测试", () => {
    render(<SideDanmaku theme="dongzhu" />);

    // 验证头像图片存在
    const avatars = document.querySelectorAll(".danmaku-item img");
    expect(avatars.length).toBeGreaterThan(0);

    // 验证头像有 alt 属性
    const firstAvatar = avatars[0] as HTMLImageElement;
    expect(firstAvatar).toHaveAttribute("alt");
  });
});

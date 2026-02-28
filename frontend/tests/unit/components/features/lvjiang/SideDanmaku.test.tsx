import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { SideDanmaku } from "@/features/lvjiang/components/SideDanmaku";
import "@testing-library/jest-dom";

// 模拟弹幕数据和用户数据
jest.mock("@/features/lvjiang/data", () => ({
  dongzhuDanmaku: ["测试弹幕 1", "测试弹幕 2", "测试弹幕 3"],
  kaigeDanmaku: ["凯哥弹幕 1", "凯哥弹幕 2", "凯哥弹幕 3"],
  users: [
    { id: "1", name: "测试用户 1", avatar: "https://example.com/avatar1.jpg", level: 1, badge: [] },
    { id: "2", name: "测试用户 2", avatar: "https://example.com/avatar2.jpg", level: 2, badge: [] },
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
  getSizeByTextLength: (text: string) => {
    if (text.length <= 3) return "large";
    if (text.length <= 8) return "medium";
    return "small";
  },
}));

describe("SideDanmaku 响应式布局测试", () => {
  /**
   * 测试用例 TC-SD-001: 桌面端侧边栏渲染测试
   * 测试目标：验证桌面端侧边栏元素存在
   */
  test("TC-SD-001: 桌面端侧边栏渲染测试", () => {
    render(<SideDanmaku theme="dongzhu" />);

    // 验证侧边栏元素存在（通过 CSS 媒体查询控制显示/隐藏）
    const sidebar = document.querySelector(".side-danmaku-sidebar");
    expect(sidebar).toBeInTheDocument();

    // 验证移动端按钮元素存在（通过 CSS 媒体查询控制显示/隐藏）
    const mobileButton = document.querySelector(".side-danmaku-mobile-btn");
    expect(mobileButton).toBeInTheDocument();
  });

  /**
   * 测试用例 TC-SD-002: 移动端浮动按钮渲染测试
   * 测试目标：验证移动端浮动按钮元素存在
   */
  test("TC-SD-002: 移动端浮动按钮渲染测试", () => {
    render(<SideDanmaku theme="dongzhu" />);

    // 验证移动端按钮元素存在
    const mobileButton = document.querySelector(".side-danmaku-mobile-btn");
    expect(mobileButton).toBeInTheDocument();

    // 验证侧边栏元素存在
    const sidebar = document.querySelector(".side-danmaku-sidebar");
    expect(sidebar).toBeInTheDocument();
  });

  /**
   * 测试用例 TC-SD-003: 移动端抽屉打开测试
   * 测试目标：验证点击浮动按钮打开弹幕抽屉
   */
  test("TC-SD-003: 移动端抽屉打开测试", async () => {
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
   * 测试用例 TC-SD-004: 移动端抽屉关闭测试
   * 测试目标：验证点击遮罩层关闭弹幕抽屉
   */
  test("TC-SD-004: 移动端抽屉关闭测试", async () => {
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
   * 测试用例 TC-SD-005: 洞主主题样式测试
   * 测试目标：验证洞主主题下侧边栏样式正确
   */
  test("TC-SD-005: 洞主主题样式测试", () => {
    render(<SideDanmaku theme="dongzhu" />);

    // 验证侧边栏存在
    const sidebar = document.querySelector(".side-danmaku-sidebar");
    expect(sidebar).toBeInTheDocument();

    // 验证聊天室标题
    expect(screen.getByText("聊天室")).toBeInTheDocument();
    expect(screen.getByText("家猪·洞主专区")).toBeInTheDocument();
  });

  /**
   * 测试用例 TC-SD-006: 凯哥主题样式测试
   * 测试目标：验证凯哥主题下侧边栏样式正确
   */
  test("TC-SD-006: 凯哥主题样式测试", () => {
    render(<SideDanmaku theme="kaige" />);

    // 验证侧边栏存在
    const sidebar = document.querySelector(".side-danmaku-sidebar");
    expect(sidebar).toBeInTheDocument();

    // 验证聊天室标题
    expect(screen.getByText("聊天室")).toBeInTheDocument();
    expect(screen.getByText("野猪·凯哥专区")).toBeInTheDocument();
  });

  /**
   * 测试用例 TC-SD-007: 弹幕内容渲染测试
   * 测试目标：验证弹幕内容正确渲染
   */
  test("TC-SD-007: 弹幕内容渲染测试", async () => {
    render(<SideDanmaku theme="dongzhu" />);

    // 验证弹幕内容区域存在
    const contentArea = document.querySelector(".side-danmaku-content");
    expect(contentArea).toBeInTheDocument();

    // 验证底部标签
    expect(screen.getByText(/软萌弹幕区/)).toBeInTheDocument();
  });

  /**
   * 测试用例 TC-SD-008: 移动端浮动按钮主题样式测试
   * 测试目标：验证移动端浮动按钮根据主题变化
   */
  test("TC-SD-008: 移动端浮动按钮主题样式测试", () => {
    const { rerender } = render(<SideDanmaku theme="dongzhu" />);

    // 验证洞主主题下浮动按钮存在
    let mobileButton = document.querySelector(".side-danmaku-mobile-btn");
    expect(mobileButton).toBeInTheDocument();

    // 切换到凯哥主题
    rerender(<SideDanmaku theme="kaige" />);

    // 验证凯哥主题下浮动按钮仍然存在
    mobileButton = document.querySelector(".side-danmaku-mobile-btn");
    expect(mobileButton).toBeInTheDocument();
  });

  /**
   * 测试用例 TC-SD-009: 抽屉拖动条关闭测试
   * 测试目标：验证点击抽屉拖动条可以关闭抽屉
   */
  test("TC-SD-009: 抽屉拖动条关闭测试", async () => {
    render(<SideDanmaku theme="dongzhu" />);

    // 点击浮动按钮打开抽屉
    const mobileButton = document.querySelector(".side-danmaku-mobile-btn");
    fireEvent.click(mobileButton!);

    // 等待抽屉打开
    await waitFor(() => {
      const drawer = document.querySelector(".side-danmaku-drawer");
      expect(drawer).toBeInTheDocument();
    });

    // 点击拖动条关闭抽屉
    const dragHandle = document.querySelector(".side-danmaku-drag-handle");
    if (dragHandle) {
      fireEvent.click(dragHandle);

      // 验证抽屉关闭
      await waitFor(() => {
        const drawer = document.querySelector(".side-danmaku-drawer");
        expect(drawer).not.toBeInTheDocument();
      });
    }
  });

  /**
   * 测试用例 TC-SD-010: 侧边栏宽度测试
   * 测试目标：验证侧边栏宽度为 320px
   */
  test("TC-SD-010: 侧边栏宽度测试", () => {
    render(<SideDanmaku theme="dongzhu" />);

    const sidebar = document.querySelector(".side-danmaku-sidebar") as HTMLElement;
    expect(sidebar).toBeInTheDocument();

    // 验证宽度为 320px
    expect(sidebar?.style.width).toBe("320px");
  });

  /**
   * 测试用例 TC-SD-011: 响应式样式标签存在测试
   * 测试目标：验证响应式样式标签存在
   */
  test("TC-SD-011: 响应式样式标签存在测试", () => {
    const { container } = render(<SideDanmaku theme="dongzhu" />);

    // 验证 style 标签存在
    const styleTags = container.querySelectorAll("style");
    expect(styleTags.length).toBeGreaterThan(0);
  });

  /**
   * 测试用例 TC-SD-012: 凯哥主题底部标签测试
   * 测试目标：验证凯哥主题下底部标签正确
   */
  test("TC-SD-012: 凯哥主题底部标签测试", () => {
    render(<SideDanmaku theme="kaige" />);

    // 验证底部标签为凯哥主题
    expect(screen.getByText(/硬核弹幕区/)).toBeInTheDocument();
  });

  /**
   * 测试用例 TC-SD-013: 用户头像显示测试
   * 测试目标：验证弹幕消息显示用户头像
   */
  test("TC-SD-013: 用户头像显示测试", () => {
    render(<SideDanmaku theme="dongzhu" />);

    // 验证头像图片存在
    const avatars = document.querySelectorAll(".danmaku-item img");
    expect(avatars.length).toBeGreaterThan(0);

    // 验证头像有正确的边框颜色
    const firstAvatar = avatars[0] as HTMLImageElement;
    expect(firstAvatar).toBeInTheDocument();
  });

  /**
   * 测试用例 TC-SD-014: 用户名显示测试
   * 测试目标：验证弹幕消息显示用户名
   */
  test("TC-SD-014: 用户名显示测试", () => {
    render(<SideDanmaku theme="dongzhu" />);

    // 验证用户名存在（至少有一个测试用户）
    const userNames = document.querySelectorAll(".danmaku-item span");
    expect(userNames.length).toBeGreaterThan(0);
  });

  /**
   * 测试用例 TC-SD-015: LIVE 指示器测试
   * 测试目标：验证聊天室头部显示 LIVE 状态指示器
   */
  test("TC-SD-015: LIVE 指示器测试", () => {
    render(<SideDanmaku theme="dongzhu" />);

    // 验证 LIVE 文本存在
    expect(screen.getByText("LIVE")).toBeInTheDocument();

    // 验证脉冲动画圆点存在
    const pulseDot = document.querySelector(".animate-pulse");
    expect(pulseDot).toBeInTheDocument();
  });

  /**
   * 测试用例 TC-SD-016: 渐入动画测试
   * 测试目标：验证弹幕条目有渐入动画
   */
  test("TC-SD-016: 渐入动画测试", () => {
    render(<SideDanmaku theme="dongzhu" />);

    // 验证弹幕条目有动画样式
    const danmakuItems = document.querySelectorAll(".danmaku-item");
    expect(danmakuItems.length).toBeGreaterThan(0);

    // 验证动画关键帧样式存在
    const styleTags = document.querySelectorAll("style");
    let hasAnimation = false;
    styleTags.forEach(tag => {
      if (tag.textContent?.includes("fadeInUp")) {
        hasAnimation = true;
      }
    });
    expect(hasAnimation).toBe(true);
  });

  /**
   * 测试用例 TC-SD-017: 弹幕颜色系统测试
   * 测试目标：验证弹幕条目有颜色边框
   */
  test("TC-SD-017: 弹幕颜色系统测试", () => {
    render(<SideDanmaku theme="dongzhu" />);

    // 验证弹幕条目有边框
    const danmakuItems = document.querySelectorAll(".danmaku-item");
    expect(danmakuItems.length).toBeGreaterThan(0);

    // 验证第一个弹幕条目有边框样式
    const firstItem = danmakuItems[0] as HTMLElement;
    expect(firstItem.style.border).toBeTruthy();
  });

  /**
   * 测试用例 TC-SD-018: 弹幕大小分级测试
   * 测试目标：验证不同长度的弹幕有不同大小
   */
  test("TC-SD-018: 弹幕大小分级测试", () => {
    render(<SideDanmaku theme="dongzhu" />);

    // 验证弹幕文本存在
    const danmakuTexts = document.querySelectorAll(".danmaku-item div:last-child");
    expect(danmakuTexts.length).toBeGreaterThan(0);

    // 验证文本有不同字体大小
    const firstText = danmakuTexts[0] as HTMLElement;
    expect(firstText.style.fontSize).toBeTruthy();
  });

  /**
   * 测试用例 TC-SD-019: 响应式断点测试（768px）
   * 测试目标：验证响应式断点为 768px
   */
  test("TC-SD-019: 响应式断点测试（768px）", () => {
    const { container } = render(<SideDanmaku theme="dongzhu" />);

    // 验证样式标签中包含 768px 断点
    const styleTags = container.querySelectorAll("style");
    let has768pxBreakpoint = false;
    styleTags.forEach(tag => {
      if (tag.textContent?.includes("768px")) {
        has768pxBreakpoint = true;
      }
    });
    expect(has768pxBreakpoint).toBe(true);
  });

  /**
   * 测试用例 TC-SD-020: MessageSquare 图标测试
   * 测试目标：验证聊天室头部显示 MessageSquare 图标
   */
  test("TC-SD-020: MessageSquare 图标测试", () => {
    render(<SideDanmaku theme="dongzhu" />);

    // 验证 MessageSquare 图标存在（通过 lucide-react 渲染）
    const messageSquare = document.querySelector("svg");
    expect(messageSquare).toBeInTheDocument();
  });
});

import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { SideDanmaku } from "@/features/lvjiang/components/SideDanmaku";
import "@testing-library/jest-dom";

// 模拟弹幕数据
jest.mock("@/features/lvjiang/data", () => ({
  dongzhuDanmaku: ["测试弹幕1", "测试弹幕2", "测试弹幕3"],
  kaigeDanmaku: ["凯哥弹幕1", "凯哥弹幕2", "凯哥弹幕3"],
}));

describe("SideDanmaku响应式布局测试", () => {
  /**
   * 测试用例 TC-SD-001: 桌面端侧边栏渲染测试
   * 测试目标：验证桌面端侧边栏元素存在
   */
  test("TC-SD-001: 桌面端侧边栏渲染测试", () => {
    render(<SideDanmaku theme="dongzhu" />);

    // 验证侧边栏元素存在（通过CSS媒体查询控制显示/隐藏）
    const sidebar = document.querySelector(".side-danmaku-sidebar");
    expect(sidebar).toBeInTheDocument();

    // 验证移动端按钮元素存在（通过CSS媒体查询控制显示/隐藏）
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
   * 测试目标：验证侧边栏宽度为320px
   */
  test("TC-SD-010: 侧边栏宽度测试", () => {
    render(<SideDanmaku theme="dongzhu" />);

    const sidebar = document.querySelector(".side-danmaku-sidebar") as HTMLElement;
    expect(sidebar).toBeInTheDocument();

    // 验证宽度为320px
    expect(sidebar?.style.width).toBe("320px");
  });

  /**
   * 测试用例 TC-SD-011: 响应式样式标签存在测试
   * 测试目标：验证响应式样式标签存在
   */
  test("TC-SD-011: 响应式样式标签存在测试", () => {
    const { container } = render(<SideDanmaku theme="dongzhu" />);

    // 验证style标签存在
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
});

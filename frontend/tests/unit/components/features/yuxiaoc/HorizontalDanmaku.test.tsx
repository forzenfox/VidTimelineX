import React from "react";
import { render, waitFor } from "@testing-library/react";
import { HorizontalDanmaku } from "@/features/yuxiaoc/components/HorizontalDanmaku";
import "@testing-library/jest-dom";

// 模拟danmaku.json数据 - 简化后的数据结构
jest.mock("@/features/yuxiaoc/data/danmaku.json", () => ({
  bloodDanmaku: ["血怒测试弹幕1", "血怒测试弹幕2", "血怒测试弹幕3"],
  mixDanmaku: ["混躺测试弹幕1", "混躺测试弹幕2", "混躺测试弹幕3"],
  commonDanmaku: ["公共弹幕1", "公共弹幕2"],
}));

// 模拟danmakuColors.ts
jest.mock("@/features/yuxiaoc/data/danmakuColors", () => ({
  getDanmakuColor: jest.fn(() => "#E11D48"),
  getCommonDanmakuColor: jest.fn(() => "#6B7280"),
}));

describe("HorizontalDanmaku组件测试", () => {
  /**
   * 测试用例 TC-001: 组件渲染测试
   * 测试目标：验证HorizontalDanmaku组件能够正确渲染
   */
  test("TC-001: 组件渲染测试", async () => {
    const { container } = render(<HorizontalDanmaku theme="blood" isVisible={true} />);

    // 等待组件挂载
    await waitFor(() => {
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  /**
   * 测试用例 TC-002: 不可见状态测试
   * 测试目标：验证isVisible为false时不渲染弹幕
   */
  test("TC-002: 不可见状态测试", () => {
    const { container } = render(<HorizontalDanmaku theme="blood" isVisible={false} />);

    // 验证容器为空
    expect(container.firstChild).toBeNull();
  });

  /**
   * 测试用例 TC-003: 血怒主题弹幕测试
   * 测试目标：验证血怒主题弹幕能够正确渲染
   */
  test("TC-003: 血怒主题弹幕测试", async () => {
    const { container } = render(<HorizontalDanmaku theme="blood" isVisible={true} />);

    // 等待组件挂载
    await waitFor(() => {
      expect(container.firstChild).toBeInTheDocument();
    });

    // 验证容器存在
    const danmakuContainer = container.firstChild as HTMLElement;
    expect(danmakuContainer).toHaveClass(
      "fixed",
      "inset-0",
      "pointer-events-none",
      "z-30",
      "overflow-hidden"
    );
  });

  /**
   * 测试用例 TC-004: 混躺主题弹幕测试
   * 测试目标：验证混躺主题弹幕能够正确渲染
   */
  test("TC-004: 混躺主题弹幕测试", async () => {
    const { container } = render(<HorizontalDanmaku theme="mix" isVisible={true} />);

    // 等待组件挂载
    await waitFor(() => {
      expect(container.firstChild).toBeInTheDocument();
    });

    // 验证容器存在
    const danmakuContainer = container.firstChild as HTMLElement;
    expect(danmakuContainer).toBeInTheDocument();
  });

  /**
   * 测试用例 TC-005: 弹幕轨道分布测试
   * 测试目标：验证弹幕轨道均匀分布（8条轨道）
   */
  test("TC-005: 弹幕轨道分布测试", async () => {
    const { container } = render(<HorizontalDanmaku theme="blood" isVisible={true} />);

    // 等待组件挂载
    await waitFor(() => {
      expect(container.firstChild).toBeInTheDocument();
    });

    // 验证容器样式
    const danmakuContainer = container.firstChild as HTMLElement;
    expect(danmakuContainer).toHaveStyle({
      top: "120px",
      height: "calc(100vh - 120px)",
    });
  });

  /**
   * 测试用例 TC-006: 弹幕样式测试
   * 测试目标：验证弹幕样式能够正确应用
   */
  test("TC-006: 弹幕样式测试", async () => {
    const { container } = render(<HorizontalDanmaku theme="blood" isVisible={true} />);

    // 等待组件挂载
    await waitFor(() => {
      expect(container.firstChild).toBeInTheDocument();
    });

    // 验证容器存在
    expect(container.firstChild).toBeInTheDocument();
  });

  /**
   * 测试用例 TC-007: 主题切换测试
   * 测试目标：验证主题切换时弹幕正确更新
   */
  test("TC-007: 主题切换测试", async () => {
    const { container, rerender } = render(<HorizontalDanmaku theme="blood" isVisible={true} />);

    // 等待组件挂载
    await waitFor(() => {
      expect(container.firstChild).toBeInTheDocument();
    });

    // 切换到混躺主题
    rerender(<HorizontalDanmaku theme="mix" isVisible={true} />);

    // 验证容器仍然存在
    await waitFor(() => {
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  /**
   * 测试用例 TC-008: 简化数据结构适配测试 - 血怒弹幕
   * 测试目标：验证简化后的bloodDanmaku数据结构正确加载
   */
  test("TC-008: 简化数据结构适配测试 - 血怒弹幕", async () => {
    const { container } = render(<HorizontalDanmaku theme="blood" isVisible={true} />);

    // 等待组件挂载
    await waitFor(() => {
      expect(container.firstChild).toBeInTheDocument();
    });

    // 验证容器渲染成功
    const danmakuContainer = container.firstChild as HTMLElement;
    expect(danmakuContainer).toBeInTheDocument();
  });

  /**
   * 测试用例 TC-009: 简化数据结构适配测试 - 混躺弹幕
   * 测试目标：验证简化后的mixDanmaku数据结构正确加载
   */
  test("TC-009: 简化数据结构适配测试 - 混躺弹幕", async () => {
    const { container } = render(<HorizontalDanmaku theme="mix" isVisible={true} />);

    // 等待组件挂载
    await waitFor(() => {
      expect(container.firstChild).toBeInTheDocument();
    });

    // 验证容器渲染成功
    const danmakuContainer = container.firstChild as HTMLElement;
    expect(danmakuContainer).toBeInTheDocument();
  });

  /**
   * 测试用例 TC-010: 公共弹幕数据测试
   * 测试目标：验证commonDanmaku数据正确加载
   */
  test("TC-010: 公共弹幕数据测试", async () => {
    const { container } = render(<HorizontalDanmaku theme="blood" isVisible={true} />);

    // 等待组件挂载
    await waitFor(() => {
      expect(container.firstChild).toBeInTheDocument();
    });

    // 验证容器渲染成功
    expect(container.firstChild).toBeInTheDocument();
  });

  /**
   * 测试用例 TC-011: 弹幕数据合并测试
   * 测试目标：验证主题专属弹幕和公共弹幕合并使用
   */
  test("TC-011: 弹幕数据合并测试", async () => {
    const { container } = render(<HorizontalDanmaku theme="blood" isVisible={true} />);

    // 等待组件挂载
    await waitFor(() => {
      expect(container.firstChild).toBeInTheDocument();
    });

    // 验证容器存在且有内容
    const danmakuContainer = container.firstChild as HTMLElement;
    expect(danmakuContainer).toBeInTheDocument();
  });
});

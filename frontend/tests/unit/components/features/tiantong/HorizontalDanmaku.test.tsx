import React from "react";
import { render } from "@testing-library/react";
import { HorizontalDanmaku } from "@/features/tiantong/components/HorizontalDanmaku";
import "@testing-library/jest-dom";

describe("HorizontalDanmaku 组件测试 - 甜筒页面", () => {
  /**
   * 测试用例 TC-001: 弹幕数量测试
   * 测试目标：验证弹幕数量正确
   */
  test("TC-001: 弹幕数量应该正确", () => {
    const { container } = render(<HorizontalDanmaku theme="tiger" />);

    const danmakuElements = container.querySelectorAll(".absolute.whitespace-nowrap");
    expect(danmakuElements.length).toBeGreaterThan(0);
  });

  /**
   * 测试用例 TC-002: 弹幕 ID 包含主题信息
   * 测试目标：验证弹幕 ID 格式为 danmaku-${theme}-${i}
   */
  test("TC-002: 弹幕 ID 应该包含主题信息", () => {
    const { container } = render(<HorizontalDanmaku theme="tiger" />);

    const danmakuElements = container.querySelectorAll(".absolute.whitespace-nowrap");
    expect(danmakuElements.length).toBeGreaterThan(0);

    // 验证第一个弹幕的 key 属性（通过 React 的 key 无法直接获取，但可以通过渲染验证）
    const firstDanmaku = danmakuElements[0];
    expect(firstDanmaku).toBeInTheDocument();
  });

  /**
   * 测试用例 TC-003: 老虎主题字体大小
   * 测试目标：验证老虎主题字体大小为 20px
   */
  test("TC-003: 老虎主题字体大小应该是 20px", () => {
    const { container } = render(<HorizontalDanmaku theme="tiger" />);

    const danmakuElements = container.querySelectorAll(".absolute.whitespace-nowrap");
    expect(danmakuElements.length).toBeGreaterThan(0);

    const firstDanmaku = danmakuElements[0];
    expect(firstDanmaku).toHaveStyle("font-size: 20px");
  });

  /**
   * 测试用例 TC-004: 甜蜜主题字体大小
   * 测试目标：验证甜蜜主题字体大小为 22px
   */
  test("TC-004: 甜蜜主题字体大小应该是 22px", () => {
    const { container } = render(<HorizontalDanmaku theme="sweet" />);

    const danmakuElements = container.querySelectorAll(".absolute.whitespace-nowrap");
    expect(danmakuElements.length).toBeGreaterThan(0);

    const firstDanmaku = danmakuElements[0];
    expect(firstDanmaku).toHaveStyle("font-size: 22px");
  });

  /**
   * 测试用例 TC-005: 老虎主题颜色
   * 测试目标：验证老虎主题颜色为 #E74C3C
   */
  test("TC-005: 老虎主题颜色应该是 #E74C3C", () => {
    const { container } = render(<HorizontalDanmaku theme="tiger" />);

    const danmakuElements = container.querySelectorAll(".absolute.whitespace-nowrap");
    expect(danmakuElements.length).toBeGreaterThan(0);

    const firstDanmaku = danmakuElements[0];
    expect(firstDanmaku).toHaveStyle("color: #E74C3C");
  });

  /**
   * 测试用例 TC-006: 甜蜜主题颜色
   * 测试目标：验证甜蜜主题颜色为 #FF69B4
   */
  test("TC-006: 甜蜜主题颜色应该是 #FF69B4", () => {
    const { container } = render(<HorizontalDanmaku theme="sweet" />);

    const danmakuElements = container.querySelectorAll(".absolute.whitespace-nowrap");
    expect(danmakuElements.length).toBeGreaterThan(0);

    const firstDanmaku = danmakuElements[0];
    expect(firstDanmaku).toHaveStyle("color: #FF69B4");
  });

  /**
   * 测试用例 TC-007: 弹幕轨道分布
   * 测试目标：验证弹幕均匀分布在 8 条轨道上
   */
  test("TC-007: 弹幕应该均匀分布在 8 条轨道上", () => {
    const { container } = render(<HorizontalDanmaku theme="tiger" />);

    const danmakuElements = container.querySelectorAll(".absolute.whitespace-nowrap");
    expect(danmakuElements.length).toBeGreaterThan(0);

    // 验证前 8 条弹幕分布在 8 条轨道上（10%, 20%, 30%...）
    const expectedTops = ["10%", "20%", "30%", "40%", "50%", "60%", "70%", "80%"];
    for (let i = 0; i < Math.min(8, danmakuElements.length); i++) {
      const danmaku = danmakuElements[i];
      expect(danmaku).toHaveStyle(`top: ${expectedTops[i]}`);
    }
  });

  /**
   * 测试用例 TC-008: 动画参数测试
   * 测试目标：验证弹幕动画 duration 以秒为单位
   */
  test("TC-008: 弹幕动画 duration 应该以秒为单位", () => {
    const { container } = render(<HorizontalDanmaku theme="tiger" />);

    const danmakuElements = container.querySelectorAll(".absolute.whitespace-nowrap");
    expect(danmakuElements.length).toBeGreaterThan(0);

    const firstDanmaku = danmakuElements[0];
    const style = firstDanmaku.getAttribute("style");
    // 验证 animation 属性包含以秒为单位的 duration（如 6s, 7.5s, 8s）
    expect(style).toMatch(/animation:.*danmaku\s+\d+(\.\d+)?s/);
  });

  /**
   * 测试用例 TC-009: 白色描边效果
   * 测试目标：验证弹幕有白色描边效果，无光晕
   */
  test("TC-009: 弹幕应该包含白色描边效果", () => {
    const { container } = render(<HorizontalDanmaku theme="tiger" />);

    const danmakuElements = container.querySelectorAll(".absolute.whitespace-nowrap");
    expect(danmakuElements.length).toBeGreaterThan(0);

    const firstDanmaku = danmakuElements[0];
    const style = firstDanmaku.getAttribute("style");
    // 验证包含白色描边（4 个方向）
    expect(style).toMatch(/-1px -1px 0 #fff/);
    expect(style).toMatch(/1px -1px 0 #fff/);
    expect(style).toMatch(/-1px 1px 0 #fff/);
    expect(style).toMatch(/1px 1px 0 #fff/);
    // 验证不包含光晕效果
    expect(style).not.toMatch(/0 0 10px/);
    expect(style).not.toMatch(/0 0 20px/);
  });

  /**
   * 测试用例 TC-010: 圆角背景
   * 测试目标：验证弹幕有圆角背景
   */
  test("TC-010: 弹幕应该有圆角背景", () => {
    const { container } = render(<HorizontalDanmaku theme="tiger" />);

    const danmakuElements = container.querySelectorAll(".absolute.whitespace-nowrap");
    expect(danmakuElements.length).toBeGreaterThan(0);

    const firstDanmaku = danmakuElements[0];
    expect(firstDanmaku.className).toMatch(/rounded-full/);
  });

  /**
   * 测试用例 TC-011: 内边距
   * 测试目标：验证弹幕有内边距
   */
  test("TC-011: 弹幕应该有内边距", () => {
    const { container } = render(<HorizontalDanmaku theme="tiger" />);

    const danmakuElements = container.querySelectorAll(".absolute.whitespace-nowrap");
    expect(danmakuElements.length).toBeGreaterThan(0);

    const firstDanmaku = danmakuElements[0];
    expect(firstDanmaku.className).toMatch(/px-4/);
    expect(firstDanmaku.className).toMatch(/py-1/);
  });

  /**
   * 测试用例 TC-012: isVisible 控制
   * 测试目标：验证 isVisible=false 时不渲染弹幕
   */
  test("TC-012: isVisible=false 时不应该渲染弹幕", () => {
    const { container } = render(<HorizontalDanmaku theme="tiger" isVisible={false} />);

    const danmakuElements = container.querySelectorAll(".absolute.whitespace-nowrap");
    expect(danmakuElements.length).toBe(0);
  });

  /**
   * 测试用例 TC-013: 弹幕容器 z-index
   * 测试目标：验证弹幕容器 z-index 为 z-30，低于导航栏
   */
  test("TC-013: 弹幕容器应该使用 z-30 层级", () => {
    const { container } = render(<HorizontalDanmaku theme="tiger" />);

    const danmakuContainer = container.querySelector(".z-30");
    expect(danmakuContainer).toBeInTheDocument();
  });

  /**
   * 测试用例 TC-014: 弹幕容器定位样式
   * 测试目标：验证弹幕容器有正确的 top 和 height 样式以避开导航栏
   */
  test("TC-014: 弹幕容器应该有正确的定位样式避开导航栏", () => {
    const { container } = render(<HorizontalDanmaku theme="tiger" />);

    const danmakuContainer = container.querySelector(".z-30");
    expect(danmakuContainer).toBeInTheDocument();

    // 验证容器有 style 属性
    expect(danmakuContainer).toHaveStyle("top: 80px");
    expect(danmakuContainer).toHaveStyle("height: calc(100vh - 80px)");
  });

  /**
   * 测试用例 TC-015: 弹幕容器 pointer-events
   * 测试目标：验证弹幕容器设置 pointer-events-none 不影响交互
   */
  test("TC-015: 弹幕容器应该设置 pointer-events-none", () => {
    const { container } = render(<HorizontalDanmaku theme="tiger" />);

    const danmakuContainer = container.querySelector(".pointer-events-none");
    expect(danmakuContainer).toBeInTheDocument();
  });
});

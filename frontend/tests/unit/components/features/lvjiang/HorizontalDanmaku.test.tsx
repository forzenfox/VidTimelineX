import React from "react";
import { render } from "@testing-library/react";
import { HorizontalDanmaku } from "@/features/lvjiang/components/HorizontalDanmaku";
import "@testing-library/jest-dom";
import danmakuData from "@/features/lvjiang/data/danmaku.json";

describe("HorizontalDanmaku 组件测试 - 弹幕可见性优化", () => {
  /**
   * 测试用例 TC-Danmaku-000: 弹幕数量测试
   * 测试目标：验证弹幕数量正确（冬竹主题：dongzhuDanmaku + commonDanmaku）
   */
  test("TC-Danmaku-000: 冬竹主题弹幕数量应该正确", () => {
    const { container } = render(<HorizontalDanmaku theme="dongzhu" isVisible={true} />);

    const danmakuElements = container.querySelectorAll(".absolute.whitespace-nowrap");
    const expectedCount = danmakuData.dongzhuDanmaku.length + danmakuData.commonDanmaku.length;
    expect(danmakuElements.length).toBe(expectedCount);
  });

  /**
   * 测试用例 TC-Danmaku-001: 弹幕数量测试（凯歌主题）
   * 测试目标：验证弹幕数量正确（凯歌主题：kaigeDanmaku + commonDanmaku）
   */
  test("TC-Danmaku-001: 凯歌主题弹幕数量应该正确", () => {
    const { container } = render(<HorizontalDanmaku theme="kaige" isVisible={true} />);

    const danmakuElements = container.querySelectorAll(".absolute.whitespace-nowrap");
    const expectedCount = danmakuData.kaigeDanmaku.length + danmakuData.commonDanmaku.length;
    expect(danmakuElements.length).toBe(expectedCount);
  });

  /**
   * 测试用例 TC-Danmaku-002: 不可见状态测试
   * 测试目标：验证 isVisible=false 时不渲染弹幕
   */
  test("TC-Danmaku-002: isVisible=false 时不应该渲染弹幕", () => {
    const { container } = render(<HorizontalDanmaku theme="dongzhu" isVisible={false} />);

    const danmakuElements = container.querySelectorAll(".absolute.whitespace-nowrap");
    expect(danmakuElements.length).toBe(0);
  });

  /**
   * 测试用例 TC-Danmaku-003: 字体大小测试
   * 测试目标：验证不同主题下弹幕字体大小正确
   */
  test("TC-Danmaku-003: 冬竹主题字体大小应该是 20px", () => {
    const { container } = render(<HorizontalDanmaku theme="dongzhu" isVisible={true} />);

    const danmakuElements = container.querySelectorAll(".absolute.whitespace-nowrap");
    expect(danmakuElements.length).toBeGreaterThan(0);

    const firstDanmaku = danmakuElements[0];
    expect(firstDanmaku).toHaveStyle("font-size: 20px");
  });

  test("TC-Danmaku-004: 凯歌主题字体大小应该是 22px", () => {
    const { container } = render(<HorizontalDanmaku theme="kaige" isVisible={true} />);

    const danmakuElements = container.querySelectorAll(".absolute.whitespace-nowrap");
    expect(danmakuElements.length).toBeGreaterThan(0);

    const firstDanmaku = danmakuElements[0];
    expect(firstDanmaku).toHaveStyle("font-size: 22px");
  });

  /**
   * 测试用例 TC-Danmaku-005: 文字颜色测试
   * 测试目标：验证不同主题下弹幕文字颜色正确
   */
  test("TC-Danmaku-005: 冬竹主题文字颜色应该是深蓝色 #1A5276", () => {
    const { container } = render(<HorizontalDanmaku theme="dongzhu" isVisible={true} />);

    const danmakuElements = container.querySelectorAll(".absolute.whitespace-nowrap");
    expect(danmakuElements.length).toBeGreaterThan(0);

    const firstDanmaku = danmakuElements[0];
    expect(firstDanmaku).toHaveStyle("color: #1A5276");
  });

  test("TC-Danmaku-006: 凯歌主题文字颜色应该是深橙色 #B9770E", () => {
    const { container } = render(<HorizontalDanmaku theme="kaige" isVisible={true} />);

    const danmakuElements = container.querySelectorAll(".absolute.whitespace-nowrap");
    expect(danmakuElements.length).toBeGreaterThan(0);

    const firstDanmaku = danmakuElements[0];
    expect(firstDanmaku).toHaveStyle("color: #B9770E");
  });

  /**
   * 测试用例 TC-Danmaku-007: 文字阴影测试（白色描边）
   * 测试目标：验证弹幕文字包含白色描边效果，无光晕
   */
  test("TC-Danmaku-007: 弹幕应该包含白色描边的文字阴影", () => {
    const { container } = render(<HorizontalDanmaku theme="dongzhu" isVisible={true} />);

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
   * 测试用例 TC-Danmaku-008: 弹幕轨道分布测试
   * 测试目标：验证弹幕均匀分布在 8 条轨道上
   */
  test("TC-Danmaku-008: 弹幕应该均匀分布在 8 条轨道上", () => {
    const { container } = render(<HorizontalDanmaku theme="dongzhu" isVisible={true} />);

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
   * 测试用例 TC-Danmaku-009: 动画参数测试
   * 测试目标：验证弹幕动画参数正确（duration 单位为秒）
   */
  test("TC-Danmaku-009: 弹幕动画 duration 应该以秒为单位", () => {
    const { container } = render(<HorizontalDanmaku theme="dongzhu" isVisible={true} />);

    const danmakuElements = container.querySelectorAll(".absolute.whitespace-nowrap");
    expect(danmakuElements.length).toBeGreaterThan(0);

    const firstDanmaku = danmakuElements[0];
    const style = firstDanmaku.getAttribute("style");
    // 验证 animation 属性包含以秒为单位的 duration（如 6s, 7.5s, 8s）
    expect(style).toMatch(/animation:.*danmaku\s+\d+(\.\d+)?s/);
  });

  /**
   * 测试用例 TC-Danmaku-010: 字体粗细测试
   * 测试目标：验证弹幕字体加粗
   */
  test("TC-Danmaku-010: 弹幕字体应该是加粗的", () => {
    const { container } = render(<HorizontalDanmaku theme="dongzhu" isVisible={true} />);

    const danmakuElements = container.querySelectorAll(".absolute.whitespace-nowrap");
    expect(danmakuElements.length).toBeGreaterThan(0);

    const firstDanmaku = danmakuElements[0];
    expect(firstDanmaku).toHaveStyle("font-weight: 800");
  });

  /**
   * 测试用例 TC-Danmaku-011: 字符间距测试
   * 测试目标：验证弹幕字符间距适中
   */
  test("TC-Danmaku-011: 弹幕字符间距应该适中", () => {
    const { container } = render(<HorizontalDanmaku theme="dongzhu" isVisible={true} />);

    const danmakuElements = container.querySelectorAll(".absolute.whitespace-nowrap");
    expect(danmakuElements.length).toBeGreaterThan(0);

    const firstDanmaku = danmakuElements[0];
    expect(firstDanmaku).toHaveStyle("letter-spacing: 0.5px");
  });

  /**
   * 测试用例 TC-Danmaku-012: 圆角背景测试
   * 测试目标：验证弹幕背景有圆角效果
   */
  test("TC-Danmaku-012: 弹幕应该有圆角背景", () => {
    const { container } = render(<HorizontalDanmaku theme="dongzhu" isVisible={true} />);

    const danmakuElements = container.querySelectorAll(".absolute.whitespace-nowrap");
    expect(danmakuElements.length).toBeGreaterThan(0);

    const firstDanmaku = danmakuElements[0];
    expect(firstDanmaku.className).toMatch(/rounded-full/);
  });

  /**
   * 测试用例 TC-Danmaku-013: 内边距测试
   * 测试目标：验证弹幕有内边距
   */
  test("TC-Danmaku-013: 弹幕应该有内边距", () => {
    const { container } = render(<HorizontalDanmaku theme="dongzhu" isVisible={true} />);

    const danmakuElements = container.querySelectorAll(".absolute.whitespace-nowrap");
    expect(danmakuElements.length).toBeGreaterThan(0);

    const firstDanmaku = danmakuElements[0];
    expect(firstDanmaku.className).toMatch(/px-4/);
    expect(firstDanmaku.className).toMatch(/py-1/);
  });

  /**
   * 测试用例 TC-Danmaku-014: 容器样式测试
   * 测试目标：验证弹幕容器覆盖整个视口（参照甜筒页面）
   */
  test("TC-Danmaku-014: 弹幕容器应该覆盖整个视口", () => {
    const { container } = render(<HorizontalDanmaku theme="dongzhu" isVisible={true} />);

    const danmakuContainer = container.querySelector(".fixed.inset-0");
    expect(danmakuContainer).toBeInTheDocument();
    expect(danmakuContainer).toHaveClass("z-31");
  });

  /**
   * 测试用例 TC-Danmaku-015: 弹幕透明度测试
   * 测试目标：验证弹幕初始透明度为 1，确保文字清晰可见
   */
  test("TC-Danmaku-015: 弹幕初始透明度应该为 1，确保文字清晰可见", () => {
    const { container } = render(<HorizontalDanmaku theme="dongzhu" isVisible={true} />);

    const danmakuElements = container.querySelectorAll(".absolute.whitespace-nowrap");
    expect(danmakuElements.length).toBeGreaterThan(0);

    const firstDanmaku = danmakuElements[0];
    // 验证行内样式中 opacity 为 1
    expect(firstDanmaku).toHaveStyle("opacity: 1");
  });
});

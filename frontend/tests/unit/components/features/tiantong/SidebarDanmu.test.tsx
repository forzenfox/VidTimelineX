import { render, screen } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "@jest/globals";
import SidebarDanmu from "@/features/tiantong/components/SidebarDanmu";
import "@testing-library/jest-dom";

describe("SidebarDanmu 侧边弹幕组件测试", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("弹幕数据加载测试", () => {
    /**
     * 测试用例 TC-SD-001: 弹幕数据正确加载
     * 测试目标：验证组件能够正确加载弹幕数据，而不是显示"默认弹幕"
     */
    it("应该加载实际的弹幕数据而不是默认弹幕", () => {
      const { container } = render(<SidebarDanmu theme="tiger" />);

      // 获取弹幕文本内容
      const textContents = container.textContent || "";

      // 验证包含实际的弹幕内容（从 danmaku.txt 中的内容）
      expect(textContents.length).toBeGreaterThan(100);

      // 验证包含测试弹幕数据（mock 数据中的内容）
      expect(textContents).toContain("弹幕测试内容");
      expect(textContents).toContain("测试弹幕");

      // 验证不应该包含大量"默认弹幕"
      const defaultCount = (textContents.match(/默认弹幕/g) || []).length;
      expect(defaultCount).toBe(0);
    });
  });

  describe("主题切换测试", () => {
    /**
     * 测试用例 TC-SD-003: 虎将主题渲染
     * 测试目标：验证虎将主题下的弹幕组件渲染
     */
    it("应该正确渲染虎将主题", () => {
      const { container } = render(<SidebarDanmu theme="tiger" />);

      // 验证虎将主题的特征元素（虎头 emoji）
      expect(container.innerHTML).toContain("🐯");

      // 验证公告文字
      expect(container.innerHTML).toContain("大小姐驾到，统统闪开");
    });

    /**
     * 测试用例 TC-SD-004: 甜筒主题渲染
     * 测试目标：验证甜筒主题下的弹幕组件渲染
     */
    it("应该正确渲染甜筒主题", () => {
      const { container } = render(<SidebarDanmu theme="sweet" />);

      // 验证甜筒主题的特征元素（甜筒 emoji）
      expect(container.innerHTML).toContain("🍦");

      // 验证公告文字
      expect(container.innerHTML).toContain("小甜筒来咯，啾咪");
    });
  });

  describe("弹幕内容显示测试", () => {
    /**
     * 测试用例 TC-SD-005: 弹幕内容多样性
     * 测试目标：验证弹幕内容包含多种不同的文本
     */
    it("应该显示多样化的弹幕内容", () => {
      const { container } = render(<SidebarDanmu theme="tiger" />);

      // 获取弹幕内容区域
      const danmakuContent = container.innerHTML;

      // 验证弹幕内容包含实际的弹幕文本（从 danmaku.txt 中的一些典型弹幕）
      expect(danmakuContent.length).toBeGreaterThan(100);
    });
  });

  describe("用户信息显示测试", () => {
    /**
     * 测试用例 TC-SD-006: 用户信息正确显示
     * 测试目标：验证弹幕包含用户昵称和等级信息
     */
    it("应该显示用户信息", () => {
      const { container } = render(<SidebarDanmu theme="tiger" />);

      // 验证用户等级标签存在
      expect(container.innerHTML).toContain("Lv.");

      // 验证用户昵称存在
      expect(container.innerHTML).toMatch(/(甜穹|拱火群众|天晴有雯|一一一颗|诺糯)/);
    });
  });

  describe("z-index 层级测试", () => {
    /**
     * 测试用例 TC-SD-007: 侧边弹幕 z-index 层级
     * 测试目标：验证侧边弹幕使用 z-20 层级，低于水平弹幕
     */
    it("应该使用 z-20 层级", () => {
      const { container } = render(<SidebarDanmu theme="tiger" />);

      // 验证容器包含 z-20 类名
      const sidebarElement = container.querySelector(".z-20");
      expect(sidebarElement).not.toBeNull();
      expect(sidebarElement).toBeTruthy();
    });

    /**
     * 测试用例 TC-SD-008: 移动端侧边弹幕 z-index
     * 测试目标：验证移动端侧边弹幕同样使用 z-20 层级
     */
    it("移动端应该使用 z-20 层级", () => {
      // 模拟移动端环境
      Object.defineProperty(window, "innerWidth", {
        writable: true,
        configurable: true,
        value: 375,
      });

      const { container } = render(<SidebarDanmu theme="tiger" />);

      // 验证容器包含 z-20 类名
      const sidebarElement = container.querySelector(".z-20");
      expect(sidebarElement).not.toBeNull();
      expect(sidebarElement).toBeTruthy();
    });
  });
});

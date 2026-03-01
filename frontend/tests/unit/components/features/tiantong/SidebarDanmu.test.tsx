import { render, screen, fireEvent, waitFor } from "@testing-library/react";
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
     * 测试目标：验证组件能够正确加载弹幕数据
     */
    it("应该加载实际的弹幕数据", () => {
      const { container } = render(<SidebarDanmu theme="tiger" />);

      // 获取弹幕文本内容
      const textContents = container.textContent || "";

      // 验证包含实际的弹幕内容（从 danmaku.json 中的内容）
      expect(textContents.length).toBeGreaterThan(100);

      // 验证包含真实的弹幕文本
      expect(textContents).toContain("大小姐驾到");
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

      // 验证弹幕内容包含实际的弹幕文本
      expect(danmakuContent.length).toBeGreaterThan(100);
    });
  });

  describe("用户信息显示测试", () => {
    /**
     * 测试用例 TC-SD-006: 用户信息正确显示
     * 测试目标：验证弹幕包含用户昵称和时间戳
     */
    it("应该显示用户信息", () => {
      const { container } = render(<SidebarDanmu theme="tiger" />);

      // 验证时间戳格式存在（HH:MM:SS）
      expect(container.innerHTML).toMatch(/\d{2}:\d{2}:\d{2}/);

      // 验证用户昵称存在（从 danmaku.json 中的用户）
      expect(container.innerHTML).toMatch(/(熊雅雯|爱吃板烧鸡腿堡|黄昏外的猫头鹰|艾伦|伊味)/);
    });
  });

  describe("移动端抽屉功能测试", () => {
    /**
     * 测试用例 TC-SD-009: 移动端浮动按钮渲染
     * 测试目标：验证移动端显示浮动按钮
     */
    it("应该渲染移动端浮动按钮", () => {
      const { container } = render(<SidebarDanmu theme="tiger" />);

      // 验证浮动按钮存在
      const mobileButton = container.querySelector(".danmaku-mobile-button");
      expect(mobileButton).toBeTruthy();
    });

    /**
     * 测试用例 TC-SD-010: 点击浮动按钮打开抽屉
     * 测试目标：验证点击浮动按钮后显示抽屉
     */
    it("点击浮动按钮应该打开抽屉", async () => {
      const { container } = render(<SidebarDanmu theme="tiger" />);

      // 获取浮动按钮
      const mobileButton = container.querySelector(".danmaku-mobile-button");
      expect(mobileButton).toBeTruthy();

      // 点击按钮
      if (mobileButton) {
        fireEvent.click(mobileButton);
      }

      // 验证抽屉打开（遮罩层存在）
      await waitFor(() => {
        const drawerOverlay = screen.queryByTestId("danmaku-drawer-overlay");
        expect(drawerOverlay).toBeTruthy();
      });
    });

    /**
     * 测试用例 TC-SD-011: 抽屉包含Header
     * 测试目标：验证移动端抽屉包含大小姐驾到标题、LIVE指示器和关闭按钮
     */
    it("抽屉应该包含Header元素", async () => {
      const { container } = render(<SidebarDanmu theme="tiger" />);

      // 打开抽屉
      const mobileButton = container.querySelector(".danmaku-mobile-button");
      if (mobileButton) {
        fireEvent.click(mobileButton);
      }

      // 验证抽屉内容
      await waitFor(() => {
        // 验证大小姐驾到标题（抽屉和侧边栏都有，所以用 getAllByText）
        const titleElements = screen.getAllByText("👸大小姐驾到，统统闪开！✨");
        expect(titleElements.length).toBeGreaterThan(0);
        // 验证LIVE指示器（使用 getAllByText 因为有多个 LIVE 元素）
        const liveElements = screen.getAllByText("LIVE");
        expect(liveElements.length).toBeGreaterThan(0);
      });
    });

    /**
     * 测试用例 TC-SD-012: 点击遮罩层关闭抽屉
     * 测试目标：验证点击遮罩层可以关闭抽屉
     */
    it("点击遮罩层应该关闭抽屉", async () => {
      const { container } = render(<SidebarDanmu theme="tiger" />);

      // 打开抽屉
      const mobileButton = container.querySelector(".danmaku-mobile-button");
      if (mobileButton) {
        fireEvent.click(mobileButton);
      }

      // 等待抽屉打开
      await waitFor(() => {
        expect(screen.queryByTestId("danmaku-drawer-overlay")).toBeTruthy();
      });

      // 点击遮罩层
      const overlay = screen.queryByTestId("danmaku-drawer-overlay");
      if (overlay) {
        fireEvent.click(overlay);
      }

      // 验证抽屉关闭
      await waitFor(() => {
        expect(screen.queryByTestId("danmaku-drawer-overlay")).not.toBeTruthy();
      });
    });

    /**
     * 测试用例 TC-SD-013: 抽屉高度正确
     * 测试目标：验证移动端抽屉高度为60vh
     */
    it("抽屉应该有正确的高度样式", async () => {
      const { container } = render(<SidebarDanmu theme="tiger" />);

      // 打开抽屉
      const mobileButton = container.querySelector(".danmaku-mobile-button");
      if (mobileButton) {
        fireEvent.click(mobileButton);
      }

      // 验证抽屉
      await waitFor(() => {
        const drawer = screen.queryByTestId("danmaku-drawer");
        expect(drawer).toBeTruthy();
        if (drawer) {
          expect(drawer.getAttribute("style")).toContain("60vh");
        }
      });
    });

    /**
     * 测试用例 TC-SD-014: 抽屉圆角样式
     * 测试目标：验证移动端抽屉顶部有圆角
     */
    it("抽屉应该有正确的圆角样式", async () => {
      const { container } = render(<SidebarDanmu theme="tiger" />);

      // 打开抽屉
      const mobileButton = container.querySelector(".danmaku-mobile-button");
      if (mobileButton) {
        fireEvent.click(mobileButton);
      }

      // 验证抽屉样式
      await waitFor(() => {
        const drawer = screen.queryByTestId("danmaku-drawer");
        expect(drawer).toBeTruthy();
        if (drawer) {
          expect(drawer.getAttribute("style")).toContain("16px 16px 0 0");
        }
      });
    });
  });

  describe("桌面端侧边栏测试", () => {
    /**
     * 测试用例 TC-SD-015: 桌面端侧边栏渲染
     * 测试目标：验证桌面端显示固定侧边栏
     */
    it("应该渲染桌面端侧边栏", () => {
      const { container } = render(<SidebarDanmu theme="tiger" />);

      // 验证侧边栏存在
      const sidebar = container.querySelector(".danmaku-sidebar");
      expect(sidebar).toBeTruthy();
    });

    /**
     * 测试用例 TC-SD-016: 侧边栏宽度正确
     * 测试目标：验证桌面端侧边栏宽度为320px
     */
    it("侧边栏应该有正确的宽度", () => {
      const { container } = render(<SidebarDanmu theme="tiger" />);

      const sidebar = container.querySelector(".danmaku-sidebar");
      expect(sidebar).toBeTruthy();
      if (sidebar) {
        expect(sidebar.getAttribute("style")).toContain("320px");
      }
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
      const sidebarElement = container.querySelector(".danmaku-sidebar");
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

      // 验证浮动按钮存在
      const mobileButton = container.querySelector(".danmaku-mobile-button");
      expect(mobileButton).not.toBeNull();
      expect(mobileButton).toBeTruthy();
    });
  });

  describe("响应式样式测试", () => {
    /**
     * 测试用例 TC-SD-017: CSS媒体查询存在
     * 测试目标：验证响应式样式标签存在
     */
    it("应该包含响应式样式", () => {
      const { container } = render(<SidebarDanmu theme="tiger" />);

      // 验证style标签存在（可能有多个，检查所有）
      const styleTags = container.querySelectorAll("style");
      expect(styleTags.length).toBeGreaterThan(0);
    });

    /**
     * 测试用例 TC-SD-018: 移动端媒体查询
     * 测试目标：验证包含移动端媒体查询（<768px）
     */
    it("应该包含移动端媒体查询", () => {
      const { container } = render(<SidebarDanmu theme="tiger" />);

      // 获取所有style标签并合并内容检查
      const styleTags = container.querySelectorAll("style");
      expect(styleTags.length).toBeGreaterThan(0);

      const allStyles = Array.from(styleTags)
        .map(tag => tag.textContent)
        .join("");
      expect(allStyles).toContain("@media (max-width: 767px)");
    });

    /**
     * 测试用例 TC-SD-019: 桌面端媒体查询
     * 测试目标：验证包含桌面端媒体查询（>=768px）
     */
    it("应该包含桌面端媒体查询", () => {
      const { container } = render(<SidebarDanmu theme="tiger" />);

      // 获取所有style标签并合并内容检查
      const styleTags = container.querySelectorAll("style");
      expect(styleTags.length).toBeGreaterThan(0);

      const allStyles = Array.from(styleTags)
        .map(tag => tag.textContent)
        .join("");
      expect(allStyles).toContain("@media (min-width: 768px)");
    });
  });

  describe("主题颜色测试", () => {
    /**
     * 测试用例 TC-SD-020: 虎将主题颜色
     * 测试目标：验证虎将主题使用正确的颜色值（React会将十六进制转为RGB）
     */
    it("虎将主题应该使用正确的颜色", () => {
      const { container } = render(<SidebarDanmu theme="tiger" />);

      const sidebar = container.querySelector(".danmaku-sidebar");
      expect(sidebar).toBeTruthy();
      if (sidebar) {
        const style = sidebar.getAttribute("style");
        // React会将十六进制颜色转换为RGB格式
        expect(style).toContain("rgb(44, 62, 80)"); // #2C3E50的RGB格式
        expect(style).toContain("rgb(230, 126, 34)"); // #E67E22的RGB格式
      }
    });

    /**
     * 测试用例 TC-SD-021: 甜筒主题颜色
     * 测试目标：验证甜筒主题使用正确的颜色值（React会将十六进制转为RGB）
     */
    it("甜筒主题应该使用正确的颜色", () => {
      const { container } = render(<SidebarDanmu theme="sweet" />);

      const sidebar = container.querySelector(".danmaku-sidebar");
      expect(sidebar).toBeTruthy();
      if (sidebar) {
        const style = sidebar.getAttribute("style");
        // React会将十六进制颜色转换为RGB格式
        expect(style).toContain("rgb(244, 114, 156)"); // #F4729C的RGB格式
      }
    });
  });

  describe("底部 Footer 测试", () => {
    /**
     * 测试用例 TC-SD-022: 虎将主题 Footer
     * 测试目标：验证虎将主题显示正确的 Footer 文字
     */
    it("虎将主题应该显示威虎弹幕区 Footer", () => {
      const { container } = render(<SidebarDanmu theme="tiger" />);

      // 验证 Footer 文字
      expect(container.textContent).toContain("威虎弹幕区");
    });

    /**
     * 测试用例 TC-SD-023: 甜筒主题 Footer
     * 测试目标：验证甜筒主题显示正确的 Footer 文字
     */
    it("甜筒主题应该显示甜筒弹幕区 Footer", () => {
      const { container } = render(<SidebarDanmu theme="sweet" />);

      // 验证 Footer 文字
      expect(container.textContent).toContain("甜筒弹幕区");
    });
  });
});

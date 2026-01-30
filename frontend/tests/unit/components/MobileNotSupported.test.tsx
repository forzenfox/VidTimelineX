import React from "react";
import { render, screen, cleanup } from "@testing-library/react";
import MobileNotSupported from "@/components/MobileNotSupported";
import "@testing-library/jest-dom";

describe("MobileNotSupported组件测试", () => {
  /**
   * 测试用例 TC-001: 组件正常渲染测试
   * 测试目标：验证MobileNotSupported组件能够正确渲染
   * 测试场景：用户使用移动设备访问网站时
   */
  test("TC-001: 组件正常渲染测试", () => {
    render(<MobileNotSupported />);

    expect(screen.getByText("移动端暂不支持")).toBeInTheDocument();
    expect(screen.getByText("建议使用PC端访问")).toBeInTheDocument();
  });

  /**
   * 测试用例 TC-002: 图标元素渲染测试
   * 测试目标：验证组件中的图标元素正确显示
   * 测试场景：组件加载时显示所有必要的图标
   */
  test("TC-002: 图标元素渲染测试", () => {
    const { container } = render(<MobileNotSupported />);

    const smartphoneIcon = container.querySelector("svg");
    expect(smartphoneIcon).toBeInTheDocument();

    const monitorIcon = container.querySelector('[data-lucide="monitor"]');
    expect(monitorIcon).toBeInTheDocument();
  });

  /**
   * 测试用例 TC-003: 主要文本内容测试
   * 测试目标：验证组件的主要文本内容正确显示
   * 测试场景：用户看到提示信息时能够理解内容
   */
  test("TC-003: 主要文本内容测试", () => {
    render(<MobileNotSupported />);

    expect(screen.getByText("本网站目前仅支持桌面端和平板端访问，移动端体验可能不佳。")).toBeInTheDocument();
    expect(screen.getByText("为了获得最佳体验，请使用电脑或平板设备访问本网站")).toBeInTheDocument();
  });

  /**
   * 测试用例 TC-004: 功能特点展示测试
   * 测试目标：验证组件展示网站的主要功能特点
   * 测试场景：用户了解网站支持的功能
   */
  test("TC-004: 功能特点展示测试", () => {
    render(<MobileNotSupported />);

    expect(screen.getByText("高清视频")).toBeInTheDocument();
    expect(screen.getByText("弹幕互动")).toBeInTheDocument();
    expect(screen.getByText("主题切换")).toBeInTheDocument();
    expect(screen.getByText("智能搜索")).toBeInTheDocument();
  });

  /**
   * 测试用例 TC-005: 页脚信息测试
   * 测试目标：验证组件的页脚信息正确显示
   * 测试场景：用户查看页面底部时能看到版权信息
   */
  test("TC-005: 页脚信息测试", () => {
    render(<MobileNotSupported />);

    expect(screen.getByText(/© 2026 哔哩哔哩时间线/)).toBeInTheDocument();
    expect(screen.getByText("探索精彩视频内容")).toBeInTheDocument();
  });

  /**
   * 测试用例 TC-006: 响应式布局测试
   * 测试目标：验证组件在不同屏幕尺寸下的布局表现
   * 测试场景：用户使用不同尺寸的移动设备访问
   */
  test("TC-006: 响应式布局测试", () => {
    const { container } = render(<MobileNotSupported />);

    const mainContainer = container.querySelector(".min-h-screen");
    expect(mainContainer).toBeInTheDocument();

    const flexContainer = container.querySelector(".flex.items-center.justify-center");
    expect(flexContainer).toBeInTheDocument();
  });

  /**
   * 测试用例 TC-007: 卡片容器测试
   * 测试目标：验证组件的卡片容器正确渲染
   * 测试场景：主要内容区域以卡片形式展示
   */
  test("TC-007: 卡片容器测试", () => {
    const { container } = render(<MobileNotSupported />);

    const cardContainer = container.querySelector(".bg-white.rounded-3xl");
    expect(cardContainer).toBeInTheDocument();

    const shadowElement = container.querySelector(".shadow-2xl");
    expect(shadowElement).toBeInTheDocument();
  });

  /**
   * 测试用例 TC-008: 渐变背景测试
   * 测试目标：验证组件使用渐变背景
   * 测试场景：页面加载时显示美观的渐变背景
   */
  test("TC-008: 渐变背景测试", () => {
    const { container } = render(<MobileNotSupported />);

    const gradientElement = container.querySelector(".bg-gradient-to-br");
    expect(gradientElement).toBeInTheDocument();
  });

  /**
   * 测试用例 TC-009: 图标容器测试
   * 测试目标：验证组件顶部的图标容器正确显示
   * 测试场景：用户看到提示图标和警告标识
   */
  test("TC-009: 图标容器测试", () => {
    const { container } = render(<MobileNotSupported />);

    const iconContainer = container.querySelector(".relative");
    expect(iconContainer).toBeInTheDocument();

    const alertCircle = container.querySelector(".bg-red-500.rounded-full");
    expect(alertCircle).toBeInTheDocument();
  });

  /**
   * 测试用例 TC-010: 功能特点网格测试
   * 测试目标：验证功能特点以网格形式展示
   * 测试场景：四个功能特点以2x2网格排列
   */
  test("TC-010: 功能特点网格测试", () => {
    const { container } = render(<MobileNotSupported />);

    const gridContainer = container.querySelector(".grid.grid-cols-2");
    expect(gridContainer).toBeInTheDocument();

    const featureItems = container.querySelectorAll(".bg-gray-50.rounded-xl");
    expect(featureItems.length).toBe(4);
  });

  /**
   * 测试用例 TC-011: 功能特点图标测试
   * 测试目标：验证每个功能特点都有对应的图标
   * 测试场景：用户通过图标快速识别功能
   */
  test("TC-011: 功能特点图标测试", () => {
    render(<MobileNotSupported />);

    const emojiElements = screen.getAllByText(/^[🎬💬🎨🔍]$/);
    expect(emojiElements.length).toBeGreaterThanOrEqual(4);
  });

  /**
   * 测试用例 TC-012: 边框样式测试
   * 测试目标：验证组件的边框样式正确应用
   * 测试场景：卡片有适当的边框和圆角
   */
  test("TC-012: 边框样式测试", () => {
    const { container } = render(<MobileNotSupported />);

    const cardElement = container.querySelector(".border.border-gray-100");
    expect(cardElement).toBeInTheDocument();

    const roundedElement = container.querySelector(".rounded-3xl");
    expect(roundedElement).toBeInTheDocument();
  });

  /**
   * 测试用例 TC-013: 文本颜色测试
   * 测试目标：验证组件的文本颜色符合设计规范
   * 测试场景：文本具有良好的可读性
   */
  test("TC-013: 文本颜色测试", () => {
    const { container } = render(<MobileNotSupported />);

    const titleElement = container.querySelector(".text-2xl.font-bold");
    expect(titleElement).toBeInTheDocument();

    const descriptionElement = container.querySelector(".text-gray-600");
    expect(descriptionElement).toBeInTheDocument();
  });

  /**
   * 测试用例 TC-014: 内边距测试
   * 测试目标：验证组件的内边距设置合理
   * 测试场景：内容有适当的间距
   */
  test("TC-014: 内边距测试", () => {
    const { container } = render(<MobileNotSupported />);

    const paddingElements = container.querySelectorAll(".p-4, .p-6, .p-8");
    expect(paddingElements.length).toBeGreaterThan(0);
  });

  /**
   * 测试用例 TC-015: 外边距测试
   * 测试目标：验证组件的外边距设置合理
   * 测试场景：元素之间有适当的间距
   */
  test("TC-015: 外边距测试", () => {
    const { container } = render(<MobileNotSupported />);

    const marginElements = container.querySelectorAll(".mb-3, .mb-6, .mt-16");
    expect(marginElements.length).toBeGreaterThan(0);
  });

  /**
   * 测试用例 TC-016: 最大宽度测试
   * 测试目标：验证组件在移动设备上的最大宽度限制
   * 测试场景：组件在小屏幕上不会溢出
   */
  test("TC-016: 最大宽度测试", () => {
    const { container } = render(<MobileNotSupported />);

    const maxWidthElement = container.querySelector(".max-w-md");
    expect(maxWidthElement).toBeInTheDocument();
  });

  /**
   * 测试用例 TC-017: 无障碍属性测试
   * 测试目标：验证组件包含必要的无障碍属性
   * 测试场景：使用屏幕阅读器的用户能够访问
   */
  test("TC-017: 无障碍属性测试", () => {
    render(<MobileNotSupported />);

    const headingElement = screen.getByRole("heading", { level: 1 });
    expect(headingElement).toBeInTheDocument();
  });

  /**
   * 测试用例 TC-018: 建议区域测试
   * 测试目标：验证建议区域的样式和内容
   * 测试场景：用户看到使用建议
   */
  test("TC-018: 建议区域测试", () => {
    render(<MobileNotSupported />);

    const suggestionArea = screen.getByText("建议使用PC端访问");
    expect(suggestionArea).toBeInTheDocument();

    const monitorIcon = screen.getByLabelText("monitor icon");
    expect(monitorIcon).toBeInTheDocument();
  });

  /**
   * 测试用例 TC-019: 联系信息测试
   * 测试目标：验证联系管理员的信息显示
   * 测试场景：用户需要帮助时能够看到联系信息
   */
  test("TC-019: 联系信息测试", () => {
    render(<MobileNotSupported />);

    const contactInfo = screen.getByText("如有疑问，请联系网站管理员");
    expect(contactInfo).toBeInTheDocument();
  });

  /**
   * 测试用例 TC-020: 组件结构完整性测试
   * 测试目标：验证组件的DOM结构完整且层次清晰
   * 测试场景：组件的所有关键元素都存在
   */
  test("TC-020: 组件结构完整性测试", () => {
    const { container } = render(<MobileNotSupported />);

    expect(container.querySelector(".min-h-screen")).toBeInTheDocument();
    expect(container.querySelector(".bg-gradient-to-br")).toBeInTheDocument();
    expect(container.querySelector(".flex.items-center")).toBeInTheDocument();
    expect(container.querySelector(".bg-white.rounded-3xl")).toBeInTheDocument();
    expect(container.querySelector(".shadow-2xl")).toBeInTheDocument();
  });

  /**
   * 测试用例 TC-021: 文本内容准确性测试
   * 测试目标：验证组件中的所有文本内容准确无误
   * 测试场景：用户阅读提示信息时不会产生误解
   */
  test("TC-021: 文本内容准确性测试", () => {
    render(<MobileNotSupported />);

    expect(screen.getByText("移动端暂不支持")).toBeInTheDocument();
    expect(screen.getByText("本网站目前仅支持桌面端和平板端访问，移动端体验可能不佳。")).toBeInTheDocument();
    expect(screen.getByText("为了获得最佳体验，请使用电脑或平板设备访问本网站")).toBeInTheDocument();
    expect(screen.getByText("高清视频")).toBeInTheDocument();
    expect(screen.getByText("弹幕互动")).toBeInTheDocument();
    expect(screen.getByText("主题切换")).toBeInTheDocument();
    expect(screen.getByText("智能搜索")).toBeInTheDocument();
    expect(screen.getByText("如有疑问，请联系网站管理员")).toBeInTheDocument();
  });

  /**
   * 测试用例 TC-022: 组件可访问性测试
   * 测试目标：验证组件对辅助技术的支持
   * 测试场景：使用键盘导航的用户能够操作
   */
  test("TC-022: 组件可访问性测试", () => {
    render(<MobileNotSupported />);

    const mainElement = screen.getByRole("heading", { level: 1 });
    expect(mainElement).toBeInTheDocument();

    const footerElement = screen.getByText(/© 2026 哔哩哔哩时间线/);
    expect(footerElement).toBeInTheDocument();
  });

  /**
   * 测试用例 TC-023: 样式一致性测试
   * 测试目标：验证组件的样式与设计规范一致
   * 测试场景：组件的视觉效果符合项目设计
   */
  test("TC-023: 样式一致性测试", () => {
    const { container } = render(<MobileNotSupported />);

    const blueGradient = container.querySelector(".from-blue-50");
    expect(blueGradient).toBeInTheDocument();

    const purpleGradient = container.querySelector(".to-purple-50");
    expect(purpleGradient).toBeInTheDocument();

    const pinkGradient = container.querySelector(".to-pink-50");
    expect(pinkGradient).toBeInTheDocument();
  });

  /**
   * 测试用例 TC-024: 组件性能测试
   * 测试目标：验证组件的渲染性能符合要求
   * 测试场景：组件在移动设备上快速加载
   */
  test("TC-024: 组件性能测试", () => {
    const startTime = performance.now();
    render(<MobileNotSupported />);
    const endTime = performance.now();
    const renderTime = endTime - startTime;

    expect(renderTime).toBeLessThan(100);
  });

  /**
   * 测试用例 TC-025: 边界条件测试 - 极小屏幕
   * 测试目标：验证组件在极小屏幕上的表现
   * 测试场景：屏幕宽度小于320px时
   */
  test("TC-025: 边界条件测试 - 极小屏幕", () => {
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 320,
    });

    const { container } = render(<MobileNotSupported />);

    const mainContainer = container.querySelector(".min-h-screen");
    expect(mainContainer).toBeInTheDocument();

    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: window.innerWidth,
    });
  });

  /**
   * 测试用例 TC-026: 边界条件测试 - 标准移动屏幕
   * 测试目标：验证组件在标准移动屏幕上的表现
   * 测试场景：屏幕宽度为375px时
   */
  test("TC-026: 边界条件测试 - 标准移动屏幕", () => {
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 375,
    });

    const { container } = render(<MobileNotSupported />);

    const cardContainer = container.querySelector(".max-w-md");
    expect(cardContainer).toBeInTheDocument();

    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: window.innerWidth,
    });
  });

  /**
   * 测试用例 TC-027: 边界条件测试 - 大屏移动设备
   * 测试目标：验证组件在大屏移动设备上的表现
   * 测试场景：屏幕宽度为414px时
   */
  test("TC-027: 边界条件测试 - 大屏移动设备", () => {
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 414,
    });

    const { container } = render(<MobileNotSupported />);

    const mainContainer = container.querySelector(".min-h-screen");
    expect(mainContainer).toBeInTheDocument();

    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: window.innerWidth,
    });
  });

  /**
   * 测试用例 TC-028: 组件快照测试
   * 测试目标：验证组件的渲染结果与预期一致
   * 测试场景：防止意外的UI变更
   */
  test("TC-028: 组件快照测试", () => {
    const { container } = render(<MobileNotSupported />);

    expect(container.firstChild).toMatchSnapshot();
  });

  /**
   * 测试用例 TC-029: 组件无props测试
   * 测试目标：验证组件不需要props也能正常工作
   * 测试场景：组件作为纯展示组件
   */
  test("TC-029: 组件无props测试", () => {
    const { container } = render(<MobileNotSupported />);

    expect(container.firstChild).toBeInTheDocument();
  });

  /**
   * 测试用例 TC-030: 组件导出测试
   * 测试目标：验证组件正确导出
   * 测试场景：确保组件可以被其他模块导入
   */
  test("TC-030: 组件导出测试", () => {
    expect(typeof MobileNotSupported).toBe("function");
    expect(MobileNotSupported).toBeDefined();
    expect(MobileNotSupported.name).toBe("MobileNotSupported");
  });

  afterEach(() => {
    cleanup();
  });
});
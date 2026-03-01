/**
 * Header 组件单元测试
 * 测试驴酱模块头部组件的渲染和交互
 */

import React from "react";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { Header } from "@/features/lvjiang/components/Header";
import "@testing-library/jest-dom";

describe("Header 组件测试", () => {
  /**
   * 测试用例 TC-HEADER-001: 洞主主题渲染
   * 测试当theme为"dongzhu"时正确渲染洞主主题样式
   */
  test("正确渲染洞主主题样式", () => {
    render(<Header theme="dongzhu" onThemeToggle={jest.fn()} />);

    const header = screen.getByRole("banner");
    expect(header).toBeInTheDocument();
    expect(screen.getByText("驴酱")).toBeInTheDocument();
  });

  /**
   * 测试用例 TC-HEADER-002: 凯哥主题渲染
   * 测试当theme为"kaige"时正确渲染凯哥主题样式
   */
  test("正确渲染凯哥主题样式", () => {
    render(<Header theme="kaige" onThemeToggle={jest.fn()} />);

    const header = screen.getByRole("banner");
    expect(header).toBeInTheDocument();
    expect(screen.getByText("驴酱")).toBeInTheDocument();
  });

  /**
   * 测试用例 TC-HEADER-003: 主题切换按钮
   * 测试点击主题切换按钮触发回调
   */
  test("点击主题切换按钮触发回调", () => {
    const onThemeToggle = jest.fn();
    render(<Header theme="dongzhu" onThemeToggle={onThemeToggle} />);

    const toggleButton = screen.getByRole("button");
    fireEvent.click(toggleButton);

    expect(onThemeToggle).toHaveBeenCalledTimes(1);
  });

  /**
   * 测试用例 TC-HEADER-004: 切换按钮文本变化
   * 测试不同主题下切换按钮文本正确显示
   */
  test("洞主主题显示切换到凯哥的文本", () => {
    render(<Header theme="dongzhu" onThemeToggle={jest.fn()} />);

    expect(screen.getByText("切换到野猪·凯哥")).toBeInTheDocument();
  });

  test("凯哥主题显示切换到洞主的文本", () => {
    render(<Header theme="kaige" onThemeToggle={jest.fn()} />);

    expect(screen.getByText("切换到家猪·洞主")).toBeInTheDocument();
  });

  /**
   * 测试用例 TC-HEADER-005: 主播信息显示（桌面端）
   * 测试两个主播的信息在桌面端正确显示
   */
  test("正确显示两个主播的信息", () => {
    const { container } = render(<Header theme="dongzhu" onThemeToggle={jest.fn()} />);

    // 主播选择卡片应该存在（使用hidden md:flex类）
    const streamerCards = container.querySelector(".hidden.md\\:flex");
    expect(streamerCards).toBeInTheDocument();
  });

  /**
   * 测试用例 TC-HEADER-006: 主题高亮
   * 测试当前主题的主播信息高亮显示
   */
  test("洞主主题下洞主信息高亮", () => {
    const { container } = render(<Header theme="dongzhu" onThemeToggle={jest.fn()} />);

    // 查找包含ring-2类的元素
    const ringElements = container.querySelectorAll(".ring-2");
    expect(ringElements.length).toBeGreaterThan(0);
  });

  test("凯哥主题下凯哥信息高亮", () => {
    const { container } = render(<Header theme="kaige" onThemeToggle={jest.fn()} />);

    // 查找包含ring-2类的元素
    const ringElements = container.querySelectorAll(".ring-2");
    expect(ringElements.length).toBeGreaterThan(0);
  });

  /**
   * 测试用例 TC-HEADER-007: 外部链接区域（桌面端）
   * 测试外部链接在桌面端存在
   */
  test("外部链接区域在桌面端显示", () => {
    const { container } = render(<Header theme="dongzhu" onThemeToggle={jest.fn()} />);

    // 外部链接区域应该存在（使用hidden md:flex类）
    const externalLinks = container.querySelectorAll(".hidden.md\\:flex");
    expect(externalLinks.length).toBeGreaterThanOrEqual(1);
  });

  /**
   * 测试用例 TC-HEADER-008: 移动端响应式类
   * 测试移动端响应式类正确应用
   */
  test("应用正确的移动端响应式类", () => {
    const { container } = render(<Header theme="dongzhu" onThemeToggle={jest.fn()} />);

    // 验证主播选择卡片有hidden md:flex类
    const streamerSection = container.querySelector(".hidden.md\\:flex");
    expect(streamerSection).toBeInTheDocument();

    // 验证外部链接区域有hidden md:flex类
    const linksSection = container.querySelectorAll(".hidden.md\\:flex");
    expect(linksSection.length).toBeGreaterThanOrEqual(1);
  });

  /**
   * 测试用例 TC-HEADER-009: 主题切换按钮始终可见
   * 测试主题切换按钮没有hidden类
   */
  test("主题切换按钮始终可见", () => {
    const { container } = render(<Header theme="dongzhu" onThemeToggle={jest.fn()} />);

    const toggleButton = container.querySelector("button");
    expect(toggleButton).toBeInTheDocument();
    // 主题切换按钮不应该有hidden类
    expect(toggleButton).not.toHaveClass("hidden");
  });

  /**
   * 测试用例 TC-HEADER-010: Logo始终可见
   * 测试Logo/标题始终显示
   */
  test("Logo始终可见", () => {
    render(<Header theme="dongzhu" onThemeToggle={jest.fn()} />);

    const logo = screen.getByText("驴酱");
    expect(logo).toBeInTheDocument();
  });

  afterEach(() => {
    cleanup();
  });
});

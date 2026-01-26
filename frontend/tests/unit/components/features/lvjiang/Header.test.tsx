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
    expect(screen.getByText("歌神洞庭湖")).toBeInTheDocument();
  });

  /**
   * 测试用例 TC-HEADER-002: 凯哥主题渲染
   * 测试当theme为"kaige"时正确渲染凯哥主题样式
   */
  test("正确渲染凯哥主题样式", () => {
    render(<Header theme="kaige" onThemeToggle={jest.fn()} />);

    expect(screen.getByText("狼牙山凯哥")).toBeInTheDocument();
  });

  /**
   * 测试用例 TC-HEADER-003: 主题切换按钮
   * 测试点击主题切换按钮触发回调
   */
  test("点击主题切换按钮触发回调", () => {
    const onThemeToggle = jest.fn();
    render(<Header theme="dongzhu" onThemeToggle={onThemeToggle} />);

    const toggleButton = screen.getByRole("button", { name: /切换到野猪/i });
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
   * 测试用例 TC-HEADER-005: 主播信息显示
   * 测试两个主播的信息都正确显示
   */
  test("正确显示两个主播的信息", () => {
    render(<Header theme="dongzhu" onThemeToggle={jest.fn()} />);

    expect(screen.getByText("歌神洞庭湖")).toBeInTheDocument();
    expect(screen.getByText("白胖·洞主·便利")).toBeInTheDocument();
    expect(screen.getByText("狼牙山凯哥")).toBeInTheDocument();
    expect(screen.getByText("黑胖·凯哥·分开")).toBeInTheDocument();
  });

  /**
   * 测试用例 TC-HEADER-006: 主题高亮
   * 测试当前主题的主播信息高亮显示
   */
  test("洞主主题下洞主信息高亮", () => {
    const { container } = render(<Header theme="dongzhu" onThemeToggle={jest.fn()} />);

    const dongzhuSection = container.querySelectorAll(".px-4.py-2.rounded-xl")[0];
    expect(dongzhuSection).toHaveClass("ring-2");
  });

  test("凯哥主题下凯哥信息高亮", () => {
    const { container } = render(<Header theme="kaige" onThemeToggle={jest.fn()} />);

    const kaigeSection = container.querySelectorAll(".px-4.py-2.rounded-xl")[1];
    expect(kaigeSection).toHaveClass("ring-2");
  });

  afterEach(() => {
    cleanup();
  });
});

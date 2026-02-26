import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Toggle } from "@/components/ui/toggle";
import "@testing-library/jest-dom";

describe("Toggle组件测试", () => {
  /**
   * 测试用例 TC-001: 组件渲染测试
   * 测试目标：验证Toggle组件能够正确渲染
   */
  test("TC-001: 组件渲染测试", () => {
    render(<Toggle>切换按钮</Toggle>);

    expect(screen.getByText("切换按钮")).toBeInTheDocument();
  });

  /**
   * 测试用例 TC-002: 切换状态测试
   * 测试目标：验证Toggle的切换状态能够正确工作
   */
  test("TC-002: 切换状态测试", () => {
    render(<Toggle>切换</Toggle>);

    const toggle = screen.getByText("切换");
    expect(toggle).not.toHaveAttribute("data-state", "on");

    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute("data-state", "on");

    fireEvent.click(toggle);
    expect(toggle).not.toHaveAttribute("data-state", "on");
  });

  /**
   * 测试用例 TC-003: 默认开启测试
   * 测试目标：验证默认开启的Toggle能够正确渲染
   */
  test("TC-003: 默认开启测试", () => {
    render(<Toggle defaultPressed>已选中</Toggle>);

    const toggle = screen.getByText("已选中");
    expect(toggle).toHaveAttribute("data-state", "on");
  });

  /**
   * 测试用例 TC-004: 受控状态测试
   * 测试目标：验证受控Toggle能够正确工作
   */
  test("TC-004: 受控状态测试", () => {
    const { rerender } = render(<Toggle pressed={false}>受控</Toggle>);

    let toggle = screen.getByText("受控");
    expect(toggle).not.toHaveAttribute("data-state", "on");

    rerender(<Toggle pressed={true}>受控</Toggle>);
    toggle = screen.getByText("受控");
    expect(toggle).toHaveAttribute("data-state", "on");
  });

  /**
   * 测试用例 TC-005: 不同变体测试
   * 测试目标：验证不同变体的Toggle能够正确渲染
   */
  test("TC-005: 不同变体测试", () => {
    render(
      <div>
        <Toggle variant="default">默认变体</Toggle>
        <Toggle variant="outline">轮廓变体</Toggle>
      </div>
    );

    expect(screen.getByText("默认变体")).toBeInTheDocument();
    expect(screen.getByText("轮廓变体")).toBeInTheDocument();
  });

  /**
   * 测试用例 TC-006: 不同尺寸测试
   * 测试目标：验证不同尺寸的Toggle能够正确渲染
   */
  test("TC-006: 不同尺寸测试", () => {
    render(
      <div>
        <Toggle size="sm">小尺寸</Toggle>
        <Toggle size="default">默认尺寸</Toggle>
        <Toggle size="lg">大尺寸</Toggle>
      </div>
    );

    expect(screen.getByText("小尺寸")).toBeInTheDocument();
    expect(screen.getByText("默认尺寸")).toBeInTheDocument();
    expect(screen.getByText("大尺寸")).toBeInTheDocument();
  });

  /**
   * 测试用例 TC-007: 禁用状态测试
   * 测试目标：验证禁用状态的Toggle能够正确渲染且不可点击
   */
  test("TC-007: 禁用状态测试", () => {
    const onPressedChange = jest.fn();
    render(
      <Toggle disabled onPressedChange={onPressedChange}>
        禁用
      </Toggle>
    );

    const toggle = screen.getByText("禁用");
    expect(toggle).toBeDisabled();

    fireEvent.click(toggle);
    expect(onPressedChange).not.toHaveBeenCalled();
  });

  /**
   * 测试用例 TC-008: 自定义样式测试
   * 测试目标：验证自定义样式的Toggle能够正确渲染
   */
  test("TC-008: 自定义样式测试", () => {
    render(
      <div>
        <Toggle className="bg-blue-500 text-white">蓝色按钮</Toggle>
        <Toggle className="bg-green-500 text-white">绿色按钮</Toggle>
      </div>
    );

    expect(screen.getByText("蓝色按钮")).toBeInTheDocument();
    expect(screen.getByText("绿色按钮")).toBeInTheDocument();
  });

  /**
   * 测试用例 TC-009: 带图标的Toggle测试
   * 测试目标：验证带图标的Toggle能够正确渲染
   */
  test("TC-009: 带图标的Toggle测试", () => {
    render(
      <Toggle>
        <span>⭐</span>
        收藏
      </Toggle>
    );

    expect(screen.getByText("收藏")).toBeInTheDocument();
    expect(screen.getByText("⭐")).toBeInTheDocument();
  });

  /**
   * 测试用例 TC-010: data-slot属性测试
   * 测试目标：验证Toggle具有正确的data-slot属性
   */
  test("TC-010: data-slot属性测试", () => {
    render(<Toggle>测试</Toggle>);

    const toggle = screen.getByText("测试");
    expect(toggle).toHaveAttribute("data-slot", "toggle");
  });
});

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Button } from "@/components/ui/button";
import "@testing-library/jest-dom";

describe("Button组件测试", () => {
  const mockOnClick = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  /**
   * 测试用例 TC-001: 组件渲染测试
   * 测试目标：验证Button组件能够正确渲染
   */
  test("TC-001: 组件渲染测试", () => {
    render(<Button>测试按钮</Button>);

    expect(screen.getByText("测试按钮")).toBeInTheDocument();
  });

  /**
   * 测试用例 TC-002: 点击事件测试
   * 测试目标：验证点击按钮能够触发onClick回调
   */
  test("TC-002: 点击事件测试", () => {
    render(<Button onClick={mockOnClick}>测试按钮</Button>);

    const button = screen.getByText("测试按钮");
    fireEvent.click(button);

    expect(mockOnClick).toHaveBeenCalled();
  });

  /**
   * 测试用例 TC-003: 禁用状态测试
   * 测试目标：验证禁用状态的按钮能够正确渲染
   */
  test("TC-003: 禁用状态测试", () => {
    render(<Button disabled>禁用按钮</Button>);

    const button = screen.getByText("禁用按钮");
    expect(button).toBeDisabled();
  });

  /**
   * 测试用例 TC-004: 不同变体测试
   * 测试目标：验证不同变体的按钮能够正确渲染
   */
  test("TC-004: 不同变体测试", () => {
    render(
      <div>
        <Button variant="default">默认按钮</Button>
        <Button variant="destructive">危险按钮</Button>
        <Button variant="outline">轮廓按钮</Button>
        <Button variant="secondary">次要按钮</Button>
        <Button variant="ghost">幽灵按钮</Button>
        <Button variant="link">链接按钮</Button>
      </div>
    );

    expect(screen.getByText("默认按钮")).toBeInTheDocument();
    expect(screen.getByText("危险按钮")).toBeInTheDocument();
    expect(screen.getByText("轮廓按钮")).toBeInTheDocument();
    expect(screen.getByText("次要按钮")).toBeInTheDocument();
    expect(screen.getByText("幽灵按钮")).toBeInTheDocument();
    expect(screen.getByText("链接按钮")).toBeInTheDocument();
  });

  /**
   * 测试用例 TC-005: 不同尺寸测试
   * 测试目标：验证不同尺寸的按钮能够正确渲染
   */
  test("TC-005: 不同尺寸测试", () => {
    render(
      <div>
        <Button size="sm">小按钮</Button>
        <Button size="default">中按钮</Button>
        <Button size="lg">大按钮</Button>
        <Button size="icon">
          <span>🔍</span>
        </Button>
      </div>
    );

    expect(screen.getByText("小按钮")).toBeInTheDocument();
    expect(screen.getByText("中按钮")).toBeInTheDocument();
    expect(screen.getByText("大按钮")).toBeInTheDocument();
    expect(screen.getByText("🔍")).toBeInTheDocument();
  });

  /**
   * 测试用例 TC-006: 按钮加载状态测试
   * 测试目标：验证加载状态的按钮能够正确渲染
   */
  test("TC-006: 按钮加载状态测试", () => {
    render(<Button disabled>加载中...</Button>);

    const button = screen.getByText("加载中...");
    expect(button).toBeDisabled();
  });

  /**
   * 测试用例 TC-007: 按钮样式测试
   * 测试目标：验证不同样式的按钮能够正确渲染
   */
  test("TC-007: 按钮样式测试", () => {
    render(
      <div>
        <Button className="bg-blue-500">蓝色按钮</Button>
        <Button className="bg-green-500">绿色按钮</Button>
        <Button className="bg-red-500">红色按钮</Button>
      </div>
    );

    expect(screen.getByText("蓝色按钮")).toBeInTheDocument();
    expect(screen.getByText("绿色按钮")).toBeInTheDocument();
    expect(screen.getByText("红色按钮")).toBeInTheDocument();
  });

  /**
   * 测试用例 TC-008: 按钮焦点测试
   * 测试目标：验证按钮能够正确处理焦点事件
   */
  test("TC-008: 按钮焦点测试", () => {
    const onFocus = jest.fn();
    const onBlur = jest.fn();
    
    render(
      <Button 
        onFocus={onFocus} 
        onBlur={onBlur}
      >
        焦点测试按钮
      </Button>
    );

    const button = screen.getByText("焦点测试按钮");
    fireEvent.focus(button);
    expect(onFocus).toHaveBeenCalled();
    
    fireEvent.blur(button);
    expect(onBlur).toHaveBeenCalled();
  });

  /**
   * 测试用例 TC-009: 按钮键盘事件测试
   * 测试目标：验证按钮能够正确处理键盘事件
   */
  test("TC-009: 按钮键盘事件测试", () => {
    const onKeyDown = jest.fn();
    const onKeyUp = jest.fn();
    
    render(
      <Button 
        onKeyDown={onKeyDown} 
        onKeyUp={onKeyUp}
      >
        键盘测试按钮
      </Button>
    );

    const button = screen.getByText("键盘测试按钮");
    fireEvent.keyDown(button, { key: "Enter" });
    expect(onKeyDown).toHaveBeenCalled();
    
    fireEvent.keyUp(button, { key: "Enter" });
    expect(onKeyUp).toHaveBeenCalled();
  });
});

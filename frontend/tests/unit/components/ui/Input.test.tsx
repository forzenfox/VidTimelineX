import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Input } from "@/components/ui/input";
import "@testing-library/jest-dom";

describe("Input组件测试", () => {
  /**
   * 测试用例 TC-001: 组件渲染测试
   * 测试目标：验证Input组件能够正确渲染
   */
  test("TC-001: 组件渲染测试", () => {
    render(<Input placeholder="请输入内容" />);

    const input = screen.getByPlaceholderText("请输入内容");
    expect(input).toBeInTheDocument();
  });

  /**
   * 测试用例 TC-002: 输入功能测试
   * 测试目标：验证Input组件能够正确接收输入
   */
  test("TC-002: 输入功能测试", () => {
    render(<Input placeholder="请输入内容" />);

    const input = screen.getByPlaceholderText("请输入内容");
    fireEvent.change(input, { target: { value: "测试输入" } });

    expect(input).toHaveValue("测试输入");
  });

  /**
   * 测试用例 TC-003: 禁用状态测试
   * 测试目标：验证禁用状态的Input能够正确渲染
   */
  test("TC-003: 禁用状态测试", () => {
    render(<Input disabled placeholder="禁用输入框" />);

    const input = screen.getByPlaceholderText("禁用输入框");
    expect(input).toBeDisabled();
  });

  /**
   * 测试用例 TC-004: 不同尺寸测试
   * 测试目标：验证不同尺寸的Input能够正确渲染
   */
  test("TC-004: 不同尺寸测试", () => {
    render(
      <div>
        <Input placeholder="默认尺寸" />
        <Input placeholder="小尺寸" className="h-8" />
        <Input placeholder="大尺寸" className="h-12" />
      </div>
    );

    expect(screen.getByPlaceholderText("默认尺寸")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("小尺寸")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("大尺寸")).toBeInTheDocument();
  });

  /**
   * 测试用例 TC-005: 只读状态测试
   * 测试目标：验证只读状态的Input能够正确渲染
   */
  test("TC-005: 只读状态测试", () => {
    render(<Input readOnly value="只读内容" />);

    const input = screen.getByDisplayValue("只读内容");
    expect(input).toHaveAttribute("readonly");
  });

  /**
   * 测试用例 TC-006: 输入框值测试
   * 测试目标：验证Input组件能够正确设置和获取值
   */
  test("TC-006: 输入框值测试", () => {
    render(<Input defaultValue="默认值" />);

    const input = screen.getByDisplayValue("默认值");
    expect(input).toBeInTheDocument();
  });

  /**
   * 测试用例 TC-007: 输入框焦点测试
   * 测试目标：验证Input组件能够正确处理焦点事件
   */
  test("TC-007: 输入框焦点测试", () => {
    const onFocus = jest.fn();
    const onBlur = jest.fn();
    
    render(
      <Input 
        placeholder="请输入内容" 
        onFocus={onFocus} 
        onBlur={onBlur} 
      />
    );

    const input = screen.getByPlaceholderText("请输入内容");
    fireEvent.focus(input);
    expect(onFocus).toHaveBeenCalled();
    
    fireEvent.blur(input);
    expect(onBlur).toHaveBeenCalled();
  });

  /**
   * 测试用例 TC-008: 输入框键盘事件测试
   * 测试目标：验证Input组件能够正确处理键盘事件
   */
  test("TC-008: 输入框键盘事件测试", () => {
    const onKeyDown = jest.fn();
    const onKeyUp = jest.fn();
    
    render(
      <Input 
        placeholder="请输入内容" 
        onKeyDown={onKeyDown} 
        onKeyUp={onKeyUp} 
      />
    );

    const input = screen.getByPlaceholderText("请输入内容");
    fireEvent.keyDown(input, { key: "Enter" });
    expect(onKeyDown).toHaveBeenCalled();
    
    fireEvent.keyUp(input, { key: "Enter" });
    expect(onKeyUp).toHaveBeenCalled();
  });
});

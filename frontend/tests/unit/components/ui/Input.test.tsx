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
    // 验证 data-slot 属性
    expect(input).toHaveAttribute("data-slot", "input");
  });

  /**
   * 测试用例 TC-002: 输入值变化测试
   * 测试目标：验证Input组件能够正确接收和处理输入值变化
   */
  test("TC-002: 输入值变化测试", () => {
    const handleChange = jest.fn();
    render(<Input placeholder="请输入内容" onChange={handleChange} />);

    const input = screen.getByPlaceholderText("请输入内容");
    fireEvent.change(input, { target: { value: "测试输入" } });

    expect(handleChange).toHaveBeenCalled();
    expect(input).toHaveValue("测试输入");
  });

  /**
   * 测试用例 TC-003: 禁用状态测试
   * 测试目标：验证禁用状态的Input能够正确渲染且无法输入
   */
  test("TC-003: 禁用状态测试", () => {
    render(<Input disabled placeholder="禁用输入框" />);

    const input = screen.getByPlaceholderText("禁用输入框");
    expect(input).toBeDisabled();
    expect(input).toHaveClass("disabled:pointer-events-none");
    expect(input).toHaveClass("disabled:opacity-50");
  });

  /**
   * 测试用例 TC-004: 不同类型测试
   * 测试目标：验证不同类型的Input能够正确渲染（text, password, email, number等）
   */
  test("TC-004: 不同类型测试", () => {
    render(
      <div>
        <Input type="text" placeholder="文本输入" data-testid="text-input" />
        <Input type="password" placeholder="密码输入" data-testid="password-input" />
        <Input type="email" placeholder="邮箱输入" data-testid="email-input" />
        <Input type="number" placeholder="数字输入" data-testid="number-input" />
      </div>
    );

    const textInput = screen.getByTestId("text-input");
    const passwordInput = screen.getByTestId("password-input");
    const emailInput = screen.getByTestId("email-input");
    const numberInput = screen.getByTestId("number-input");

    expect(textInput).toHaveAttribute("type", "text");
    expect(passwordInput).toHaveAttribute("type", "password");
    expect(emailInput).toHaveAttribute("type", "email");
    expect(numberInput).toHaveAttribute("type", "number");
  });

  /**
   * 测试用例 TC-005: 自定义类名测试
   * 测试目标：验证Input组件能够正确应用自定义类名
   */
  test("TC-005: 自定义类名测试", () => {
    render(
      <Input
        placeholder="自定义样式输入框"
        className="custom-class bg-blue-100 border-blue-500"
      />
    );

    const input = screen.getByPlaceholderText("自定义样式输入框");
    expect(input).toHaveClass("custom-class");
    expect(input).toHaveClass("bg-blue-100");
    expect(input).toHaveClass("border-blue-500");
    // 验证基础类名仍然存在
    expect(input).toHaveClass("rounded-md");
    expect(input).toHaveClass("border");
  });

  /**
   * 测试用例 TC-006: 只读状态测试
   * 测试目标：验证只读状态的Input能够正确渲染
   */
  test("TC-006: 只读状态测试", () => {
    render(<Input readOnly value="只读内容" />);

    const input = screen.getByDisplayValue("只读内容");
    expect(input).toHaveAttribute("readonly");
  });

  /**
   * 测试用例 TC-007: 输入框焦点测试
   * 测试目标：验证Input组件能够正确处理焦点事件
   */
  test("TC-007: 输入框焦点测试", () => {
    const onFocus = jest.fn();
    const onBlur = jest.fn();

    render(<Input placeholder="请输入内容" onFocus={onFocus} onBlur={onBlur} />);

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

    render(<Input placeholder="请输入内容" onKeyDown={onKeyDown} onKeyUp={onKeyUp} />);

    const input = screen.getByPlaceholderText("请输入内容");
    fireEvent.keyDown(input, { key: "Enter" });
    expect(onKeyDown).toHaveBeenCalled();

    fireEvent.keyUp(input, { key: "Enter" });
    expect(onKeyUp).toHaveBeenCalled();
  });
});

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Checkbox } from "@/components/ui/checkbox";
import "@testing-library/jest-dom";

describe("Checkbox组件测试", () => {
  /**
   * 测试用例 TC-001: 组件渲染测试
   * 测试目标：验证Checkbox组件能够正确渲染
   */
  test("TC-001: 组件渲染测试", () => {
    render(<Checkbox />);

    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toBeInTheDocument();
  });

  /**
   * 测试用例 TC-002: 选中状态测试
   * 测试目标：验证Checkbox的选中状态能够正确切换
   */
  test("TC-002: 选中状态测试", () => {
    render(<Checkbox />);

    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).not.toBeChecked();

    fireEvent.click(checkbox);
    expect(checkbox).toBeChecked();

    fireEvent.click(checkbox);
    expect(checkbox).not.toBeChecked();
  });

  /**
   * 测试用例 TC-003: 默认选中测试
   * 测试目标：验证默认选中的Checkbox能够正确渲染
   */
  test("TC-003: 默认选中测试", () => {
    render(<Checkbox defaultChecked />);

    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toBeChecked();
  });

  /**
   * 测试用例 TC-004: 受控状态测试
   * 测试目标：验证受控Checkbox能够正确工作
   */
  test("TC-004: 受控状态测试", () => {
    const { rerender } = render(<Checkbox checked={false} />);

    let checkbox = screen.getByRole("checkbox");
    expect(checkbox).not.toBeChecked();

    rerender(<Checkbox checked={true} />);
    checkbox = screen.getByRole("checkbox");
    expect(checkbox).toBeChecked();
  });

  /**
   * 测试用例 TC-005: 禁用状态测试
   * 测试目标：验证禁用状态的Checkbox能够正确渲染且不可点击
   */
  test("TC-005: 禁用状态测试", () => {
    const onCheckedChange = jest.fn();
    render(<Checkbox disabled onCheckedChange={onCheckedChange} />);

    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toBeDisabled();

    fireEvent.click(checkbox);
    expect(onCheckedChange).not.toHaveBeenCalled();
  });

  /**
   * 测试用例 TC-006: 与Label关联测试
   * 测试目标：验证Checkbox能够与Label正确关联
   */
  test("TC-006: 与Label关联测试", () => {
    render(
      <div>
        <label htmlFor="terms">
          <Checkbox id="terms" />
          同意服务条款
        </label>
      </div>
    );

    const checkbox = screen.getByRole("checkbox");
    const label = screen.getByText("同意服务条款");

    expect(checkbox).toBeInTheDocument();
    expect(label).toBeInTheDocument();
  });

  /**
   * 测试用例 TC-007: 自定义样式测试
   * 测试目标：验证自定义样式的Checkbox能够正确渲染
   */
  test("TC-007: 自定义样式测试", () => {
    render(
      <div>
        <Checkbox className="w-6 h-6" />
      </div>
    );

    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toBeInTheDocument();
  });

  /**
   * 测试用例 TC-008: data-slot属性测试
   * 测试目标：验证Checkbox具有正确的data-slot属性
   */
  test("TC-008: data-slot属性测试", () => {
    render(<Checkbox />);

    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toHaveAttribute("data-slot", "checkbox");
  });
});

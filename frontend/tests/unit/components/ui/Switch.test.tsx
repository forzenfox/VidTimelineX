import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Switch } from "@/components/ui/switch";
import "@testing-library/jest-dom";

describe("Switch组件测试", () => {
  /**
   * 测试用例 TC-001: 组件渲染测试
   * 测试目标：验证Switch组件能够正确渲染
   */
  test("TC-001: 组件渲染测试", () => {
    render(<Switch />);

    const switchElement = screen.getByRole("switch");
    expect(switchElement).toBeInTheDocument();
  });

  /**
   * 测试用例 TC-002: 开关状态测试
   * 测试目标：验证Switch的开关状态能够正确切换
   */
  test("TC-002: 开关状态测试", () => {
    render(<Switch />);

    const switchElement = screen.getByRole("switch");
    expect(switchElement).not.toBeChecked();

    fireEvent.click(switchElement);
    expect(switchElement).toBeChecked();

    fireEvent.click(switchElement);
    expect(switchElement).not.toBeChecked();
  });

  /**
   * 测试用例 TC-003: 默认开启测试
   * 测试目标：验证默认开启的Switch能够正确渲染
   */
  test("TC-003: 默认开启测试", () => {
    render(<Switch defaultChecked />);

    const switchElement = screen.getByRole("switch");
    expect(switchElement).toBeChecked();
  });

  /**
   * 测试用例 TC-004: 受控状态测试
   * 测试目标：验证受控Switch能够正确工作
   */
  test("TC-004: 受控状态测试", () => {
    const { rerender } = render(<Switch checked={false} />);

    let switchElement = screen.getByRole("switch");
    expect(switchElement).not.toBeChecked();

    rerender(<Switch checked={true} />);
    switchElement = screen.getByRole("switch");
    expect(switchElement).toBeChecked();
  });

  /**
   * 测试用例 TC-005: 禁用状态测试
   * 测试目标：验证禁用状态的Switch能够正确渲染且不可点击
   */
  test("TC-005: 禁用状态测试", () => {
    const onCheckedChange = jest.fn();
    render(<Switch disabled onCheckedChange={onCheckedChange} />);

    const switchElement = screen.getByRole("switch");
    expect(switchElement).toBeDisabled();

    fireEvent.click(switchElement);
    expect(onCheckedChange).not.toHaveBeenCalled();
  });

  /**
   * 测试用例 TC-006: 与Label关联测试
   * 测试目标：验证Switch能够与Label正确关联
   */
  test("TC-006: 与Label关联测试", () => {
    render(
      <div className="flex items-center gap-2">
        <Switch id="notifications" />
        <label htmlFor="notifications">接收通知</label>
      </div>
    );

    const switchElement = screen.getByRole("switch");
    const label = screen.getByText("接收通知");

    expect(switchElement).toBeInTheDocument();
    expect(label).toBeInTheDocument();
  });

  /**
   * 测试用例 TC-007: 自定义样式测试
   * 测试目标：验证自定义样式的Switch能够正确渲染
   */
  test("TC-007: 自定义样式测试", () => {
    render(
      <div>
        <Switch className="w-12 h-6" />
      </div>
    );

    const switchElement = screen.getByRole("switch");
    expect(switchElement).toBeInTheDocument();
  });

  /**
   * 测试用例 TC-008: data-slot属性测试
   * 测试目标：验证Switch具有正确的data-slot属性
   */
  test("TC-008: data-slot属性测试", () => {
    render(<Switch />);

    const switchElement = screen.getByRole("switch");
    expect(switchElement).toHaveAttribute("data-slot", "switch");
  });
});

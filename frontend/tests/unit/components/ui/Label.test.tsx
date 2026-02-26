import React from "react";
import { render, screen } from "@testing-library/react";
import { Label } from "@/components/ui/label";
import "@testing-library/jest-dom";

describe("Label组件测试", () => {
  /**
   * 测试用例 TC-001: 组件渲染测试
   * 测试目标：验证Label组件能够正确渲染
   */
  test("TC-001: 组件渲染测试", () => {
    render(<Label>测试标签</Label>);

    expect(screen.getByText("测试标签")).toBeInTheDocument();
  });

  /**
   * 测试用例 TC-002: 与Input关联测试
   * 测试目标：验证Label能够与Input正确关联
   */
  test("TC-002: 与Input关联测试", () => {
    render(
      <div>
        <Label htmlFor="test-input">用户名</Label>
        <input id="test-input" type="text" />
      </div>
    );

    const label = screen.getByText("用户名");
    expect(label).toBeInTheDocument();
    expect(label).toHaveAttribute("for", "test-input");
  });

  /**
   * 测试用例 TC-003: 自定义样式测试
   * 测试目标：验证自定义样式的Label能够正确渲染
   */
  test("TC-003: 自定义样式测试", () => {
    render(
      <div>
        <Label className="text-red-500">红色标签</Label>
        <Label className="text-blue-500 font-bold">蓝色加粗标签</Label>
      </div>
    );

    expect(screen.getByText("红色标签")).toBeInTheDocument();
    expect(screen.getByText("蓝色加粗标签")).toBeInTheDocument();
  });

  /**
   * 测试用例 TC-004: 嵌套内容测试
   * 测试目标：验证Label能够正确渲染嵌套内容
   */
  test("TC-004: 嵌套内容测试", () => {
    render(
      <Label>
        <span>🔒</span>
        密码
      </Label>
    );

    expect(screen.getByText("密码")).toBeInTheDocument();
    expect(screen.getByText("🔒")).toBeInTheDocument();
  });

  /**
   * 测试用例 TC-005: data-slot属性测试
   * 测试目标：验证Label具有正确的data-slot属性
   */
  test("TC-005: data-slot属性测试", () => {
    render(<Label>测试标签</Label>);

    const label = screen.getByText("测试标签");
    expect(label).toHaveAttribute("data-slot", "label");
  });
});

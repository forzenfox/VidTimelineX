import React from "react";
import { render, screen } from "@testing-library/react";
import { Separator } from "@/components/ui/separator";
import "@testing-library/jest-dom";

describe("Separator组件测试", () => {
  /**
   * 测试用例 TC-001: 组件渲染测试
   * 测试目标：验证Separator组件能够正确渲染
   */
  test("TC-001: 组件渲染测试", () => {
    render(<Separator data-testid="separator" />);

    const separator = screen.getByTestId("separator");
    expect(separator).toBeInTheDocument();
  });

  /**
   * 测试用例 TC-002: 水平方向测试
   * 测试目标：验证水平方向的Separator能够正确渲染
   */
  test("TC-002: 水平方向测试", () => {
    render(<Separator data-testid="separator" orientation="horizontal" />);

    const separator = screen.getByTestId("separator");
    expect(separator).toBeInTheDocument();
    expect(separator).toHaveAttribute("data-orientation", "horizontal");
  });

  /**
   * 测试用例 TC-003: 垂直方向测试
   * 测试目标：验证垂直方向的Separator能够正确渲染
   */
  test("TC-003: 垂直方向测试", () => {
    render(<Separator data-testid="separator" orientation="vertical" />);

    const separator = screen.getByTestId("separator");
    expect(separator).toBeInTheDocument();
    expect(separator).toHaveAttribute("data-orientation", "vertical");
  });

  /**
   * 测试用例 TC-004: decorative属性测试
   * 测试目标：验证decorative属性能够正确工作
   */
  test("TC-004: decorative属性测试", () => {
    render(<Separator data-testid="separator" decorative={true} />);

    const separator = screen.getByTestId("separator");
    expect(separator).toBeInTheDocument();
  });

  /**
   * 测试用例 TC-005: 自定义样式测试
   * 测试目标：验证自定义样式的Separator能够正确渲染
   */
  test("TC-005: 自定义样式测试", () => {
    render(
      <div>
        <Separator data-testid="separator-1" className="bg-red-500" />
        <Separator data-testid="separator-2" className="bg-blue-500 h-2" />
      </div>
    );

    expect(screen.getByTestId("separator-1")).toBeInTheDocument();
    expect(screen.getByTestId("separator-2")).toBeInTheDocument();
  });

  /**
   * 测试用例 TC-006: 内容分隔测试
   * 测试目标：验证Separator能够正确分隔内容
   */
  test("TC-006: 内容分隔测试", () => {
    render(
      <div>
        <p>上方内容</p>
        <Separator data-testid="separator" />
        <p>下方内容</p>
      </div>
    );

    expect(screen.getByText("上方内容")).toBeInTheDocument();
    expect(screen.getByText("下方内容")).toBeInTheDocument();
    expect(screen.getByTestId("separator")).toBeInTheDocument();
  });
});

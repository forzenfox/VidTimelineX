import React from "react";
import { render, screen } from "@testing-library/react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import "@testing-library/jest-dom";

describe("Alert组件测试", () => {
  /**
   * 测试用例 TC-001: Alert组件渲染测试
   * 测试目标：验证Alert组件能够正确渲染
   */
  test("TC-001: Alert组件渲染测试", () => {
    render(<Alert>警告内容</Alert>);

    expect(screen.getByText("警告内容")).toBeInTheDocument();
  });

  /**
   * 测试用例 TC-002: Alert默认变体测试
   * 测试目标：验证Alert默认变体能够正确渲染
   */
  test("TC-002: Alert默认变体测试", () => {
    const { container } = render(<Alert>默认警告</Alert>);

    const alert = container.querySelector('[data-slot="alert"]');
    expect(alert).toBeInTheDocument();
    expect(alert).toHaveAttribute("role", "alert");
  });

  /**
   * 测试用例 TC-003: Alert危险变体测试
   * 测试目标：验证Alert危险变体能够正确渲染
   */
  test("TC-003: Alert危险变体测试", () => {
    const { container } = render(<Alert variant="destructive">危险警告</Alert>);

    const alert = container.querySelector('[data-slot="alert"]');
    expect(alert).toBeInTheDocument();
    expect(screen.getByText("危险警告")).toBeInTheDocument();
  });

  /**
   * 测试用例 TC-004: Alert自定义类名测试
   * 测试目标：验证Alert能够正确应用自定义类名
   */
  test("TC-004: Alert自定义类名测试", () => {
    const { container } = render(<Alert className="custom-alert-class">自定义类名</Alert>);

    const alert = container.querySelector('[data-slot="alert"]');
    expect(alert).toHaveClass("custom-alert-class");
  });

  /**
   * 测试用例 TC-005: AlertTitle组件渲染测试
   * 测试目标：验证AlertTitle组件能够正确渲染
   */
  test("TC-005: AlertTitle组件渲染测试", () => {
    render(
      <Alert>
        <AlertTitle>警告标题</AlertTitle>
      </Alert>
    );

    expect(screen.getByText("警告标题")).toBeInTheDocument();
  });

  /**
   * 测试用例 TC-006: AlertDescription组件渲染测试
   * 测试目标：验证AlertDescription组件能够正确渲染
   */
  test("TC-006: AlertDescription组件渲染测试", () => {
    render(
      <Alert>
        <AlertDescription>警告描述内容</AlertDescription>
      </Alert>
    );

    expect(screen.getByText("警告描述内容")).toBeInTheDocument();
  });

  /**
   * 测试用例 TC-007: Alert完整组合测试
   * 测试目标：验证Alert、AlertTitle、AlertDescription组合使用
   */
  test("TC-007: Alert完整组合测试", () => {
    render(
      <Alert>
        <AlertTitle>完整警告标题</AlertTitle>
        <AlertDescription>完整警告描述内容</AlertDescription>
      </Alert>
    );

    expect(screen.getByText("完整警告标题")).toBeInTheDocument();
    expect(screen.getByText("完整警告描述内容")).toBeInTheDocument();
  });

  /**
   * 测试用例 TC-008: Alert带图标测试
   * 测试目标：验证Alert能够正确渲染带图标的警告
   */
  test("TC-008: Alert带图标测试", () => {
    render(
      <Alert>
        <svg data-testid="alert-icon" />
        <AlertTitle>带图标的警告</AlertTitle>
        <AlertDescription>这是带图标的警告描述</AlertDescription>
      </Alert>
    );

    expect(screen.getByTestId("alert-icon")).toBeInTheDocument();
    expect(screen.getByText("带图标的警告")).toBeInTheDocument();
  });

  /**
   * 测试用例 TC-009: AlertTitle自定义类名测试
   * 测试目标：验证AlertTitle能够正确应用自定义类名
   */
  test("TC-009: AlertTitle自定义类名测试", () => {
    const { container } = render(
      <Alert>
        <AlertTitle className="custom-title-class">自定义标题类名</AlertTitle>
      </Alert>
    );

    const title = container.querySelector('[data-slot="alert-title"]');
    expect(title).toHaveClass("custom-title-class");
  });

  /**
   * 测试用例 TC-010: AlertDescription自定义类名测试
   * 测试目标：验证AlertDescription能够正确应用自定义类名
   */
  test("TC-010: AlertDescription自定义类名测试", () => {
    const { container } = render(
      <Alert>
        <AlertDescription className="custom-desc-class">自定义描述类名</AlertDescription>
      </Alert>
    );

    const desc = container.querySelector('[data-slot="alert-description"]');
    expect(desc).toHaveClass("custom-desc-class");
  });
});

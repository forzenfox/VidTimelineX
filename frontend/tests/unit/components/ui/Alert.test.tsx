import React from "react";
import { render, screen } from "@testing-library/react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import "@testing-library/jest-dom";

describe("Alert组件测试", () => {
  test("TC-001: 组件渲染测试", () => {
    render(
      <Alert>
        <AlertTitle>测试标题</AlertTitle>
        <AlertDescription>测试描述</AlertDescription>
      </Alert>
    );

    expect(screen.getByText("测试标题")).toBeInTheDocument();
    expect(screen.getByText("测试描述")).toBeInTheDocument();
  });

  test("TC-002: 不同变体测试", () => {
    render(
      <div>
        <Alert variant="default">
          <AlertTitle>默认警告</AlertTitle>
        </Alert>
        <Alert variant="destructive">
          <AlertTitle>危险警告</AlertTitle>
        </Alert>
      </div>
    );

    expect(screen.getByText("默认警告")).toBeInTheDocument();
    expect(screen.getByText("危险警告")).toBeInTheDocument();
  });

  test("TC-003: role属性测试", () => {
    render(<Alert>测试</Alert>);

    const alert = screen.getByRole("alert");
    expect(alert).toBeInTheDocument();
  });

  test("TC-004: data-slot属性测试", () => {
    render(
      <Alert data-testid="alert">
        <AlertTitle data-testid="alert-title">标题</AlertTitle>
        <AlertDescription data-testid="alert-description">描述</AlertDescription>
      </Alert>
    );

    expect(screen.getByTestId("alert")).toHaveAttribute("data-slot", "alert");
    expect(screen.getByTestId("alert-title")).toHaveAttribute("data-slot", "alert-title");
    expect(screen.getByTestId("alert-description")).toHaveAttribute(
      "data-slot",
      "alert-description"
    );
  });
});

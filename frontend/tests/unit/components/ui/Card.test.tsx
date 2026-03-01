import React from "react";
import { render, screen } from "@testing-library/react";
import {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
  CardAction,
} from "@/components/ui/card";
import "@testing-library/jest-dom";

describe("Card组件测试", () => {
  /**
   * 测试用例 TC-001: Card组件渲染测试
   * 测试目标：验证Card组件能够正确渲染
   */
  test("TC-001: Card组件渲染测试", () => {
    render(<Card data-testid="card">卡片内容</Card>);

    const card = screen.getByTestId("card");
    expect(card).toBeInTheDocument();
    expect(card).toHaveAttribute("data-slot", "card");
    expect(card).toHaveTextContent("卡片内容");
  });

  /**
   * 测试用例 TC-002: CardHeader组件渲染测试
   * 测试目标：验证CardHeader组件能够正确渲染
   */
  test("TC-002: CardHeader组件渲染测试", () => {
    render(<CardHeader data-testid="card-header">头部内容</CardHeader>);

    const header = screen.getByTestId("card-header");
    expect(header).toBeInTheDocument();
    expect(header).toHaveAttribute("data-slot", "card-header");
    expect(header).toHaveTextContent("头部内容");
  });

  /**
   * 测试用例 TC-003: CardTitle组件渲染测试
   * 测试目标：验证CardTitle组件能够正确渲染
   */
  test("TC-003: CardTitle组件渲染测试", () => {
    render(<CardTitle data-testid="card-title">卡片标题</CardTitle>);

    const title = screen.getByTestId("card-title");
    expect(title).toBeInTheDocument();
    expect(title).toHaveAttribute("data-slot", "card-title");
    expect(title.tagName.toLowerCase()).toBe("h4");
    expect(title).toHaveTextContent("卡片标题");
  });

  /**
   * 测试用例 TC-004: CardDescription组件渲染测试
   * 测试目标：验证CardDescription组件能够正确渲染
   */
  test("TC-004: CardDescription组件渲染测试", () => {
    render(<CardDescription data-testid="card-description">卡片描述内容</CardDescription>);

    const description = screen.getByTestId("card-description");
    expect(description).toBeInTheDocument();
    expect(description).toHaveAttribute("data-slot", "card-description");
    expect(description.tagName.toLowerCase()).toBe("p");
    expect(description).toHaveTextContent("卡片描述内容");
  });

  /**
   * 测试用例 TC-005: CardContent组件渲染测试
   * 测试目标：验证CardContent组件能够正确渲染
   */
  test("TC-005: CardContent组件渲染测试", () => {
    render(<CardContent data-testid="card-content">内容区域</CardContent>);

    const content = screen.getByTestId("card-content");
    expect(content).toBeInTheDocument();
    expect(content).toHaveAttribute("data-slot", "card-content");
    expect(content).toHaveTextContent("内容区域");
  });

  /**
   * 测试用例 TC-006: CardFooter组件渲染测试
   * 测试目标：验证CardFooter组件能够正确渲染
   */
  test("TC-006: CardFooter组件渲染测试", () => {
    render(<CardFooter data-testid="card-footer">底部内容</CardFooter>);

    const footer = screen.getByTestId("card-footer");
    expect(footer).toBeInTheDocument();
    expect(footer).toHaveAttribute("data-slot", "card-footer");
    expect(footer).toHaveTextContent("底部内容");
  });

  /**
   * 测试用例 TC-007: 自定义类名测试
   * 测试目标：验证各组件能够正确应用自定义类名
   */
  test("TC-007: 自定义类名测试", () => {
    render(
      <Card className="custom-card" data-testid="card">
        <CardHeader className="custom-header" data-testid="card-header">
          <CardTitle className="custom-title" data-testid="card-title">
            标题
          </CardTitle>
        </CardHeader>
        <CardContent className="custom-content" data-testid="card-content">
          内容
        </CardContent>
        <CardFooter className="custom-footer" data-testid="card-footer">
          底部
        </CardFooter>
      </Card>
    );

    expect(screen.getByTestId("card")).toHaveClass("custom-card");
    expect(screen.getByTestId("card-header")).toHaveClass("custom-header");
    expect(screen.getByTestId("card-title")).toHaveClass("custom-title");
    expect(screen.getByTestId("card-content")).toHaveClass("custom-content");
    expect(screen.getByTestId("card-footer")).toHaveClass("custom-footer");
  });

  /**
   * 测试用例 TC-008: 完整Card结构测试
   * 测试目标：验证完整的Card结构能够正确渲染所有子组件
   */
  test("TC-008: 完整Card结构测试", () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>卡片标题</CardTitle>
          <CardDescription>卡片描述信息</CardDescription>
        </CardHeader>
        <CardContent>
          <p>这是卡片的主要内容区域</p>
        </CardContent>
        <CardFooter>
          <button>操作按钮</button>
        </CardFooter>
      </Card>
    );

    // 验证所有子组件都正确渲染
    expect(screen.getByText("卡片标题")).toBeInTheDocument();
    expect(screen.getByText("卡片描述信息")).toBeInTheDocument();
    expect(screen.getByText("这是卡片的主要内容区域")).toBeInTheDocument();
    expect(screen.getByText("操作按钮")).toBeInTheDocument();

    // 验证data-slot属性
    expect(screen.getByText("卡片标题")).toHaveAttribute("data-slot", "card-title");
    expect(screen.getByText("卡片描述信息")).toHaveAttribute("data-slot", "card-description");
  });

  /**
   * 测试用例 TC-009: CardAction组件渲染测试
   * 测试目标：验证CardAction组件能够正确渲染
   */
  test("TC-009: CardAction组件渲染测试", () => {
    render(
      <CardHeader>
        <CardTitle>标题</CardTitle>
        <CardAction data-testid="card-action">
          <button>操作</button>
        </CardAction>
      </CardHeader>
    );

    const action = screen.getByTestId("card-action");
    expect(action).toBeInTheDocument();
    expect(action).toHaveAttribute("data-slot", "card-action");
    expect(action).toHaveTextContent("操作");
  });
});

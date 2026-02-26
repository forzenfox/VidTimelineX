import React from "react";
import { render, screen } from "@testing-library/react";
import { Badge } from "@/components/ui/badge";
import "@testing-library/jest-dom";

describe("Badge组件测试", () => {
  /**
   * 测试用例 TC-001: 组件渲染测试
   * 测试目标：验证Badge组件能够正确渲染
   */
  test("TC-001: 组件渲染测试", () => {
    render(<Badge>测试徽章</Badge>);

    expect(screen.getByText("测试徽章")).toBeInTheDocument();
  });

  /**
   * 测试用例 TC-002: 不同变体测试
   * 测试目标：验证不同变体的Badge能够正确渲染
   */
  test("TC-002: 不同变体测试", () => {
    render(
      <div>
        <Badge variant="default">默认徽章</Badge>
        <Badge variant="secondary">次要徽章</Badge>
        <Badge variant="destructive">危险徽章</Badge>
        <Badge variant="outline">轮廓徽章</Badge>
      </div>
    );

    expect(screen.getByText("默认徽章")).toBeInTheDocument();
    expect(screen.getByText("次要徽章")).toBeInTheDocument();
    expect(screen.getByText("危险徽章")).toBeInTheDocument();
    expect(screen.getByText("轮廓徽章")).toBeInTheDocument();
  });

  /**
   * 测试用例 TC-003: 自定义样式测试
   * 测试目标：验证自定义样式的Badge能够正确渲染
   */
  test("TC-003: 自定义样式测试", () => {
    render(
      <div>
        <Badge className="bg-blue-500">蓝色徽章</Badge>
        <Badge className="bg-green-500">绿色徽章</Badge>
      </div>
    );

    expect(screen.getByText("蓝色徽章")).toBeInTheDocument();
    expect(screen.getByText("绿色徽章")).toBeInTheDocument();
  });

  /**
   * 测试用例 TC-004: asChild属性测试
   * 测试目标：验证asChild属性能够正确工作
   */
  test("TC-004: asChild属性测试", () => {
    render(
      <Badge asChild>
        <a href="/">链接徽章</a>
      </Badge>
    );

    const link = screen.getByText("链接徽章");
    expect(link).toBeInTheDocument();
    expect(link.tagName).toBe("A");
    expect(link).toHaveAttribute("href", "/");
  });

  /**
   * 测试用例 TC-005: 带图标的徽章测试
   * 测试目标：验证带图标的Badge能够正确渲染
   */
  test("TC-005: 带图标的徽章测试", () => {
    render(
      <Badge>
        <span>🔔</span>
        通知
      </Badge>
    );

    expect(screen.getByText("通知")).toBeInTheDocument();
    expect(screen.getByText("🔔")).toBeInTheDocument();
  });
});

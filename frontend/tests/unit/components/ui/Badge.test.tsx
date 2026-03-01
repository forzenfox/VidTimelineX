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
    const { container } = render(<Badge>测试徽章</Badge>);

    // 使用 data-slot 属性查询元素
    const badge = container.querySelector('[data-slot="badge"]');
    expect(badge).toBeInTheDocument();
    expect(screen.getByText("测试徽章")).toBeInTheDocument();
  });

  /**
   * 测试用例 TC-002: 不同变体测试
   * 测试目标：验证不同变体(default, secondary, destructive, outline)的Badge能够正确渲染
   */
  test("TC-002: 不同变体测试", () => {
    const { container } = render(
      <div>
        <Badge variant="default">默认徽章</Badge>
        <Badge variant="secondary">次要徽章</Badge>
        <Badge variant="destructive">危险徽章</Badge>
        <Badge variant="outline">轮廓徽章</Badge>
      </div>
    );

    // 验证所有变体的徽章都能正确渲染
    expect(screen.getByText("默认徽章")).toBeInTheDocument();
    expect(screen.getByText("次要徽章")).toBeInTheDocument();
    expect(screen.getByText("危险徽章")).toBeInTheDocument();
    expect(screen.getByText("轮廓徽章")).toBeInTheDocument();

    // 验证每个徽章都有正确的 data-slot 属性
    const badges = container.querySelectorAll('[data-slot="badge"]');
    expect(badges).toHaveLength(4);
  });

  /**
   * 测试用例 TC-003: 自定义类名测试
   * 测试目标：验证自定义类名的Badge能够正确渲染并应用自定义样式
   */
  test("TC-003: 自定义类名测试", () => {
    const { container } = render(
      <div>
        <Badge className="bg-blue-500">蓝色徽章</Badge>
        <Badge className="custom-class-name">自定义类名徽章</Badge>
      </div>
    );

    // 验证徽章内容正确渲染
    expect(screen.getByText("蓝色徽章")).toBeInTheDocument();
    expect(screen.getByText("自定义类名徽章")).toBeInTheDocument();

    // 验证自定义类名被正确应用
    const badges = container.querySelectorAll('[data-slot="badge"]');
    expect(badges[0]).toHaveClass("bg-blue-500");
    expect(badges[1]).toHaveClass("custom-class-name");
  });

  /**
   * 测试用例 TC-004: 子元素渲染测试
   * 测试目标：验证Badge能够正确渲染子元素（包括文本、图标等）
   */
  test("TC-004: 子元素渲染测试", () => {
    render(
      <Badge>
        <span data-testid="icon">🔔</span>
        <span>通知消息</span>
      </Badge>
    );

    // 验证文本内容正确渲染
    expect(screen.getByText("通知消息")).toBeInTheDocument();
    // 验证图标子元素正确渲染
    expect(screen.getByTestId("icon")).toBeInTheDocument();
    expect(screen.getByText("🔔")).toBeInTheDocument();
  });

  /**
   * 测试用例 TC-005: asChild属性测试
   * 测试目标：验证asChild属性能够正确工作，将Badge渲染为子元素
   */
  test("TC-005: asChild属性测试", () => {
    render(
      <Badge asChild>
        <a href="/test-link">链接徽章</a>
      </Badge>
    );

    const link = screen.getByText("链接徽章");
    expect(link).toBeInTheDocument();
    expect(link.tagName).toBe("A");
    expect(link).toHaveAttribute("href", "/test-link");
    // 验证 data-slot 属性被正确传递
    expect(link).toHaveAttribute("data-slot", "badge");
  });
});

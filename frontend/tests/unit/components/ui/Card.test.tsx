import React from "react";
import { render, screen } from "@testing-library/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import "@testing-library/jest-dom";

describe("Card组件测试", () => {
  /**
   * 测试用例 TC-001: 组件渲染测试
   * 测试目标：验证Card组件能够正确渲染
   */
  test("TC-001: 组件渲染测试", () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>卡片标题</CardTitle>
          <CardDescription>卡片描述</CardDescription>
        </CardHeader>
        <CardContent>
          <p>卡片内容</p>
        </CardContent>
        <CardFooter>
          <p>卡片底部</p>
        </CardFooter>
      </Card>
    );

    expect(screen.getByText("卡片标题")).toBeInTheDocument();
    expect(screen.getByText("卡片描述")).toBeInTheDocument();
    expect(screen.getByText("卡片内容")).toBeInTheDocument();
    expect(screen.getByText("卡片底部")).toBeInTheDocument();
  });

  /**
   * 测试用例 TC-002: 不同样式测试
   * 测试目标：验证不同样式的Card能够正确渲染
   */
  test("TC-002: 不同样式测试", () => {
    render(
      <div>
        <Card>默认卡片</Card>
        <Card className="border-2">轮廓卡片</Card>
      </div>
    );

    expect(screen.getByText("默认卡片")).toBeInTheDocument();
    expect(screen.getByText("轮廓卡片")).toBeInTheDocument();
  });

  /**
   * 测试用例 TC-003: 卡片头部测试
   * 测试目标：验证CardHeader组件能够正确渲染
   */
  test("TC-003: 卡片头部测试", () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>测试标题</CardTitle>
          <CardDescription>测试描述</CardDescription>
        </CardHeader>
      </Card>
    );

    expect(screen.getByText("测试标题")).toBeInTheDocument();
    expect(screen.getByText("测试描述")).toBeInTheDocument();
  });

  /**
   * 测试用例 TC-004: 卡片内容测试
   * 测试目标：验证CardContent组件能够正确渲染
   */
  test("TC-004: 卡片内容测试", () => {
    render(
      <Card>
        <CardContent>
          <p>测试内容</p>
        </CardContent>
      </Card>
    );

    expect(screen.getByText("测试内容")).toBeInTheDocument();
  });

  /**
   * 测试用例 TC-005: 卡片底部测试
   * 测试目标：验证CardFooter组件能够正确渲染
   */
  test("TC-005: 卡片底部测试", () => {
    render(
      <Card>
        <CardFooter>
          <p>测试底部</p>
        </CardFooter>
      </Card>
    );

    expect(screen.getByText("测试底部")).toBeInTheDocument();
  });

  /**
   * 测试用例 TC-006: 卡片完整结构测试
   * 测试目标：验证完整结构的Card能够正确渲染
   */
  test("TC-006: 卡片完整结构测试", () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>产品标题</CardTitle>
          <CardDescription>产品描述信息</CardDescription>
        </CardHeader>
        <CardContent>
          <p>产品详细内容，包含各种信息</p>
          <p>更多产品信息</p>
        </CardContent>
        <CardFooter>
          <button>购买</button>
          <button>加入购物车</button>
        </CardFooter>
      </Card>
    );

    expect(screen.getByText("产品标题")).toBeInTheDocument();
    expect(screen.getByText("产品描述信息")).toBeInTheDocument();
    expect(screen.getByText("产品详细内容，包含各种信息")).toBeInTheDocument();
    expect(screen.getByText("购买")).toBeInTheDocument();
    expect(screen.getByText("加入购物车")).toBeInTheDocument();
  });

  /**
   * 测试用例 TC-007: 卡片样式测试
   * 测试目标：验证不同样式的Card能够正确渲染
   */
  test("TC-007: 卡片样式测试", () => {
    render(
      <div>
        <Card className="border-2 border-blue-500">蓝色边框卡片</Card>
        <Card className="bg-gray-100">灰色背景卡片</Card>
        <Card className="shadow-lg">阴影卡片</Card>
      </div>
    );

    expect(screen.getByText("蓝色边框卡片")).toBeInTheDocument();
    expect(screen.getByText("灰色背景卡片")).toBeInTheDocument();
    expect(screen.getByText("阴影卡片")).toBeInTheDocument();
  });

  /**
   * 测试用例 TC-008: 卡片嵌套测试
   * 测试目标：验证嵌套的Card能够正确渲染
   */
  test("TC-008: 卡片嵌套测试", () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>父卡片</CardTitle>
        </CardHeader>
        <CardContent>
          <Card className="border">
            <CardContent>
              <p>子卡片内容</p>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    );

    expect(screen.getByText("父卡片")).toBeInTheDocument();
    expect(screen.getByText("子卡片内容")).toBeInTheDocument();
  });
});

import React from "react";
import { render, screen } from "@testing-library/react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import "@testing-library/jest-dom";

describe("Avatar组件测试", () => {
  /**
   * 测试用例 TC-001: 组件渲染测试
   * 测试目标：验证Avatar组件能够正确渲染
   */
  test("TC-001: 组件渲染测试", () => {
    render(
      <Avatar>
        <AvatarFallback>U</AvatarFallback>
      </Avatar>
    );

    expect(screen.getByText("U")).toBeInTheDocument();
  });

  /**
   * 测试用例 TC-002: Fallback渲染测试
   * 测试目标：验证Avatar在图片加载失败时能够显示Fallback
   */
  test("TC-002: Fallback渲染测试", () => {
    render(
      <Avatar>
        <AvatarImage src="invalid-url.jpg" alt="无效头像" />
        <AvatarFallback>JD</AvatarFallback>
      </Avatar>
    );

    expect(screen.getByText("JD")).toBeInTheDocument();
  });

  /**
   * 测试用例 TC-003: 自定义尺寸测试
   * 测试目标：验证自定义尺寸的Avatar能够正确渲染
   */
  test("TC-003: 自定义尺寸测试", () => {
    render(
      <div>
        <Avatar className="w-8 h-8">
          <AvatarFallback>SM</AvatarFallback>
        </Avatar>
        <Avatar className="w-12 h-12">
          <AvatarFallback>MD</AvatarFallback>
        </Avatar>
        <Avatar className="w-16 h-16">
          <AvatarFallback>LG</AvatarFallback>
        </Avatar>
      </div>
    );

    expect(screen.getByText("SM")).toBeInTheDocument();
    expect(screen.getByText("MD")).toBeInTheDocument();
    expect(screen.getByText("LG")).toBeInTheDocument();
  });

  /**
   * 测试用例 TC-004: 自定义样式测试
   * 测试目标：验证自定义样式的Avatar能够正确渲染
   */
  test("TC-004: 自定义样式测试", () => {
    render(
      <Avatar className="border-2 border-blue-500">
        <AvatarFallback>CS</AvatarFallback>
      </Avatar>
    );

    expect(screen.getByText("CS")).toBeInTheDocument();
  });

  /**
   * 测试用例 TC-005: Avatar单独测试
   * 测试目标：验证Avatar组件能够单独渲染
   */
  test("TC-005: Avatar单独测试", () => {
    render(<Avatar data-testid="avatar" />);

    expect(screen.getByTestId("avatar")).toBeInTheDocument();
  });

  /**
   * 测试用例 TC-006: data-slot属性测试
   * 测试目标：验证Avatar及其子组件具有正确的data-slot属性
   */
  test("TC-006: data-slot属性测试", () => {
    render(
      <Avatar data-testid="avatar">
        <AvatarFallback data-testid="avatar-fallback">DF</AvatarFallback>
      </Avatar>
    );

    expect(screen.getByTestId("avatar")).toHaveAttribute("data-slot", "avatar");
    expect(screen.getByTestId("avatar-fallback")).toHaveAttribute("data-slot", "avatar-fallback");
  });

  /**
   * 测试用例 TC-007: 带颜色的Fallback测试
   * 测试目标：验证带自定义样式的Fallback能够正确渲染
   */
  test("TC-007: 带颜色的Fallback测试", () => {
    render(
      <Avatar>
        <AvatarFallback className="bg-red-500 text-white">RD</AvatarFallback>
      </Avatar>
    );

    expect(screen.getByText("RD")).toBeInTheDocument();
  });
});

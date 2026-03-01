import React from "react";
import { render, screen } from "@testing-library/react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import "@testing-library/jest-dom";

// 辅助函数：通过 data-slot 属性获取元素
const getBySlot = (slot: string) => {
  return document.querySelector(`[data-slot="${slot}"]`);
};

describe("Avatar组件测试", () => {
  /**
   * 测试用例 TC-001: Avatar组件渲染测试
   * 测试目标：验证Avatar组件能够正确渲染
   */
  test("TC-001: Avatar组件渲染测试", () => {
    render(<Avatar />);

    expect(getBySlot("avatar")).toBeInTheDocument();
  });

  /**
   * 测试用例 TC-002: Avatar默认样式测试
   * 测试目标：验证Avatar默认样式正确
   */
  test("TC-002: Avatar默认样式测试", () => {
    render(<Avatar />);

    const avatar = getBySlot("avatar");
    expect(avatar).toHaveClass("relative", "flex", "size-10", "shrink-0", "overflow-hidden", "rounded-full");
  });

  /**
   * 测试用例 TC-003: Avatar自定义类名测试
   * 测试目标：验证Avatar能够正确应用自定义类名
   */
  test("TC-003: Avatar自定义类名测试", () => {
    render(<Avatar className="custom-avatar-class" />);

    const avatar = getBySlot("avatar");
    expect(avatar).toHaveClass("custom-avatar-class");
  });

  /**
   * 测试用例 TC-004: AvatarImage组件存在测试
   * 测试目标：验证AvatarImage组件能够被正确引用
   */
  test("TC-004: AvatarImage组件存在测试", () => {
    // AvatarImage 是 Radix UI 的包装组件，在测试环境中可能不会立即渲染
    // 这里主要验证组件可以正确导入和使用
    expect(AvatarImage).toBeDefined();
    expect(typeof AvatarImage).toBe("function");
  });

  /**
   * 测试用例 TC-005: AvatarFallback组件渲染测试
   * 测试目标：验证AvatarFallback组件能够正确渲染
   */
  test("TC-005: AvatarFallback组件渲染测试", () => {
    render(
      <Avatar>
        <AvatarFallback>用户</AvatarFallback>
      </Avatar>
    );

    expect(getBySlot("avatar-fallback")).toBeInTheDocument();
    expect(screen.getByText("用户")).toBeInTheDocument();
  });

  /**
   * 测试用例 TC-006: AvatarFallback默认样式测试
   * 测试目标：验证AvatarFallback默认样式正确
   */
  test("TC-006: AvatarFallback默认样式测试", () => {
    render(
      <Avatar>
        <AvatarFallback>用户</AvatarFallback>
      </Avatar>
    );

    const fallback = getBySlot("avatar-fallback");
    expect(fallback).toHaveClass("bg-muted", "flex", "size-full", "items-center", "justify-center", "rounded-full");
  });

  /**
   * 测试用例 TC-007: AvatarFallback自定义类名测试
   * 测试目标：验证AvatarFallback能够正确应用自定义类名
   */
  test("TC-007: AvatarFallback自定义类名测试", () => {
    render(
      <Avatar>
        <AvatarFallback className="custom-fallback-class">
          用户
        </AvatarFallback>
      </Avatar>
    );

    const fallback = getBySlot("avatar-fallback");
    expect(fallback).toHaveClass("custom-fallback-class");
  });

  /**
   * 测试用例 TC-008: Avatar完整组合测试
   * 测试目标：验证Avatar、AvatarImage、AvatarFallback组合使用
   */
  test("TC-008: Avatar完整组合测试", () => {
    render(
      <Avatar>
        <AvatarImage src="https://example.com/avatar.jpg" alt="用户头像" />
        <AvatarFallback>用户</AvatarFallback>
      </Avatar>
    );

    expect(getBySlot("avatar")).toBeInTheDocument();
    // AvatarImage 在测试环境中可能不会立即渲染，但 Fallback 会显示
    expect(getBySlot("avatar-fallback")).toBeInTheDocument();
    expect(screen.getByText("用户")).toBeInTheDocument();
  });

  /**
   * 测试用例 TC-009: AvatarFallback延迟显示测试
   * 测试目标：验证AvatarFallback在图片加载前显示
   */
  test("TC-009: AvatarFallback延迟显示测试", () => {
    render(
      <Avatar>
        <AvatarImage src="https://example.com/avatar.jpg" alt="用户头像" />
        <AvatarFallback>加载中</AvatarFallback>
      </Avatar>
    );

    // Fallback 应该在图片加载前显示
    expect(screen.getByText("加载中")).toBeInTheDocument();
  });

  /**
   * 测试用例 TC-010: Avatar导出测试
   * 测试目标：验证所有组件都正确导出
   */
  test("TC-010: Avatar导出测试", () => {
    expect(Avatar).toBeDefined();
    expect(AvatarImage).toBeDefined();
    expect(AvatarFallback).toBeDefined();
  });
});

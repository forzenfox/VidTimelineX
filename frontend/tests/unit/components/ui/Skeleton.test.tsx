import React from "react";
import { render, screen } from "@testing-library/react";
import { Skeleton } from "@/components/ui/skeleton";
import "@testing-library/jest-dom";

describe("Skeleton组件测试", () => {
  /**
   * 测试用例 TC-001: 组件渲染测试
   * 测试目标：验证Skeleton组件能够正确渲染
   */
  test("TC-001: 组件渲染测试", () => {
    render(<Skeleton data-testid="skeleton" />);

    const skeleton = screen.getByTestId("skeleton");
    expect(skeleton).toBeInTheDocument();
  });

  /**
   * 测试用例 TC-002: 自定义样式测试
   * 测试目标：验证自定义样式的Skeleton能够正确渲染
   */
  test("TC-002: 自定义样式测试", () => {
    render(
      <div>
        <Skeleton data-testid="skeleton-1" className="w-24 h-24 rounded-full" />
        <Skeleton data-testid="skeleton-2" className="w-full h-4" />
        <Skeleton data-testid="skeleton-3" className="w-3/4 h-3" />
      </div>
    );

    expect(screen.getByTestId("skeleton-1")).toBeInTheDocument();
    expect(screen.getByTestId("skeleton-2")).toBeInTheDocument();
    expect(screen.getByTestId("skeleton-3")).toBeInTheDocument();
  });

  /**
   * 测试用例 TC-003: data-slot属性测试
   * 测试目标：验证Skeleton具有正确的data-slot属性
   */
  test("TC-003: data-slot属性测试", () => {
    render(<Skeleton data-testid="skeleton" />);

    const skeleton = screen.getByTestId("skeleton");
    expect(skeleton).toHaveAttribute("data-slot", "skeleton");
  });

  /**
   * 测试用例 TC-004: 多行骨架屏测试
   * 测试目标：验证多行骨架屏能够正确渲染
   */
  test("TC-004: 多行骨架屏测试", () => {
    render(
      <div className="space-y-2">
        <Skeleton data-testid="skeleton-line-1" className="w-full h-4" />
        <Skeleton data-testid="skeleton-line-2" className="w-3/4 h-4" />
        <Skeleton data-testid="skeleton-line-3" className="w-5/6 h-4" />
      </div>
    );

    expect(screen.getByTestId("skeleton-line-1")).toBeInTheDocument();
    expect(screen.getByTestId("skeleton-line-2")).toBeInTheDocument();
    expect(screen.getByTestId("skeleton-line-3")).toBeInTheDocument();
  });

  /**
   * 测试用例 TC-005: 复合骨架屏测试
   * 测试目标：验证复合结构的骨架屏能够正确渲染
   */
  test("TC-005: 复合骨架屏测试", () => {
    render(
      <div className="flex items-center space-x-4">
        <Skeleton data-testid="skeleton-avatar" className="w-12 h-12 rounded-full" />
        <div className="space-y-2">
          <Skeleton data-testid="skeleton-name" className="w-32 h-4" />
          <Skeleton data-testid="skeleton-desc" className="w-24 h-3" />
        </div>
      </div>
    );

    expect(screen.getByTestId("skeleton-avatar")).toBeInTheDocument();
    expect(screen.getByTestId("skeleton-name")).toBeInTheDocument();
    expect(screen.getByTestId("skeleton-desc")).toBeInTheDocument();
  });
});

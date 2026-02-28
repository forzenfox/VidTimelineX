import React from "react";
import { render, screen } from "@testing-library/react";
import { Progress } from "@/components/ui/progress";
import "@testing-library/jest-dom";

describe("Progress组件测试", () => {
  /**
   * 测试用例 TC-001: 组件渲染测试
   * 测试目标：验证Progress组件能够正确渲染
   */
  test("TC-001: 组件渲染测试", () => {
    render(<Progress value={50} />);

    const progress = screen.getByRole("progressbar");
    expect(progress).toBeInTheDocument();
  });

  /**
   * 测试用例 TC-002: 不同值测试
   * 测试目标：验证不同值的Progress能够正确渲染
   */
  test("TC-002: 不同值测试", () => {
    render(
      <div>
        <Progress value={0} data-testid="progress-0" />
        <Progress value={25} data-testid="progress-25" />
        <Progress value={50} data-testid="progress-50" />
        <Progress value={75} data-testid="progress-75" />
        <Progress value={100} data-testid="progress-100" />
      </div>
    );

    expect(screen.getByTestId("progress-0")).toBeInTheDocument();
    expect(screen.getByTestId("progress-25")).toBeInTheDocument();
    expect(screen.getByTestId("progress-50")).toBeInTheDocument();
    expect(screen.getByTestId("progress-75")).toBeInTheDocument();
    expect(screen.getByTestId("progress-100")).toBeInTheDocument();
  });

  /**
   * 测试用例 TC-003: 自定义样式测试
   * 测试目标：验证自定义样式的Progress能够正确渲染
   */
  test("TC-003: 自定义样式测试", () => {
    render(
      <div>
        <Progress value={50} className="h-4" />
        <Progress value={50} className="h-6" />
      </div>
    );

    const progresses = screen.getAllByRole("progressbar");
    expect(progresses).toHaveLength(2);
  });

  /**
   * 测试用例 TC-004: data-slot属性测试
   * 测试目标：验证Progress具有正确的data-slot属性
   */
  test("TC-004: data-slot属性测试", () => {
    render(<Progress data-testid="progress" value={50} />);

    expect(screen.getByTestId("progress")).toHaveAttribute("data-slot", "progress");
  });

  /**
   * 测试用例 TC-005: 无value测试
   * 测试目标：验证无value的Progress能够正确渲染
   */
  test("TC-005: 无value测试", () => {
    render(<Progress />);

    const progress = screen.getByRole("progressbar");
    expect(progress).toBeInTheDocument();
  });
});

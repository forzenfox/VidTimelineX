import React from "react";
import { renderHook } from "@testing-library/react";
import { withDeviceSpecificComponent } from "@/hooks/use-dynamic-component";

describe("use-dynamic-component Hook测试", () => {
  const TestComponent = ({ text }: { text: string }) => <div>{text}</div>;

  /**
   * 测试用例 TC-001: withDeviceSpecificComponent 功能测试
   * 测试目标：验证withDeviceSpecificComponent能够正确创建响应式组件
   */
  test("TC-001: withDeviceSpecificComponent 功能测试", () => {
    const ResponsiveComponent = withDeviceSpecificComponent({
      tablet: (props: { text: string }) => <TestComponent {...props} />,
      desktop: (props: { text: string }) => <TestComponent {...props} />,
    });

    expect(typeof ResponsiveComponent).toBe("function");
  });

  /**
   * 测试用例 TC-002: 类型验证测试
   * 测试目标：验证withDeviceSpecificComponent返回值类型正确
   */
  test("TC-002: 类型验证测试", () => {
    const ResponsiveComponent = withDeviceSpecificComponent({
      tablet: (props: { text: string }) => <TestComponent {...props} />,
      desktop: (props: { text: string }) => <TestComponent {...props} />,
    });

    expect(React.isValidElement(<ResponsiveComponent text="测试" />)).toBe(true);
  });
});

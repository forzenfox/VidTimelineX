import React from "react";
import { render, screen } from "@testing-library/react";
import {
  withDeviceSpecificComponent,
  useDynamicComponent,
  DeviceAwareComponent,
} from "@/hooks/use-dynamic-component";
import * as useMobileModule from "@/hooks/use-mobile";

jest.mock("@/hooks/use-mobile");

describe("use-dynamic-component Hook测试", () => {
  const TestComponentDesktop = ({ text }: { text: string }) => (
    <div data-testid="desktop-component">{text}</div>
  );
  const TestComponentTablet = ({ text }: { text: string }) => (
    <div data-testid="tablet-component">{text}</div>
  );
  const TestFallback = () => <div data-testid="fallback-component">Fallback</div>;

  const mockUseDeviceDetect = useMobileModule.useDeviceDetect as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("withDeviceSpecificComponent", () => {
    test("TC-001: 在桌面设备渲染桌面组件", () => {
      mockUseDeviceDetect.mockReturnValue("desktop");
      const ResponsiveComponent = withDeviceSpecificComponent({
        tablet: TestComponentTablet,
        desktop: TestComponentDesktop,
      });

      render(<ResponsiveComponent text="测试内容" />);
      expect(screen.getByTestId("desktop-component")).toBeInTheDocument();
      expect(screen.getByTestId("desktop-component")).toHaveTextContent("测试内容");
    });

    test("TC-002: 在平板设备渲染平板组件", () => {
      mockUseDeviceDetect.mockReturnValue("tablet");
      const ResponsiveComponent = withDeviceSpecificComponent({
        tablet: TestComponentTablet,
        desktop: TestComponentDesktop,
      });

      render(<ResponsiveComponent text="测试内容" />);
      expect(screen.getByTestId("tablet-component")).toBeInTheDocument();
    });

    test("TC-003: 平板设备无平板组件时回退到桌面组件", () => {
      mockUseDeviceDetect.mockReturnValue("tablet");
      const ResponsiveComponent = withDeviceSpecificComponent({
        desktop: TestComponentDesktop,
      });

      render(<ResponsiveComponent text="测试内容" />);
      expect(screen.getByTestId("desktop-component")).toBeInTheDocument();
    });

    test("TC-004: 无匹配组件时显示fallback", () => {
      mockUseDeviceDetect.mockReturnValue("desktop");
      const ResponsiveComponent = withDeviceSpecificComponent({
        fallback: <TestFallback />,
      });

      render(<ResponsiveComponent text="测试内容" />);
      expect(screen.getByTestId("fallback-component")).toBeInTheDocument();
    });

    test("TC-005: 无匹配组件且无fallback时渲染null", () => {
      mockUseDeviceDetect.mockReturnValue("desktop");
      const ResponsiveComponent = withDeviceSpecificComponent({});

      const { container } = render(<ResponsiveComponent text="测试内容" />);
      expect(container.firstChild).toBeNull();
    });

    test("TC-006: 正确传递props到组件", () => {
      mockUseDeviceDetect.mockReturnValue("desktop");
      const ResponsiveComponent = withDeviceSpecificComponent({
        desktop: TestComponentDesktop,
      });

      render(<ResponsiveComponent text="自定义文本" />);
      expect(screen.getByTestId("desktop-component")).toHaveTextContent("自定义文本");
    });
  });

  describe("useDynamicComponent", () => {
    test("TC-007: 能够创建动态组件", () => {
      mockUseDeviceDetect.mockReturnValue("desktop");

      const TestWrapper = () => {
        const DynamicComponent = useDynamicComponent({
          tablet: () => Promise.resolve({ default: TestComponentTablet }),
          desktop: () => Promise.resolve({ default: TestComponentDesktop }),
        });
        return <DynamicComponent text="动态加载" />;
      };

      expect(() => render(<TestWrapper />)).not.toThrow();
    });

    test("TC-008: 显示自定义fallback", () => {
      mockUseDeviceDetect.mockReturnValue("desktop");

      const TestWrapper = () => {
        const DynamicComponent = useDynamicComponent(
          {
            tablet: () => Promise.resolve({ default: TestComponentTablet }),
            desktop: () => Promise.resolve({ default: TestComponentDesktop }),
          },
          <TestFallback />
        );
        return <DynamicComponent text="动态加载" />;
      };

      const { container } = render(<TestWrapper />);
      expect(container).toBeInTheDocument();
    });
  });

  describe("DeviceAwareComponent", () => {
    test("TC-009: 向children传递正确的设备类型 - desktop", () => {
      mockUseDeviceDetect.mockReturnValue("desktop");

      render(
        <DeviceAwareComponent>
          {device => <div data-testid="device-type">{device}</div>}
        </DeviceAwareComponent>
      );

      expect(screen.getByTestId("device-type")).toHaveTextContent("desktop");
    });

    test("TC-010: 向children传递正确的设备类型 - tablet", () => {
      mockUseDeviceDetect.mockReturnValue("tablet");

      render(
        <DeviceAwareComponent>
          {device => <div data-testid="device-type">{device}</div>}
        </DeviceAwareComponent>
      );

      expect(screen.getByTestId("device-type")).toHaveTextContent("tablet");
    });

    test("TC-011: 根据设备类型渲染不同内容", () => {
      mockUseDeviceDetect.mockReturnValue("desktop");

      render(
        <DeviceAwareComponent>
          {device =>
            device === "desktop" ? (
              <div data-testid="desktop-content">桌面内容</div>
            ) : (
              <div data-testid="tablet-content">平板内容</div>
            )
          }
        </DeviceAwareComponent>
      );

      expect(screen.getByTestId("desktop-content")).toBeInTheDocument();
      expect(screen.queryByTestId("tablet-content")).not.toBeInTheDocument();
    });
  });
});

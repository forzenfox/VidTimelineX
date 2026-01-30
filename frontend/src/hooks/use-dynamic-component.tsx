import React, { lazy, Suspense } from "react";
import { useDeviceDetect, DeviceType } from "./use-mobile";

/**
 * 设备特定组件加载器配置 - 移除移动端支持
 */
export interface DeviceComponentConfig<T extends React.ComponentType<unknown>> {
  tablet?: T;
  desktop?: T;
  fallback?: React.ReactNode;
}

/**
 * 动态组件加载的高阶组件 - 移除移动端支持
 * @param options 不同设备的组件配置
 * @returns 根据设备类型渲染对应组件的组件
 */
export function withDeviceSpecificComponent<T extends React.ComponentType<any>>(
  options: DeviceComponentConfig<T>
) {
  const DeviceSpecificComponent = (props: any) => {
    const device = useDeviceDetect();

    // 根据设备类型选择组件 - 只支持平板和桌面设备
    let Component: T | undefined;
    switch (device) {
      case "tablet":
        // 平板设备优先使用tablet组件，否则使用desktop组件
        Component = options.tablet || options.desktop;
        break;
      case "desktop":
        // 桌面设备使用desktop组件
        Component = options.desktop;
        break;
      default:
        // 默认使用桌面组件
        Component = options.desktop;
    }

    // 如果没有匹配的组件，返回fallback或null
    if (!Component) {
      return <>{options.fallback || null}</>;
    }

    return <Component {...props} />;
  };

  return DeviceSpecificComponent;
}

/**
 * 异步动态组件加载钩子 - 移除移动端支持
 * @param loaders 不同设备的组件加载器
 * @param fallback 加载中的 fallback 组件
 * @returns 动态加载的组件
 */
export function useDynamicComponent<T extends React.ComponentType<any>>(
  loaders: Record<DeviceType, () => Promise<{ default: T }>>,
  fallback?: React.ReactNode
) {
  const device = useDeviceDetect();

  // 根据设备类型选择加载器 - 只支持平板和桌面设备
  const loader = device ? loaders[device] : loaders.desktop;

  // 使用React.lazy异步加载组件
  const DynamicComponent = lazy(loader);

  // 返回Suspense包装的组件
  const Component = (props: any) => (
    <Suspense fallback={fallback || <div className="animate-pulse">加载中...</div>}>
      <DynamicComponent {...props} />
    </Suspense>
  );

  return Component;
}

/**
 * 设备感知的组件渲染工具 - 移除移动端支持
 * @param props 组件属性
 * @returns 根据设备类型渲染的组件
 */
export function DeviceAwareComponent(props: {
  children: (device: DeviceType | undefined) => React.ReactNode;
}) {
  const device = useDeviceDetect();
  return <>{props.children(device)}</>;
}

import * as React from "react";

// 设备断点定义 - 移除移动端支持，最小支持宽度为768px
export const BREAKPOINTS = {
  tablet: 1024,
  desktop: 1440,
} as const;

export type DeviceType = "tablet" | "desktop";

/**
 * 设备检测钩子，支持平板和桌面设备检测
 * @returns 当前设备类型
 */
export function useDeviceDetect() {
  const [device, setDevice] = React.useState<DeviceType | undefined>(undefined);

  React.useEffect(() => {
    // 设备检测逻辑 - 只支持平板和桌面设备
    const detectDevice = (): DeviceType => {
      const width = window.innerWidth;
      // 平板设备：768px - 1024px
      if (width < BREAKPOINTS.tablet) return "tablet";
      // 桌面设备：1024px及以上
      return "desktop";
    };

    // 初始化设备检测
    setDevice(detectDevice());

    // 使用媒体查询API监听断点变化，性能更优
    const tabletMql = window.matchMedia(`(max-width: ${BREAKPOINTS.tablet - 1}px)`);

    const mqlHandler = () => {
      setDevice(detectDevice());
    };

    // 添加事件监听 - 只监听平板断点，兼容测试环境
    if (typeof tabletMql.addEventListener === "function") {
      tabletMql.addEventListener("change", mqlHandler);

      // 清理函数
      return () => {
        tabletMql.removeEventListener("change", mqlHandler);
      };
    } else {
      // 测试环境中返回空清理函数
      return () => {};
    }
  }, []);

  return device;
}

/**
 * 简化的移动端检测钩子，保持向后兼容
 * @returns 是否为移动端设备 - 始终返回false，因为已移除移动端支持
 */
export function useIsMobile() {
  // 已移除移动端支持，始终返回false
  return false;
}

/**
 * 平板设备检测钩子
 * @returns 是否为平板设备（768px - 1024px）
 */
export function useIsTablet() {
  const device = useDeviceDetect();
  return device === "tablet";
}

/**
 * 桌面设备检测钩子
 * @returns 是否为桌面设备（1024px及以上）
 */
export function useIsDesktop() {
  const device = useDeviceDetect();
  return device === "desktop";
}

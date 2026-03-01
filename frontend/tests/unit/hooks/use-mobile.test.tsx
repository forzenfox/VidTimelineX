import { renderHook, act } from "@testing-library/react";
import {
  useIsMobile,
  useIsTablet,
  useIsDesktop,
  useDeviceDetect,
  BREAKPOINTS,
} from "@/hooks/use-mobile";

describe("use-mobile Hook测试", () => {
  let originalInnerWidth: number;
  let matchMediaListeners: Record<string, ((e: MediaQueryListEvent) => void)[]> = {};
  let originalMatchMedia: typeof window.matchMedia;

  beforeEach(() => {
    originalInnerWidth = window.innerWidth;
    originalMatchMedia = window.matchMedia;
    matchMediaListeners = {};

    (window.matchMedia as jest.Mock) = jest.fn(query => {
      const matches = query.includes("max-width: 767px")
        ? window.innerWidth < 768
        : window.innerWidth < BREAKPOINTS.tablet;

      return {
        matches,
        media: query,
        onchange: null,
        addEventListener: jest.fn((event, callback) => {
          if (!matchMediaListeners[query]) {
            matchMediaListeners[query] = [];
          }
          matchMediaListeners[query].push(callback);
        }),
        removeEventListener: jest.fn(),
      };
    });
  });

  afterEach(() => {
    window.innerWidth = originalInnerWidth;
    window.matchMedia = originalMatchMedia;
  });

  const simulateWindowResize = (width: number) => {
    window.innerWidth = width;

    Object.keys(matchMediaListeners).forEach(query => {
      const listeners = matchMediaListeners[query];
      listeners.forEach(callback => {
        callback({
          matches: query.includes("max-width: 767px") ? width < 768 : width < BREAKPOINTS.tablet,
        } as MediaQueryListEvent);
      });
    });
  };

  test("TC-001: useDeviceDetect 在桌面设备（1440px）返回 'desktop'", () => {
    window.innerWidth = 1440;
    const { result } = renderHook(() => useDeviceDetect());
    expect(result.current).toBe("desktop");
  });

  test("TC-002: useDeviceDetect 在平板设备（900px）返回 'tablet'", () => {
    window.innerWidth = 900;
    const { result } = renderHook(() => useDeviceDetect());
    expect(result.current).toBe("tablet");
  });

  test("TC-003: useDeviceDetect 在平板断点（1023px）返回 'tablet'", () => {
    window.innerWidth = BREAKPOINTS.tablet - 1;
    const { result } = renderHook(() => useDeviceDetect());
    expect(result.current).toBe("tablet");
  });

  test("TC-004: useDeviceDetect 在桌面断点（1024px）返回 'desktop'", () => {
    window.innerWidth = BREAKPOINTS.tablet;
    const { result } = renderHook(() => useDeviceDetect());
    expect(result.current).toBe("desktop");
  });

  test("TC-005: useDeviceDetect 响应窗口大小变化", () => {
    window.innerWidth = 1440;
    const { result } = renderHook(() => useDeviceDetect());
    expect(result.current).toBe("desktop");

    act(() => {
      simulateWindowResize(900);
    });
    expect(result.current).toBe("tablet");
  });

  test("TC-006: useIsMobile 在移动端（500px）返回 true", () => {
    window.innerWidth = 500;
    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(true);
  });

  test("TC-007: useIsMobile 在平板设备（900px）返回 false", () => {
    window.innerWidth = 900;
    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(false);
  });

  test("TC-008: useIsTablet 在平板设备（900px）返回 true", () => {
    window.innerWidth = 900;
    const { result } = renderHook(() => useIsTablet());
    expect(result.current).toBe(true);
  });

  test("TC-009: useIsTablet 在桌面设备（1440px）返回 false", () => {
    window.innerWidth = 1440;
    const { result } = renderHook(() => useIsTablet());
    expect(result.current).toBe(false);
  });

  test("TC-010: useIsDesktop 在桌面设备（1440px）返回 true", () => {
    window.innerWidth = 1440;
    const { result } = renderHook(() => useIsDesktop());
    expect(result.current).toBe(true);
  });

  test("TC-011: useIsDesktop 在平板设备（900px）返回 false", () => {
    window.innerWidth = 900;
    const { result } = renderHook(() => useIsDesktop());
    expect(result.current).toBe(false);
  });

  test("TC-012: useIsMobile 响应窗口大小变化", () => {
    window.innerWidth = 1440;
    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(false);

    act(() => {
      simulateWindowResize(500);
    });
    expect(result.current).toBe(true);
  });

  // ==================== 新增断点测试 ====================
  describe("TC-013: 断点测试", () => {
    test("断点测试 - 精确断点768px边界值", () => {
      // 测试768px边界（移动端和平板的分界）
      window.innerWidth = 768;
      const { result: tabletResult } = renderHook(() => useIsTablet());
      const { result: mobileResult } = renderHook(() => useIsMobile());

      // 768px应该被认为是平板（不小于768）
      expect(tabletResult.current).toBe(true);
      expect(mobileResult.current).toBe(false);
    });

    test("断点测试 - 精确断点1024px边界值", () => {
      // 测试1024px边界（平板和桌面的分界）
      window.innerWidth = 1024;
      const { result: tabletResult } = renderHook(() => useIsTablet());
      const { result: desktopResult } = renderHook(() => useIsDesktop());

      // 1024px应该被认为是桌面（不小于1024）
      expect(tabletResult.current).toBe(false);
      expect(desktopResult.current).toBe(true);
    });

    test("断点测试 - 极小屏幕尺寸处理", () => {
      window.innerWidth = 320;
      const { result: mobileResult } = renderHook(() => useIsMobile());
      const { result: tabletResult } = renderHook(() => useIsTablet());

      expect(mobileResult.current).toBe(true);
      expect(tabletResult.current).toBe(true); // 小于768也是tablet
    });

    test("断点测试 - 超大屏幕尺寸处理", () => {
      window.innerWidth = 3840; // 4K屏幕
      const { result: desktopResult } = renderHook(() => useIsDesktop());
      const { result: tabletResult } = renderHook(() => useIsTablet());

      expect(desktopResult.current).toBe(true);
      expect(tabletResult.current).toBe(false);
    });

    test("断点测试 - 多次跨越断点切换", () => {
      window.innerWidth = 1440;
      const { result } = renderHook(() => useDeviceDetect());

      expect(result.current).toBe("desktop");

      // 多次跨越断点
      act(() => simulateWindowResize(900));
      expect(result.current).toBe("tablet");

      act(() => simulateWindowResize(1440));
      expect(result.current).toBe("desktop");

      act(() => simulateWindowResize(500));
      expect(result.current).toBe("tablet");

      act(() => simulateWindowResize(1200));
      expect(result.current).toBe("desktop");
    });
  });

  // ==================== 新增方向变化测试 ====================
  describe("TC-014: 方向变化测试", () => {
    test("方向变化 - 模拟横屏到竖屏切换", () => {
      // 模拟iPad横屏（横向宽度大于1024）
      window.innerWidth = 1366;
      const { result } = renderHook(() => useDeviceDetect());

      expect(result.current).toBe("desktop");

      // 切换到竖屏（宽度小于1024）
      act(() => {
        simulateWindowResize(1024);
      });

      expect(result.current).toBe("desktop");

      act(() => {
        simulateWindowResize(768);
      });

      expect(result.current).toBe("tablet");
    });

    test("方向变化 - 模拟手机横屏", () => {
      // 手机竖屏
      window.innerWidth = 375;
      const { result: mobileResult } = renderHook(() => useIsMobile());
      const { result: tabletResult } = renderHook(() => useIsTablet());

      expect(mobileResult.current).toBe(true);
      expect(tabletResult.current).toBe(true);

      // 手机横屏（宽度可能达到800+）
      act(() => {
        simulateWindowResize(812);
      });

      expect(mobileResult.current).toBe(false);
      expect(tabletResult.current).toBe(true);
    });

    test("方向变化 - 快速方向切换防抖", () => {
      window.innerWidth = 1024;
      const { result } = renderHook(() => useDeviceDetect());

      // 快速多次切换
      act(() => simulateWindowResize(900));
      act(() => simulateWindowResize(1100));
      act(() => simulateWindowResize(800));
      act(() => simulateWindowResize(1200));

      // 最终状态应该正确
      expect(result.current).toBe("desktop");
    });
  });
});

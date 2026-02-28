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
});

import { renderHook } from "@testing-library/react";
import { useIsMobile, useIsTablet, useIsDesktop, useDeviceDetect } from "@/hooks/use-mobile";

describe("use-mobile Hook测试", () => {
  /**
   * 测试用例 TC-001: useIsMobile 功能测试
   * 测试目标：验证useIsMobile Hook能够正确返回状态
   */
  test("TC-001: useIsMobile 功能测试", () => {
    const { result } = renderHook(() => useIsMobile());

    expect(result.current).toBeDefined();
    expect(typeof result.current).toBe("boolean");
  });

  /**
   * 测试用例 TC-002: useIsTablet 功能测试
   * 测试目标：验证useIsTablet Hook能够正确返回状态
   */
  test("TC-002: useIsTablet 功能测试", () => {
    const { result } = renderHook(() => useIsTablet());

    expect(result.current).toBeDefined();
    expect(typeof result.current).toBe("boolean");
  });

  /**
   * 测试用例 TC-003: useIsDesktop 功能测试
   * 测试目标：验证useIsDesktop Hook能够正确返回状态
   */
  test("TC-003: useIsDesktop 功能测试", () => {
    const { result } = renderHook(() => useIsDesktop());

    expect(result.current).toBeDefined();
    expect(typeof result.current).toBe("boolean");
  });

  /**
   * 测试用例 TC-004: useDeviceDetect 功能测试
   * 测试目标：验证useDeviceDetect Hook能够正确返回状态
   */
  test("TC-004: useDeviceDetect 功能测试", () => {
    const { result } = renderHook(() => useDeviceDetect());

    expect(result.current).toBeDefined();
  });
});

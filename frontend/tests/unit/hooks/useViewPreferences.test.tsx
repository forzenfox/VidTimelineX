import { renderHook, act } from "@testing-library/react";
import { useViewPreferences } from "@/hooks/useViewPreferences";

const STORAGE_KEY = "vidtimelinex_view_mode";

describe("useViewPreferences Hook", () => {
  beforeEach(() => {
    localStorage.clear();
    jest.spyOn(Storage.prototype, "getItem");
    jest.spyOn(Storage.prototype, "setItem");
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("初始状态", () => {
    test("TC-001: 默认视图模式应为 timeline", () => {
      const { result } = renderHook(() => useViewPreferences());
      expect(result.current.viewMode).toBe("timeline");
    });

    test("TC-002: localStorage 无值时应使用默认视图模式", () => {
      (localStorage.getItem as jest.Mock).mockReturnValue(null);
      const { result } = renderHook(() => useViewPreferences());
      expect(result.current.viewMode).toBe("timeline");
    });
  });

  describe("localStorage 读取", () => {
    test("TC-003: 能正确读取 localStorage 中保存的视图模式", () => {
      (localStorage.getItem as jest.Mock).mockReturnValue("grid");
      const { result } = renderHook(() => useViewPreferences());
      expect(result.current.viewMode).toBe("grid");
    });

    test("TC-004: 能正确读取 localStorage 中的 list 视图模式", () => {
      (localStorage.getItem as jest.Mock).mockReturnValue("list");
      const { result } = renderHook(() => useViewPreferences());
      expect(result.current.viewMode).toBe("list");
    });

    test("TC-005: localStorage 值为非法值时应回退到默认模式", () => {
      (localStorage.getItem as jest.Mock).mockReturnValue("invalid_mode");
      const { result } = renderHook(() => useViewPreferences());
      expect(result.current.viewMode).toBe("timeline");
    });
  });

  describe("setViewMode 方法", () => {
    test("TC-006: setViewMode 能切换到 grid 视图", () => {
      const { result } = renderHook(() => useViewPreferences());
      act(() => {
        result.current.setViewMode("grid");
      });
      expect(result.current.viewMode).toBe("grid");
      expect(localStorage.setItem).toHaveBeenCalledWith(STORAGE_KEY, "grid");
    });

    test("TC-007: setViewMode 能切换到 list 视图", () => {
      const { result } = renderHook(() => useViewPreferences());
      act(() => {
        result.current.setViewMode("list");
      });
      expect(result.current.viewMode).toBe("list");
      expect(localStorage.setItem).toHaveBeenCalledWith(STORAGE_KEY, "list");
    });

    test("TC-008: setViewMode 能切换回 timeline 视图", () => {
      (localStorage.getItem as jest.Mock).mockReturnValue("grid");
      const { result } = renderHook(() => useViewPreferences());
      act(() => {
        result.current.setViewMode("timeline");
      });
      expect(result.current.viewMode).toBe("timeline");
      expect(localStorage.setItem).toHaveBeenCalledWith(STORAGE_KEY, "timeline");
    });

    test("TC-009: setViewMode 会保存到 localStorage", () => {
      const { result } = renderHook(() => useViewPreferences());
      act(() => {
        result.current.setViewMode("grid");
      });
      expect(localStorage.setItem).toHaveBeenCalledTimes(1);
    });

    test("TC-010: 多次调用 setViewMode 正常工作", () => {
      const { result } = renderHook(() => useViewPreferences());

      act(() => {
        result.current.setViewMode("grid");
      });
      expect(result.current.viewMode).toBe("grid");

      act(() => {
        result.current.setViewMode("list");
      });
      expect(result.current.viewMode).toBe("list");

      act(() => {
        result.current.setViewMode("timeline");
      });
      expect(result.current.viewMode).toBe("timeline");
    });
  });

  describe("边界情况处理", () => {
    test("TC-011: localStorage 抛出异常时使用默认模式", () => {
      (localStorage.getItem as jest.Mock).mockImplementation(() => {
        throw new Error("Storage error");
      });
      const { result } = renderHook(() => useViewPreferences());
      expect(result.current.viewMode).toBe("timeline");
    });

    test("TC-012: setViewMode 抛出异常时不崩溃", () => {
      (localStorage.setItem as jest.Mock).mockImplementation(() => {
        throw new Error("Storage error");
      });
      const { result } = renderHook(() => useViewPreferences());
      expect(() => {
        act(() => {
          result.current.setViewMode("grid");
        });
      }).not.toThrow();
    });

    test("TC-013: 接收自定义默认值的参数", () => {
      const { result } = renderHook(() => useViewPreferences({ defaultViewMode: "grid" }));
      expect(result.current.viewMode).toBe("grid");
    });

    test("TC-014: 接收自定义存储键名", () => {
      const customKey = "custom_storage_key";
      const { result } = renderHook(() => useViewPreferences({ storageKey: customKey }));
      act(() => {
        result.current.setViewMode("list");
      });
      expect(localStorage.setItem).toHaveBeenCalledWith(customKey, "list");
    });
  });
});

import { renderHook, act } from "@testing-library/react";
import { usePagination } from "@/hooks/usePagination";

describe("usePagination Hook 测试", () => {
  const mockItems = Array.from({ length: 100 }, (_, i) => ({
    id: String(i + 1),
    title: `视频 ${i + 1}`,
  }));

  describe("TC-001: 初始化状态测试", () => {
    test("使用默认参数初始化", () => {
      const { result } = renderHook(() => usePagination(mockItems));

      expect(result.current.currentPage).toBe(1);
      expect(result.current.pageSize).toBe(12);
      expect(result.current.totalPages).toBe(9);
      expect(result.current.totalItems).toBe(100);
      expect(result.current.startIndex).toBe(0);
      expect(result.current.endIndex).toBe(12);
      expect(result.current.paginatedItems).toHaveLength(12);
      expect(result.current.hasNextPage).toBe(true);
      expect(result.current.hasPrevPage).toBe(false);
    });

    test("使用自定义初始参数", () => {
      const { result } = renderHook(() =>
        usePagination(mockItems, {
          initialPage: 2,
          initialPageSize: 24,
        })
      );

      expect(result.current.currentPage).toBe(2);
      expect(result.current.pageSize).toBe(24);
      expect(result.current.totalPages).toBe(5);
      expect(result.current.startIndex).toBe(24);
      expect(result.current.endIndex).toBe(48);
    });

    test("空数组初始化", () => {
      const { result } = renderHook(() => usePagination([]));

      expect(result.current.currentPage).toBe(1);
      expect(result.current.totalPages).toBe(0);
      expect(result.current.paginatedItems).toHaveLength(0);
      expect(result.current.hasNextPage).toBe(false);
      expect(result.current.hasPrevPage).toBe(false);
    });
  });

  describe("TC-002: 页码切换逻辑测试", () => {
    test("setPage 切换页码", () => {
      const { result } = renderHook(() => usePagination(mockItems));

      act(() => {
        result.current.setPage(3);
      });

      expect(result.current.currentPage).toBe(3);
      expect(result.current.startIndex).toBe(24);
      expect(result.current.endIndex).toBe(36);
      expect(result.current.paginatedItems[0].id).toBe("25");
    });

    test("页码边界限制 - 小于1", () => {
      const { result } = renderHook(() => usePagination(mockItems));

      act(() => {
        result.current.setPage(0);
      });

      expect(result.current.currentPage).toBe(1);
    });

    test("页码边界限制 - 超过最大页", () => {
      const { result } = renderHook(() => usePagination(mockItems));

      act(() => {
        result.current.setPage(100);
      });

      expect(result.current.currentPage).toBe(9);
    });

    test("goToNextPage 下一页", () => {
      const { result } = renderHook(() => usePagination(mockItems));

      act(() => {
        result.current.goToNextPage();
      });

      expect(result.current.currentPage).toBe(2);
      expect(result.current.hasPrevPage).toBe(true);
    });

    test("goToNextPage 最后一页不递增", () => {
      const { result } = renderHook(() => usePagination(mockItems));

      act(() => {
        result.current.setPage(9);
      });

      act(() => {
        result.current.goToNextPage();
      });

      expect(result.current.currentPage).toBe(9);
    });

    test("goToPrevPage 上一页", () => {
      const { result } = renderHook(() => usePagination(mockItems, { initialPage: 3 }));

      act(() => {
        result.current.goToPrevPage();
      });

      expect(result.current.currentPage).toBe(2);
    });

    test("goToPrevPage 第一页不递减", () => {
      const { result } = renderHook(() => usePagination(mockItems));

      act(() => {
        result.current.goToPrevPage();
      });

      expect(result.current.currentPage).toBe(1);
    });

    test("goToFirstPage 回到首页", () => {
      const { result } = renderHook(() => usePagination(mockItems, { initialPage: 5 }));

      act(() => {
        result.current.goToFirstPage();
      });

      expect(result.current.currentPage).toBe(1);
    });

    test("goToLastPage 跳到末页", () => {
      const { result } = renderHook(() => usePagination(mockItems));

      act(() => {
        result.current.goToLastPage();
      });

      expect(result.current.currentPage).toBe(9);
    });
  });

  describe("TC-003: 每页数量变更测试", () => {
    test("setPageSize 变更每页数量", () => {
      const { result } = renderHook(() => usePagination(mockItems));

      act(() => {
        result.current.setPageSize(24);
      });

      expect(result.current.pageSize).toBe(24);
      expect(result.current.totalPages).toBe(5);
      expect(result.current.paginatedItems).toHaveLength(24);
    });

    test("变更每页数量后重置到第一页", () => {
      const { result } = renderHook(() => usePagination(mockItems, { initialPage: 5 }));

      act(() => {
        result.current.setPageSize(48);
      });

      expect(result.current.currentPage).toBe(1);
      expect(result.current.totalPages).toBe(3);
    });

    test("每页数量选项限制", () => {
      const { result } = renderHook(() =>
        usePagination(mockItems, {
          pageSizeOptions: [12, 24, 48],
        })
      );

      act(() => {
        result.current.setPageSize(100);
      });

      // 如果不在选项中，应该使用最接近的选项或默认值
      expect(result.current.pageSize).toBe(12);
    });
  });

  describe("TC-004: 边界条件测试", () => {
    test("单页数据 - 少于pageSize", () => {
      const smallItems = mockItems.slice(0, 5);
      const { result } = renderHook(() => usePagination(smallItems));

      expect(result.current.totalPages).toBe(1);
      expect(result.current.paginatedItems).toHaveLength(5);
      expect(result.current.hasNextPage).toBe(false);
    });

    test("恰好整除 - 无多余数据", () => {
      const exactItems = mockItems.slice(0, 24);
      const { result } = renderHook(() => usePagination(exactItems, { initialPageSize: 12 }));

      expect(result.current.totalPages).toBe(2);

      act(() => {
        result.current.setPage(2);
      });

      expect(result.current.paginatedItems).toHaveLength(12);
    });

    test("末页数据不足pageSize", () => {
      const { result } = renderHook(() => usePagination(mockItems));

      act(() => {
        result.current.goToLastPage();
      });

      // 100条数据，每页12条，末页只有4条
      expect(result.current.paginatedItems).toHaveLength(4);
    });

    test("数据变更后重新计算", () => {
      const { result, rerender } = renderHook(({ items }) => usePagination(items), {
        initialProps: { items: mockItems },
      });

      expect(result.current.totalItems).toBe(100);

      const smallerItems = mockItems.slice(0, 30);
      rerender({ items: smallerItems });

      expect(result.current.totalItems).toBe(30);
      expect(result.current.totalPages).toBe(3);
    });
  });

  describe("TC-005: 分页数据正确性测试", () => {
    test("第一页数据正确", () => {
      const { result } = renderHook(() => usePagination(mockItems));

      expect(result.current.paginatedItems[0].id).toBe("1");
      expect(result.current.paginatedItems[11].id).toBe("12");
    });

    test("中间页数据正确", () => {
      const { result } = renderHook(() => usePagination(mockItems, { initialPage: 3 }));

      expect(result.current.paginatedItems[0].id).toBe("25");
      expect(result.current.paginatedItems[11].id).toBe("36");
    });

    test("末页数据正确", () => {
      const { result } = renderHook(() => usePagination(mockItems));

      act(() => {
        result.current.goToLastPage();
      });

      expect(result.current.paginatedItems[0].id).toBe("97");
      expect(result.current.paginatedItems[3].id).toBe("100");
    });
  });
});

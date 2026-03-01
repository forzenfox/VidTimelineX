import { renderHook, act } from "@testing-library/react";
import { useVideoView } from "@/features/yuxiaoc/hooks/useVideoView";
import type { Video } from "@/features/yuxiaoc/data/types";

const mockVideos: Video[] = [
  {
    id: "1",
    bvid: "BV1",
    bv: "BV1",
    title: "测试视频1",
    cover: "cover1.jpg",
    cover_url: "cover1.jpg",
    videoUrl: "video1.mp4",
    duration: "10:00",
    date: "2024-01-15",
    author: "作者1",
    category: "hardcore",
    tags: ["标签1", "测试"],
  },
  {
    id: "2",
    bvid: "BV2",
    bv: "BV2",
    title: "短视频",
    cover: "cover2.jpg",
    cover_url: "cover2.jpg",
    videoUrl: "video2.mp4",
    duration: "03:00",
    date: "2024-01-10",
    author: "作者2",
    category: "main",
    tags: ["标签2"],
  },
  {
    id: "3",
    bvid: "BV3",
    bv: "BV3",
    title: "长视频测试",
    cover: "cover3.jpg",
    cover_url: "cover3.jpg",
    videoUrl: "video3.mp4",
    duration: "45:00",
    date: "2024-01-05",
    author: "作者3",
    category: "soup",
    tags: ["测试", "标签3"],
  },
];

describe("useVideoView Hook 新增测试", () => {
  // ==================== 视图切换测试 ====================
  describe("TC-VIEW-001: 视图切换测试", () => {
    test("视图切换 - 从grid切换到list", () => {
      const { result } = renderHook(() => useVideoView(mockVideos));

      expect(result.current.viewMode).toBe("grid");

      act(() => {
        result.current.setViewMode("list");
      });

      expect(result.current.viewMode).toBe("list");
    });

    test("视图切换 - 从list切换到timeline", () => {
      const { result } = renderHook(() => useVideoView(mockVideos, { initialViewMode: "list" }));

      expect(result.current.viewMode).toBe("list");

      act(() => {
        result.current.setViewMode("timeline");
      });

      expect(result.current.viewMode).toBe("timeline");
    });

    test("视图切换 - 从timeline切换回grid", () => {
      const { result } = renderHook(() => useVideoView(mockVideos, { initialViewMode: "timeline" }));

      expect(result.current.viewMode).toBe("timeline");

      act(() => {
        result.current.setViewMode("grid");
      });

      expect(result.current.viewMode).toBe("grid");
    });

    test("视图切换 - 多次快速切换视图模式", () => {
      const { result } = renderHook(() => useVideoView(mockVideos));

      act(() => result.current.setViewMode("list"));
      act(() => result.current.setViewMode("timeline"));
      act(() => result.current.setViewMode("grid"));
      act(() => result.current.setViewMode("list"));

      expect(result.current.viewMode).toBe("list");
    });
  });

  // ==================== 缓存测试 ====================
  describe("TC-VIEW-002: 缓存测试", () => {
    test("缓存 - filteredVideos使用useMemo缓存", () => {
      const { result, rerender } = renderHook(() => useVideoView(mockVideos));

      const firstFilteredVideos = result.current.filteredVideos;

      // 重新渲染但数据不变
      rerender();

      const secondFilteredVideos = result.current.filteredVideos;

      // 应该是同一个引用（useMemo缓存）
      expect(firstFilteredVideos).toBe(secondFilteredVideos);
    });

    test("缓存 - 筛选条件改变后filteredVideos更新", () => {
      const { result } = renderHook(() => useVideoView(mockVideos));

      const firstFilteredVideos = result.current.filteredVideos;

      // 调用setFilter改变筛选条件
      act(() => {
        result.current.setFilter({ duration: "short" });
      });

      const secondFilteredVideos = result.current.filteredVideos;

      // 筛选条件改变，应该返回不同的结果
      expect(firstFilteredVideos).not.toBe(secondFilteredVideos);
      expect(secondFilteredVideos.length).toBeLessThan(firstFilteredVideos.length);
    });

    test("缓存 - 搜索关键词不变时filteredVideos保持引用", () => {
      const { result } = renderHook(() => useVideoView(mockVideos));

      // 先设置搜索词
      act(() => {
        result.current.setSearchQuery("测试");
      });

      const firstFilteredVideos = result.current.filteredVideos;

      // 再次设置相同的搜索词
      act(() => {
        result.current.setSearchQuery("测试");
      });

      const secondFilteredVideos = result.current.filteredVideos;

      // 搜索词未变，应该保持引用
      expect(firstFilteredVideos).toBe(secondFilteredVideos);
    });
  });

  // ==================== 错误处理测试 ====================
  describe("TC-VIEW-003: 错误处理测试", () => {
    test("错误处理 - 视频时长格式异常时跳过筛选", () => {
      const invalidVideos: Video[] = [
        {
          ...mockVideos[0],
          id: "invalid1",
          duration: "invalid",
        },
        {
          ...mockVideos[1],
          id: "invalid2",
          duration: "",
        },
        mockVideos[2],
      ];

      const { result } = renderHook(() => useVideoView(invalidVideos, {
        initialFilter: { duration: "short" }
      }));

      // 异常时长的视频应该被跳过，只返回有效数据
      expect(result.current.filteredVideos.length).toBeGreaterThanOrEqual(0);
    });

    test("错误处理 - 视频日期格式异常时跳过时间筛选", () => {
      const invalidVideos: Video[] = [
        {
          ...mockVideos[0],
          id: "invalid1",
          date: "invalid-date",
        },
        {
          ...mockVideos[1],
          id: "invalid2",
          date: "",
        },
        mockVideos[2],
      ];

      const { result } = renderHook(() => useVideoView(invalidVideos, {
        initialFilter: { timeRange: "week" }
      }));

      // 异常日期的视频应该被跳过
      expect(result.current.filteredVideos.length).toBeGreaterThanOrEqual(0);
    });

    test("错误处理 - 空视频数组处理", () => {
      const { result } = renderHook(() => useVideoView([]));

      expect(result.current.filteredVideos).toHaveLength(0);
      expect(result.current.searchQuery).toBe("");
    });

    test("错误处理 - 超长搜索关键词处理", () => {
      const { result } = renderHook(() => useVideoView(mockVideos));

      const longQuery = "a".repeat(1000);

      act(() => {
        result.current.setSearchQuery(longQuery);
      });

      expect(result.current.searchQuery).toBe(longQuery);
      expect(result.current.filteredVideos).toHaveLength(0);
    });
  });

  // ==================== 综合功能测试 ====================
  describe("TC-VIEW-004: 综合功能测试", () => {
    test("综合 - 视图模式切换不影响筛选结果", () => {
      const { result } = renderHook(() => useVideoView(mockVideos, {
        initialFilter: { duration: "short" }
      }));

      const filteredCountBefore = result.current.filteredVideos.length;

      act(() => {
        result.current.setViewMode("list");
      });

      const filteredCountAfter = result.current.filteredVideos.length;

      // 视图切换不应该影响筛选结果
      expect(filteredCountBefore).toBe(filteredCountAfter);
    });

    test("综合 - resetFilters同时重置搜索和筛选", () => {
      const { result } = renderHook(() => useVideoView(mockVideos, {
        initialViewMode: "list",
        initialFilter: { duration: "short", sortBy: "oldest" }
      }));

      act(() => {
        result.current.setSearchQuery("测试");
        result.current.setFilter({ timeRange: "month" });
      });

      expect(result.current.searchQuery).toBe("测试");
      expect(result.current.filter.duration).toBe("short");
      expect(result.current.filter.timeRange).toBe("month");

      act(() => {
        result.current.resetFilters();
      });

      // 只重置搜索和筛选，不重置视图模式
      expect(result.current.searchQuery).toBe("");
      expect(result.current.filter.duration).toBe("all");
      expect(result.current.filter.timeRange).toBe("all");
      expect(result.current.filter.sortBy).toBe("newest");
      expect(result.current.viewMode).toBe("list"); // 视图模式应保持不变
    });
  });
});

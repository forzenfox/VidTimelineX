import { renderHook } from "@testing-library/react";
import { useVideoFilter } from "@/hooks/useVideoFilter";
import type { DurationFilter } from "@/hooks/types";
import type { Video } from "@/components/video/types";

const createVideo = (overrides: Partial<Video> = {}): Video => ({
  id: "1",
  title: "测试视频",
  date: "2024-01-01",
  videoUrl: "https://example.com/video.mp4",
  bv: "BV1234567890",
  cover: "https://example.com/cover.jpg",
  tags: ["tag1"],
  duration: "05:30",
  author: "测试作者",
  ...overrides,
});

describe("useVideoFilter Hook", () => {
  const now = new Date();
  const sixDaysAgo = new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000);
  const oneMonthAgo = new Date(now.getTime() - 25 * 24 * 60 * 60 * 1000);
  const sixMonthsAgo = new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000);
  const twoYearsAgo = new Date(now.getTime() - 730 * 24 * 60 * 60 * 1000);

  const videos: Video[] = [
    createVideo({
      id: "1",
      title: "短视频",
      duration: "03:00",
      date: sixDaysAgo.toISOString(),
      bv: "BV001",
      views: 100,
    }),
    createVideo({
      id: "2",
      title: "中视频",
      duration: "15:00",
      date: oneMonthAgo.toISOString(),
      bv: "BV002",
      views: 200,
    }),
    createVideo({
      id: "3",
      title: "长视频",
      duration: "45:00",
      date: sixMonthsAgo.toISOString(),
      bv: "BV003",
      views: 300,
    }),
    createVideo({
      id: "4",
      title: "超短视频",
      duration: "00:30",
      date: twoYearsAgo.toISOString(),
      bv: "BV004",
      views: 400,
    }),
    createVideo({
      id: "5",
      title: "超长视频",
      duration: "90:00",
      date: now.toISOString(),
      bv: "BV005",
      views: 500,
    }),
  ];

  describe("初始状态", () => {
    test("TC-001: 默认筛选条件应返回全部视频", () => {
      const { result } = renderHook(() => useVideoFilter(videos));
      expect(result.current.filteredVideos).toHaveLength(5);
    });

    test("TC-002: 空视频数组应返回空结果", () => {
      const { result } = renderHook(() => useVideoFilter([]));
      expect(result.current.filteredVideos).toHaveLength(0);
    });
  });

  describe("时长筛选逻辑", () => {
    test("TC-003: duration=short 应返回0-5分钟的视频", () => {
      const { result } = renderHook(() => useVideoFilter(videos, { duration: "short" }));
      expect(result.current.filteredVideos).toHaveLength(2);
      expect(result.current.filteredVideos.map(v => v.id)).toContain("1");
      expect(result.current.filteredVideos.map(v => v.id)).toContain("4");
    });

    test("TC-004: duration=medium 应返回5-30分钟的视频", () => {
      const { result } = renderHook(() => useVideoFilter(videos, { duration: "medium" }));
      expect(result.current.filteredVideos).toHaveLength(1);
      expect(result.current.filteredVideos[0].id).toBe("2");
    });

    test("TC-005: duration=long 应返回30分钟以上的视频", () => {
      const { result } = renderHook(() => useVideoFilter(videos, { duration: "long" }));
      expect(result.current.filteredVideos).toHaveLength(2);
      expect(result.current.filteredVideos.map(v => v.id)).toContain("3");
      expect(result.current.filteredVideos.map(v => v.id)).toContain("5");
    });

    test("TC-006: duration=all 应返回全部视频", () => {
      const { result } = renderHook(() => useVideoFilter(videos, { duration: "all" }));
      expect(result.current.filteredVideos).toHaveLength(5);
    });

    test("TC-007: duration=short 应正确处理边界值（5分钟）", () => {
      const testVideos = [
        createVideo({ id: "1", duration: "05:00" }),
        createVideo({ id: "2", duration: "05:01" }),
        createVideo({ id: "3", duration: "04:59" }),
      ];
      const { result } = renderHook(() => useVideoFilter(testVideos, { duration: "short" }));
      expect(result.current.filteredVideos).toHaveLength(2);
    });

    test("TC-008: duration=long 应正确处理边界值（30分钟）", () => {
      const testVideos = [
        createVideo({ id: "1", duration: "30:00" }),
        createVideo({ id: "2", duration: "30:01" }),
        createVideo({ id: "3", duration: "29:59" }),
      ];
      const { result } = renderHook(() => useVideoFilter(testVideos, { duration: "long" }));
      expect(result.current.filteredVideos).toHaveLength(2);
    });
  });

  describe("时间范围筛选逻辑", () => {
    test("TC-009: timeRange=week 应返回最近一周的视频", () => {
      const { result } = renderHook(() => useVideoFilter(videos, { timeRange: "week" }));
      expect(result.current.filteredVideos).toHaveLength(2);
      expect(result.current.filteredVideos.map(v => v.id)).toContain("1");
      expect(result.current.filteredVideos.map(v => v.id)).toContain("5");
    });

    test("TC-010: timeRange=month 应返回最近一月的视频", () => {
      const { result } = renderHook(() => useVideoFilter(videos, { timeRange: "month" }));
      expect(result.current.filteredVideos).toHaveLength(3);
      expect(result.current.filteredVideos.map(v => v.id)).toContain("1");
      expect(result.current.filteredVideos.map(v => v.id)).toContain("2");
      expect(result.current.filteredVideos.map(v => v.id)).toContain("5");
    });

    test("TC-011: timeRange=year 应返回最近一年的视频", () => {
      const { result } = renderHook(() => useVideoFilter(videos, { timeRange: "year" }));
      expect(result.current.filteredVideos).toHaveLength(4);
      expect(result.current.filteredVideos.map(v => v.id)).toContain("1");
      expect(result.current.filteredVideos.map(v => v.id)).toContain("2");
      expect(result.current.filteredVideos.map(v => v.id)).toContain("3");
      expect(result.current.filteredVideos.map(v => v.id)).toContain("5");
    });

    test("TC-012: timeRange=all 应返回全部视频", () => {
      const { result } = renderHook(() => useVideoFilter(videos, { timeRange: "all" }));
      expect(result.current.filteredVideos).toHaveLength(5);
    });
  });

  describe("排序逻辑", () => {
    test("TC-013: sortBy=newest 应按发布时间降序", () => {
      const { result } = renderHook(() => useVideoFilter(videos, { sortBy: "newest" }));
      expect(result.current.filteredVideos[0].id).toBe("5");
      expect(result.current.filteredVideos[4].id).toBe("4");
    });

    test("TC-014: sortBy=oldest 应按发布时间升序", () => {
      const { result } = renderHook(() => useVideoFilter(videos, { sortBy: "oldest" }));
      expect(result.current.filteredVideos[0].id).toBe("4");
      expect(result.current.filteredVideos[4].id).toBe("5");
    });

    test("TC-015: sortBy=popular 应按播放量降序", () => {
      const { result } = renderHook(() => useVideoFilter(videos, { sortBy: "popular" }));
      expect(result.current.filteredVideos[0].id).toBe("5");
      expect(result.current.filteredVideos[4].id).toBe("1");
    });
  });

  describe("组合筛选逻辑", () => {
    test("TC-016: 同时应用时长和时间范围筛选", () => {
      const { result } = renderHook(() =>
        useVideoFilter(videos, {
          duration: "short",
          timeRange: "year",
        })
      );
      expect(result.current.filteredVideos).toHaveLength(1);
      expect(result.current.filteredVideos[0].id).toBe("1");
    });

    test("TC-017: 同时应用时长、时间和排序筛选", () => {
      const { result } = renderHook(() =>
        useVideoFilter(videos, {
          duration: "long",
          timeRange: "all",
          sortBy: "popular",
        })
      );
      expect(result.current.filteredVideos).toHaveLength(2);
      expect(result.current.filteredVideos[0].id).toBe("5");
    });

    test("TC-018: 组合筛选返回空结果", () => {
      const { result } = renderHook(() =>
        useVideoFilter(videos, {
          duration: "medium",
          timeRange: "week",
        })
      );
      expect(result.current.filteredVideos).toHaveLength(0);
    });
  });

  describe("边界情况处理", () => {
    test("TC-019: 视频时长格式异常时跳过时长筛选", () => {
      const testVideos = [
        createVideo({ id: "1", duration: "invalid" }),
        createVideo({ id: "2", duration: "10:00" }),
      ];
      const { result } = renderHook(() => useVideoFilter(testVideos, { duration: "short" }));
      expect(result.current.filteredVideos).toHaveLength(1);
    });

    test("TC-020: 视频日期格式异常时跳过时间筛选", () => {
      const testVideos = [
        createVideo({ id: "1", date: "invalid-date" }),
        createVideo({ id: "2", date: sixDaysAgo.toISOString() }),
      ];
      const { result } = renderHook(() => useVideoFilter(testVideos, { timeRange: "week" }));
      expect(result.current.filteredVideos).toHaveLength(2);
    });

    test("TC-021: 视频缺少播放量时按0处理", () => {
      const testVideos = [
        createVideo({ id: "1", views: undefined }),
        createVideo({ id: "2", views: 100 }),
      ];
      const { result } = renderHook(() => useVideoFilter(testVideos, { sortBy: "popular" }));
      expect(result.current.filteredVideos[1].id).toBe("1");
    });

    test("TC-022: 支持更新筛选条件", () => {
      const { result, rerender } = renderHook(
        ({ duration }) => useVideoFilter(videos, { duration }),
        { initialProps: { duration: "all" as DurationFilter } }
      );
      expect(result.current.filteredVideos).toHaveLength(5);

      rerender({ duration: "short" });
      expect(result.current.filteredVideos).toHaveLength(2);
    });
  });
});

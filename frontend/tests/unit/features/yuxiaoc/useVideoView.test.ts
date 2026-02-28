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

describe("useVideoView Hook 测试", () => {
  test("TC-HOOK-001: 默认状态正确", () => {
    const { result } = renderHook(() => useVideoView(mockVideos));

    expect(result.current.viewMode).toBe("grid");
    expect(result.current.filter.duration).toBe("all");
    expect(result.current.filter.timeRange).toBe("all");
    expect(result.current.filter.sortBy).toBe("newest");
    expect(result.current.searchQuery).toBe("");
    expect(result.current.filteredVideos).toHaveLength(3);
  });

  test("TC-HOOK-002: 可以切换视图模式", () => {
    const { result } = renderHook(() => useVideoView(mockVideos));

    act(() => {
      result.current.setViewMode("list");
    });

    expect(result.current.viewMode).toBe("list");

    act(() => {
      result.current.setViewMode("timeline");
    });

    expect(result.current.viewMode).toBe("timeline");
  });

  test("TC-HOOK-003: 可以设置搜索关键词", () => {
    const { result } = renderHook(() => useVideoView(mockVideos));

    act(() => {
      result.current.setSearchQuery("测试");
    });

    expect(result.current.searchQuery).toBe("测试");
    // 应该过滤出包含"测试"的视频
    expect(result.current.filteredVideos.length).toBeGreaterThanOrEqual(2);
  });

  test("TC-HOOK-004: 搜索支持标题匹配", () => {
    const { result } = renderHook(() => useVideoView(mockVideos));

    act(() => {
      result.current.setSearchQuery("短视频");
    });

    expect(result.current.filteredVideos).toHaveLength(1);
    expect(result.current.filteredVideos[0].title).toBe("短视频");
  });

  test("TC-HOOK-005: 搜索支持标签匹配", () => {
    const { result } = renderHook(() => useVideoView(mockVideos));

    act(() => {
      result.current.setSearchQuery("标签2");
    });

    expect(result.current.filteredVideos).toHaveLength(1);
    expect(result.current.filteredVideos[0].title).toBe("短视频");
  });

  test("TC-HOOK-006: 可以设置筛选条件", () => {
    const { result } = renderHook(() => useVideoView(mockVideos));

    act(() => {
      result.current.setFilter({ duration: "short" });
    });

    expect(result.current.filter.duration).toBe("short");
    // 短视频（<=5分钟）应该只有1个
    expect(result.current.filteredVideos).toHaveLength(1);
  });

  test("TC-HOOK-007: 时长筛选short正确工作", () => {
    const { result } = renderHook(() => useVideoView(mockVideos));

    act(() => {
      result.current.setFilter({ duration: "short" });
    });

    // 只有3分钟的视频符合short条件
    expect(result.current.filteredVideos).toHaveLength(1);
    expect(result.current.filteredVideos[0].duration).toBe("03:00");
  });

  test("TC-HOOK-008: 时长筛选medium正确工作", () => {
    const { result } = renderHook(() => useVideoView(mockVideos));

    act(() => {
      result.current.setFilter({ duration: "medium" });
    });

    // 10分钟的视频符合medium条件
    expect(result.current.filteredVideos).toHaveLength(1);
    expect(result.current.filteredVideos[0].duration).toBe("10:00");
  });

  test("TC-HOOK-009: 时长筛选long正确工作", () => {
    const { result } = renderHook(() => useVideoView(mockVideos));

    act(() => {
      result.current.setFilter({ duration: "long" });
    });

    // 45分钟的视频符合long条件
    expect(result.current.filteredVideos).toHaveLength(1);
    expect(result.current.filteredVideos[0].duration).toBe("45:00");
  });

  test("TC-HOOK-010: 可以设置排序方式", () => {
    const { result } = renderHook(() => useVideoView(mockVideos));

    act(() => {
      result.current.setFilter({ sortBy: "oldest" });
    });

    expect(result.current.filter.sortBy).toBe("oldest");
    // 最旧的视频应该是id为3的视频
    expect(result.current.filteredVideos[0].id).toBe("3");
  });

  test("TC-HOOK-011: newest排序正确工作", () => {
    const { result } = renderHook(() => useVideoView(mockVideos));

    act(() => {
      result.current.setFilter({ sortBy: "newest" });
    });

    // 最新的视频应该是id为1的视频
    expect(result.current.filteredVideos[0].id).toBe("1");
  });

  test("TC-HOOK-012: oldest排序正确工作", () => {
    const { result } = renderHook(() => useVideoView(mockVideos));

    act(() => {
      result.current.setFilter({ sortBy: "oldest" });
    });

    // 最旧的视频应该是id为3的视频
    expect(result.current.filteredVideos[0].id).toBe("3");
  });

  test("TC-HOOK-013: 可以重置所有筛选条件", () => {
    const { result } = renderHook(() => useVideoView(mockVideos));

    act(() => {
      result.current.setSearchQuery("测试");
      result.current.setFilter({ duration: "short", sortBy: "oldest" });
    });

    expect(result.current.searchQuery).toBe("测试");
    expect(result.current.filter.duration).toBe("short");

    act(() => {
      result.current.resetFilters();
    });

    expect(result.current.searchQuery).toBe("");
    expect(result.current.filter.duration).toBe("all");
    expect(result.current.filter.sortBy).toBe("newest");
    expect(result.current.filteredVideos).toHaveLength(3);
  });

  test("TC-HOOK-014: 组合筛选和搜索", () => {
    const { result } = renderHook(() => useVideoView(mockVideos));

    act(() => {
      result.current.setSearchQuery("测试");
      result.current.setFilter({ duration: "long" });
    });

    // 同时包含"测试"且时长大于30分钟的视频
    expect(result.current.filteredVideos).toHaveLength(1);
    expect(result.current.filteredVideos[0].title).toBe("长视频测试");
  });

  test("TC-HOOK-015: 支持初始选项", () => {
    const { result } = renderHook(() =>
      useVideoView(mockVideos, {
        initialViewMode: "list",
        initialFilter: { sortBy: "oldest" },
      })
    );

    expect(result.current.viewMode).toBe("list");
    expect(result.current.filter.sortBy).toBe("oldest");
  });

  test("TC-HOOK-016: 空搜索返回所有视频", () => {
    const { result } = renderHook(() => useVideoView(mockVideos));

    act(() => {
      result.current.setSearchQuery("");
    });

    expect(result.current.filteredVideos).toHaveLength(3);
  });

  test("TC-HOOK-017: 无匹配搜索返回空数组", () => {
    const { result } = renderHook(() => useVideoView(mockVideos));

    act(() => {
      result.current.setSearchQuery("不存在的视频");
    });

    expect(result.current.filteredVideos).toHaveLength(0);
  });
});

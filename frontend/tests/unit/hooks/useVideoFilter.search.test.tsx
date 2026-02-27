import { renderHook, act } from "@testing-library/react";
import { useVideoFilter } from "@/hooks/useVideoFilter";

// 测试数据
const mockVideos = [
  {
    id: "1",
    title: "甜筒在阿亮家里训狗",
    date: "2026-02-21",
    duration: "4:45",
    tags: [],
  },
  {
    id: "2",
    title: "甜筒带阿亮回家见奶奶",
    date: "2026-02-21",
    duration: "4:56",
    tags: [],
  },
  {
    id: "3",
    title: "小虎连麦调戏69",
    date: "2026-02-17",
    duration: "17:52",
    tags: [],
  },
  {
    id: "4",
    title: "其他视频不包含关键词",
    date: "2026-01-01",
    duration: "10:00",
    tags: [],
  },
];

describe("useVideoFilter 搜索功能测试（TDD）", () => {
  /**
   * 这个测试验证useVideoFilter是否能正确接收和处理搜索过滤后的视频
   * 注意：useVideoFilter本身不做搜索，它只做筛选和排序
   * 搜索过滤需要在传入之前完成
   */
  test("TC-TDD-002: useVideoFilter应该能正确处理传入的视频列表", () => {
    // 测试1：传入所有视频
    const { result: result1 } = renderHook(() => useVideoFilter(mockVideos));
    expect(result1.current.filteredVideos).toHaveLength(4);
    
    // 测试2：传入搜索过滤后的视频
    const filteredVideos = mockVideos.filter(v => v.title.includes("甜筒"));
    const { result: result2 } = renderHook(() => useVideoFilter(filteredVideos));
    expect(result2.current.filteredVideos).toHaveLength(2);
  });
});

describe("甜筒页面搜索逻辑测试", () => {
  /**
   * 测试甜筒页面的搜索过滤逻辑
   * 这是从TiantongPage中提取的逻辑
   */
  test("TC-TDD-003: 搜索过滤逻辑应该能正确过滤视频", () => {
    const searchQuery = "甜筒";
    
    // 模拟甜筒页面的搜索过滤逻辑
    const filteredBySearch = (() => {
      if (!searchQuery.trim()) {
        return mockVideos;
      }

      const query = searchQuery.toLowerCase().trim();

      return mockVideos
        .map(video => {
          let score = 0;

          if (video.title.toLowerCase().includes(query)) {
            score += 10;
            if (video.title.toLowerCase() === query) {
              score += 10;
            }
          }

          if (video.tags && video.tags.some(tag => tag.toLowerCase().includes(query))) {
            score += 5;
          }

          return { video, score };
        })
        .filter(({ score }) => score > 0)
        .sort((a, b) => b.score - a.score)
        .map(({ video }) => video);
    })();
    
    // 验证过滤结果
    expect(filteredBySearch).toHaveLength(2);
    expect(filteredBySearch[0].title).toContain("甜筒");
    expect(filteredBySearch[1].title).toContain("甜筒");
  });
});

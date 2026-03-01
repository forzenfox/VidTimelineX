import React, { createContext, useContext, useState, ReactNode } from "react";
import { render, act, cleanup, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";

// 创建测试用的数据流上下文
interface VideoData {
  id: string;
  title: string;
  bvid: string;
  duration: string;
  created: number;
}

interface DataFlowContextType {
  videos: VideoData[];
  filteredVideos: VideoData[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filterByDuration: (min: number, max: number) => void;
  sortByDate: (ascending: boolean) => void;
}

const DataFlowContext = createContext<DataFlowContextType | undefined>(undefined);

const DataFlowProvider = ({
  children,
  initialVideos,
}: {
  children: ReactNode;
  initialVideos: VideoData[];
}) => {
  const [videos] = useState<VideoData[]>(initialVideos);
  const [filteredVideos, setFilteredVideos] = useState<VideoData[]>(initialVideos);
  const [searchQuery, setSearchQuery] = useState("");

  const filterByDuration = (min: number, max: number) => {
    const filtered = videos.filter(video => {
      const durationInSeconds = parseDuration(video.duration);
      return durationInSeconds >= min && durationInSeconds <= max;
    });
    setFilteredVideos(filtered);
  };

  const sortByDate = (ascending: boolean) => {
    const sorted = [...filteredVideos].sort((a, b) => {
      return ascending ? a.created - b.created : b.created - a.created;
    });
    setFilteredVideos(sorted);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setFilteredVideos(videos);
      return;
    }
    const filtered = videos.filter(video =>
      video.title.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredVideos(filtered);
  };

  return (
    <DataFlowContext.Provider
      value={{
        videos,
        filteredVideos,
        searchQuery,
        setSearchQuery: handleSearch,
        filterByDuration,
        sortByDate,
      }}
    >
      {children}
    </DataFlowContext.Provider>
  );
};

const useDataFlow = () => {
  const context = useContext(DataFlowContext);
  if (!context) {
    throw new Error("useDataFlow must be used within DataFlowProvider");
  }
  return context;
};

// 辅助函数：解析时长字符串为秒数
function parseDuration(duration: string): number {
  const parts = duration.split(":").map(Number);
  if (parts.length === 2) {
    return parts[0] * 60 + parts[1];
  } else if (parts.length === 3) {
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  }
  return 0;
}

// 测试组件
const TestVideoList = () => {
  const { filteredVideos, searchQuery, setSearchQuery, filterByDuration, sortByDate } =
    useDataFlow();

  return (
    <div>
      <input
        data-testid="search-input"
        value={searchQuery}
        onChange={e => setSearchQuery(e.target.value)}
        placeholder="搜索视频..."
      />
      <button data-testid="filter-short" onClick={() => filterByDuration(0, 300)}>
        短视频 (0-5分钟)
      </button>
      <button data-testid="filter-long" onClick={() => filterByDuration(300, 3600)}>
        长视频 (5分钟+)
      </button>
      <button data-testid="sort-asc" onClick={() => sortByDate(true)}>
        按时间升序
      </button>
      <button data-testid="sort-desc" onClick={() => sortByDate(false)}>
        按时间降序
      </button>
      <div data-testid="video-count">{filteredVideos.length} 个视频</div>
      <ul data-testid="video-list">
        {filteredVideos.map(video => (
          <li key={video.id} data-testid={`video-${video.id}`}>
            {video.title} - {video.duration}
          </li>
        ))}
      </ul>
    </div>
  );
};

// 测试数据
const mockVideos: VideoData[] = [
  { id: "1", title: "测试视频1", bvid: "BV1xxx", duration: "03:45", created: 1609459200 },
  { id: "2", title: "测试视频2", bvid: "BV2xxx", duration: "10:30", created: 1609545600 },
  { id: "3", title: "示例视频3", bvid: "BV3xxx", duration: "02:15", created: 1609632000 },
  { id: "4", title: "示例视频4", bvid: "BV4xxx", duration: "15:00", created: 1609718400 },
  { id: "5", title: "测试视频5", bvid: "BV5xxx", duration: "05:30", created: 1609804800 },
];

describe("数据流集成测试", () => {
  afterEach(() => {
    cleanup();
  });

  test("TC-DATA-001: 初始数据应该正确加载", () => {
    const { getByTestId } = render(
      <DataFlowProvider initialVideos={mockVideos}>
        <TestVideoList />
      </DataFlowProvider>
    );

    expect(getByTestId("video-count")).toHaveTextContent("5 个视频");
    expect(getByTestId("video-1")).toBeInTheDocument();
    expect(getByTestId("video-5")).toBeInTheDocument();
  });

  test("TC-DATA-002: 搜索功能应该正确过滤数据", () => {
    const { getByTestId, queryByTestId } = render(
      <DataFlowProvider initialVideos={mockVideos}>
        <TestVideoList />
      </DataFlowProvider>
    );

    const searchInput = getByTestId("search-input");

    act(() => {
      fireEvent.change(searchInput, { target: { value: "测试" } });
    });

    expect(getByTestId("video-count")).toHaveTextContent("3 个视频");
    expect(getByTestId("video-1")).toBeInTheDocument();
    expect(getByTestId("video-2")).toBeInTheDocument();
    expect(getByTestId("video-5")).toBeInTheDocument();
    expect(queryByTestId("video-3")).not.toBeInTheDocument();
  });

  test("TC-DATA-003: 时长筛选应该正确过滤数据", () => {
    const { getByTestId, queryByTestId } = render(
      <DataFlowProvider initialVideos={mockVideos}>
        <TestVideoList />
      </DataFlowProvider>
    );

    act(() => {
      fireEvent.click(getByTestId("filter-short"));
    });

    // 短视频 (0-5分钟): 视频1 (03:45=225s), 视频3 (02:15=135s) = 2个
    expect(getByTestId("video-count")).toHaveTextContent("2 个视频");
    expect(getByTestId("video-1")).toBeInTheDocument();
    expect(getByTestId("video-3")).toBeInTheDocument();
    expect(queryByTestId("video-2")).not.toBeInTheDocument();
    expect(queryByTestId("video-4")).not.toBeInTheDocument();
    expect(queryByTestId("video-5")).not.toBeInTheDocument();
  });

  test("TC-DATA-004: 长视频筛选应该正确过滤数据", () => {
    const { getByTestId, queryByTestId } = render(
      <DataFlowProvider initialVideos={mockVideos}>
        <TestVideoList />
      </DataFlowProvider>
    );

    act(() => {
      fireEvent.click(getByTestId("filter-long"));
    });

    // 长视频 (5分钟+): 视频2 (10:30=630s), 视频4 (15:00=900s), 视频5 (05:30=330s) = 3个
    expect(getByTestId("video-count")).toHaveTextContent("3 个视频");
    expect(getByTestId("video-2")).toBeInTheDocument();
    expect(getByTestId("video-4")).toBeInTheDocument();
    expect(getByTestId("video-5")).toBeInTheDocument();
    expect(queryByTestId("video-1")).not.toBeInTheDocument();
    expect(queryByTestId("video-3")).not.toBeInTheDocument();
  });

  test("TC-DATA-005: 日期排序应该正确排序数据", () => {
    const { getByTestId } = render(
      <DataFlowProvider initialVideos={mockVideos}>
        <TestVideoList />
      </DataFlowProvider>
    );

    // 先按升序排序
    act(() => {
      fireEvent.click(getByTestId("sort-asc"));
    });

    const videoList = getByTestId("video-list");
    const items = videoList.querySelectorAll("li");
    expect(items[0]).toHaveAttribute("data-testid", "video-1");

    // 再按降序排序
    act(() => {
      fireEvent.click(getByTestId("sort-desc"));
    });

    const itemsDesc = videoList.querySelectorAll("li");
    expect(itemsDesc[0]).toHaveAttribute("data-testid", "video-5");
  });

  test("TC-DATA-006: 搜索和筛选组合应该正确工作", () => {
    const { getByTestId, queryByTestId } = render(
      <DataFlowProvider initialVideos={mockVideos}>
        <TestVideoList />
      </DataFlowProvider>
    );

    // 先搜索
    act(() => {
      fireEvent.change(getByTestId("search-input"), { target: { value: "测试" } });
    });

    expect(getByTestId("video-count")).toHaveTextContent("3 个视频");

    // 再筛选短视频
    act(() => {
      fireEvent.click(getByTestId("filter-short"));
    });

    // 注意：筛选是基于原始数据，不是基于搜索结果
    // 短视频: 视频1 (03:45), 视频3 (02:15) = 2个
    expect(getByTestId("video-count")).toHaveTextContent("2 个视频");
  });
});

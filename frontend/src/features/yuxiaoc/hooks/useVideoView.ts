import { useState, useMemo, useCallback, useEffect } from "react";
import type { ViewMode, FilterState } from "@/hooks/types";
import type { Video } from "../data/types";

interface UseVideoViewOptions {
  initialViewMode?: ViewMode;
  initialFilter?: Partial<FilterState>;
  initialPageSize?: number;
}

interface UseVideoViewReturn {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  filter: FilterState;
  setFilter: (filter: Partial<FilterState>) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filteredVideos: Video[];
  resetFilters: () => void;
  // 分页相关
  currentPage: number;
  pageSize: number;
  totalPages: number;
  totalItems: number;
  paginatedItems: Video[];
  hasNextPage: boolean;
  hasPrevPage: boolean;
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;
  goToNextPage: () => void;
  goToPrevPage: () => void;
  goToFirstPage: () => void;
  goToLastPage: () => void;
}

const defaultFilter: FilterState = {
  duration: "all",
  timeRange: "all",
  sortBy: "newest",
};

function parseDuration(duration: string): number {
  try {
    const parts = duration.split(":").map(Number);
    if (parts.length === 2) {
      return parts[0] * 60 + parts[1];
    }
    if (parts.length === 3) {
      return parts[0] * 3600 + parts[1] * 60 + parts[2];
    }
    return 0;
  } catch {
    return 0;
  }
}

function parseDate(dateStr: string): Date | null {
  try {
    const date = new Date(dateStr);
    return isNaN(date.getTime()) ? null : date;
  } catch {
    return null;
  }
}

function filterByDuration(videos: Video[], duration: FilterState["duration"]): Video[] {
  if (duration === "all") return videos;

  return videos.filter(video => {
    const seconds = parseDuration(video.duration);
    if (seconds === 0) return true;
    const minutes = seconds / 60;

    switch (duration) {
      case "short":
        return minutes <= 5;
      case "medium":
        return minutes > 5 && minutes <= 30;
      case "long":
        return minutes > 30;
      default:
        return true;
    }
  });
}

function filterByTimeRange(videos: Video[], timeRange: FilterState["timeRange"]): Video[] {
  if (timeRange === "all") return videos;

  const now = new Date();
  let cutoffDate: Date;

  switch (timeRange) {
    case "week":
      cutoffDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
    case "month":
      cutoffDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      break;
    case "year":
      cutoffDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
      break;
    default:
      return videos;
  }

  return videos.filter(video => {
    const videoDate = parseDate(video.date);
    if (!videoDate) return true;
    return videoDate >= cutoffDate;
  });
}

function sortVideos(videos: Video[], sortBy: FilterState["sortBy"]): Video[] {
  const sorted = [...videos];

  switch (sortBy) {
    case "newest":
      return sorted.sort((a, b) => {
        const dateA = parseDate(a.date);
        const dateB = parseDate(b.date);
        if (!dateA || !dateB) return 0;
        return dateB.getTime() - dateA.getTime();
      });
    case "oldest":
      return sorted.sort((a, b) => {
        const dateA = parseDate(a.date);
        const dateB = parseDate(b.date);
        if (!dateA || !dateB) return 0;
        return dateA.getTime() - dateB.getTime();
      });
    case "popular":
      // 如果视频有views字段，按views排序
      return sorted.sort((a, b) => {
        const viewsA = (a as Video & { views?: number }).views || 0;
        const viewsB = (b as Video & { views?: number }).views || 0;
        return viewsB - viewsA;
      });
    default:
      return sorted;
  }
}

function filterBySearch(videos: Video[], searchQuery: string): Video[] {
  if (!searchQuery.trim()) return videos;

  const query = searchQuery.toLowerCase();
  return videos.filter(
    video =>
      video.title.toLowerCase().includes(query) ||
      video.tags.some(tag => tag.toLowerCase().includes(query))
  );
}

const DEFAULT_PAGE_SIZE = 12;
const PAGE_SIZE_OPTIONS = [12, 24, 48];

export function useVideoView(
  videos: Video[],
  options: UseVideoViewOptions = {}
): UseVideoViewReturn {
  const [viewMode, setViewMode] = useState<ViewMode>(options.initialViewMode || "grid");
  const [filter, setFilterState] = useState<FilterState>({
    ...defaultFilter,
    ...options.initialFilter,
  });
  const [searchQuery, setSearchQueryState] = useState("");
  // 分页状态
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSizeState] = useState(options.initialPageSize || DEFAULT_PAGE_SIZE);

  const setFilter = useCallback((newFilter: Partial<FilterState>) => {
    setFilterState(prev => ({ ...prev, ...newFilter }));
    // 筛选条件变化时重置到第一页
    setCurrentPage(1);
  }, []);

  const setSearchQuery = useCallback((query: string) => {
    setSearchQueryState(query);
    // 搜索词变化时重置到第一页
    setCurrentPage(1);
  }, []);

  const resetFilters = useCallback(() => {
    setFilterState(defaultFilter);
    setSearchQueryState("");
    setCurrentPage(1);
  }, []);

  const filteredVideos = useMemo(() => {
    let result = videos;

    // 应用搜索过滤
    result = filterBySearch(result, searchQuery);

    // 应用时长过滤
    result = filterByDuration(result, filter.duration);

    // 应用时间范围过滤
    result = filterByTimeRange(result, filter.timeRange);

    // 应用排序
    result = sortVideos(result, filter.sortBy);

    return result;
  }, [videos, searchQuery, filter]);

  // 分页计算
  const totalItems = filteredVideos.length;
  const totalPages = useMemo(() => {
    if (totalItems === 0) return 0;
    return Math.ceil(totalItems / pageSize);
  }, [totalItems, pageSize]);

  // 计算当前页的数据范围
  const startIndex = useMemo(() => {
    return (currentPage - 1) * pageSize;
  }, [currentPage, pageSize]);

  const endIndex = useMemo(() => {
    return Math.min(startIndex + pageSize, totalItems);
  }, [startIndex, pageSize, totalItems]);

  // 获取当前页的数据
  const paginatedItems = useMemo(() => {
    return filteredVideos.slice(startIndex, endIndex);
  }, [filteredVideos, startIndex, endIndex]);

  // 是否有上一页/下一页
  const hasNextPage = useMemo(() => {
    return currentPage < totalPages;
  }, [currentPage, totalPages]);

  const hasPrevPage = useMemo(() => {
    return currentPage > 1;
  }, [currentPage]);

  // 设置页码（带边界检查）
  const setPage = useCallback(
    (page: number) => {
      if (totalPages === 0) {
        setCurrentPage(1);
        return;
      }
      const validPage = Math.max(1, Math.min(page, totalPages));
      setCurrentPage(validPage);
    },
    [totalPages]
  );

  // 设置每页数量（同时重置到第一页）
  const setPageSize = useCallback((size: number) => {
    // 验证是否在允许的选项中
    const validSize = PAGE_SIZE_OPTIONS.includes(size) ? size : PAGE_SIZE_OPTIONS[0];
    setPageSizeState(validSize);
    // 重置到第一页，避免数据错位
    setCurrentPage(1);
  }, []);

  // 下一页
  const goToNextPage = useCallback(() => {
    if (hasNextPage) {
      setCurrentPage(prev => prev + 1);
    }
  }, [hasNextPage]);

  // 上一页
  const goToPrevPage = useCallback(() => {
    if (hasPrevPage) {
      setCurrentPage(prev => prev - 1);
    }
  }, [hasPrevPage]);

  // 回到首页
  const goToFirstPage = useCallback(() => {
    setCurrentPage(1);
  }, []);

  // 跳到末页
  const goToLastPage = useCallback(() => {
    if (totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [totalPages]);

  return {
    viewMode,
    setViewMode,
    filter,
    setFilter,
    searchQuery,
    setSearchQuery,
    filteredVideos,
    resetFilters,
    // 分页相关
    currentPage,
    pageSize,
    totalPages,
    totalItems,
    paginatedItems,
    hasNextPage,
    hasPrevPage,
    setPage,
    setPageSize,
    goToNextPage,
    goToPrevPage,
    goToFirstPage,
    goToLastPage,
  };
}

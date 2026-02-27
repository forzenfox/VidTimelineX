import { useState, useMemo, useCallback } from "react";
import type { ViewMode, FilterState } from "@/hooks/types";
import type { Video } from "../data/types";

interface UseVideoViewOptions {
  initialViewMode?: ViewMode;
  initialFilter?: Partial<FilterState>;
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

export function useVideoView(
  videos: Video[],
  options: UseVideoViewOptions = {}
): UseVideoViewReturn {
  const [viewMode, setViewMode] = useState<ViewMode>(options.initialViewMode || "grid");
  const [filter, setFilterState] = useState<FilterState>({
    ...defaultFilter,
    ...options.initialFilter,
  });
  const [searchQuery, setSearchQuery] = useState("");

  const setFilter = useCallback((newFilter: Partial<FilterState>) => {
    setFilterState(prev => ({ ...prev, ...newFilter }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilterState(defaultFilter);
    setSearchQuery("");
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

  return {
    viewMode,
    setViewMode,
    filter,
    setFilter,
    searchQuery,
    setSearchQuery,
    filteredVideos,
    resetFilters,
  };
}

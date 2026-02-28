import * as React from "react";
import type { DurationFilter, TimeRangeFilter, SortOption, FilterState } from "./types";

interface Video {
  id: string;
  title: string;
  date: string;
  duration: string;
  views?: number | string;
}

interface UseVideoFilterOptions extends Partial<FilterState> {
  duration?: DurationFilter;
  timeRange?: TimeRangeFilter;
  sortBy?: SortOption;
}

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

function filterByDuration<T extends Video>(videos: T[], duration: DurationFilter): T[] {
  if (duration === "all") return videos;

  return videos.filter(video => {
    const minutes = parseDuration(video.duration);
    if (minutes === 0) return true;
    switch (duration) {
      case "short":
        return minutes <= 5 * 60;
      case "medium":
        return minutes > 5 * 60 && minutes <= 30 * 60;
      case "long":
        return minutes >= 30 * 60;
      default:
        return true;
    }
  });
}

function filterByTimeRange<T extends Video>(videos: T[], timeRange: TimeRangeFilter): T[] {
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

function sortVideos<T extends Video>(videos: T[], sortBy: SortOption): T[] {
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
      return sorted.sort((a, b) => {
        const viewsA = a.views
          ? typeof a.views === "number"
            ? a.views
            : parseInt(a.views as string, 10) || 0
          : 0;
        const viewsB = b.views
          ? typeof b.views === "number"
            ? b.views
            : parseInt(b.views as string, 10) || 0
          : 0;
        return viewsB - viewsA;
      });
    default:
      return sorted;
  }
}

export function useVideoFilter<T extends Video>(
  videos: T[],
  options: UseVideoFilterOptions = {}
): {
  filter: FilterState;
  setFilter: (filter: Partial<FilterState>) => void;
  resetFilter: () => void;
  filteredVideos: T[];
} {
  const [filterState, setFilterState] = React.useState<FilterState>({
    duration: options.duration ?? "all",
    timeRange: options.timeRange ?? "all",
    sortBy: options.sortBy ?? "newest",
  });

  React.useEffect(() => {
    if (
      options.duration !== undefined ||
      options.timeRange !== undefined ||
      options.sortBy !== undefined
    ) {
      setFilterState(prev => ({
        duration: options.duration ?? prev.duration,
        timeRange: options.timeRange ?? prev.timeRange,
        sortBy: options.sortBy ?? prev.sortBy,
      }));
    }
  }, [options.duration, options.timeRange, options.sortBy]);

  const { duration, timeRange, sortBy } = filterState;

  const filteredVideos = React.useMemo(() => {
    let result = videos;
    result = filterByDuration(result, duration);
    result = filterByTimeRange(result, timeRange);
    result = sortVideos(result, sortBy);
    return result;
  }, [videos, duration, timeRange, sortBy]);

  const setFilter = React.useCallback((newFilter: Partial<FilterState>) => {
    setFilterState(prev => ({ ...prev, ...newFilter }));
  }, []);

  const resetFilter = React.useCallback(() => {
    setFilterState({ duration: "all", timeRange: "all", sortBy: "newest" });
  }, []);

  return {
    filter: filterState,
    setFilter,
    resetFilter,
    filteredVideos,
  };
}

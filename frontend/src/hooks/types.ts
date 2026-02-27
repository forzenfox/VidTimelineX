export type ViewMode = "timeline" | "grid" | "list";

export type DurationFilter = "all" | "short" | "medium" | "long";

export type TimeRangeFilter = "all" | "week" | "month" | "year";

export type SortOption = "newest" | "oldest" | "popular";

export interface FilterState {
  duration: DurationFilter;
  timeRange: TimeRangeFilter;
  sortBy: SortOption;
}

export interface PaginationConfig {
  currentPage: number;
  pageSize: number;
}

export interface UserPreferences {
  viewMode: ViewMode;
  filter: FilterState;
  pagination: PaginationConfig;
}

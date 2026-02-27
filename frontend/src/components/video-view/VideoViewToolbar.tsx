import React from "react";
import { ViewSwitcher } from "./ViewSwitcher";
import { FilterDropdown } from "./FilterDropdown";
import { SortDropdown } from "./SortDropdown";
import { SearchButton } from "./SearchButton";
import type { ViewMode, FilterState } from "@/hooks/types";
import { cn } from "@/components/ui/utils";

interface VideoViewToolbarProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  filter: FilterState;
  onFilterChange: (filter: FilterState) => void;
  // 新增搜索相关 props
  onSearch?: (query: string) => void;
  searchQuery?: string;
  searchSuggestions?: string[];
  searchHistory?: string[];
  onClearHistory?: () => void;
  className?: string;
  theme?: string;
}

export function VideoViewToolbar({
  viewMode,
  onViewModeChange,
  filter,
  onFilterChange,
  onSearch,
  searchQuery,
  searchSuggestions,
  searchHistory,
  onClearHistory,
  className,
  theme,
}: VideoViewToolbarProps) {
  const hasSearchFeature = !!onSearch;

  return (
    <div
      data-theme={theme}
      data-testid="video-view-toolbar"
      className={cn(
        // 响应式显示：移动端隐藏，PC端显示
        "hidden sm:flex",
        // 布局
        "flex-row items-center justify-between",
        "gap-4",
        // 样式
        "p-4 rounded-2xl border backdrop-blur-md",
        "bg-card/70 border-border/50 shadow-lg",
        "mb-6 md:mb-8 relative z-10",
        className
      )}
    >
      {/* 左侧：搜索框（如果有搜索功能） */}
      {hasSearchFeature && (
        <SearchButton
          onSearch={onSearch}
          variant="expanded"
          suggestions={searchSuggestions}
          searchHistory={searchHistory}
          onClearHistory={onClearHistory}
          data-testid="search-button"
        />
      )}

      {/* 中间：视图切换按钮 */}
      <ViewSwitcher
        viewMode={viewMode}
        onViewModeChange={onViewModeChange}
        theme={theme}
        variant="default"
      />

      {/* 右侧：筛选、排序按钮 */}
      <div className="flex items-center gap-3">
        <FilterDropdown
          filter={filter}
          onFilterChange={onFilterChange}
          variant="default"
        />
        <SortDropdown
          sortBy={filter.sortBy}
          onSortChange={sortBy => onFilterChange({ ...filter, sortBy })}
          variant="default"
        />
      </div>
    </div>
  );
}

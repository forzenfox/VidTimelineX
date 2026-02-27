import React from "react";
import type { ViewMode, FilterState } from "@/hooks/types";
import { cn } from "@/components/ui/utils";
import { CycleViewButton } from "./CycleViewButton";
import { ViewSwitcher } from "./ViewSwitcher";
import { SearchButton } from "./SearchButton";
import { FilterDropdown } from "./FilterDropdown";
import { SortDropdown } from "./SortDropdown";

interface IconToolbarProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  filter: FilterState;
  onFilterChange: (filter: FilterState) => void;
  onSearch: (query: string) => void;
  className?: string;
  theme?: string;
  searchSuggestions?: string[];
  searchHistory?: string[];
  onClearHistory?: () => void;
}

export function IconToolbar({
  viewMode,
  onViewModeChange,
  filter,
  onFilterChange,
  onSearch,
  className,
  theme,
  searchSuggestions,
  searchHistory,
  onClearHistory,
}: IconToolbarProps) {
  return (
    <>
      {/* 移动端：纯图标模式 */}
      <div
        role="toolbar"
        data-theme={theme}
        className={cn(
          "sm:hidden",
          "flex flex-col items-start justify-between",
          "gap-3",
          "p-3 rounded-2xl border backdrop-blur-md",
          "bg-card/70 border-border/50 shadow-lg",
          "mb-6 relative z-10",
          className
        )}
      >
        {/* 左侧：视图切换按钮 */}
        <div className="flex items-center gap-2">
          <CycleViewButton
            viewMode={viewMode}
            onViewModeChange={onViewModeChange}
            theme={theme}
          />
        </div>

        {/* 右侧：搜索、筛选、排序按钮 */}
        <div className="flex items-center gap-2">
          <SearchButton
            onSearch={onSearch}
            theme={theme}
            suggestions={searchSuggestions}
            searchHistory={searchHistory}
            onClearHistory={onClearHistory}
          />
          <FilterDropdown
            filter={filter}
            onFilterChange={onFilterChange}
            variant="icon"
          />
          <SortDropdown
            sortBy={filter.sortBy}
            onSortChange={sortBy => onFilterChange({ ...filter, sortBy })}
            variant="icon"
          />
        </div>
      </div>

      {/* PC端：图标+文字模式 */}
      <div
        role="toolbar"
        data-theme={theme}
        className={cn(
          "hidden sm:flex",
          "flex-row items-center justify-between",
          "gap-4",
          "p-4 rounded-2xl border backdrop-blur-md",
          "bg-card/70 border-border/50 shadow-lg",
          "mb-6 md:mb-8 relative z-10",
          className
        )}
      >
        {/* 左侧：视图切换按钮 */}
        <div className="flex items-center gap-2">
          <ViewSwitcher
            viewMode={viewMode}
            onViewModeChange={onViewModeChange}
            theme={theme}
            variant="default"
          />
        </div>

        {/* 右侧：搜索、筛选、排序按钮 */}
        <div className="flex items-center gap-2">
          <SearchButton
            onSearch={onSearch}
            theme={theme}
            suggestions={searchSuggestions}
            searchHistory={searchHistory}
            onClearHistory={onClearHistory}
          />
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
    </>
  );
}

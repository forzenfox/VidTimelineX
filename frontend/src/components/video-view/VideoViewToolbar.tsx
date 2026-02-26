import React from "react";
import { ViewSwitcher } from "./ViewSwitcher";
import { FilterDropdown } from "./FilterDropdown";
import { SortDropdown } from "./SortDropdown";
import type { ViewMode, FilterState } from "@/hooks/types";
import { cn } from "@/components/ui/utils";

interface VideoViewToolbarProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  filter: FilterState;
  onFilterChange: (filter: FilterState) => void;
  className?: string;
}

export function VideoViewToolbar({
  viewMode,
  onViewModeChange,
  filter,
  onFilterChange,
  className,
}: VideoViewToolbarProps) {
  return (
    <div
      className={cn(
        "flex flex-col md:flex-row items-start md:items-center justify-between",
        "gap-4 md:gap-6",
        "p-4 bg-white shadow",
        className
      )}
    >
      <ViewSwitcher viewMode={viewMode} onViewModeChange={onViewModeChange} />

      <div className="flex items-center gap-3">
        <FilterDropdown filter={filter} onFilterChange={onFilterChange} />
        <SortDropdown
          sortBy={filter.sortBy}
          onSortChange={sortBy => onFilterChange({ ...filter, sortBy })}
        />
      </div>
    </div>
  );
}

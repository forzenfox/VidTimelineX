import React, { useState, useMemo } from "react";
import { Filter, ChevronDown } from "lucide-react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { cn } from "@/components/ui/utils";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import type { FilterState, DurationFilter, TimeRangeFilter } from "@/hooks/types";

export interface FilterDropdownProps {
  filter: FilterState;
  onFilterChange: (filter: FilterState) => void;
  className?: string;
  variant?: "icon" | "default";
}

const defaultFilter: FilterState = {
  duration: "all",
  timeRange: "all",
  sortBy: "newest",
};

const durationOptions: { value: DurationFilter; label: string }[] = [
  { value: "all", label: "全部" },
  { value: "short", label: "0-5分钟" },
  { value: "medium", label: "5-30分钟" },
  { value: "long", label: "30分钟以上" },
];

const timeRangeOptions: { value: TimeRangeFilter; label: string }[] = [
  { value: "all", label: "全部" },
  { value: "week", label: "最近一周" },
  { value: "month", label: "最近一月" },
  { value: "year", label: "最近一年" },
];

function getDurationLabel(value: DurationFilter): string {
  return durationOptions.find(opt => opt.value === value)?.label || "全部";
}

function getTimeRangeLabel(value: TimeRangeFilter): string {
  return timeRangeOptions.find(opt => opt.value === value)?.label || "全部";
}

function getTooltipText(filter: FilterState): string {
  const hasDurationFilter = filter.duration !== "all";
  const hasTimeRangeFilter = filter.timeRange !== "all";

  if (!hasDurationFilter && !hasTimeRangeFilter) {
    return "筛选";
  }

  const parts: string[] = [];
  if (hasDurationFilter) {
    parts.push(getDurationLabel(filter.duration));
  }
  if (hasTimeRangeFilter) {
    parts.push(getTimeRangeLabel(filter.timeRange));
  }

  return `筛选: ${parts.join(" / ")}`;
}

export function FilterDropdown({
  filter,
  onFilterChange,
  className,
  variant = "default",
}: FilterDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [localFilter, setLocalFilter] = useState<FilterState>(filter);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open) {
      setLocalFilter(filter);
    }
  };

  const handleDurationChange = (duration: DurationFilter) => {
    setLocalFilter(prev => ({ ...prev, duration }));
  };

  const handleTimeRangeChange = (timeRange: TimeRangeFilter) => {
    setLocalFilter(prev => ({ ...prev, timeRange }));
  };

  const handleApply = () => {
    onFilterChange(localFilter);
    setIsOpen(false);
  };

  const handleReset = () => {
    setLocalFilter(defaultFilter);
    onFilterChange(defaultFilter);
    setIsOpen(false);
  };

  const hasActiveFilter = filter.duration !== "all" || filter.timeRange !== "all";
  const tooltipText = useMemo(() => getTooltipText(filter), [filter]);

  const isIconMode = variant === "icon";

  return (
    <Tooltip>
      <PopoverPrimitive.Root open={isOpen} onOpenChange={handleOpenChange}>
        <TooltipTrigger asChild>
          <PopoverPrimitive.Trigger asChild>
            <button
              type="button"
              data-testid="filter-trigger-button"
              className={cn(
                // 基础样式
                "cursor-pointer rounded-lg border backdrop-blur-md",
                "bg-card/60 border-border text-foreground",
                "transition-all duration-200 ease-out",
                "outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                "hover:bg-muted/50",
                // variant 特定样式
                isIconMode
                  ? "inline-flex items-center justify-center w-9 h-9"
                  : "inline-flex items-center gap-1.5 h-10 px-3.5 py-2 text-sm font-medium",
                className
              )}
            >
              <Filter className={cn(isIconMode ? "w-4 h-4" : "w-4 h-4")} data-testid="filter-icon" />
              {!isIconMode && <span>筛选</span>}
              {!isIconMode && hasActiveFilter && (
                <span className="text-xs text-primary">
                  {filter.duration !== "all" && getDurationLabel(filter.duration)}
                  {filter.duration !== "all" && filter.timeRange !== "all" && " / "}
                  {filter.timeRange !== "all" && getTimeRangeLabel(filter.timeRange)}
                </span>
              )}
              {!isIconMode && (
                <ChevronDown
                  className={cn("w-4 h-4 transition-transform duration-200", isOpen && "rotate-180")}
                />
              )}
              {hasActiveFilter && (
                <span
                  data-testid="filter-indicator"
                  className={cn(
                    "absolute bg-red-500 rounded-full",
                    isIconMode ? "-top-0.5 -right-0.5 w-2 h-2" : "top-1 right-1 w-2 h-2"
                  )}
                />
              )}
            </button>
          </PopoverPrimitive.Trigger>
        </TooltipTrigger>

        <PopoverPrimitive.Portal>
          <PopoverPrimitive.Content
            align="start"
            sideOffset={8}
            className={cn(
              "w-[280px] rounded-xl shadow-xl border backdrop-blur-md",
              "bg-card/95 border-border/50",
              "max-h-[400px] overflow-y-auto",
              "animate-in fade-in zoom-in-95 duration-200",
              "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
              "data-[side=bottom]:slide-in-from-top-2",
              "z-[1000]"
            )}
          >
            <div className="p-4 space-y-4">
              <div className="space-y-2">
                <span className="text-sm font-medium text-foreground">时长</span>
                <div className="flex flex-wrap gap-2">
                  {durationOptions.map(option => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => handleDurationChange(option.value)}
                      className={cn(
                        "px-3 py-1.5 text-sm rounded-lg border transition-all duration-200 cursor-pointer",
                        "outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                        localFilter.duration === option.value
                          ? "bg-primary border-primary text-primary-foreground"
                          : "bg-transparent border-border text-foreground hover:bg-muted/50"
                      )}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-sm font-medium text-foreground">发布时间</span>
                <div className="flex flex-wrap gap-2">
                  {timeRangeOptions.map(option => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => handleTimeRangeChange(option.value)}
                      className={cn(
                        "px-3 py-1.5 text-sm rounded-lg border transition-all duration-200 cursor-pointer",
                        "outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                        localFilter.timeRange === option.value
                          ? "bg-primary border-primary text-primary-foreground"
                          : "bg-transparent border-border text-foreground hover:bg-muted/50"
                      )}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 pt-2 border-t border-border/50">
                <button
                  type="button"
                  onClick={handleReset}
                  className={cn(
                    "flex-1 h-10 px-3 py-2 text-sm font-medium rounded-lg border cursor-pointer",
                    "border-border text-foreground bg-transparent",
                    "transition-all duration-200",
                    "outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                    "hover:bg-muted/50"
                  )}
                >
                  重置
                </button>
                <button
                  type="button"
                  onClick={handleApply}
                  className={cn(
                    "flex-1 h-10 px-3 py-2 text-sm font-medium rounded-lg cursor-pointer",
                    "bg-primary border border-primary text-primary-foreground",
                    "transition-all duration-200",
                    "outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                    "hover:bg-primary/90"
                  )}
                >
                  应用
                </button>
              </div>
            </div>
          </PopoverPrimitive.Content>
        </PopoverPrimitive.Portal>
      </PopoverPrimitive.Root>
      <TooltipContent data-testid="filter-tooltip-content">
        {tooltipText}
      </TooltipContent>
    </Tooltip>
  );
}

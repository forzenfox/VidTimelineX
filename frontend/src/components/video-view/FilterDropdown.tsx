import React, { useState } from "react";
import { Filter, ChevronDown, Check } from "lucide-react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { cn } from "@/components/ui/utils";
import type { FilterState, DurationFilter, TimeRangeFilter } from "@/hooks/types";

interface FilterDropdownProps {
  filter: FilterState;
  onFilterChange: (filter: FilterState) => void;
  className?: string;
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

export function FilterDropdown({ filter, onFilterChange, className }: FilterDropdownProps) {
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

  const hasDurationFilter = filter.duration !== "all";
  const hasTimeRangeFilter = filter.timeRange !== "all";

  return (
    <PopoverPrimitive.Root open={isOpen} onOpenChange={handleOpenChange}>
      <PopoverPrimitive.Trigger asChild>
        <button
          type="button"
          className={cn(
            "inline-flex items-center gap-1.5 h-9 px-3 py-1.5 text-sm font-medium",
            "rounded-lg border border-gray-300 bg-transparent text-gray-700",
            "transition-all duration-150",
            "outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline",
            "hover:bg-gray-100",
            className
          )}
        >
          <Filter className="w-4 h-4" />
          <span>筛选</span>
          {(hasDurationFilter || hasTimeRangeFilter) && (
            <span className="text-xs text-primary">
              {hasDurationFilter && getDurationLabel(filter.duration)}
              {hasDurationFilter && hasTimeRangeFilter && " / "}
              {hasTimeRangeFilter && getTimeRangeLabel(filter.timeRange)}
            </span>
          )}
          <ChevronDown
            className={cn("w-4 h-4 transition-transform duration-200", isOpen && "rotate-180")}
          />
        </button>
      </PopoverPrimitive.Trigger>

      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          align="start"
          sideOffset={8}
          className={cn(
            "w-[280px] rounded-xl shadow-xl bg-white border border-gray-200",
            "max-h-[400px] overflow-y-auto",
            "animate-in fade-in zoom-in-95 duration-200",
            "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
            "data-[side=bottom]:slide-in-from-top-2"
          )}
        >
          <div className="p-4 space-y-4">
            <div className="space-y-2">
              <span className="text-sm font-medium text-gray-700">时长</span>
              <div className="flex flex-wrap gap-2">
                {durationOptions.map(option => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleDurationChange(option.value)}
                    className={cn(
                      "px-3 py-1.5 text-sm rounded-lg border transition-all duration-150",
                      "outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline",
                      localFilter.duration === option.value
                        ? "bg-primary border-primary text-white"
                        : "bg-transparent border-gray-300 text-gray-700 hover:bg-gray-100"
                    )}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-sm font-medium text-gray-700">发布时间</span>
              <div className="flex flex-wrap gap-2">
                {timeRangeOptions.map(option => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleTimeRangeChange(option.value)}
                    className={cn(
                      "px-3 py-1.5 text-sm rounded-lg border transition-all duration-150",
                      "outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline",
                      localFilter.timeRange === option.value
                        ? "bg-primary border-primary text-white"
                        : "bg-transparent border-gray-300 text-gray-700 hover:bg-gray-100"
                    )}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-2 pt-2 border-t border-gray-200">
              <button
                type="button"
                onClick={handleReset}
                className={cn(
                  "flex-1 h-9 px-3 py-1.5 text-sm font-medium rounded-lg border",
                  "border-gray-300 text-gray-700 bg-transparent",
                  "transition-all duration-150",
                  "outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline",
                  "hover:bg-gray-100"
                )}
              >
                重置
              </button>
              <button
                type="button"
                onClick={handleApply}
                className={cn(
                  "flex-1 h-9 px-3 py-1.5 text-sm font-medium rounded-lg",
                  "bg-primary border border-primary text-white",
                  "transition-all duration-150",
                  "outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline",
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
  );
}

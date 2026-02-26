import React, { useState } from "react";
import { ArrowUpDown, ChevronDown } from "lucide-react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { cn } from "@/components/ui/utils";
import type { SortOption } from "@/hooks/types";

interface SortDropdownProps {
  sortBy: SortOption;
  onSortChange: (sortBy: SortOption) => void;
  className?: string;
}

const sortOptions: { value: SortOption; label: string }[] = [
  { value: "newest", label: "最新发布" },
  { value: "oldest", label: "最早发布" },
  { value: "popular", label: "最多播放" },
];

function getSortLabel(value: SortOption): string {
  return sortOptions.find(opt => opt.value === value)?.label || "最新发布";
}

export function SortDropdown({ sortBy, onSortChange, className }: SortDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
  };

  const handleSortChange = (value: SortOption) => {
    onSortChange(value);
    setIsOpen(false);
  };

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
          <ArrowUpDown className="w-4 h-4" />
          <span>排序</span>
          <span className="text-xs text-primary">{getSortLabel(sortBy)}</span>
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
            "w-[160px] rounded-12px shadow-xl bg-white border border-gray-200",
            "animate-in fade-in zoom-in-95 duration-150",
            "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
            "data-[side=bottom]:slide-in-from-top-2"
          )}
        >
          <div className="p-1">
            {sortOptions.map(option => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleSortChange(option.value)}
                className={cn(
                  "w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg",
                  "transition-all duration-150",
                  "outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline",
                  sortBy === option.value
                    ? "bg-gray-100 text-gray-900"
                    : "text-gray-700 hover:bg-gray-50"
                )}
              >
                {sortBy === option.value && <span className="w-2 h-2 rounded-full bg-green-500" />}
                {sortBy !== option.value && <span className="w-2 h-2" />}
                {option.label}
              </button>
            ))}
          </div>
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
}

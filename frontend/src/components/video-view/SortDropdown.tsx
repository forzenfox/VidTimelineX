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
            "inline-flex items-center gap-1.5 h-10 px-3.5 py-2 text-sm font-medium cursor-pointer",
            "rounded-lg border backdrop-blur-md",
            "bg-card/60 border-border text-foreground",
            "transition-all duration-200 ease-out",
            "outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
            "hover:bg-muted/50",
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
            "w-[160px] rounded-xl shadow-xl border backdrop-blur-md",
            "bg-card/95 border-border/50",
            "animate-in fade-in zoom-in-95 duration-150",
            "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
            "data-[side=bottom]:slide-in-from-top-2",
            "z-[1000]"
          )}
        >
          <div className="p-1">
            {sortOptions.map(option => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleSortChange(option.value)}
                className={cn(
                  "w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg cursor-pointer",
                  "transition-all duration-200",
                  "outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                  sortBy === option.value
                    ? "bg-muted/50 text-foreground"
                    : "text-foreground hover:bg-muted/30"
                )}
              >
                {sortBy === option.value && <span className="w-2 h-2 rounded-full bg-primary" />}
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

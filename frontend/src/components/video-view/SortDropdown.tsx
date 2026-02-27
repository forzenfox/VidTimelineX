import React, { useState } from "react";
import { ArrowUpDown, ChevronDown } from "lucide-react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { cn } from "@/components/ui/utils";
import type { SortOption } from "@/hooks/types";

interface SortDropdownProps {
  sortBy: SortOption;
  onSortChange: (sortBy: SortOption) => void;
  className?: string;
  variant?: "icon" | "default";
}

const sortOptions: { value: SortOption; label: string }[] = [
  { value: "newest", label: "最新发布" },
  { value: "oldest", label: "最早发布" },
];

function getSortLabel(value: SortOption): string {
  return sortOptions.find(opt => opt.value === value)?.label || "最新发布";
}

export function SortDropdown({ 
  sortBy, 
  onSortChange, 
  className,
  variant = "default"
}: SortDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
  };

  const handleSortChange = (value: SortOption) => {
    onSortChange(value);
    setIsOpen(false);
  };

  const isIconMode = variant === "icon";

  return (
    <PopoverPrimitive.Root open={isOpen} onOpenChange={handleOpenChange}>
      <TooltipPrimitive.Provider delayDuration={200}>
        <TooltipPrimitive.Root>
          <TooltipPrimitive.Trigger asChild>
            <PopoverPrimitive.Trigger asChild>
              <button
                type="button"
                data-testid="sort-trigger-button"
                className={cn(
                  // 基础样式
                  "cursor-pointer rounded-lg border backdrop-blur-md",
                  "bg-card/60 border-border text-foreground",
                  "transition-all duration-200 ease-out",
                  "outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                  "hover:bg-muted/50",
                  // 打开状态高亮
                  isOpen && "border-primary/50 bg-muted/50",
                  // variant 特定样式
                  isIconMode
                    ? "inline-flex items-center justify-center w-9 h-9"
                    : "inline-flex items-center gap-1.5 h-10 px-3.5 py-2 text-sm font-medium",
                  className
                )}
              >
                <ArrowUpDown className={cn(isIconMode ? "w-[18px] h-[18px]" : "w-4 h-4")} />
                {!isIconMode && <span>{getSortLabel(sortBy)}</span>}
                {!isIconMode && (
                  <ChevronDown
                    className={cn("w-4 h-4 transition-transform duration-200", isOpen && "rotate-180")}
                  />
                )}
              </button>
            </PopoverPrimitive.Trigger>
          </TooltipPrimitive.Trigger>
          <TooltipPrimitive.Portal>
            <TooltipPrimitive.Content
              side="bottom"
              sideOffset={6}
              className={cn(
                "bg-primary text-primary-foreground animate-in fade-in-0 zoom-in-95",
                "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
                "data-[side=bottom]:slide-in-from-top-2",
                "z-50 rounded-md px-3 py-1.5 text-xs font-medium",
                "shadow-lg"
              )}
            >
              排序: {getSortLabel(sortBy)}
              <TooltipPrimitive.Arrow className="bg-primary fill-primary size-2.5 rotate-45 rounded-[2px]" />
            </TooltipPrimitive.Content>
          </TooltipPrimitive.Portal>
        </TooltipPrimitive.Root>
      </TooltipPrimitive.Provider>

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

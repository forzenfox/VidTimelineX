import React from "react";
import { Calendar, LayoutGrid, List } from "lucide-react";
import type { ViewMode } from "@/hooks/types";
import { cn } from "@/components/ui/utils";

interface CycleViewButtonProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  className?: string;
  theme?: string;
}

const viewModeCycle: ViewMode[] = ["timeline", "grid", "list"];

const viewModeIcons: Record<ViewMode, React.ElementType> = {
  timeline: Calendar,
  grid: LayoutGrid,
  list: List,
};

export function CycleViewButton({
  viewMode,
  onViewModeChange,
  className,
  theme,
}: CycleViewButtonProps) {
  const handleClick = () => {
    const currentIndex = viewModeCycle.indexOf(viewMode);
    const nextIndex = (currentIndex + 1) % viewModeCycle.length;
    const nextMode = viewModeCycle[nextIndex];
    onViewModeChange(nextMode);
  };

  const Icon = viewModeIcons[viewMode];

  return (
    <button
      type="button"
      role="button"
      aria-label="切换视图"
      data-theme={theme}
      onClick={handleClick}
      className={cn(
        "w-9 h-9 rounded-lg flex items-center justify-center",
        "transition-all duration-200 ease-out",
        "outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        "bg-card/60 border border-border/50 hover:bg-muted/50 hover:border-border",
        "text-muted-foreground hover:text-foreground",
        "cursor-pointer",
        className
      )}
    >
      <span data-icon-container className="transition-transform duration-200 ease-out">
        <Icon className="w-[18px] h-[18px]" />
      </span>
    </button>
  );
}

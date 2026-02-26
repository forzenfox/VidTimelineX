import React from "react";
import { Calendar, LayoutGrid, List } from "lucide-react";
import type { ViewMode } from "@/hooks/types";
import { cn } from "@/components/ui/utils";

interface ViewSwitcherProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  className?: string;
}

const viewModes: { mode: ViewMode; label: string; icon: React.ElementType }[] = [
  { mode: "timeline", label: "时光轴", icon: Calendar },
  { mode: "grid", label: "网格", icon: LayoutGrid },
  { mode: "list", label: "列表", icon: List },
];

export function ViewSwitcher({ viewMode, onViewModeChange, className }: ViewSwitcherProps) {
  return (
    <div
      role="group"
      className={cn(
        "inline-flex items-center gap-1 p-1 rounded-lg border border-gray-300 bg-transparent",
        className
      )}
    >
      {viewModes.map(({ mode, label, icon: Icon }) => {
        const isActive = viewMode === mode;

        return (
          <button
            key={mode}
            role="button"
            aria-pressed={isActive}
            aria-label={label}
            onClick={() => onViewModeChange(mode)}
            className={cn(
              "h-9 min-w-[64px] rounded-lg px-3 py-1.5 text-sm font-medium",
              "flex items-center justify-center gap-1.5",
              "transition-all duration-150",
              "outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline",
              isActive
                ? "bg-primary border-primary text-white"
                : "bg-transparent border-transparent text-gray-600 hover:bg-gray-100",
              !isActive && "border border-gray-300"
            )}
          >
            <Icon className="w-4 h-4" />
            <span>{label}</span>
          </button>
        );
      })}
    </div>
  );
}

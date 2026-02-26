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

interface ViewSwitcherProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  className?: string;
  theme?: string;
}

export function ViewSwitcher({ viewMode, onViewModeChange, className, theme }: ViewSwitcherProps) {
  return (
    <div
      role="group"
      className={cn(
        "inline-flex items-center gap-1.5 p-1.5 rounded-xl border backdrop-blur-md",
        "bg-card/60 border-border shadow-sm",
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
              "h-10 min-w-[72px] rounded-lg px-3.5 py-2 text-sm font-medium cursor-pointer",
              "flex items-center justify-center gap-2",
              "transition-colors duration-200 ease-out",
              "outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
              isActive
                ? theme === "kaige"
                  ? "bg-[#E74C3C] text-white shadow-md shadow-[#E74C3C]/20"
                  : "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                : "bg-transparent text-muted-foreground hover:bg-muted/50 hover:text-foreground"
            )}
          >
            <Icon className="w-4.5 h-4.5" />
            <span>{label}</span>
          </button>
        );
      })}
    </div>
  );
}

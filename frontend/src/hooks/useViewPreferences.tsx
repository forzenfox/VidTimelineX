import * as React from "react";
import type { ViewMode } from "./types";

const DEFAULT_VIEW_MODE: ViewMode = "timeline";
const DEFAULT_STORAGE_KEY = "vidtimelinex_view_mode";

interface UseViewPreferencesOptions {
  defaultViewMode?: ViewMode;
  storageKey?: string;
}

export function useViewPreferences(options: UseViewPreferencesOptions = {}) {
  const { defaultViewMode = DEFAULT_VIEW_MODE, storageKey = DEFAULT_STORAGE_KEY } = options;

  const getInitialViewMode = (): ViewMode => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored && isValidViewMode(stored)) {
        return stored as ViewMode;
      }
    } catch {
      // localStorage 不可用时使用默认值
    }
    return defaultViewMode;
  };

  const [viewMode, setViewModeState] = React.useState<ViewMode>(getInitialViewMode);

  const setViewMode = React.useCallback(
    (mode: ViewMode) => {
      try {
        localStorage.setItem(storageKey, mode);
      } catch {
        // localStorage 不可用时静默失败
      }
      setViewModeState(mode);
    },
    [storageKey]
  );

  return {
    viewMode,
    setViewMode,
  };
}

function isValidViewMode(mode: string): mode is ViewMode {
  return ["timeline", "grid", "list"].includes(mode);
}

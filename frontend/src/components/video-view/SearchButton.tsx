import React, { useState, useRef, useEffect } from "react";
import { Search, Clock, X } from "lucide-react";
import { cn } from "@/components/ui/utils";

interface SearchButtonProps {
  onSearch: (query: string) => void;
  className?: string;
  theme?: string;
  placeholder?: string;
  suggestions?: string[];
  searchHistory?: string[];
  onClearHistory?: () => void;
  variant?: "icon" | "expanded";
  "data-testid"?: string;
  /**
   * 当前搜索关键词（用于显示搜索状态）
   * 如果提供，组件将作为受控组件使用此值
   */
  currentQuery?: string;
  /**
   * 清除搜索回调
   */
  onClear?: () => void;
  /**
   * 输入变化回调（用于受控模式下实时更新）
   */
  onQueryChange?: (query: string) => void;
}

export function SearchButton({
  onSearch,
  className,
  theme,
  placeholder = "搜索视频...",
  suggestions = [],
  searchHistory = [],
  onClearHistory,
  variant = "icon",
  "data-testid": dataTestId,
  currentQuery,
  onClear,
  onQueryChange,
}: SearchButtonProps) {
  const [open, setOpen] = useState(false);
  // 内部状态，仅在非受控模式下使用
  const [internalQuery, setInternalQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const isExpanded = variant === "expanded";

  // 受控模式：如果提供了 currentQuery，使用它；否则使用内部状态
  const query = currentQuery !== undefined ? currentQuery : internalQuery;

  // 处理点击外部关闭下拉框
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = () => {
    if (query.trim()) {
      onSearch(query.trim());
      setOpen(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    // 非受控模式下更新内部状态
    if (currentQuery === undefined) {
      setInternalQuery(suggestion);
    }
    onSearch(suggestion);
    setOpen(false);
  };

  const handleClearHistory = () => {
    onClearHistory?.();
  };

  const handleReset = () => {
    // 非受控模式下更新内部状态
    if (currentQuery === undefined) {
      setInternalQuery("");
    }
    onClear?.();
    setOpen(false);
    inputRef.current?.focus();
  };

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    // 非受控模式下更新内部状态
    if (currentQuery === undefined) {
      setInternalQuery(newValue);
    }
    // 如果提供了 onQueryChange，调用它通知父组件
    onQueryChange?.(newValue);
  };

  const handleFocus = () => {
    setOpen(true);
  };

  // 判断是否有搜索内容
  const hasQuery = query.trim().length > 0;

  // 渲染搜索框（直接在工具栏上）
  const renderSearchInput = () => (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        <input
          ref={inputRef}
          type="text"
          role="textbox"
          value={query}
          onChange={handleQueryChange}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          placeholder={placeholder}
          data-theme={theme}
          data-testid={dataTestId}
          className={cn(
            "w-full h-10 pl-10 pr-10 rounded-lg",
            "bg-card/60 border border-border/50",
            "text-sm text-foreground placeholder:text-muted-foreground",
            "outline-none focus:border-ring focus:bg-card",
            "transition-colors duration-200",
            "cursor-text",
            className
          )}
        />
        {/* 叉叉图标 - 有内容时显示 */}
        {hasQuery && (
          <button
            type="button"
            aria-label="清空"
            onClick={handleReset}
            style={{
              position: "absolute",
              right: "12px",
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 10,
            }}
            className={cn(
              "w-5 h-5 flex items-center justify-center rounded-full",
              "text-muted-foreground hover:text-foreground hover:bg-muted",
              "active:scale-95 active:bg-muted-foreground/20",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              "transition-all duration-200",
              "cursor-pointer"
            )}
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* 下拉框内容 - 只显示搜索历史，且只在有历史时显示 */}
      {open && searchHistory.length > 0 && (
        <div
          className={cn(
            "absolute top-full left-0 mt-2 w-80 rounded-xl shadow-xl border backdrop-blur-md",
            "bg-card/95 border-border/50",
            "max-h-[500px] overflow-y-auto",
            "animate-in fade-in zoom-in-95 duration-200",
            "z-[1000]"
          )}
        >
          <div className="p-4">
            {/* 搜索历史 */}
            <div className="space-y-2">
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                  <span className="text-xs font-medium text-muted-foreground">搜索历史</span>
                </div>
                {onClearHistory && (
                  <button
                    type="button"
                    role="button"
                    aria-label="清空历史"
                    onClick={handleClearHistory}
                    className={cn(
                      "text-xs text-muted-foreground hover:text-foreground",
                      "transition-colors duration-200",
                      "cursor-pointer"
                    )}
                  >
                    清空
                  </button>
                )}
              </div>
              <div className="space-y-0.5">
                {searchHistory.map((item, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleSuggestionClick(item)}
                    className={cn(
                      "w-full flex items-center gap-2 px-2 py-1.5 rounded-md",
                      "text-sm text-foreground hover:bg-muted",
                      "transition-colors duration-200",
                      "cursor-pointer text-left"
                    )}
                  >
                    <Clock className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                    <span className="truncate">{item}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // icon 模式：显示为图标按钮
  const renderIconButton = () => (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        role="button"
        aria-label="搜索"
        data-theme={theme}
        data-testid={dataTestId}
        data-active={open}
        onClick={() => setOpen(!open)}
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
        <Search className="w-[18px] h-[18px]" />
      </button>

      {/* 下拉框内容 - 包含输入框和搜索历史 */}
      {open && (
        <div
          className={cn(
            "absolute top-full right-0 mt-2 w-80 rounded-xl shadow-xl border backdrop-blur-md",
            "bg-card/95 border-border/50",
            "max-h-[500px] overflow-y-auto",
            "animate-in fade-in zoom-in-95 duration-200",
            "z-[1000]"
          )}
        >
          <div className="p-4 space-y-4">
            {/* 搜索输入框 - 放大镜固定左侧，叉叉在右侧 */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              <input
                ref={inputRef}
                type="text"
                role="textbox"
                value={query}
                onChange={handleQueryChange}
                onKeyDown={handleKeyDown}
                onFocus={() => setOpen(true)}
                placeholder={placeholder}
                className={cn(
                  "w-full h-10 pl-10 pr-10 rounded-lg",
                  "bg-muted/50 border border-border/50",
                  "text-sm text-foreground placeholder:text-muted-foreground",
                  "outline-none focus:border-ring focus:bg-muted",
                  "transition-colors duration-200"
                )}
                autoFocus
              />
              {/* 叉叉图标 - 有内容时显示 */}
              {hasQuery && (
                <button
                  type="button"
                  aria-label="清空"
                  onClick={handleReset}
                  style={{
                    position: "absolute",
                    right: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    zIndex: 10,
                  }}
                  className={cn(
                    "w-5 h-5 flex items-center justify-center rounded-full",
                    "text-muted-foreground hover:text-foreground hover:bg-muted",
                    "active:scale-95 active:bg-muted-foreground/20",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                    "transition-all duration-200",
                    "cursor-pointer"
                  )}
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* 搜索建议 - 只在有建议时显示 */}
            {suggestions && suggestions.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-1.5 px-1">
                  <Search className="w-3.5 h-3.5 text-muted-foreground" />
                  <span className="text-xs font-medium text-muted-foreground">搜索建议</span>
                </div>
                <div className="space-y-0.5">
                  {suggestions.map((item, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleSuggestionClick(item)}
                      className={cn(
                        "w-full flex items-center gap-2 px-2 py-1.5 rounded-md",
                        "text-sm text-foreground hover:bg-muted",
                        "transition-colors duration-200",
                        "cursor-pointer text-left"
                      )}
                    >
                      <Search className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                      <span className="truncate">{item}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 搜索历史 - 只在有历史时显示 */}
            {searchHistory.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between px-1">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                    <span className="text-xs font-medium text-muted-foreground">搜索历史</span>
                  </div>
                  {onClearHistory && (
                    <button
                      type="button"
                      role="button"
                      aria-label="清空历史"
                      onClick={handleClearHistory}
                      className={cn(
                        "text-xs text-muted-foreground hover:text-foreground",
                        "transition-colors duration-200",
                        "cursor-pointer"
                      )}
                    >
                      清空
                    </button>
                  )}
                </div>
                <div className="space-y-0.5">
                  {searchHistory.map((item, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleSuggestionClick(item)}
                      className={cn(
                        "w-full flex items-center gap-2 px-2 py-1.5 rounded-md",
                        "text-sm text-foreground hover:bg-muted",
                        "transition-colors duration-200",
                        "cursor-pointer text-left"
                      )}
                    >
                      <Clock className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                      <span className="truncate">{item}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );

  return isExpanded ? renderSearchInput() : renderIconButton();
}

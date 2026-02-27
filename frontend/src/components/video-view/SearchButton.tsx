import React, { useState, useRef, useEffect } from "react";
import { Search, Clock, X, Sparkles } from "lucide-react";
import { cn } from "@/components/ui/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

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
}: SearchButtonProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const isExpanded = variant === "expanded";

  useEffect(() => {
    if ((open || isExpanded) && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [open, isExpanded]);

  const handleSearch = () => {
    if (query.trim()) {
      onSearch(query.trim());
      if (!isExpanded) {
        setOpen(false);
      }
      setQuery("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    onSearch(suggestion);
    if (!isExpanded) {
      setOpen(false);
    }
    setQuery("");
  };

  const handleClearHistory = () => {
    onClearHistory?.();
  };

  const handleClearInput = () => {
    setQuery("");
    inputRef.current?.focus();
  };

  // 搜索内容区域（输入框、建议、历史）
  const renderSearchContent = () => (
    <div className="p-3">
      {/* 搜索输入框 */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          ref={inputRef}
          type="text"
          role="textbox"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={cn(
            "w-full h-10 pl-9 pr-9 rounded-lg",
            "bg-muted/50 border border-border/50",
            "text-sm text-foreground placeholder:text-muted-foreground",
            "outline-none focus:ring-2 focus:ring-ring focus:border-transparent",
            "transition-all duration-200"
          )}
        />
        {query && (
          <button
            type="button"
            aria-label="清空"
            onClick={handleClearInput}
            className={cn(
              "absolute right-3 top-1/2 -translate-y-1/2",
              "w-4 h-4 flex items-center justify-center",
              "text-muted-foreground hover:text-foreground",
              "transition-colors duration-200"
            )}
          >
            <X className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* 搜索建议 */}
      {suggestions.length > 0 && (
        <div className="mt-3">
          <div className="flex items-center gap-1.5 px-1 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-xs font-medium text-muted-foreground">
              搜索建议
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleSuggestionClick(suggestion)}
                className={cn(
                  "px-2.5 py-1 rounded-md text-xs",
                  "bg-secondary/50 hover:bg-secondary",
                  "text-secondary-foreground",
                  "transition-colors duration-200",
                  "cursor-pointer"
                )}
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 搜索历史 */}
      {searchHistory.length > 0 && (
        <div className="mt-3 pt-3 border-t border-border/50">
          <div className="flex items-center justify-between px-1 mb-2">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-xs font-medium text-muted-foreground">
                搜索历史
              </span>
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
  );

  // expanded 模式：直接显示展开状态
  if (isExpanded) {
    return (
      <div
        data-theme={theme}
        data-testid={dataTestId}
        className={cn(
          "w-80 bg-popover rounded-xl shadow-lg",
          className
        )}
      >
        {renderSearchContent()}
      </div>
    );
  }

  // icon 模式：使用 Popover，点击展开
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          role="button"
          aria-label="搜索"
          data-theme={theme}
          className={cn(
            "w-9 h-9 rounded-lg flex items-center justify-center",
            "transition-all duration-200 ease-out",
            "outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
            "bg-card/60 border border-border/50 hover:bg-muted/50 hover:border-border",
            "text-muted-foreground hover:text-foreground",
            "cursor-pointer",
            open && "bg-muted border-border text-foreground",
            className
          )}
        >
          <Search className="w-[18px] h-[18px]" />
        </button>
      </PopoverTrigger>
      <PopoverContent
        role="dialog"
        align="end"
        sideOffset={8}
        className={cn(
          "w-80 p-0 bg-popover border-border rounded-xl shadow-lg",
          "data-[state=open]:animate-in data-[state=closed]:animate-out",
          "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
          "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
          "data-[side=bottom]:slide-in-from-top-2"
        )}
      >
        {renderSearchContent()}
      </PopoverContent>
    </Popover>
  );
}

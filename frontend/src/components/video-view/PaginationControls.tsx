import React, { useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/components/ui/utils";

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  pageSizeOptions?: number[];
  className?: string;
}

const DEFAULT_PAGE_SIZE_OPTIONS = [12, 24, 48];

/**
 * 生成分页页码数组
 * 显示当前页前后各2页，过多时显示省略号
 */
function generatePageNumbers(currentPage: number, totalPages: number): (number | string)[] {
  const pages: (number | string)[] = [];
  const delta = 2;

  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= currentPage - delta && i <= currentPage + delta)) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== "...") {
      pages.push("...");
    }
  }

  return pages;
}

export function PaginationControls({
  currentPage,
  totalPages,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = DEFAULT_PAGE_SIZE_OPTIONS,
  className,
}: PaginationControlsProps) {
  // 如果只有一页或没有数据，不显示分页控件
  if (totalPages <= 1) {
    return null;
  }

  const pageNumbers = useMemo(
    () => generatePageNumbers(currentPage, totalPages),
    [currentPage, totalPages]
  );

  // 计算当前显示的范围
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  const hasPrevPage = currentPage > 1;
  const hasNextPage = currentPage < totalPages;

  return (
    <nav
      role="navigation"
      aria-label="分页导航"
      className={cn(
        "flex flex-col sm:flex-row items-center justify-between gap-4",
        "p-4 rounded-xl border backdrop-blur-md",
        "bg-card/70 border-border/50 shadow-lg",
        className
      )}
    >
      {/* 左侧：每页数量选择 */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <label htmlFor="page-size" className="whitespace-nowrap">
          每页显示
        </label>
        <select
          id="page-size"
          value={pageSize}
          onChange={e => onPageSizeChange(Number(e.target.value))}
          className={cn(
            "h-8 px-2 rounded-md border bg-background",
            "text-sm focus:outline-none focus:ring-2 focus:ring-primary/20",
            "border-border hover:border-primary/50 transition-colors cursor-pointer"
          )}
        >
          {pageSizeOptions.map(size => (
            <option key={size} value={size}>
              {size} 条
            </option>
          ))}
        </select>
        <span className="whitespace-nowrap">共 {totalItems} 条</span>
      </div>

      {/* 中间：分页导航 */}
      <div className="flex items-center gap-1">
        {/* 上一页按钮 */}
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!hasPrevPage}
          className={cn(
            "inline-flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium",
            "transition-all duration-200",
            hasPrevPage
              ? "hover:bg-muted/50 text-foreground cursor-pointer"
              : "text-muted-foreground cursor-not-allowed opacity-50"
          )}
          aria-label="上一页"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden sm:inline">上一页</span>
        </button>

        {/* 页码按钮 */}
        <div className="flex items-center gap-1">
          {pageNumbers.map((page, index) =>
            page === "..." ? (
              <span key={`ellipsis-${index}`} className="px-2 py-2 text-muted-foreground">
                ...
              </span>
            ) : (
              <button
                key={page}
                type="button"
                onClick={() => onPageChange(page as number)}
                data-active={currentPage === page}
                className={cn(
                  "min-w-[36px] h-9 px-3 rounded-lg text-sm font-medium",
                  "transition-all duration-200",
                  currentPage === page
                    ? "shadow-md"
                    : "bg-transparent hover:bg-muted/50 text-foreground cursor-pointer"
                )}
                aria-label={`第 ${page} 页`}
                aria-current={currentPage === page ? "page" : undefined}
              >
                {page}
              </button>
            )
          )}
        </div>

        {/* 下一页按钮 */}
        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!hasNextPage}
          className={cn(
            "inline-flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium",
            "transition-all duration-200",
            hasNextPage
              ? "hover:bg-muted/50 text-foreground cursor-pointer"
              : "text-muted-foreground cursor-not-allowed opacity-50"
          )}
          aria-label="下一页"
        >
          <span className="hidden sm:inline">下一页</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* 右侧：当前范围信息 */}
      <div className="text-sm text-muted-foreground whitespace-nowrap">
        <span className="font-medium text-foreground">
          {startItem}-{endItem}
        </span>
        <span> / </span>
        <span>{totalItems}</span>
      </div>
    </nav>
  );
}

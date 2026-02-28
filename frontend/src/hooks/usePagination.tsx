import { useState, useMemo, useCallback } from "react";

export interface UsePaginationOptions {
  initialPage?: number;
  initialPageSize?: number;
  pageSizeOptions?: number[];
}

export interface UsePaginationReturn<T> {
  currentPage: number;
  pageSize: number;
  totalPages: number;
  totalItems: number;
  startIndex: number;
  endIndex: number;
  paginatedItems: T[];
  hasNextPage: boolean;
  hasPrevPage: boolean;
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;
  goToNextPage: () => void;
  goToPrevPage: () => void;
  goToFirstPage: () => void;
  goToLastPage: () => void;
}

const DEFAULT_PAGE_SIZE = 12;
const DEFAULT_PAGE_SIZE_OPTIONS = [12, 24, 48];

export function usePagination<T>(
  items: T[],
  options: UsePaginationOptions = {}
): UsePaginationReturn<T> {
  const {
    initialPage = 1,
    initialPageSize = DEFAULT_PAGE_SIZE,
    pageSizeOptions = DEFAULT_PAGE_SIZE_OPTIONS,
  } = options;

  const [currentPage, setCurrentPage] = useState(initialPage);
  const [pageSize, setPageSizeState] = useState(initialPageSize);

  const totalItems = items.length;
  const totalPages = useMemo(() => {
    if (totalItems === 0) return 0;
    return Math.ceil(totalItems / pageSize);
  }, [totalItems, pageSize]);

  // 计算当前页的数据范围
  const startIndex = useMemo(() => {
    return (currentPage - 1) * pageSize;
  }, [currentPage, pageSize]);

  const endIndex = useMemo(() => {
    return Math.min(startIndex + pageSize, totalItems);
  }, [startIndex, pageSize, totalItems]);

  // 获取当前页的数据
  const paginatedItems = useMemo(() => {
    return items.slice(startIndex, endIndex);
  }, [items, startIndex, endIndex]);

  // 是否有上一页/下一页
  const hasNextPage = useMemo(() => {
    return currentPage < totalPages;
  }, [currentPage, totalPages]);

  const hasPrevPage = useMemo(() => {
    return currentPage > 1;
  }, [currentPage]);

  // 设置页码（带边界检查）
  const setPage = useCallback(
    (page: number) => {
      if (totalPages === 0) {
        setCurrentPage(1);
        return;
      }
      const validPage = Math.max(1, Math.min(page, totalPages));
      setCurrentPage(validPage);
    },
    [totalPages]
  );

  // 设置每页数量（同时重置到第一页）
  const setPageSize = useCallback(
    (size: number) => {
      // 验证是否在允许的选项中
      const validSize = pageSizeOptions.includes(size) ? size : pageSizeOptions[0];
      setPageSizeState(validSize);
      // 重置到第一页，避免数据错位
      setCurrentPage(1);
    },
    [pageSizeOptions]
  );

  // 下一页
  const goToNextPage = useCallback(() => {
    if (hasNextPage) {
      setCurrentPage(prev => prev + 1);
    }
  }, [hasNextPage]);

  // 上一页
  const goToPrevPage = useCallback(() => {
    if (hasPrevPage) {
      setCurrentPage(prev => prev - 1);
    }
  }, [hasPrevPage]);

  // 回到首页
  const goToFirstPage = useCallback(() => {
    setCurrentPage(1);
  }, []);

  // 跳到末页
  const goToLastPage = useCallback(() => {
    if (totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [totalPages]);

  return {
    currentPage,
    pageSize,
    totalPages,
    totalItems,
    startIndex,
    endIndex,
    paginatedItems,
    hasNextPage,
    hasPrevPage,
    setPage,
    setPageSize,
    goToNextPage,
    goToPrevPage,
    goToFirstPage,
    goToLastPage,
  };
}

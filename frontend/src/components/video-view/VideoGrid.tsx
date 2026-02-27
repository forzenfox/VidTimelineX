import React, { useMemo } from "react";
import VideoCard from "../video/VideoCard";
import { PaginationControls } from "./PaginationControls";
import { usePagination } from "@/hooks/usePagination";
import type { Video, Theme } from "../video/types";

export interface VideoGridProps {
  videos: Video[];
  onVideoClick: (video: Video) => void;
  theme: Theme;
}

/**
 * B站风格视频网格容器
 * 响应式网格布局：移动端2列，平板3列，桌面4列
 * 网格间距16px
 * 支持分页功能
 */
const VideoGrid: React.FC<VideoGridProps> = React.memo(({ videos, onVideoClick, theme }) => {
  const cardClickHandler = useMemo(
    () => (video: Video) => {
      onVideoClick(video);
    },
    [onVideoClick]
  );

  // 使用分页Hook
  const {
    currentPage,
    pageSize,
    totalPages,
    totalItems,
    paginatedItems,
    setPage,
    setPageSize,
  } = usePagination(videos);

  return (
    <div className="flex flex-col gap-6" data-testid="video-grid-container">
      <div data-testid="video-grid" className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full">
        {paginatedItems.map((video) => (
          <VideoCard
            key={video.id}
            video={video}
            onClick={cardClickHandler}
            theme={theme}
            layout="vertical"
            className="h-full"
          />
        ))}
      </div>

      <PaginationControls
        currentPage={currentPage}
        totalPages={totalPages}
        pageSize={pageSize}
        totalItems={totalItems}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
      />
    </div>
  );
});

VideoGrid.displayName = "VideoGrid";

export default VideoGrid;

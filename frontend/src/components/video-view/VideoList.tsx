import React, { useMemo } from "react";
import VideoCard from "../video/VideoCard";
import { PaginationControls } from "./PaginationControls";
import { usePagination } from "@/hooks/usePagination";
import type { Video, Theme } from "../video/types";

export interface VideoListProps {
  videos: Video[];
  onVideoClick: (video: Video) => void;
  theme: Theme;
}

/**
 * B站风格视频列表容器
 * 垂直排列，列表项间距16px
 * 支持分页功能
 */
const VideoList: React.FC<VideoListProps> = React.memo(({ videos, onVideoClick, theme }) => {
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
    <div className="flex flex-col gap-6" data-testid="video-list-container">
      <div data-testid="video-list" className="flex flex-col gap-4 w-full">
        {paginatedItems.map((video) => (
          <VideoCard
            key={video.id}
            video={video}
            onClick={cardClickHandler}
            theme={theme}
            layout="horizontal"
            className="w-full"
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

VideoList.displayName = "VideoList";

export default VideoList;

import React, { useMemo } from "react";
import VideoCard from "../video/VideoCard";
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
 */
const VideoGrid: React.FC<VideoGridProps> = React.memo(({ videos, onVideoClick, theme }) => {
  const cardClickHandler = useMemo(
    () => (video: Video) => {
      onVideoClick(video);
    },
    [onVideoClick]
  );

  return (
    <div data-testid="video-grid" className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full">
      {videos.map((video) => (
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
  );
});

VideoGrid.displayName = "VideoGrid";

export default VideoGrid;

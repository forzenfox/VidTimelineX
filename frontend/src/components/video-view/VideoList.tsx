import React, { useMemo } from "react";
import VideoCard from "../video/VideoCard";
import type { Video, Theme } from "../video/types";

export interface VideoListProps {
  videos: Video[];
  onVideoClick: (video: Video) => void;
  theme: Theme;
}

/**
 * B站风格视频列表容器
 * 垂直排列，列表项间距16px
 */
const VideoList: React.FC<VideoListProps> = React.memo(({ videos, onVideoClick, theme }) => {
  const cardClickHandler = useMemo(
    () => (video: Video) => {
      onVideoClick(video);
    },
    [onVideoClick]
  );

  return (
    <div data-testid="video-list" className="flex flex-col gap-4 w-full">
      {videos.map((video) => (
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
  );
});

VideoList.displayName = "VideoList";

export default VideoList;

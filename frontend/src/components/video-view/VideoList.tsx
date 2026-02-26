import React, { useMemo } from "react";
import VideoCard from "../video/VideoCard";
import type { Video, Theme } from "../video/types";

export interface VideoListProps {
  videos: Video[];
  onVideoClick: (video: Video) => void;
  theme: Theme;
}

const VideoList: React.FC<VideoListProps> = React.memo(({ videos, onVideoClick, theme }) => {
  const cardClickHandler = useMemo(
    () => (video: Video) => {
      onVideoClick(video);
    },
    [onVideoClick]
  );

  const containerClass = useMemo(() => "flex flex-col gap-2 sm:gap-3", []);

  return (
    <div data-testid="video-list" className={containerClass}>
      {videos.map((video, index) => (
        <VideoCard
          key={video.id}
          video={video}
          onClick={cardClickHandler}
          theme={theme}
          index={index}
          size="medium"
          layout="horizontal"
          className="w-full"
        />
      ))}
    </div>
  );
});

VideoList.displayName = "VideoList";

export default VideoList;

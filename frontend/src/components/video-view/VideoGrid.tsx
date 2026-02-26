import React, { useMemo } from "react";
import VideoCard from "../video/VideoCard";
import type { Video, Theme } from "../video/types";

export interface VideoGridProps {
  videos: Video[];
  onVideoClick: (video: Video) => void;
  theme: Theme;
}

const VideoGrid: React.FC<VideoGridProps> = React.memo(({ videos, onVideoClick, theme }) => {
  const cardClickHandler = useMemo(
    () => (video: Video) => {
      onVideoClick(video);
    },
    [onVideoClick]
  );

  const gridClass = useMemo(
    () => "grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4",
    []
  );

  return (
    <div data-testid="video-grid" className={gridClass}>
      {videos.map((video, index) => (
        <VideoCard
          key={video.id}
          video={video}
          onClick={cardClickHandler}
          theme={theme}
          index={index}
          size="medium"
          layout="vertical"
          className="rounded-xl overflow-hidden transition-transform duration-300 hover:scale-[1.02] hover:shadow-xl"
        />
      ))}
    </div>
  );
});

VideoGrid.displayName = "VideoGrid";

export default VideoGrid;

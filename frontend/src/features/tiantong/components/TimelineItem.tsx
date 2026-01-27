import React from "react";
import type { Video } from "../data/types";
import VideoCard from "./VideoCard";

interface TimelineItemProps {
  date: string;
  videos: Video[];
  isLast?: boolean;
  onVideoClick: (video: Video) => void;
  theme: "tiger" | "sweet";
}

/**
 * 时间线项组件
 * 使用React.memo优化性能，避免不必要的重新渲染
 */
export const TimelineItem: React.FC<TimelineItemProps> = React.memo(({
  date,
  videos,
  isLast = false,
  onVideoClick,
  theme,
}) => {
  const primaryColor = theme === "tiger" ? "rgb(255, 95, 0)" : "rgb(255, 140, 180)";
  const secondaryColor = theme === "tiger" ? "rgb(255, 190, 40)" : "rgb(255, 192, 203)";

  return (
    <div className="relative pb-10">
      <div className="md:hidden mb-5">
        <div
          className="inline-flex items-center gap-2 text-white px-4 py-1.5 rounded-lg"
          style={{
            background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
          }}
        >
          <span className="text-xs opacity-80">日期</span>
          <span className="font-bold">{date}</span>
        </div>
      </div>

      <div className="flex gap-6 lg:gap-8">
        <div className="hidden md:flex-shrink-0 w-28 lg:w-32 pt-1">
          <div
            className="sticky top-24 inline-flex flex-col items-start text-white px-3 py-1.5 rounded-lg text-sm"
            style={{
              background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
            }}
          >
            <span className="opacity-80 text-xs">日期</span>
            <span className="font-bold">{date}</span>
          </div>
        </div>

        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-6">
          {videos.map(video => (
            <VideoCard key={video.id} video={video} onClick={onVideoClick} />
          ))}
        </div>
      </div>
    </div>
  );
});

export default TimelineItem;

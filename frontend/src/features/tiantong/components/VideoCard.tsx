import React from "react";
import { Play, Eye, Calendar, User } from "lucide-react";
import { VideoCover } from "../../../components/figma/ImageWithFallback";
import type { Video } from "../data/types";

interface VideoCardProps {
  video: Video;
  onClick: (video: Video) => void;
  /** 卡片索引，用于首屏图片优化 */
  index?: number;
}

/**
 * 视频卡片组件
 * 使用React.memo优化性能，避免不必要的重新渲染
 * 封面图优先从B站CDN加载，失败时回退到本地懒加载图片
 */
const VideoCard: React.FC<VideoCardProps> = React.memo(({ video, onClick, index = 0 }) => {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClick(video);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      onClick(video);
    }
  };

  return (
    <div
      data-testid="video-card"
      onClick={handleClick}
      className="group relative bg-card rounded-2xl overflow-hidden border border-border cursor-pointer shadow-md transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl active:scale-[0.98] active:shadow-md sm:hover:-translate-y-2 sm:hover:shadow-2xl sm:active:scale-[0.99]"
      role="article"
      aria-labelledby={`video-title-${video.id}`}
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      <div className="relative aspect-video overflow-hidden">
        <VideoCover
          cover_url={video.cover_url}
          cover={video.cover}
          alt={video.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          index={index}
        />
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
          <div
            className="w-14 h-14 bg-white/95 rounded-full flex items-center justify-center shadow-lg transform scale-50 group-hover:scale-100 transition-transform duration-300"
            aria-hidden="true"
          >
            <Play fill="var(--primary)" className="text-primary ml-1" size={28} />
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-4.5">
        <h3
          id={`video-title-${video.id}`}
          className="font-bold text-foreground line-clamp-2 min-h-[2.75rem] leading-[1.5] group-hover:text-primary transition-colors text-sm sm:text-base"
        >
          {video.title}
        </h3>

        <div
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-3 text-xs sm:text-sm text-muted-foreground gap-2 sm:gap-0"
          aria-label="视频信息"
        >
          <div className="flex items-center gap-1.5">
            <User size={13} className="flex-shrink-0" aria-hidden="true" />
            <span>{video.author || "未知作者"}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar size={13} className="flex-shrink-0" aria-hidden="true" />
            <span>{video.date}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Eye size={13} className="flex-shrink-0" aria-hidden="true" />
            <span>{video.views || "未知"}</span>
          </div>
        </div>
      </div>
    </div>
  );
});

export default VideoCard;

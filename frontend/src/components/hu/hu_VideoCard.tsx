import React from "react";
import { Play, Eye, Calendar } from "lucide-react";
import type { Video } from "@/features/tiantong/data/types";

interface VideoCardProps {
  video: Video;
  onClick: (video: Video) => void;
}

const VideoCard: React.FC<VideoCardProps> = ({ video, onClick }) => {
  const Icon = video.icon;

  return (
    <div
      onClick={() => onClick(video)}
      className="group relative bg-card rounded-2xl overflow-hidden border border-border cursor-pointer shadow-md transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl active:scale-[0.98] active:shadow-md sm:hover:-translate-y-2 sm:hover:shadow-2xl sm:active:scale-[0.99]"
      role="article"
      aria-labelledby={`video-title-${video.id}`}
      tabIndex={0}
      onKeyDown={e => e.key === "Enter" && onClick(video)}
    >
      {/* Thumbnail - 16:9标准化比例 */}
      <div className="relative aspect-video overflow-hidden">
        <img
          src={video.cover}
          alt={video.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
          <div
            className="w-14 h-14 bg-white/95 rounded-full flex items-center justify-center shadow-lg transform scale-50 group-hover:scale-100 transition-transform duration-300"
            aria-hidden="true"
          >
            <Play fill="var(--primary)" className="text-primary ml-1" size={28} />
          </div>
        </div>

        {/* Category Tag - 分类角标优化 */}
        <div
          className="absolute top-2.5 left-2.5 px-2.5 py-1 bg-primary/90 backdrop-blur-sm text-primary-foreground text-xs font-bold rounded-lg flex items-center shadow-md"
          role="badge"
        >
          <Icon size={12} className="mr-1" aria-hidden="true" />
          {video.category === "sing"
            ? "甜筒天籁"
            : video.category === "dance"
              ? "霸总热舞"
              : video.category === "funny"
                ? "反差萌"
                : "224日常"}
        </div>
      </div>

      {/* Content - 信息层级重构 */}
      <div className="p-4 sm:p-4.5">
        <h3
          id={`video-title-${video.id}`}
          className="font-bold text-foreground line-clamp-2 min-h-[2.75rem] leading-[1.5] group-hover:text-primary transition-colors text-sm sm:text-base"
        >
          {video.title}
        </h3>

        {/* 日期与播放量放在同一行 */}
        <div
          className="flex items-center justify-between mt-3 text-xs sm:text-sm text-muted-foreground"
          aria-label="视频信息"
        >
          <div className="flex items-center gap-1.5">
            <Calendar size={13} className="flex-shrink-0" aria-hidden="true" />
            <span>{video.date}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Eye size={13} className="flex-shrink-0" aria-hidden="true" />
            <span>{video.views}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;

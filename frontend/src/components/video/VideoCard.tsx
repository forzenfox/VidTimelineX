import React from "react";
import { Play, Calendar, User, Eye } from "lucide-react";
import { VideoCover } from "../figma/ImageWithFallback";
import type { VideoCardProps, Theme } from "./types";

/**
 * 根据主题获取颜色配置
 * @param theme 主题名称
 */
const getThemeColors = (theme: Theme) => {
  switch (theme) {
    case "tiger":
      return {
        primary: "#FF5F00",
        primaryForeground: "#fff",
        background: "#FFFDF9",
        border: "#FF9500",
        text: "#5D6D7E",
        textSecondary: "#85929E",
      };
    case "sweet":
      return {
        primary: "#FF8C78",
        primaryForeground: "#fff",
        background: "#FFF5F8",
        border: "#FF8CA0",
        text: "#6A1B9A",
        textSecondary: "#9C27B0",
      };
    case "blood":
      return {
        primary: "#E11D48",
        primaryForeground: "#fff",
        background: "#1E1B4B",
        border: "rgba(225, 29, 72, 0.5)",
        text: "#E2E8F0",
        textSecondary: "#9CA3AF",
      };
    case "mix":
      return {
        primary: "#F59E0B",
        primaryForeground: "#fff",
        background: "#FEF3C7",
        border: "rgba(245, 158, 11, 0.5)",
        text: "#78350F",
        textSecondary: "#92400E",
      };
    case "dongzhu":
      return {
        primary: "#5DADE2",
        primaryForeground: "#fff",
        background: "#FFF9E6",
        border: "#AED6F1",
        text: "#5D6D7E",
        textSecondary: "#85929E",
      };
    case "kaige":
      return {
        primary: "#E74C3C",
        primaryForeground: "#fff",
        background: "#16213E",
        border: "#E74C3C",
        text: "#ECF0F1",
        textSecondary: "#BDC3C7",
      };
    default:
      return {
        primary: "#6366F1",
        primaryForeground: "#fff",
        background: "#f9fafb",
        border: "#e5e7eb",
        text: "#111827",
        textSecondary: "#6b7280",
      };
  }
};

/**
 * 格式化播放量
 * @param views 播放量
 */
const formatViews = (views: number | string | undefined): string => {
  if (!views) return "";
  const num = typeof views === "string" ? parseInt(views, 10) : views;
  if (num >= 10000) {
    return `${(num / 10000).toFixed(1)}万`;
  }
  return num.toString();
};

/**
 * B站风格视频卡片组件
 * 列表模式：左侧封面(16:9) + 右侧信息区(标题+元信息)
 * 网格模式：垂直布局，封面在上，信息在下
 */
const VideoCard: React.FC<VideoCardProps> = React.memo(
  ({ video, onClick, theme, index = 0, layout = "horizontal", className = "" }) => {
    const handleClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      onClick(video);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        onClick(video);
      }
    };

    const colors = getThemeColors(theme);

    // 列表模式布局 - B站风格
    if (layout === "horizontal") {
      return (
        <div
          data-testid="video-card"
          onClick={handleClick}
          className={`group flex gap-4 p-3 rounded-lg cursor-pointer transition-all duration-200 hover:bg-muted/30 ${className}`}
          role="article"
          aria-labelledby={`video-title-${video.id}`}
          tabIndex={0}
          onKeyDown={handleKeyDown}
        >
          {/* 封面区域 - 固定宽度，响应式 */}
          <div className="w-[140px] sm:w-[160px] lg:w-[180px] shrink-0">
            <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
              <VideoCover
                cover_url={video.cover_url}
                cover={video.cover}
                alt={video.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                index={index}
              />

              {/* 时长标签 - 右上角 */}
              {video.duration && (
                <div className="absolute top-2 right-2 bg-black/70 text-white text-xs font-medium px-1.5 py-0.5 rounded">
                  {video.duration}
                </div>
              )}

              {/* 悬停播放按钮 */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black/40">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ background: colors.primary }}
                >
                  <Play
                    className="ml-0.5"
                    size={20}
                    style={{ color: colors.primaryForeground, fill: colors.primaryForeground }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 信息区域 - flex-1占满剩余空间 */}
          <div className="flex-1 flex flex-col min-w-0 py-0.5">
            {/* 标题 - 顶部 */}
            <h3
              id={`video-title-${video.id}`}
              className="text-base font-semibold text-foreground line-clamp-2 leading-snug group-hover:text-primary transition-colors"
            >
              {video.title}
            </h3>

            {/* 元信息 - 底部 */}
            <div
              className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground"
              aria-label="视频信息"
            >
              {video.author && (
                <div className="flex items-center gap-1">
                  <User size={12} className="flex-shrink-0" />
                  <span className="truncate max-w-[80px] sm:max-w-[120px]">{video.author}</span>
                </div>
              )}

              <div className="flex items-center gap-1">
                <Calendar size={12} className="flex-shrink-0" />
                <span>{video.date}</span>
              </div>

              {video.views !== undefined && video.views !== null && (
                <div className="flex items-center gap-1">
                  <Eye size={12} className="flex-shrink-0" />
                  <span>{formatViews(video.views)}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }

    // 网格模式布局 - 垂直排列
    return (
      <div
        data-testid="video-card"
        onClick={handleClick}
        className={`group flex flex-col gap-2 cursor-pointer ${className}`}
        role="article"
        aria-labelledby={`video-title-${video.id}`}
        tabIndex={0}
        onKeyDown={handleKeyDown}
      >
        {/* 封面区域 */}
        <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-muted">
          <VideoCover
            cover_url={video.cover_url}
            cover={video.cover}
            alt={video.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            index={index}
          />

          {/* 时长标签 */}
          {video.duration && (
            <div className="absolute top-2 right-2 bg-black/70 text-white text-xs font-medium px-1.5 py-0.5 rounded">
              {video.duration}
            </div>
          )}

          {/* 悬停播放按钮 */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black/40">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{ background: colors.primary }}
            >
              <Play
                className="ml-0.5"
                size={24}
                style={{ color: colors.primaryForeground, fill: colors.primaryForeground }}
              />
            </div>
          </div>
        </div>

        {/* 信息区域 */}
        <div className="px-0.5">
          <h3
            id={`video-title-${video.id}`}
            className="text-sm font-medium text-foreground line-clamp-2 leading-snug group-hover:text-primary transition-colors"
          >
            {video.title}
          </h3>

          <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
            {video.author && <span className="truncate">{video.author}</span>}
            <span className="text-muted-foreground/50">·</span>
            <span>{video.date}</span>
          </div>
        </div>
      </div>
    );
  }
);

VideoCard.displayName = "VideoCard";

export default VideoCard;

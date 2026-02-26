import React from "react";
import { Play, Calendar, User } from "lucide-react";
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
 * 统一视频卡片组件
 * 使用React.memo优化性能，避免不必要的重新渲染
 * 封面图优先从B站CDN加载，失败时回退到本地懒加载图片
 * 支持主题、尺寸和布局定制
 * 展示字段：标题、作者、日期、时长、标签
 */
const VideoCard: React.FC<VideoCardProps> = React.memo(
  ({
    video,
    onClick,
    theme,
    index = 0,
    size = "medium",
    layout = "horizontal",
    className = "",
  }) => {
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

    const getSizeStyles = (size: string) => {
      switch (size) {
        case "small":
          return {
            card: "w-full",
            title: "text-sm",
            info: "text-xs",
          };
        case "large":
          return {
            card: "w-full",
            title: "text-lg",
            info: "text-sm",
          };
        case "compact":
          return {
            card: "w-full",
            title: "text-sm",
            info: "text-xs",
          };
        default:
          return {
            card: "w-full",
            title: "text-base",
            info: "text-xs sm:text-sm",
          };
      }
    };

    const sizeStyles = getSizeStyles(size);

    const getLayoutStyles = (layout: string) => {
      switch (layout) {
        case "vertical":
          return {
            container: "flex flex-col !p-0",
            content: "flex flex-col p-4",
          };
        default:
          return {
            container: "flex !p-0",
            content: "flex flex-col ml-4 py-3",
          };
      }
    };

    const layoutStyles = getLayoutStyles(layout);

    return (
      <div
        data-testid="video-card"
        onClick={handleClick}
        className={`group relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl active:scale-[0.98] active:shadow-md sm:hover:-translate-y-2 sm:hover:shadow-2xl sm:active:scale-[0.99] ${sizeStyles.card} ${layoutStyles.container} ${className}`}
        style={{
          background: colors.background,
          border: `2px solid ${colors.border}`,
          boxShadow: `0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)`,
        }}
        role="article"
        aria-labelledby={`video-title-${video.id}`}
        tabIndex={0}
        onKeyDown={handleKeyDown}
      >
        <div
          className={`relative overflow-hidden flex-shrink-0 p-0 m-0 ${size === "compact" ? "w-32 h-48 sm:w-36 sm:h-54 flex-shrink-0" : "aspect-video"}`}
        >
          <VideoCover
            cover_url={video.cover_url}
            cover={video.cover}
            alt={video.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            index={index}
          />

          {/* 时长显示在封面右上角 */}
          {video.duration && (
            <div className="absolute top-2 right-2 bg-black/70 text-white text-xs font-medium px-2 py-1 rounded-md">
              {video.duration}
            </div>
          )}

          <div
            className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300"
            style={{ background: `${colors.primary}CC` }}
          >
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg transform scale-50 group-hover:scale-100 transition-transform duration-300"
              style={{ background: colors.primary }}
              aria-hidden="true"
            >
              <Play
                className="ml-1"
                size={28}
                style={{ color: colors.primaryForeground, fill: colors.primaryForeground }}
              />
            </div>
          </div>
        </div>

        <div className={layoutStyles.content}>
          <h3
            id={`video-title-${video.id}`}
            className={`font-bold line-clamp-2 min-h-[2.75rem] leading-[1.5] group-hover:text-primary transition-colors ${sizeStyles.title}`}
            style={{
              color: colors.text,
            }}
          >
            {video.title}
          </h3>

          <div
            className={`flex flex-wrap items-center gap-x-3 gap-y-1.5 mt-3 ${sizeStyles.info}`}
            aria-label="视频信息"
            style={{
              color: colors.textSecondary,
            }}
          >
            {video.author && (
              <div className="flex items-center gap-1">
                <User size={12} className="flex-shrink-0" aria-hidden="true" />
                <span>{video.author}</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <Calendar size={12} className="flex-shrink-0" aria-hidden="true" />
              <span>{video.date}</span>
            </div>
          </div>

          {video.tags && video.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {video.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 text-xs font-medium rounded-full transition-all duration-300"
                  style={{
                    background: `${colors.primary}20`,
                    border: `1px solid ${colors.primary}40`,
                    color: colors.text,
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }
);

export default VideoCard;

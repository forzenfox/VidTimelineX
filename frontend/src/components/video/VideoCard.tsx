import React from "react";
import { Play, Eye, Calendar, User } from "lucide-react";
import { VideoCover } from "../figma/ImageWithFallback";
import type { VideoCardProps, Theme } from "./types";

/**
 * 统一视频卡片组件
 * 使用React.memo优化性能，避免不必要的重新渲染
 * 封面图优先从B站CDN加载，失败时回退到本地懒加载图片
 * 支持主题、尺寸和布局定制
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

    // 根据主题获取颜色
    const getThemeColors = (theme: Theme) => {
      switch (theme) {
        case "tiger":
          return {
            primary: "rgb(255, 95, 0)",
            primaryForeground: "#fff",
            background: "#FFFDF9",
            border: "#FF9500",
            text: "#5D6D7E",
            textSecondary: "#85929E",
          };
        case "sweet":
          return {
            primary: "rgb(255, 140, 120)",
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

    const colors = getThemeColors(theme);

    // 根据尺寸获取样式
    const getSizeStyles = (size: string) => {
      switch (size) {
        case "small":
          return {
            card: "w-64",
            title: "text-sm",
            info: "text-xs",
          };
        case "large":
          return {
            card: "w-96",
            title: "text-lg",
            info: "text-sm",
          };
        default: // medium
          return {
            card: "w-80",
            title: "text-base",
            info: "text-xs sm:text-sm",
          };
      }
    };

    const sizeStyles = getSizeStyles(size);

    // 根据布局获取样式
    const getLayoutStyles = (layout: string) => {
      switch (layout) {
        case "vertical":
          return {
            container: "flex flex-col",
            content: "flex flex-col",
          };
        default: // horizontal
          return {
            container: "flex",
            content: "flex flex-col ml-4",
          };
      }
    };

    const layoutStyles = getLayoutStyles(layout);

    return (
      <div
        data-testid="video-card"
        onClick={handleClick}
        className={`group relative rounded-2xl overflow-hidden border cursor-pointer shadow-md transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl active:scale-[0.98] active:shadow-md sm:hover:-translate-y-2 sm:hover:shadow-2xl sm:active:scale-[0.99] ${sizeStyles.card} ${layoutStyles.container} ${className}`}
        style={{
          background: colors.background,
          borderColor: colors.border,
        }}
        role="article"
        aria-labelledby={`video-title-${video.id}`}
        tabIndex={0}
        onKeyDown={handleKeyDown}
      >
        <div className="relative aspect-video overflow-hidden flex-shrink-0">
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
              style={{
                background: `${colors.primary}E6`,
              }}
              aria-hidden="true"
            >
              <Play fill={colors.primaryForeground} className="ml-1" size={28} />
            </div>
          </div>
        </div>

        <div className={`p-4 sm:p-4.5 ${layoutStyles.content}`}>
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
            className={`flex flex-col sm:flex-row items-start sm:items-center justify-between mt-3 text-muted-foreground gap-2 sm:gap-0 ${sizeStyles.info}`}
            aria-label="视频信息"
            style={{
              color: colors.textSecondary,
            }}
          >
            {video.author && (
              <div className="flex items-center gap-1.5">
                <User size={13} className="flex-shrink-0" aria-hidden="true" />
                <span>{video.author}</span>
              </div>
            )}
            <div className="flex items-center gap-1.5">
              <Calendar size={13} className="flex-shrink-0" aria-hidden="true" />
              <span>{video.date}</span>
            </div>
            {video.views && (
              <div className="flex items-center gap-1.5">
                <Eye size={13} className="flex-shrink-0" aria-hidden="true" />
                <span>{video.views}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
);

export default VideoCard;

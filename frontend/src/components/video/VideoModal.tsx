import React, { useEffect, useState } from "react";
import { X, ExternalLink } from "lucide-react";
import type { VideoModalProps, Theme } from "./types";

/**
 * 统一视频弹窗组件
 * 支持主题样式定制
 * 统一视频信息的展示字段和顺序
 * 展示字段：标题、作者、日期、时长、BV号、标签
 * BV号直接从video.bv字段读取
 */
const VideoModal: React.FC<VideoModalProps> = ({ video, onClose, theme, className = "" }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (video) {
      document.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "unset";
    };
  }, [video, onClose]);

  if (!video) return null;

  // 根据主题获取颜色和样式
  const getThemeStyles = (theme: Theme) => {
    switch (theme) {
      case "tiger":
        return {
          background: "#1A1A1A",
          primary: "rgb(255, 95, 0)",
          secondary: "rgb(255, 190, 40)",
          text: "#FFFFFF",
          textSecondary: "#E5E5E5",
          border: "rgb(255, 95, 0)",
          boxShadow: "0 20px 60px rgba(255, 95, 0, 0.4)",
          borderRadius: "8px",
          buttonText: "🐯 跳转B站观看",
        };
      case "sweet":
        return {
          background: "#FFF5F8",
          primary: "rgb(255, 140, 120)",
          secondary: "rgb(255, 192, 203)",
          text: "#333333",
          textSecondary: "#666666",
          border: "rgb(255, 140, 120)",
          boxShadow: "0 20px 60px rgba(255, 140, 120, 0.4)",
          borderRadius: "24px",
          buttonText: "🍦 跳转B站观看",
        };
      case "blood":
        return {
          background: "linear-gradient(135deg, #1E1B4B 0%, #0F0F23 100%)",
          primary: "#E11D48",
          secondary: "#DC2626",
          text: "#E2E8F0",
          textSecondary: "#9CA3AF",
          border: "rgba(225, 29, 72, 0.5)",
          boxShadow: "0 20px 60px rgba(225, 29, 72, 0.4)",
          borderRadius: "16px",
          buttonText: "🔴 跳转B站观看",
        };
      case "mix":
        return {
          background: "linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)",
          primary: "#F59E0B",
          secondary: "#3B82F6",
          text: "#78350F",
          textSecondary: "#92400E",
          border: "rgba(245, 158, 11, 0.5)",
          boxShadow: "0 20px 60px rgba(245, 158, 11, 0.4)",
          borderRadius: "16px",
          buttonText: "🍳 跳转B站观看",
        };
      case "dongzhu":
        return {
          background: "linear-gradient(135deg, #FFF9E6, #FFFEF7)",
          primary: "#5DADE2",
          secondary: "#D4E8F0",
          text: "#5D6D7E",
          textSecondary: "#85929E",
          border: "#AED6F1",
          boxShadow: "0 20px 60px rgba(93, 173, 226, 0.4)",
          borderRadius: "24px",
          buttonText: "🐷 跳转B站观看",
        };
      case "kaige":
        return {
          background: "linear-gradient(135deg, #16213E, #1A1A2E)",
          primary: "#E74C3C",
          secondary: "#C0392B",
          text: "#ECF0F1",
          textSecondary: "#BDC3C7",
          border: "#E74C3C",
          boxShadow: "0 20px 60px rgba(231, 76, 60, 0.5)",
          borderRadius: "8px",
          buttonText: "🐗 跳转B站观看",
        };
      default:
        return {
          background: "#ffffff",
          primary: "#6366F1",
          secondary: "#818CF8",
          text: "#111827",
          textSecondary: "#6b7280",
          border: "#e5e7eb",
          boxShadow: "0 20px 60px rgba(99, 102, 241, 0.4)",
          borderRadius: "16px",
          buttonText: "📺 跳转B站观看",
        };
    }
  };

  const themeStyles = getThemeStyles(theme);

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  const getVideoPlayerUrl = (bv: string) => {
    if (!bv) {
      return "https://player.bilibili.com/player.html";
    }
    return `https://player.bilibili.com/player.html?bvid=${bv}&page=1&high_quality=1&danmaku=1`;
  };

  const videoId = video.bv || "";

  return (
    <div
      data-testid="video-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
      style={{
        background: "rgba(0, 0, 0, 0.8)",
        backdropFilter: "blur(10px)",
      }}
    >
      <div
        className={`relative w-full max-w-5xl mx-4 transition-all duration-300 ease-in-out ${className}`}
        onClick={e => e.stopPropagation()}
        style={{
          background: themeStyles.background,
          borderRadius: themeStyles.borderRadius,
          border: `3px solid ${themeStyles.border}`,
          boxShadow: themeStyles.boxShadow,
          overflow: "hidden",
        }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="flex justify-between items-center p-4">
          <h3
            id="modal-title"
            className="text-xl font-bold"
            style={{
              color: themeStyles.text,
              flex: 1,
              marginRight: "1rem",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {video.title}
          </h3>
          <button
            onClick={onClose}
            className="flex items-center justify-center p-2 rounded-full transition-all duration-300 hover:scale-110 w-10 h-10"
            style={{
              background: `${themeStyles.primary}E6`,
              color: "#fff",
            }}
            aria-label="关闭弹窗"
          >
            <X size={24} />
          </button>
        </div>

        <div className="relative aspect-video bg-black overflow-hidden">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black z-10">
              <div
                className="animate-spin rounded-full h-12 w-12 border-b-2"
                style={{ borderColor: themeStyles.primary }}
              ></div>
            </div>
          )}
          <iframe
            src={getVideoPlayerUrl(video.bv || "")}
            className="w-full h-full border-0"
            allowFullScreen
            allow="autoplay; fullscreen"
            title={video.title}
            onLoad={handleIframeLoad}
          />
        </div>

        <div className="p-6">
          <div className="flex flex-wrap items-center gap-4 mb-4">
            {video.author && (
              <div
                className="text-sm"
                style={{
                  color: themeStyles.textSecondary,
                }}
              >
                👤 {video.author}
              </div>
            )}
            <div
              className="text-sm"
              style={{
                color: themeStyles.textSecondary,
              }}
            >
              📅 {video.date}
            </div>
            <div
              className="text-sm"
              style={{
                color: themeStyles.textSecondary,
              }}
            >
              ⏱️ {video.duration}
            </div>
            <div
              className="text-sm"
              style={{
                color: themeStyles.textSecondary,
              }}
            >
              🎬 {videoId}
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            {(video.tags || []).map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 text-sm font-medium transition-all duration-300"
                style={{
                  background: `${themeStyles.primary}20`,
                  border: `1px solid ${themeStyles.primary}`,
                  borderRadius: "8px",
                  color: themeStyles.text,
                }}
              >
                {tag}
              </span>
            ))}
          </div>

          <a
            href={video.videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full text-center py-4 font-bold text-lg transition-all duration-300 hover:scale-105"
            style={{
              background: `linear-gradient(135deg, ${themeStyles.primary}, ${themeStyles.secondary})`,
              borderRadius: "8px",
              color: "#fff",
              textDecoration: "none",
              boxShadow: `0 4px 15px ${themeStyles.primary}40`,
            }}
          >
            <div className="flex items-center justify-center gap-2">
              <ExternalLink size={20} />
              <span>{themeStyles.buttonText}</span>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
};

export default VideoModal;

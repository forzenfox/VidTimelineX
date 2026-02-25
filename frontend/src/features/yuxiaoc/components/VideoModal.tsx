import React, { useEffect, useState } from "react";
import type { Theme, Video } from "../data/types";
import { X, ExternalLink } from "lucide-react";

interface VideoModalProps {
  video: Video | null;
  theme: Theme;
  onClose: () => void;
}

export const VideoModal: React.FC<VideoModalProps> = ({ video, theme, onClose }) => {
  const isBlood = theme === "blood";
  const [isLoading, setIsLoading] = useState(true);

  // 根据主题获取配色方案
  const themeColors = isBlood
    ? {
        background: "linear-gradient(135deg, #1E1B4B 0%, #0F0F23 100%)",
        textPrimary: "#E2E8F0",
        textSecondary: "#9CA3AF",
      }
    : {
        background: "linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)",
        textPrimary: "#78350F",
        textSecondary: "#92400E",
      };

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

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  if (!video) return null;

  // 智能提取视频ID，支持av和BV格式
  const getVideoPlayerUrl = (videoUrl: string) => {
    const lastPart = videoUrl.split("/").pop() || "";

    // 检测是否为av格式
    if (lastPart.startsWith("av")) {
      const aid = lastPart.replace("av", "");
      return `https://player.bilibili.com/player.html?aid=${aid}&page=1&high_quality=1&danmaku=1`;
    }
    // 检测是否为BV格式
    else if (lastPart.startsWith("BV")) {
      const bvid = lastPart;
      return `https://player.bilibili.com/player.html?bvid=${bvid}&page=1&high_quality=1&danmaku=1`;
    }
    // 默认返回原始链接
    return `https://player.bilibili.com/player.html?bvid=${lastPart}&page=1&high_quality=1&danmaku=1`;
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        backdropFilter: "blur(10px)",
      }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl rounded-2xl overflow-hidden"
        style={{
          background: themeColors.background,
          border: `2px solid ${isBlood ? "rgba(225, 29, 72, 0.5)" : "rgba(245, 158, 11, 0.5)"}`,
          boxShadow: isBlood
            ? "0 20px 60px rgba(225, 29, 72, 0.4)"
            : "0 20px 60px rgba(245, 158, 11, 0.4)",
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
          style={{
            background: isBlood ? "#E11D48" : "#F59E0B",
          }}
        >
          <X className="w-5 h-5 text-white" />
        </button>

        {/* Video Player */}
        <div className="aspect-video bg-black overflow-hidden">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black z-10">
              <div
                className="animate-spin rounded-full h-12 w-12 border-b-2"
                style={{ borderColor: isBlood ? "#E11D48" : "#F59E0B" }}
              ></div>
            </div>
          )}
          <iframe
            src={getVideoPlayerUrl(video.videoUrl)}
            className="w-full h-full border-0"
            allowFullScreen
            title={video.title}
            onLoad={handleIframeLoad}
          />
        </div>

        {/* Video Info */}
        <div className="p-6">
          <h3
            className="text-2xl font-bold mb-3"
            style={{
              fontFamily: "Russo One, sans-serif",
              color: themeColors.textPrimary,
            }}
          >
            {video.title}
          </h3>

          <div className="flex flex-wrap items-center gap-4 mb-4">
            <div style={{ color: themeColors.textSecondary }}>📅 {video.date}</div>
            <div style={{ color: themeColors.textSecondary }}>⏱️ {video.duration}</div>
            <div style={{ color: themeColors.textSecondary }}>🎬 {video.bv}</div>
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            {video.tags.map((tag, idx) => (
              <span
                key={idx}
                className="px-3 py-1 rounded-full text-sm font-bold"
                style={{
                  background: isBlood ? "rgba(225, 29, 72, 0.2)" : "rgba(245, 158, 11, 0.2)",
                  color: isBlood ? "#E11D48" : "#F59E0B",
                  border: `1px solid ${isBlood ? "rgba(225, 29, 72, 0.3)" : "rgba(245, 158, 11, 0.3)"}`,
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
            className="block w-full text-center py-3 font-bold transition-all duration-300 hover:scale-105"
            style={{
              background: isBlood
                ? "linear-gradient(135deg, #E11D48 0%, #DC2626 100%)"
                : "linear-gradient(135deg, #F59E0B 0%, #3B82F6 100%)",
              color: "white",
              borderRadius: "8px",
              textDecoration: "none",
            }}
          >
            <div className="flex items-center justify-center gap-2">
              <ExternalLink className="w-5 h-5" />
              <span>前往B站观看</span>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
};

export default VideoModal;

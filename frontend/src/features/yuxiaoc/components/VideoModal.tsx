import React from "react";
import type { Theme, Video } from "../data/types";
import { X, ExternalLink } from "lucide-react";

interface VideoModalProps {
  video: Video | null;
  theme: Theme;
  onClose: () => void;
}

export const VideoModal: React.FC<VideoModalProps> = ({ video, theme, onClose }) => {
  const isBlood = theme === "blood";

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

  if (!video) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.8)" }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl rounded-2xl overflow-hidden"
        style={{
          background: themeColors.background,
          border: `2px solid ${isBlood ? "rgba(225, 29, 72, 0.5)" : "rgba(245, 158, 11, 0.5)"}`,
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

        {/* Video Player Placeholder */}
        <div className="aspect-video relative">
          <img src={video.cover} alt={video.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <a
              href={`https://www.bilibili.com/video/${video.bvid}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white transition-all duration-300 hover:scale-105"
              style={{
                background: isBlood
                  ? "linear-gradient(135deg, #E11D48 0%, #DC2626 100%)"
                  : "linear-gradient(135deg, #F59E0B 0%, #3B82F6 100%)",
              }}
            >
              <ExternalLink className="w-5 h-5" />
              <span>前往B站观看</span>
            </a>
          </div>
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

          {video.description && (
            <p className="mb-4" style={{ color: themeColors.textSecondary }}>
              {video.description}
            </p>
          )}

          <div className="flex flex-wrap gap-2">
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
        </div>
      </div>
    </div>
  );
};

export default VideoModal;

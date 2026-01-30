import React, { useEffect, useState } from "react";
import { X, ExternalLink } from "lucide-react";
import type { Video } from "../data/types";

interface VideoModalProps {
  video: Video | null;
  onClose: () => void;
  theme?: "tiger" | "sweet";
}

const VideoModal: React.FC<VideoModalProps> = ({ video, onClose, theme = "tiger" }) => {
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

  const primaryColor = theme === "tiger" ? "rgb(255, 95, 0)" : "rgb(255, 140, 120)";
  const secondaryColor = theme === "tiger" ? "rgb(255, 190, 40)" : "rgb(255, 192, 203)";

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  const bvid = video.videoUrl.split("/").pop();

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
      style={{
        background: "rgba(0, 0, 0, 0.8)",
        backdropFilter: "blur(10px)",
      }}
    >
      <div
        className="relative w-full max-w-5xl mx-4 transition-all duration-300 ease-in-out"
        onClick={e => e.stopPropagation()}
        style={{
          background: theme === "tiger" ? "#1A1A1A" : "#FFF5F8",
          borderRadius: theme === "tiger" ? "8px" : "24px",
          border: theme === "tiger" ? `3px solid ${primaryColor}` : `3px solid ${primaryColor}`,
          boxShadow:
            theme === "tiger"
              ? `0 20px 60px rgba(255, 95, 0, 0.4)`
              : `0 20px 60px rgba(255, 140, 120, 0.4)`,
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
              color: theme === "tiger" ? "#FFFFFF" : "#333333",
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
              background: theme === "tiger" ? `rgba(255, 95, 0, 0.8)` : `rgba(255, 140, 120, 0.8)`,
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
                style={{ borderColor: primaryColor }}
              ></div>
            </div>
          )}
          <iframe
            src={`https://player.bilibili.com/player.html?bvid=${bvid}&page=1&high_quality=1&danmaku=1`}
            className="w-full h-full border-0"
            allowFullScreen
            allow="autoplay; fullscreen"
            title={video.title}
            onLoad={handleIframeLoad}
          />
        </div>

        <div className="p-6">
          <div className="flex flex-wrap items-center gap-4 mb-4">
            <div
              className="text-sm"
              style={{
                color: theme === "tiger" ? "#E5E5E5" : "#666666",
              }}
            >
              📅 {video.date || "2024-01-01"}
            </div>
            <div
              className="text-sm"
              style={{
                color: theme === "tiger" ? "#E5E5E5" : "#666666",
              }}
            >
              ⏱️ {video.duration || "00:00"}
            </div>
            <div
              className="text-sm"
              style={{
                color: theme === "tiger" ? "#E5E5E5" : "#666666",
              }}
            >
              🎬 {bvid}
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            {(video.tags || ["甜筒", "直播"]).map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 text-sm font-medium transition-all duration-300"
                style={{
                  background:
                    theme === "tiger" ? `rgba(255, 95, 0, 0.2)` : `rgba(255, 140, 120, 0.2)`,
                  border:
                    theme === "tiger" ? `1px solid ${primaryColor}` : `1px solid ${primaryColor}`,
                  borderRadius: theme === "tiger" ? "4px" : "12px",
                  color: theme === "tiger" ? "#FFFFFF" : "#333333",
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
              background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
              borderRadius: theme === "tiger" ? "8px" : "16px",
              color: "#fff",
              textDecoration: "none",
              boxShadow:
                theme === "tiger"
                  ? `0 4px 15px rgba(255, 95, 0, 0.4)`
                  : `0 4px 15px rgba(255, 140, 120, 0.4)`,
            }}
          >
            {theme === "tiger" ? "🐯 跳转B站观看" : "🍦 跳转B站观看"}
          </a>
        </div>
      </div>
    </div>
  );
};

export default VideoModal;

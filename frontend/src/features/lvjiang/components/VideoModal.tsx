import { useEffect, useState } from "react";
import { X } from "lucide-react";
import type { Video } from "../data/types";

interface VideoModalProps {
  video: Video | null;
  theme: "dongzhu" | "kaige";
  onClose: () => void;
}

export function VideoModal({ video, theme, onClose }: VideoModalProps) {
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

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  if (!video) return null;

  const bilibiliUrl = video.videoUrl;
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
        className="relative w-full max-w-5xl mx-4 theme-transition"
        onClick={e => e.stopPropagation()}
        style={{
          background:
            theme === "dongzhu"
              ? "linear-gradient(135deg, #FFF9E6, #FFFEF7)"
              : "linear-gradient(135deg, #16213E, #1A1A2E)",
          borderRadius: theme === "dongzhu" ? "24px" : "8px",
          border: theme === "dongzhu" ? "3px solid #AED6F1" : "3px solid #E74C3C",
          boxShadow:
            theme === "dongzhu"
              ? "0 20px 60px rgba(93, 173, 226, 0.4)"
              : "0 20px 60px rgba(231, 76, 60, 0.5)",
          overflow: "hidden",
        }}
      >
        {theme === "dongzhu" ? (
          <div className="absolute top-4 right-20 text-4xl opacity-20 pointer-events-none">
            🐾🐾🐾
          </div>
        ) : (
          <div
            className="absolute top-0 right-0 w-32 h-32 opacity-10 pointer-events-none"
            style={{
              background:
                "repeating-linear-gradient(45deg, transparent, transparent 10px, #E74C3C 10px, #E74C3C 12px)",
            }}
          />
        )}

        <div className="flex justify-between items-center p-4">
          <h3
            className="text-xl font-bold"
            style={{
              color: theme === "dongzhu" ? "#5D6D7E" : "#ECF0F1",
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
            className="flex items-center justify-center p-2 rounded-full theme-transition hover:scale-110 w-10 h-10"
            style={{
              background:
                theme === "dongzhu" ? "rgba(93, 173, 226, 0.8)" : "rgba(231, 76, 60, 0.9)",
              color: "#fff",
            }}
          >
            <X size={24} />
          </button>
        </div>

        <div className="relative aspect-video bg-black overflow-hidden">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black z-10">
              <div
                className="animate-spin rounded-full h-12 w-12 border-b-2"
                style={{ borderColor: theme === "dongzhu" ? "#5DADE2" : "#E74C3C" }}
              ></div>
            </div>
          )}
          <iframe
            src={`https://player.bilibili.com/player.html?bvid=${bvid}&page=1&high_quality=1&danmaku=1`}
            className="w-full h-full border-0"
            allowFullScreen
            title={video.title}
            onLoad={handleIframeLoad}
          />
        </div>

        <div className="p-6">
          <div className="flex flex-wrap items-center gap-4 mb-4">
            <div
              className="text-sm"
              style={{
                color: theme === "dongzhu" ? "#85929E" : "#BDC3C7",
              }}
            >
              📅 {video.date}
            </div>
            <div
              className="text-sm"
              style={{
                color: theme === "dongzhu" ? "#85929E" : "#BDC3C7",
              }}
            >
              ⏱️ {video.duration}
            </div>
            <div
              className="text-sm"
              style={{
                color: theme === "dongzhu" ? "#85929E" : "#BDC3C7",
              }}
            >
              🎬 {bvid}
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            {video.tags.map(tag => (
              <span
                key={tag}
                className="px-3 py-1 text-sm font-medium theme-transition"
                style={{
                  background:
                    theme === "dongzhu" ? "rgba(93, 173, 226, 0.2)" : "rgba(231, 76, 60, 0.3)",
                  border: theme === "dongzhu" ? "1px solid #AED6F1" : "1px solid #E74C3C",
                  borderRadius: theme === "dongzhu" ? "12px" : "4px",
                  color: theme === "dongzhu" ? "#5D6D7E" : "#ECF0F1",
                }}
              >
                {tag}
              </span>
            ))}
          </div>

          <a
            href={bilibiliUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full text-center py-4 font-bold text-lg theme-transition hover:scale-105"
            style={{
              background:
                theme === "dongzhu"
                  ? "linear-gradient(135deg, #D4E8F0, #5DADE2)"
                  : "linear-gradient(135deg, #E74C3C, #C0392B)",
              borderRadius: theme === "dongzhu" ? "16px" : "8px",
              color: "#fff",
              textDecoration: "none",
              boxShadow:
                theme === "dongzhu"
                  ? "0 4px 15px rgba(93, 173, 226, 0.4)"
                  : "0 4px 15px rgba(231, 76, 60, 0.4)",
            }}
          >
            {theme === "dongzhu" ? "🐷 跳转B站观看" : "🐗 跳转B站观看"}
          </a>
        </div>
      </div>
    </div>
  );
}

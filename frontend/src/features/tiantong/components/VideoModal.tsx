import React, { useEffect, useState, useMemo } from "react";
import { X, MessageCircle, ExternalLink, Loader2 } from "lucide-react";
import type { Video } from "../data/types";

interface VideoModalProps {
  video: Video | null;
  onClose: () => void;
  theme?: "tiger" | "sweet";
}

const VideoModal: React.FC<VideoModalProps> = ({ video, onClose, theme = "tiger" }) => {
  const [isLoading, setIsLoading] = useState(true);

  const mockBvid = useMemo(
    // eslint-disable-next-line react-hooks/purity
    () => `BV${Math.random().toString(36).substring(2, 13).toUpperCase()}`,
    []
  );

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

  const primaryColor = theme === "tiger" ? "rgb(255, 95, 0)" : "rgb(255, 140, 180)";
  const secondaryColor = theme === "tiger" ? "rgb(255, 190, 40)" : "rgb(255, 192, 203)";

  const modalTheme = {
    tiger: {
      headerBg: "bg-secondary/20",
      headerText: "text-muted-foreground",
      cardBg: "bg-[#1a1a1a]",
      buttonBg: `bg-gradient-to-r ${primaryColor} ${secondaryColor} text-white font-medium hover:opacity-90`,
      footerBg: "bg-[#1a1a1a]",
      footerText: "text-gray-300",
      border: "border-border",
      tooltipBg: "bg-secondary/20",
      tooltipText: "text-muted-foreground",
    },
    sweet: {
      headerBg: "bg-secondary/20",
      headerText: "text-muted-foreground",
      cardBg: "bg-[#fff5f8]",
      buttonBg: `bg-gradient-to-r ${primaryColor} ${secondaryColor} text-white font-medium hover:opacity-90`,
      footerBg: "bg-[#fff5f8]",
      footerText: "text-gray-600",
      border: "border-border",
      tooltipBg: "bg-secondary/20",
      tooltipText: "text-muted-foreground",
    },
  };

  const colors = modalTheme[theme];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
      <div
        className="relative w-full max-w-5xl mx-4 bg-white rounded-2xl shadow-2xl overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h3
            id="modal-title"
            className="text-lg font-bold truncate flex-1 mr-4 text-gray-800"
          >
            {video.title}
          </h3>
          <button onClick={onClose} className="flex items-center justify-center p-2 hover:bg-gray-100 rounded-full transition-colors w-8 h-8">
          <X size={20} className="text-gray-800" />
        </button>
        </div>

        <div className="relative" style={{ paddingBottom: "56.25%" }}>
          <iframe
            src={`https://player.bilibili.com/player.html?bvid=${mockBvid}&page=1&high_quality=1&danmaku=1`}
            className="absolute inset-0 w-full h-full"
            allowFullScreen
            allow="autoplay; fullscreen"
            scrolling="no"
            frameBorder="0"
            title={video.title}
          />
        </div>

        <div className="p-4 flex items-center justify-between bg-gray-50">
          <div>
            <a
              href={`https://www.bilibili.com/video/${mockBvid}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center px-4 py-2 bg-blue-500 text-white font-medium rounded-full transition-colors hover:bg-blue-600"
            >
              <ExternalLink size={18} className="mr-2" />
              跳转原站
            </a>
          </div>
          <div className="flex items-center text-gray-600 text-sm">
            <MessageCircle size={16} className="mr-1" />
            <span>328 条弹幕装填中...</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoModal;

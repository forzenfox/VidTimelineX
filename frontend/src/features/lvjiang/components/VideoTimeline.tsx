import React, { useMemo } from "react";
import { videos } from "../data";
import type { Video } from "../data";
import VideoCard from "@/components/business/video/VideoCard";

interface VideoTimelineProps {
  theme: "dongzhu" | "kaige";
  onVideoClick: (video: Video) => void;
}

/**
 * 单个视频项组件 - 桌面端时光轴布局
 * 移动端使用垂直列表布局
 */
const VideoItem: React.FC<{
  video: Video;
  index: number;
  theme: "dongzhu" | "kaige";
  onVideoClick: (video: Video) => void;
}> = React.memo(({ video, index, theme, onVideoClick }) => {
  const isLeft = index % 2 === 0;

  const nodeStyle = useMemo(
    () => ({
      background:
        theme === "dongzhu"
          ? "linear-gradient(135deg, #D4E8F0, #5DADE2)"
          : "linear-gradient(135deg, #E74C3C, #C0392B)",
      border: theme === "dongzhu" ? "4px solid #E8F4F8" : "4px solid #16213E",
      boxShadow:
        theme === "dongzhu"
          ? "0 0 20px rgba(93, 173, 226, 0.6)"
          : "0 0 20px rgba(231, 76, 60, 0.6)",
    }),
    [theme]
  );

  return (
    <div
      key={video.id}
      className={`relative mb-8 sm:mb-16 flex items-center ${isLeft ? "sm:justify-start" : "sm:justify-end"} justify-start pl-8 sm:pl-0`}
    >
      {/* 移动端简化节点 - 小圆点 */}
      <div
        className="sm:hidden absolute left-4 w-3 h-3 rounded-full -ml-1.5 z-10"
        style={{
          background: theme === "dongzhu" ? "#5DADE2" : "#E74C3C",
          border: `2px solid ${theme === "dongzhu" ? "#E8F4F8" : "#16213E"}`,
          top: "24px",
        }}
      />

      {/* 节点图标 - 桌面端显示在中心，移动端隐藏 */}
      <div
        className="hidden sm:flex absolute left-1/2 -ml-8 w-16 h-16 rounded-full items-center justify-center theme-transition cursor-pointer hover:scale-125 z-10 transition-all duration-300"
        style={nodeStyle}
        onClick={() => onVideoClick(video)}
      >
        <div className="text-3xl">{theme === "dongzhu" ? "🐷" : "🐗"}</div>
      </div>

      {/* 视频卡片 - 移动端全宽，桌面端固定宽度 */}
      <div className={`w-full max-w-sm sm:w-5/12 ${isLeft ? "sm:pr-16" : "sm:pl-16"} sm:px-0`}>
        <VideoCard
          video={video}
          onClick={onVideoClick}
          theme={theme}
          index={index}
          size="medium"
          layout="vertical"
        />
      </div>
    </div>
  );
});

/**
 * 视频时光轴组件
 * 响应式布局：移动端垂直列表，桌面端时光轴左右交替
 */
export const VideoTimeline = React.memo(({ theme, onVideoClick }: VideoTimelineProps) => {
  const centerLineStyle = useMemo(
    () => ({
      background:
        theme === "dongzhu"
          ? "linear-gradient(to bottom, #AED6F1, #5DADE2)"
          : "linear-gradient(to bottom, #E74C3C, #C0392B)",
      boxShadow:
        theme === "dongzhu"
          ? "0 0 10px rgba(93, 173, 226, 0.5)"
          : "0 0 10px rgba(231, 76, 60, 0.5)",
    }),
    [theme]
  );

  const videoItems = useMemo(() => {
    return videos.map((video, index) => (
      <VideoItem
        key={video.id}
        video={video}
        index={index}
        theme={theme}
        onVideoClick={onVideoClick}
      />
    ));
  }, [theme, onVideoClick]);

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <div className="text-center mb-8 sm:mb-12">
        <h2 className="text-2xl sm:text-4xl font-black mb-4 gradient-text">
          {theme === "dongzhu" ? "🐷 时光视频集" : "🐗 时光视频集"}
        </h2>
        <p
          className="text-base sm:text-lg"
          style={{
            color: theme === "dongzhu" ? "#85929E" : "#BDC3C7",
          }}
        >
          {theme === "dongzhu" ? "怪力的欢乐时光" : "之神的硬核时刻"}
        </p>
      </div>

      <div className="relative">
        {/* 中心线 - 仅桌面端显示 */}
        <div
          className="hidden sm:block absolute left-1/2 top-0 bottom-0 w-1 -ml-0.5 theme-transition"
          style={centerLineStyle}
        />

        {/* 移动端简化时间轴线 */}
        <div
          className="sm:hidden absolute left-4 top-0 bottom-0 w-0.5 rounded-full"
          style={{
            background:
              theme === "dongzhu"
                ? "linear-gradient(to bottom, #5DADE2, #AED6F1)"
                : "linear-gradient(to bottom, #E74C3C, #C0392B)",
            opacity: 0.5,
          }}
        />

        {/* 视频节点 */}
        {videoItems}
      </div>
    </div>
  );
});

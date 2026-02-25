import React, { useMemo } from "react";
import { videos } from "../data";
import type { Video } from "../data";
import VideoCard from "../../../components/video/VideoCard";

interface VideoTimelineProps {
  theme: "dongzhu" | "kaige";
  onVideoClick: (video: Video) => void;
}

// 单个视频项组件 - 使用统一的 VideoCard 组件
const VideoItem: React.FC<{
  video: Video;
  index: number;
  theme: "dongzhu" | "kaige";
  onVideoClick: (video: Video) => void;
}> = React.memo(({ video, index, theme, onVideoClick }) => {
  const isLeft = index % 2 === 0;

  // 缓存主题相关样式，避免重复计算
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
      className={`relative flex items-center mb-16 ${isLeft ? "justify-start" : "justify-end"}`}
    >
      <div
        className="absolute left-1/2 -ml-8 w-16 h-16 rounded-full flex items-center justify-center theme-transition cursor-pointer hover:scale-125 z-10"
        style={nodeStyle}
        onClick={() => onVideoClick(video)}
      >
        <div className="text-3xl">{theme === "dongzhu" ? "🐷" : "🐗"}</div>
      </div>

      <div className={`w-5/12 ${isLeft ? "pr-16" : "pl-16"}`}>
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

// 使用React.memo优化组件，避免不必要的重新渲染
export const VideoTimeline = React.memo(({ theme, onVideoClick }: VideoTimelineProps) => {
  // 使用useMemo缓存主题相关样式
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

  // 使用useMemo缓存视频列表，避免每次渲染都重新处理
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
    <div className="w-full max-w-5xl mx-auto px-6 py-8">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-black mb-4 gradient-text">
          {theme === "dongzhu" ? "🐷 时光视频集" : "🐗 时光视频集"}
        </h2>
        <p
          className="text-lg"
          style={{
            color: theme === "dongzhu" ? "#85929E" : "#BDC3C7",
          }}
        >
          {theme === "dongzhu" ? "怪力的欢乐时光" : "之神的硬核时刻"}
        </p>
      </div>

      <div className="relative">
        <div
          className="absolute left-1/2 top-0 bottom-0 w-1 -ml-0.5 theme-transition"
          style={centerLineStyle}
        />

        {/* 视频节点 */}
        {videoItems}
      </div>
    </div>
  );
});

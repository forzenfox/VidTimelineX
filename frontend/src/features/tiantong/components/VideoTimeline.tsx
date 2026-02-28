import React, { useMemo } from "react";
import { Search } from "lucide-react";
import { videos, type Video } from "../data/data";
import VideoCard from "../../../components/video/VideoCard";

interface VideoTimelineProps {
  theme: "tiger" | "sweet";
  videos?: Video[];
  onVideoClick: (video: Video) => void;
}

/**
 * 单个视频项组件 - 桌面端时光轴布局
 * 移动端使用垂直列表布局
 */
const VideoItem: React.FC<{
  video: Video;
  index: number;
  theme: "tiger" | "sweet";
  onVideoClick: (video: Video) => void;
}> = React.memo(({ video, index, theme, onVideoClick }) => {
  const isLeft = index % 2 === 0;

  const nodeStyle = useMemo(
    () => ({
      background:
        theme === "tiger"
          ? "linear-gradient(135deg, #FFBE28, #FF9500)"
          : "linear-gradient(135deg, #FFC0CB, #FF8CA0)",
      border: theme === "tiger" ? "4px solid #FFFDF9" : "4px solid #FFFDF9",
      boxShadow:
        theme === "tiger" ? "0 0 20px rgba(255, 149, 0, 0.6)" : "0 0 20px rgba(255, 140, 160, 0.6)",
    }),
    [theme]
  );

  return (
    <div
      key={video.id}
      className={`relative mb-8 sm:mb-16 flex items-center ${isLeft ? "sm:justify-start" : "sm:justify-end"} justify-center`}
    >
      {/* 节点图标 - 桌面端显示在中心，移动端隐藏 */}
      <div
        className="hidden sm:flex absolute left-1/2 -ml-8 w-16 h-16 rounded-full items-center justify-center cursor-pointer hover:scale-125 z-10 transition-all duration-300"
        style={nodeStyle}
        onClick={() => onVideoClick(video)}
      >
        <div className="text-3xl">{theme === "tiger" ? "🐯" : "🍦"}</div>
      </div>

      {/* 视频卡片 - 移动端全宽，桌面端固定宽度 */}
      <div className={`w-full max-w-sm sm:w-5/12 ${isLeft ? "sm:pr-16" : "sm:pl-16"} px-4 sm:px-0`}>
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
export const VideoTimeline = React.memo(
  ({ theme, videos: propVideos, onVideoClick }: VideoTimelineProps) => {
    const displayVideos = propVideos || videos;

    const centerLineStyle = useMemo(
      () => ({
        background:
          theme === "tiger"
            ? "linear-gradient(to bottom, #FF9500, #FFBE28)"
            : "linear-gradient(to bottom, #FF8CA0, #FFC0CB)",
        boxShadow:
          theme === "tiger"
            ? "0 0 10px rgba(255, 149, 0, 0.5)"
            : "0 0 10px rgba(255, 140, 160, 0.5)",
      }),
      [theme]
    );

    const videoItems = useMemo(() => {
      return displayVideos.map((video, index) => (
        <VideoItem
          key={video.id}
          video={video}
          index={index}
          theme={theme}
          onVideoClick={onVideoClick}
        />
      ));
    }, [displayVideos, theme, onVideoClick]);

    return (
      <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {/* 时光轴标题 */}
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-4xl font-black mb-4">
            {theme === "tiger" ? "🐯 甜筒时光集" : "🍦 甜筒时光集"}
          </h2>
          <p
            className="text-base sm:text-lg"
            style={{
              color: theme === "tiger" ? "rgb(255, 95, 0)" : "rgb(255, 140, 180)",
            }}
          >
            {theme === "tiger" ? "威虎大将军的精彩时刻" : "软萌小甜筒的欢乐时光"}
          </p>
        </div>

        {/* 无搜索结果提示 */}
        {displayVideos.length === 0 && (
          <div className="text-center py-20">
            <div
              className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6"
              style={{
                background:
                  theme === "tiger" ? "rgba(255, 95, 0, 0.1)" : "rgba(255, 140, 120, 0.1)",
                border:
                  theme === "tiger" ? "2px solid rgb(255, 95, 0)" : "2px solid rgb(255, 140, 120)",
              }}
            >
              <Search
                size={40}
                style={{ color: theme === "tiger" ? "rgb(255, 95, 0)" : "rgb(255, 140, 120)" }}
              />
            </div>
            <h3
              className="text-2xl font-bold mb-2"
              style={{ color: theme === "tiger" ? "rgb(255, 95, 0)" : "rgb(255, 140, 120)" }}
            >
              未找到相关视频
            </h3>
            <p
              className="text-lg"
              style={{ color: theme === "tiger" ? "rgb(255, 140, 140)" : "rgb(120, 100, 100)" }}
            >
              尝试使用其他关键词搜索
            </p>
          </div>
        )}

        {/* 时光轴 */}
        {displayVideos.length > 0 && (
          <div className="relative">
            {/* 中心线 - 仅桌面端显示 */}
            <div
              className="hidden sm:block absolute left-1/2 top-0 bottom-0 w-1 -ml-0.5 transition-all duration-300"
              style={centerLineStyle}
            />

            {/* 视频节点 */}
            {videoItems}
          </div>
        )}
      </div>
    );
  }
);

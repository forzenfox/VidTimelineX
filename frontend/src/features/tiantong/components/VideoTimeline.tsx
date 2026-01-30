import React, { useMemo } from "react";
import { Play, Calendar, Clock, Search } from "lucide-react";
import { videos, type Video } from "../data/data";
import { ImageWithFallback } from "../../../components/figma/ImageWithFallback";

interface VideoTimelineProps {
  theme: "tiger" | "sweet";
  videos?: Video[];
  onVideoClick: (video: Video) => void;
}

// 单个视频项组件
const VideoItem: React.FC<{
  video: Video;
  index: number;
  theme: "tiger" | "sweet";
  onVideoClick: (video: Video) => void;
}> = React.memo(({ video, index, theme, onVideoClick }) => {
  const isLeft = index % 2 === 0;

  // 缓存主题相关样式，避免重复计算
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

  const cardStyle = useMemo(
    () => ({
      background:
        theme === "tiger"
          ? "linear-gradient(135deg, #FFFDF9, #FFF5F0)"
          : "linear-gradient(135deg, #FFF5F8, #FFE6F0)",
      borderRadius: "20px",
      border: theme === "tiger" ? "2px solid #FF9500" : "2px solid #FF8CA0",
      boxShadow:
        theme === "tiger"
          ? "0 8px 24px rgba(255, 149, 0, 0.3)"
          : "0 8px 24px rgba(255, 140, 160, 0.3)",
    }),
    [theme]
  );

  const overlayStyle = useMemo(
    () => ({
      background: theme === "tiger" ? "rgba(255, 149, 0, 0.5)" : "rgba(255, 140, 160, 0.5)",
    }),
    [theme]
  );

  const playButtonStyle = useMemo(
    () => ({
      background: theme === "tiger" ? "rgba(255, 149, 0, 0.8)" : "rgba(255, 140, 160, 0.8)",
    }),
    [theme]
  );

  return (
    <div
      key={video.id}
      className={`relative flex items-center mb-16 ${isLeft ? "justify-start" : "justify-end"}`}
    >
      {/* 节点图标 */}
      <div
        className="absolute left-1/2 -ml-8 w-16 h-16 rounded-full flex items-center justify-center cursor-pointer hover:scale-125 z-10 transition-all duration-300"
        style={nodeStyle}
        onClick={() => onVideoClick(video)}
      >
        <div className="text-3xl">{theme === "tiger" ? "🐯" : "🍦"}</div>
      </div>

      {/* 视频卡片 */}
      <div className={`w-5/12 ${isLeft ? "pr-16" : "pl-16"}`}>
        <div
          className="hover:scale-105 cursor-pointer overflow-hidden transition-all duration-300"
          style={cardStyle}
          onClick={() => onVideoClick(video)}
        >
          {/* 封面图 */}
          <div className="relative aspect-video overflow-hidden">
            <ImageWithFallback
              src={video.cover}
              alt={video.title}
              className="w-full h-full object-cover"
              loading="lazy" // 懒加载图片
            />

            {/* 播放按钮遮罩 */}
            <div
              className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-all duration-300"
              style={overlayStyle}
            >
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center"
                style={playButtonStyle}
              >
                <Play size={32} fill="#fff" color="#fff" />
              </div>
            </div>

            {/* 时长标签 */}
            <div
              className="absolute bottom-2 right-2 px-2 py-1 rounded text-xs font-bold"
              style={{
                background: "rgba(0, 0, 0, 0.8)",
                color: "#fff",
              }}
            >
              {video.duration}
            </div>
          </div>

          {/* 信息区 */}
          <div className="p-4">
            <h3
              className="font-bold text-lg mb-2 line-clamp-2"
              style={{
                color: theme === "tiger" ? "#5D4037" : "#6A1B9A",
              }}
            >
              {video.title}
            </h3>

            <div className="flex flex-wrap items-center gap-3 mb-3 text-sm">
              <div
                className="flex items-center gap-1"
                style={{
                  color: theme === "tiger" ? "#8D6E63" : "#9C27B0",
                }}
              >
                <Calendar size={14} />
                <span>{video.date}</span>
              </div>
              <div
                className="flex items-center gap-1"
                style={{
                  color: theme === "tiger" ? "#8D6E63" : "#9C27B0",
                }}
              >
                <Clock size={14} />
                <span>{video.duration}</span>
              </div>
            </div>

            {/* 标签 */}
            <div className="flex flex-wrap gap-2">
              {video.tags.slice(0, 2).map(tag => (
                <span
                  key={tag}
                  className="px-2 py-1 text-xs font-medium"
                  style={{
                    background:
                      theme === "tiger" ? "rgba(255, 149, 0, 0.2)" : "rgba(255, 140, 160, 0.2)",
                    border: theme === "tiger" ? "1px solid #FF9500" : "1px solid #FF8CA0",
                    borderRadius: "8px",
                    color: theme === "tiger" ? "#5D4037" : "#6A1B9A",
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

// 使用React.memo优化组件，避免不必要的重新渲染
export const VideoTimeline = React.memo(
  ({ theme, videos: propVideos, onVideoClick }: VideoTimelineProps) => {
    // 使用传入的视频列表或默认视频列表
    const displayVideos = propVideos || videos;

    // 使用useMemo缓存主题相关样式
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

    // 使用useMemo缓存视频列表，避免每次渲染都重新处理
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
      <div className="w-full max-w-5xl mx-auto px-6 py-8">
        {/* 时光轴标题 */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-black mb-4">
            {theme === "tiger" ? "🐯 甜筒时光集" : "🍦 甜筒时光集"}
          </h2>
          <p
            className="text-lg"
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
            {/* 中心线 */}
            <div
              className="absolute left-1/2 top-0 bottom-0 w-1 -ml-0.5 transition-all duration-300"
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

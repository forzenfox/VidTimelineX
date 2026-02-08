import React, { useMemo } from "react";
import { Play, Calendar, Clock } from "lucide-react";
import { videos } from "../data";
import type { Video } from "../data";
import { VideoCover } from "../../../components/figma/ImageWithFallback";

interface VideoTimelineProps {
  theme: "dongzhu" | "kaige";
  onVideoClick: (video: Video) => void;
}

// 单个视频项组件 - 封面图优先从B站CDN加载，失败时回退到本地懒加载图片
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

  const cardStyle = useMemo(
    () => ({
      background:
        theme === "dongzhu"
          ? "linear-gradient(135deg, #FFF9E6, #FFFEF7)"
          : "linear-gradient(135deg, #16213E, #1A1A2E)",
      borderRadius: theme === "dongzhu" ? "20px" : "8px",
      border: theme === "dongzhu" ? "2px solid #AED6F1" : "2px solid #E74C3C",
      boxShadow:
        theme === "dongzhu"
          ? "0 8px 24px rgba(93, 173, 226, 0.3)"
          : "0 8px 24px rgba(231, 76, 60, 0.3)",
    }),
    [theme]
  );

  const overlayStyle = useMemo(
    () => ({
      background: theme === "dongzhu" ? "rgba(93, 173, 226, 0.5)" : "rgba(0, 0, 0, 0.7)",
    }),
    [theme]
  );

  const playButtonStyle = useMemo(
    () => ({
      background: theme === "dongzhu" ? "rgba(93, 173, 226, 0.8)" : "rgba(231, 76, 60, 0.9)",
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
        <div
          className="theme-transition hover:scale-105 cursor-pointer overflow-hidden"
          style={cardStyle}
          onClick={() => onVideoClick(video)}
        >
          <div className="relative aspect-video overflow-hidden">
            <VideoCover
              cover_url={video.cover_url}
              cover={video.cover}
              alt={video.title}
              className="w-full h-full object-cover"
              index={index}
            />
            <div
              className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 theme-transition"
              style={overlayStyle}
            >
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center"
                style={playButtonStyle}
              >
                <Play size={32} fill="#fff" color="#fff" />
              </div>
            </div>
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

          <div className="p-4">
            <h3
              className="font-bold text-lg mb-2 line-clamp-2"
              style={{
                color: theme === "dongzhu" ? "#5D6D7E" : "#ECF0F1",
              }}
            >
              {video.title}
            </h3>

            <div className="flex items-center gap-3 mb-3 text-sm">
              <div
                className="flex items-center gap-1"
                style={{
                  color: theme === "dongzhu" ? "#85929E" : "#BDC3C7",
                }}
              >
                <Calendar size={14} />
                <span>{video.date}</span>
              </div>
              <div
                className="flex items-center gap-1"
                style={{
                  color: theme === "dongzhu" ? "#85929E" : "#BDC3C7",
                }}
              >
                <Clock size={14} />
                <span>{video.duration}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {video.tags.slice(0, 2).map(tag => (
                <span
                  key={tag}
                  className="px-2 py-1 text-xs font-medium"
                  style={{
                    background:
                      theme === "dongzhu" ? "rgba(93, 173, 226, 0.2)" : "rgba(231, 76, 60, 0.3)",
                    border: theme === "dongzhu" ? "1px solid #AED6F1" : "1px solid #E74C3C",
                    borderRadius: theme === "dongzhu" ? "8px" : "4px",
                    color: theme === "dongzhu" ? "#5D6D7E" : "#ECF0F1",
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

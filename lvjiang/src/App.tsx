import { useState, useEffect } from "react";
import { LoadingAnimation } from "./components/LoadingAnimation";
import { Header } from "./components/Header";
import { VideoTimeline } from "./components/VideoTimeline";
import { VideoModal } from "./components/VideoModal";
import { HorizontalDanmaku } from "./components/HorizontalDanmaku";
import { SideDanmaku } from "./components/SideDanmaku";
import type { Video } from "./data/videos";

export default function App() {
  const [theme, setTheme] = useState<"dongzhu" | "kaige">(
    "dongzhu",
  );
  const [isLoading, setIsLoading] = useState(true);
  const [showDanmaku, setShowDanmaku] = useState(false);
  const [selectedVideo, setSelectedVideo] =
    useState<Video | null>(null);

  // 设置主题属性
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // 加载完成后显示弹幕
  const handleLoadingComplete = (selectedTheme: "dongzhu" | "kaige") => {
    setTheme(selectedTheme); // 设置用户选择的主题
    setIsLoading(false);
    setShowDanmaku(true);

    // 3秒后隐藏水平弹幕
    setTimeout(() => {
      setShowDanmaku(false);
    }, 10000);
  };

  const handleThemeToggle = () => {
    setTheme((prev) =>
      prev === "dongzhu" ? "kaige" : "dongzhu",
    );
  };

  const handleVideoClick = (video: Video) => {
    setSelectedVideo(video);
  };

  const handleCloseModal = () => {
    setSelectedVideo(null);
  };

  if (isLoading) {
    return (
      <LoadingAnimation
        onComplete={handleLoadingComplete}
      />
    );
  }

  return (
    <div
      className="min-h-screen theme-transition pb-20"
      style={{
        background:
          theme === "dongzhu"
            ? "linear-gradient(to bottom, #FFFEF7, #FFF9E6)"
            : "linear-gradient(to bottom, #1A1A2E, #0F3460)",
      }}
    >
      {/* 水平弹幕 */}
      <HorizontalDanmaku
        theme={theme}
        isVisible={showDanmaku}
      />

      {/* 顶部导航 */}
      <Header theme={theme} onThemeToggle={handleThemeToggle} />

      {/* 主内容区 */}
      <main className="relative">
        {/* 背景装饰 */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-5">
          {theme === "dongzhu" ? (
            // 家猪装饰 - 小猪脚印
            <div className="relative w-full h-full">
              {[...Array(30)].map((_, i) => (
                <div
                  key={i}
                  className="absolute text-4xl"
                  style={{
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                    transform: `rotate(${Math.random() * 360}deg)`,
                    opacity: Math.random() * 0.5,
                    color: "#AED6F1",
                  }}
                >
                  🐾
                </div>
              ))}
            </div>
          ) : (
            // 野猪装饰 - 棱角纹路
            <div className="relative w-full h-full">
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: `
                    repeating-linear-gradient(45deg, transparent, transparent 40px, #E74C3C 40px, #E74C3C 42px),
                    repeating-linear-gradient(-45deg, transparent, transparent 40px, #E74C3C 40px, #E74C3C 42px)
                  `,
                }}
              />
            </div>
          )}
        </div>

        {/* 时光视频集 */}
        <div className="relative z-10">
          <VideoTimeline
            theme={theme}
            onVideoClick={handleVideoClick}
          />
        </div>

        {/* 底部装饰信息 */}
        <div className="max-w-5xl mx-auto px-6 py-12 text-center">
          <div className="flex flex-wrap justify-center gap-6 mb-6">
            {/* 梗徽章 */}
            {theme === "dongzhu" ? (
              <>
                <div
                  className="px-6 py-3 rounded-full font-bold theme-transition"
                  style={{
                    background: "rgba(174, 214, 241, 0.4)",
                    border: "2px solid #AED6F1",
                    color: "#5D6D7E",
                  }}
                >
                  🎯 凯哥我点了
                </div>
                <div
                  className="px-6 py-3 rounded-full font-bold theme-transition"
                  style={{
                    background: "rgba(174, 214, 241, 0.4)",
                    border: "2px solid #AED6F1",
                    color: "#5D6D7E",
                  }}
                >
                  👶 峡谷养爹人
                </div>
                <div
                  className="px-6 py-3 rounded-full font-bold theme-transition"
                  style={{
                    background: "rgba(174, 214, 241, 0.4)",
                    border: "2px solid #AED6F1",
                    color: "#5D6D7E",
                  }}
                >
                  🌿 飞天大草
                </div>
              </>
            ) : (
              <>
                <div
                  className="px-6 py-3 rounded-full font-bold theme-transition"
                  style={{
                    background: "rgba(231, 76, 60, 0.3)",
                    border: "2px solid #E74C3C",
                    color: "#ECF0F1",
                  }}
                >
                  🌱 武汉植物人
                </div>
                <div
                  className="px-6 py-3 rounded-full font-bold theme-transition"
                  style={{
                    background: "rgba(231, 76, 60, 0.3)",
                    border: "2px solid #E74C3C",
                    color: "#ECF0F1",
                  }}
                >
                  🚫 技能全空
                </div>
                <div
                  className="px-6 py-3 rounded-full font-bold theme-transition"
                  style={{
                    background: "rgba(231, 76, 60, 0.3)",
                    border: "2px solid #E74C3C",
                    color: "#ECF0F1",
                  }}
                >
                  👑 之神
                </div>
              </>
            )}
          </div>

          {/* 通用梗 */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <div
              className="px-4 py-2 rounded-full font-medium text-sm"
              style={{
                background: "rgba(255, 215, 0, 0.2)",
                border: "2px solid #FFD700",
                color: "#B8860B",
              }}
            >
              🌉 桥头仪仗队
            </div>
            <div
              className="px-4 py-2 rounded-full font-medium text-sm"
              style={{
                background: "rgba(155, 89, 182, 0.2)",
                border: "2px solid #9B59B6",
                color: "#8E44AD",
              }}
            >
              🎭 电竞相声兄弟
            </div>
          </div>

          {/* 底部文字 */}
          <div
            className="text-sm opacity-70"
            style={{
              color:
                theme === "dongzhu" ? "#85929E" : "#BDC3C7",
            }}
          >
            <p className="mb-2">洞主 & 凯哥 时光视频集</p>
            <p>驴酱公会 · 陪伴是最长情的告白</p>
          </div>
        </div>
      </main>

      {/* 右侧弹幕墙 */}
      <SideDanmaku theme={theme} />

      {/* 视频弹窗 */}
      <VideoModal
        video={selectedVideo}
        theme={theme}
        onClose={handleCloseModal}
      />
    </div>
  );
}
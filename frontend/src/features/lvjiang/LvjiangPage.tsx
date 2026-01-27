import React, { useState, useCallback, useEffect, useMemo } from "react";
import { LoadingAnimation } from "./components/LoadingAnimation";
import { Header } from "./components/Header";
import { VideoTimeline } from "./components/VideoTimeline";
import { VideoModal } from "./components/VideoModal";
import { HorizontalDanmaku } from "./components/HorizontalDanmaku";
import { SideDanmaku } from "./components/SideDanmaku";
import type { Video } from "./data";
import "./styles/index.css";

// 生成随机装饰位置（仅执行一次）
const generateFootprintDecorations = (() => {
  const decorations: Array<{
    id: number;
    top: number;
    left: number;
    rotation: number;
    opacity: number;
  }> = [];
  for (let i = 0; i < 30; i++) {
    decorations.push({
      id: i,
      top: Math.random() * 100,
      left: Math.random() * 100,
      rotation: Math.random() * 360,
      opacity: Math.random() * 0.5,
    });
  }
  return decorations;
})();

const Lvjiang = () => {
  const [theme, setTheme] = useState<"dongzhu" | "kaige">("dongzhu");
  const [isLoading, setIsLoading] = useState(true);
  const [showDanmaku, setShowDanmaku] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const handleLoadingComplete = useCallback((selectedTheme: "dongzhu" | "kaige") => {
    setTheme(selectedTheme);
    setIsLoading(false);
    setShowDanmaku(true);
  }, []);

  const handleThemeToggle = useCallback(() => {
    setTheme(prev => (prev === "dongzhu" ? "kaige" : "dongzhu"));
  }, []);

  const handleVideoClick = useCallback((video: Video) => {
    setSelectedVideo(video);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedVideo(null);
  }, []);

  if (isLoading) {
    return <LoadingAnimation onComplete={handleLoadingComplete} />;
  }

  return (
    <>
      <title>洞主凯哥·时光视频集</title>
      <meta name="description" content="探索洞主凯哥的精彩视频内容，包含直播片段、精彩集锦等" />
      <meta name="keywords" content="洞主, 凯哥, 驴酱, 时光视频集, 直播片段, 精彩集锦" />
      <div
        className="min-h-screen theme-transition pb-20"
        style={{
          background:
            theme === "dongzhu"
              ? "linear-gradient(to bottom, #FFFEF7, #FFF9E6)"
              : "linear-gradient(to bottom, #1A1A2E, #0F3460)",
        }}
      >
        <HorizontalDanmaku theme={theme} isVisible={showDanmaku} />

        <Header theme={theme} onThemeToggle={handleThemeToggle} />

        <main className="relative">
          <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-5">
            {theme === "dongzhu" ? (
              <div className="relative w-full h-full">
                {generateFootprintDecorations.map(decoration => (
                  <div
                    key={decoration.id}
                    className="absolute text-4xl"
                    style={{
                      top: `${decoration.top}%`,
                      left: `${decoration.left}%`,
                      transform: `rotate(${decoration.rotation}deg)`,
                      opacity: decoration.opacity,
                      color: "#AED6F1",
                    }}
                  >
                    🐾
                  </div>
                ))}
              </div>
            ) : (
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

          <div className="relative z-10">
            <VideoTimeline theme={theme} onVideoClick={handleVideoClick} />
          </div>

          <div className="max-w-5xl mx-auto px-6 py-12 text-center">
            <div className="flex flex-wrap justify-center gap-6 mb-6">
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
                    🌱 湖北植物人
                  </div>
                  <div
                    className="px-6 py-3 rounded-full font-bold theme-transition"
                    style={{
                      background: "rgba(231, 76, 60, 0.3)",
                      border: "2px solid #E74C3C",
                      color: "#ECF0F1",
                    }}
                  >
                    🧔🏻‍♂️ 流浪汉
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

            <div
              className="text-sm opacity-70"
              style={{
                color: theme === "dongzhu" ? "#85929E" : "#BDC3C7",
              }}
            >
              <p className="mb-2">洞主 & 凯哥 时光视频集</p>
              <p>驴酱公会 · 陪伴是最长情的告白</p>
            </div>
          </div>
        </main>

        <SideDanmaku theme={theme} />

        <VideoModal video={selectedVideo} theme={theme} onClose={handleCloseModal} />
      </div>
    </>
  );
};

export default Lvjiang;

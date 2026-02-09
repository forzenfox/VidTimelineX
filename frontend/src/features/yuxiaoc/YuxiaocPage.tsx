import React, { useState, useCallback } from "react";
import type { Theme, Video } from "./data/types";
import {
  LoadingAnimation,
  Header,
  HeroSection,
  TitleHall,
  CanteenHall,
  CVoiceArchive,
  DanmakuTower,
  VideoModal,
} from "./components";
import "./styles/yuxiaoc.css";

const YuxiaocPage = () => {
  const [theme, setTheme] = useState<Theme>("blood");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

  const handleLoadingComplete = useCallback((selectedTheme: Theme) => {
    setTheme(selectedTheme);
    setIsLoading(false);
  }, []);

  const handleThemeToggle = useCallback(() => {
    setTheme(prev => (prev === "blood" ? "mix" : "blood"));
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
      <title>C皇驾到 · 余小C粉丝站</title>
      <meta name="description" content="C皇驾到 - 余小C专属粉丝站，混与躺轮回不止" />
      <meta name="keywords" content="余小C, C皇, 斗鱼, 英雄联盟, 诺手, 混躺" />

      {/* CRT Scanline Overlay */}
      <div className="crt-overlay" />

      <div
        className="min-h-screen"
        style={{
          background: "#0F0F23",
        }}
      >
        <Header theme={theme} onThemeToggle={handleThemeToggle} />

        <main>
          <HeroSection theme={theme} />
          <TitleHall theme={theme} />
          <CanteenHall theme={theme} onVideoClick={handleVideoClick} />
          <CVoiceArchive theme={theme} />
          <DanmakuTower theme={theme} />
        </main>

        {/* Footer */}
        <footer
          className="py-8 text-center relative"
          style={{
            background: "linear-gradient(180deg, #0F0F23 0%, #1E1B4B 100%)",
            borderTop: `1px solid ${theme === "blood" ? "rgba(225, 29, 72, 0.3)" : "rgba(245, 158, 11, 0.3)"}`,
          }}
        >
          {/* Decorative line */}
          <div
            className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-0.5"
            style={{
              background:
                theme === "blood"
                  ? "linear-gradient(90deg, transparent, #E11D48, transparent)"
                  : "linear-gradient(90deg, transparent, #F59E0B, transparent)",
            }}
          />

          <p
            className="text-gray-400 mb-2 font-bold"
            style={{
              fontFamily: "Russo One, sans-serif",
            }}
          >
            C皇驾到 · 混与躺轮回不止
          </p>
          <p className="text-sm text-gray-500">本站点为粉丝自制，仅供娱乐</p>

          {/* Live indicator */}
          <div className="flex items-center justify-center gap-2 mt-4">
            <span
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ backgroundColor: theme === "blood" ? "#E11D48" : "#F59E0B" }}
            />
            <span className="text-xs text-gray-500">斗鱼直播间 123456</span>
          </div>
        </footer>

        <VideoModal video={selectedVideo} theme={theme} onClose={handleCloseModal} />
      </div>
    </>
  );
};

export default YuxiaocPage;

import React, { useState, useCallback, useEffect, useMemo } from "react";
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
  HorizontalDanmaku,
} from "./components";
import "./styles/yuxiaoc.css";

const YuxiaocPage = () => {
  const [theme, setTheme] = useState<Theme>("blood");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [showHorizontalDanmaku, setShowHorizontalDanmaku] = useState(false);

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

  // 页面加载完成后显示水平飘屏弹幕
  useEffect(() => {
    if (!isLoading) {
      // 延迟显示弹幕，等待页面完全渲染
      const timer = setTimeout(() => {
        setShowHorizontalDanmaku(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  // 根据主题设置body的data-theme属性
  useEffect(() => {
    document.body.setAttribute("data-theme", theme);

    // 清理函数
    return () => {
      document.body.removeAttribute("data-theme");
    };
  }, [theme]);

  // 主题配色方案 - 双主题系统
  const themeColors = useMemo(() => {
    if (theme === "blood") {
      return {
        // 血怒模式 - 深色主题
        background: "#0F0F23",
        backgroundGradient: "linear-gradient(180deg, #0F0F23 0%, #1E1B4B 100%)",
        textPrimary: "#E2E8F0",
        textSecondary: "#94A3B8",
        accent: "#E11D48",
        accentSecondary: "#F59E0B",
        border: "rgba(225, 29, 72, 0.3)",
        decorativeLine: "#E11D48",
      };
    } else {
      return {
        // 混躺模式 - 亮色主题
        background: "#F8FAFC",
        backgroundGradient: "linear-gradient(180deg, #F8FAFC 0%, #F1F5F9 100%)",
        textPrimary: "#0F172A",
        textSecondary: "#334155",
        accent: "#D97706",
        accentSecondary: "#2563EB",
        border: "rgba(226, 232, 240, 0.8)",
        decorativeLine: "#D97706",
      };
    }
  }, [theme]);

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

      {/* 水平飘屏弹幕 */}
      <HorizontalDanmaku theme={theme} isVisible={showHorizontalDanmaku} />

      {/* 主容器 - 使用单一布局 */}
      <div
        className="min-h-screen"
        style={{
          background: themeColors.background,
        }}
      >
        {/* 主内容区域 - 使用CSS媒体查询控制padding */}
        <div 
          className="main-content"
          style={{
            // 默认移动端无padding
            paddingRight: "0",
          }}
        >
          <Header theme={theme} onThemeToggle={handleThemeToggle} />

          <main>
            <HeroSection theme={theme} />
            <TitleHall theme={theme} />
            <CanteenHall theme={theme} onVideoClick={handleVideoClick} />
            <CVoiceArchive theme={theme} />
          </main>

          {/* Footer */}
          <footer
            className="py-8 text-center relative"
            style={{
              background: themeColors.backgroundGradient,
              borderTop: `1px solid ${themeColors.border}`,
            }}
          >
            {/* Decorative line */}
            <div
              className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-0.5"
              style={{
                background: `linear-gradient(90deg, transparent, ${themeColors.decorativeLine}, transparent)`,
              }}
            />

            <p
              className="mb-2 font-bold"
              style={{
                fontFamily: "Russo One, sans-serif",
                color: themeColors.textPrimary,
              }}
            >
              C皇驾到 · 混与躺轮回不止
            </p>
            <p className="text-sm" style={{ color: themeColors.textSecondary }}>
              本站点为粉丝自制，仅供娱乐
            </p>

            {/* Live indicator */}
            <div className="flex items-center justify-center gap-2 mt-4">
              <span
                className="w-2 h-2 rounded-full animate-pulse"
                style={{ backgroundColor: themeColors.accentSecondary }}
              />
              <span className="text-xs" style={{ color: themeColors.textSecondary }}>
                斗鱼直播间 1126960
              </span>
            </div>
          </footer>
        </div>

        {/* 右侧固定弹幕侧边栏 - 桌面端和平板端显示 */}
        <DanmakuTower theme={theme} />

        <VideoModal video={selectedVideo} theme={theme} onClose={handleCloseModal} />
      </div>

      {/* 使用style标签添加响应式样式 */}
      <style>{`
        /* 平板端和桌面端：为弹幕侧边栏留出空间 */
        @media (min-width: 768px) {
          .main-content {
            padding-right: 320px !important;
          }
        }
      `}</style>
    </>
  );
};

export default YuxiaocPage;

import React, { useState, useCallback, useEffect, useMemo, useRef } from "react";
import { LoadingAnimation } from "./components/LoadingAnimation";
import { Header } from "./components/Header";
import { VideoTimeline } from "./components/VideoTimeline";
import { HorizontalDanmaku } from "./components/HorizontalDanmaku";
import { SideDanmaku } from "./components/SideDanmaku";
import VideoModal from "../../components/video/VideoModal";
import { videos } from "./data";
import type { Video } from "./data";
import { useViewPreferences } from "@/hooks/useViewPreferences";
import { useVideoFilter } from "@/hooks/useVideoFilter";
import type { Video as VideoType } from "@/components/video/types";
import VideoGrid from "@/components/video-view/VideoGrid";
import VideoList from "@/components/video-view/VideoList";
import { IconToolbar } from "@/components/video-view/IconToolbar";
import { VideoViewToolbar } from "@/components/video-view/VideoViewToolbar";
import EmptyState from "@/components/video-view/EmptyState";
import "./styles/index.css";

const convertToVideoType = (video: Video): VideoType => ({
  ...video,
  views: 0,
});

// 生成随机装饰位置（仅执行一次）
const generateFootprintDecorations = (() => {
  const decorations: Array<{
    id: number;
    top: number;
    left: number;
    rotation: number;
    opacity: number;
  }> = [];

  // 基于视频数量动态计算图标数量
  const baseCount = 30; // 基础图标数量
  const perVideoCount = 3; // 每增加一个视频增加的图标数量
  const minCount = 30; // 最小图标数量
  const maxCount = 300; // 最大图标数量

  // 计算总图标数量
  const totalCount = Math.max(
    minCount,
    Math.min(maxCount, baseCount + videos.length * perVideoCount)
  );

  for (let i = 0; i < totalCount; i++) {
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
  const [selectedVideo, setSelectedVideo] = useState<VideoType | null>(null);

  // 搜索相关状态
  const [searchQuery, setSearchQuery] = useState("");
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const timeoutIdRef = useRef<number | null>(null);

  const { viewMode, setViewMode } = useViewPreferences();

  // 根据搜索词过滤视频
  const filteredBySearch = useMemo(() => {
    if (!searchQuery.trim()) {
      return videos;
    }

    const query = searchQuery.toLowerCase().trim();

    return videos
      .map(video => {
        let score = 0;

        if (video.title.toLowerCase().includes(query)) {
          score += 10;
          if (video.title.toLowerCase() === query) {
            score += 10;
          }
        }

        if (video.tags && video.tags.some(tag => tag.toLowerCase().includes(query))) {
          score += 5;
        }

        return { video, score };
      })
      .filter(({ score }) => score > 0)
      .sort((a, b) => b.score - a.score)
      .map(({ video }) => video);
  }, [searchQuery]);

  const { filter, setFilter, resetFilter, filteredVideos } = useVideoFilter<VideoType>(
    searchQuery ? filteredBySearch.map(convertToVideoType) : (videos as unknown as VideoType[])
  );

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

  const handleVideoClick = useCallback((video: VideoType) => {
    setSelectedVideo(video);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedVideo(null);
  }, []);

  // 搜索处理函数
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      setSearchHistory(prev => {
        const newHistory = [query.trim(), ...prev.filter(item => item !== query.trim())].slice(
          0,
          5
        );
        return newHistory;
      });
    }
  }, []);

  // 防抖搜索建议
  const debouncedSearch = useCallback((query: string) => {
    if (timeoutIdRef.current) {
      clearTimeout(timeoutIdRef.current);
    }
    timeoutIdRef.current = window.setTimeout(() => {
      if (query.trim()) {
        const videoTitles = videos.map(video => video.title);
        const filteredSuggestions = videoTitles
          .filter(title => title.toLowerCase().includes(query.toLowerCase()))
          .slice(0, 5);
        setSuggestions(filteredSuggestions);
      } else {
        setSuggestions([]);
      }
    }, 300);
  }, []);

  // 处理搜索输入变化
  const handleSearchChange = useCallback(
    (query: string) => {
      setSearchQuery(query);
      debouncedSearch(query);
    },
    [debouncedSearch]
  );

  // 清除搜索
  const handleClearSearch = useCallback(() => {
    setSearchQuery("");
    setSuggestions([]);
  }, []);

  // 清除搜索历史
  const clearSearchHistory = useCallback(() => {
    setSearchHistory([]);
  }, []);

  // 清理定时器
  useEffect(() => {
    return () => {
      if (timeoutIdRef.current) {
        clearTimeout(timeoutIdRef.current);
      }
    };
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

        <main className="relative main-content" style={{ paddingRight: "0" }}>
          <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
            {theme === "dongzhu" ? (
              <div className="relative w-full h-full">
                {generateFootprintDecorations.map(decoration => (
                  <div
                    key={decoration.id}
                    className="absolute text-6xl"
                    style={{
                      top: `${decoration.top}%`,
                      left: `${decoration.left}%`,
                      transform: `rotate(${decoration.rotation}deg)`,
                      opacity: Math.min(0.8, decoration.opacity * 1.5),
                      color: "#3498DB",
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
            <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-6 md:pt-8 main-content-inner">
              {/* 移动端显示 IconToolbar（纯图标） */}
              <div className="sm:hidden">
                <IconToolbar
                  viewMode={viewMode}
                  onViewModeChange={setViewMode}
                  filter={filter}
                  onFilterChange={setFilter}
                  onSearch={handleSearch}
                  theme={theme}
                  searchSuggestions={suggestions}
                  searchHistory={searchHistory}
                  onClearHistory={clearSearchHistory}
                  searchQuery={searchQuery}
                  onClearSearch={handleClearSearch}
                />
              </div>

              {/* PC端显示 VideoViewToolbar（图标+文字） */}
              <div className="hidden sm:block">
                <VideoViewToolbar
                  viewMode={viewMode}
                  onViewModeChange={setViewMode}
                  filter={filter}
                  onFilterChange={setFilter}
                  theme={theme}
                  onSearch={handleSearch}
                  searchQuery={searchQuery}
                  searchSuggestions={suggestions}
                  searchHistory={searchHistory}
                  onClearHistory={clearSearchHistory}
                  onClearSearch={handleClearSearch}
                />
              </div>
              {filteredVideos.length === 0 ? (
                <EmptyState onClearFilter={resetFilter} />
              ) : viewMode === "timeline" ? (
                <VideoTimeline
                  theme={theme}
                  onVideoClick={video => handleVideoClick(convertToVideoType(video))}
                />
              ) : viewMode === "grid" ? (
                <VideoGrid videos={filteredVideos} onVideoClick={handleVideoClick} theme={theme} />
              ) : (
                <VideoList videos={filteredVideos} onVideoClick={handleVideoClick} theme={theme} />
              )}
            </div>
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

        {/* 响应式样式：为弹幕侧边栏预留空间 */}
        <style>{`
          /* 桌面端（>=1024px）：为主内容区添加padding-right避让侧边栏 */
          @media (min-width: 1024px) {
            .main-content {
              padding-right: 320px !important;
            }
          }
          
          /* 移动端（<1024px）：移除padding */
          @media (max-width: 1023px) {
            .main-content {
              padding-right: 0 !important;
            }
          }
        `}</style>
      </div>
    </>
  );
};

export default Lvjiang;

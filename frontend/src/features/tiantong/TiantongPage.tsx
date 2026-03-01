import React, { useState, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { videos, Video } from "./data";
import ThemeToggle from "./components/ThemeToggle";
import { VideoTimeline } from "./components/VideoTimeline";
import { HorizontalDanmaku } from "./components/HorizontalDanmaku";
import { withDeviceSpecificComponent } from "@/hooks/use-dynamic-component";
import VideoModal from "@/components/business/video/VideoModal";
import { useViewPreferences } from "@/hooks/useViewPreferences";
import { useVideoFilter } from "@/hooks/useVideoFilter";
import type { Video as VideoType } from "@/components/business/video/types";
import VideoGrid from "@/components/business/video-view/VideoGrid";
import VideoList from "@/components/business/video-view/VideoList";
import { IconToolbar } from "@/components/business/video-view/IconToolbar";
import { VideoViewToolbar } from "@/components/business/video-view/VideoViewToolbar";
import EmptyState from "@/components/business/video-view/EmptyState";

/**
 * 将Video类型转换为VideoType类型
 * @param video - 原始Video对象
 * @returns 转换后的VideoType对象
 */
const convertToVideoType = (video: Video): VideoType => ({
  ...video,
  views: typeof video.views === "string" ? parseInt(video.views, 10) || 0 : video.views,
});

/**
 * 将VideoType类型转换回Video类型
 * @param video - VideoType对象
 * @returns 转换后的Video对象
 */
const convertFromVideoType = (video: VideoType): Video => ({
  ...video,
  views: String(video.views || 0),
});

// 导入甜筒模块样式
import "./styles/tiantong.css";

const DesktopSidebarDanmu = React.lazy(() => import("./components/SidebarDanmu"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 2,
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: 1,
    },
  },
});

const ResponsiveSidebarDanmu = withDeviceSpecificComponent({
  tablet: (props: { theme: "tiger" | "sweet" }) => (
    <Suspense
      fallback={<div className="bg-card rounded-xl border border-border h-64 animate-pulse"></div>}
    >
      <DesktopSidebarDanmu {...props} />
    </Suspense>
  ),
  desktop: (props: { theme: "tiger" | "sweet" }) => (
    <Suspense
      fallback={<div className="bg-card rounded-xl border border-border h-64 animate-pulse"></div>}
    >
      <DesktopSidebarDanmu {...props} />
    </Suspense>
  ),
});

/**
 * 亿口甜筒主页面组件
 * 实现移动端适配：
 * - 桌面端（>=1024px）：显示固定侧边栏，主内容区padding-right: 320px
 * - 移动端（<1024px）：隐藏侧边栏，使用SidebarDanmu的浮动按钮
 */
const TiantongPage = () => {
  const [theme, setTheme] = useState<"tiger" | "sweet">("tiger");
  const [danmakuKey, setDanmakuKey] = useState(0);
  const [selectedVideo, setSelectedVideo] = useState<VideoType | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [headerBgOpacity, setHeaderBgOpacity] = useState(0.9);
  const headerRef = React.useRef<HTMLElement>(null);

  // 优化搜索算法，考虑标题和标签，实现搜索结果排序
  const filteredBySearch = React.useMemo(() => {
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

  // 将搜索结果转换为 VideoType 类型
  const filteredBySearchWithType = React.useMemo(() => {
    return filteredBySearch.map(convertToVideoType);
  }, [filteredBySearch]);

  const { viewMode, setViewMode } = useViewPreferences();
  const {
    filter,
    setFilter,
    resetFilter,
    filteredVideos: filteredByFilter,
  } = useVideoFilter<VideoType>(
    searchQuery ? filteredBySearchWithType : videos.map(convertToVideoType)
  );

  React.useEffect(() => {
    // 初始化主题data属性
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  React.useEffect(() => {
    /**
     * 处理滚动事件，动态调整Header背景透明度
     */
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const opacity = Math.min(1, 0.9 + scrollY / 500);
      setHeaderBgOpacity(opacity);

      if (headerRef.current) {
        if (scrollY > 30) {
          headerRef.current.classList.add("shadow-md");
          headerRef.current.classList.remove("shadow-sm");
          headerRef.current.classList.add("py-2");
          headerRef.current.classList.remove("py-3");
        } else {
          headerRef.current.classList.add("shadow-sm");
          headerRef.current.classList.remove("shadow-md");
          headerRef.current.classList.remove("py-2");
          headerRef.current.classList.add("py-3");
        }
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /**
   * 切换主题
   * @param newTheme - 新主题类型
   */
  const toggleTheme = React.useCallback((newTheme: "tiger" | "sweet") => {
    setTheme(newTheme);
    setDanmakuKey(prev => prev + 1); // 强制重新渲染弹幕组件
    document.documentElement.setAttribute("data-theme", newTheme);
  }, []);

  // 包装后的主题切换函数，用于UI事件
  const handleToggleTheme = () => {
    const nextTheme = theme === "tiger" ? "sweet" : "tiger";
    toggleTheme(nextTheme);
  };

  // 使用useRef存储timeoutId，避免违反不可变性规则
  const timeoutIdRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  /**
   * 防抖搜索函数
   * @param query - 搜索关键词
   */
  const debouncedSearch = React.useCallback((query: string) => {
    if (timeoutIdRef.current) {
      clearTimeout(timeoutIdRef.current);
    }
    timeoutIdRef.current = setTimeout(() => {
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

  /**
   * 处理搜索
   * @param query - 搜索关键词
   */
  const handleSearch = React.useCallback((query: string) => {
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

  /**
   * 清除搜索
   */
  const handleClearSearch = React.useCallback(() => {
    setSearchQuery("");
    setSuggestions([]);
  }, []);

  /**
   * 清除搜索历史
   */
  const clearSearchHistory = React.useCallback(() => {
    setSearchHistory([]);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <>
        <title>亿口甜筒·时光视频集</title>
        <meta name="description" content="探索亿口甜筒的精彩视频内容，包含直播片段、精彩集锦等" />
        <meta name="keywords" content="亿口甜筒, 时光视频集, 直播片段, 精彩集锦" />
        <Suspense
          fallback={<div className="flex items-center justify-center min-h-screen">加载中...</div>}
        >
          <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/30 tiger-stripe relative overflow-hidden">
            {/* 页面边角装饰图标 */}
            <div className="absolute top-40 left-4 text-primary opacity-30 text-4xl pointer-events-none">
              {theme === "tiger" ? "🐯" : "🍦"}
            </div>
            <div className="absolute top-40 right-4 text-primary opacity-30 text-4xl pointer-events-none">
              {theme === "tiger" ? "🐯" : "🍦"}
            </div>
            <div className="absolute bottom-4 left-4 text-primary opacity-30 text-4xl pointer-events-none">
              {theme === "tiger" ? "🐯" : "🍦"}
            </div>
            <div className="absolute bottom-4 right-4 text-primary opacity-30 text-4xl pointer-events-none">
              {theme === "tiger" ? "🐯" : "🍦"}
            </div>

            <HorizontalDanmaku key={danmakuKey} theme={theme} />

            <header
              className="fixed top-0 left-0 right-0 z-40 w-full bg-card/90 backdrop-blur-md border-b border-border shadow-sm transition-all duration-300 ease-in-out"
              role="banner"
              id="main-header"
              ref={headerRef}
              style={{ backgroundColor: `rgba(var(--card-rgb), ${headerBgOpacity})` }}
            >
              <div className="w-full">
                <div className="max-w-[1440px] lg:max-w-[1600px] mx-auto px-6">
                  <div className="py-3 sm:py-4 flex justify-between items-center">
                    <div className="flex items-center gap-3 sm:gap-4 lg:gap-5 flex-shrink-0">
                      <div
                        className={`relative flex-shrink-0 group w-16 sm:w-18 md:w-20 h-16 sm:h-18 md:h-20 rounded-full border-3 sm:border-3 md:border-4 overflow-hidden shadow-custom transition-all duration-300 hover:scale-105 hover:shadow-lg ${theme === "tiger" ? "border-[rgb(255,110,20)]" : "border-[rgb(255,120,160)]"}`}
                      >
                        <img
                          src="https://apic.douyucdn.cn/upload/avatar_v3/202601/97d28343b9b742cb82ddaea5b3a22c4c_middle.jpg"
                          onError={e => {
                            (e.target as HTMLImageElement).src =
                              "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=128&q=80";
                          }}
                          alt="亿口甜筒"
                          loading="lazy"
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          aria-label="亿口甜筒"
                        />
                        <div
                          className="absolute bottom-1 right-1 bg-primary text-primary-foreground text-[10px] sm:text-[11px] px-2.5 py-0.5 rounded-full font-bold shadow-md transition-all duration-300 hover:scale-105 hover:shadow-lg animate-pulse z-50"
                          aria-label="直播中"
                        >
                          LIVE
                        </div>
                      </div>

                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-black tracking-tight">
                            亿口甜筒
                          </h1>
                          <span
                            className={`inline-flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-bold shadow-sm border transition-all duration-300 ${
                              theme === "tiger"
                                ? "bg-gradient-to-r from-[rgb(255,110,20)] to-[rgb(255,190,40)] text-white border-transparent"
                                : "bg-gradient-to-r from-[rgb(255,140,180)] to-[rgb(255,192,203)] text-white border-transparent"
                            }`}
                          >
                            {theme === "tiger" ? "🐯 威虎大将军" : "🍦 软萌小甜筒"}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 sm:gap-3 text-[11px] sm:text-xs text-muted-foreground">
                          <a
                            href="https://www.douyu.com/12195609"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 hover:text-primary transition-colors"
                          >
                            <span className="font-mono font-bold">12195609</span>
                          </a>

                          <span
                            className="w-1 h-1 bg-border rounded-full"
                            aria-hidden="true"
                          ></span>

                          <a
                            href="https://yuba.douyu.com/discussion/11242628/posts"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 hover:text-primary transition-colors"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="12"
                              height="12"
                              className="sm:w-3.25 sm:h-3.25"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              aria-hidden="true"
                            >
                              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                            </svg>
                            <span>鱼吧</span>
                          </a>
                        </div>
                      </div>
                    </div>

                    {/* Header 右侧：仅保留主题切换 */}
                    <div className="flex items-center flex-shrink-0">
                      <ThemeToggle currentTheme={theme} onToggle={handleToggleTheme} />
                    </div>
                  </div>
                </div>
              </div>
            </header>

            {/* 主内容区域 - 使用CSS媒体查询控制padding */}
            <main
              className="main-content max-w-[1440px] lg:max-w-[1600px] mx-auto px-6 py-8 flex flex-col gap-8 pt-40"
              role="main"
              style={{
                // 默认移动端无padding
                paddingRight: "24px",
              }}
            >
              <section className="flex-1 w-full min-w-0" aria-labelledby="timeline-title">
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
                {filteredByFilter.length === 0 ? (
                  <EmptyState onClearFilter={resetFilter} />
                ) : viewMode === "timeline" ? (
                  <VideoTimeline
                    theme={theme}
                    videos={filteredByFilter.map(convertFromVideoType)}
                    onVideoClick={video => {
                      console.log("Video click passed to TiantongPage:", video.title);
                      setSelectedVideo(convertToVideoType(video));
                    }}
                  />
                ) : viewMode === "grid" ? (
                  <VideoGrid
                    videos={filteredByFilter}
                    onVideoClick={video => {
                      console.log("Video click passed to TiantongPage:", video.title);
                      setSelectedVideo(video);
                    }}
                    theme={theme}
                  />
                ) : (
                  <VideoList
                    videos={filteredByFilter}
                    onVideoClick={video => {
                      console.log("Video click passed to TiantongPage:", video.title);
                      setSelectedVideo(video);
                    }}
                    theme={theme}
                  />
                )}
              </section>

              {/* 桌面端侧边栏 - 使用CSS媒体查询控制显示 */}
              <aside
                className="tiantong-sidebar w-full md:w-80 lg:w-96 shrink-0"
                role="complementary"
                aria-label="互动区域"
              >
                <ResponsiveSidebarDanmu theme={theme} />
              </aside>
            </main>

            <footer
              className="border-t border-border mt-12 bg-card py-8 text-center text-sm text-muted-foreground"
              role="contentinfo"
            >
              <p>{`© 2026 亿口甜筒 · 亿口时光 | ${theme === "tiger" ? "虎将的高能切片站" : "甜筒的粉丝快乐窝"}`}</p>
              <p className="mt-2 flex items-center justify-center gap-2">
                Designed with{" "}
                {theme === "tiger" ? (
                  <span className="text-2xl" aria-hidden="true">
                    🐯
                  </span>
                ) : (
                  <span className="text-2xl" aria-hidden="true">
                    🍦
                  </span>
                )}
                for HXZ | All rights reserved.
              </p>
            </footer>

            {selectedVideo && (
              <VideoModal
                video={selectedVideo}
                onClose={() => setSelectedVideo(null)}
                theme={theme}
              />
            )}
          </div>
        </Suspense>

        {/* 响应式样式 - 控制主内容区padding和侧边栏显示 */}
        <style>{`
          /* 平板端和桌面端（>=1024px）：为弹幕侧边栏留出空间 */
          @media (min-width: 1024px) {
            .main-content {
              padding-right: 344px !important; /* 320px + 24px padding */
            }
          }
          
          /* 移动端（<1024px）：恢复正常padding */
          @media (max-width: 1023px) {
            .main-content {
              padding-right: 24px !important;
            }
          }
          
          /* 移动端（<768px）：隐藏侧边栏区域 */
          @media (max-width: 767px) {
            .tiantong-sidebar {
              display: none !important;
            }
          }
        `}</style>
      </>
    </QueryClientProvider>
  );
};

export default TiantongPage;

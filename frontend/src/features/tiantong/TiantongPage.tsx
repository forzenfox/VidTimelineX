import React, { useState, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Github, ExternalLink, Search, Heart } from "lucide-react";
import { videos, Video } from "./data";
import ThemeToggle from "./components/ThemeToggle";
import { VideoTimeline } from "./components/VideoTimeline";
import DanmakuWelcome from "./components/DanmakuWelcome";
import { withDeviceSpecificComponent } from "@/hooks/use-dynamic-component";
import "./styles/index.css";

const VideoModal = React.lazy(() => import("./components/VideoModal"));
const DesktopSidebarDanmu = React.lazy(() => import("./components/SidebarDanmu"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      cacheTime: 30 * 60 * 1000,
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

const TiantongPage = () => {
  const [theme, setTheme] = useState<"tiger" | "sweet">("tiger");
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [headerBgOpacity, setHeaderBgOpacity] = useState(0.9);
  const headerRef = React.useRef<HTMLElement>(null);

  React.useEffect(() => {
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

  const danmakuMessages = [
    "霸总虎来巡山了！🦁️",
    "甜筒今天有点甜🍦",
    "224大军前来报到！",
    "这是什么绝世反差萌啊awsl",
    "主播房间号 12195609 关注不迷路",
    "瑞哥哥大气！",
    "为了甜筒，冲鸭！",
    "狮子座的光芒无法掩盖✨",
    "今天也是元气满满的一天",
    "这个wink我承包了😉",
    "哈哈哈笑死我了",
    "亿口甜筒，入股不亏",
    "好听好听耳朵怀孕了🎵",
    "这波操作666",
    "守护最好的甜筒",
  ];

  const danmakuColors =
    theme === "tiger"
      ? [
          "rgb(255, 95, 0)",
          "rgb(255, 190, 40)",
          "rgb(255, 215, 0)",
          "rgb(255, 165, 0)",
          "rgb(255, 140, 0)",
        ]
      : [
          "rgb(255, 140, 180)",
          "rgb(255, 192, 203)",
          "rgb(255, 105, 180)",
          "rgb(255, 127, 80)",
          "rgb(255, 20, 147)",
        ];

  const toggleTheme = React.useCallback(() => {
    const newTheme = theme === "tiger" ? "sweet" : "tiger";
    setTheme(newTheme);
    if (newTheme === "sweet") {
      document.documentElement.classList.add("theme-sweet");
    } else {
      document.documentElement.classList.remove("theme-sweet");
    }
  }, [theme]);

  const handleSearch = React.useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (searchQuery.trim()) {
        setSearchHistory(prev => {
          const newHistory = [
            searchQuery.trim(),
            ...prev.filter(item => item !== searchQuery.trim()),
          ].slice(0, 5);
          return newHistory;
        });
        setShowSuggestions(false);
      }
    },
    [searchQuery]
  );

  const handleSearchChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);

    if (value.trim()) {
      const videoTitles = videos.map(video => video.title);
      const filteredSuggestions = videoTitles
        .filter(title => title.toLowerCase().includes(value.toLowerCase()))
        .slice(0, 5);
      setSuggestions(filteredSuggestions);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  }, []);

  const selectSuggestion = React.useCallback((suggestion: string) => {
    setSearchQuery(suggestion);
    setShowSuggestions(false);
  }, []);

  const clearSearchHistory = React.useCallback(() => {
    setSearchHistory([]);
  }, []);

  const selectFromHistory = React.useCallback((item: string) => {
    setSearchQuery(item);
    setShowSuggestions(false);
  }, []);

  const filteredVideos = videos.filter(video => {
    return video.title.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <QueryClientProvider client={queryClient}>
      <>
        <title>亿口甜筒·时光视频集</title>
        <meta name="description" content="探索甜筒的精彩视频内容，包含直播片段、精彩集锦等" />
        <meta name="keywords" content="甜筒, 时光视频集, 直播片段, 精彩集锦" />
        <Suspense
          fallback={<div className="flex items-center justify-center min-h-screen">加载中...</div>}
        >
          <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/30 tiger-stripe relative overflow-hidden">
            {/* 页面边角装饰图标 */}
            <div className="absolute top-4 left-4 text-primary opacity-30 text-4xl pointer-events-none">
              🐯
            </div>
            <div className="absolute top-4 right-4 text-primary opacity-30 text-4xl pointer-events-none">
              🐯
            </div>
            <div className="absolute bottom-4 left-4 text-primary opacity-30 text-4xl pointer-events-none">
              🐯
            </div>
            <div className="absolute bottom-4 right-4 text-primary opacity-30 text-4xl pointer-events-none">
              🐯
            </div>

            <DanmakuWelcome
              messages={danmakuMessages}
              colors={danmakuColors}
              style="colorful"
              theme={theme}
            />

            <header
              className="sticky top-0 z-40 bg-card/90 backdrop-blur-md border-b border-border shadow-sm transition-all duration-300 ease-in-out"
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
                          src="/image.png"
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

                    <div className="flex items-center gap-3 sm:gap-5 lg:gap-8 flex-shrink-0">
                      <div className="relative group flex-shrink-0">
                        <form onSubmit={handleSearch} className="relative" role="search">
                          <label htmlFor="search" className="sr-only">
                            搜索视频
                          </label>
                          <input
                            type="text"
                            id="search"
                            placeholder="搜索视频..."
                            value={searchQuery}
                            onChange={handleSearchChange}
                            onFocus={() => setShowSuggestions(true)}
                            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                            className="pl-10 pr-4 py-2.5 sm:py-3 rounded-full border-2 border-border bg-muted/50 focus:bg-background focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 w-44 sm:w-52 lg:w-64 transition-all duration-300 text-sm sm:text-base"
                            aria-label="搜索视频"
                            aria-expanded={showSuggestions}
                            aria-haspopup="listbox"
                          />
                          <Search
                            className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-muted-foreground transition-colors duration-300 w-4.5 h-4.5 sm:w-[19px] sm:h-[19px]"
                            aria-hidden="true"
                          />

                          {showSuggestions &&
                            searchQuery.trim() &&
                            (suggestions.length > 0 || searchHistory.length > 0) && (
                              <div
                                className="absolute left-0 right-0 mt-2 bg-white border border-border rounded-xl shadow-lg py-2 z-50 transition-all duration-300 ease-in-out animate-in fade-in slide-in-from-top-2"
                                role="listbox"
                                aria-labelledby="search"
                              >
                                {suggestions.length > 0 && (
                                  <div className="search-suggestions">
                                    <div className="px-4 py-2 text-xs font-medium text-muted-foreground border-b border-border bg-primary/5">
                                      搜索建议
                                    </div>
                                    {suggestions.map((suggestion, index) => (
                                      <div
                                        key={index}
                                        className="px-4 py-2.5 hover:bg-primary/10 cursor-pointer text-sm transition-all duration-200"
                                        onClick={() => selectSuggestion(suggestion)}
                                        role="option"
                                        aria-selected="false"
                                      >
                                        {suggestion}
                                      </div>
                                    ))}
                                  </div>
                                )}

                                {searchHistory.length > 0 && suggestions.length === 0 && (
                                  <div className="search-history">
                                    <div className="px-4 py-2 text-xs font-medium text-muted-foreground border-b border-border flex items-center justify-between bg-secondary/5">
                                      <span>搜索历史</span>
                                      <button
                                        type="button"
                                        onClick={clearSearchHistory}
                                        className="text-xs text-primary hover:underline transition-colors duration-200"
                                        aria-label="清除搜索历史"
                                      >
                                        清除
                                      </button>
                                    </div>
                                    {searchHistory.map((item, index) => (
                                      <div
                                        key={index}
                                        className="px-4 py-2.5 hover:bg-secondary/10 cursor-pointer text-sm transition-all duration-200"
                                        onClick={() => selectFromHistory(item)}
                                        role="option"
                                        aria-selected="false"
                                      >
                                        {item}
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            )}
                        </form>
                      </div>

                      <div className="flex items-center flex-shrink-0">
                        <ThemeToggle currentTheme={theme} onToggle={toggleTheme} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </header>

            <main
              className="max-w-[1440px] lg:max-w-[1600px] mx-auto px-6 py-8 flex flex-col md:flex-row gap-8"
              role="main"
            >
              <section className="flex-1 w-full min-w-0" aria-labelledby="timeline-title">
                <VideoTimeline
                  theme={theme}
                  onVideoClick={video => {
                    console.log("Video click passed to TiantongPage:", video.title);
                    setSelectedVideo(video);
                  }}
                />
              </section>

              <aside
                className="w-full md:w-80 lg:w-96 shrink-0"
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
              <p>{`© 2024 亿口甜筒 · 亿口时光 | ${theme === "tiger" ? "虎将的高能切片站" : "甜筒的粉丝快乐窝"}`}</p>
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
      </>
    </QueryClientProvider>
  );
};

export default TiantongPage;

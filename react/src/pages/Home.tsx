import React, { useState, useMemo, Suspense } from 'react';
import { Github, ExternalLink, Search, Filter, Heart, TrendingUp, Calendar } from 'lucide-react';
import { videos, highlightCategories, Video } from '@/data/mockData';
import VideoCard from '@/components/VideoCard';
import ThemeToggle from '@/components/ThemeToggle';
import TimelineItem from '@/components/TimelineItem';
import DanmakuWelcome from '@/components/DanmakuWelcome';
import { useDeviceDetect } from '@/hooks/use-mobile';
import { withDeviceSpecificComponent } from '@/hooks/use-dynamic-component';

// 懒加载较重的组件
const VideoModal = React.lazy(() => import('@/components/VideoModal'));
const DesktopSidebarDanmu = React.lazy(() => import('@/components/SidebarDanmu'));

// 移动端简化版侧边栏组件
const MobileSidebar = ({ theme }: { theme: 'tiger' | 'sweet' }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  return (
    <div className="bg-card rounded-xl border border-border p-3 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold">互动区</h3>
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-2 rounded-full hover:bg-primary/10 transition-all"
          aria-label={isExpanded ? "收起" : "展开"}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="18" 
            height="18" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </button>
      </div>
      
      <div className="grid grid-cols-3 gap-2">
        <button className={`p-3 rounded-full ${theme === 'tiger' ? 'bg-orange-500/10 hover:bg-orange-500/20' : 'bg-pink-500/10 hover:bg-pink-500/20'} text-sm font-medium transition-all`}>
          关注
        </button>
        <button className={`p-3 rounded-full ${theme === 'tiger' ? 'bg-orange-500/10 hover:bg-orange-500/20' : 'bg-pink-500/10 hover:bg-pink-500/20'} text-sm font-medium transition-all`}>
          点赞
        </button>
        <button className={`p-3 rounded-full ${theme === 'tiger' ? 'bg-orange-500/10 hover:bg-orange-500/20' : 'bg-pink-500/10 hover:bg-pink-500/20'} text-sm font-medium transition-all`}>
          分享
        </button>
      </div>
      
      {isExpanded && (
        <div className={`p-3 rounded-lg ${theme === 'tiger' ? 'bg-orange-500/5' : 'bg-pink-500/5'} transition-all animate-in fade-in slide-in-from-top-1`}>
          <p className="text-sm text-muted-foreground">欢迎来到亿口甜筒的时光视频集，记录每一个高光时刻。</p>
        </div>
      )}
    </div>
  );
};

// 设备特定侧边栏组件
const ResponsiveSidebarDanmu = withDeviceSpecificComponent({
  mobile: (props: { theme: 'tiger' | 'sweet' }) => <MobileSidebar {...props} />,
  tablet: (props: { theme: 'tiger' | 'sweet' }) => (
    <Suspense fallback={<div className="bg-card rounded-xl border border-border h-64 animate-pulse"></div>}>
      <DesktopSidebarDanmu {...props} />
    </Suspense>
  ),
  desktop: (props: { theme: 'tiger' | 'sweet' }) => (
    <Suspense fallback={<div className="bg-card rounded-xl border border-border h-64 animate-pulse"></div>}>
      <DesktopSidebarDanmu {...props} />
    </Suspense>
  )
});

const Home = () => {
  const [theme, setTheme] = useState<'tiger' | 'sweet'>('tiger');
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [headerBgOpacity, setHeaderBgOpacity] = useState(0.9);
  const headerRef = React.useRef<HTMLElement>(null);

  // 监听滚动事件，实现导航栏动态效果
  React.useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      // 计算透明度，滚动超过50px后逐渐变为完全不透明
      const opacity = Math.min(1, 0.9 + scrollY / 500);
      setHeaderBgOpacity(opacity);
      
      // 为导航栏添加滚动效果类
      if (headerRef.current) {
        if (scrollY > 30) {
          headerRef.current.classList.add('shadow-md');
          headerRef.current.classList.remove('shadow-sm');
          headerRef.current.classList.add('py-2');
          headerRef.current.classList.remove('py-3');
        } else {
          headerRef.current.classList.add('shadow-sm');
          headerRef.current.classList.remove('shadow-md');
          headerRef.current.classList.remove('py-2');
          headerRef.current.classList.add('py-3');
        }
      }
    };

    // 初始触发一次，确保导航栏状态正确
    handleScroll();
    
    // 添加滚动事件监听器，使用passive: true提高性能
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 弹幕消息
  const danmakuMessages = [
    '霸总虎来巡山了！🦁️',
    '甜筒今天有点甜🍦',
    '224大军前来报到！',
    '这是什么绝世反差萌啊awsl',
    '主播房间号 12195609 关注不迷路',
    '瑞哥哥大气！',
    '为了甜筒，冲鸭！',
    '狮子座的光芒无法掩盖✨',
    '今天也是元气满满的一天',
    '这个wink我承包了😉',
    '哈哈哈笑死我了',
    '亿口甜筒，入股不亏',
    '好听好听耳朵怀孕了🎵',
    '这波操作666',
    '守护最好的甜筒'
  ];

  // 弹幕颜色
  const danmakuColors = theme === 'tiger' 
    ? ['rgb(255, 95, 0)', 'rgb(255, 190, 40)', 'rgb(255, 215, 0)', 'rgb(255, 165, 0)', 'rgb(255, 140, 0)']
    : ['rgb(255, 140, 180)', 'rgb(255, 192, 203)', 'rgb(255, 105, 180)', 'rgb(255, 127, 80)', 'rgb(255, 20, 147)'];

  const toggleTheme = () => {
    const newTheme = theme === 'tiger' ? 'sweet' : 'tiger';
    setTheme(newTheme);
    // Apply theme class to body
    if (newTheme === 'sweet') {
      document.documentElement.classList.add('theme-sweet');
    } else {
      document.documentElement.classList.remove('theme-sweet');
    }
  };

  // 搜索处理函数
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // 添加到搜索历史
      setSearchHistory(prev => {
        const newHistory = [searchQuery.trim(), ...prev.filter(item => item !== searchQuery.trim())].slice(0, 5);
        return newHistory;
      });
      setShowSuggestions(false);
    }
  };

  // 处理搜索输入变化，生成自动补全建议
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    if (value.trim()) {
      // 从视频标题中生成建议
      const videoTitles = videos.map(video => video.title);
      const filteredSuggestions = videoTitles
        .filter(title => title.toLowerCase().includes(value.toLowerCase()))
        .slice(0, 5);
      setSuggestions(filteredSuggestions);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  // 选择搜索建议
  const selectSuggestion = (suggestion: string) => {
    setSearchQuery(suggestion);
    setShowSuggestions(false);
  };

  // 清除搜索历史
  const clearSearchHistory = () => {
    setSearchHistory([]);
  };

  // 从搜索历史中选择
  const selectFromHistory = (item: string) => {
    setSearchQuery(item);
    setShowSuggestions(false);
  };

  const filteredVideos = videos.filter(video => {
    return (activeCategory === 'all' || video.category === activeCategory) &&
           (video.title.toLowerCase().includes(searchQuery.toLowerCase()));
  });

  // 按日期分组视频
  const groupedVideos = useMemo(() => {
    const grouped = filteredVideos.reduce((acc, video) => {
      const date = video.date;
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(video);
      return acc;
    }, {} as Record<string, Video[]>);

    return Object.entries(grouped)
      .sort(([dateA], [dateB]) => dateB.localeCompare(dateA))
      .map(([date, videos]) => ({ date, videos }));
  }, [filteredVideos]);

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/30">
      {/* 弹幕欢迎效果 */}
      <DanmakuWelcome 
        messages={danmakuMessages}
        colors={danmakuColors}
        style="colorful"
        theme={theme}
      />
      
      {/* 1. Header & Hero Section */}
      <header className="sticky top-0 z-40 bg-card/90 backdrop-blur-md border-b border-border shadow-sm transition-all duration-300 ease-in-out" role="banner" id="main-header" ref={headerRef} style={{ backgroundColor: `rgba(var(--card-rgb), ${headerBgOpacity})` }}>
        <div className="max-w-[1440px] mx-auto">
          
          <div className="px-4 sm:px-6 py-2 sm:py-3 flex items-center justify-between gap-2 sm:gap-4">
            {/* Logo & Streamer Info */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="relative flex-shrink-0 group">
                <div className={`w-10 sm:w-12 md:w-16 h-10 sm:h-12 md:h-16 rounded-full border-2 sm:border-3 md:border-4 overflow-hidden shadow-custom transition-all duration-300 hover:scale-105 hover:shadow-lg ${theme === 'tiger' ? 'border-[rgb(255,110,20)] hover:border-[rgb(255,130,40)]' : 'border-[rgb(255,120,160)] hover:border-[rgb(255,100,140)]'}`}>
                  <img 
                    src="/image.png" 
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=128&q=80";
                    }}
                    alt="亿口甜筒" 
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    aria-label="亿口甜筒" 
                  />
                </div>
                <div className="absolute -bottom-1 -right-1 bg-primary text-primary-foreground text-[9px] sm:text-[10px] px-2 py-0.5 rounded-full font-bold shadow-sm transition-all duration-300 hover:scale-110 hover:shadow-md animate-pulse" aria-label="直播中">
                  LIVE
                </div>
              </div>
              
              <div className="min-w-0 flex-1">
                <h1 className="text-base sm:text-lg md:text-2xl font-extrabold tracking-tight flex items-center overflow-hidden text-ellipsis whitespace-nowrap">
                  亿口甜筒
                  <span className={`ml-1 sm:ml-2 text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 rounded border border-current opacity-80 transition-all duration-300 ${theme === 'tiger' ? 'text-[rgb(255,210,60)] bg-[rgb(255,110,20)/20]' : 'text-[rgb(255,80,120)] bg-[rgb(255,120,160)/20]'}`}>
                    {theme === 'tiger' ? '🦁 威虎' : '🍦 甜筒'}
                  </span>
                </h1>
                <div className="flex items-center space-x-2 sm:space-x-3 text-[10px] sm:text-xs text-muted-foreground mt-1 overflow-hidden text-ellipsis whitespace-nowrap" role="contentinfo">
                  <span className="flex items-center">
                    <a href="https://www.douyu.com/12195609" target="_blank" rel="noopener noreferrer" className="font-mono font-bold text-foreground hover:text-primary transition-colors">12195609</a>
                  </span>
                  <span className="w-1 h-1 bg-border rounded-full" aria-hidden="true"></span>
                  <a href="https://yuba.douyu.com/discussion/11242628/posts" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors flex items-center" aria-label="访问鱼吧">
                    鱼吧 
                    <ExternalLink size={9} sm:size={10} className="ml-0.5" aria-hidden="true" />
                  </a>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Desktop Search */}
              <div className="hidden md:flex relative group">
                <form onSubmit={handleSearch} className="relative w-full" role="search">
                  <label htmlFor="search" className="sr-only">搜索视频</label>
                  <input 
                    type="text" 
                    id="search"
                    placeholder="搜索视频..." 
                    value={searchQuery}
                    onChange={handleSearchChange}
                    onFocus={() => setShowSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                    className="pl-9 pr-4 py-2 rounded-full border-2 border-border bg-muted/30 focus:bg-background focus:border-primary focus:outline-none w-48 transition-all duration-300 ease-in-out group-focus-within:w-64"
                    aria-label="搜索视频"
                    aria-expanded={showSuggestions}
                    aria-haspopup="listbox"
                  />
                  <Search className="absolute left-3 top-2.5 text-muted-foreground transition-colors duration-300" size={18} aria-hidden="true" />
                  
                  {/* 搜索建议和历史 */}
                  {showSuggestions && searchQuery.trim() && (suggestions.length > 0 || searchHistory.length > 0) && (
                    <div className="absolute left-0 right-0 mt-1 bg-white border border-border rounded-lg shadow-lg py-2 z-50 transition-all duration-300 ease-in-out animate-in fade-in slide-in-from-top-1" role="listbox" aria-labelledby="search">
                      {/* 搜索建议 */}
                      {suggestions.length > 0 && (
                        <div className="search-suggestions">
                          <div className="px-3 py-1 text-xs font-medium text-muted-foreground border-b border-border bg-primary/5">
                            搜索建议
                          </div>
                          {suggestions.map((suggestion, index) => (
                            <div 
                              key={index}
                              className="px-3 py-2 hover:bg-primary/10 cursor-pointer text-sm transition-all duration-200"
                              onClick={() => selectSuggestion(suggestion)}
                              role="option"
                              aria-selected="false"
                            >
                              {suggestion}
                            </div>
                          ))}
                        </div>
                      )}
                      
                      {/* 搜索历史 */}
                      {searchHistory.length > 0 && suggestions.length === 0 && (
                        <div className="search-history">
                          <div className="px-3 py-1 text-xs font-medium text-muted-foreground border-b border-border flex items-center justify-between bg-secondary/5">
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
                              className="px-3 py-2 hover:bg-secondary/10 cursor-pointer text-sm transition-all duration-200"
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
              
              {/* Mobile Search Button */}
              <button
                onClick={() => setShowMobileSearch(!showMobileSearch)}
                className="md:hidden p-2.5 rounded-full hover:bg-primary/10 transition-all duration-300 min-w-[2.5rem] min-h-[2.5rem] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 active:scale-95"
                aria-label="切换搜索框"
                aria-pressed={showMobileSearch}
              >
                <Search size={18} sm:size={20} className={`transition-all duration-300 ${showMobileSearch ? 'rotate-90 scale-110' : ''}`} />
              </button>
              
              {/* Theme Toggle */}
              <div className="flex items-center">
                <ThemeToggle currentTheme={theme} onToggle={toggleTheme} />
              </div>
            </div>
          </div>
        </div>
      </header>
      
      {/* Mobile Search Bar */}
      {showMobileSearch && (
        <div className="sticky top-[56px] sm:top-[68px] z-30 bg-card/90 backdrop-blur-md border-b border-border px-4 sm:px-6 py-2 sm:py-3 md:hidden transition-all duration-300 ease-in-out animate-in slide-in-from-top-1">
          <form onSubmit={handleSearch} className="relative w-full" role="search">
            <label htmlFor="mobile-search" className="sr-only">搜索视频</label>
            <div className="relative">
              <input 
                type="text" 
                id="mobile-search"
                placeholder="搜索视频..." 
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                className="pl-10 pr-10 py-2.5 rounded-full border-2 border-border bg-muted/30 focus:bg-background focus:border-primary focus:outline-none w-full transition-all duration-300 ease-in-out focus:ring-2 focus:ring-primary focus:ring-offset-2"
                aria-label="搜索视频"
                aria-expanded={showSuggestions}
                aria-haspopup="listbox"
                autoFocus
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground transition-all duration-300 focus-within:text-primary" size={18} sm:size={20} aria-hidden="true" />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-all duration-300 p-1 rounded-full hover:bg-muted"
                  aria-label="清除搜索内容"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              )}
            </div>
            
            {/* 搜索建议和历史 */}
            {showSuggestions && searchQuery.trim() && (suggestions.length > 0 || searchHistory.length > 0) && (
              <div className="absolute left-4 right-4 mt-1 bg-white border border-border rounded-lg shadow-lg py-2 z-50 transition-all duration-300 ease-in-out animate-in fade-in slide-in-from-top-1" role="listbox" aria-labelledby="mobile-search">
                {/* 搜索建议 */}
                {suggestions.length > 0 && (
                  <div className="search-suggestions">
                    <div className="px-3 py-1.5 text-xs font-medium text-muted-foreground border-b border-border bg-primary/5">
                      搜索建议
                    </div>
                    {suggestions.map((suggestion, index) => (
                      <div 
                        key={index}
                        className="px-3 py-2.5 hover:bg-primary/10 cursor-pointer text-sm transition-all duration-200 active:bg-primary/20"
                        onClick={() => selectSuggestion(suggestion)}
                        role="option"
                        aria-selected="false"
                      >
                        <Search size={14} className="inline-block mr-2 text-muted-foreground" aria-hidden="true" />
                        {suggestion}
                      </div>
                    ))}
                  </div>
                )}
                
                {/* 搜索历史 */}
                {searchHistory.length > 0 && (
                  <div className="search-history">
                    <div className="px-3 py-1.5 text-xs font-medium text-muted-foreground border-b border-border flex items-center justify-between bg-secondary/5">
                      <span>搜索历史</span>
                      <button 
                        type="button"
                        onClick={clearSearchHistory}
                        className="text-xs text-primary hover:underline transition-colors duration-200 active:text-primary/80"
                        aria-label="清除搜索历史"
                      >
                        清除
                      </button>
                    </div>
                    {searchHistory.map((item, index) => (
                      <div 
                        key={index}
                        className="px-3 py-2.5 hover:bg-secondary/10 cursor-pointer text-sm transition-all duration-200 active:bg-secondary/20"
                        onClick={() => selectFromHistory(item)}
                        role="option"
                        aria-selected="false"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="inline-block mr-2 text-muted-foreground" aria-hidden="true">
                          <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"></path>
                        </svg>
                        {item}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSearchHistory(prev => prev.filter(item => item !== searchHistory[index]));
                          }}
                          className="ml-auto text-muted-foreground hover:text-foreground transition-all duration-200 p-1 rounded-full hover:bg-muted"
                          aria-label={`删除搜索历史 ${searchHistory[index]}`}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </form>
        </div>
      )}

      {/* Main Content Layout */}
      <main className="max-w-[1440px] mx-auto px-6 py-8 flex flex-col md:flex-row gap-8" role="main">
        
        {/* Left: Video Timeline (Flexible width) */}
        <section className="flex-1 w-full min-w-0" aria-labelledby="timeline-title">
          <div className="mb-8">
            <h2 id="timeline-title" className="text-3xl font-black mb-2 flex items-center">
              <span className="bg-primary w-2 h-8 mr-3 rounded-full" aria-hidden="true"></span>
              时光视频集
            </h2>
            <p className="text-muted-foreground">记录亿口甜筒的每一个高光时刻，从霸气控场到软萌破防。</p>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-3 sm:gap-4 mb-8 pb-2 px-0.5 sm:px-0" role="navigation" aria-label="视频分类">
            {highlightCategories.map((cat) => {
              const Icon = cat.icon;
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`
                    flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl border-2 font-bold transition-all transform hover:-translate-y-0.5 min-h-[2.5rem] sm:min-h-[2.75rem] min-w-[6rem]
                    ${isActive 
                      ? 'bg-primary border-primary text-primary-foreground shadow-lg scale-105' 
                      : 'bg-card border-border text-muted-foreground hover:border-primary/50 hover:text-foreground'}
                  `}
                  aria-pressed={isActive}
                >
                  <Icon size={18} className="flex-shrink-0" aria-hidden="true" />
                  <span>{cat.name}</span>
                </button>
              );
            })}
          </div>

          {/* 结果提示 */}
          <div className="flex items-center justify-between mb-8" aria-live="polite">
            <div className="flex items-center gap-2 text-gray-600">
              <TrendingUp className="w-5 h-5" aria-hidden="true" />
              <span>
                找到{' '}
                <span 
                  className="font-bold"
                  style={{ color: theme === 'tiger' ? 'rgb(255, 95, 0)' : 'rgb(255, 140, 180)' }}
                >
                  {filteredVideos.length}
                </span>{' '}
                个视频
              </span>
            </div>
          </div>

          {/* 时间线 */}
          {groupedVideos.length > 0 ? (
            <div className="relative transition-all duration-300 animate-in fade-in" role="feed">
              {groupedVideos.map((group, index) => (
                <TimelineItem
                  key={group.date}
                  date={group.date}
                  videos={group.videos}
                  isLast={index === groupedVideos.length - 1}
                  onVideoClick={setSelectedVideo}
                  theme={theme}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-card rounded-3xl border border-dashed border-border transition-all duration-300 animate-in fade-in" role="status">
               <div className="text-6xl mb-4" aria-hidden="true">😿</div>
               <h3 className="text-xl font-bold text-muted-foreground">
                 没有找到相关的视频喵~
               </h3>
               <button 
                 onClick={() => {setActiveCategory('all'); setSearchQuery('')}} 
                 className="mt-4 text-primary font-bold hover:underline"
                 aria-label="查看全部视频"
               >
                 查看全部
               </button>
            </div>
          )}
        </section>

        {/* Right: Interactive Sidebar (Device-specific) */}
        <aside className="w-full md:w-80 shrink-0" role="complementary" aria-label="互动区域">
           <ResponsiveSidebarDanmu theme={theme} />
        </aside>
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-12 bg-card py-8 text-center text-sm text-muted-foreground" role="contentinfo">
        <p>© 2024 亿口甜筒 · 时光视频集. All rights reserved.</p>
        <p className="mt-2 flex items-center justify-center gap-2">
          Designed with <Heart size={12} className="text-red-500 fill-current" aria-hidden="true" /> for 224
        </p>
      </footer>

      {/* Video Modal */}
      <Suspense fallback={null}>
        <VideoModal video={selectedVideo} onClose={() => setSelectedVideo(null)} theme={theme} />
      </Suspense>
    </div>
  );
};

export default Home;
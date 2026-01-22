import React, { useState, useMemo, Suspense } from 'react';
import { Github, ExternalLink, Search, Filter, Heart, TrendingUp, Calendar } from 'lucide-react';
import { videos, highlightCategories, Video } from '@/data/mockData';
import VideoCard from '@/components/VideoCard';
import ThemeToggle from '@/components/ThemeToggle';
import TimelineItem from '@/components/TimelineItem';
import DanmakuWelcome from '@/components/DanmakuWelcome';

// 懒加载较重的组件
const VideoModal = React.lazy(() => import('@/components/VideoModal'));
const SidebarDanmu = React.lazy(() => import('@/components/SidebarDanmu'));

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
      <header className="sticky top-0 z-40 bg-card/90 backdrop-blur-md border-b border-border shadow-sm" role="banner">
        <div className="max-w-[1440px] mx-auto">
          
          <div className="px-6 py-4 flex items-center justify-between">
            {/* Logo & Streamer Info */}
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className={`w-16 h-16 rounded-full border-4 overflow-hidden shadow-custom ${theme === 'tiger' ? 'border-[rgb(255,95,0)]' : 'border-[rgb(255,140,180)]'}`}>
                  <img 
                    src="/image.png" 
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=128&q=80";
                    }}
                    alt="亿口甜筒" 
                    loading="lazy"
                    className="w-full h-full object-cover"
                    aria-label="亿口甜筒" 
                  />
                </div>
                <div className="absolute -bottom-1 -right-1 bg-primary text-primary-foreground text-[10px] px-2 py-0.5 rounded-full font-bold shadow-sm" aria-label="直播中">
                  LIVE
                </div>
              </div>
              
              <div>
                <h1 className="text-2xl font-extrabold tracking-tight flex items-center">
                  亿口甜筒
                  <span className={`ml-2 text-sm px-2 py-0.5 rounded border border-current opacity-70 ${theme === 'tiger' ? 'text-[rgb(255,190,40)]' : 'text-[rgb(255,140,180)]'}`}>
                    {theme === 'tiger' ? '🦁 威虎大将军' : '🍦 软萌小甜筒'}
                  </span>
                </h1>
                <div className="flex items-center space-x-3 text-sm text-muted-foreground mt-1" role="contentinfo">
                  <span>房间号: <a href="https://www.douyu.com/12195609" target="_blank" rel="noopener noreferrer" className="font-mono font-bold text-foreground hover:text-primary transition-colors">12195609</a></span>
                  <span className="w-1 h-1 bg-border rounded-full" aria-hidden="true"></span>
                  <a href="https://yuba.douyu.com/discussion/11242628/posts" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors flex items-center" aria-label="访问鱼吧">
                    鱼吧 <ExternalLink size={12} className="ml-0.5" aria-hidden="true" />
                  </a>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-6">
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
                    className="pl-9 pr-4 py-2 rounded-full border-2 border-border bg-muted/30 focus:bg-background focus:border-primary focus:outline-none w-48 transition-all group-focus-within:w-64"
                    aria-label="搜索视频"
                    aria-expanded={showSuggestions}
                    aria-haspopup="listbox"
                  />
                  <Search className="absolute left-3 top-2.5 text-muted-foreground" size={18} aria-hidden="true" />
                  
                  {/* 搜索建议和历史 */}
                  {showSuggestions && searchQuery.trim() && (suggestions.length > 0 || searchHistory.length > 0) && (
                    <div className="absolute left-0 right-0 mt-1 bg-white border border-border rounded-lg shadow-lg py-2 z-50" role="listbox" aria-labelledby="search">
                      {/* 搜索建议 */}
                      {suggestions.length > 0 && (
                        <div className="search-suggestions">
                          <div className="px-3 py-1 text-xs font-medium text-muted-foreground border-b border-border bg-primary/5">
                            搜索建议
                          </div>
                          {suggestions.map((suggestion, index) => (
                            <div 
                              key={index}
                              className="px-3 py-2 hover:bg-primary/10 cursor-pointer text-sm"
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
                              className="text-xs text-primary hover:underline"
                              aria-label="清除搜索历史"
                            >
                              清除
                            </button>
                          </div>
                          {searchHistory.map((item, index) => (
                            <div 
                              key={index}
                              className="px-3 py-2 hover:bg-secondary/10 cursor-pointer text-sm"
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
                className="md:hidden p-2 rounded-full hover:bg-primary/10 transition-all"
                aria-label="切换搜索框"
                aria-pressed={showMobileSearch}
              >
                <Search size={20} />
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
        <div className="sticky top-[72px] z-30 bg-card/90 backdrop-blur-md border-b border-border px-6 py-3 md:hidden">
          <form onSubmit={handleSearch} className="relative w-full" role="search">
            <label htmlFor="mobile-search" className="sr-only">搜索视频</label>
            <input 
              type="text" 
              id="mobile-search"
              placeholder="搜索视频..." 
              value={searchQuery}
              onChange={handleSearchChange}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              className="pl-9 pr-4 py-2 rounded-full border-2 border-border bg-muted/30 focus:bg-background focus:border-primary focus:outline-none w-full"
              aria-label="搜索视频"
              aria-expanded={showSuggestions}
              aria-haspopup="listbox"
              autoFocus
            />
            <Search className="absolute left-3 top-2.5 text-muted-foreground" size={18} aria-hidden="true" />
            
            {/* 搜索建议和历史 */}
            {showSuggestions && searchQuery.trim() && (suggestions.length > 0 || searchHistory.length > 0) && (
              <div className="absolute left-6 right-6 mt-1 bg-white border border-border rounded-lg shadow-lg py-2 z-50" role="listbox" aria-labelledby="mobile-search">
                {/* 搜索建议 */}
                {suggestions.length > 0 && (
                  <div className="search-suggestions">
                    <div className="px-3 py-1 text-xs font-medium text-muted-foreground border-b border-border bg-primary/5">
                      搜索建议
                    </div>
                    {suggestions.map((suggestion, index) => (
                      <div 
                        key={index}
                        className="px-3 py-2 hover:bg-primary/10 cursor-pointer text-sm"
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
                        className="text-xs text-primary hover:underline"
                        aria-label="清除搜索历史"
                      >
                        清除
                      </button>
                    </div>
                    {searchHistory.map((item, index) => (
                      <div 
                        key={index}
                        className="px-3 py-2 hover:bg-secondary/10 cursor-pointer text-sm"
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
          <div className="flex flex-wrap gap-3 mb-8 pb-2" role="navigation" aria-label="视频分类">
            {highlightCategories.map((cat) => {
              const Icon = cat.icon;
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`
                    flex items-center px-4 py-2 rounded-xl border-2 font-bold transition-all transform hover:-translate-y-0.5
                    ${isActive 
                      ? 'bg-primary border-primary text-primary-foreground shadow-lg scale-105' 
                      : 'bg-card border-border text-muted-foreground hover:border-primary/50 hover:text-foreground'}
                  `}
                  aria-pressed={isActive}
                >
                  <Icon size={18} className="mr-2" aria-hidden="true" />
                  {cat.name}
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

        {/* Right: Interactive Sidebar (Fixed Width) */}
        <aside className="w-full md:w-80 shrink-0" role="complementary" aria-label="互动区域">
           <Suspense fallback={<div className="h-[300px] bg-card rounded-xl border border-border animate-pulse"></div>}>
             <SidebarDanmu theme={theme} />
           </Suspense>
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
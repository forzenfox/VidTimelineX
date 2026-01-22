import React, { useState, useMemo } from 'react';
import { Github, ExternalLink, Search, Filter, Heart, TrendingUp, Calendar } from 'lucide-react';
import { videos, highlightCategories, Video } from '@/data/mockData';
import SidebarDanmu from '@/components/SidebarDanmu';
import VideoCard from '@/components/VideoCard';
import VideoModal from '@/components/VideoModal';
import ThemeToggle from '@/components/ThemeToggle';
import TimelineItem from '@/components/TimelineItem';
import DanmakuWelcome from '@/components/DanmakuWelcome';

const Home = () => {
  const [theme, setTheme] = useState<'tiger' | 'sweet'>('tiger');
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

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
      <header className="sticky top-0 z-40 bg-card/90 backdrop-blur-md border-b border-border shadow-sm">
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
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-1 -right-1 bg-primary text-primary-foreground text-[10px] px-2 py-0.5 rounded-full font-bold shadow-sm">
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
                <div className="flex items-center space-x-3 text-sm text-muted-foreground mt-1">
                  <span>房间号: <span className="font-mono font-bold text-foreground">12195609</span></span>
                  <span className="w-1 h-1 bg-border rounded-full"></span>
                  <a href="#" className="hover:text-primary transition-colors flex items-center">
                    鱼吧 <ExternalLink size={12} className="ml-0.5" />
                  </a>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-6">
              {/* Search */}
              <div className="hidden md:flex relative group">
                <input 
                  type="text" 
                  placeholder="搜索视频..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-4 py-2 rounded-full border-2 border-border bg-muted/30 focus:bg-background focus:border-primary focus:outline-none w-48 transition-all group-focus-within:w-64"
                />
                <Search className="absolute left-3 top-2.5 text-muted-foreground" size={18} />
              </div>
              
              {/* Theme Toggle */}
              <div className="flex items-center">
                <ThemeToggle currentTheme={theme} onToggle={toggleTheme} />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Layout */}
      <main className="max-w-[1440px] mx-auto px-6 py-8 flex flex-col md:flex-row gap-8">
        
        {/* Left: Video Timeline (Flexible width) */}
        <section className="flex-1 w-full min-w-0">
          <div className="mb-8">
            <h2 className="text-3xl font-black mb-2 flex items-center">
              <span className="bg-primary w-2 h-8 mr-3 rounded-full"></span>
              时光视频集
            </h2>
            <p className="text-muted-foreground">记录亿口甜筒的每一个高光时刻，从霸气控场到软萌破防。</p>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-3 mb-8 pb-2">
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
                >
                  <Icon size={18} className="mr-2" />
                  {cat.name}
                </button>
              );
            })}
          </div>

          {/* 结果提示 */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2 text-gray-600">
              <TrendingUp className="w-5 h-5" />
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
            <div className="flex items-center gap-2 text-gray-500 text-sm">
              <Calendar className="w-4 h-4" />
              <span>按时间倒序排列</span>
            </div>
          </div>

          {/* 时间线 */}
          {groupedVideos.length > 0 ? (
            <div className="relative">
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
            <div className="text-center py-20 bg-card rounded-3xl border border-dashed border-border">
               <div className="text-6xl mb-4">😿</div>
               <h3 className="text-xl font-bold text-muted-foreground">
                 没有找到相关的视频喵~
               </h3>
               <button 
                 onClick={() => {setActiveCategory('all'); setSearchQuery('')}} 
                 className="mt-4 text-primary font-bold hover:underline"
               >
                 查看全部
               </button>
            </div>
          )}
        </section>

        {/* Right: Interactive Sidebar (Fixed Width) */}
        <aside className="w-full md:w-80 shrink-0">
           <SidebarDanmu theme={theme} />
           
           {/* Additional Widget: Anchor Profile or Announcement */}
           <div className="mt-6 p-5 bg-gradient-to-br from-secondary/10 to-primary/5 rounded-xl border border-border">
             <h4 className="font-bold flex items-center mb-3">
               <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-2 animate-pulse"></span>
               直播公告
             </h4>
             <p className="text-sm text-foreground/80 leading-relaxed">
               感谢大家支持甜筒！<br/>
               直播时间：每晚 20:00 - 24:00<br/>
               商务合作请私信~ ❤️
             </p>
           </div>
        </aside>
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-12 bg-card py-8 text-center text-sm text-muted-foreground">
        <p>© 2024 亿口甜筒 · 时光视频集. All rights reserved.</p>
        <p className="mt-2 flex items-center justify-center gap-2">
          Designed with <Heart size={12} className="text-red-500 fill-current" /> for 224
        </p>
      </footer>

      {/* Video Modal */}
      <VideoModal video={selectedVideo} onClose={() => setSelectedVideo(null)} theme={theme} />
    </div>
  );
};

export default Home;
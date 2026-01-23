import React, { useState } from 'react';
import { LoadingAnimation } from '../components/LoadingAnimation';
import { Header } from '../components/Header';
import { VideoTimeline } from '../components/VideoTimeline';
import { VideoModal } from '../components/VideoModal';
import { videos } from '../data/videos';
import type { Video } from '../data/videos';

/**
 * 洞主凯哥视频集页面 - 完全复刻lvjiang项目的洞主凯哥视频集页面
 */
const DongZhuKaiGe: React.FC = () => {
  // 状态管理
  const [isLoading, setIsLoading] = useState(true);
  const [theme, setTheme] = useState<'dongzhu' | 'kaige'>('dongzhu');
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

  /**
   * 处理加载完成事件
   */
  const handleLoadingComplete = (selectedTheme: 'dongzhu' | 'kaige') => {
    setTheme(selectedTheme);
    setIsLoading(false);
  };

  /**
   * 处理主题切换事件
   */
  const handleThemeToggle = () => {
    setTheme(prevTheme => prevTheme === 'dongzhu' ? 'kaige' : 'dongzhu');
  };

  /**
   * 处理视频点击事件
   */
  const handleVideoClick = (video: Video) => {
    setSelectedVideo(video);
  };

  /**
   * 处理模态框关闭事件
   */
  const handleModalClose = () => {
    setSelectedVideo(null);
  };

  // 如果正在加载，显示加载动画
  if (isLoading) {
    return <LoadingAnimation onComplete={handleLoadingComplete} />;
  }

  return (
    <div 
      className="min-h-screen font-sans theme-transition"
      style={{
        background: theme === 'dongzhu'
          ? 'linear-gradient(135deg, #FFFEF7 0%, #D4E8F0 50%, #AED6F1 100%)'
          : 'linear-gradient(135deg, #1A1A2E 0%, #16213E 50%, #0F3460 100%)',
        color: theme === 'dongzhu' ? '#2C3E50' : '#ECF0F1',
        transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
      }}
    >
      {/* 头部导航 */}
      <Header 
        theme={theme}
        onThemeToggle={handleThemeToggle}
      />

      {/* 页面标题 */}
      <div className="container mx-auto px-6 py-12 text-center">
        <h1 
          className="text-5xl sm:text-6xl md:text-7xl font-black mb-6"
          style={{
            background: theme === 'dongzhu'
              ? 'linear-gradient(135deg, #5DADE2, #85C1E2)'
              : 'linear-gradient(135deg, #E74C3C, #C0392B)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            textShadow: theme === 'dongzhu'
              ? '0 4px 20px rgba(93, 173, 226, 0.3)'
              : '0 4px 20px rgba(231, 76, 60, 0.3)',
            animation: 'logo-fade-in 1.5s ease-out 0.5s both, pulse-glow 2s ease-in-out 2s infinite'
          }}
        >
          洞主凯哥视频集
        </h1>
        <p 
          className="text-xl sm:text-2xl opacity-80"
          style={{
            color: theme === 'dongzhu' ? '#5D6D7E' : '#BDC3C7'
          }}
        >
          记录洞主和凯哥的精彩游戏瞬间
        </p>
      </div>

      {/* 视频时间轴 */}
      <VideoTimeline 
        videos={videos}
        theme={theme}
        onVideoClick={handleVideoClick}
      />

      {/* 视频模态框 */}
      <VideoModal 
        video={selectedVideo}
        theme={theme}
        onClose={handleModalClose}
      />

      {/* 底部信息 */}
      <footer 
        className="py-8 text-center opacity-70"
        style={{
          color: theme === 'dongzhu' ? '#85929E' : '#7F8C8D'
        }}
      >
        <div className="container mx-auto px-6">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
            <a
              href="https://www.douyu.com" 
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:opacity-100 transition-opacity"
            >
              <span>🎮</span>
              <span>斗鱼直播间</span>
            </a>
            <span className="text-gray-400">|</span>
            <a
              href="https://space.bilibili.com" 
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:opacity-100 transition-opacity"
            >
              <span>📺</span>
              <span>B站合集</span>
            </a>
            <span className="text-gray-400">|</span>
            <a
              href="https://www.douyu.com" 
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:opacity-100 transition-opacity"
            >
              <span>💬</span>
              <span>鱼吧链接</span>
            </a>
          </div>
          <p className="text-sm">
            © 2026 洞主凯哥视频集 | 数据来源于B站
          </p>
        </div>
      </footer>

      {/* 装饰元素 */}
      <div 
        className="fixed bottom-0 left-0 w-full h-12 opacity-30 pointer-events-none"
        style={{
          background: theme === 'dongzhu'
            ? 'linear-gradient(90deg, transparent, #AED6F1, #5DADE2, #AED6F1, transparent)'
            : 'linear-gradient(90deg, transparent, #E74C3C, #C0392B, #E74C3C, transparent)',
          animation: 'wave 3s ease-in-out infinite'
        }}
      />
    </div>
  );
};

export default DongZhuKaiGe;
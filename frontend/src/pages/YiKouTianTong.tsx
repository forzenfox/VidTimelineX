import React from 'react';
import { Link } from 'react-router-dom';
import VideoCard from '../components/VideoCard';
import { yiKouTianTongVideos } from '../data/yiKouTianTongVideos';
import type { Video } from '../data/types';

/**
 * 亿口甜筒视频集页面 - 展示与"亿口甜筒"相关的视频内容
 */
const YiKouTianTong: React.FC = () => {
  /**
   * 处理视频卡片点击事件
   */
  const handleVideoClick = (video: Video) => {
    // 在新窗口打开视频链接
    window.open(video.url, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-purple-100 p-4">
      {/* 页面头部 */}
      <header className="max-w-6xl mx-auto mb-8">
        <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
          {/* 返回按钮 */}
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-white hover:bg-gray-100 text-gray-700 font-medium py-2 px-4 rounded-lg shadow-sm transition-all duration-300"
          >
            ← 返回导航
          </Link>
          
          {/* 主题标题 */}
          <div className="text-center flex-1 min-w-[200px]">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
              亿口甜筒视频集
            </h1>
            <p className="text-gray-600">
              观看亿口甜筒的精彩美食视频
            </p>
          </div>
          
          {/* 空占位符，用于对齐 */}
          <div className="w-32"></div>
        </div>
      </header>

      {/* 视频列表 */}
      <main className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {yiKouTianTongVideos.map((video) => (
            <VideoCard
              key={video.id}
              video={video}
              onClick={handleVideoClick}
            />
          ))}
        </div>
      </main>

      {/* 页脚信息 */}
      <footer className="max-w-6xl mx-auto mt-16 text-center text-gray-500 text-sm">
        <p>© 2026 亿口甜筒视频集 | 数据来源于B站</p>
      </footer>
    </div>
  );
};

export default YiKouTianTong;
import React from 'react';
import { Video } from '@/data/mockData';
import VideoCard from './VideoCard';

interface TimelineItemProps {
  date: string;
  videos: Video[];
  isLast?: boolean;
  onVideoClick: (video: Video) => void;
  theme: 'tiger' | 'sweet';
}

export const TimelineItem: React.FC<TimelineItemProps> = ({ 
  date, 
  videos, 
  isLast = false, 
  onVideoClick, 
  theme 
}) => {
  // 根据主题设置颜色
  const primaryColor = theme === 'tiger' ? 'rgb(255, 95, 0)' : 'rgb(255, 140, 180)';
  const secondaryColor = theme === 'tiger' ? 'rgb(255, 190, 40)' : 'rgb(255, 192, 203)';

  return (
    <div className="relative pb-12">
      {/* 移动端：日期显示在顶部 */}
      <div className="md:hidden mb-6">
        <div 
          className="inline-block text-white px-5 py-2.5 rounded-lg shadow-lg"
          style={{
            background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
          }}
        >
          <div className="text-sm opacity-90">日期</div>
          <div className="font-bold">{date}</div>
        </div>
      </div>
      
      <div className="flex gap-8">
        {/* 桌面端：时间线左侧 - 日期标记 */}
        <div className="hidden md:flex-shrink-0 w-32 text-right">
          <div className="sticky top-24">
            <div 
              className="inline-block text-white px-4 py-2 rounded-lg shadow-lg"
              style={{
                background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
              }}
            >
              <div className="text-sm opacity-90">日期</div>
              <div className="font-bold">{date}</div>
            </div>
          </div>
        </div>

        {/* 时间线中间 - 连接线和节点 */}
        <div className="flex-shrink-0 flex flex-col items-center">
          {/* 增强的节点样式 */}
          <div 
            className="w-7 h-7 rounded-full shadow-lg ring-4 ring-white z-10 transition-transform hover:scale-125"
            style={{
              background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
            }}
          />
          {/* 增强的连接线 */}
          {!isLast && (
            <div 
              className="w-1.5 flex-1 opacity-40 mt-2 shadow-sm"
              style={{
                background: `linear-gradient(to bottom, ${primaryColor}, ${secondaryColor})`,
              }}
            />
          )}
        </div>

        {/* 时间线右侧 - 视频卡片 */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
          {videos.map((video) => (
            <VideoCard 
              key={video.id} 
              video={video} 
              onClick={onVideoClick} 
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TimelineItem;
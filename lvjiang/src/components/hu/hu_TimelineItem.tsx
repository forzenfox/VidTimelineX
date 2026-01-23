import React from 'react';
import { Video } from '@/data/hu_mockData';
import VideoCard from './hu_VideoCard';

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
    <div className="relative pb-10">
      {/* 移动端：日期显示在顶部 */}
      <div className="md:hidden mb-5">
        <div 
          className="inline-flex items-center gap-2 text-white px-4 py-1.5 rounded-lg"
          style={{
            background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
          }}
        >
          <span className="text-xs opacity-80">日期</span>
          <span className="font-bold">{date}</span>
        </div>
      </div>
      
      <div className="flex gap-6 lg:gap-8">
        {/* 桌面端：日期标记 - 简化为左侧块 */}
        <div className="hidden md:flex-shrink-0 w-28 lg:w-32 pt-1">
          <div 
            className="sticky top-24 inline-flex flex-col items-start text-white px-3 py-1.5 rounded-lg text-sm"
            style={{
              background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
            }}
          >
            <span className="opacity-80 text-xs">日期</span>
            <span className="font-bold">{date}</span>
          </div>
        </div>

        {/* 时间线右侧 - 视频卡片 */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-6">
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

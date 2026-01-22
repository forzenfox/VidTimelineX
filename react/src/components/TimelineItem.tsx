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
    <div className="relative flex gap-8 pb-12">
      {/* 时间线左侧 - 日期标记 */}
      <div className="flex-shrink-0 w-32 text-right">
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
        {/* 节点 */}
        <div 
          className="w-6 h-6 rounded-full shadow-lg ring-4 ring-white z-10"
          style={{
            background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
          }}
        />
        {/* 连接线 */}
        {!isLast && (
          <div 
            className="w-1 flex-1 opacity-30 mt-2"
            style={{
              background: `linear-gradient(to bottom, ${primaryColor}, ${secondaryColor})`,
            }}
          />
        )}
      </div>

      {/* 时间线右侧 - 视频卡片 */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map((video) => (
          <VideoCard 
            key={video.id} 
            video={video} 
            onClick={onVideoClick} 
          />
        ))}
      </div>
    </div>
  );
};

export default TimelineItem;
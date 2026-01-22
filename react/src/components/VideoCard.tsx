import React from 'react';
import { Play, Eye, Calendar } from 'lucide-react';
import { Video } from '@/data/mockData';

interface VideoCardProps {
  video: Video;
  onClick: (video: Video) => void;
}

const VideoCard: React.FC<VideoCardProps> = ({ video, onClick }) => {
  const Icon = video.icon;
  
  return (
    <div 
      onClick={() => onClick(video)}
      className="group relative bg-card rounded-xl overflow-hidden border border-border cursor-pointer shadow-custom transition-all duration-300 hover:-translate-y-1 hover:shadow-xl active:scale-95 active:shadow-md sm:hover:-translate-y-2 sm:hover:shadow-2xl"
      role="article"
      aria-labelledby={`video-title-${video.id}`}
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick(video)}
    >
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden">
        <img 
          src={video.cover} 
          alt={video.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
          <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center shadow-lg transform scale-50 group-hover:scale-100 transition-transform duration-300" aria-hidden="true">
            <Play fill="var(--primary)" className="text-primary ml-1" size={24} />
          </div>
        </div>
        
        {/* Category Tag */}
        <div className="absolute top-2 left-2 px-2 py-1 bg-primary/90 text-primary-foreground text-xs font-bold rounded-md flex items-center shadow-md" role="badge">
          <Icon size={12} className="mr-1" aria-hidden="true" />
          {video.category === 'sing' ? '甜筒天籁' : 
           video.category === 'dance' ? '霸总热舞' :
           video.category === 'funny' ? '反差萌' : '224日常'}
        </div>
      </div>
      
      {/* Content */}
      <div className="p-4">
        <h3 id={`video-title-${video.id}`} className="font-bold text-foreground line-clamp-2 h-12 group-hover:text-primary transition-colors">
          {video.title}
        </h3>
        
        <div className="flex items-center justify-between mt-3 text-xs text-muted-foreground" aria-label="视频信息">
          <div className="flex items-center space-x-1">
            <Calendar size={12} aria-hidden="true" />
            <span>{video.date}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Eye size={12} aria-hidden="true" />
            <span>{video.views} 播放</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;
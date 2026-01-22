import React, { useEffect } from 'react';
import { X, MessageCircle, ExternalLink } from 'lucide-react';
import { Video } from '@/data/mockData';

interface VideoModalProps {
  video: Video | null;
  onClose: () => void;
  theme?: 'tiger' | 'sweet';
}

const VideoModal: React.FC<VideoModalProps> = ({ video, onClose, theme = 'tiger' }) => {
  // 按 ESC 键关闭弹窗
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (video) {
      document.addEventListener('keydown', handleEsc);
      // 防止背景滚动
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [video, onClose]);

  if (!video) return null;

  // 生成模拟的 bvid
  const mockBvid = `BV${Math.random().toString(36).substring(2, 13).toUpperCase()}`;

  // 根据主题设置颜色
  const primaryColor = theme === 'tiger' ? 'rgb(255, 95, 0)' : 'rgb(255, 140, 180)';
  const secondaryColor = theme === 'tiger' ? 'rgb(255, 190, 40)' : 'rgb(255, 192, 203)';
  
  const modalTheme = {
    tiger: {
      headerBg: 'bg-secondary/20',
      headerText: 'text-muted-foreground',
      cardBg: 'bg-[#1a1a1a]',
      buttonBg: `bg-gradient-to-r ${primaryColor} ${secondaryColor} text-white font-medium hover:opacity-90`,
      footerBg: 'bg-[#1a1a1a]',
      footerText: 'text-gray-300',
      border: 'border-border',
      tooltipBg: 'bg-secondary/20',
      tooltipText: 'text-muted-foreground'
    },
    sweet: {
      headerBg: 'bg-secondary/20',
      headerText: 'text-muted-foreground',
      cardBg: 'bg-[#fff5f8]',
      buttonBg: `bg-gradient-to-r ${primaryColor} ${secondaryColor} text-white font-medium hover:opacity-90`,
      footerBg: 'bg-[#fff5f8]',
      footerText: 'text-gray-600',
      border: 'border-border',
      tooltipBg: 'bg-secondary/20',
      tooltipText: 'text-muted-foreground'
    }
  };

  const colors = modalTheme[theme];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* 背景遮罩 */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* 弹窗内容 */}
      <div className={`relative w-full max-w-5xl mx-4 ${colors.cardBg} rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200`}>
        {/* 头部 */}
        <div className={`flex items-center justify-between px-6 py-4 border-b ${colors.border} ${colors.headerBg}`}>
          <h3 className={`text-lg font-bold truncate flex-1 mr-4 ${colors.headerText}`}>{video.title}</h3>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        {/* 视频播放器 */}
        <div className={`relative ${theme === 'tiger' ? 'bg-[#1a1a1a]' : 'bg-[#fff5f8]'}`} style={{ paddingBottom: '56.25%' }}>
          <iframe
            src={`https://player.bilibili.com/player.html?bvid=${mockBvid}&page=1&high_quality=1&danmaku=1`}
            className="absolute inset-0 w-full h-full"
            allowFullScreen
            allow="autoplay; fullscreen"
            scrolling="no"
            frameBorder="0"
            title={video.title}
          />
        </div>
        
        {/* Footer Actions */}
        <div className={`p-4 flex items-center justify-between ${colors.footerBg}`}>
          <div>
             <a 
               href={`https://www.bilibili.com/video/${mockBvid}`} 
               target="_blank" 
               rel="noopener noreferrer"
               className={`flex items-center px-4 py-2 ${colors.buttonBg} rounded-full transition-colors font-medium`}
             >
               <ExternalLink size={18} className="mr-2" />
               跳转原站
             </a>
          </div>
          <div className={`flex items-center ${colors.footerText} text-sm`}>
             <MessageCircle size={16} className="mr-1" />
             <span>328 条弹幕装填中...</span>
          </div>
        </div>
        
        {/* 提示信息 */}
        <div className={`px-6 py-3 ${colors.tooltipBg} text-center text-sm ${colors.tooltipText}`}>
          视频来源：哔哩哔哩 (bilibili.com) • 按 ESC 键或点击外部区域关闭
        </div>
      </div>
    </div>
  );
};

export default VideoModal;
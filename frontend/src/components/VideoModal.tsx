import { useEffect, useRef } from 'react';
import type { Video } from '../data/videos';

interface VideoModalProps {
  video: Video | null;
  theme: 'dongzhu' | 'kaige';
  onClose: () => void;
}

export function VideoModal({ video, theme, onClose }: VideoModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  // 点击模态框外部关闭
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.body.style.overflow = 'hidden'; // 防止背景滚动

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'auto'; // 恢复背景滚动
    };
  }, [onClose]);

  // 按ESC键关闭
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  if (!video) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{
        background: theme === 'dongzhu'
          ? 'rgba(255, 254, 247, 0.95)'
          : 'rgba(26, 26, 46, 0.95)',
        backdropFilter: 'blur(10px)'
      }}
    >
      {/* 模态框容器 */}
      <div 
        ref={modalRef}
        className="relative w-full max-w-5xl rounded-2xl overflow-hidden theme-transition"
        style={{
          background: theme === 'dongzhu'
            ? 'linear-gradient(135deg, #FFFFFF, #AED6F1)'
            : 'linear-gradient(135deg, #16213E, #0F3460)',
          border: theme === 'dongzhu'
            ? '3px solid #5DADE2'
            : '3px solid #E74C3C',
          boxShadow: theme === 'dongzhu'
            ? '0 20px 60px rgba(93, 173, 226, 0.4)'
            : '0 20px 60px rgba(231, 76, 60, 0.4)'
        }}
      >
        {/* 关闭按钮 */}
        <button
          className="absolute top-4 right-4 z-10 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
          style={{
            background: theme === 'dongzhu'
              ? 'rgba(93, 173, 226, 0.9)'
              : 'rgba(231, 76, 60, 0.9)',
            color: '#fff',
            boxShadow: theme === 'dongzhu'
              ? '0 4px 15px rgba(93, 173, 226, 0.5)'
              : '0 4px 15px rgba(231, 76, 60, 0.5)'
          }}
          onClick={onClose}
        >
          <span className="text-2xl">×</span>
        </button>

        {/* 视频播放器 */}
        <div className="relative w-full aspect-video bg-black">
          <iframe
            src={`https://player.bilibili.com/player.html?bvid=${video.bvid}&page=1&autoplay=1`}
            title={video.title}
            className="w-full h-full"
            frameBorder="0"
            allowFullScreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          />
        </div>

        {/* 视频信息 */}
        <div className="p-6">
          {/* 视频日期和时长 */}
          <div className="flex items-center gap-4 mb-3">
            <span 
              className="text-xs font-semibold rounded-full px-3 py-1"
              style={{
                color: theme === 'dongzhu' ? '#5DADE2' : '#E74C3C',
                background: theme === 'dongzhu'
                  ? 'rgba(93, 173, 226, 0.1)'
                  : 'rgba(231, 76, 60, 0.1)',
                border: `1px solid ${theme === 'dongzhu' ? '#5DADE2' : '#E74C3C'}`
              }}
            >
              {video.date}
            </span>
            <span 
              className="text-xs font-semibold rounded-full px-3 py-1"
              style={{
                color: theme === 'dongzhu' ? '#5DADE2' : '#E74C3C',
                background: theme === 'dongzhu'
                  ? 'rgba(93, 173, 226, 0.1)'
                  : 'rgba(231, 76, 60, 0.1)',
                border: `1px solid ${theme === 'dongzhu' ? '#5DADE2' : '#E74C3C'}`
              }}
            >
              ⏱️ {video.duration}
            </span>
          </div>

          {/* 视频标题 */}
          <h2 
            className="text-2xl font-bold mb-4"
            style={{
              color: theme === 'dongzhu' ? '#2C3E50' : '#ECF0F1',
              textShadow: theme === 'dongzhu'
                ? '0 2px 4px rgba(93, 173, 226, 0.2)'
                : '0 2px 4px rgba(231, 76, 60, 0.2)'
            }}
          >
            {video.title}
          </h2>

          {/* 视频标签 */}
          <div className="flex flex-wrap gap-2">
            {video.tags.map((tag, index) => (
              <span 
                key={index}
                className="text-xs rounded-full px-3 py-1"
                style={{
                  color: theme === 'dongzhu' ? '#5DADE2' : '#E74C3C',
                  background: theme === 'dongzhu'
                    ? 'rgba(93, 173, 226, 0.1)'
                    : 'rgba(231, 76, 60, 0.1)',
                  border: `1px solid ${theme === 'dongzhu' ? '#5DADE2' : '#E74C3C'}`
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* 装饰元素 */}
        <div 
          className="absolute -top-20 -right-20 text-6xl opacity-10"
          style={{
            color: theme === 'dongzhu' ? '#5DADE2' : '#E74C3C'
          }}
        >
          {theme === 'dongzhu' ? '🐷' : '🐗'}
        </div>
        <div 
          className="absolute -bottom-20 -left-20 text-6xl opacity-10"
          style={{
            color: theme === 'dongzhu' ? '#5DADE2' : '#E74C3C'
          }}
        >
          {theme === 'dongzhu' ? '🐷' : '🐗'}
        </div>
      </div>
    </div>
  );
}
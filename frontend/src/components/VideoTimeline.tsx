import { useState } from 'react';
import type { Video } from '../data/videos';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface VideoTimelineProps {
  videos: Video[];
  theme: 'dongzhu' | 'kaige';
  onVideoClick: (video: Video) => void;
}

export function VideoTimeline({ videos, theme, onVideoClick }: VideoTimelineProps) {
  return (
    <div className="relative max-w-5xl mx-auto px-6 py-12">
      {/* 中央时间线 */}
      <div 
        className="absolute left-1/2 transform -translate-x-1/2 top-0 bottom-0 w-4 rounded-full"
        style={{
          background: theme === 'dongzhu'
            ? 'linear-gradient(180deg, #AED6F1, #5DADE2, #AED6F1)'
            : 'linear-gradient(180deg, #E74C3C, #C0392B, #E74C3C)',
          boxShadow: theme === 'dongzhu'
            ? '0 0 20px rgba(93, 173, 226, 0.5)'
            : '0 0 20px rgba(231, 76, 60, 0.5)'
        }}
      />

      {/* 视频列表 */}
      <div className="space-y-16">
        {videos.map((video, index) => {
          const isLeft = index % 2 === 0;
          return (
            <div 
              key={video.id} 
              className={`relative flex items-center ${isLeft ? 'justify-start' : 'justify-end'}`}
            >
              {/* 时间节点 */}
              <div 
                className="absolute left-1/2 transform -translate-x-1/2 z-10 flex items-center justify-center"
              >
                <div 
                  className="w-12 h-12 rounded-full theme-transition"
                  style={{
                    background: theme === 'dongzhu'
                      ? 'linear-gradient(135deg, #AED6F1, #5DADE2)'
                      : 'linear-gradient(135deg, #E74C3C, #C0392B)',
                    boxShadow: theme === 'dongzhu'
                      ? '0 0 15px rgba(93, 173, 226, 0.8)'
                      : '0 0 15px rgba(231, 76, 60, 0.8)'
                  }}
                >
                  <span className="text-white font-bold">{index + 1}</span>
                </div>
              </div>

              {/* 视频卡片 */}
              <div 
                className={`relative w-[45%] p-6 rounded-2xl theme-transition cursor-pointer hover:scale-[1.02] transition-transform duration-300 ease-out ${isLeft ? 'mr-auto ml-0' : 'ml-auto mr-0'}`}
                style={{
                  background: theme === 'dongzhu'
                    ? 'linear-gradient(135deg, rgba(255, 254, 247, 0.9), rgba(174, 214, 241, 0.9))'
                    : 'linear-gradient(135deg, rgba(22, 33, 62, 0.9), rgba(26, 26, 46, 0.9))',
                  backdropFilter: 'blur(10px)',
                  border: theme === 'dongzhu'
                    ? '2px solid #AED6F1'
                    : '2px solid #E74C3C',
                  boxShadow: theme === 'dongzhu'
                    ? '0 8px 32px rgba(93, 173, 226, 0.3)'
                    : '0 8px 32px rgba(231, 76, 60, 0.3)',
                  transform: isLeft ? 'translateX(-50%)' : 'translateX(50%)',
                }}
                onClick={() => onVideoClick(video)}
              >
                {/* 视频日期 */}
                <div 
                  className="mb-3 text-xs font-semibold rounded-full px-3 py-1 inline-block"
                  style={{
                    color: theme === 'dongzhu' ? '#5DADE2' : '#E74C3C',
                    background: theme === 'dongzhu'
                      ? 'rgba(93, 173, 226, 0.1)'
                      : 'rgba(231, 76, 60, 0.1)',
                    border: `1px solid ${theme === 'dongzhu' ? '#5DADE2' : '#E74C3C'}`
                  }}
                >
                  {video.date}
                </div>

                {/* 视频封面 */}
                <div className="relative rounded-xl overflow-hidden mb-4 group">
                  <ImageWithFallback
                    src={`https://i1.hdslb.com/bfs/archive/${video.cover}.jpg`}
                    alt={video.title}
                    className="w-full aspect-video object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                  />
                  {/* 播放按钮 */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-out">
                    <div 
                      className="w-16 h-16 rounded-full flex items-center justify-center"
                      style={{
                        background: 'rgba(255, 255, 255, 0.9)',
                        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)'
                      }}
                    >
                      <div 
                        className="w-0 h-0 border-t-6 border-t-transparent border-b-6 border-b-transparent"
                        style={{
                          borderLeft: `10px solid ${theme === "dongzhu" ? "#5DADE2" : "#E74C3C"}`
                        }}
                      />
                    </div>
                  </div>
                  {/* 视频时长 */}
                  <div 
                    className="absolute bottom-3 right-3 px-2 py-1 rounded text-xs font-semibold"
                    style={{
                      color: '#fff',
                      background: 'rgba(0, 0, 0, 0.7)'
                    }}
                  >
                    {video.duration}
                  </div>
                </div>

                {/* 视频标题 */}
                <h3 
                  className="text-lg font-bold mb-3 line-clamp-2 hover:text-opacity-80 transition-opacity duration-300"
                  style={{
                    color: theme === 'dongzhu' ? '#5D6D7E' : '#ECF0F1'
                  }}
                >
                  {video.title}
                </h3>

                {/* 视频标签 */}
                <div className="flex flex-wrap gap-2">
                  {video.tags.map((tag, tagIndex) => (
                    <span 
                      key={tagIndex}
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

                {/* 装饰角标 */}
                <div 
                  className="absolute -bottom-4 -right-4 text-3xl opacity-30"
                  style={{
                    color: theme === 'dongzhu' ? '#5DADE2' : '#E74C3C'
                  }}
                >
                  {theme === 'dongzhu' ? '🐷' : '🐗'}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
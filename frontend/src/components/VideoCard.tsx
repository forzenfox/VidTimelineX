import React from 'react';
import type { Video } from '../data/types';

interface VideoCardProps {
  /** 视频数据 */
  video: Video;
  /** 卡片点击事件处理函数 */
  onClick?: (video: Video) => void;
}

/**
 * 视频卡片组件 - 用于展示视频内容
 */
const VideoCard: React.FC<VideoCardProps> = ({ video, onClick }) => {
  return (
    <div
      className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border border-gray-100 cursor-pointer"
      onClick={() => onClick?.(video)}
    >
      {/* 视频缩略图 */}
      <div className="relative h-48 overflow-hidden bg-gray-100">
        <img
          src={video.thumbnail}
          alt={video.title}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
        />
        {/* 播放按钮覆盖层 */}
        <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
          <div className="w-16 h-16 bg-white bg-opacity-90 rounded-full flex items-center justify-center">
            <div className="w-0 h-0 border-t-6 border-t-transparent border-b-6 border-b-transparent border-l-10 border-l-red-600 ml-1"></div>
          </div>
        </div>
      </div>

      {/* 视频信息 */}
      <div className="p-5">
        {/* 视频标题 */}
        <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
          {video.title}
        </h3>

        {/* 视频描述 */}
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {video.description}
        </p>

        {/* 视频元信息 */}
        <div className="flex items-center justify-between text-xs text-gray-500">
          {/* 发布日期 */}
          <span>{video.date}</span>
          
          {/* 视频标签 */}
          <div className="flex flex-wrap gap-1">
            {video.tags.slice(0, 2).map((tag, index) => (
              <span
                key={index}
                className="bg-gray-100 px-2 py-1 rounded-full"
              >
                {tag}
              </span>
            ))}
            {video.tags.length > 2 && (
              <span className="bg-gray-100 px-2 py-1 rounded-full">
                +{video.tags.length - 2}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;
/**
 * OptimizedImage 组件
 * 首屏图片优化组件
 * - 首屏图片（index < 8）：eager 加载 + high priority
 * - 非首屏图片（index >= 8）：lazy 加载 + low priority
 */

import React, { useState, useCallback } from "react";

interface OptimizedImageProps {
  /** 图片 URL */
  src: string;
  /** 图片替代文本 */
  alt: string;
  /** 图片索引，用于判断是否在首屏 */
  index?: number;
  /** 自定义 CSS 类名 */
  className?: string;
  /** 图片宽度 */
  width?: number;
  /** 图片高度 */
  height?: number;
}

/**
 * 判断图片是否在首屏
 * 前 8 张图片视为首屏图片
 */
const isAboveFold = (index: number): boolean => {
  return index < 8;
};

/**
 * 优化的图片组件
 * 根据索引自动设置合适的 loading 和 priority 属性
 */
export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  index = 0,
  className = "",
  width,
  height,
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const aboveFold = isAboveFold(index);

  // 首屏图片：立即加载，高优先级
  // 非首屏图片：延迟加载，低优先级
  const loading = aboveFold ? "eager" : "lazy";
  const fetchPriority = aboveFold ? "high" : "low";
  const decoding = aboveFold ? "sync" : "async";

  const handleError = useCallback(() => {
    setHasError(true);
  }, []);

  const handleLoad = useCallback(() => {
    setIsLoaded(true);
  }, []);

  // 如果 src 为空，显示占位符
  if (!src) {
    return (
      <div
        data-testid="image-placeholder"
        className={`bg-gray-200 animate-pulse ${className}`}
        style={{ width, height }}
      />
    );
  }

  // 如果加载失败，显示 fallback
  if (hasError) {
    return (
      <div
        data-testid="image-fallback"
        className={`bg-gray-100 flex items-center justify-center ${className}`}
        style={{ width, height }}
      >
        <span className="text-gray-400 text-sm">图片加载失败</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading={loading}
      fetchPriority={fetchPriority}
      decoding={decoding}
      onError={handleError}
      onLoad={handleLoad}
      className={`transition-opacity duration-300 ${
        isLoaded ? "opacity-100" : "opacity-0"
      } ${className}`}
      width={width}
      height={height}
    />
  );
};

export default OptimizedImage;

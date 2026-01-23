import React, { useState } from 'react';

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  fallbackSrc?: string;
}

/**
 * 带降级显示的图片组件
 * 当主图片加载失败时，显示降级图片
 */
export const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  alt,
  fallbackSrc = 'https://via.placeholder.com/300x200?text=Video+Cover',
  ...props
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [imageSrc, setImageSrc] = useState(src);

  // 图片加载失败时使用降级图片
  const handleError = () => {
    setImageSrc(fallbackSrc);
    setIsLoading(false);
  };

  // 图片加载成功时的处理
  const handleLoad = () => {
    setIsLoading(false);
  };

  return (
    <img
      src={imageSrc}
      alt={alt}
      onError={handleError}
      onLoad={handleLoad}
      {...props}
    />
  );
};
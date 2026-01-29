import React, { useState, useEffect } from "react";

const ERROR_IMG_SRC =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODgiIGhlaWdodD0iODgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBvcGFjaXR5PSIuMyIgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIzLjciPjxyZWN0IHg9IjE2IiB5PSIxNiIgd2lkdGg9IjU2IiBoZWlnaHQ9IjU2IiByeD0iNiIvPjxwYXRoIGQ9Im0xNiA1OCAxNi0xOCAzMiAzMiIvPjxjaXJjbGUgY3g9IjUzIiBjeT0iMzUiIHI9IjciLz48L3N2Zz4KCg==";

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
}

export function ImageWithFallback({ src, alt, style, className, ...rest }: ImageWithFallbackProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // 处理图片URL，为哔哩哔哩图片添加代理
  const getProxiedImageUrl = (originalUrl: string) => {
    // 检测是否是哔哩哔哩图片URL
    const bilibiliRegex = /^https:\/\/(i\d+\.hdslb\.com|i\.hdslb\.com)\/bfs\//;
    if (bilibiliRegex.test(originalUrl)) {
      // 使用images.weserv.nl作为代理
      return `https://images.weserv.nl/?url=${encodeURIComponent(originalUrl)}`;
    }
    return originalUrl;
  };

  const handleError = () => {
    setHasError(true);
    setIsLoading(false);
  };

  const handleLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  if (isLoading) {
    return (
      <div className={`inline-block bg-gray-100 animate-pulse ${className ?? ""}`} style={style}>
        <div className="flex items-center justify-center w-full h-full" />
      </div>
    );
  }

  if (hasError) {
    return (
      <div
        className={`inline-block bg-gray-100 text-center align-middle ${className ?? ""}`}
        style={style}
      >
        <div className="flex items-center justify-center w-full h-full">
          <img src={ERROR_IMG_SRC} alt="Error loading image" {...rest} data-original-url={src} />
        </div>
      </div>
    );
  }

  const proxiedSrc = getProxiedImageUrl(src);

  return (
    <img
      src={proxiedSrc}
      alt={alt}
      className={className}
      style={style}
      onError={handleError}
      onLoad={handleLoad}
      {...rest}
    />
  );
}

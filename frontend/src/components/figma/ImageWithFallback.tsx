import React, { useState } from "react";

const ERROR_IMG_SRC =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODgiIGhlaWdodD0iODgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBvcGFjaXR5PSIuMyIgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIzLjciPjxyZWN0IHg9IjE2IiB5PSIxNiIgd2lkdGg9IjU2IiBoZWlnaHQ9IjU2IiByeD0iNiIvPjxwYXRoIGQ9Im0xNiA1OCAxNi0xOCAzMiAzMiIvPjxjaXJjbGUgY3g9IjUzIiBjeT0iMzUiIHI9IjciLz48L3N2Zz4KCg==";

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
}

declare global {
  interface Window {
    __BASE_URL__?: string;
  }
}

function getBaseUrl(): string {
  if (typeof window !== "undefined" && window.__BASE_URL__) {
    return window.__BASE_URL__;
  }

  if (typeof window !== "undefined" && window.location.pathname) {
    const pathname = window.location.pathname;
    const match = pathname.match(/^\/([^/]+)/);
    if (match && match[1]) {
      return `/${match[1]}/`;
    }
  }

  return "/";
}

export function ImageWithFallback({ src, alt, style, className, ...rest }: ImageWithFallbackProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const getLocalImageUrl = (filename: string) => {
    const baseUrl = getBaseUrl();
    return `${baseUrl}thumbs/${filename}`;
  };

  const handleError = () => {
    setHasError(true);
    setIsLoading(false);
  };

  const handleLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const imageSrc = getLocalImageUrl(src);

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

  return (
    <>
      {isLoading && (
        <div
          className={`absolute inset-0 bg-gray-100 animate-pulse ${className ?? ""}`}
          style={style}
        >
          <div className="flex items-center justify-center w-full h-full" />
        </div>
      )}
      <img
        src={imageSrc}
        alt={alt}
        className={className}
        style={style}
        onError={handleError}
        onLoad={handleLoad}
        {...rest}
      />
    </>
  );
}

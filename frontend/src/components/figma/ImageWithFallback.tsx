import React, { useState, useEffect, useCallback } from "react";

const ERROR_IMG_SRC =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODgiIGhlaWdodD0iODgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBvcGFjaXR5PSIuMyIgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIzLjciPjxyZWN0IHg9IjE2IiB5PSIxNiIgd2lkdGg9IjU2IiBoZWlnaHQ9IjU2IiByeD0iNiIvPjxwYXRoIGQ9Im0xNiA1OCAxNi0xOCAzMiAzMiIvPjxjaXJjbGUgY3g9IjUzIiBjeT0iMzUiIHI9IjciLz48L3N2Zz4KCg==";

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  fallbackSrc?: string;
  priorityLoad?: boolean;
  lazy?: boolean;
  crossOrigin?: "anonymous" | "use-credentials" | "";
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

function getLocalImageUrl(filename: string): string {
  if (!filename) return "";
  const baseUrl = getBaseUrl();
  if (filename.startsWith("http://") || filename.startsWith("https://")) {
    return filename;
  }
  if (filename.startsWith("/")) {
    return filename;
  }
  return `${baseUrl}thumbs/${filename}`;
}

function isExternalUrl(url: string): boolean {
  return url.startsWith("http://") || url.startsWith("https://");
}

function isBilibiliCdn(url: string): boolean {
  return url.includes("hdslb.com") || url.includes("bilibili.com") || url.includes("bilivideo.com");
}

interface CorsStatus {
  tried: boolean;
  failed: boolean;
  message?: string;
}

function getInitialSrc(src: string, fallbackSrc: string, priorityLoad: boolean): string {
  if (!src && !fallbackSrc) {
    return "";
  }

  if (priorityLoad && src) {
    if (isExternalUrl(src)) {
      return src;
    } else if (fallbackSrc && isExternalUrl(fallbackSrc)) {
      return fallbackSrc;
    } else {
      return getLocalImageUrl(src);
    }
  } else {
    if (src) {
      return getLocalImageUrl(src);
    } else if (fallbackSrc) {
      return getLocalImageUrl(fallbackSrc);
    }
  }
  return "";
}

export function ImageWithFallback({
  src,
  alt,
  fallbackSrc,
  priorityLoad = false,
  lazy = false,
  crossOrigin = "",
  style,
  className,
  ...rest
}: ImageWithFallbackProps) {
  const [currentSrc, setCurrentSrc] = useState<string>(() =>
    getInitialSrc(src || "", fallbackSrc || "", priorityLoad)
  );
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [fallbackUsed, setFallbackUsed] = useState(
    priorityLoad && src && !isExternalUrl(src) && fallbackSrc && isExternalUrl(fallbackSrc)
  );
  const [corsStatus, setCorsStatus] = useState<CorsStatus>({ tried: false, failed: false });

  const handleCorsError = useCallback(() => {
    console.debug(`[Image] 跨域加载失败，尝试回退: ${currentSrc}`);
    setCorsStatus({ tried: true, failed: true, message: "跨域被拒绝" });

    if (priorityLoad && src && !isExternalUrl(src)) {
      const localUrl = getLocalImageUrl(src);
      console.debug(`[Image] 优先加载CDN失败，回退到本地图片: ${localUrl}`);
      setCurrentSrc(localUrl);
      setFallbackUsed(true);
      setHasError(false);
      setCorsStatus({ tried: false, failed: false });
    } else if (!fallbackUsed && fallbackSrc && !isExternalUrl(fallbackSrc)) {
      const fallbackUrl = getLocalImageUrl(fallbackSrc);
      console.debug(`[Image] 回退到本地备用图片: ${fallbackUrl}`);
      setCurrentSrc(fallbackUrl);
      setFallbackUsed(true);
      setHasError(false);
      setCorsStatus({ tried: false, failed: false });
    } else if (!fallbackUsed && src) {
      const localUrl = getLocalImageUrl(src);
      if (localUrl !== currentSrc) {
        console.debug(`[Image] 回退到本地图片: ${localUrl}`);
        setCurrentSrc(localUrl);
        setFallbackUsed(true);
        setHasError(false);
        setCorsStatus({ tried: false, failed: false });
      } else {
        setHasError(true);
        setIsLoading(false);
      }
    } else {
      setHasError(true);
      setIsLoading(false);
    }
  }, [currentSrc, fallbackSrc, fallbackUsed, src, priorityLoad]);

  const handleError = useCallback(() => {
    const isExternalCurrentSrc = isExternalUrl(currentSrc);
    const isCdnCurrentSrc = isExternalCurrentSrc && isBilibiliCdn(currentSrc);

    if (isCdnCurrentSrc) {
      handleCorsError();
      return;
    }

    if (!fallbackUsed && src && !isExternalUrl(src)) {
      const localUrl = getLocalImageUrl(src);
      if (localUrl !== currentSrc) {
        console.debug(`[Image] 加载失败，回退到本地图片: ${localUrl}`);
        setCurrentSrc(localUrl);
        setFallbackUsed(true);
        setHasError(false);
        return;
      }
    }

    if (!fallbackUsed && fallbackSrc && !isExternalUrl(fallbackSrc)) {
      const fallbackUrl = getLocalImageUrl(fallbackSrc);
      console.debug(`[Image] 加载失败，回退到本地备用图片: ${fallbackUrl}`);
      setCurrentSrc(fallbackUrl);
      setFallbackUsed(true);
      setHasError(false);
    } else {
      setHasError(true);
      setIsLoading(false);
    }
  }, [fallbackSrc, fallbackUsed, handleCorsError, src, currentSrc]);

  const handleLoad = useCallback(() => {
    setIsLoading(false);
    setHasError(false);
    if (corsStatus.failed) {
      setCorsStatus({ tried: false, failed: false });
    }
  }, [corsStatus]);

  const effectiveCrossOrigin = isExternalUrl(currentSrc) ? crossOrigin || "anonymous" : "";

  if (hasError || !currentSrc) {
    return (
      <div
        className={`inline-block bg-gray-100 text-center align-middle ${className ?? ""}`}
        style={style}
      >
        <div className="flex items-center justify-center w-full h-full">
          <img
            src={ERROR_IMG_SRC}
            alt={alt || "Error loading image"}
            data-original-url={src || fallbackSrc}
            {...rest}
          />
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
        src={currentSrc}
        alt={alt}
        className={className}
        style={style}
        loading={lazy ? "lazy" : undefined}
        decoding={lazy ? "async" : undefined}
        crossOrigin={effectiveCrossOrigin}
        data-image-source={
          hasError
            ? "error"
            : fallbackUsed
              ? "fallback"
              : isExternalUrl(currentSrc)
                ? "external"
                : "local"
        }
        data-image-url={currentSrc}
        data-cors-status={corsStatus.tried ? "cors-failed" : "ok"}
        onError={handleError}
        onLoad={handleLoad}
        {...rest}
      />
    </>
  );
}

interface VideoCoverProps {
  cover_url?: string;
  cover: string;
  alt: string;
  className?: string;
  priorityLoad?: boolean;
}

export function VideoCover({
  cover_url,
  cover,
  alt,
  className,
  priorityLoad = true,
}: VideoCoverProps) {
  return (
    <ImageWithFallback
      src={cover}
      fallbackSrc={cover_url}
      alt={alt}
      className={className}
      priorityLoad={priorityLoad}
      lazy={true}
    />
  );
}

interface CanvasImageProps extends React.CanvasHTMLAttributes<HTMLCanvasElement> {
  cover_url?: string;
  cover: string;
  alt: string;
  onLoadSuccess?: (canvas: HTMLCanvasElement) => void;
  onLoadError?: (error: Error) => void;
}

export function CanvasImage({
  cover_url,
  cover,
  alt,
  onLoadSuccess,
  onLoadError,
  className,
  style,
  ...props
}: CanvasImageProps) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = "anonymous";

    const loadImage = (url: string) => {
      img.onload = () => {
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        onLoadSuccess?.(canvas);
      };

      img.onerror = () => {
        if (url === cover_url && cover) {
          loadImage(getLocalImageUrl(cover));
        } else {
          const error = new Error("图片加载失败");
          setHasError(true);
          setErrorMessage("所有图片源加载失败");
          onLoadError?.(error);
        }
      };

      img.src = url;
    };

    if (cover_url && isExternalUrl(cover_url)) {
      loadImage(cover_url);
    } else {
      loadImage(getLocalImageUrl(cover));
    }
  }, [cover_url, cover, onLoadSuccess, onLoadError]);

  if (hasError) {
    return (
      <div className={`bg-gray-100 text-center align-middle ${className ?? ""}`} style={style}>
        <div className="flex items-center justify-center w-full h-full p-4 text-red-500 text-sm">
          {errorMessage}
        </div>
      </div>
    );
  }

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={style}
      data-image-source={isExternalUrl(cover_url || cover) ? "external" : "local"}
      {...props}
    />
  );
}

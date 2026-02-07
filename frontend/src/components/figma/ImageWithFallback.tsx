import React, { useState, useEffect, useCallback } from "react";
import { getJsdelivrImageUrl } from "@/utils/cdn";

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

/**
 * 获取 jsDelivr CDN 图片 URL
 * 当启用 CDN 时，优先使用 jsDelivr 加速
 */
function getCdnImageUrl(filename: string): string {
  if (!filename) return "";
  if (filename.startsWith("http://") || filename.startsWith("https://")) {
    return filename;
  }

  // 检查是否启用 jsDelivr CDN
  const useJsdelivr = typeof window !== "undefined" && window.__USE_JSDELIVR_CDN__;

  if (useJsdelivr) {
    return getJsdelivrImageUrl(filename);
  }

  return getLocalImageUrl(filename);
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

  // 检查是否启用 jsDelivr CDN
  const useJsdelivr = typeof window !== "undefined" && window.__USE_JSDELIVR_CDN__;

  if (priorityLoad && src) {
    // 优先级1: jsDelivr CDN（如果启用）
    if (useJsdelivr && !isExternalUrl(src)) {
      return getJsdelivrImageUrl(src);
    }
    // 优先级2: B站CDN（外部URL）
    if (isExternalUrl(src)) {
      return src;
    }
    // 优先级3: fallbackSrc（B站CDN）
    if (fallbackSrc && isExternalUrl(fallbackSrc)) {
      return fallbackSrc;
    }
    // 优先级4: 本地图片
    return getLocalImageUrl(src);
  } else {
    // 非优先加载模式：先尝试本地/jsDelivr，失败后再尝试B站CDN
    if (src) {
      if (useJsdelivr && !isExternalUrl(src)) {
        return getJsdelivrImageUrl(src);
      }
      return getLocalImageUrl(src);
    } else if (fallbackSrc) {
      return getCdnImageUrl(fallbackSrc);
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

    // 检查当前是否在使用 jsDelivr CDN
    const useJsdelivr = typeof window !== "undefined" && window.__USE_JSDELIVR_CDN__;

    if (useJsdelivr && src && currentSrc.includes("cdn.jsdelivr.net")) {
      // jsDelivr 失败，优先回退到 B站CDN（如果有）
      if (fallbackSrc && isExternalUrl(fallbackSrc) && !fallbackUsed) {
        console.debug(`[Image] jsDelivr CDN 失败，回退到 B站CDN: ${fallbackSrc}`);
        setCurrentSrc(fallbackSrc);
        setFallbackUsed(true);
        setHasError(false);
        setCorsStatus({ tried: false, failed: false });
      } else {
        // 没有 B站CDN，回退到本地图片
        const localUrl = getLocalImageUrl(src);
        console.debug(`[Image] jsDelivr CDN 失败，回退到本地图片: ${localUrl}`);
        setCurrentSrc(localUrl);
        setFallbackUsed(true);
        setHasError(false);
        setCorsStatus({ tried: false, failed: false });
      }
    } else if (priorityLoad && src && !isExternalUrl(src)) {
      // B站CDN 失败，回退到本地图片
      const localUrl = getLocalImageUrl(src);
      console.debug(`[Image] B站CDN 失败，回退到本地图片: ${localUrl}`);
      setCurrentSrc(localUrl);
      setFallbackUsed(true);
      setHasError(false);
      setCorsStatus({ tried: false, failed: false });
    } else if (!fallbackUsed && fallbackSrc && !isExternalUrl(fallbackSrc)) {
      const fallbackUrl = getCdnImageUrl(fallbackSrc);
      console.debug(`[Image] 回退到备用图片: ${fallbackUrl}`);
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
    const isBilibiliCdnSrc = isExternalCurrentSrc && isBilibiliCdn(currentSrc);
    const isJsdelivrSrc = currentSrc.includes("cdn.jsdelivr.net");

    // B站CDN 或 jsDelivr CDN 跨域失败
    if (isBilibiliCdnSrc || isJsdelivrSrc) {
      handleCorsError();
      return;
    }

    // 检查是否在使用 CDN
    const useJsdelivr = typeof window !== "undefined" && window.__USE_JSDELIVR_CDN__;

    if (!fallbackUsed && src && !isExternalUrl(src)) {
      // 如果当前是本地图片失败，尝试 CDN
      if (useJsdelivr && !currentSrc.includes("cdn.jsdelivr.net")) {
        const cdnUrl = getJsdelivrImageUrl(src);
        console.debug(`[Image] 本地图片失败，尝试 jsDelivr CDN: ${cdnUrl}`);
        setCurrentSrc(cdnUrl);
        setFallbackUsed(true);
        setHasError(false);
        return;
      }

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
      const fallbackUrl = getCdnImageUrl(fallbackSrc);
      console.debug(`[Image] 加载失败，回退到备用图片: ${fallbackUrl}`);
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
              : currentSrc.includes("cdn.jsdelivr.net")
                ? "jsdelivr"
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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

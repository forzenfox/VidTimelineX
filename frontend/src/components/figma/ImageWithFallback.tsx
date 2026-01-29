import React, { useState, useEffect } from "react";

const ERROR_IMG_SRC =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODgiIGhlaWdodD0iODgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBvcGFjaXR5PSIuMyIgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIzLjciPjxyZWN0IHg9IjE2IiB5PSIxNiIgd2lkdGg9IjU2IiBoZWlnaHQ9IjU2IiByeD0iNiIvPjxwYXRoIGQ9Im0xNiA1OCAxNi0xOCAzMiAzMiIvPjxjaXJjbGUgY3g9IjUzIiBjeT0iMzUiIHI9IjciLz48L3N2Zz4KCg==";

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
}

function useProxyUrl(originalUrl: string): string {
  const [proxyUrl, setProxyUrl] = React.useState<string>(originalUrl);

  useEffect(() => {
    if (originalUrl.includes("hdslb.com")) {
      const url = new URL(originalUrl);
      const path = url.pathname + url.search;
      setProxyUrl(`/bilibili-img${path}`);
    } else if (originalUrl.includes("unsplash.com")) {
      const url = new URL(originalUrl);
      const path = url.pathname + url.search;
      setProxyUrl(`/unsplash${path}`);
    } else {
      setProxyUrl(originalUrl);
    }
  }, [originalUrl]);

  return proxyUrl;
}

export function ImageWithFallback({ src, alt, style, className, ...rest }: ImageWithFallbackProps) {
  const [didError, setDidError] = useState(false);
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const proxySrc = useProxyUrl(src);

  useEffect(() => {
    let isMounted = true;

    const fetchImage = async () => {
      try {
        const response = await fetch(proxySrc);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const blob = await response.blob();

        if (isMounted) {
          const url = URL.createObjectURL(blob);
          setBlobUrl(url);
          setIsLoading(false);
        }
      } catch {
        if (isMounted) {
          setDidError(true);
          setIsLoading(false);
        }
      }
    };

    fetchImage();

    return () => {
      isMounted = false;
      if (blobUrl) {
        URL.revokeObjectURL(blobUrl);
      }
    };
  }, [proxySrc]);

  if (didError) {
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

  if (isLoading || !blobUrl) {
    return (
      <div
        className={`inline-block bg-gray-100 animate-pulse ${className ?? ""}`}
        style={style}
      >
        <div className="flex items-center justify-center w-full h-full" />
      </div>
    );
  }

  return <img src={blobUrl} alt={alt} className={className} style={style} {...rest} />;
}

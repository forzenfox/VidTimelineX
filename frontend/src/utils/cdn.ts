/**
 * CDN 工具模块
 * 提供 jsDelivr CDN URL 生成和图片访问性检查功能
 */

// jsDelivr CDN 配置
// 注意：请确保与 GitHub 仓库地址一致
// 当前仓库: git@github.com:forzenfox/VidTimelineX.git
const JSDELIVR_CONFIG = {
  baseUrl: "https://cdn.jsdelivr.net/gh",
  owner: "forzenfox",
  repo: "VidTimelineX",
  branch: "master",
};

/**
 * 生成 jsDelivr CDN URL
 * @param path - 文件路径（相对于仓库根目录）
 * @returns jsDelivr CDN URL
 * @example
 * getJsdelivrUrl("frontend/public/thumbs/BV1BofDBpESU.webp")
 * // 返回: https://cdn.jsdelivr.net/gh/forzenfox/VidTimelineX@master/frontend/public/thumbs/BV1BofDBpESU.webp
 */
export function getJsdelivrUrl(path: string): string {
  // 移除开头的斜杠
  const cleanPath = path.startsWith("/") ? path.slice(1) : path;
  const { baseUrl, owner, repo, branch } = JSDELIVR_CONFIG;
  return `${baseUrl}/${owner}/${repo}@${branch}/${cleanPath}`;
}

/**
 * 获取图片的 jsDelivr CDN URL
 * @param filename - 图片文件名
 * @returns jsDelivr CDN URL
 * @example
 * getJsdelivrImageUrl("BV1BofDBpESU.webp")
 * // 返回: https://cdn.jsdelivr.net/gh/forzenfox/VidTimelineX@master/frontend/public/thumbs/BV1BofDBpESU.webp
 */
export function getJsdelivrImageUrl(filename: string): string {
  return getJsdelivrUrl(`frontend/public/thumbs/${filename}`);
}

/**
 * 获取网站图标的 jsDelivr CDN URL
 * @param filename - 图标文件名
 * @returns jsDelivr CDN URL
 * @example
 * getJsdelivrFaviconUrl("favicon-32x32.png")
 * // 返回: https://cdn.jsdelivr.net/gh/forzenfox/VidTimelineX@master/frontend/public/favicon-32x32.png
 */
export function getJsdelivrFaviconUrl(filename: string): string {
  return getJsdelivrUrl(`frontend/public/${filename}`);
}

/**
 * 检查图片是否可以通过 jsDelivr 访问
 * @param url - 图片 URL
 * @param timeout - 超时时间（毫秒），默认 10000
 * @returns 图片访问性检查结果
 */
export async function checkImageAccessibility(
  url: string,
  timeout: number = 10000
): Promise<ImageAccessibilityResult> {
  const startTime = Date.now();

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    const response = await fetch(url, {
      method: "HEAD",
      signal: controller.signal,
      headers: {
        Accept: "image/webp,image/apng,image/*,*/*;q=0.8",
      },
    });

    clearTimeout(timeoutId);

    const endTime = Date.now();
    const responseTime = endTime - startTime;

    if (!response.ok) {
      return {
        accessible: false,
        statusCode: response.status,
        statusText: response.statusText,
        responseTime,
        contentType: response.headers.get("content-type"),
        error: `HTTP ${response.status}: ${response.statusText}`,
      };
    }

    const contentType = response.headers.get("content-type");
    const contentLength = response.headers.get("content-length");

    // 验证是否为图片类型
    const isImage = contentType?.startsWith("image/") ?? false;

    return {
      accessible: true,
      statusCode: response.status,
      statusText: response.statusText,
      responseTime,
      contentType,
      contentLength: contentLength ? parseInt(contentLength, 10) : null,
      isImage,
    };
  } catch (error) {
    const endTime = Date.now();
    const responseTime = endTime - startTime;

    let errorMessage = "未知错误";
    if (error instanceof Error) {
      if (error.name === "AbortError") {
        errorMessage = `请求超时（>${timeout}ms）`;
      } else {
        errorMessage = error.message;
      }
    }

    return {
      accessible: false,
      statusCode: 0,
      statusText: "Error",
      responseTime,
      contentType: null,
      error: errorMessage,
    };
  }
}

/**
 * 图片访问性检查结果接口
 */
export interface ImageAccessibilityResult {
  accessible: boolean;
  statusCode: number;
  statusText: string;
  responseTime: number;
  contentType: string | null;
  contentLength?: number | null;
  isImage?: boolean;
  error?: string;
}

/**
 * 批量检查图片访问性
 * @param urls - 图片 URL 数组
 * @returns 每个 URL 的访问性结果
 */
export async function checkImagesAccessibility(
  urls: string[]
): Promise<Map<string, ImageAccessibilityResult>> {
  const results = new Map<string, ImageAccessibilityResult>();

  // 串行检查以避免并发请求过多
  for (const url of urls) {
    const result = await checkImageAccessibility(url);
    results.set(url, result);
  }

  return results;
}

/**
 * 获取优化的图片 URL
 * 根据环境变量决定是否使用 jsDelivr CDN
 * @param filename - 图片文件名
 * @param localBaseUrl - 本地图片基础 URL
 * @returns 最优的图片 URL
 */
export function getOptimizedImageUrl(filename: string, localBaseUrl: string = "/"): string {
  // 检查是否启用 jsDelivr CDN
  // 使用 window 对象作为备选，以兼容测试环境
  const useJsdelivr =
    (typeof window !== "undefined" &&
      (window as Window & { __USE_JSDELIVR_CDN__?: boolean }).__USE_JSDELIVR_CDN__) ||
    false;

  if (useJsdelivr) {
    return getJsdelivrImageUrl(filename);
  }

  // 使用本地 URL
  const base = localBaseUrl.endsWith("/") ? localBaseUrl : `${localBaseUrl}/`;
  return `${base}thumbs/${filename}`;
}

/**
 * 预加载图片
 * @param url - 图片 URL
 * @returns Promise，图片加载成功时 resolve，失败时 reject
 */
export function preloadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";

    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load image: ${url}`));

    img.src = url;
  });
}

/**
 * 测试 jsDelivr CDN 连接
 * @returns CDN 连接测试结果
 */
export async function testJsdelivrConnection(): Promise<{
  success: boolean;
  message: string;
  responseTime?: number;
}> {
  const testUrl = getJsdelivrUrl("frontend/public/favicon.ico");
  const result = await checkImageAccessibility(testUrl, 5000);

  if (result.accessible) {
    return {
      success: true,
      message: `jsDelivr CDN 连接正常，响应时间: ${result.responseTime}ms`,
      responseTime: result.responseTime,
    };
  } else {
    return {
      success: false,
      message: `jsDelivr CDN 连接失败: ${result.error}`,
    };
  }
}

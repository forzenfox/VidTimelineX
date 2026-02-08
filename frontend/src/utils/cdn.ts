/**
 * CDN 工具模块
 * 提供 jsDelivr CDN、JSDMirror 镜像 URL 生成和图片访问性检查功能
 *
 * 智能 CDN 选择策略：
 * - 中国大陆用户：使用 JSDMirror (cdn.jsdmirror.com)
 * - 海外用户：使用 jsDelivr (cdn.jsdelivr.net)
 */

// CDN 配置
// 注意：请确保与 GitHub 仓库地址一致
// 当前仓库: git@github.com:forzenfox/VidTimelineX.git
const CDN_CONFIG = {
  jsdelivr: {
    name: "jsdelivr",
    baseUrl: "https://cdn.jsdelivr.net/gh",
    owner: "forzenfox",
    repo: "VidTimelineX",
    branch: "master",
  },
  jsdMirror: {
    name: "jsdmirror",
    baseUrl: "https://cdn.jsdmirror.com/gh",
    owner: "forzenfox",
    repo: "VidTimelineX",
    branch: "master",
  },
};

// 缓存地理位置检测结果
let cachedLocation: "china" | "global" | null = null;

/**
 * 检测是否在中国大陆
 * 方法：通过时区 + 语言综合判断
 * @returns 是否在中国大陆
 */
export function isInMainlandChina(): boolean {
  // 如果有缓存结果，直接返回
  if (cachedLocation) {
    return cachedLocation === "china";
  }

  // 方法1: 时区检测
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  if (
    timezone === "Asia/Shanghai" ||
    timezone === "Asia/Chongqing" ||
    timezone === "Asia/Hong_Kong"
  ) {
    cachedLocation = "china";
    return true;
  }

  // 方法2: 语言检测
  const lang = navigator.language.toLowerCase();
  if (lang === "zh-cn") {
    cachedLocation = "china";
    return true;
  }

  // 方法3: 时区偏移检测 (UTC+8 且在中国时区)
  const offset = new Date().getTimezoneOffset();
  if (offset === -480 && timezone.includes("Asia")) {
    cachedLocation = "china";
    return true;
  }

  cachedLocation = "global";
  return false;
}

/**
 * 获取当前使用的 CDN 配置
 * @returns 当前 CDN 配置
 */
export function getCurrentCdnConfig() {
  const isChina = isInMainlandChina();
  return isChina ? CDN_CONFIG.jsdMirror : CDN_CONFIG.jsdelivr;
}

/**
 * 生成 CDN URL
 * 自动根据用户地理位置选择 jsDelivr 或 JSDMirror
 * @param path - 文件路径（相对于仓库根目录）
 * @returns CDN URL
 * @example
 * getCdnUrl("frontend/public/thumbs/BV1BofDBpESU.webp")
 * // 中国大陆返回: https://cdn.jsdmirror.com/gh/forzenfox/VidTimelineX@master/frontend/public/thumbs/BV1BofDBpESU.webp
 * // 海外返回: https://cdn.jsdelivr.net/gh/forzenfox/VidTimelineX@master/frontend/public/thumbs/BV1BofDBpESU.webp
 */
export function getCdnUrl(path: string): string {
  const config = getCurrentCdnConfig();
  const cleanPath = path.startsWith("/") ? path.slice(1) : path;
  return `${config.baseUrl}/${config.owner}/${config.repo}@${config.branch}/${cleanPath}`;
}

/**
 * 生成 jsDelivr CDN URL（原始方法，保留兼容性）
 * @param path - 文件路径（相对于仓库根目录）
 * @returns jsDelivr CDN URL
 * @example
 * getJsdelivrUrl("frontend/public/thumbs/BV1BofDBpESU.webp")
 * // 返回: https://cdn.jsdelivr.net/gh/forzenfox/VidTimelineX@master/frontend/public/thumbs/BV1BofDBpESU.webp
 */
export function getJsdelivrUrl(path: string): string {
  const cleanPath = path.startsWith("/") ? path.slice(1) : path;
  const { baseUrl, owner, repo, branch } = CDN_CONFIG.jsdelivr;
  return `${baseUrl}/${owner}/${repo}@${branch}/${cleanPath}`;
}

/**
 * 生成 JSDMirror CDN URL（国内镜像）
 * @param path - 文件路径（相对于仓库根目录）
 * @returns JSDMirror CDN URL
 * @example
 * getJsdMirrorUrl("frontend/public/thumbs/BV1BofDBpESU.webp")
 * // 返回: https://cdn.jsdmirror.com/gh/forzenfox/VidTimelineX@master/frontend/public/thumbs/BV1BofDBpESU.webp
 */
export function getJsdMirrorUrl(path: string): string {
  const cleanPath = path.startsWith("/") ? path.slice(1) : path;
  const { baseUrl, owner, repo, branch } = CDN_CONFIG.jsdMirror;
  return `${baseUrl}/${owner}/${repo}@${branch}/${cleanPath}`;
}

/**
 * 获取图片的 CDN URL
 * 自动根据用户地理位置选择最佳 CDN
 * @param filename - 图片文件名
 * @returns CDN URL
 * @example
 * getCdnImageUrl("BV1BofDBpESU.webp")
 * // 中国大陆返回: https://cdn.jsdmirror.com/gh/forzenfox/VidTimelineX@master/frontend/public/thumbs/BV1BofDBpESU.webp
 * // 海外返回: https://cdn.jsdelivr.net/gh/forzenfox/VidTimelineX@master/frontend/public/thumbs/BV1BofDBpESU.webp
 */
export function getCdnImageUrl(filename: string): string {
  return getCdnUrl(`frontend/public/thumbs/${filename}`);
}

/**
 * 获取图片的 jsDelivr CDN URL（原始方法，保留兼容性）
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
 * 获取图片的 JSDMirror CDN URL（国内镜像）
 * @param filename - 图片文件名
 * @returns JSDMirror CDN URL
 * @example
 * getJsdMirrorImageUrl("BV1BofDBpESU.webp")
 * // 返回: https://cdn.jsdmirror.com/gh/forzenfox/VidTimelineX@master/frontend/public/thumbs/BV1BofDBpESU.webp
 */
export function getJsdMirrorImageUrl(filename: string): string {
  return getJsdMirrorUrl(`frontend/public/thumbs/${filename}`);
}

/**
 * 获取网站图标的 CDN URL
 * 自动根据用户地理位置选择最佳 CDN
 * @param filename - 图标文件名
 * @returns CDN URL
 */
export function getCdnFaviconUrl(filename: string): string {
  return getCdnUrl(`frontend/public/${filename}`);
}

/**
 * 获取网站图标的 jsDelivr CDN URL（原始方法，保留兼容性）
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
 * 获取网站图标的 JSDMirror CDN URL（国内镜像）
 * @param filename - 图标文件名
 * @returns JSDMirror CDN URL
 */
export function getJsdMirrorFaviconUrl(filename: string): string {
  return getJsdMirrorUrl(`frontend/public/${filename}`);
}

/**
 * 检查图片是否可以通过 CDN 访问
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
 * 根据环境变量和用户地理位置决定使用哪个 CDN
 * @param filename - 图片文件名
 * @param localBaseUrl - 本地图片基础 URL
 * @returns 最优的图片 URL
 */
export function getOptimizedImageUrl(filename: string, localBaseUrl: string = "/"): string {
  // 检查是否启用 CDN
  const useCdn =
    (typeof window !== "undefined" &&
      (window as Window & { __USE_JSDELIVR_CDN__?: boolean }).__USE_JSDELIVR_CDN__) ||
    false;

  if (useCdn) {
    // 自动选择最佳 CDN（根据地理位置）
    return getCdnImageUrl(filename);
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
 * 测试 CDN 连接
 * 自动检测当前使用的 CDN 并测试连接
 * @returns CDN 连接测试结果
 */
export async function testCdnConnection(): Promise<{
  cdn: "jsdelivr" | "jsdmirror";
  success: boolean;
  message: string;
  responseTime?: number;
}> {
  const config = getCurrentCdnConfig();
  const testUrl = getCdnUrl("frontend/public/favicon.ico");
  const result = await checkImageAccessibility(testUrl, 5000);

  return {
    cdn: config.name as "jsdelivr" | "jsdmirror",
    success: result.accessible,
    message: result.accessible
      ? `${config.name} CDN 连接正常，响应时间: ${result.responseTime}ms`
      : `${config.name} CDN 连接失败: ${result.error}`,
    responseTime: result.responseTime,
  };
}

/**
 * 测试 jsDelivr CDN 连接（原始方法，保留兼容性）
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

/**
 * 测试 JSDMirror CDN 连接
 * @returns CDN 连接测试结果
 */
export async function testJsdMirrorConnection(): Promise<{
  success: boolean;
  message: string;
  responseTime?: number;
}> {
  const testUrl = getJsdMirrorUrl("frontend/public/favicon.ico");
  const result = await checkImageAccessibility(testUrl, 5000);

  if (result.accessible) {
    return {
      success: true,
      message: `JSDMirror CDN 连接正常，响应时间: ${result.responseTime}ms`,
      responseTime: result.responseTime,
    };
  } else {
    return {
      success: false,
      message: `JSDMirror CDN 连接失败: ${result.error}`,
    };
  }
}

/**
 * 获取 CDN 诊断信息
 * 用于调试和监控
 * @returns CDN 诊断信息
 */
export function getCdnDiagnostics(): {
  location: "china" | "global";
  cdn: string;
  timezone: string;
  language: string;
} {
  return {
    location: isInMainlandChina() ? "china" : "global",
    cdn: getCurrentCdnConfig().name,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    language: navigator.language,
  };
}

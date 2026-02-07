/**
 * 图片预加载工具函数
 * 提供首屏图片预加载功能
 */

import { getCdnImageUrl } from "./cdn";

/**
 * 从图片列表中提取首屏图片（前 8 张）
 * @param images - 图片列表
 * @returns 首屏图片列表
 */
export function getAboveFoldImages<T extends { filename: string }>(images: T[]): T[] {
  return images.slice(0, 8);
}

/**
 * 生成预加载链接 HTML 字符串
 * @param filenames - 图片文件名列表
 * @returns 预加载链接 HTML 字符串数组
 */
export function generatePreloadLinks(filenames: string[]): string[] {
  // 最多预加载 4 张图片
  const maxPreload = 4;
  const filesToPreload = filenames.slice(0, maxPreload);

  return filesToPreload.map(filename => {
    const cdnUrl = getCdnImageUrl(filename);
    return `<link rel="preload" as="image" href="${cdnUrl}" fetchpriority="high">`;
  });
}

/**
 * 将预加载链接注入到 document.head
 * @param links - 预加载链接 HTML 字符串数组
 */
export function injectPreloadLinks(links: string[]): void {
  if (typeof document === "undefined") {
    return;
  }

  links.forEach(linkHtml => {
    // 提取 href
    const hrefMatch = linkHtml.match(/href="([^"]+)"/);
    if (!hrefMatch) return;

    const href = hrefMatch[1];

    // 检查是否已存在相同的预加载链接
    const existingLink = document.querySelector(`link[rel="preload"][href="${href}"]`);
    if (existingLink) {
      return;
    }

    // 创建并注入链接
    const link = document.createElement("link");
    link.rel = "preload";
    link.as = "image";
    link.href = href;
    link.fetchPriority = "high";

    document.head.appendChild(link);
  });
}

/**
 * 预加载单张图片
 * @param url - 图片 URL
 * @returns Promise，预加载成功时 resolve
 */
export function preloadImage(url: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image();

    img.onload = () => resolve();
    img.onerror = () => reject(new Error(`Failed to preload image: ${url}`));

    img.src = url;
  });
}

/**
 * 批量预加载图片
 * @param urls - 图片 URL 数组
 * @returns Promise，所有图片预加载完成时 resolve
 */
export async function preloadImages(urls: string[]): Promise<void> {
  const promises = urls.map(url => preloadImage(url));
  await Promise.all(promises);
}

/**
 * 自动预加载首屏图片
 * 从图片列表中提取首屏图片并预加载
 * @param images - 图片列表
 */
export function preloadAboveFoldImages(images: { filename: string }[]): void {
  const aboveFoldImages = getAboveFoldImages(images);
  const filenames = aboveFoldImages.map(img => img.filename);
  const links = generatePreloadLinks(filenames);
  injectPreloadLinks(links);
}

/**
 * 生成预加载链接标签（用于 SSR）
 * @param filenames - 图片文件名列表
 * @returns 预加载 link 标签数组
 */
export function generatePreloadLinkElements(filenames: string[]): Array<{
  rel: string;
  as: string;
  href: string;
  fetchPriority: string;
}> {
  const maxPreload = 4;
  const filesToPreload = filenames.slice(0, maxPreload);

  return filesToPreload.map(filename => ({
    rel: "preload",
    as: "image",
    href: getCdnImageUrl(filename),
    fetchPriority: "high",
  }));
}

/// <reference types="vite/client" />

/**
 * Vite 环境变量类型定义
 */
interface ImportMetaEnv {
  /**
   * 是否启用 jsDelivr CDN 加速
   * @default "false"
   * @example "true"
   */
  readonly VITE_USE_JSDELIVR_CDN: string;

  /**
   * 自定义域名
   * @example "custom-domain.com"
   */
  readonly VITE_CUSTOM_DOMAIN: string;

  /**
   * 基础 URL 路径
   * @default "/"
   */
  readonly VITE_BASE_URL: string;

  /**
   * API 基础 URL
   */
  readonly VITE_API_BASE_URL: string;

  /**
   * 应用标题
   */
  readonly VITE_APP_TITLE: string;

  /**
   * 应用版本
   */
  readonly VITE_APP_VERSION: string;

  /**
   * 是否启用调试模式
   * @default "false"
   */
  readonly VITE_DEBUG: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

/**
 * 全局窗口对象扩展
 */
declare global {
  interface Window {
    /**
     * 基础 URL（用于 GitHub Pages 子路径部署）
     */
    __BASE_URL__?: string;

    /**
     * 是否启用 jsDelivr CDN
     */
    __USE_JSDELIVR_CDN__?: boolean;
  }
}

export {};

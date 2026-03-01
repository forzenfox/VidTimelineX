/// <reference types="vite/client" />

/**
 * 导入元数据环境变量接口
 * 
 * @description 定义项目中所有可用的环境变量
 * 所有环境变量必须使用 VITE_ 前缀
 * 
 * @example
 * ```typescript
 * const apiUrl = import.meta.env.VITE_API_BASE_URL;
 * const useCDN = import.meta.env.VITE_USE_JSDELIVR_CDN === 'true';
 * ```
 */
interface ImportMetaEnv {
  /**
   * API 基础 URL
   * @description 后端 API 服务的基础地址
   * @example "http://localhost:3000/api"
   * @required
   */
  readonly VITE_API_BASE_URL: string;

  /**
   * 自定义域名
   * @description 部署时使用的自定义域名
   * @example "vx.forzenfox.com"
   * @optional
   */
  readonly VITE_CUSTOM_DOMAIN?: string;

  /**
   * 是否使用 jsDelivr CDN
   * @description 控制是否使用 jsDelivr CDN 加载静态资源
   * @default "false"
   * @example "true" | "false"
   */
  readonly VITE_USE_JSDELIVR_CDN: string;

  /**
   * 应用基础路径
   * @description 应用部署的基础路径，GitHub Pages 部署时需要配置
   * @default "/"
   * @example "/" | "/VidTimelineX/"
   */
  readonly VITE_BASE_URL: string;

  /**
   * 是否启用 HMR（热模块替换）
   * @description 开发环境下控制热模块替换功能
   * @default "false"
   * @example "true" | "false"
   */
  readonly VITE_HMR_ENABLED: string;

  /**
   * 是否禁用 WebSocket 连接
   * @description 禁用 WebSocket 连接，避免纯静态站点的开发环境错误
   * @default "true"
   * @example "true" | "false"
   */
  readonly VITE_DISABLE_WEBSOCKET: string;

  /**
   * 是否分析构建
   * @description 构建时是否生成分析报告，用于优化打包体积
   * @default "false"
   * @example "true" | "false"
   */
  readonly VITE_ANALYZE_BUILD: string;

  /**
   * 是否启用代码压缩
   * @description 生产构建时是否启用代码压缩
   * @default "true"
   * @example "true" | "false"
   */
  readonly VITE_ENABLE_MINIFICATION: string;
}

/**
 * 导入元数据接口
 * 
 * @description 提供环境变量和构建信息的类型定义
 */
interface ImportMeta {
  readonly env: ImportMetaEnv;
  
  /**
   * 构建信息
   */
  readonly env: {
    /**
     * 当前模式
     */
    readonly MODE: string;
    
    /**
     * 是否为开发环境
     */
    readonly DEV: boolean;
    
    /**
     * 是否为生产环境
     */
    readonly PROD: boolean;
    
    /**
     * 基础 URL
     */
    readonly BASE_URL: string;
  };
}

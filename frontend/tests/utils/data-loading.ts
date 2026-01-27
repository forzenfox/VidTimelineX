/**
 * 测试数据加载工具
 * 提供高效的测试数据加载、缓存和管理机制
 */

/**
 * 测试数据缓存接口
 */
interface TestDataCache<T> {
  data: T;
  timestamp: number;
  expires: number;
}

/**
 * 测试数据管理器类
 */
export class TestDataManager {
  private static cache: Map<string, TestDataCache<any>> = new Map();
  private static defaultCacheExpiry = 3600000; // 默认缓存过期时间：1小时

  /**
   * 获取测试数据
   * @param key 数据键名
   * @param loader 数据加载函数
   * @param expiry 缓存过期时间（毫秒）
   * @returns 测试数据
   */
  static async getData<T>(
    key: string,
    loader: () => Promise<T> | T,
    expiry: number = TestDataManager.defaultCacheExpiry
  ): Promise<T> {
    // 检查缓存
    const cached = TestDataManager.cache.get(key);
    const now = Date.now();

    // 如果缓存存在且未过期，返回缓存数据
    if (cached && now < cached.expires) {
      return cached.data;
    }

    // 加载数据
    const data = await Promise.resolve(loader());

    // 更新缓存
    TestDataManager.cache.set(key, {
      data,
      timestamp: now,
      expires: now + expiry,
    });

    return data;
  }

  /**
   * 同步获取测试数据
   * @param key 数据键名
   * @param loader 数据加载函数
   * @param expiry 缓存过期时间（毫秒）
   * @returns 测试数据
   */
  static getDataSync<T>(
    key: string,
    loader: () => T,
    expiry: number = TestDataManager.defaultCacheExpiry
  ): T {
    // 检查缓存
    const cached = TestDataManager.cache.get(key);
    const now = Date.now();

    // 如果缓存存在且未过期，返回缓存数据
    if (cached && now < cached.expires) {
      return cached.data;
    }

    // 加载数据
    const data = loader();

    // 更新缓存
    TestDataManager.cache.set(key, {
      data,
      timestamp: now,
      expires: now + expiry,
    });

    return data;
  }

  /**
   * 清除指定数据的缓存
   * @param key 数据键名
   */
  static clearCache(key: string): void {
    TestDataManager.cache.delete(key);
  }

  /**
   * 清除所有缓存
   */
  static clearAllCache(): void {
    TestDataManager.cache.clear();
  }

  /**
   * 获取缓存状态
   * @returns 缓存状态信息
   */
  static getCacheStatus(): {
    size: number;
    keys: string[];
  } {
    return {
      size: TestDataManager.cache.size,
      keys: Array.from(TestDataManager.cache.keys()),
    };
  }

  /**
   * 检查缓存是否存在
   * @param key 数据键名
   * @returns 是否存在缓存
   */
  static hasCache(key: string): boolean {
    return TestDataManager.cache.has(key);
  }

  /**
   * 设置缓存过期时间
   * @param key 数据键名
   * @param expiry 过期时间（毫秒）
   */
  static setCacheExpiry(key: string, expiry: number): void {
    const cached = TestDataManager.cache.get(key);
    if (cached) {
      TestDataManager.cache.set(key, {
        ...cached,
        expires: Date.now() + expiry,
      });
    }
  }
}

/**
 * 测试数据加载器
 */
export const testDataLoader = {
  /**
   * 加载视频数据
   */
  async loadVideos() {
    return TestDataManager.getData('videos', async () => {
      const { mockVideos } = await import('../fixtures/videos');
      return mockVideos;
    });
  },

  /**
   * 加载单个视频数据
   */
  async loadVideo() {
    return TestDataManager.getData('video', async () => {
      const { mockVideo } = await import('../fixtures/videos');
      return mockVideo;
    });
  },

  /**
   * 加载弹幕数据
   */
  async loadDanmaku() {
    return TestDataManager.getData('danmaku', async () => {
      const { mockDanmaku } = await import('../fixtures/danmaku');
      return mockDanmaku;
    });
  },

  /**
   * 加载单个弹幕数据
   */
  async loadDanmu() {
    return TestDataManager.getData('danmu', async () => {
      const { mockDanmu } = await import('../fixtures/danmaku');
      return mockDanmu;
    });
  },

  /**
   * 同步加载视频数据
   */
  loadVideosSync() {
    return TestDataManager.getDataSync('videos_sync', () => {
      const { mockVideos } = require('../fixtures/videos');
      return mockVideos;
    });
  },

  /**
   * 同步加载单个视频数据
   */
  loadVideoSync() {
    return TestDataManager.getDataSync('video_sync', () => {
      const { mockVideo } = require('../fixtures/videos');
      return mockVideo;
    });
  },

  /**
   * 同步加载弹幕数据
   */
  loadDanmakuSync() {
    return TestDataManager.getDataSync('danmaku_sync', () => {
      const { mockDanmaku } = require('../fixtures/danmaku');
      return mockDanmaku;
    });
  },

  /**
   * 同步加载单个弹幕数据
   */
  loadDanmuSync() {
    return TestDataManager.getDataSync('danmu_sync', () => {
      const { mockDanmu } = require('../fixtures/danmaku');
      return mockDanmu;
    });
  },

  /**
   * 清除所有数据缓存
   */
  clearCache() {
    TestDataManager.clearAllCache();
  },

  /**
   * 获取缓存状态
   */
  getCacheStatus() {
    return TestDataManager.getCacheStatus();
  },
};

/**
 * 测试数据加载钩子
 */
export function useTestData() {
  return {
    // 视频数据
    get videos() {
      return testDataLoader.loadVideosSync();
    },
    get video() {
      return testDataLoader.loadVideoSync();
    },

    // 弹幕数据
    get danmaku() {
      return testDataLoader.loadDanmakuSync();
    },
    get danmu() {
      return testDataLoader.loadDanmuSync();
    },

    // 方法
    loadVideos: testDataLoader.loadVideos,
    loadVideo: testDataLoader.loadVideo,
    loadDanmaku: testDataLoader.loadDanmaku,
    loadDanmu: testDataLoader.loadDanmu,
    clearCache: testDataLoader.clearCache,
    getCacheStatus: testDataLoader.getCacheStatus,
  };
}

/**
 * 测试数据加载性能监控
 */
export class TestDataPerformanceMonitor {
  private static metrics: Map<string, {
    calls: number;
    totalTime: number;
    avgTime: number;
    cacheHits: number;
    cacheMisses: number;
  }> = new Map();

  /**
   * 记录数据加载性能
   * @param key 数据键名
   * @param time 加载时间（毫秒）
   * @param fromCache 是否从缓存加载
   */
  static record(key: string, time: number, fromCache: boolean) {
    const existing = TestDataPerformanceMonitor.metrics.get(key) || {
      calls: 0,
      totalTime: 0,
      avgTime: 0,
      cacheHits: 0,
      cacheMisses: 0,
    };

    existing.calls++;
    existing.totalTime += time;
    existing.avgTime = existing.totalTime / existing.calls;
    
    if (fromCache) {
      existing.cacheHits++;
    } else {
      existing.cacheMisses++;
    }

    TestDataPerformanceMonitor.metrics.set(key, existing);
  }

  /**
   * 获取性能指标
   */
  static getMetrics() {
    return Object.fromEntries(TestDataPerformanceMonitor.metrics);
  }

  /**
   * 清除性能指标
   */
  static clearMetrics() {
    TestDataPerformanceMonitor.metrics.clear();
  }

  /**
   * 输出性能报告
   */
  static printReport() {
    console.log('=== Test Data Loading Performance Report ===');
    TestDataPerformanceMonitor.metrics.forEach((metrics, key) => {
      console.log(`\nData: ${key}`);
      console.log(`Calls: ${metrics.calls}`);
      console.log(`Total Time: ${metrics.totalTime.toFixed(2)}ms`);
      console.log(`Avg Time: ${metrics.avgTime.toFixed(2)}ms`);
      console.log(`Cache Hits: ${metrics.cacheHits}`);
      console.log(`Cache Misses: ${metrics.cacheMisses}`);
      console.log(`Cache Hit Rate: ${((metrics.cacheHits / metrics.calls) * 100).toFixed(2)}%`);
    });
    console.log('==========================================');
  }
}

/**
 * 带性能监控的数据加载器
 */
export const monitoredTestDataLoader = {
  /**
   * 加载视频数据（带性能监控）
   */
  async loadVideos() {
    const startTime = Date.now();
    const fromCache = TestDataManager.hasCache('videos');
    const data = await testDataLoader.loadVideos();
    const endTime = Date.now();
    TestDataPerformanceMonitor.record('videos', endTime - startTime, fromCache);
    return data;
  },

  /**
   * 加载单个视频数据（带性能监控）
   */
  async loadVideo() {
    const startTime = Date.now();
    const fromCache = TestDataManager.hasCache('video');
    const data = await testDataLoader.loadVideo();
    const endTime = Date.now();
    TestDataPerformanceMonitor.record('video', endTime - startTime, fromCache);
    return data;
  },

  /**
   * 加载弹幕数据（带性能监控）
   */
  async loadDanmaku() {
    const startTime = Date.now();
    const fromCache = TestDataManager.hasCache('danmaku');
    const data = await testDataLoader.loadDanmaku();
    const endTime = Date.now();
    TestDataPerformanceMonitor.record('danmaku', endTime - startTime, fromCache);
    return data;
  },

  /**
   * 加载单个弹幕数据（带性能监控）
   */
  async loadDanmu() {
    const startTime = Date.now();
    const fromCache = TestDataManager.hasCache('danmu');
    const data = await testDataLoader.loadDanmu();
    const endTime = Date.now();
    TestDataPerformanceMonitor.record('danmu', endTime - startTime, fromCache);
    return data;
  },

  /**
   * 获取性能报告
   */
  getPerformanceReport() {
    return TestDataPerformanceMonitor.getMetrics();
  },

  /**
   * 打印性能报告
   */
  printPerformanceReport() {
    TestDataPerformanceMonitor.printReport();
  },

  /**
   * 清除性能指标
   */
  clearPerformanceMetrics() {
    TestDataPerformanceMonitor.clearMetrics();
  },
};

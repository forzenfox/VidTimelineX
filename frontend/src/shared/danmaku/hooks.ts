/**
 * 弹幕 React Hooks 模块
 * 提供弹幕管理和弹幕池管理的 React Hooks
 */

import { useState, useEffect, useMemo, useCallback } from 'react';
import type { DanmakuMessage, DanmakuPoolConfig, UseDanmakuConfig } from './types';

/**
 * 弹幕管理 Hook
 * @param config 弹幕配置
 * @returns 弹幕列表和更新函数
 */
export function useDanmaku(config: UseDanmakuConfig) {
  const {
    poolConfig,
    defaultTheme = 'mix',
    defaultSize = 'medium',
    autoPlay = false,
    loop = false,
    danmakuType = 'sidebar'
  } = config;

  // 弹幕列表状态
  const [danmakuList, setDanmakuList] = useState<DanmakuMessage[]>([]);
  // 是否正在播放
  const [isPlaying, setIsPlaying] = useState<boolean>(autoPlay);
  // 当前播放进度（毫秒）
  const [currentTime, setCurrentTime] = useState<number>(0);

  /**
   * 添加单条弹幕
   * @param message 弹幕消息
   */
  const addDanmaku = useCallback((message: DanmakuMessage) => {
    setDanmakuList(prev => {
      const newList = [...prev, message];
      // 如果配置了弹幕池最大容量，超过时移除最早的弹幕
      if (poolConfig?.maxCapacity && newList.length > poolConfig.maxCapacity) {
        return newList.slice(newList.length - poolConfig.maxCapacity);
      }
      return newList;
    });
  }, [poolConfig?.maxCapacity]);

  /**
   * 批量添加弹幕
   * @param messages 弹幕消息数组
   */
  const addDanmakuBatch = useCallback((messages: DanmakuMessage[]) => {
    setDanmakuList(prev => {
      const newList = [...prev, ...messages];
      // 如果配置了弹幕池最大容量，超过时移除最早的弹幕
      if (poolConfig?.maxCapacity && newList.length > poolConfig.maxCapacity) {
        return newList.slice(newList.length - poolConfig.maxCapacity);
      }
      return newList;
    });
  }, [poolConfig?.maxCapacity]);

  /**
   * 移除指定弹幕
   * @param id 弹幕 ID
   */
  const removeDanmaku = useCallback((id: string) => {
    setDanmakuList(prev => prev.filter(item => item.id !== id));
  }, []);

  /**
   * 清空所有弹幕
   */
  const clearDanmaku = useCallback(() => {
    setDanmakuList([]);
  }, []);

  /**
   * 更新播放状态
   * @param playing 是否播放
   */
  const setPlaying = useCallback((playing: boolean) => {
    setIsPlaying(playing);
  }, []);

  /**
   * 更新当前时间
   * @param time 当前时间（毫秒）
   */
  const setCurrentTimeCallback = useCallback((time: number) => {
    setCurrentTime(time);
  }, []);

  /**
   * 根据时间范围获取弹幕
   * @param startTime 开始时间（毫秒）
   * @param endTime 结束时间（毫秒）
   * @returns 时间范围内的弹幕列表
   */
  const getDanmakuByTimeRange = useCallback((startTime: number, endTime: number): DanmakuMessage[] => {
    return danmakuList.filter(item => {
      if (!item.timestamp) {
        return false;
      }
      // 将时间戳 "HH:MM:SS" 转换为毫秒
      const parts = item.timestamp.split(':');
      const hours = parseInt(parts[0]) || 0;
      const minutes = parseInt(parts[1]) || 0;
      const seconds = parseInt(parts[2]) || 0;
      const itemTimeInMs = (hours * 3600 + minutes * 60 + seconds) * 1000;
      return itemTimeInMs >= startTime && itemTimeInMs <= endTime;
    });
  }, [danmakuList]);

  /**
   * 获取当前应该显示的弹幕
   * @returns 当前应该显示的弹幕列表
   */
  const getCurrentDanmaku = useMemo(() => {
    if (!isPlaying) {
      return [];
    }

    // 对于飘屏模式，根据延迟和持续时间判断是否显示
    if (danmakuType === 'horizontal') {
      return danmakuList.filter(item => {
        if (item.delay === undefined || item.duration === undefined) {
          return true;
        }
        const displayTime = currentTime - item.delay;
        return displayTime >= 0 && displayTime <= item.duration;
      });
    }

    // 侧边栏模式直接返回所有弹幕
    return danmakuList;
  }, [danmakuList, isPlaying, currentTime, danmakuType]);

  // 自动播放效果
  useEffect(() => {
    if (!autoPlay) {
      return;
    }

    let animationId: number;
    let lastTime = performance.now();

    const animate = (now: number) => {
      const delta = now - lastTime;
      lastTime = now;

      if (isPlaying) {
        setCurrentTime(prev => {
          const newTime = prev + delta;
          // 如果开启循环且超过最大值，重置为 0
          if (loop && poolConfig?.displaySpeed) {
            const maxTime = poolConfig.maxCapacity * poolConfig.displaySpeed;
            if (newTime > maxTime) {
              return 0;
            }
          }
          return newTime;
        });
      }

      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    // 清理函数
    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [autoPlay, isPlaying, loop, poolConfig?.displaySpeed, poolConfig?.maxCapacity]);

  return {
    danmakuList,
    currentDanmaku: getCurrentDanmaku,
    isPlaying,
    currentTime,
    addDanmaku,
    addDanmakuBatch,
    removeDanmaku,
    clearDanmaku,
    setPlaying,
    setCurrentTime: setCurrentTimeCallback,
    getDanmakuByTimeRange
  };
}

/**
 * 弹幕池管理 Hook
 * @param config 弹幕池配置
 * @returns 弹幕池状态和管理函数
 */
export function useDanmakuPool(config: DanmakuPoolConfig) {
  const {
    maxCapacity,
    displaySpeed,
    enableMerge = false,
    enableFilter = false,
    trackCount = 5,
    opacity = 1
  } = config;

  // 弹幕池队列
  const [pool, setPool] = useState<DanmakuMessage[]>([]);
  // 当前轨道占用情况
  const [trackOccupancy, setTrackOccupancy] = useState<boolean[]>(new Array(trackCount).fill(false));
  // 可用轨道列表
  const [availableTracks, setAvailableTracks] = useState<number[]>([]);

  // 初始化可用轨道
  useEffect(() => {
    setAvailableTracks(new Array(trackCount).fill(0).map((_, i) => i));
  }, [trackCount]);

  /**
   * 向弹幕池添加弹幕
   * @param message 弹幕消息
   */
  const addToPool = useCallback((message: DanmakuMessage) => {
    setPool(prev => {
      const newPool = [...prev, message];
      // 超过最大容量时，移除最早的弹幕
      if (newPool.length > maxCapacity) {
        return newPool.slice(newPool.length - maxCapacity);
      }
      return newPool;
    });
  }, [maxCapacity]);

  /**
   * 批量添加弹幕到弹幕池
   * @param messages 弹幕消息数组
   */
  const addToPoolBatch = useCallback((messages: DanmakuMessage[]) => {
    setPool(prev => {
      const newPool = [...prev, ...messages];
      // 超过最大容量时，移除最早的弹幕
      if (newPool.length > maxCapacity) {
        return newPool.slice(newPool.length - maxCapacity);
      }
      return newPool;
    });
  }, [maxCapacity]);

  /**
   * 从弹幕池移除弹幕
   * @param id 弹幕 ID
   */
  const removeFromPool = useCallback((id: string) => {
    setPool(prev => prev.filter(item => item.id !== id));
  }, []);

  /**
   * 清空弹幕池
   */
  const clearPool = useCallback(() => {
    setPool([]);
    setTrackOccupancy(new Array(trackCount).fill(false));
  }, [trackCount]);

  /**
   * 获取下一个可用轨道
   * @returns 可用轨道索引，如果没有可用轨道则返回 -1
   */
  const getNextAvailableTrack = useCallback((): number => {
    const index = trackOccupancy.findIndex(occupied => !occupied);
    return index;
  }, [trackOccupancy]);

  /**
   * 占用轨道
   * @param trackIndex 轨道索引
   */
  const occupyTrack = useCallback((trackIndex: number) => {
    setTrackOccupancy(prev => {
      const newOccupancy = [...prev];
      newOccupancy[trackIndex] = true;
      return newOccupancy;
    });
  }, []);

  /**
   * 释放轨道
   * @param trackIndex 轨道索引
   */
  const releaseTrack = useCallback((trackIndex: number) => {
    setTrackOccupancy(prev => {
      const newOccupancy = [...prev];
      newOccupancy[trackIndex] = false;
      return newOccupancy;
    });
  }, []);

  /**
   * 合并重复弹幕
   * @param messages 弹幕消息数组
   * @returns 合并后的弹幕数组
   */
  const mergeDuplicateDanmaku = useCallback((messages: DanmakuMessage[]): DanmakuMessage[] => {
    if (!enableMerge) {
      return messages;
    }

    // 只根据文本内容合并，相同文本的弹幕只保留第一条
    const map = new Map<string, DanmakuMessage>();
    messages.forEach(message => {
      const key = message.text;
      if (!map.has(key)) {
        map.set(key, message);
      }
    });

    return Array.from(map.values());
  }, [enableMerge]);

  /**
   * 过滤弹幕
   * @param messages 弹幕消息数组
   * @returns 过滤后的弹幕数组
   */
  const filterDanmaku = useCallback((messages: DanmakuMessage[]): DanmakuMessage[] => {
    if (!enableFilter) {
      return messages;
    }

    // 过滤掉空文本或包含敏感词的弹幕
    return messages.filter(message => {
      if (!message.text || message.text.trim() === '') {
        return false;
      }
      // 这里可以添加更多的过滤逻辑
      return true;
    });
  }, [enableFilter]);

  /**
   * 处理弹幕（合并和过滤）
   * @param messages 弹幕消息数组
   * @returns 处理后的弹幕数组
   */
  const processDanmaku = useCallback((messages: DanmakuMessage[]): DanmakuMessage[] => {
    let processed = messages;

    if (enableFilter) {
      processed = filterDanmaku(processed);
    }

    if (enableMerge) {
      processed = mergeDuplicateDanmaku(processed);
    }

    return processed;
  }, [enableFilter, enableMerge, filterDanmaku, mergeDuplicateDanmaku]);

  /**
   * 获取弹幕池状态
   */
  const getPoolStatus = useMemo(() => ({
    currentSize: pool.length,
    maxCapacity,
    isFull: pool.length >= maxCapacity,
    availableTracks: trackOccupancy.filter(t => !t).length,
    occupancyRate: trackOccupancy.filter(t => t).length / trackCount
  }), [pool.length, maxCapacity, trackOccupancy, trackCount]);

  // 根据显示速度自动从弹幕池中取出弹幕
  useEffect(() => {
    if (!displaySpeed || displaySpeed <= 0) {
      return;
    }

    const interval = setInterval(() => {
      // 这里可以根据需要从弹幕池中取出弹幕
      // 实际使用时可能需要配合外部播放器时间轴
    }, displaySpeed);

    return () => {
      clearInterval(interval);
    };
  }, [displaySpeed]);

  return {
    pool,
    trackCount,
    opacity,
    trackOccupancy,
    availableTracks,
    poolStatus: getPoolStatus,
    addToPool,
    addToPoolBatch,
    removeFromPool,
    clearPool,
    occupyTrack,
    releaseTrack,
    getNextAvailableTrack,
    processDanmaku,
    mergeDuplicateDanmaku,
    filterDanmaku
  };
}

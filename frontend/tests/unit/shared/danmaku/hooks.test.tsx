/**
 * 弹幕 React Hooks 模块单元测试
 */

import { renderHook, act } from "@testing-library/react";
import { useDanmaku, useDanmakuPool } from "@/shared/danmaku/hooks";
import type { DanmakuMessage, DanmakuPoolConfig, UseDanmakuConfig } from "@/shared/danmaku/types";

describe("弹幕 React Hooks 模块", () => {
  // 模拟弹幕消息
  const mockDanmakuMessage: DanmakuMessage = {
    id: "test-1",
    text: "测试弹幕",
    color: "#FF4444",
    size: "medium",
    timestamp: "12:00:00",
  };

  const mockDanmakuMessage2: DanmakuMessage = {
    id: "test-2",
    text: "第二条弹幕",
    color: "#3498DB",
    size: "small",
    timestamp: "12:01:00",
  };

  const mockDanmakuMessage3: DanmakuMessage = {
    id: "test-3",
    text: "第三条弹幕",
    color: "#F39C12",
    size: "large",
    timestamp: "12:02:00",
  };

  describe("useDanmaku Hook", () => {
    const defaultConfig: UseDanmakuConfig = {
      poolConfig: {
        maxCapacity: 100,
        displaySpeed: 1000,
        enableMerge: false,
        enableFilter: false,
        trackCount: 5,
        opacity: 1,
      },
      defaultTheme: "mix",
      defaultSize: "medium",
      autoPlay: false,
      loop: false,
      danmakuType: "sidebar",
    };

    it("应该能使用默认配置初始化", () => {
      const { result } = renderHook(() => useDanmaku(defaultConfig));

      expect(result.current.danmakuList).toEqual([]);
      expect(result.current.currentDanmaku).toEqual([]);
      expect(result.current.isPlaying).toBe(false);
      expect(result.current.currentTime).toBe(0);
    });

    it("应该能添加单条弹幕", () => {
      const { result } = renderHook(() => useDanmaku(defaultConfig));

      act(() => {
        result.current.addDanmaku(mockDanmakuMessage);
      });

      expect(result.current.danmakuList).toHaveLength(1);
      expect(result.current.danmakuList[0]).toEqual(mockDanmakuMessage);
    });

    it("应该能批量添加弹幕", () => {
      const { result } = renderHook(() => useDanmaku(defaultConfig));

      act(() => {
        result.current.addDanmakuBatch([
          mockDanmakuMessage,
          mockDanmakuMessage2,
          mockDanmakuMessage3,
        ]);
      });

      expect(result.current.danmakuList).toHaveLength(3);
      expect(result.current.danmakuList[0].id).toBe("test-1");
      expect(result.current.danmakuList[1].id).toBe("test-2");
      expect(result.current.danmakuList[2].id).toBe("test-3");
    });

    it("应该能移除指定弹幕", () => {
      const { result } = renderHook(() => useDanmaku(defaultConfig));

      act(() => {
        result.current.addDanmaku(mockDanmakuMessage);
        result.current.addDanmaku(mockDanmakuMessage2);
      });

      expect(result.current.danmakuList).toHaveLength(2);

      act(() => {
        result.current.removeDanmaku("test-1");
      });

      expect(result.current.danmakuList).toHaveLength(1);
      expect(result.current.danmakuList[0].id).toBe("test-2");
    });

    it("应该能清空所有弹幕", () => {
      const { result } = renderHook(() => useDanmaku(defaultConfig));

      act(() => {
        result.current.addDanmaku(mockDanmakuMessage);
        result.current.addDanmaku(mockDanmakuMessage2);
      });

      expect(result.current.danmakuList).toHaveLength(2);

      act(() => {
        result.current.clearDanmaku();
      });

      expect(result.current.danmakuList).toHaveLength(0);
    });

    it("应该能更新播放状态", () => {
      const { result } = renderHook(() => useDanmaku(defaultConfig));

      expect(result.current.isPlaying).toBe(false);

      act(() => {
        result.current.setPlaying(true);
      });

      expect(result.current.isPlaying).toBe(true);
    });

    it("应该能更新当前时间", () => {
      const { result } = renderHook(() => useDanmaku(defaultConfig));

      expect(result.current.currentTime).toBe(0);

      act(() => {
        result.current.setCurrentTime(5000);
      });

      expect(result.current.currentTime).toBe(5000);
    });

    it("应该根据时间范围获取弹幕", () => {
      const { result } = renderHook(() => useDanmaku(defaultConfig));

      act(() => {
        result.current.addDanmaku({
          ...mockDanmakuMessage,
          timestamp: "12:00:00",
        });
        result.current.addDanmaku({
          ...mockDanmakuMessage2,
          timestamp: "12:05:00",
        });
        result.current.addDanmaku({
          ...mockDanmakuMessage3,
          timestamp: "12:10:00",
        });
      });

      // 时间范围：12:00:00 到 12:05:00（转换为毫秒）
      // 12:00:00 = 12 * 3600 * 1000 = 43200000ms
      // 12:05:00 = (12 * 3600 + 5 * 60) * 1000 = 43500000ms
      const danmakuInRange = result.current.getDanmakuByTimeRange(43200000, 43500000);
      expect(danmakuInRange).toHaveLength(2);
    });

    it("应该在弹幕池满时移除最早的弹幕", () => {
      const configWithSmallCapacity: UseDanmakuConfig = {
        ...defaultConfig,
        poolConfig: {
          ...defaultConfig.poolConfig!,
          maxCapacity: 2,
        },
      };

      const { result } = renderHook(() => useDanmaku(configWithSmallCapacity));

      act(() => {
        result.current.addDanmaku(mockDanmakuMessage);
        result.current.addDanmaku(mockDanmakuMessage2);
        result.current.addDanmaku(mockDanmakuMessage3);
      });

      expect(result.current.danmakuList).toHaveLength(2);
      expect(result.current.danmakuList[0].id).toBe("test-2");
      expect(result.current.danmakuList[1].id).toBe("test-3");
    });

    it("应该在 autoPlay 为 true 时自动更新时间", () => {
      jest.useFakeTimers();

      const config: UseDanmakuConfig = {
        ...defaultConfig,
        autoPlay: true,
        poolConfig: {
          ...defaultConfig.poolConfig!,
          displaySpeed: 1000,
          maxCapacity: 100,
        },
      };

      const { result } = renderHook(() => useDanmaku(config));

      act(() => {
        jest.advanceTimersByTime(100);
      });

      expect(result.current.currentTime).toBeGreaterThan(0);

      jest.useRealTimers();
    });

    it("应该在 loop 为 true 且超过最大时间时重置时间", () => {
      const config: UseDanmakuConfig = {
        ...defaultConfig,
        autoPlay: true,
        loop: true,
        poolConfig: {
          maxCapacity: 10,
          displaySpeed: 100,
          enableMerge: false,
          enableFilter: false,
          trackCount: 5,
          opacity: 1,
        },
      };

      const { result } = renderHook(() => useDanmaku(config));

      // 等待足够长的时间让时间超过最大值
      act(() => {
        jest.advanceTimersByTime(2000);
      });

      // 时间应该被重置
      expect(result.current.currentTime).toBeLessThan(1000);

      jest.useRealTimers();
    });

    it("应该在 isPlaying 为 false 时返回空数组", () => {
      const { result } = renderHook(() => useDanmaku(defaultConfig));

      act(() => {
        result.current.addDanmaku(mockDanmakuMessage);
      });

      expect(result.current.isPlaying).toBe(false);
      expect(result.current.currentDanmaku).toEqual([]);
    });

    it("应该在 isPlaying 为 true 时返回弹幕列表", () => {
      const config: UseDanmakuConfig = {
        ...defaultConfig,
        autoPlay: true,
      };

      const { result } = renderHook(() => useDanmaku(config));

      act(() => {
        result.current.addDanmaku(mockDanmakuMessage);
      });

      expect(result.current.isPlaying).toBe(true);
      expect(result.current.currentDanmaku).toHaveLength(1);
    });

    it("应该为横向弹幕类型过滤显示中的弹幕", () => {
      const config: UseDanmakuConfig = {
        ...defaultConfig,
        danmakuType: "horizontal",
        autoPlay: true,
      };

      const { result } = renderHook(() => useDanmaku(config));

      act(() => {
        result.current.addDanmaku({
          ...mockDanmakuMessage,
          delay: 0,
          duration: 5000,
        });
      });

      // 在显示时间范围内
      act(() => {
        result.current.setCurrentTime(2000);
      });

      expect(result.current.currentDanmaku).toHaveLength(1);

      // 超出显示时间范围
      act(() => {
        result.current.setCurrentTime(6000);
      });

      expect(result.current.currentDanmaku).toHaveLength(0);
    });
  });

  describe("useDanmakuPool Hook", () => {
    const defaultPoolConfig: DanmakuPoolConfig = {
      maxCapacity: 100,
      displaySpeed: 1000,
      enableMerge: false,
      enableFilter: false,
      trackCount: 5,
      opacity: 1,
    };

    it("应该能使用默认配置初始化", () => {
      const { result } = renderHook(() => useDanmakuPool(defaultPoolConfig));

      expect(result.current.pool).toEqual([]);
      expect(result.current.trackCount).toBe(5);
      expect(result.current.opacity).toBe(1);
      expect(result.current.availableTracks).toHaveLength(5);
    });

    it("应该能添加单条弹幕到弹幕池", () => {
      const { result } = renderHook(() => useDanmakuPool(defaultPoolConfig));

      act(() => {
        result.current.addToPool(mockDanmakuMessage);
      });

      expect(result.current.pool).toHaveLength(1);
      expect(result.current.pool[0]).toEqual(mockDanmakuMessage);
    });

    it("应该能批量添加弹幕到弹幕池", () => {
      const { result } = renderHook(() => useDanmakuPool(defaultPoolConfig));

      act(() => {
        result.current.addToPoolBatch([
          mockDanmakuMessage,
          mockDanmakuMessage2,
          mockDanmakuMessage3,
        ]);
      });

      expect(result.current.pool).toHaveLength(3);
    });

    it("应该能从弹幕池移除弹幕", () => {
      const { result } = renderHook(() => useDanmakuPool(defaultPoolConfig));

      act(() => {
        result.current.addToPool(mockDanmakuMessage);
        result.current.addToPool(mockDanmakuMessage2);
      });

      expect(result.current.pool).toHaveLength(2);

      act(() => {
        result.current.removeFromPool("test-1");
      });

      expect(result.current.pool).toHaveLength(1);
      expect(result.current.pool[0].id).toBe("test-2");
    });

    it("应该能清空弹幕池", () => {
      const { result } = renderHook(() => useDanmakuPool(defaultPoolConfig));

      act(() => {
        result.current.addToPool(mockDanmakuMessage);
        result.current.addToPool(mockDanmakuMessage2);
      });

      expect(result.current.pool).toHaveLength(2);

      act(() => {
        result.current.clearPool();
      });

      expect(result.current.pool).toHaveLength(0);
    });

    it("应该在弹幕池满时移除最早的弹幕", () => {
      const configWithSmallCapacity: DanmakuPoolConfig = {
        ...defaultPoolConfig,
        maxCapacity: 2,
      };

      const { result } = renderHook(() => useDanmakuPool(configWithSmallCapacity));

      act(() => {
        result.current.addToPool(mockDanmakuMessage);
        result.current.addToPool(mockDanmakuMessage2);
        result.current.addToPool(mockDanmakuMessage3);
      });

      expect(result.current.pool).toHaveLength(2);
      expect(result.current.pool[0].id).toBe("test-2");
      expect(result.current.pool[1].id).toBe("test-3");
    });

    it("应该能获取下一个可用轨道", () => {
      const { result } = renderHook(() => useDanmakuPool(defaultPoolConfig));

      act(() => {
        result.current.occupyTrack(0);
        result.current.occupyTrack(1);
      });

      const nextTrack = result.current.getNextAvailableTrack();
      expect(nextTrack).toBe(2);
    });

    it("应该能占用轨道", () => {
      const { result } = renderHook(() => useDanmakuPool(defaultPoolConfig));

      act(() => {
        result.current.occupyTrack(0);
      });

      expect(result.current.trackOccupancy[0]).toBe(true);
    });

    it("应该能释放轨道", () => {
      const { result } = renderHook(() => useDanmakuPool(defaultPoolConfig));

      act(() => {
        result.current.occupyTrack(0);
        result.current.releaseTrack(0);
      });

      expect(result.current.trackOccupancy[0]).toBe(false);
    });

    it("应该在清空弹幕池时重置轨道占用状态", () => {
      const { result } = renderHook(() => useDanmakuPool(defaultPoolConfig));

      act(() => {
        result.current.occupyTrack(0);
        result.current.occupyTrack(1);
        result.current.clearPool();
      });

      expect(result.current.trackOccupancy.every(t => !t)).toBe(true);
    });

    it("应该返回正确的弹幕池状态", () => {
      const config: DanmakuPoolConfig = {
        ...defaultPoolConfig,
        maxCapacity: 10,
      };

      const { result } = renderHook(() => useDanmakuPool(config));

      act(() => {
        for (let i = 0; i < 5; i++) {
          result.current.addToPool({
            ...mockDanmakuMessage,
            id: `test-${i}`,
          });
        }
      });

      const status = result.current.poolStatus;
      expect(status.currentSize).toBe(5);
      expect(status.maxCapacity).toBe(10);
      expect(status.isFull).toBe(false);
    });

    it("应该在 enableMerge 为 true 时合并重复弹幕", () => {
      const config: DanmakuPoolConfig = {
        ...defaultPoolConfig,
        enableMerge: true,
      };

      const { result } = renderHook(() => useDanmakuPool(config));

      const messages: DanmakuMessage[] = [
        { ...mockDanmakuMessage, id: "1", text: "相同文本" },
        { ...mockDanmakuMessage2, id: "2", text: "相同文本" },
        { ...mockDanmakuMessage3, id: "3", text: "不同文本" },
      ];

      const processed = result.current.processDanmaku(messages);
      expect(processed).toHaveLength(2);
    });

    it("应该在 enableFilter 为 true 时过滤空弹幕", () => {
      const config: DanmakuPoolConfig = {
        ...defaultPoolConfig,
        enableFilter: true,
      };

      const { result } = renderHook(() => useDanmakuPool(config));

      const messages: DanmakuMessage[] = [
        { ...mockDanmakuMessage, id: "1", text: "有效弹幕" },
        { ...mockDanmakuMessage2, id: "2", text: "" },
        { ...mockDanmakuMessage3, id: "3", text: "   " },
      ];

      const processed = result.current.filterDanmaku(messages);
      expect(processed).toHaveLength(1);
      expect(processed[0].text).toBe("有效弹幕");
    });

    it("应该在 enableFilter 和 enableMerge 都为 true 时先过滤再合并", () => {
      const config: DanmakuPoolConfig = {
        ...defaultPoolConfig,
        enableFilter: true,
        enableMerge: true,
      };

      const { result } = renderHook(() => useDanmakuPool(config));

      const messages: DanmakuMessage[] = [
        { ...mockDanmakuMessage, id: "1", text: "有效弹幕" },
        { ...mockDanmakuMessage2, id: "2", text: "" },
        { ...mockDanmakuMessage3, id: "3", text: "有效弹幕" },
      ];

      const processed = result.current.processDanmaku(messages);
      expect(processed).toHaveLength(1);
    });

    it("应该在 enableMerge 为 false 时不合并弹幕", () => {
      const config: DanmakuPoolConfig = {
        ...defaultPoolConfig,
        enableMerge: false,
      };

      const { result } = renderHook(() => useDanmakuPool(config));

      const messages: DanmakuMessage[] = [
        { ...mockDanmakuMessage, id: "1", text: "相同文本" },
        { ...mockDanmakuMessage2, id: "2", text: "相同文本" },
      ];

      const processed = result.current.mergeDuplicateDanmaku(messages);
      expect(processed).toHaveLength(2);
    });

    it("应该在 enableFilter 为 false 时不过滤弹幕", () => {
      const config: DanmakuPoolConfig = {
        ...defaultPoolConfig,
        enableFilter: false,
      };

      const { result } = renderHook(() => useDanmakuPool(config));

      const messages: DanmakuMessage[] = [
        { ...mockDanmakuMessage, id: "1", text: "" },
        { ...mockDanmakuMessage2, id: "2", text: "有效弹幕" },
      ];

      const processed = result.current.filterDanmaku(messages);
      expect(processed).toHaveLength(2);
    });
  });

  describe("边缘情况", () => {
    it("应该处理 displaySpeed 为 0 的情况", () => {
      const config: DanmakuPoolConfig = {
        ...{
          maxCapacity: 100,
          displaySpeed: 0,
          enableMerge: false,
          enableFilter: false,
          trackCount: 5,
          opacity: 1,
        },
      };

      const { result } = renderHook(() => useDanmakuPool(config));
      expect(result.current.poolStatus).toBeDefined();
    });

    it("应该处理 trackCount 为 0 的情况", () => {
      const config: DanmakuPoolConfig = {
        ...{
          maxCapacity: 100,
          displaySpeed: 1000,
          enableMerge: false,
          enableFilter: false,
          trackCount: 0,
          opacity: 1,
        },
      };

      const { result } = renderHook(() => useDanmakuPool(config));
      expect(result.current.trackCount).toBe(0);
    });

    it("应该处理 opacity 为 0 的情况", () => {
      const config: DanmakuPoolConfig = {
        ...{
          maxCapacity: 100,
          displaySpeed: 1000,
          enableMerge: false,
          enableFilter: false,
          trackCount: 5,
          opacity: 0,
        },
      };

      const { result } = renderHook(() => useDanmakuPool(config));
      expect(result.current.opacity).toBe(0);
    });

    it("应该处理 opacity 为 1 的情况", () => {
      const config: DanmakuPoolConfig = {
        ...{
          maxCapacity: 100,
          displaySpeed: 1000,
          enableMerge: false,
          enableFilter: false,
          trackCount: 5,
          opacity: 1,
        },
      };

      const { result } = renderHook(() => useDanmakuPool(config));
      expect(result.current.opacity).toBe(1);
    });
  });
});

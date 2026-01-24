import React, { useEffect } from "react";
import type { Metric } from "web-vitals";

// 性能指标收集组件
const PerformanceMonitor: React.FC = () => {
  useEffect(() => {
    // 动态导入 web-vitals，避免构建错误
    const loadWebVitals = async () => {
      try {
        const webVitals = await import("web-vitals");

        // 收集性能指标并打印到控制台
        const reportWebVitals = (metric: Metric) => {
          console.log("Performance Metric:", metric);

          // 这里可以添加性能数据上报逻辑，例如：
          // navigator.sendBeacon('/api/performance', JSON.stringify(metric));
        };

        // 注册性能指标监听
        webVitals.onCLS?.(reportWebVitals);
        webVitals.onFID?.(reportWebVitals);
        webVitals.onFCP?.(reportWebVitals);
        webVitals.onLCP?.(reportWebVitals);
        webVitals.onTTFB?.(reportWebVitals);
      } catch (error) {
        console.error("Failed to load web-vitals:", error);
      }
    };

    loadWebVitals();
  }, []);

  return null; // 这个组件不渲染任何内容
};

export default PerformanceMonitor;

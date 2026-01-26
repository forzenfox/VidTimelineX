/**
 * 纯静态站点开发环境配置
 * 抑制Vite HMR相关的WebSocket错误
 * 这些错误仅在开发环境出现，不影响生产环境
 */

// 抑制WebSocket连接错误
if (typeof window !== "undefined") {
  const originalError = window.console.error;

  window.console.error = (...args: unknown[]) => {
    // 过滤WebSocket相关错误
    const message = args[0]?.toString?.() || "";
    if (message.includes("WebSocket") || message.includes("ws://")) {
      return;
    }
    originalError.apply(window.console, args);
  };
}

import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AppRoutes from "./routes";
import "../index.css";
import "../styles/globals.css";
import PerformanceMonitor from "../components/PerformanceMonitor";

// 创建QueryClient实例
const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <PerformanceMonitor />
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  </QueryClientProvider>
);

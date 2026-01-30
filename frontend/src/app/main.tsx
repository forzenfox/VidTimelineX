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
import "../styles/globals.css";
import PerformanceMonitor from "../components/PerformanceMonitor";
import MobileNotSupported from "../components/MobileNotSupported";
import { useIsMobile } from "../hooks/use-mobile";

// 创建QueryClient实例
const queryClient = new QueryClient();

// 主应用组件，包含移动端检测逻辑
const MainApp: React.FC = () => {
  const isMobile = useIsMobile();

  // 如果是移动端，显示不支持提示页面
  if (isMobile) {
    return <MobileNotSupported />;
  }

  // 否则，正常渲染应用
  return (
    <QueryClientProvider client={queryClient}>
      <PerformanceMonitor />

      
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <AppRoutes />
      </BrowserRouter>
    </QueryClientProvider>
  );
};

createRoot(document.getElementById("root")!).render(<MainApp />);

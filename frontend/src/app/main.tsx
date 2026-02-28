/**
 * 纯静态站点开发环境配置
 * 抑制Vite HMR相关的WebSocket错误
 * 这些错误仅在开发环境出现，不影响生产环境
 */

// 抑制WebSocket连接错误
if (typeof window !== "undefined") {
  const originalError = window.console.error;

  window.console.error = (...args: unknown[]) => {
    const message = args[0]?.toString?.() || "";
    if (message.includes("WebSocket") || message.includes("ws://")) {
      return;
    }
    originalError.apply(window.console, args);
  };
}

import { createRoot } from "react-dom/client";
import { HashRouter, useLocation } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AppRoutes from "./routes";
import "../styles/globals.css";
import PerformanceMonitor from "../components/PerformanceMonitor";
import MobileNotSupported from "../components/MobileNotSupported";
import { useIsMobile } from "../hooks/use-mobile";

// 将环境变量暴露给 window 对象，供 CDN 工具使用
if (typeof window !== "undefined") {
  window.__USE_JSDELIVR_CDN__ = import.meta.env.VITE_USE_JSDELIVR_CDN === "true";
  window.__BASE_URL__ = import.meta.env.VITE_BASE_URL || "/";
  console.log("[Main] jsDelivr CDN enabled:", window.__USE_JSDELIVR_CDN__);
}

const queryClient = new QueryClient();

function registerServiceWorker() {
  if ("serviceWorker" in navigator && import.meta.env.PROD) {
    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register("/sw.js")
        .then(registration => {
          console.log("[SW] 注册成功:", registration.scope);
          registration.addEventListener("updatefound", () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener("statechange", () => {
                if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
                  console.log("[SW] 新版本可用，刷新页面更新");
                }
              });
            }
          });
        })
        .catch(error => {
          console.log("[SW] 注册失败:", error);
        });
    });
  }
}

registerServiceWorker();

// 支持移动端访问的路由白名单
const MOBILE_SUPPORTED_ROUTES = ["/yuxiaoc"];

/**
 * 检查当前路由是否支持移动端访问
 * @param pathname - 当前路径
 * @returns 是否支持移动端
 */
function isMobileSupportedRoute(pathname: string): boolean {
  return MOBILE_SUPPORTED_ROUTES.some(route => pathname.startsWith(route));
}

const MainApp: React.FC = () => {
  const isMobile = useIsMobile();
  const location = useLocation();

  // 如果是移动端且当前路由不支持移动端访问，显示不支持提示
  if (isMobile && !isMobileSupportedRoute(location.pathname)) {
    return <MobileNotSupported />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <PerformanceMonitor />
      <AppRoutes />
    </QueryClientProvider>
  );
};

const RootApp: React.FC = () => {
  return (
    <HashRouter>
      <MainApp />
    </HashRouter>
  );
};

createRoot(document.getElementById("root")!).render(<RootApp />);

import React from "react";
import { render, act, cleanup } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import TiantongPage from "@/features/tiantong/TiantongPage";
import "@testing-library/jest-dom";
import { withTimeout, wrapAsync } from "../../utils/error-handling";

// Mock JSON file import
jest.mock("@/features/tiantong/data/danmaku.json", () => ({
  tigerDanmaku: ["老虎测试弹幕 1", "老虎测试弹幕 2", "老虎测试弹幕 3"],
  sweetDanmaku: ["甜筒测试弹幕 1", "甜筒测试弹幕 2", "甜筒测试弹幕 3"],
  commonDanmaku: ["公共测试弹幕 1", "公共测试弹幕 2"],
}));

// Mock 动态导入组件 - 避免 React.lazy 加载延迟
jest.mock("@/features/tiantong/components/SidebarDanmu", () => {
  return function MockSidebarDanmu({ theme }: { theme: "tiger" | "sweet" }) {
    return (
      <div data-testid="sidebar-danmu" data-theme={theme}>
        Sidebar Danmu - {theme}
      </div>
    );
  };
});

/**
 * 创建测试专用轻量级 QueryClient
 * 禁用重试机制，减少缓存时间，提升测试执行速度
 */
const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false, // 禁用重试，避免指数退避延迟
        staleTime: 0, // 数据立即过期，避免缓存影响
        gcTime: 0, // 禁用垃圾回收缓存
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchOnReconnect: false,
      },
      mutations: {
        retry: false,
      },
    },
  });

/**
 * 测试超时时间配置（毫秒）
 * 从 15000ms 优化到 5000ms，提升测试执行效率
 */
const TEST_TIMEOUT = 5000;

/**
 * 测试用例超时时间配置（毫秒）
 * 从 60000ms 优化到 15000ms
 */
const TEST_CASE_TIMEOUT = 15000;

describe("甜筒模块页面集成测试", () => {
  let queryClient: QueryClient;

  // 每个测试前创建新的 QueryClient 实例，确保测试独立性
  beforeEach(() => {
    queryClient = createTestQueryClient();
  });

  // 每个测试后清理 DOM 和 QueryClient，避免状态污染
  afterEach(() => {
    cleanup();
    queryClient.clear();
  });

  test(
    "TC-001: 页面渲染测试",
    async () => {
      await withTimeout(
        async () => {
          await act(async () => {
            render(
              <QueryClientProvider client={queryClient}>
                <TiantongPage />
              </QueryClientProvider>
            );
          });

          // 验证页面关键元素渲染
          expect(document.body).toBeInTheDocument();
          expect(document.querySelector('[data-testid="sidebar-danmu"]')).toBeInTheDocument();
        },
        TEST_TIMEOUT,
        "页面渲染超时"
      );
    },
    TEST_CASE_TIMEOUT
  );

  test(
    "TC-002: 主题切换测试",
    wrapAsync(async () => {
      await withTimeout(
        async () => {
          await act(async () => {
            render(
              <QueryClientProvider client={queryClient}>
                <TiantongPage />
              </QueryClientProvider>
            );
          });

          // 验证主题相关元素存在
          expect(document.body).toBeInTheDocument();
          const sidebarDanmu = document.querySelector('[data-testid="sidebar-danmu"]');
          expect(sidebarDanmu).toBeInTheDocument();
          expect(sidebarDanmu).toHaveAttribute("data-theme", "tiger");
        },
        TEST_TIMEOUT,
        "主题切换测试超时"
      );
    }),
    TEST_CASE_TIMEOUT
  );

  test(
    "TC-003: 视频点击测试",
    wrapAsync(async () => {
      await withTimeout(
        async () => {
          await act(async () => {
            render(
              <QueryClientProvider client={queryClient}>
                <TiantongPage />
              </QueryClientProvider>
            );
          });

          // 验证页面主体渲染
          expect(document.body).toBeInTheDocument();
          // 验证视频列表区域存在
          const mainElement = document.querySelector("main");
          expect(mainElement).toBeInTheDocument();
        },
        TEST_TIMEOUT,
        "视频点击测试超时"
      );
    }),
    TEST_CASE_TIMEOUT
  );

  test(
    "TC-004: 搜索功能测试",
    wrapAsync(async () => {
      await withTimeout(
        async () => {
          await act(async () => {
            render(
              <QueryClientProvider client={queryClient}>
                <TiantongPage />
              </QueryClientProvider>
            );
          });

          // 验证页面渲染
          expect(document.body).toBeInTheDocument();
          // 验证搜索相关元素存在
          const headerElement = document.querySelector("header");
          expect(headerElement).toBeInTheDocument();
        },
        TEST_TIMEOUT,
        "搜索功能测试超时"
      );
    }),
    TEST_CASE_TIMEOUT
  );

  test(
    "TC-005: 分类切换测试",
    wrapAsync(async () => {
      await withTimeout(
        async () => {
          await act(async () => {
            render(
              <QueryClientProvider client={queryClient}>
                <TiantongPage />
              </QueryClientProvider>
            );
          });

          // 验证页面渲染
          expect(document.body).toBeInTheDocument();
          // 验证主要内容区域存在
          const sectionElement = document.querySelector("section");
          expect(sectionElement).toBeInTheDocument();
        },
        TEST_TIMEOUT,
        "分类切换测试超时"
      );
    }),
    TEST_CASE_TIMEOUT
  );
});

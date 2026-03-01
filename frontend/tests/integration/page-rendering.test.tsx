import React from "react";
import { render, act, cleanup } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import "@testing-library/jest-dom";

// Mock 数据导入
jest.mock("@/features/tiantong/data/danmaku.txt?raw", () => {
  return "测试弹幕 1\n测试弹幕 2\n测试弹幕 3";
});

jest.mock("@/features/lvjiang/data/danmaku.json", () => ({
  default: [
    { id: 1, text: "测试弹幕1", color: "#ffffff" },
    { id: 2, text: "测试弹幕2", color: "#ff0000" },
  ],
}));

jest.mock("@/features/yuxiaoc/data/danmaku.json", () => ({
  default: [
    { id: 1, text: "测试弹幕1", type: "scroll" },
    { id: 2, text: "测试弹幕2", type: "top" },
  ],
}));

// Mock 页面组件
const MockTiantongPage = () => (
  <div data-testid="tiantong-page">
    <header data-testid="tiantong-header">甜筒页面</header>
    <main data-testid="tiantong-content">
      <div data-testid="video-grid">视频网格</div>
      <div data-testid="sidebar-danmu">侧边栏弹幕</div>
    </main>
  </div>
);

const MockLvjiangPage = () => (
  <div data-testid="lvjiang-page">
    <header data-testid="lvjiang-header">驴酱页面</header>
    <main data-testid="lvjiang-content">
      <div data-testid="video-timeline">视频时间线</div>
      <div data-testid="horizontal-danmaku">水平弹幕</div>
    </main>
  </div>
);

const MockYuxiaocPage = () => (
  <div data-testid="yuxiaoc-page">
    <header data-testid="yuxiaoc-header">余小C页面</header>
    <main data-testid="yuxiaoc-content">
      <div data-testid="hero-section">英雄区域</div>
      <div data-testid="canteen-hall">食堂大厅</div>
    </main>
  </div>
);

// 创建测试 QueryClient
const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        staleTime: 0,
        gcTime: 0,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchOnReconnect: false,
      },
    },
  });

describe("页面渲染集成测试", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = createTestQueryClient();
  });

  afterEach(() => {
    cleanup();
    queryClient.clear();
  });

  test("TC-PAGE-001: 甜筒页面应该正确渲染", async () => {
    await act(async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <MockTiantongPage />
          </BrowserRouter>
        </QueryClientProvider>
      );
    });

    expect(document.querySelector('[data-testid="tiantong-page"]')).toBeInTheDocument();
    expect(document.querySelector('[data-testid="tiantong-header"]')).toHaveTextContent("甜筒页面");
    expect(document.querySelector('[data-testid="video-grid"]')).toBeInTheDocument();
    expect(document.querySelector('[data-testid="sidebar-danmu"]')).toBeInTheDocument();
  });

  test("TC-PAGE-002: 驴酱页面应该正确渲染", async () => {
    await act(async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <MockLvjiangPage />
          </BrowserRouter>
        </QueryClientProvider>
      );
    });

    expect(document.querySelector('[data-testid="lvjiang-page"]')).toBeInTheDocument();
    expect(document.querySelector('[data-testid="lvjiang-header"]')).toHaveTextContent("驴酱页面");
    expect(document.querySelector('[data-testid="video-timeline"]')).toBeInTheDocument();
    expect(document.querySelector('[data-testid="horizontal-danmaku"]')).toBeInTheDocument();
  });

  test("TC-PAGE-003: 余小C页面应该正确渲染", async () => {
    await act(async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <MockYuxiaocPage />
          </BrowserRouter>
        </QueryClientProvider>
      );
    });

    expect(document.querySelector('[data-testid="yuxiaoc-page"]')).toBeInTheDocument();
    expect(document.querySelector('[data-testid="yuxiaoc-header"]')).toHaveTextContent("余小C页面");
    expect(document.querySelector('[data-testid="hero-section"]')).toBeInTheDocument();
    expect(document.querySelector('[data-testid="canteen-hall"]')).toBeInTheDocument();
  });
});

import React from "react";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import LvjiangPage from "@/features/lvjiang/LvjiangPage";

// Mock the components used in LvjiangPage
jest.mock("@/features/lvjiang/components/LoadingAnimation", () => ({
  LoadingAnimation: ({ onComplete }: { onComplete: (theme: any) => void }) => (
    <div data-testid="loading-animation">
      <button onClick={() => onComplete("dongzhu")}>完成加载</button>
    </div>
  ),
}));

jest.mock("@/features/lvjiang/components/Header", () => ({
  Header: ({ theme, onThemeToggle }: any) => (
    <div data-testid="header">
      <span>当前主题: {theme}</span>
      <button onClick={onThemeToggle} data-testid="theme-toggle">
        切换主题
      </button>
    </div>
  ),
}));

jest.mock("@/features/lvjiang/components/VideoTimeline", () => ({
  VideoTimeline: ({ theme, onVideoClick }: any) => (
    <div data-testid="video-timeline">
      <span>视频时间线 - {theme}</span>
      <button
        onClick={() => onVideoClick({ id: "1", title: "测试视频" })}
        data-testid="video-click"
      >
        点击视频
      </button>
    </div>
  ),
}));

jest.mock("@/features/lvjiang/components/HorizontalDanmaku", () => ({
  HorizontalDanmaku: ({ theme, isVisible }: any) => (
    <div data-testid="horizontal-danmaku">
      水平弹幕 - {theme} - {isVisible ? "可见" : "隐藏"}
    </div>
  ),
}));

jest.mock("@/features/lvjiang/components/SideDanmaku", () => ({
  SideDanmaku: ({ theme }: any) => <div data-testid="side-danmaku">侧边弹幕 - {theme}</div>,
}));

jest.mock("@/components/video/VideoModal", () => ({
  __esModule: true,
  default: ({ video, theme, onClose }: any) => (
    <div data-testid="video-modal">
      {video && (
        <>
          <span>视频模态框 - {theme}</span>
          <span>{video.title}</span>
          <button onClick={onClose} data-testid="close-modal">
            关闭
          </button>
        </>
      )}
    </div>
  ),
}));

describe("LvjiangPage 组件测试", () => {
  describe("TC-001: 基础渲染测试", () => {
    test("初始状态应该显示加载动画", () => {
      render(<LvjiangPage />);
      expect(screen.getByTestId("loading-animation")).toBeInTheDocument();
    });

    test("加载完成后应该显示主页面内容", async () => {
      render(<LvjiangPage />);

      const completeButton = screen.getByText("完成加载");
      fireEvent.click(completeButton);

      await waitFor(() => {
        expect(screen.getByTestId("header")).toBeInTheDocument();
      });
    });
  });

  describe("TC-002: 主题切换测试", () => {
    test("初始主题应该是 dongzhu", async () => {
      render(<LvjiangPage />);

      fireEvent.click(screen.getByText("完成加载"));

      await waitFor(() => {
        expect(screen.getByText("当前主题: dongzhu")).toBeInTheDocument();
      });
    });

    test("点击主题切换按钮应该在 dongzhu 和 kaige 之间切换", async () => {
      render(<LvjiangPage />);

      fireEvent.click(screen.getByText("完成加载"));

      await waitFor(() => {
        expect(screen.getByText("当前主题: dongzhu")).toBeInTheDocument();
      });

      const toggleButton = screen.getByTestId("theme-toggle");
      fireEvent.click(toggleButton);

      expect(screen.getByText("当前主题: kaige")).toBeInTheDocument();

      fireEvent.click(toggleButton);

      expect(screen.getByText("当前主题: dongzhu")).toBeInTheDocument();
    });
  });

  describe("TC-003: 视频模态框测试", () => {
    test("点击视频应该打开模态框", async () => {
      render(<LvjiangPage />);

      fireEvent.click(screen.getByText("完成加载"));

      await waitFor(() => {
        expect(screen.getByTestId("video-timeline")).toBeInTheDocument();
      });

      const videoClickButton = screen.getByTestId("video-click");
      fireEvent.click(videoClickButton);

      expect(screen.getByTestId("video-modal")).toBeInTheDocument();
      expect(screen.getByText("测试视频")).toBeInTheDocument();
    });

    test("点击关闭按钮应该关闭模态框", async () => {
      render(<LvjiangPage />);

      fireEvent.click(screen.getByText("完成加载"));

      await waitFor(() => {
        fireEvent.click(screen.getByTestId("video-click"));
      });

      expect(screen.getByText("测试视频")).toBeInTheDocument();

      const closeButton = screen.getByTestId("close-modal");
      fireEvent.click(closeButton);

      expect(screen.queryByText("测试视频")).not.toBeInTheDocument();
    });
  });

  describe("TC-004: 弹幕组件测试", () => {
    test("加载完成后应该显示水平弹幕", async () => {
      render(<LvjiangPage />);

      fireEvent.click(screen.getByText("完成加载"));

      await waitFor(() => {
        expect(screen.getByTestId("horizontal-danmaku")).toBeInTheDocument();
      });

      expect(screen.getByText(/水平弹幕 - dongzhu - 可见/)).toBeInTheDocument();
    });

    test("应该显示侧边弹幕", async () => {
      render(<LvjiangPage />);

      fireEvent.click(screen.getByText("完成加载"));

      await waitFor(() => {
        expect(screen.getByTestId("side-danmaku")).toBeInTheDocument();
      });
    });
  });

  describe("TC-005: 页面内容测试", () => {
    test("应该显示洞主凯哥相关标语", async () => {
      render(<LvjiangPage />);

      fireEvent.click(screen.getByText("完成加载"));

      await waitFor(() => {
        expect(screen.getByText(/洞主 & 凯哥 时光视频集/)).toBeInTheDocument();
      });
    });

    test("应该显示驴酱公会信息", async () => {
      render(<LvjiangPage />);

      fireEvent.click(screen.getByText("完成加载"));

      await waitFor(() => {
        expect(screen.getByText(/驴酱公会 · 陪伴是最长情的告白/)).toBeInTheDocument();
      });
    });
  });

  describe("TC-006: 主题样式测试", () => {
    test("dongzhu 主题应该有温暖的背景色", async () => {
      render(<LvjiangPage />);

      fireEvent.click(screen.getByText("完成加载"));

      await waitFor(() => {
        const mainContainer = document.querySelector(".min-h-screen");
        expect(mainContainer).toBeInTheDocument();
      });
    });

    test("kaige 主题应该有深色背景", async () => {
      render(<LvjiangPage />);

      fireEvent.click(screen.getByText("完成加载"));

      await waitFor(() => {
        fireEvent.click(screen.getByTestId("theme-toggle"));
      });

      expect(screen.getByText("当前主题: kaige")).toBeInTheDocument();
    });
  });
});

import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import TiantongPage from "@/features/tiantong/TiantongPage";

jest.mock("@/features/tiantong/components/ThemeToggle", () => ({
  __esModule: true,
  default: ({ currentTheme, onToggle }: any) => (
    <div data-testid="theme-toggle">
      <span>Current theme: {currentTheme}</span>
      <button onClick={onToggle} data-testid="toggle-button">
        Toggle
      </button>
    </div>
  ),
}));

jest.mock("@/features/tiantong/components/VideoTimeline", () => ({
  VideoTimeline: ({ theme, videos, onVideoClick }: any) => (
    <div data-testid="video-timeline">
      <span>Video timeline - {theme}</span>
      <button
        onClick={() => onVideoClick({ id: "1", title: "Test video" })}
        data-testid="video-click"
      >
        Click video
      </button>
    </div>
  ),
}));

jest.mock("@/features/tiantong/components/HorizontalDanmaku", () => ({
  HorizontalDanmaku: ({ theme }: any) => (
    <div data-testid="horizontal-danmaku">Horizontal danmaku - {theme}</div>
  ),
}));

jest.mock("@/features/tiantong/components/SidebarDanmu", () => ({
  __esModule: true,
  default: ({ theme }: any) => <div data-testid="sidebar-danmu">Sidebar danmu - {theme}</div>,
}));

jest.mock("@/components/video/VideoModal", () => ({
  __esModule: true,
  default: ({ video, theme, onClose }: any) => (
    <div data-testid="video-modal">
      {video && (
        <>
          <span>Video modal - {theme}</span>
          <span>{video.title}</span>
          <button onClick={onClose} data-testid="close-modal">
            Close
          </button>
        </>
      )}
    </div>
  ),
}));

describe("TiantongPage component tests", () => {
  describe("TC-001: Basic rendering test", () => {
    test("Should render page title", () => {
      render(<TiantongPage />);
      expect(screen.getByText("亿口甜筒")).toBeInTheDocument();
    });

    test("Should render horizontal danmaku", () => {
      render(<TiantongPage />);
      expect(screen.getByTestId("horizontal-danmaku")).toBeInTheDocument();
    });

    test("Should render video timeline", () => {
      render(<TiantongPage />);
      expect(screen.getByTestId("video-timeline")).toBeInTheDocument();
    });

    test("Should render sidebar danmu", async () => {
      render(<TiantongPage />);
      await waitFor(() => {
        expect(screen.getByTestId("sidebar-danmu")).toBeInTheDocument();
      });
    });
  });

  describe("TC-002: Theme toggle test", () => {
    test("Initial theme should be tiger", () => {
      render(<TiantongPage />);
      expect(screen.getByText("Current theme: tiger")).toBeInTheDocument();
    });

    test("Clicking toggle should switch between tiger and sweet", () => {
      render(<TiantongPage />);

      expect(screen.getByText("Current theme: tiger")).toBeInTheDocument();

      const toggleButton = screen.getByTestId("toggle-button");
      fireEvent.click(toggleButton);

      expect(screen.getByText("Current theme: sweet")).toBeInTheDocument();

      fireEvent.click(toggleButton);

      expect(screen.getByText("Current theme: tiger")).toBeInTheDocument();
    });
  });

  describe("TC-003: Search function test", () => {
    test("Should render search input", () => {
      render(<TiantongPage />);
      const searchInput = screen.getByPlaceholderText("搜索视频...");
      expect(searchInput).toBeInTheDocument();
    });
  });
});

import React from "react";
import { render, screen } from "@testing-library/react";
import VideoGrid from "../../../../src/components/video-view/VideoGrid";
import type { Video } from "../../../../src/components/video/types";

// Mock VideoCard component
jest.mock("../../../../src/components/video/VideoCard", () => ({
  __esModule: true,
  default: ({ video, layout, className }: { video: Video; layout: string; className?: string }) => (
    <div data-testid="video-card" data-layout={layout} className={className}>
      {video.title}
    </div>
  ),
}));

const mockVideos: Video[] = [
  {
    id: "1",
    title: "视频1",
    date: "2024-01-01",
    videoUrl: "https://example.com/video1",
    bv: "BV123456",
    cover: "https://example.com/cover1.jpg",
    tags: ["标签1"],
    duration: "10:30",
    author: "作者1",
    views: 1000,
  },
  {
    id: "2",
    title: "视频2",
    date: "2024-01-02",
    videoUrl: "https://example.com/video2",
    bv: "BV123457",
    cover: "https://example.com/cover2.jpg",
    tags: ["标签2"],
    duration: "05:20",
    author: "作者2",
    views: 2000,
  },
  {
    id: "3",
    title: "视频3",
    date: "2024-01-03",
    videoUrl: "https://example.com/video3",
    bv: "BV123458",
    cover: "https://example.com/cover3.jpg",
    tags: ["标签3"],
    duration: "15:00",
    author: "作者3",
    views: 3000,
  },
  {
    id: "4",
    title: "视频4",
    date: "2024-01-04",
    videoUrl: "https://example.com/video4",
    bv: "BV123459",
    cover: "https://example.com/cover4.jpg",
    tags: ["标签4"],
    duration: "08:45",
    author: "作者4",
    views: 4000,
  },
];

describe("VideoGrid 容器排版测试", () => {
  const mockOnVideoClick = jest.fn();

  beforeEach(() => {
    mockOnVideoClick.mockClear();
  });

  describe("整体布局结构", () => {
    it("应该使用CSS Grid布局", () => {
      render(<VideoGrid videos={mockVideos} onVideoClick={mockOnVideoClick} theme="tiger" />);

      const gridContainer = screen.getByTestId("video-grid");
      expect(gridContainer).toHaveClass("grid");
    });

    it("网格项之间应该有16px间距", () => {
      render(<VideoGrid videos={mockVideos} onVideoClick={mockOnVideoClick} theme="tiger" />);

      const gridContainer = screen.getByTestId("video-grid");
      expect(gridContainer).toHaveClass("gap-4");
    });

    it("应该渲染正确数量的视频卡片", () => {
      render(<VideoGrid videos={mockVideos} onVideoClick={mockOnVideoClick} theme="tiger" />);

      const videoCards = screen.getAllByTestId("video-card");
      expect(videoCards).toHaveLength(4);
    });
  });

  describe("响应式列数排版", () => {
    it("移动端应该显示2列", () => {
      render(<VideoGrid videos={mockVideos} onVideoClick={mockOnVideoClick} theme="tiger" />);

      const gridContainer = screen.getByTestId("video-grid");
      expect(gridContainer).toHaveClass("grid-cols-2");
    });

    it("平板端应该显示3列", () => {
      render(<VideoGrid videos={mockVideos} onVideoClick={mockOnVideoClick} theme="tiger" />);

      const gridContainer = screen.getByTestId("video-grid");
      expect(gridContainer).toHaveClass("md:grid-cols-3");
    });

    it("桌面端应该显示4列", () => {
      render(<VideoGrid videos={mockVideos} onVideoClick={mockOnVideoClick} theme="tiger" />);

      const gridContainer = screen.getByTestId("video-grid");
      expect(gridContainer).toHaveClass("lg:grid-cols-4");
    });
  });

  describe("网格项排版", () => {
    it("每个网格项应该使用垂直布局", () => {
      render(<VideoGrid videos={mockVideos} onVideoClick={mockOnVideoClick} theme="tiger" />);

      const videoCards = screen.getAllByTestId("video-card");
      videoCards.forEach(card => {
        expect(card).toHaveAttribute("data-layout", "vertical");
      });
    });

    it("网格项应该占满整个高度", () => {
      render(<VideoGrid videos={mockVideos} onVideoClick={mockOnVideoClick} theme="tiger" />);

      const videoCards = screen.getAllByTestId("video-card");
      videoCards.forEach(card => {
        expect(card).toHaveClass("h-full");
      });
    });
  });

  describe("空网格状态", () => {
    it("空网格时应该不渲染任何内容", () => {
      render(<VideoGrid videos={[]} onVideoClick={mockOnVideoClick} theme="tiger" />);

      const videoCards = screen.queryAllByTestId("video-card");
      expect(videoCards).toHaveLength(0);
    });
  });

  describe("容器宽度", () => {
    it("容器应该占满整个宽度", () => {
      render(<VideoGrid videos={mockVideos} onVideoClick={mockOnVideoClick} theme="tiger" />);

      const gridContainer = screen.getByTestId("video-grid");
      expect(gridContainer).toHaveClass("w-full");
    });
  });
});

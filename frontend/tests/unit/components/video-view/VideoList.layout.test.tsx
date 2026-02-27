import React from "react";
import { render, screen } from "@testing-library/react";
import VideoList from "../../../../src/components/video-view/VideoList";
import type { Video } from "../../../../src/components/video/types";

// Mock VideoCard component
jest.mock("../../../../src/components/video/VideoCard", () => ({
  __esModule: true,
  default: ({ video, layout }: { video: Video; layout: string }) => (
    <div data-testid="video-card" data-layout={layout}>
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
];

describe("VideoList 容器排版测试", () => {
  const mockOnVideoClick = jest.fn();

  beforeEach(() => {
    mockOnVideoClick.mockClear();
  });

  describe("整体布局结构", () => {
    it("应该使用垂直flex布局", () => {
      const { container } = render(
        <VideoList
          videos={mockVideos}
          onVideoClick={mockOnVideoClick}
          theme="tiger"
        />
      );

      const listContainer = container.firstChild as HTMLElement;
      expect(listContainer).toHaveClass("flex", "flex-col");
    });

    it("列表项之间应该有16px间距", () => {
      const { container } = render(
        <VideoList
          videos={mockVideos}
          onVideoClick={mockOnVideoClick}
          theme="tiger"
        />
      );

      const listContainer = container.firstChild as HTMLElement;
      expect(listContainer).toHaveClass("gap-4");
    });

    it("应该渲染正确数量的视频卡片", () => {
      render(
        <VideoList
          videos={mockVideos}
          onVideoClick={mockOnVideoClick}
          theme="tiger"
        />
      );

      const videoCards = screen.getAllByTestId("video-card");
      expect(videoCards).toHaveLength(3);
    });
  });

  describe("列表项排版", () => {
    it("每个列表项应该使用水平布局", () => {
      render(
        <VideoList
          videos={mockVideos}
          onVideoClick={mockOnVideoClick}
          theme="tiger"
        />
      );

      const videoCards = screen.getAllByTestId("video-card");
      videoCards.forEach((card) => {
        expect(card).toHaveAttribute("data-layout", "horizontal");
      });
    });

    it("列表项应该占满整个宽度", () => {
      const { container } = render(
        <VideoList
          videos={mockVideos}
          onVideoClick={mockOnVideoClick}
          theme="tiger"
        />
      );

      const listContainer = container.firstChild as HTMLElement;
      expect(listContainer).toHaveClass("w-full");
    });
  });

  describe("空列表状态", () => {
    it("空列表时应该不渲染任何内容", () => {
      const { container } = render(
        <VideoList
          videos={[]}
          onVideoClick={mockOnVideoClick}
          theme="tiger"
        />
      );

      const videoCards = screen.queryAllByTestId("video-card");
      expect(videoCards).toHaveLength(0);
    });
  });

  describe("响应式排版", () => {
    it("容器应该在所有屏幕尺寸下保持垂直布局", () => {
      const { container } = render(
        <VideoList
          videos={mockVideos}
          onVideoClick={mockOnVideoClick}
          theme="tiger"
        />
      );

      const listContainer = container.firstChild as HTMLElement;
      // 垂直布局不随屏幕尺寸变化
      expect(listContainer).toHaveClass("flex-col");
    });
  });
});

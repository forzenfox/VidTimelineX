import React from "react";
import { render, screen } from "@testing-library/react";
import VideoCard from "../../../../src/components/video/VideoCard";
import type { Video } from "../../../../src/components/video/types";

// Mock VideoCover component
jest.mock("../../../../src/components/figma/ImageWithFallback", () => ({
  VideoCover: ({ alt }: { alt: string }) => <img alt={alt} data-testid="video-cover" />,
}));

const mockVideo: Video = {
  id: "1",
  title: "测试视频标题",
  date: "2024-01-01",
  videoUrl: "https://example.com/video",
  bv: "BV123456",
  cover: "https://example.com/cover.jpg",
  cover_url: "https://example.com/cover.jpg",
  tags: ["标签1", "标签2"],
  duration: "10:30",
  author: "测试作者",
  views: 10000,
};

describe("VideoCard 网格模式排版测试", () => {
  const mockOnClick = jest.fn();

  beforeEach(() => {
    mockOnClick.mockClear();
  });

  describe("整体布局结构", () => {
    it("应该使用垂直flex布局", () => {
      const { container } = render(
        <VideoCard
          video={mockVideo}
          onClick={mockOnClick}
          theme="tiger"
          layout="vertical"
        />
      );

      const cardElement = container.firstChild as HTMLElement;
      expect(cardElement).toHaveClass("flex", "flex-col");
    });

    it("封面和信息区应该有8px间距", () => {
      const { container } = render(
        <VideoCard
          video={mockVideo}
          onClick={mockOnClick}
          theme="tiger"
          layout="vertical"
        />
      );

      const cardElement = container.firstChild as HTMLElement;
      expect(cardElement).toHaveClass("gap-2");
    });
  });

  describe("封面图区域排版", () => {
    it("封面图应该占满整个宽度", () => {
      const { container } = render(
        <VideoCard
          video={mockVideo}
          onClick={mockOnClick}
          theme="tiger"
          layout="vertical"
        />
      );

      const coverWrapper = container.querySelector("[data-testid='video-cover']")?.parentElement;
      expect(coverWrapper).toHaveClass("w-full");
    });

    it("封面图应该保持16:9比例", () => {
      const { container } = render(
        <VideoCard
          video={mockVideo}
          onClick={mockOnClick}
          theme="tiger"
          layout="vertical"
        />
      );

      const coverWrapper = container.querySelector("[data-testid='video-cover']")?.parentElement;
      expect(coverWrapper).toHaveClass("aspect-video");
    });

    it("封面图应该有8px圆角", () => {
      const { container } = render(
        <VideoCard
          video={mockVideo}
          onClick={mockOnClick}
          theme="tiger"
          layout="vertical"
        />
      );

      const coverWrapper = container.querySelector("[data-testid='video-cover']")?.parentElement;
      expect(coverWrapper).toHaveClass("rounded-lg");
    });

    it("时长标签应该显示在右上角", () => {
      render(
        <VideoCard
          video={mockVideo}
          onClick={mockOnClick}
          theme="tiger"
          layout="vertical"
        />
      );

      const durationElement = screen.getByText("10:30");
      expect(durationElement).toHaveClass("absolute", "top-2", "right-2");
    });
  });

  describe("信息区域排版", () => {
    it("信息区域应该有适当的水平内边距", () => {
      const { container } = render(
        <VideoCard
          video={mockVideo}
          onClick={mockOnClick}
          theme="tiger"
          layout="vertical"
        />
      );

      const infoContainer = container.querySelector("[data-testid='video-card']")?.children[1];
      expect(infoContainer).toHaveClass("px-0.5");
    });
  });

  describe("标题排版", () => {
    it("标题应该使用14px字体大小", () => {
      render(
        <VideoCard
          video={mockVideo}
          onClick={mockOnClick}
          theme="tiger"
          layout="vertical"
        />
      );

      const titleElement = screen.getByText("测试视频标题");
      expect(titleElement).toHaveClass("text-sm");
    });

    it("标题应该使用medium字重", () => {
      render(
        <VideoCard
          video={mockVideo}
          onClick={mockOnClick}
          theme="tiger"
          layout="vertical"
        />
      );

      const titleElement = screen.getByText("测试视频标题");
      expect(titleElement).toHaveClass("font-medium");
    });

    it("标题应该最多显示2行", () => {
      render(
        <VideoCard
          video={mockVideo}
          onClick={mockOnClick}
          theme="tiger"
          layout="vertical"
        />
      );

      const titleElement = screen.getByText("测试视频标题");
      expect(titleElement).toHaveClass("line-clamp-2");
    });
  });

  describe("元信息排版", () => {
    it("元信息应该使用水平flex布局", () => {
      const { container } = render(
        <VideoCard
          video={mockVideo}
          onClick={mockOnClick}
          theme="tiger"
          layout="vertical"
        />
      );

      const infoContainer = container.querySelector("[data-testid='video-card']")?.children[1];
      const metaContainer = infoContainer?.children[1];
      expect(metaContainer).toHaveClass("flex");
    });

    it("元信息应该使用12px字体大小", () => {
      const { container } = render(
        <VideoCard
          video={mockVideo}
          onClick={mockOnClick}
          theme="tiger"
          layout="vertical"
        />
      );

      const infoContainer = container.querySelector("[data-testid='video-card']")?.children[1];
      const metaContainer = infoContainer?.children[1];
      expect(metaContainer).toHaveClass("text-xs");
    });

    it("元信息元素之间应该有8px间距", () => {
      const { container } = render(
        <VideoCard
          video={mockVideo}
          onClick={mockOnClick}
          theme="tiger"
          layout="vertical"
        />
      );

      const infoContainer = container.querySelector("[data-testid='video-card']")?.children[1];
      const metaContainer = infoContainer?.children[1];
      expect(metaContainer).toHaveClass("gap-2");
    });

    it("元信息应该与标题有适当间距", () => {
      const { container } = render(
        <VideoCard
          video={mockVideo}
          onClick={mockOnClick}
          theme="tiger"
          layout="vertical"
        />
      );

      const infoContainer = container.querySelector("[data-testid='video-card']")?.children[1];
      const metaContainer = infoContainer?.children[1];
      expect(metaContainer).toHaveClass("mt-1");
    });
  });

  describe("交互效果排版", () => {
    it("卡片应该有过渡动画", () => {
      const { container } = render(
        <VideoCard
          video={mockVideo}
          onClick={mockOnClick}
          theme="tiger"
          layout="vertical"
        />
      );

      const cardElement = container.firstChild as HTMLElement;
      expect(cardElement).toHaveClass("cursor-pointer");
    });

    it("标题应该有悬停颜色变化", () => {
      render(
        <VideoCard
          video={mockVideo}
          onClick={mockOnClick}
          theme="tiger"
          layout="vertical"
        />
      );

      const titleElement = screen.getByText("测试视频标题");
      expect(titleElement).toHaveClass("group-hover:text-primary", "transition-colors");
    });
  });
});

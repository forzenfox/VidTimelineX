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

describe("VideoCard 列表模式排版测试", () => {
  const mockOnClick = jest.fn();

  beforeEach(() => {
    mockOnClick.mockClear();
  });

  describe("整体布局结构", () => {
    it("应该使用flex布局，封面和信息区水平排列", () => {
      const { container } = render(
        <VideoCard
          video={mockVideo}
          onClick={mockOnClick}
          theme="tiger"
          layout="horizontal"
        />
      );

      const cardElement = container.firstChild as HTMLElement;
      expect(cardElement).toHaveClass("flex");
    });

    it("封面区域和信息区域应该有16px的间距", () => {
      const { container } = render(
        <VideoCard
          video={mockVideo}
          onClick={mockOnClick}
          theme="tiger"
          layout="horizontal"
        />
      );

      const cardElement = container.firstChild as HTMLElement;
      expect(cardElement).toHaveClass("gap-4");
    });

    it("卡片应该有适当的内边距", () => {
      const { container } = render(
        <VideoCard
          video={mockVideo}
          onClick={mockOnClick}
          theme="tiger"
          layout="horizontal"
        />
      );

      const cardElement = container.firstChild as HTMLElement;
      expect(cardElement).toHaveClass("p-3");
    });
  });

  describe("封面图区域排版", () => {
    it("封面容器应该有固定宽度180px（桌面端）", () => {
      const { container } = render(
        <VideoCard
          video={mockVideo}
          onClick={mockOnClick}
          theme="tiger"
          layout="horizontal"
        />
      );

      const coverContainer = container.querySelector("[data-testid='video-cover']")?.parentElement?.parentElement;
      expect(coverContainer).toHaveClass("lg:w-[180px]");
    });

    it("封面图应该保持16:9比例", () => {
      const { container } = render(
        <VideoCard
          video={mockVideo}
          onClick={mockOnClick}
          theme="tiger"
          layout="horizontal"
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
          layout="horizontal"
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
          layout="horizontal"
        />
      );

      const durationElement = screen.getByText("10:30");
      expect(durationElement).toHaveClass("absolute", "top-2", "right-2");
    });

    it("封面区域不应该收缩", () => {
      const { container } = render(
        <VideoCard
          video={mockVideo}
          onClick={mockOnClick}
          theme="tiger"
          layout="horizontal"
        />
      );

      const coverContainer = container.querySelector("[data-testid='video-cover']")?.parentElement?.parentElement;
      expect(coverContainer).toHaveClass("shrink-0");
    });
  });

  describe("信息区域排版", () => {
    it("信息区域应该使用flex-1占满剩余空间", () => {
      const { container } = render(
        <VideoCard
          video={mockVideo}
          onClick={mockOnClick}
          theme="tiger"
          layout="horizontal"
        />
      );

      const infoContainer = container.querySelector("[data-testid='video-card']")?.children[1];
      expect(infoContainer).toHaveClass("flex-1");
    });

    it("信息区域应该使用垂直flex布局", () => {
      const { container } = render(
        <VideoCard
          video={mockVideo}
          onClick={mockOnClick}
          theme="tiger"
          layout="horizontal"
        />
      );

      const infoContainer = container.querySelector("[data-testid='video-card']")?.children[1];
      expect(infoContainer).toHaveClass("flex", "flex-col");
    });

    it("信息区域应该有min-w-0防止溢出", () => {
      const { container } = render(
        <VideoCard
          video={mockVideo}
          onClick={mockOnClick}
          theme="tiger"
          layout="horizontal"
        />
      );

      const infoContainer = container.querySelector("[data-testid='video-card']")?.children[1];
      expect(infoContainer).toHaveClass("min-w-0");
    });
  });

  describe("标题排版", () => {
    it("标题应该使用16px字体大小", () => {
      render(
        <VideoCard
          video={mockVideo}
          onClick={mockOnClick}
          theme="tiger"
          layout="horizontal"
        />
      );

      const titleElement = screen.getByText("测试视频标题");
      expect(titleElement).toHaveClass("text-base");
    });

    it("标题应该使用semibold字重", () => {
      render(
        <VideoCard
          video={mockVideo}
          onClick={mockOnClick}
          theme="tiger"
          layout="horizontal"
        />
      );

      const titleElement = screen.getByText("测试视频标题");
      expect(titleElement).toHaveClass("font-semibold");
    });

    it("标题应该最多显示2行", () => {
      render(
        <VideoCard
          video={mockVideo}
          onClick={mockOnClick}
          theme="tiger"
          layout="horizontal"
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
          layout="horizontal"
        />
      );

      const metaContainer = container.querySelector("[aria-label='视频信息']");
      expect(metaContainer).toHaveClass("flex");
    });

    it("元信息应该使用12px字体大小", () => {
      const { container } = render(
        <VideoCard
          video={mockVideo}
          onClick={mockOnClick}
          theme="tiger"
          layout="horizontal"
        />
      );

      const metaContainer = container.querySelector("[aria-label='视频信息']");
      expect(metaContainer).toHaveClass("text-xs");
    });

    it("元信息元素之间应该有16px水平间距", () => {
      const { container } = render(
        <VideoCard
          video={mockVideo}
          onClick={mockOnClick}
          theme="tiger"
          layout="horizontal"
        />
      );

      const metaContainer = container.querySelector("[aria-label='视频信息']");
      expect(metaContainer).toHaveClass("gap-x-4");
    });

    it("元信息应该位于信息区域底部", () => {
      const { container } = render(
        <VideoCard
          video={mockVideo}
          onClick={mockOnClick}
          theme="tiger"
          layout="horizontal"
        />
      );

      const metaContainer = container.querySelector("[aria-label='视频信息']");
      expect(metaContainer).toHaveClass("mt-auto");
    });
  });

  describe("响应式排版", () => {
    it("封面宽度应该在不同屏幕尺寸下变化", () => {
      const { container } = render(
        <VideoCard
          video={mockVideo}
          onClick={mockOnClick}
          theme="tiger"
          layout="horizontal"
        />
      );

      const coverContainer = container.querySelector("[data-testid='video-cover']")?.parentElement?.parentElement;
      // 应该包含响应式宽度类
      expect(coverContainer?.className).toMatch(/w-\[\d+px\]/);
    });
  });

  describe("交互效果排版", () => {
    it("卡片应该有圆角", () => {
      const { container } = render(
        <VideoCard
          video={mockVideo}
          onClick={mockOnClick}
          theme="tiger"
          layout="horizontal"
        />
      );

      const cardElement = container.firstChild as HTMLElement;
      expect(cardElement).toHaveClass("rounded-lg");
    });

    it("卡片应该有悬停背景效果", () => {
      const { container } = render(
        <VideoCard
          video={mockVideo}
          onClick={mockOnClick}
          theme="tiger"
          layout="horizontal"
        />
      );

      const cardElement = container.firstChild as HTMLElement;
      expect(cardElement).toHaveClass("hover:bg-muted/30");
    });

    it("卡片应该有过渡动画", () => {
      const { container } = render(
        <VideoCard
          video={mockVideo}
          onClick={mockOnClick}
          theme="tiger"
          layout="horizontal"
        />
      );

      const cardElement = container.firstChild as HTMLElement;
      expect(cardElement).toHaveClass("transition-all");
    });
  });
});

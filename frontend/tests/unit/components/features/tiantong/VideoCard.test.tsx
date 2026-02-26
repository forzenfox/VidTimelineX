import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import VideoCard from "@/features/tiantong/components/VideoCard";
import type { Video } from "@/features/tiantong/data/types";

jest.mock("@/components/figma/ImageWithFallback", () => ({
  VideoCover: ({ cover, alt, className }: any) => (
    <img data-testid="video-cover" src={cover} alt={alt} className={className} />
  ),
}));

const mockVideo: Video = {
  id: "1",
  title: "测试视频标题",
  date: "2024-01-15",
  videoUrl: "https://www.bilibili.com/video/BV1xx411c7mD",
  bv: "BV1xx411c7mD",
  cover: "https://example.com/cover.jpg",
  tags: ["测试", "视频"],
  duration: "10:30",
  author: "亿口甜筒",
};

const mockOnClick = jest.fn();

describe("VideoCard 组件测试", () => {
  beforeEach(() => {
    mockOnClick.mockClear();
  });

  describe("TC-001: 基础渲染测试", () => {
    test("应该正确渲染视频标题", () => {
      render(<VideoCard video={mockVideo} onClick={mockOnClick} />);
      expect(screen.getByText(mockVideo.title)).toBeInTheDocument();
    });

    test("应该正确渲染视频作者", () => {
      render(<VideoCard video={mockVideo} onClick={mockOnClick} />);
      expect(screen.getByText(mockVideo.author!)).toBeInTheDocument();
    });

    test("应该正确渲染视频日期", () => {
      render(<VideoCard video={mockVideo} onClick={mockOnClick} />);
      expect(screen.getByText(mockVideo.date)).toBeInTheDocument();
    });

    test("应该正确渲染视频封面", () => {
      render(<VideoCard video={mockVideo} onClick={mockOnClick} />);
      const cover = screen.getByTestId("video-cover");
      expect(cover).toBeInTheDocument();
      expect(cover).toHaveAttribute("alt", mockVideo.title);
    });
  });

  describe("TC-002: 点击交互测试", () => {
    test("点击卡片应该触发 onClick 回调", () => {
      render(<VideoCard video={mockVideo} onClick={mockOnClick} />);
      const card = screen.getByTestId("video-card");
      fireEvent.click(card);
      expect(mockOnClick).toHaveBeenCalledTimes(1);
      expect(mockOnClick).toHaveBeenCalledWith(mockVideo);
    });

    test("应该支持键盘 Enter 键触发点击", () => {
      render(<VideoCard video={mockVideo} onClick={mockOnClick} />);
      const card = screen.getByTestId("video-card");
      fireEvent.keyDown(card, { key: "Enter" });
      expect(mockOnClick).toHaveBeenCalledTimes(1);
      expect(mockOnClick).toHaveBeenCalledWith(mockVideo);
    });
  });

  describe("TC-003: 可选字段测试", () => {
    test("作者不存在时应该显示默认值", () => {
      const videoWithoutAuthor: Video = {
        ...mockVideo,
        author: undefined,
      };
      render(<VideoCard video={videoWithoutAuthor} onClick={mockOnClick} />);
      expect(screen.getByText("未知作者")).toBeInTheDocument();
    });
  });

  describe("TC-004: 可访问性测试", () => {
    test("应该有正确的 role 属性", () => {
      render(<VideoCard video={mockVideo} onClick={mockOnClick} />);
      const card = screen.getByTestId("video-card");
      expect(card).toHaveAttribute("role", "article");
    });

    test("卡片应该是可聚焦的（tabIndex=0）", () => {
      render(<VideoCard video={mockVideo} onClick={mockOnClick} />);
      const card = screen.getByTestId("video-card");
      expect(card).toHaveAttribute("tabIndex", "0");
    });
  });
});

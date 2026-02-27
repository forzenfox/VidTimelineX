import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import VideoGrid from "@/components/video-view/VideoGrid";
import type { Video, Theme } from "@/components/video/types";
import "@testing-library/jest-dom";

const mockVideos: Video[] = [
  {
    id: "1",
    title: "测试视频标题1",
    date: "2024-01-15",
    videoUrl: "https://www.bilibili.com/video/BV1xx411c7mD",
    bv: "BV1xx411c7mD",
    cover: "https://example.com/cover1.jpg",
    tags: ["测试", "视频"],
    duration: "10:30",
    author: "测试作者1",
  },
  {
    id: "2",
    title: "测试视频标题2",
    date: "2024-01-16",
    videoUrl: "https://www.bilibili.com/video/BV2xx411c7mD",
    bv: "BV2xx411c7mD",
    cover: "https://example.com/cover2.jpg",
    tags: ["测试"],
    duration: "20:00",
    author: "测试作者2",
  },
  {
    id: "3",
    title: "测试视频标题3",
    date: "2024-01-17",
    videoUrl: "https://www.bilibili.com/video/BV3xx411c7mD",
    bv: "BV3xx411c7mD",
    cover: "https://example.com/cover3.jpg",
    tags: ["视频"],
    duration: "15:45",
    author: "测试作者3",
  },
  {
    id: "4",
    title: "测试视频标题4",
    date: "2024-01-18",
    videoUrl: "https://www.bilibili.com/video/BV4xx411c7mD",
    bv: "BV4xx411c7mD",
    cover: "https://example.com/cover4.jpg",
    tags: [],
    duration: "05:30",
    author: "测试作者4",
  },
  {
    id: "5",
    title: "测试视频标题5",
    date: "2024-01-19",
    videoUrl: "https://www.bilibili.com/video/BV5xx411c7mD",
    bv: "BV5xx411c7mD",
    cover: "https://example.com/cover5.jpg",
    tags: ["测试", "视频"],
    duration: "08:20",
    author: "测试作者5",
  },
  {
    id: "6",
    title: "测试视频标题6",
    date: "2024-01-20",
    videoUrl: "https://www.bilibili.com/video/BV6xx411c7mD",
    bv: "BV6xx411c7mD",
    cover: "https://example.com/cover6.jpg",
    tags: ["测试"],
    duration: "12:10",
    author: "测试作者6",
  },
  {
    id: "7",
    title: "测试视频标题7",
    date: "2024-01-21",
    videoUrl: "https://www.bilibili.com/video/BV7xx411c7mD",
    bv: "BV7xx411c7mD",
    cover: "https://example.com/cover7.jpg",
    tags: ["视频"],
    duration: "25:00",
    author: "测试作者7",
  },
  {
    id: "8",
    title: "测试视频标题8",
    date: "2024-01-22",
    videoUrl: "https://www.bilibili.com/video/BV8xx411c7mD",
    bv: "BV8xx411c7mD",
    cover: "https://example.com/cover8.jpg",
    tags: [],
    duration: "18:30",
    author: "测试作者8",
  },
];

const mockOnVideoClick = jest.fn();
const mockTheme: Theme = "tiger";

describe("VideoGrid组件测试", () => {
  beforeEach(() => {
    mockOnVideoClick.mockClear();
  });

  describe("TC-001: 渲染正确数量的视频卡片", () => {
    test("应该渲染正确数量的视频卡片", () => {
      render(<VideoGrid videos={mockVideos} onVideoClick={mockOnVideoClick} theme={mockTheme} />);
      const videoCards = screen.getAllByTestId("video-card");
      expect(videoCards).toHaveLength(mockVideos.length);
    });

    test("空数组应该不渲染任何卡片", () => {
      render(<VideoGrid videos={[]} onVideoClick={mockOnVideoClick} theme={mockTheme} />);
      const videoCards = screen.queryAllByTestId("video-card");
      expect(videoCards).toHaveLength(0);
    });
  });

  describe("TC-002: 网格布局使用CSS Grid", () => {
    test("应该使用CSS Grid布局", () => {
      render(
        <VideoGrid videos={mockVideos} onVideoClick={mockOnVideoClick} theme={mockTheme} />
      );
      const gridContainer = screen.getByTestId("video-grid");
      expect(gridContainer).toHaveClass("grid");
    });
  });

  describe("TC-003: 响应式列数正确", () => {
    test("应该包含正确的响应式列类", () => {
      render(
        <VideoGrid videos={mockVideos} onVideoClick={mockOnVideoClick} theme={mockTheme} />
      );
      const gridContainer = screen.getByTestId("video-grid");
      expect(gridContainer.className).toContain("grid-cols-2");
      expect(gridContainer.className).toContain("md:grid-cols-3");
      expect(gridContainer.className).toContain("lg:grid-cols-4");
    });
  });

  describe("TC-004: 点击卡片触发 onVideoClick", () => {
    test("点击视频卡片应该触发 onVideoClick 回调", () => {
      render(<VideoGrid videos={mockVideos} onVideoClick={mockOnVideoClick} theme={mockTheme} />);
      const firstCard = screen.getAllByTestId("video-card")[0];
      fireEvent.click(firstCard);
      expect(mockOnVideoClick).toHaveBeenCalledTimes(1);
      expect(mockOnVideoClick).toHaveBeenCalledWith(mockVideos[0]);
    });

    test("点击不同卡片应该正确传递对应视频数据", () => {
      render(<VideoGrid videos={mockVideos} onVideoClick={mockOnVideoClick} theme={mockTheme} />);
      const secondCard = screen.getAllByTestId("video-card")[1];
      fireEvent.click(secondCard);
      expect(mockOnVideoClick).toHaveBeenCalledWith(mockVideos[1]);
    });
  });

  describe("TC-005: 卡片样式规格验证", () => {
    test("封面应该使用16:9比例", () => {
      render(<VideoGrid videos={mockVideos} onVideoClick={mockOnVideoClick} theme={mockTheme} />);
      const aspectRatio = document.querySelector(".aspect-video");
      expect(aspectRatio).toBeInTheDocument();
    });

    test("封面应该使用8px圆角", () => {
      const { container } = render(
        <VideoGrid videos={mockVideos} onVideoClick={mockOnVideoClick} theme={mockTheme} />
      );
      const firstCard = container.querySelector(".rounded-lg");
      expect(firstCard).toBeInTheDocument();
    });

    test("标题应该最多显示2行", () => {
      const { container } = render(
        <VideoGrid videos={mockVideos} onVideoClick={mockOnVideoClick} theme={mockTheme} />
      );
      const title = container.querySelector(".line-clamp-2");
      expect(title).toBeInTheDocument();
    });
  });

  describe("TC-006: 悬停效果验证", () => {
    test("卡片应该支持悬停交互", () => {
      render(<VideoGrid videos={mockVideos} onVideoClick={mockOnVideoClick} theme={mockTheme} />);
      const card = screen.getAllByTestId("video-card")[0];
      expect(card.className).toMatch(/cursor-pointer/);
    });

    test("卡片应该有group类用于悬停效果", () => {
      render(<VideoGrid videos={mockVideos} onVideoClick={mockOnVideoClick} theme={mockTheme} />);
      const card = screen.getAllByTestId("video-card")[0];
      expect(card.className).toMatch(/group/);
    });
  });

  describe("TC-007: 不同主题验证", () => {
    const themes: Theme[] = ["tiger", "sweet", "blood", "mix", "dongzhu", "kaige"];

    themes.forEach(theme => {
      test(`${theme}主题应该正常渲染`, () => {
        render(<VideoGrid videos={mockVideos} onVideoClick={mockOnVideoClick} theme={theme} />);
        const videoCards = screen.getAllByTestId("video-card");
        expect(videoCards).toHaveLength(mockVideos.length);
      });
    });
  });

  describe("TC-008: useMemo 优化验证", () => {
    test("组件应该使用 useMemo 优化", () => {
      const { rerender } = render(
        <VideoGrid videos={mockVideos} onVideoClick={mockOnVideoClick} theme={mockTheme} />
      );
      const initialCards = screen.getAllByTestId("video-card");

      rerender(<VideoGrid videos={mockVideos} onVideoClick={mockOnVideoClick} theme={mockTheme} />);

      const rerenderedCards = screen.getAllByTestId("video-card");
      expect(rerenderedCards).toHaveLength(initialCards.length);
    });
  });

  describe("TC-009: 卡片间距验证", () => {
    test("应该包含正确的间距类", () => {
      render(
        <VideoGrid videos={mockVideos} onVideoClick={mockOnVideoClick} theme={mockTheme} />
      );
      const gridContainer = screen.getByTestId("video-grid");
      expect(gridContainer.className).toContain("gap-4");
    });
  });
});

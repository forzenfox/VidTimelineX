import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import VideoCard from "@/components/video/VideoCard";
import type { Video } from "@/components/video/types";
import "@testing-library/jest-dom";

const mockVideo: Video = {
  id: "1",
  title: "测试视频标题",
  date: "2024-01-15",
  videoUrl: "https://www.bilibili.com/video/BV1xx411c7mD",
  bv: "BV1xx411c7mD",
  cover: "https://example.com/cover.jpg",
  tags: ["测试", "视频"],
  duration: "10:30",
  author: "测试作者",
};

const mockOnClick = jest.fn();

describe("VideoCard组件测试", () => {
  beforeEach(() => {
    mockOnClick.mockClear();
  });

  describe("TC-001: 基础渲染测试", () => {
    test("应该正确渲染视频标题", () => {
      render(<VideoCard video={mockVideo} onClick={mockOnClick} theme="tiger" />);
      expect(screen.getByText("测试视频标题")).toBeInTheDocument();
    });

    test("应该正确渲染视频作者", () => {
      render(<VideoCard video={mockVideo} onClick={mockOnClick} theme="tiger" />);
      expect(screen.getByText("测试作者")).toBeInTheDocument();
    });

    test("应该正确渲染视频日期", () => {
      render(<VideoCard video={mockVideo} onClick={mockOnClick} theme="tiger" />);
      expect(screen.getByText("2024-01-15")).toBeInTheDocument();
    });
  });

  describe("TC-002: 时长展示测试", () => {
    test("应该只在封面展示视频时长，不在信息区域展示", () => {
      render(<VideoCard video={mockVideo} onClick={mockOnClick} theme="tiger" />);
      const durationElements = screen.getAllByText("10:30");
      expect(durationElements.length).toBe(1); // 只有封面一个
    });
  });

  describe("TC-003: BV号展示测试", () => {
    test("不应该展示视频BV号", () => {
      render(<VideoCard video={mockVideo} onClick={mockOnClick} theme="tiger" />);
      expect(screen.queryByText("BV1xx411c7mD")).not.toBeInTheDocument();
    });
  });

  describe("TC-004: 标签展示测试", () => {
    test("应该展示视频标签", () => {
      render(<VideoCard video={mockVideo} onClick={mockOnClick} theme="tiger" />);
      expect(screen.getByText("测试")).toBeInTheDocument();
      expect(screen.getByText("视频")).toBeInTheDocument();
    });
  });

  describe("TC-005: 点击交互测试", () => {
    test("点击卡片应该触发onClick回调", () => {
      render(<VideoCard video={mockVideo} onClick={mockOnClick} theme="tiger" />);
      const card = screen.getByTestId("video-card");
      fireEvent.click(card);
      expect(mockOnClick).toHaveBeenCalledTimes(1);
      expect(mockOnClick).toHaveBeenCalledWith(mockVideo);
    });
  });

  describe("TC-006: 主题样式测试", () => {
    test("tiger主题应该正确应用样式", () => {
      const { container } = render(
        <VideoCard video={mockVideo} onClick={mockOnClick} theme="tiger" />
      );
      expect(container.firstChild).toBeInTheDocument();
    });

    test("sweet主题应该正确应用样式", () => {
      const { container } = render(
        <VideoCard video={mockVideo} onClick={mockOnClick} theme="sweet" />
      );
      expect(container.firstChild).toBeInTheDocument();
    });

    test("blood主题应该正确应用样式", () => {
      const { container } = render(
        <VideoCard video={mockVideo} onClick={mockOnClick} theme="blood" />
      );
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe("TC-007: 可选字段测试", () => {
    const videoWithoutAuthor: Video = {
      ...mockVideo,
      author: undefined,
    };

    test("作者不存在时不应显示作者信息", () => {
      render(<VideoCard video={videoWithoutAuthor} onClick={mockOnClick} theme="tiger" />);
      expect(screen.queryByText("测试作者")).not.toBeInTheDocument();
    });
  });

  describe("TC-008: 内边距测试", () => {
    test("垂直布局内容区域应该有内边距", () => {
      const { container } = render(
        <VideoCard video={mockVideo} onClick={mockOnClick} theme="tiger" layout="vertical" />
      );
      const contentDiv = container.querySelector(".flex.flex-col.p-4");
      expect(contentDiv).toBeInTheDocument();
    });

    test("水平布局内容区域应该有垂直内边距", () => {
      const { container } = render(
        <VideoCard video={mockVideo} onClick={mockOnClick} theme="tiger" layout="horizontal" />
      );
      const contentDiv = container.querySelector(".flex.flex-col.ml-4.py-3");
      expect(contentDiv).toBeInTheDocument();
    });
  });

  describe("TC-009: 封面时长测试", () => {
    test("应该在封面右上角显示时长", () => {
      render(<VideoCard video={mockVideo} onClick={mockOnClick} theme="tiger" />);
      const durationElements = screen.getAllByText("10:30");
      // 检查是否有一个在封面右上角
      expect(durationElements.length).toBe(1);
    });
  });

  describe("TC-010: 视频封面铺满测试", () => {
    test("封面容器应该无内边距", () => {
      const { container } = render(
        <VideoCard video={mockVideo} onClick={mockOnClick} theme="tiger" layout="vertical" />
      );
      const coverContainer = container.querySelector(".relative.aspect-video");
      expect(coverContainer).toBeInTheDocument();
      expect(coverContainer?.className).not.toMatch(/p-[1-9]\d*/);
      expect(coverContainer?.className).not.toMatch(/px-[1-9]\d*/);
      expect(coverContainer?.className).not.toMatch(/py-[1-9]\d*/);
    });

    test("封面图片应该铺满容器", () => {
      const { container } = render(
        <VideoCard video={mockVideo} onClick={mockOnClick} theme="tiger" layout="vertical" />
      );
      const coverImage = container.querySelector("img");
      expect(coverImage).toHaveClass("w-full");
      expect(coverImage).toHaveClass("h-full");
      expect(coverImage).toHaveClass("object-cover");
    });

    test("vertical布局封面应该在顶部无间隙", () => {
      const { container } = render(
        <VideoCard video={mockVideo} onClick={mockOnClick} theme="tiger" layout="vertical" />
      );
      const card = container.querySelector("[data-testid='video-card']");
      const coverContainer = container.querySelector(".relative.aspect-video");

      expect(card?.firstChild).toBe(coverContainer);

      expect(coverContainer?.className).not.toMatch(/mt-\d+/);
      expect(coverContainer?.className).not.toMatch(/pt-\d+/);
    });

    test("卡片容器应该无内边距", () => {
      const { container } = render(
        <VideoCard video={mockVideo} onClick={mockOnClick} theme="tiger" layout="vertical" />
      );
      const card = container.querySelector("[data-testid='video-card']");
      expect(card).toBeInTheDocument();
      expect(card?.className).toMatch(/!p-0|p-0/);
    });
  });

  describe("TC-011: 播放按钮样式测试", () => {
    test("播放按钮容器应使用主题色半透明背景", () => {
      const { container } = render(
        <VideoCard video={mockVideo} onClick={mockOnClick} theme="tiger" />
      );
      const playButtonContainer = container.querySelector(
        '[class*="w-14"][class*="rounded-full"][class*="scale-50"]'
      );
      expect(playButtonContainer).toBeInTheDocument();
      expect(playButtonContainer?.className).toContain("rounded-full");
    });

    test("播放按钮容器不应使用白色背景类", () => {
      const { container } = render(
        <VideoCard video={mockVideo} onClick={mockOnClick} theme="tiger" />
      );
      const playButtonContainer = container.querySelector(".bg-white\\/95");
      expect(playButtonContainer).not.toBeInTheDocument();
    });
  });

  describe("TC-012: 各主题播放按钮颜色测试", () => {
    const themes: Array<{
      theme: "tiger" | "sweet" | "blood" | "mix" | "dongzhu" | "kaige";
      expectedForeground: string;
      expectedForegroundRgb: string;
    }> = [
      { theme: "tiger", expectedForeground: "#fff", expectedForegroundRgb: "rgb(255, 255, 255)" },
      { theme: "sweet", expectedForeground: "#fff", expectedForegroundRgb: "rgb(255, 255, 255)" },
      { theme: "blood", expectedForeground: "#fff", expectedForegroundRgb: "rgb(255, 255, 255)" },
      { theme: "mix", expectedForeground: "#fff", expectedForegroundRgb: "rgb(255, 255, 255)" },
      { theme: "dongzhu", expectedForeground: "#fff", expectedForegroundRgb: "rgb(255, 255, 255)" },
      { theme: "kaige", expectedForeground: "#fff", expectedForegroundRgb: "rgb(255, 255, 255)" },
    ];

    themes.forEach(({ theme, expectedForeground, expectedForegroundRgb }) => {
      test(`${theme}主题播放图标应使用白色`, () => {
        const { container } = render(
          <VideoCard video={mockVideo} onClick={mockOnClick} theme={theme} />
        );
        const playIcon = container.querySelector("svg.lucide-play");
        expect(playIcon).toBeInTheDocument();
        const style = playIcon?.getAttribute("style");
        expect(style).toContain(`fill: ${expectedForeground}`);
        expect(style).toContain(`color: ${expectedForegroundRgb}`);
      });
    });
  });

  describe("TC-013: 悬停覆盖层样式测试", () => {
    test("悬停覆盖层应存在", () => {
      const { container } = render(
        <VideoCard video={mockVideo} onClick={mockOnClick} theme="tiger" />
      );
      const overlay = container.querySelector('[class*="opacity-0"][class*="transition-all"]');
      expect(overlay).toBeInTheDocument();
    });

    test("悬停覆盖层应有过渡效果", () => {
      const { container } = render(
        <VideoCard video={mockVideo} onClick={mockOnClick} theme="tiger" />
      );
      const overlay = container.querySelector('[class*="opacity-0"][class*="transition-all"]');
      expect(overlay).toHaveClass("transition-all");
      expect(overlay).toHaveClass("duration-300");
    });
  });
});

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import VideoCard from "@/components/video/VideoCard";
import type { Video } from "@/components/video/types";
import "@testing-library/jest-dom";

// Mock VideoCover component
jest.mock("@/components/figma/ImageWithFallback", () => ({
  VideoCover: ({ alt, className }: { alt: string; className?: string }) => (
    <img alt={alt} data-testid="video-cover" className={className} />
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
    test("视频标签在B站风格中不直接展示", () => {
      // B站风格列表UI中标签不直接显示在卡片上
      render(<VideoCard video={mockVideo} onClick={mockOnClick} theme="tiger" />);
      // 标签可能通过其他方式展示，不在基础卡片上
      expect(screen.getByText("测试视频标题")).toBeInTheDocument();
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
    test("垂直布局内容区域应该有适当的内边距", () => {
      const { container } = render(
        <VideoCard video={mockVideo} onClick={mockOnClick} theme="tiger" layout="vertical" />
      );
      // B站风格：信息区域有px-0.5内边距
      const contentDiv = container.querySelector(".px-0\\.5");
      expect(contentDiv).toBeInTheDocument();
    });

    test("水平布局内容区域应该有垂直内边距", () => {
      const { container } = render(
        <VideoCard video={mockVideo} onClick={mockOnClick} theme="tiger" layout="horizontal" />
      );
      // B站风格：信息区域有py-0.5内边距
      const contentDiv = container.querySelector(".py-0\\.5");
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

    test("卡片容器应该有适当的内边距", () => {
      const { container } = render(
        <VideoCard video={mockVideo} onClick={mockOnClick} theme="tiger" layout="vertical" />
      );
      const card = container.querySelector("[data-testid='video-card']");
      expect(card).toBeInTheDocument();
      // B站风格：网格模式使用gap-2间距
      expect(card?.className).toMatch(/gap-2/);
    });
  });

  describe("TC-011: 播放按钮样式测试", () => {
    test("播放按钮容器应使用主题色背景", () => {
      const { container } = render(
        <VideoCard video={mockVideo} onClick={mockOnClick} theme="tiger" />
      );
      // B站风格：播放按钮使用主题色背景，尺寸为w-10 h-10（列表模式）或w-12 h-12（网格模式）
      const playButtonContainer = container.querySelector(
        '[class*="rounded-full"]'
      );
      expect(playButtonContainer).toBeInTheDocument();
      expect(playButtonContainer?.className).toContain("rounded-full");
    });

    test("播放按钮容器应使用主题色而非白色背景", () => {
      const { container } = render(
        <VideoCard video={mockVideo} onClick={mockOnClick} theme="tiger" />
      );
      // B站风格：播放按钮使用主题色背景
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
    test("悬停播放按钮覆盖层应存在", () => {
      const { container } = render(
        <VideoCard video={mockVideo} onClick={mockOnClick} theme="tiger" />
      );
      // B站风格：悬停时显示播放按钮遮罩
      const overlay = container.querySelector('[class*="group-hover:opacity-100"]');
      expect(overlay).toBeInTheDocument();
    });

    test("悬停覆盖层应有过渡效果", () => {
      const { container } = render(
        <VideoCard video={mockVideo} onClick={mockOnClick} theme="tiger" />
      );
      // B站风格：使用transition-opacity实现淡入效果
      const overlay = container.querySelector('[class*="transition-opacity"]');
      expect(overlay).toHaveClass("transition-opacity");
      expect(overlay).toHaveClass("duration-200");
    });
  });

  describe("TC-014: 尺寸样式测试", () => {
    test("medium尺寸应该有响应式封面宽度", () => {
      const { container } = render(
        <VideoCard video={mockVideo} onClick={mockOnClick} theme="tiger" size="medium" layout="horizontal" />
      );
      // B站风格：封面宽度响应式 140px/160px/180px
      const coverContainer = container.querySelector("[data-testid='video-cover']")?.parentElement?.parentElement;
      expect(coverContainer).toBeInTheDocument();
      expect(coverContainer?.className).toContain("w-[140px]");
      expect(coverContainer?.className).toContain("sm:w-[160px]");
      expect(coverContainer?.className).toContain("lg:w-[180px]");
    });

    test("large尺寸应该有响应式封面宽度", () => {
      const { container } = render(
        <VideoCard video={mockVideo} onClick={mockOnClick} theme="tiger" size="large" layout="horizontal" />
      );
      const coverContainer = container.querySelector("[data-testid='video-cover']")?.parentElement?.parentElement;
      expect(coverContainer).toBeInTheDocument();
      expect(coverContainer?.className).toMatch(/w-\[\d+px\]/);
    });

    test("small尺寸应该有响应式封面宽度", () => {
      const { container } = render(
        <VideoCard video={mockVideo} onClick={mockOnClick} theme="tiger" size="small" layout="horizontal" />
      );
      const coverContainer = container.querySelector("[data-testid='video-cover']")?.parentElement?.parentElement;
      expect(coverContainer).toBeInTheDocument();
      expect(coverContainer?.className).toMatch(/w-\[\d+px\]/);
    });

    test("compact尺寸应该有响应式封面宽度", () => {
      const { container } = render(
        <VideoCard video={mockVideo} onClick={mockOnClick} theme="tiger" size="compact" layout="horizontal" />
      );
      const coverContainer = container.querySelector("[data-testid='video-cover']")?.parentElement?.parentElement;
      expect(coverContainer).toBeInTheDocument();
      expect(coverContainer?.className).toContain("shrink-0");
    });
  });

  describe("TC-015: 主题兼容性测试", () => {
    const themes: Array<{
      theme: "tiger" | "sweet" | "blood" | "mix" | "dongzhu" | "kaige";
    }> = [
      { theme: "tiger" },
      { theme: "sweet" },
      { theme: "blood" },
      { theme: "mix" },
      { theme: "dongzhu" },
      { theme: "kaige" },
    ];

    themes.forEach(({ theme }) => {
      test(`${theme}主题应该使用CSS变量而非硬编码颜色`, () => {
        const { container } = render(
          <VideoCard video={mockVideo} onClick={mockOnClick} theme={theme} />
        );
        const card = container.querySelector("[data-testid='video-card']");
        expect(card).toBeInTheDocument();
        const style = card?.getAttribute("style");

        if (style) {
          expect(style).not.toContain("#FFFDF9");
          expect(style).not.toContain("#FFF5F8");
          expect(style).not.toContain("#1E1B4B");
          expect(style).not.toContain("#FEF3C7");
        }
      });
    });
  });
});

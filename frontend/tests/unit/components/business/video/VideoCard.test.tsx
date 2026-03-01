import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import VideoCard from "@/components/business/video/VideoCard";
import type { Video } from "@/components/business/video/types";
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
  views: 12345,
};

const mockOnClick = jest.fn();

describe("VideoCard组件测试", () => {
  beforeEach(() => {
    mockOnClick.mockClear();
  });

  /**
   * TC-001: 组件渲染测试
   * 测试目标：验证VideoCard组件能够正确渲染
   */
  describe("TC-001: 组件渲染测试", () => {
    test("应该正确渲染视频卡片组件", () => {
      render(<VideoCard video={mockVideo} onClick={mockOnClick} theme="tiger" />);
      expect(screen.getByTestId("video-card")).toBeInTheDocument();
    });

    test("应该正确渲染视频封面", () => {
      render(<VideoCard video={mockVideo} onClick={mockOnClick} theme="tiger" />);
      expect(screen.getByTestId("video-cover")).toBeInTheDocument();
    });
  });

  /**
   * TC-002: 视频信息展示测试
   * 测试目标：验证视频信息（标题、封面、日期等）正确展示
   */
  describe("TC-002: 视频信息展示测试", () => {
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

    test("应该正确渲染视频时长", () => {
      render(<VideoCard video={mockVideo} onClick={mockOnClick} theme="tiger" />);
      expect(screen.getByText("10:30")).toBeInTheDocument();
    });

    test("应该正确渲染播放量", () => {
      render(<VideoCard video={mockVideo} onClick={mockOnClick} theme="tiger" />);
      expect(screen.getByText("1.2万")).toBeInTheDocument();
    });
  });

  /**
   * TC-003: 点击事件测试
   * 测试目标：验证点击卡片能够触发onClick回调
   */
  describe("TC-003: 点击事件测试", () => {
    test("点击卡片应该触发onClick回调", () => {
      render(<VideoCard video={mockVideo} onClick={mockOnClick} theme="tiger" />);
      const card = screen.getByTestId("video-card");
      fireEvent.click(card);
      expect(mockOnClick).toHaveBeenCalledTimes(1);
      expect(mockOnClick).toHaveBeenCalledWith(mockVideo);
    });

    test("按Enter键应该触发onClick回调", () => {
      render(<VideoCard video={mockVideo} onClick={mockOnClick} theme="tiger" />);
      const card = screen.getByTestId("video-card");
      fireEvent.keyDown(card, { key: "Enter" });
      expect(mockOnClick).toHaveBeenCalledTimes(1);
      expect(mockOnClick).toHaveBeenCalledWith(mockVideo);
    });
  });

  /**
   * TC-004: 不同布局测试
   * 测试目标：验证horizontal和vertical布局正确渲染
   */
  describe("TC-004: 不同布局测试", () => {
    test("horizontal布局应该正确渲染", () => {
      const { container } = render(
        <VideoCard video={mockVideo} onClick={mockOnClick} theme="tiger" layout="horizontal" />
      );
      const card = container.querySelector("[data-testid='video-card']");
      expect(card).toHaveClass("flex");
      expect(card).toHaveClass("gap-4");
    });

    test("vertical布局应该正确渲染", () => {
      const { container } = render(
        <VideoCard video={mockVideo} onClick={mockOnClick} theme="tiger" layout="vertical" />
      );
      const card = container.querySelector("[data-testid='video-card']");
      expect(card).toHaveClass("flex-col");
      expect(card).toHaveClass("gap-2");
    });
  });

  /**
   * TC-005: 悬停状态测试
   * 测试目标：验证悬停状态样式正确应用
   */
  describe("TC-005: 悬停状态测试", () => {
    test("horizontal布局应该有悬停背景效果", () => {
      const { container } = render(
        <VideoCard video={mockVideo} onClick={mockOnClick} theme="tiger" layout="horizontal" />
      );
      const card = container.querySelector("[data-testid='video-card']");
      expect(card).toHaveClass("hover:bg-muted/30");
    });

    test("应该有悬停播放按钮覆盖层", () => {
      const { container } = render(
        <VideoCard video={mockVideo} onClick={mockOnClick} theme="tiger" />
      );
      const overlay = container.querySelector('[class*="group-hover:opacity-100"]');
      expect(overlay).toBeInTheDocument();
    });

    test("悬停覆盖层应该有过渡效果", () => {
      const { container } = render(
        <VideoCard video={mockVideo} onClick={mockOnClick} theme="tiger" />
      );
      const overlay = container.querySelector('[class*="transition-opacity"]');
      expect(overlay).toHaveClass("transition-opacity");
    });
  });

  /**
   * TC-006: 自定义类名测试
   * 测试目标：验证自定义className正确应用
   */
  describe("TC-006: 自定义类名测试", () => {
    test("应该正确应用自定义类名", () => {
      const { container } = render(
        <VideoCard video={mockVideo} onClick={mockOnClick} theme="tiger" className="custom-class" />
      );
      const card = container.querySelector("[data-testid='video-card']");
      expect(card).toHaveClass("custom-class");
    });

    test("应该支持多个自定义类名", () => {
      const { container } = render(
        <VideoCard
          video={mockVideo}
          onClick={mockOnClick}
          theme="tiger"
          className="custom-class another-class"
        />
      );
      const card = container.querySelector("[data-testid='video-card']");
      expect(card).toHaveClass("custom-class");
      expect(card).toHaveClass("another-class");
    });
  });

  /**
   * TC-007: 主题样式测试
   * 测试目标：验证不同主题正确应用样式
   */
  describe("TC-007: 主题样式测试", () => {
    const themes: Array<"tiger" | "sweet" | "blood" | "mix" | "dongzhu" | "kaige"> = [
      "tiger",
      "sweet",
      "blood",
      "mix",
      "dongzhu",
      "kaige",
    ];

    themes.forEach(theme => {
      test(`${theme}主题应该正确渲染`, () => {
        const { container } = render(
          <VideoCard video={mockVideo} onClick={mockOnClick} theme={theme} />
        );
        expect(container.firstChild).toBeInTheDocument();
      });
    });
  });

  /**
   * TC-008: 可选字段测试
   * 测试目标：验证可选字段（作者、播放量等）不存在时正确处理
   */
  describe("TC-008: 可选字段测试", () => {
    test("作者不存在时不应显示作者信息", () => {
      const videoWithoutAuthor = { ...mockVideo, author: undefined };
      render(<VideoCard video={videoWithoutAuthor} onClick={mockOnClick} theme="tiger" />);
      expect(screen.queryByText("测试作者")).not.toBeInTheDocument();
    });

    test("播放量不存在时不应显示播放量", () => {
      const videoWithoutViews = { ...mockVideo, views: undefined };
      render(<VideoCard video={videoWithoutViews} onClick={mockOnClick} theme="tiger" />);
      // 播放量区域不应该存在
      expect(screen.queryByText("1.2万")).not.toBeInTheDocument();
    });

    test("时长不存在时不应显示时长", () => {
      const videoWithoutDuration = { ...mockVideo, duration: undefined };
      const { container } = render(
        <VideoCard video={videoWithoutDuration} onClick={mockOnClick} theme="tiger" />
      );
      // 时长标签不应该存在
      expect(container.querySelector("[class*='absolute top-2 right-2']")).not.toBeInTheDocument();
    });
  });

  /**
   * TC-009: 无障碍属性测试
   * 测试目标：验证ARIA属性和键盘导航正确配置
   */
  describe("TC-009: 无障碍属性测试", () => {
    test("应该有正确的role属性", () => {
      render(<VideoCard video={mockVideo} onClick={mockOnClick} theme="tiger" />);
      const card = screen.getByTestId("video-card");
      expect(card).toHaveAttribute("role", "article");
    });

    test("应该有正确的tabIndex属性", () => {
      render(<VideoCard video={mockVideo} onClick={mockOnClick} theme="tiger" />);
      const card = screen.getByTestId("video-card");
      expect(card).toHaveAttribute("tabIndex", "0");
    });

    test("应该有正确的aria-labelledby属性", () => {
      render(<VideoCard video={mockVideo} onClick={mockOnClick} theme="tiger" />);
      const card = screen.getByTestId("video-card");
      expect(card).toHaveAttribute("aria-labelledby", "video-title-1");
    });

    test("标题应该有正确的id属性", () => {
      render(<VideoCard video={mockVideo} onClick={mockOnClick} theme="tiger" />);
      const title = screen.getByText("测试视频标题");
      expect(title).toHaveAttribute("id", "video-title-1");
    });
  });

  /**
   * TC-010: 播放量格式化测试
   * 测试目标：验证播放量格式化逻辑正确
   */
  describe("TC-010: 播放量格式化测试", () => {
    test("播放量小于10000应该直接显示数字", () => {
      const videoWithSmallViews = { ...mockVideo, views: 9999 };
      render(<VideoCard video={videoWithSmallViews} onClick={mockOnClick} theme="tiger" />);
      expect(screen.getByText("9999")).toBeInTheDocument();
    });

    test("播放量大于等于10000应该显示为万", () => {
      const videoWithLargeViews = { ...mockVideo, views: 15000 };
      render(<VideoCard video={videoWithLargeViews} onClick={mockOnClick} theme="tiger" />);
      expect(screen.getByText("1.5万")).toBeInTheDocument();
    });

    test("播放量字符串应该正确解析", () => {
      const videoWithStringViews = { ...mockVideo, views: "25000" };
      render(<VideoCard video={videoWithStringViews} onClick={mockOnClick} theme="tiger" />);
      expect(screen.getByText("2.5万")).toBeInTheDocument();
    });
  });
});

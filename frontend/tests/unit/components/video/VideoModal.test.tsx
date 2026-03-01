import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import VideoModal from "@/components/business/video/VideoModal";
import type { Video } from "@/components/business/video/types";
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

const mockOnClose = jest.fn();

describe("VideoModal组件测试", () => {
  beforeEach(() => {
    mockOnClose.mockClear();
  });

  afterEach(() => {
    document.body.style.overflow = "unset";
  });

  describe("TC-001: 基础渲染测试", () => {
    test("应该正确渲染视频标题", () => {
      render(<VideoModal video={mockVideo} onClose={mockOnClose} theme="tiger" />);
      expect(screen.getByText("测试视频标题")).toBeInTheDocument();
    });

    test("应该正确渲染视频作者", () => {
      render(<VideoModal video={mockVideo} onClose={mockOnClose} theme="tiger" />);
      expect(screen.getByText(/测试作者/)).toBeInTheDocument();
    });

    test("应该正确渲染视频日期", () => {
      render(<VideoModal video={mockVideo} onClose={mockOnClose} theme="tiger" />);
      expect(screen.getByText(/2024-01-15/)).toBeInTheDocument();
    });

    test("应该正确渲染视频时长", () => {
      render(<VideoModal video={mockVideo} onClose={mockOnClose} theme="tiger" />);
      expect(screen.getByText(/10:30/)).toBeInTheDocument();
    });
  });

  describe("TC-002: BV号展示测试", () => {
    test("应该展示视频BV号（使用video.bv字段）", () => {
      render(<VideoModal video={mockVideo} onClose={mockOnClose} theme="tiger" />);
      expect(screen.getByText(/BV1xx411c7mD/)).toBeInTheDocument();
    });

    test("BV号应该直接从video.bv字段读取，而非从URL解析", () => {
      const videoWithDifferentUrl: Video = {
        ...mockVideo,
        videoUrl: "https://www.bilibili.com/video/BV9999999999",
        bv: "BV1xx411c7mD",
      };
      render(<VideoModal video={videoWithDifferentUrl} onClose={mockOnClose} theme="tiger" />);
      expect(screen.getByText(/BV1xx411c7mD/)).toBeInTheDocument();
      expect(screen.queryByText(/BV9999999999/)).not.toBeInTheDocument();
    });
  });

  describe("TC-003: 标签展示测试", () => {
    test("应该展示视频标签", () => {
      render(<VideoModal video={mockVideo} onClose={mockOnClose} theme="tiger" />);
      expect(screen.getByText("测试")).toBeInTheDocument();
      expect(screen.getByText("视频")).toBeInTheDocument();
    });
  });

  describe("TC-004: 关闭功能测试", () => {
    test("点击关闭按钮应该触发onClose回调", () => {
      render(<VideoModal video={mockVideo} onClose={mockOnClose} theme="tiger" />);
      const closeButton = screen.getByLabelText("关闭弹窗");
      fireEvent.click(closeButton);
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
  });

  describe("TC-005: 空视频测试", () => {
    test("视频为null时不应渲染", () => {
      const { container } = render(<VideoModal video={null} onClose={mockOnClose} theme="tiger" />);
      expect(container.firstChild).toBeNull();
    });
  });

  describe("TC-006: 主题样式测试", () => {
    test("tiger主题应该正确应用样式", () => {
      const { container } = render(
        <VideoModal video={mockVideo} onClose={mockOnClose} theme="tiger" />
      );
      expect(container.firstChild).toBeInTheDocument();
    });

    test("sweet主题应该正确应用样式", () => {
      const { container } = render(
        <VideoModal video={mockVideo} onClose={mockOnClose} theme="sweet" />
      );
      expect(container.firstChild).toBeInTheDocument();
    });

    test("blood主题应该正确应用样式", () => {
      const { container } = render(
        <VideoModal video={mockVideo} onClose={mockOnClose} theme="blood" />
      );
      expect(container.firstChild).toBeInTheDocument();
    });
  });
});

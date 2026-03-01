import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
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
  tags: ["测试", "视频", "标签"],
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

  /**
   * TC-001: 组件渲染测试
   * 测试目标：验证VideoModal组件能够正确渲染
   */
  describe("TC-001: 组件渲染测试", () => {
    test("应该正确渲染视频弹窗组件", () => {
      render(<VideoModal video={mockVideo} onClose={mockOnClose} theme="tiger" />);
      expect(screen.getByTestId("video-modal")).toBeInTheDocument();
    });

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

  /**
   * TC-002: 打开/关闭交互测试
   * 测试目标：验证弹窗的打开和关闭交互
   */
  describe("TC-002: 打开/关闭交互测试", () => {
    test("点击关闭按钮应该触发onClose回调", () => {
      render(<VideoModal video={mockVideo} onClose={mockOnClose} theme="tiger" />);
      const closeButton = screen.getByLabelText("关闭弹窗");
      fireEvent.click(closeButton);
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    test("点击遮罩层应该触发onClose回调", () => {
      render(<VideoModal video={mockVideo} onClose={mockOnClose} theme="tiger" />);
      const modal = screen.getByTestId("video-modal");
      fireEvent.click(modal);
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    test("点击内容区域不应该触发onClose回调", () => {
      render(<VideoModal video={mockVideo} onClose={mockOnClose} theme="tiger" />);
      const content = screen.getByText("测试视频标题");
      fireEvent.click(content);
      expect(mockOnClose).not.toHaveBeenCalled();
    });

    test("按下Escape键应该触发onClose回调", () => {
      render(<VideoModal video={mockVideo} onClose={mockOnClose} theme="tiger" />);
      fireEvent.keyDown(document, { key: "Escape" });
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
  });

  /**
   * TC-003: 视频播放测试
   * 测试目标：验证视频播放器正确加载
   */
  describe("TC-003: 视频播放测试", () => {
    test("应该正确渲染iframe播放器", () => {
      render(<VideoModal video={mockVideo} onClose={mockOnClose} theme="tiger" />);
      const iframe = screen.getByTitle("测试视频标题");
      expect(iframe).toBeInTheDocument();
      expect(iframe).toHaveAttribute("allowFullScreen");
    });

    test("iframe应该包含正确的BV号", () => {
      render(<VideoModal video={mockVideo} onClose={mockOnClose} theme="tiger" />);
      const iframe = screen.getByTitle("测试视频标题");
      expect(iframe).toHaveAttribute(
        "src",
        "https://player.bilibili.com/player.html?bvid=BV1xx411c7mD&page=1&high_quality=1&danmaku=1"
      );
    });

    test("加载时应该显示加载动画", () => {
      render(<VideoModal video={mockVideo} onClose={mockOnClose} theme="tiger" />);
      const loadingSpinner = document.querySelector(".animate-spin");
      expect(loadingSpinner).toBeInTheDocument();
    });

    test("iframe加载完成后应该隐藏加载动画", async () => {
      render(<VideoModal video={mockVideo} onClose={mockOnClose} theme="tiger" />);
      const iframe = screen.getByTitle("测试视频标题");
      fireEvent.load(iframe);
      await waitFor(() => {
        const loadingSpinner = document.querySelector(".animate-spin");
        expect(loadingSpinner).not.toBeInTheDocument();
      });
    });
  });

  /**
   * TC-004: BV号展示测试
   * 测试目标：验证BV号正确展示
   */
  describe("TC-004: BV号展示测试", () => {
    test("应该展示视频BV号", () => {
      render(<VideoModal video={mockVideo} onClose={mockOnClose} theme="tiger" />);
      expect(screen.getByText(/BV1xx411c7mD/)).toBeInTheDocument();
    });

    test("BV号应该直接从video.bv字段读取", () => {
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

  /**
   * TC-005: 弹幕显示测试
   * 测试目标：验证弹幕功能正确配置
   */
  describe("TC-005: 弹幕显示测试", () => {
    test("iframe URL应该包含danmaku=1参数", () => {
      render(<VideoModal video={mockVideo} onClose={mockOnClose} theme="tiger" />);
      const iframe = screen.getByTitle("测试视频标题");
      const src = iframe.getAttribute("src");
      expect(src).toContain("danmaku=1");
    });

    test("iframe URL应该包含high_quality=1参数", () => {
      render(<VideoModal video={mockVideo} onClose={mockOnClose} theme="tiger" />);
      const iframe = screen.getByTitle("测试视频标题");
      const src = iframe.getAttribute("src");
      expect(src).toContain("high_quality=1");
    });
  });

  /**
   * TC-006: 标签展示测试
   * 测试目标：验证视频标签正确展示
   */
  describe("TC-006: 标签展示测试", () => {
    test("应该展示视频标签", () => {
      render(<VideoModal video={mockVideo} onClose={mockOnClose} theme="tiger" />);
      expect(screen.getByText("测试")).toBeInTheDocument();
      expect(screen.getByText("视频")).toBeInTheDocument();
      expect(screen.getByText("标签")).toBeInTheDocument();
    });

    test("空标签数组不应该渲染标签区域", () => {
      const videoWithoutTags = { ...mockVideo, tags: [] };
      const { container } = render(
        <VideoModal video={videoWithoutTags} onClose={mockOnClose} theme="tiger" />
      );
      const tagElements = container.querySelectorAll("[class*='px-3 py-1']");
      expect(tagElements.length).toBe(0);
    });
  });

  /**
   * TC-007: 空视频测试
   * 测试目标：验证视频为null时正确处理
   */
  describe("TC-007: 空视频测试", () => {
    test("视频为null时不应渲染", () => {
      const { container } = render(<VideoModal video={null} onClose={mockOnClose} theme="tiger" />);
      expect(container.firstChild).toBeNull();
    });
  });

  /**
   * TC-008: 主题样式测试
   * 测试目标：验证不同主题正确应用样式
   */
  describe("TC-008: 主题样式测试", () => {
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
          <VideoModal video={mockVideo} onClose={mockOnClose} theme={theme} />
        );
        expect(container.firstChild).toBeInTheDocument();
      });
    });
  });

  /**
   * TC-009: 自定义类名测试
   * 测试目标：验证自定义className正确应用
   */
  describe("TC-009: 自定义类名测试", () => {
    test("应该正确应用自定义类名", () => {
      const { container } = render(
        <VideoModal
          video={mockVideo}
          onClose={mockOnClose}
          theme="tiger"
          className="custom-modal-class"
        />
      );
      const modalContent = container.querySelector(".custom-modal-class");
      expect(modalContent).toBeInTheDocument();
    });

    test("应该支持多个自定义类名", () => {
      const { container } = render(
        <VideoModal
          video={mockVideo}
          onClose={mockOnClose}
          theme="tiger"
          className="custom-class another-class"
        />
      );
      const modalContent = container.querySelector(".custom-class");
      expect(modalContent).toBeInTheDocument();
      expect(modalContent).toHaveClass("another-class");
    });
  });

  /**
   * TC-010: 跳转链接测试
   * 测试目标：验证B站跳转链接正确配置
   */
  describe("TC-010: 跳转链接测试", () => {
    test("应该显示跳转B站观看按钮", () => {
      render(<VideoModal video={mockVideo} onClose={mockOnClose} theme="tiger" />);
      const linkButton = screen.getByText(/跳转B站观看/);
      expect(linkButton).toBeInTheDocument();
    });

    test("跳转链接应该指向正确的视频URL", () => {
      render(<VideoModal video={mockVideo} onClose={mockOnClose} theme="tiger" />);
      const link = screen.getByRole("link");
      expect(link).toHaveAttribute("href", mockVideo.videoUrl);
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
    });

    test("tiger主题应该显示老虎图标", () => {
      render(<VideoModal video={mockVideo} onClose={mockOnClose} theme="tiger" />);
      expect(screen.getByText(/🐯 跳转B站观看/)).toBeInTheDocument();
    });

    test("sweet主题应该显示冰淇淋图标", () => {
      render(<VideoModal video={mockVideo} onClose={mockOnClose} theme="sweet" />);
      expect(screen.getByText(/🍦 跳转B站观看/)).toBeInTheDocument();
    });
  });

  /**
   * TC-011: 无障碍属性测试
   * 测试目标：验证ARIA属性正确配置
   */
  describe("TC-011: 无障碍属性测试", () => {
    test("应该有正确的role属性", () => {
      render(<VideoModal video={mockVideo} onClose={mockOnClose} theme="tiger" />);
      const dialog = screen.getByRole("dialog");
      expect(dialog).toBeInTheDocument();
    });

    test("应该有正确的aria-modal属性", () => {
      render(<VideoModal video={mockVideo} onClose={mockOnClose} theme="tiger" />);
      const dialog = screen.getByRole("dialog");
      expect(dialog).toHaveAttribute("aria-modal", "true");
    });

    test("应该有正确的aria-labelledby属性", () => {
      render(<VideoModal video={mockVideo} onClose={mockOnClose} theme="tiger" />);
      const dialog = screen.getByRole("dialog");
      expect(dialog).toHaveAttribute("aria-labelledby", "modal-title");
    });

    test("关闭按钮应该有正确的aria-label属性", () => {
      render(<VideoModal video={mockVideo} onClose={mockOnClose} theme="tiger" />);
      const closeButton = screen.getByLabelText("关闭弹窗");
      expect(closeButton).toBeInTheDocument();
    });
  });

  /**
   * TC-012: body滚动锁定测试
   * 测试目标：验证弹窗打开时body滚动被锁定
   */
  describe("TC-012: body滚动锁定测试", () => {
    test("弹窗打开时应该锁定body滚动", () => {
      render(<VideoModal video={mockVideo} onClose={mockOnClose} theme="tiger" />);
      expect(document.body.style.overflow).toBe("hidden");
    });

    test("弹窗关闭时应该恢复body滚动", () => {
      const { unmount } = render(
        <VideoModal video={mockVideo} onClose={mockOnClose} theme="tiger" />
      );
      expect(document.body.style.overflow).toBe("hidden");
      unmount();
      expect(document.body.style.overflow).toBe("unset");
    });
  });
});

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { VideoTimeline } from "@/features/lvjiang/components/VideoTimeline";
import { videos } from "@/features/lvjiang/data";
import "@testing-library/jest-dom";

// 模拟 VideoCard 组件
jest.mock("@/components/business/video/VideoCard", () => {
  return function MockVideoCard({
    video,
    onClick,
    theme,
  }: {
    video: { id: string; title: string };
    onClick: (v: typeof video) => void;
    theme: string;
  }) {
    return (
      <div
        data-testid={`video-card-${video.id}`}
        data-theme={theme}
        onClick={() => onClick(video)}
        className="mock-video-card"
      >
        <span data-slot="video-title">{video.title}</span>
      </div>
    );
  };
});

describe("VideoTimeline 组件测试", () => {
  const mockOnVideoClick = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  /**
   * 测试用例 TC-VT-001: 组件渲染测试
   * 测试目标：验证 VideoTimeline 组件能够正确渲染
   */
  test("TC-VT-001: 组件渲染测试", () => {
    render(<VideoTimeline theme="dongzhu" onVideoClick={mockOnVideoClick} />);

    // 验证标题渲染
    expect(screen.getByRole("heading", { level: 2 })).toBeInTheDocument();
    expect(screen.getByText(/时光视频集/)).toBeInTheDocument();
  });

  /**
   * 测试用例 TC-VT-002: 洞主主题渲染测试
   * 测试目标：验证洞主主题下组件正确渲染
   */
  test("TC-VT-002: 洞主主题渲染测试", () => {
    render(<VideoTimeline theme="dongzhu" onVideoClick={mockOnVideoClick} />);

    // 验证洞主主题标题
    expect(screen.getByText("🐷 时光视频集")).toBeInTheDocument();
    expect(screen.getByText("怪力的欢乐时光")).toBeInTheDocument();
  });

  /**
   * 测试用例 TC-VT-003: 凯哥主题渲染测试
   * 测试目标：验证凯哥主题下组件正确渲染
   */
  test("TC-VT-003: 凯哥主题渲染测试", () => {
    render(<VideoTimeline theme="kaige" onVideoClick={mockOnVideoClick} />);

    // 验证凯哥主题标题
    expect(screen.getByText("🐗 时光视频集")).toBeInTheDocument();
    expect(screen.getByText("之神的硬核时刻")).toBeInTheDocument();
  });

  /**
   * 测试用例 TC-VT-004: 视频列表渲染测试
   * 测试目标：验证视频列表正确渲染
   */
  test("TC-VT-004: 视频列表渲染测试", () => {
    render(<VideoTimeline theme="dongzhu" onVideoClick={mockOnVideoClick} />);

    // 验证视频卡片渲染数量
    const videoCards = screen.getAllByTestId(/video-card-/);
    expect(videoCards.length).toBeGreaterThan(0);
    expect(videoCards.length).toBeLessThanOrEqual(videos.length);
  });

  /**
   * 测试用例 TC-VT-005: 视频点击事件测试
   * 测试目标：验证点击视频时触发回调函数
   */
  test("TC-VT-005: 视频点击事件测试", () => {
    render(<VideoTimeline theme="dongzhu" onVideoClick={mockOnVideoClick} />);

    // 获取第一个视频卡片
    const firstVideoCard = screen.getAllByTestId(/video-card-/)[0];
    expect(firstVideoCard).toBeInTheDocument();

    // 点击视频卡片
    fireEvent.click(firstVideoCard);

    // 验证回调函数被调用
    expect(mockOnVideoClick).toHaveBeenCalledTimes(1);
  });

  /**
   * 测试用例 TC-VT-006: 中心时间线显示测试
   * 测试目标：验证中心时间线元素存在
   */
  test("TC-VT-006: 中心时间线显示测试", () => {
    const { container } = render(
      <VideoTimeline theme="dongzhu" onVideoClick={mockOnVideoClick} />
    );

    // 验证中心线元素存在（桌面端显示）
    // 使用属性选择器避免 CSS 类名中的特殊字符问题
    const centerLine = container.querySelector('[class*="left-1/2"]');
    expect(centerLine).toBeInTheDocument();
  });

  /**
   * 测试用例 TC-VT-007: 节点图标显示测试
   * 测试目标：验证时间线节点图标正确渲染
   */
  test("TC-VT-007: 节点图标显示测试", () => {
    const { container } = render(
      <VideoTimeline theme="dongzhu" onVideoClick={mockOnVideoClick} />
    );

    // 验证节点图标存在
    const nodeIcons = container.querySelectorAll(".rounded-full");
    expect(nodeIcons.length).toBeGreaterThan(0);
  });

  /**
   * 测试用例 TC-VT-008: 洞主主题节点图标测试
   * 测试目标：验证洞主主题下显示猪图标
   */
  test("TC-VT-008: 洞主主题节点图标测试", () => {
    const { container } = render(
      <VideoTimeline theme="dongzhu" onVideoClick={mockOnVideoClick} />
    );

    // 验证洞主主题显示猪表情
    expect(container.textContent).toContain("🐷");
  });

  /**
   * 测试用例 TC-VT-009: 凯哥主题节点图标测试
   * 测试目标：验证凯哥主题下显示野猪图标
   */
  test("TC-VT-009: 凯哥主题节点图标测试", () => {
    const { container } = render(
      <VideoTimeline theme="kaige" onVideoClick={mockOnVideoClick} />
    );

    // 验证凯哥主题显示野猪表情
    expect(container.textContent).toContain("🐗");
  });

  /**
   * 测试用例 TC-VT-010: 主题切换测试
   * 测试目标：验证主题切换时组件正确更新
   */
  test("TC-VT-010: 主题切换测试", () => {
    const { rerender, container } = render(
      <VideoTimeline theme="dongzhu" onVideoClick={mockOnVideoClick} />
    );

    // 初始为洞主主题
    expect(container.textContent).toContain("🐷");

    // 切换到凯哥主题
    rerender(<VideoTimeline theme="kaige" onVideoClick={mockOnVideoClick} />);

    // 验证凯哥主题
    expect(container.textContent).toContain("🐗");
    expect(screen.getByText("之神的硬核时刻")).toBeInTheDocument();
  });
});

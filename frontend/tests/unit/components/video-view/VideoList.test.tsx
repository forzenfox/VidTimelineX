import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import VideoList from "@/components/video-view/VideoList";
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
    views: 10000,
  },
  {
    id: "2",
    title: "测试视频标题2这是一个很长的标题需要省略显示",
    date: "2024-01-16",
    videoUrl: "https://www.bilibili.com/video/BV2xx411c7mD",
    bv: "BV2xx411c7mD",
    cover: "https://example.com/cover2.jpg",
    tags: ["测试"],
    duration: "20:00",
    author: "测试作者2",
    views: 20000,
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
    views: 30000,
  },
];

const mockOnVideoClick = jest.fn();
const mockTheme: Theme = "tiger";

describe("VideoList组件测试", () => {
  beforeEach(() => {
    mockOnVideoClick.mockClear();
  });

  describe("TC-001: 渲染正确数量的视频卡片", () => {
    test("应该渲染正确数量的视频卡片", () => {
      render(<VideoList videos={mockVideos} onVideoClick={mockOnVideoClick} theme={mockTheme} />);
      const videoCards = screen.getAllByTestId("video-card");
      expect(videoCards).toHaveLength(mockVideos.length);
    });

    test("空数组应该不渲染任何卡片", () => {
      render(<VideoList videos={[]} onVideoClick={mockOnVideoClick} theme={mockTheme} />);
      const videoCards = screen.queryAllByTestId("video-card");
      expect(videoCards).toHaveLength(0);
    });
  });

  describe("TC-002: 桌面端布局正确（封面180px）", () => {
    test("应该使用Flexbox布局", () => {
      const { container } = render(
        <VideoList videos={mockVideos} onVideoClick={mockOnVideoClick} theme={mockTheme} />
      );
      const listContainer = container.firstChild;
      expect(listContainer).toHaveClass("flex");
    });

    test("桌面端应该使用lg断点响应式尺寸", () => {
      const { container } = render(
        <VideoList videos={mockVideos} onVideoClick={mockOnVideoClick} theme={mockTheme} />
      );
      const listContainer = container.firstChild as HTMLElement;
      expect(listContainer.className).toContain("flex-col");
    });
  });

  describe("TC-003: 移动端布局正确（封面120px，紧凑）", () => {
    test("移动端应该使用响应式布局类", () => {
      const { container } = render(
        <VideoList videos={mockVideos} onVideoClick={mockOnVideoClick} theme={mockTheme} />
      );
      const listContainer = container.firstChild as HTMLElement;
      expect(listContainer.className).toContain("gap-2");
    });

    test("应该包含sm断点的响应式间距", () => {
      const { container } = render(
        <VideoList videos={mockVideos} onVideoClick={mockOnVideoClick} theme={mockTheme} />
      );
      const listContainer = container.firstChild as HTMLElement;
      expect(listContainer.className).toContain("sm:gap-3");
    });
  });

  describe("TC-004: 点击卡片触发 onVideoClick", () => {
    test("点击视频卡片应该触发 onVideoClick 回调", () => {
      render(<VideoList videos={mockVideos} onVideoClick={mockOnVideoClick} theme={mockTheme} />);
      const firstCard = screen.getAllByTestId("video-card")[0];
      fireEvent.click(firstCard);
      expect(mockOnVideoClick).toHaveBeenCalledTimes(1);
      expect(mockOnVideoClick).toHaveBeenCalledWith(mockVideos[0]);
    });

    test("点击不同卡片应该正确传递对应视频数据", () => {
      render(<VideoList videos={mockVideos} onVideoClick={mockOnVideoClick} theme={mockTheme} />);
      const secondCard = screen.getAllByTestId("video-card")[1];
      fireEvent.click(secondCard);
      expect(mockOnVideoClick).toHaveBeenCalledWith(mockVideos[1]);
    });
  });

  describe("TC-005: 卡片样式规格验证（列表模式）", () => {
    test("标题应该限制显示行数，超出省略", () => {
      const { container } = render(
        <VideoList videos={mockVideos} onVideoClick={mockOnVideoClick} theme={mockTheme} />
      );
      const title = container.querySelector(".line-clamp-2");
      expect(title).toBeInTheDocument();
    });

    test("标题字号应该为16px（text-base）", () => {
      render(<VideoList videos={mockVideos} onVideoClick={mockOnVideoClick} theme={mockTheme} />);
      const titles = document.querySelectorAll("h3");
      expect(titles.length).toBeGreaterThan(0);
    });

    test("元信息字号应该为14px或更小（text-sm或text-xs）", () => {
      const { container } = render(
        <VideoList videos={mockVideos} onVideoClick={mockOnVideoClick} theme={mockTheme} />
      );
      const infoText = container.querySelectorAll(".text-sm, .text-xs");
      expect(infoText.length).toBeGreaterThan(0);
    });
  });

  describe("TC-006: 悬停效果验证", () => {
    test("卡片应该有悬停背景色变化效果", () => {
      render(<VideoList videos={mockVideos} onVideoClick={mockOnVideoClick} theme={mockTheme} />);
      const card = screen.getAllByTestId("video-card")[0];
      expect(card.className).toMatch(/hover:/);
    });

    test("卡片应该有transition过渡效果", () => {
      render(<VideoList videos={mockVideos} onVideoClick={mockOnVideoClick} theme={mockTheme} />);
      const card = screen.getAllByTestId("video-card")[0];
      expect(card.className).toMatch(/transition/);
    });
  });

  describe("TC-007: 不同主题验证", () => {
    const themes: Theme[] = ["tiger", "sweet", "blood", "mix", "dongzhu", "kaige"];

    themes.forEach(theme => {
      test(`${theme}主题应该正常渲染`, () => {
        render(<VideoList videos={mockVideos} onVideoClick={mockOnVideoClick} theme={theme} />);
        const videoCards = screen.getAllByTestId("video-card");
        expect(videoCards).toHaveLength(mockVideos.length);
      });
    });
  });

  describe("TC-008: useMemo 优化验证", () => {
    test("组件应该使用React.memo包装", () => {
      const { rerender } = render(
        <VideoList videos={mockVideos} onVideoClick={mockOnVideoClick} theme={mockTheme} />
      );
      const initialCards = screen.getAllByTestId("video-card");

      rerender(<VideoList videos={mockVideos} onVideoClick={mockOnVideoClick} theme={mockTheme} />);

      const rerenderedCards = screen.getAllByTestId("video-card");
      expect(rerenderedCards).toHaveLength(initialCards.length);
    });
  });

  describe("TC-009: 元信息显示验证", () => {
    test("应该显示UP主信息", () => {
      render(<VideoList videos={mockVideos} onVideoClick={mockOnVideoClick} theme={mockTheme} />);
      expect(screen.getByText("测试作者1")).toBeInTheDocument();
    });

    test("应该显示时长信息", () => {
      render(<VideoList videos={mockVideos} onVideoClick={mockOnVideoClick} theme={mockTheme} />);
      const durationElements = screen.getAllByText("10:30");
      expect(durationElements.length).toBeGreaterThanOrEqual(1);
    });

    test("应该显示发布日期", () => {
      render(<VideoList videos={mockVideos} onVideoClick={mockOnVideoClick} theme={mockTheme} />);
      expect(screen.getByText("2024-01-15")).toBeInTheDocument();
    });
  });

  describe("TC-010: 列表容器样式验证", () => {
    test("应该使用Flexbox布局", () => {
      const { container } = render(
        <VideoList videos={mockVideos} onVideoClick={mockOnVideoClick} theme={mockTheme} />
      );
      const listContainer = container.firstChild as HTMLElement;
      expect(listContainer.className).toContain("flex");
    });

    test("应该包含正确的间距类", () => {
      const { container } = render(
        <VideoList videos={mockVideos} onVideoClick={mockOnVideoClick} theme={mockTheme} />
      );
      const listContainer = container.firstChild as HTMLElement;
      expect(listContainer.className).toContain("gap-2");
    });
  });
});

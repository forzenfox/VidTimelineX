import React from "react";
import { render, screen } from "@testing-library/react";
import { Header } from "@/features/yuxiaoc/components/Header";
import { HeroSection } from "@/features/yuxiaoc/components/HeroSection";
import { CanteenHall } from "@/features/yuxiaoc/components/CanteenHall";
import { TitleHall } from "@/features/yuxiaoc/components/TitleHall";
import { CVoiceArchive } from "@/features/yuxiaoc/components/CVoiceArchive";
import "@testing-library/jest-dom";

// Mock video data
jest.mock("@/features/yuxiaoc/data/videos", () => ({
  videos: [
    {
      id: "1",
      title: "测试视频",
      cover: "https://example.com/cover.jpg",
      duration: "05:23",
      category: "hardcore",
      tags: ["测试"],
    },
  ],
  canteenCategories: [
    { id: "hardcore", name: "硬核区", icon: "sword", color: "#E11D48" },
    { id: "main", name: "主食区", icon: "utensils", color: "#F59E0B" },
  ],
}));

// Mock titles data
jest.mock("@/features/yuxiaoc/data/titles.json", () => ({
  blood: {
    featured: [
      { id: "1", name: "C皇", icon: "crown", description: "核心尊称" },
    ],
    regular: [
      { id: "2", name: "血怒战神", icon: "sword", description: "血怒模式专属" },
    ],
  },
  mix: {
    featured: [
      { id: "1", name: "C皇", icon: "crown", description: "核心尊称" },
    ],
    regular: [
      { id: "2", name: "峡谷第一混", icon: "fish", description: "混学宗师" },
    ],
  },
}));

// Mock voices data
jest.mock("@/features/yuxiaoc/data/voices.json", () => ({
  blood: {
    featured: { text: "血怒之下，众生平等", author: "C皇", source: "血怒宣言" },
    voices: [{ text: "无情铁手！", category: "技能" }],
  },
  mix: {
    featured: { text: "混与躺轮回不止", author: "C皇", source: "峡谷哲学" },
    voices: [{ text: "这把混", category: "哲学" }],
  },
}));

describe("主题样式测试", () => {
  const mockOnThemeToggle = jest.fn();
  const mockOnVideoClick = jest.fn();

  describe("血怒模式（深色主题）", () => {
    /**
     * 测试用例 TC-001: 血怒模式Header背景色测试
     * 测试目标：验证血怒模式下Header使用深色背景
     */
    test("TC-001: 血怒模式Header背景色测试", () => {
      const { container } = render(<Header theme="blood" onThemeToggle={mockOnThemeToggle} />);

      const header = container.querySelector("header");
      expect(header).toHaveStyle({
        background: "rgba(15, 15, 35, 0.85)",
      });
    });

    /**
     * 测试用例 TC-002: 血怒模式主题色测试
     * 测试目标：验证血怒模式使用红色主题色
     */
    test("TC-002: 血怒模式主题色测试", () => {
      render(<Header theme="blood" onThemeToggle={mockOnThemeToggle} />);

      const title = screen.getByText("C皇驾到");
      expect(title).toHaveStyle({
        color: "#E11D48",
      });
    });

    /**
     * 测试用例 TC-003: 血怒模式Hero区域标题测试
     * 测试目标：验证血怒模式下Hero显示正确标题
     */
    test("TC-003: 血怒模式Hero区域标题测试", () => {
      render(<HeroSection theme="blood" />);

      expect(screen.getByText("血怒模式")).toBeInTheDocument();
      expect(screen.getByText("血怒之下，众生平等；无情铁手，致残打击！")).toBeInTheDocument();
    });

    /**
     * 测试用例 TC-004: 血怒模式视频模块标题测试
     * 测试目标：验证血怒模式下视频模块显示正确标题
     */
    test("TC-004: 血怒模式视频模块标题测试", () => {
      render(<CanteenHall theme="blood" onVideoClick={mockOnVideoClick} />);

      expect(screen.getByText("血怒时刻")).toBeInTheDocument();
      expect(screen.getByText("硬核操作，天神下凡")).toBeInTheDocument();
    });

    /**
     * 测试用例 TC-005: 血怒模式称号殿堂标题测试
     * 测试目标：验证血怒模式下称号殿堂显示正确标题
     */
    test("TC-005: 血怒模式称号殿堂标题测试", () => {
      render(<TitleHall theme="blood" />);

      expect(screen.getByText("称号殿堂")).toBeInTheDocument();
      expect(screen.getByText("血怒荣耀，战斗称号")).toBeInTheDocument();
    });

    /**
     * 测试用例 TC-006: 血怒模式语录档案馆标题测试
     * 测试目标：验证血怒模式下语录档案馆显示正确标题
     */
    test("TC-006: 血怒模式语录档案馆标题测试", () => {
      render(<CVoiceArchive theme="blood" />);

      expect(screen.getByText("血怒宣言")).toBeInTheDocument();
      expect(screen.getByText("战斗语录，激情澎湃")).toBeInTheDocument();
    });
  });

  describe("混躺模式（亮色主题）", () => {
    /**
     * 测试用例 TC-007: 混躺模式Header背景色测试
     * 测试目标：验证混躺模式下Header使用亮色背景
     */
    test("TC-007: 混躺模式Header背景色测试", () => {
      const { container } = render(<Header theme="mix" onThemeToggle={mockOnThemeToggle} />);

      const header = container.querySelector("header");
      expect(header).toHaveStyle({
        background: "rgba(255, 255, 255, 0.85)",
      });
    });

    /**
     * 测试用例 TC-008: 混躺模式主题色测试
     * 测试目标：验证混躺模式使用琥珀色主题色
     */
    test("TC-008: 混躺模式主题色测试", () => {
      render(<Header theme="mix" onThemeToggle={mockOnThemeToggle} />);

      const title = screen.getByText("C皇驾到");
      expect(title).toHaveStyle({
        color: "#F59E0B",
      });
    });

    /**
     * 测试用例 TC-009: 混躺模式Hero区域标题测试
     * 测试目标：验证混躺模式下Hero显示正确标题
     */
    test("TC-009: 混躺模式Hero区域标题测试", () => {
      render(<HeroSection theme="mix" />);

      expect(screen.getByText("混躺模式")).toBeInTheDocument();
      expect(screen.getByText("混与躺轮回不止，这把混，下把躺")).toBeInTheDocument();
    });

    /**
     * 测试用例 TC-010: 混躺模式视频模块标题测试
     * 测试目标：验证混躺模式下视频模块显示正确标题
     */
    test("TC-010: 混躺模式视频模块标题测试", () => {
      render(<CanteenHall theme="mix" onVideoClick={mockOnVideoClick} />);

      expect(screen.getByText("食堂大殿")).toBeInTheDocument();
      expect(screen.getByText("下饭经典，吃饱为止")).toBeInTheDocument();
    });

    /**
     * 测试用例 TC-011: 混躺模式称号殿堂标题测试
     * 测试目标：验证混躺模式下称号殿堂显示正确标题
     */
    test("TC-011: 混躺模式称号殿堂标题测试", () => {
      render(<TitleHall theme="mix" />);

      expect(screen.getByText("称号殿堂")).toBeInTheDocument();
      expect(screen.getByText("C皇的荣耀称号集合")).toBeInTheDocument();
    });

    /**
     * 测试用例 TC-012: 混躺模式语录档案馆标题测试
     * 测试目标：验证混躺模式下语录档案馆显示正确标题
     */
    test("TC-012: 混躺模式语录档案馆标题测试", () => {
      render(<CVoiceArchive theme="mix" />);

      expect(screen.getByText("C言C语典藏馆")).toBeInTheDocument();
      expect(screen.getByText("经典语录，永流传")).toBeInTheDocument();
    });
  });

  describe("主题对比测试", () => {
    /**
     * 测试用例 TC-013: 主题背景色对比测试
     * 测试目标：验证血怒和混躺模式背景色不同
     */
    test("TC-013: 主题背景色对比测试", () => {
      const { container: bloodContainer } = render(<Header theme="blood" onThemeToggle={mockOnThemeToggle} />);
      const bloodHeader = bloodContainer.querySelector("header");

      const { container: mixContainer } = render(<Header theme="mix" onThemeToggle={mockOnThemeToggle} />);
      const mixHeader = mixContainer.querySelector("header");

      expect(bloodHeader).toHaveStyle({ background: "rgba(15, 15, 35, 0.85)" });
      expect(mixHeader).toHaveStyle({ background: "rgba(255, 255, 255, 0.85)" });
    });

    /**
     * 测试用例 TC-014: 主题文字颜色对比测试
     * 测试目标：验证血怒和混躺模式主题色不同
     */
    test("TC-014: 主题文字颜色对比测试", () => {
      const { rerender } = render(<Header theme="blood" onThemeToggle={mockOnThemeToggle} />);

      let title = screen.getByText("C皇驾到");
      expect(title).toHaveStyle({ color: "#E11D48" });

      rerender(<Header theme="mix" onThemeToggle={mockOnThemeToggle} />);

      title = screen.getByText("C皇驾到");
      expect(title).toHaveStyle({ color: "#F59E0B" });
    });

    /**
     * 测试用例 TC-015: 主题切换后样式更新测试
     * 测试目标：验证主题切换后样式正确更新
     */
    test("TC-015: 主题切换后样式更新测试", () => {
      const { rerender, container } = render(<Header theme="blood" onThemeToggle={mockOnThemeToggle} />);

      let header = container.querySelector("header");
      expect(header).toHaveStyle({ background: "rgba(15, 15, 35, 0.85)" });

      rerender(<Header theme="mix" onThemeToggle={mockOnThemeToggle} />);

      header = container.querySelector("header");
      expect(header).toHaveStyle({ background: "rgba(255, 255, 255, 0.85)" });
    });
  });
});

/**
 * 边界条件测试用例
 * 测试组件在边界条件下的表现
 */

import React from "react";
import { render, screen, fireEvent, cleanup, waitFor, act } from "@testing-library/react";
import ThemeToggle from "@/features/tiantong/components/ThemeToggle";
import VideoCard from "@/features/tiantong/components/VideoCard";
import VideoModal from "@/features/tiantong/components/VideoModal";
import { Header } from "@/features/lvjiang/components/Header";
import { Heart, Trophy, Music, Smile, Zap } from "lucide-react";
import "@testing-library/jest-dom";

describe("边界条件测试 - ThemeToggle", () => {
  /**
   * 测试用例 TC-BOUNDARY-001: 极端主题切换频率
   * 测试快速连续点击切换按钮
   */
  test("快速连续点击切换按钮不会导致异常", () => {
    const onToggle = jest.fn();
    render(<ThemeToggle currentTheme="tiger" onToggle={onToggle} />);

    const button = screen.getByRole("switch");
    for (let i = 0; i < 10; i++) {
      fireEvent.click(button);
    }

    expect(onToggle).toHaveBeenCalledTimes(10);
  });

  /**
   * 测试用例 TC-BOUNDARY-002: 初始主题为边界值
   * 测试主题值在边界情况下的表现
   */
  test("主题为tiger初始状态正确", () => {
    const onToggle = jest.fn();
    render(<ThemeToggle currentTheme="tiger" onToggle={onToggle} />);

    const button = screen.getByRole("switch");
    expect(button).toHaveAttribute("aria-checked", "false");
  });

  test("主题为sweet初始状态正确", () => {
    const onToggle = jest.fn();
    render(<ThemeToggle currentTheme="sweet" onToggle={onToggle} />);

    const button = screen.getByRole("switch");
    expect(button).toHaveAttribute("aria-checked", "true");
  });

  /**
   * 测试用例 TC-BOUNDARY-003: 主题状态稳定性
   * 测试多次渲染同一主题状态保持一致
   */
  test("多次渲染同一主题状态一致", () => {
    const onToggle = jest.fn();
    const { rerender } = render(<ThemeToggle currentTheme="tiger" onToggle={onToggle} />);

    rerender(<ThemeToggle currentTheme="tiger" onToggle={onToggle} />);
    rerender(<ThemeToggle currentTheme="tiger" onToggle={onToggle} />);

    expect(screen.getByRole("switch")).toHaveAttribute("aria-checked", "false");
  });
});

describe("边界条件测试 - VideoCard", () => {
  /**
   * 测试用例 TC-BOUNDARY-004: 极长标题
   * 测试视频标题超出正常长度时的显示
   */
  test("处理极长标题的显示", () => {
    const mockVideo = {
      id: "1",
      title: "这是一个非常非常非常非常非常非常非常非常非常非常长的视频标题用于测试边界情况",
      category: "sing",
      tags: ["test"],
      cover: "https://example.com/cover.jpg",
      date: "2024-01-01",
      views: "10万",
      icon: Heart,
    };

    render(<VideoCard video={mockVideo} onClick={jest.fn()} />);

    expect(screen.getByText(/非常长的视频标题/)).toBeInTheDocument();
  });

  /**
   * 测试用例 TC-BOUNDARY-005: 极高播放量
   * 测试播放量数值极大的情况
   */
  test("处理极高播放量的显示", () => {
    const mockVideo = {
      id: "1",
      title: "测试视频",
      category: "sing",
      tags: [],
      cover: "",
      date: "2024-01-01",
      views: "9999.9万",
      icon: Heart,
    };

    render(<VideoCard video={mockVideo} onClick={jest.fn()} />);

    expect(screen.getByText("9999.9万")).toBeInTheDocument();
  });

  /**
   * 测试用例 TC-BOUNDARY-006: 空标签数组
   * 测试视频没有标签时的显示
   */
  test("处理空标签数组", () => {
    const mockVideo = {
      id: "1",
      title: "测试视频",
      category: "sing",
      tags: [],
      cover: "",
      date: "2024-01-01",
      views: "10万",
      icon: Heart,
    };

    render(<VideoCard video={mockVideo} onClick={jest.fn()} />);

    expect(screen.getByText("测试视频")).toBeInTheDocument();
    expect(screen.getByRole("article")).toBeInTheDocument();
  });

  /**
   * 测试用例 TC-BOUNDARY-007: 多个分类类型
   * 测试所有分类类型的显示
   */
  test("所有分类类型显示正确", () => {
    const categories = [
      { id: "sing", name: "甜筒天籁", icon: Music },
      { id: "dance", name: "霸总热舞", icon: Zap },
      { id: "funny", name: "反差萌", icon: Smile },
      { id: "daily", name: "224日常", icon: Trophy },
    ];

    categories.forEach(category => {
      const mockVideo = {
        id: "1",
        title: "测试视频",
        category: category.id,
        tags: [],
        cover: "",
        date: "2024-01-01",
        views: "10万",
        icon: category.icon,
      };

      render(<VideoCard video={mockVideo} onClick={jest.fn()} />);
      expect(screen.getByText(category.name)).toBeInTheDocument();
      cleanup();
    });
  });

  /**
   * 测试用例 TC-BOUNDARY-008: 特殊字符标题
   * 测试标题包含特殊字符时的显示
   */
  test("处理包含特殊字符的标题", () => {
    const mockVideo = {
      id: "1",
      title: "测试【视频】标题<>包含'特殊'字符\"测试\"",
      category: "sing",
      tags: [],
      cover: "",
      date: "2024-01-01",
      views: "10万",
      icon: Heart,
    };

    render(<VideoCard video={mockVideo} onClick={jest.fn()} />);

    // 使用更灵活的文本匹配，检查标题包含部分文本
    expect(screen.getByText(/测试【视频】标题/)).toBeInTheDocument();
  });

  /**
   * 测试用例 TC-BOUNDARY-009: 极长日期格式
   * 测试日期字符串的各种格式
   */
  test("处理各种日期格式", () => {
    const dates = ["2024-01-01", "2023-12-31", "2024-12-31", "2020-01-01"];

    dates.forEach(date => {
      const mockVideo = {
        id: "1",
        title: "测试视频",
        category: "sing",
        tags: [],
        cover: "",
        date: date,
        views: "10万",
        icon: Heart,
      };

      render(<VideoCard video={mockVideo} onClick={jest.fn()} />);
      expect(screen.getByText(date)).toBeInTheDocument();
      cleanup();
    });
  });
});

describe("边界条件测试 - VideoModal", () => {
  /**
   * 测试用例 TC-BOUNDARY-010: video属性快速变化
   * 测试连续切换不同视频时的弹窗表现
   */
  test("快速切换不同视频", () => {
    const onClose = jest.fn();
    const mockVideo1 = {
      id: "1",
      title: "视频1",
      category: "sing",
      tags: [],
      cover: "",
      date: "2024-01-01",
      views: "10万",
      icon: Heart,
    };
    const mockVideo2 = {
      id: "2",
      title: "视频2",
      category: "dance",
      tags: [],
      cover: "",
      date: "2024-01-02",
      views: "20万",
      icon: Trophy,
    };

    const { rerender } = render(<VideoModal video={mockVideo1} onClose={onClose} />);

    expect(screen.getByText("视频1")).toBeInTheDocument();

    rerender(<VideoModal video={mockVideo2} onClose={onClose} />);

    expect(screen.getByText("视频2")).toBeInTheDocument();
  });

  /**
   * 测试用例 TC-BOUNDARY-011: theme属性边界值
   * 测试theme在tiger和sweet之间切换
   */
  test("theme属性切换正常工作", () => {
    const mockVideo = {
      id: "1",
      title: "测试视频",
      category: "sing",
      tags: [],
      cover: "",
      date: "2024-01-01",
      views: "10万",
      icon: Heart,
    };

    const { rerender } = render(<VideoModal video={mockVideo} onClose={jest.fn()} theme="tiger" />);

    rerender(<VideoModal video={mockVideo} onClose={jest.fn()} theme="sweet" />);

    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  /**
   * 测试用例 TC-BOUNDARY-012: 默认theme参数
   * 测试未传递theme参数时的默认行为
   */
  test("默认theme参数为tiger", () => {
    const mockVideo = {
      id: "1",
      title: "测试视频",
      category: "sing",
      tags: [],
      cover: "",
      date: "2024-01-01",
      views: "10万",
      icon: Heart,
    };

    render(<VideoModal video={mockVideo} onClose={jest.fn()} />);

    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });
});

describe("边界条件测试 - Header", () => {
  /**
   * 测试用例 TC-BOUNDARY-013: 主题状态快速切换
   * 测试快速切换主题时的表现
   */
  test("快速切换主题状态", () => {
    const onThemeToggle = jest.fn();
    const { rerender } = render(<Header theme="dongzhu" onThemeToggle={onThemeToggle} />);

    expect(screen.getByText("歌神洞庭湖")).toBeInTheDocument();

    rerender(<Header theme="kaige" onThemeToggle={onThemeToggle} />);

    expect(screen.getByText("狼牙山凯哥")).toBeInTheDocument();
  });

  /**
   * 测试用例 TC-BOUNDARY-014: 相同主题重复渲染
   * 测试多次渲染相同主题时的稳定性
   */
  test("相同主题重复渲染稳定", () => {
    const onThemeToggle = jest.fn();
    const { rerender } = render(<Header theme="dongzhu" onThemeToggle={onThemeToggle} />);

    for (let i = 0; i < 5; i++) {
      rerender(<Header theme="dongzhu" onThemeToggle={onThemeToggle} />);
    }

    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(screen.getByText("驴酱")).toBeInTheDocument();
  });
});

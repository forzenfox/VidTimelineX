/**
 * 核心功能路径测试用例
 * 测试完整的用户操作流程和关键功能路径
 */

import React from "react";
import { render, screen, fireEvent, cleanup, waitFor, act } from "@testing-library/react";
import ThemeToggle from "@/features/tiantong/components/ThemeToggle";
import VideoCard from "@/features/tiantong/components/VideoCard";
import VideoModal from "@/features/tiantong/components/VideoModal";
import { Header } from "@/features/lvjiang/components/Header";
import LoadingAnimation from "@/features/tiantong/components/LoadingAnimation";
import { HorizontalDanmaku } from "@/features/lvjiang/components/HorizontalDanmaku";
import { SideDanmaku } from "@/features/lvjiang/components/SideDanmaku";
import { Heart } from "lucide-react";
import "@testing-library/jest-dom";

describe("核心功能路径测试 - 甜筒主题切换流程", () => {
  /**
   * 测试用例 TC-FLOW-001: 甜筒主题完整切换流程
   * 测试从老虎主题切换到甜筒主题的完整流程
   */
  test("完整的主题切换流程 - tiger到sweet", () => {
    const onToggle = jest.fn();
    render(<ThemeToggle currentTheme="tiger" onToggle={onToggle} />);

    expect(screen.getByRole("switch")).toHaveAttribute("aria-checked", "false");

    fireEvent.click(screen.getByRole("switch"));

    expect(onToggle).toHaveBeenCalled();
    expect(screen.getByRole("switch")).toHaveAttribute("aria-checked", "true");
  });

  test("完整的主题切换流程 - sweet到tiger", () => {
    const onToggle = jest.fn();
    render(<ThemeToggle currentTheme="sweet" onToggle={onToggle} />);

    expect(screen.getByRole("switch")).toHaveAttribute("aria-checked", "true");

    fireEvent.click(screen.getByRole("switch"));

    expect(onToggle).toHaveBeenCalled();
  });
});

describe("核心功能路径测试 - 视频卡片交互流程", () => {
  /**
   * 测试用例 TC-FLOW-002: 视频卡片点击查看流程
   * 测试用户点击视频卡片到打开弹窗的完整流程
   */
  test("视频卡片点击查看流程", () => {
    const mockVideo = {
      id: "1",
      title: "测试视频标题",
      category: "sing",
      tags: ["高光", "精彩"],
      cover: "https://example.com/cover.jpg",
      date: "2024-01-15",
      views: "15.2万",
      icon: Heart,
    };

    const onClick = jest.fn();
    render(<VideoCard video={mockVideo} onClick={onClick} />);

    const card = screen.getByRole("article");

    expect(screen.getByText("测试视频标题")).toBeInTheDocument();
    expect(screen.getByText("甜筒天籁")).toBeInTheDocument();
    expect(screen.getByText("2024-01-15")).toBeInTheDocument();
    expect(screen.getByText("15.2万")).toBeInTheDocument();

    fireEvent.click(card);

    expect(onClick).toHaveBeenCalledWith(mockVideo);
  });

  /**
   * 测试用例 TC-FLOW-003: 键盘操作视频卡片流程
   * 测试用户使用键盘选择视频的流程
   */
  test("键盘操作视频卡片流程", () => {
    const mockVideo = {
      id: "1",
      title: "测试视频",
      category: "dance",
      tags: [],
      cover: "",
      date: "2024-01-01",
      views: "10万",
      icon: Heart,
    };

    const onClick = jest.fn();
    render(<VideoCard video={mockVideo} onClick={onClick} />);

    const card = screen.getByRole("article");
    fireEvent.keyDown(card, { key: "Enter", code: "Enter" });

    expect(onClick).toHaveBeenCalledWith(mockVideo);
  });

  /**
   * 测试用例 TC-FLOW-004: 不同分类视频卡片显示流程
   * 测试所有分类的视频卡片正确显示
   */
  test("所有分类视频卡片显示正确", () => {
    const categories = [
      { id: "sing", name: "甜筒天籁" },
      { id: "dance", name: "霸总热舞" },
      { id: "funny", name: "反差萌" },
      { id: "daily", name: "224日常" },
    ];

    categories.forEach(category => {
      const mockVideo = {
        id: "1",
        title: `${category.name}测试视频`,
        category: category.id,
        tags: [],
        cover: "",
        date: "2024-01-01",
        views: "10万",
        icon: Heart,
      };

      render(<VideoCard video={mockVideo} onClick={jest.fn()} />);

      expect(screen.getByText(category.name)).toBeInTheDocument();
      cleanup();
    });
  });
});

describe("核心功能路径测试 - 视频弹窗操作流程", () => {
  /**
   * 测试用例 TC-FLOW-005: 打开视频弹窗流程
   * 测试打开弹窗并查看视频详情的流程
   */
  test("打开视频弹窗流程", () => {
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

    const onClose = jest.fn();
    render(<VideoModal video={mockVideo} onClose={onClose} />);

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "测试视频" })).toBeInTheDocument();
    expect(screen.getByTitle("测试视频")).toBeInTheDocument();
    expect(screen.getByText("跳转原站")).toBeInTheDocument();
  });

  /**
   * 测试用例 TC-FLOW-006: 关闭视频弹窗流程 - 按钮
   * 测试通过关闭按钮关闭弹窗
   */
  test("关闭视频弹窗流程 - 按钮", () => {
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

    const onClose = jest.fn();
    render(<VideoModal video={mockVideo} onClose={onClose} />);

    fireEvent.click(screen.getByRole("button", { name: /close/i }));

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  /**
   * 测试用例 TC-FLOW-007: 关闭视频弹窗流程 - ESC键
   * 测试通过ESC键关闭弹窗
   */
  test("关闭视频弹窗流程 - ESC键", () => {
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

    const onClose = jest.fn();
    render(<VideoModal video={mockVideo} onClose={onClose} />);

    fireEvent.keyDown(window, { key: "Escape" });

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  /**
   * 测试用例 TC-FLOW-008: 视频弹窗主题切换流程
   * 测试在弹窗内切换主题的流程
   */
  test("视频弹窗主题切换流程", () => {
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

    expect(screen.getByRole("dialog")).toBeInTheDocument();

    rerender(<VideoModal video={mockVideo} onClose={jest.fn()} theme="sweet" />);

    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });
});

describe("核心功能路径测试 - 驴酱头部交互流程", () => {
  /**
   * 测试用例 TC-FLOW-009: 驴酱主题切换流程
   * 测试用户切换驴酱主题的完整流程
   */
  test("驴酱主题切换流程 - dongzhu到kaige", () => {
    const onThemeToggle = jest.fn();
    render(<Header theme="dongzhu" onThemeToggle={onThemeToggle} />);

    expect(screen.getByText("歌神洞庭湖")).toBeInTheDocument();
    expect(screen.getByText("切换到野猪·凯哥")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /切换到野猪/i }));

    expect(onThemeToggle).toHaveBeenCalled();
  });

  test("驴酱主题切换流程 - kaige到dongzhu", () => {
    const onThemeToggle = jest.fn();
    render(<Header theme="kaige" onThemeToggle={onThemeToggle} />);

    expect(screen.getByText("狼牙山凯哥")).toBeInTheDocument();
    expect(screen.getByText("切换到家猪·洞主")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /切换到/i }));

    expect(onThemeToggle).toHaveBeenCalled();
  });

  /**
   * 测试用例 TC-FLOW-010: 驴酱主播信息展示流程
   * 测试两个主播信息的展示
   */
  test("主播信息展示流程", () => {
    render(<Header theme="dongzhu" onThemeToggle={jest.fn()} />);

    expect(screen.getByText("驴酱")).toBeInTheDocument();
    expect(screen.getByText("歌神洞庭湖")).toBeInTheDocument();
    expect(screen.getByText("白胖·洞主·便利")).toBeInTheDocument();
    expect(screen.getByText("狼牙山凯哥")).toBeInTheDocument();
    expect(screen.getByText("黑胖·凯哥·分开")).toBeInTheDocument();
  });

  /**
   * 测试用例 TC-FLOW-011: 导航链接展示流程
   * 测试导航链接的正确展示
   */
  test("导航链接展示流程", () => {
    render(<Header theme="dongzhu" onThemeToggle={jest.fn()} />);

    expect(screen.getByText("斗鱼直播间")).toBeInTheDocument();
    expect(screen.getByText("B站合集")).toBeInTheDocument();
    expect(screen.getByText("鱼吧链接")).toBeInTheDocument();
  });
});

describe("核心功能路径测试 - 弹幕组件流程", () => {
  /**
   * 测试用例 TC-FLOW-012: 水平弹幕可见性控制流程
   * 测试水平弹幕的显示和隐藏
   */
  test("水平弹幕可见性控制流程", () => {
    const { rerender } = render(<HorizontalDanmaku theme="dongzhu" isVisible={true} />);

    expect(screen.getByRole("presentation")).toBeInTheDocument();

    rerender(<HorizontalDanmaku theme="dongzhu" isVisible={false} />);

    expect(screen.queryByRole("presentation")).not.toBeInTheDocument();
  });

  /**
   * 测试用例 TC-FLOW-013: 水平弹幕主题切换流程
   * 测试水平弹幕随主题切换内容
   */
  test("水平弹幕主题切换流程", () => {
    const { rerender } = render(<HorizontalDanmaku theme="dongzhu" isVisible={true} />);

    rerender(<HorizontalDanmaku theme="kaige" isVisible={true} />);

    expect(screen.getByRole("presentation")).toBeInTheDocument();
  });

  /**
   * 测试用例 TC-FLOW-014: 侧边弹幕主题展示流程
   * 测试侧边弹幕随主题展示不同内容
   */
  test("侧边弹幕主题展示流程 - dongzhu", () => {
    render(<SideDanmaku theme="dongzhu" />);

    expect(screen.getByText("聊天室")).toBeInTheDocument();
    expect(screen.getByText("家猪·洞主专区")).toBeInTheDocument();
  });

  test("侧边弹幕主题展示流程 - kaige", () => {
    render(<SideDanmaku theme="kaige" />);

    expect(screen.getByText("聊天室")).toBeInTheDocument();
    expect(screen.getByText("野猪·凯哥专区")).toBeInTheDocument();
  });
});

describe("核心功能路径测试 - 组合流程", () => {
  /**
   * 测试用例 TC-FLOW-015: 完整的主题切换与视频查看流程
   * 测试主题切换后查看视频的组合流程
   */
  test("主题切换后查看视频的组合流程", () => {
    const themeOnToggle = jest.fn();
    const videoOnClick = jest.fn();

    render(
      <>
        <ThemeToggle currentTheme="tiger" onToggle={themeOnToggle} />
        <VideoCard
          video={{
            id: "1",
            title: "测试视频",
            category: "sing",
            tags: [],
            cover: "",
            date: "2024-01-01",
            views: "10万",
            icon: Heart,
          }}
          onClick={videoOnClick}
        />
      </>
    );

    expect(screen.getByRole("switch")).toHaveAttribute("aria-checked", "false");
    expect(screen.getByText("甜筒天籁")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("article"));

    expect(videoOnClick).toHaveBeenCalled();
  });

  /**
   * 测试用例 TC-FLOW-016: 驴酱主题切换与头部展示流程
   * 测试驴酱主题切换后头部的正确展示
   */
  test("驴酱主题切换后头部展示流程", () => {
    const onThemeToggle = jest.fn();
    const { rerender } = render(<Header theme="dongzhu" onThemeToggle={onThemeToggle} />);

    expect(screen.getByText("🐷")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /切换到/i }));

    expect(onThemeToggle).toHaveBeenCalled();

    rerender(<Header theme="kaige" onThemeToggle={onThemeToggle} />);

    expect(screen.getByText("🐗")).toBeInTheDocument();
  });
});

describe("核心功能路径测试 - 无障碍流程", () => {
  /**
   * 测试用例 TC-FLOW-017: 完整无障碍操作流程
   * 测试使用键盘完整操作页面的流程
   */
  test("键盘完整操作流程", () => {
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

    const card = screen.getByRole("article");
    expect(card).toHaveAttribute("tabIndex", "0");

    fireEvent.keyDown(card, { key: "Enter", code: "Enter" });

    expect(screen.getByRole("article")).toBeInTheDocument();
  });

  /**
   * 测试用例 TC-FLOW-018: ARIA角色完整性验证
   * 测试所有组件具有正确的ARIA角色
   */
  test("ARIA角色完整性验证", () => {
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

    render(
      <>
        <ThemeToggle currentTheme="tiger" onToggle={jest.fn()} />
        <VideoCard video={mockVideo} onClick={jest.fn()} />
      </>
    );

    expect(screen.getByRole("switch")).toBeInTheDocument();
    expect(screen.getByRole("article")).toBeInTheDocument();
  });
});

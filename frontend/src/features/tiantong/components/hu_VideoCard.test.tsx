/**
 * VideoCard 组件单元测试
 * 测试视频卡片组件的渲染和交互
 */

import React from "react";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import VideoCard from "@/components/hu/hu_VideoCard";
import { Heart, Trophy } from "lucide-react";
import "@testing-library/jest-dom";

describe("VideoCard 组件测试", () => {
  /**
   * 测试用例 TC-VIDEO-001: 视频卡片基础渲染
   * 测试视频卡片正确显示视频信息
   */
  test("正确渲染视频卡片内容", () => {
    const mockVideo = {
      id: "1",
      title: "测试视频标题",
      category: "sing",
      tags: ["test"],
      cover: "https://example.com/cover.jpg",
      date: "2024-01-01",
      views: "10万",
      icon: Heart,
    };

    const onClick = jest.fn();
    render(<VideoCard video={mockVideo} onClick={onClick} />);

    expect(screen.getByText("测试视频标题")).toBeInTheDocument();
    expect(screen.getByText("2024-01-01")).toBeInTheDocument();
    expect(screen.getByText("10万")).toBeInTheDocument();
  });

  /**
   * 测试用例 TC-VIDEO-002: 分类标签显示
   * 测试不同分类显示正确的标签名称
   */
  test("正确显示sing分类标签", () => {
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
    expect(screen.getByText("甜筒天籁")).toBeInTheDocument();
  });

  test("正确显示dance分类标签", () => {
    const mockVideo = {
      id: "1",
      title: "测试视频",
      category: "dance",
      tags: [],
      cover: "",
      date: "2024-01-01",
      views: "10万",
      icon: Trophy,
    };

    render(<VideoCard video={mockVideo} onClick={jest.fn()} />);
    expect(screen.getByText("霸总热舞")).toBeInTheDocument();
  });

  test("正确显示funny分类标签", () => {
    const mockVideo = {
      id: "1",
      title: "测试视频",
      category: "funny",
      tags: [],
      cover: "",
      date: "2024-01-01",
      views: "10万",
      icon: Trophy,
    };

    render(<VideoCard video={mockVideo} onClick={jest.fn()} />);
    expect(screen.getByText("反差萌")).toBeInTheDocument();
  });

  test("正确显示daily分类标签", () => {
    const mockVideo = {
      id: "1",
      title: "测试视频",
      category: "daily",
      tags: [],
      cover: "",
      date: "2024-01-01",
      views: "10万",
      icon: Trophy,
    };

    render(<VideoCard video={mockVideo} onClick={jest.fn()} />);
    expect(screen.getByText("224日常")).toBeInTheDocument();
  });

  /**
   * 测试用例 TC-VIDEO-003: 点击事件处理
   * 测试点击卡片时触发正确的回调
   */
  test("点击卡片时触发回调", () => {
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

    const onClick = jest.fn();
    render(<VideoCard video={mockVideo} onClick={onClick} />);

    const card = screen.getByRole("article");
    fireEvent.click(card);

    expect(onClick).toHaveBeenCalledWith(mockVideo);
  });

  /**
   * 测试用例 TC-VIDEO-004: 键盘无障碍支持
   * 测试按Enter键时触发点击事件
   */
  test("按Enter键时触发回调", () => {
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

    const onClick = jest.fn();
    render(<VideoCard video={mockVideo} onClick={onClick} />);

    const card = screen.getByRole("article");
    fireEvent.keyDown(card, { key: "Enter", code: "Enter" });

    expect(onClick).toHaveBeenCalledWith(mockVideo);
  });

  /**
   * 测试用例 TC-VIDEO-005: 角色属性
   * 测试组件具有正确的 ARIA 角色
   */
  test("组件具有正确的角色属性", () => {
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

    render(<VideoCard video={mockVideo} onClick={jest.fn} />);

    expect(screen.getByRole("article")).toBeInTheDocument();
  });

  /**
   * 测试用例 TC-VIDEO-006: 图片alt属性
   * 测试封面图片具有正确的alt属性
   */
  test("封面图片具有正确的alt属性", () => {
    const mockVideo = {
      id: "1",
      title: "测试视频标题",
      category: "sing",
      tags: [],
      cover: "https://example.com/cover.jpg",
      date: "2024-01-01",
      views: "10万",
      icon: Heart,
    };

    render(<VideoCard video={mockVideo} onClick={jest.fn()} />);

    const img = screen.getByAltText("测试视频标题");
    expect(img).toBeInTheDocument();
  });
});

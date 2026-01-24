/**
 * VideoModal 组件单元测试
 * 测试视频弹窗组件的渲染和交互
 */

import React from "react";
import { render, screen, fireEvent, cleanup, waitFor } from "@testing-library/react";
import VideoModal from "@/components/hu/hu_VideoModal";
import { Heart } from "lucide-react";
import "@testing-library/jest-dom";

describe("VideoModal 组件测试", () => {
  /**
   * 测试用例 TC-MODAL-001: null视频时不渲染
   * 测试当video为null时组件不渲染任何内容
   */
  test("video为null时不渲染弹窗", () => {
    render(<VideoModal video={null} onClose={jest.fn()} />);

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  /**
   * 测试用例 TC-MODAL-002: 视频渲染
   * 测试当提供video时正确渲染弹窗
   */
  test("video存在时渲染弹窗", () => {
    const mockVideo = {
      id: "1",
      title: "测试视频",
      category: "sing",
      tags: [],
      cover: "https://example.com/cover.jpg",
      date: "2024-01-01",
      views: "10万",
      icon: Heart,
    };

    render(<VideoModal video={mockVideo} onClose={jest.fn()} />);

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("测试视频")).toBeInTheDocument();
  });

  /**
   * 测试用例 TC-MODAL-003: 关闭按钮
   * 测试关闭按钮存在且可点击
   */
  test("关闭按钮可点击", () => {
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
    const { container } = render(<VideoModal video={mockVideo} onClose={onClose} />);

    // 使用更精确的选择器找到关闭按钮
    const closeButton = container.querySelector(".flex.items-center.justify-between button");
    fireEvent.click(closeButton!);

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  /**
   * 测试用例 TC-MODAL-004: ESC键关闭
   * 测试按ESC键时触发关闭回调
   */
  test("按ESC键关闭弹窗", () => {
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

    // 确保组件完全渲染，事件监听器已添加
    fireEvent.keyDown(document, { key: "Escape" });

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  /**
   * 测试用例 TC-MODAL-005: 老虎主题样式
   * 测试tiger主题下的颜色配置
   */
  test("老虎主题使用正确的颜色", () => {
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

    const { container } = render(
      <VideoModal video={mockVideo} onClose={jest.fn()} theme="tiger" />
    );

    expect(container.querySelector(".bg-secondary\\/20")).toBeInTheDocument();
  });

  /**
   * 测试用例 TC-MODAL-006: 甜筒主题样式
   * 测试sweet主题下的颜色配置
   */
  test("甜筒主题使用正确的颜色", () => {
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

    const { container } = render(
      <VideoModal video={mockVideo} onClose={jest.fn()} theme="sweet" />
    );

    expect(container.querySelector(".bg-secondary\\/20")).toBeInTheDocument();
  });

  /**
   * 测试用例 TC-MODAL-007: 跳转原站链接
   * 测试跳转原站按钮存在
   */
  test("跳转原站按钮存在", () => {
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

    expect(screen.getByText("跳转原站")).toBeInTheDocument();
  });

  /**
   * 测试用例 TC-MODAL-008: 无障碍角色
   * 测试弹窗具有正确的dialog角色
   */
  test("弹窗具有正确的无障碍属性", () => {
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

    expect(screen.getByRole("dialog")).toHaveAttribute("aria-modal", "true");
  });

  /**
   * 测试用例 TC-MODAL-009: iframe标题
   * 测试iframe具有正确的标题
   */
  test("iframe具有正确的标题", () => {
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

    const iframe = screen.getByTitle("测试视频");
    expect(iframe).toBeInTheDocument();
  });
});

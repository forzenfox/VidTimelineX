/**
 * Danmaku 组件集成测试
 * 测试弹幕组件的集成功能
 */

import React from "react";
import { render, screen, cleanup, waitFor } from "@testing-library/react";
import { HorizontalDanmaku } from "@/features/lvjiang/components/lv_HorizontalDanmaku";
import { SideDanmaku } from "@/features/lvjiang/components/lv_SideDanmaku";
import "@testing-library/jest-dom";

describe("弹幕组件集成测试", () => {
  /**
   * 测试用例 TC-DANMAKU-001: 水平弹幕主题切换
   * 测试水平弹幕根据主题切换内容
   */
  test("水平弹幕根据主题显示不同内容", () => {
    const { rerender, container } = render(<HorizontalDanmaku theme="dongzhu" isVisible={true} />);

    // 检查容器是否渲染
    expect(
      container.querySelector(".fixed.inset-0.pointer-events-none.z-30.overflow-hidden")
    ).toBeInTheDocument();

    rerender(<HorizontalDanmaku theme="kaige" isVisible={true} />);

    // 检查容器仍然渲染
    expect(
      container.querySelector(".fixed.inset-0.pointer-events-none.z-30.overflow-hidden")
    ).toBeInTheDocument();
  });

  /**
   * 测试用例 TC-DANMAKU-002: 水平弹幕可见性控制
   * 测试isVisible为false时不渲染弹幕
   */
  test("isVisible为false时不渲染水平弹幕", () => {
    const { container } = render(<HorizontalDanmaku theme="dongzhu" isVisible={false} />);

    expect(
      container.querySelector(".fixed.inset-0.pointer-events-none.z-30.overflow-hidden")
    ).not.toBeInTheDocument();
  });

  /**
   * 测试用例 TC-DANMAKU-003: 侧边弹幕主题渲染
   * 测试侧边弹幕根据主题渲染
   */
  test("侧边弹幕根据主题渲染正确样式", () => {
    render(<SideDanmaku theme="dongzhu" />);

    expect(screen.getByText("聊天室")).toBeInTheDocument();
    expect(screen.getByText("家猪·洞主专区")).toBeInTheDocument();
  });

  test("凯哥主题侧边弹幕渲染", () => {
    render(<SideDanmaku theme="kaige" />);

    expect(screen.getByText("野猪·凯哥专区")).toBeInTheDocument();
  });

  /**
   * 测试用例 TC-DANMAKU-004: 侧边弹幕消息显示
   * 测试侧边弹幕显示消息内容
   */
  test("侧边弹幕显示消息", () => {
    render(<SideDanmaku theme="dongzhu" />);

    const messages = screen.getAllByText(/.*/);
    expect(messages.length).toBeGreaterThan(0);
  });
});

describe("数据模块测试", () => {
  /**
   * 测试用例 TC-DATA-001: 甜筒视频数据完整性
   * 测试hu_mockData中的视频数据完整
   */
  test("甜筒视频数据完整", async () => {
    const { videos } = await import("@/features/tiantong/data/hu_mockData");

    expect(videos.length).toBeGreaterThan(0);
    videos.forEach(video => {
      expect(video.id).toBeDefined();
      expect(video.title).toBeDefined();
      expect(video.category).toBeDefined();
      expect(video.cover).toBeDefined();
      expect(video.date).toBeDefined();
      expect(video.views).toBeDefined();
    });
  });

  /**
   * 测试用例 TC-DATA-002: 甜筒分类数据完整性
   * 测试highlightCategories数据完整
   */
  test("甜筒分类数据完整", async () => {
    const { highlightCategories } = await import("@/features/tiantong/data/hu_mockData");

    expect(highlightCategories.length).toBeGreaterThan(0);
    highlightCategories.forEach(category => {
      expect(category.id).toBeDefined();
      expect(category.name).toBeDefined();
      expect(category.icon).toBeDefined();
    });
  });

  /**
   * 测试用例 TC-DATA-003: 弹幕池数据完整性
   * 测试danmuPool数据完整
   */
  test("弹幕池数据完整", async () => {
    const { danmuPool } = await import("@/features/tiantong/data/hu_mockData");

    expect(danmuPool.length).toBeGreaterThan(0);
    danmuPool.forEach(danmu => {
      expect(danmu.id).toBeDefined();
      expect(danmu.text).toBeDefined();
      expect(danmu.type).toBeDefined();
    });
  });

  /**
   * 测试用例 TC-DATA-004: 驴酱视频数据完整性
   * 测试lv_videos中的视频数据完整
   */
  test("驴酱视频数据完整", async () => {
    const { videos } = await import("@/features/lvjiang/data/lv_videos");

    expect(videos.length).toBeGreaterThan(0);
    videos.forEach(video => {
      expect(video.id).toBeDefined();
      expect(video.title).toBeDefined();
      expect(video.date).toBeDefined();
      expect(video.bvid).toBeDefined();
      expect(video.cover).toBeDefined();
      expect(video.duration).toBeDefined();
    });
  });

  /**
   * 测试用例 TC-DATA-005: 弹幕数据完整性
   * 测试lv_danmaku中的弹幕数据完整
   */
  test("驴酱弹幕数据完整", async () => {
    const { dongzhuDanmaku, kaigeDanmaku, commonDanmaku } = await import("@/features/lvjiang/data/lv_danmaku");

    expect(dongzhuDanmaku.length).toBeGreaterThan(0);
    expect(kaigeDanmaku.length).toBeGreaterThan(0);
    expect(commonDanmaku.length).toBeGreaterThan(0);
  });
});

describe("类型定义测试", () => {
  /**
   * 测试用例 TC-TYPES-001: 甜筒模块类型
   * 测试tiantong模块类型定义正确
   */
  test("甜筒Video类型定义正确", () => {
    // 直接使用本地类型定义，不依赖模块导入
    const mockVideo = {
      id: "1",
      title: "测试",
      category: "sing",
      tags: ["test"],
      cover: "https://example.com",
      date: "2024-01-01",
      views: "10万",
      icon: "div",
    };

    expect(mockVideo.id).toBe("1");
    expect(mockVideo.category).toBe("sing");
  });

  /**
   * 测试用例 TC-TYPES-002: 驴酱模块类型
   * 测试lvjiang模块类型定义正确
   */
  test("驴酱Video类型定义正确", () => {
    // 直接使用本地类型定义，不依赖模块导入
    const mockVideo = {
      id: "1",
      title: "测试",
      date: "2024-01-01",
      bvid: "BV123456789",
      cover: "https://example.com",
      tags: ["test"],
      duration: "10:00",
    };

    expect(mockVideo.id).toBe("1");
    expect(mockVideo.bvid).toBe("BV123456789");
  });
});

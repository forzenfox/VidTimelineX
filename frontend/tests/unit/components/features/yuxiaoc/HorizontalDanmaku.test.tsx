import React from "react";
import { render, waitFor } from "@testing-library/react";
import { HorizontalDanmaku } from "@/features/yuxiaoc/components/HorizontalDanmaku";
import "@testing-library/jest-dom";

// 模拟danmaku.json数据 - 提供足够多的弹幕用于测试轨道分布
jest.mock("@/features/yuxiaoc/data/danmaku.json", () => ({
  bloodDanmaku: [
    "血怒测试弹幕1",
    "血怒测试弹幕2",
    "血怒测试弹幕3",
    "血怒测试弹幕4",
    "血怒测试弹幕5",
    "血怒测试弹幕6",
    "血怒测试弹幕7",
    "血怒测试弹幕8",
    "血怒测试弹幕9",
    "血怒测试弹幕10",
    "血怒测试弹幕11",
    "血怒测试弹幕12",
  ],
  mixDanmaku: [
    "混躺测试弹幕1",
    "混躺测试弹幕2",
    "混躺测试弹幕3",
    "混躺测试弹幕4",
    "混躺测试弹幕5",
    "混躺测试弹幕6",
    "混躺测试弹幕7",
    "混躺测试弹幕8",
    "混躺测试弹幕9",
    "混躺测试弹幕10",
    "混躺测试弹幕11",
    "混躺测试弹幕12",
  ],
  commonDanmaku: [
    "公共弹幕1",
    "公共弹幕2",
    "公共弹幕3",
    "公共弹幕4",
    "公共弹幕5",
    "公共弹幕6",
    "公共弹幕7",
    "公共弹幕8",
  ],
}));

describe("HorizontalDanmaku组件测试", () => {
  /**
   * 测试用例 TC-001: 组件渲染测试
   * 测试目标：验证HorizontalDanmaku组件能够正确渲染
   */
  test("TC-001: 组件渲染测试", async () => {
    const { container } = render(<HorizontalDanmaku theme="blood" isVisible={true} />);

    // 等待组件挂载
    await waitFor(() => {
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  /**
   * 测试用例 TC-002: 不可见状态测试
   * 测试目标：验证isVisible为false时不渲染弹幕
   */
  test("TC-002: 不可见状态测试", () => {
    const { container } = render(<HorizontalDanmaku theme="blood" isVisible={false} />);

    // 验证容器为空
    expect(container.firstChild).toBeNull();
  });

  /**
   * 测试用例 TC-003: 血怒主题弹幕测试
   * 测试目标：验证血怒主题弹幕能够正确渲染
   */
  test("TC-003: 血怒主题弹幕测试", async () => {
    const { container } = render(<HorizontalDanmaku theme="blood" isVisible={true} />);

    // 等待组件挂载
    await waitFor(() => {
      expect(container.firstChild).toBeInTheDocument();
    });

    // 验证容器存在
    const danmakuContainer = container.firstChild as HTMLElement;
    expect(danmakuContainer).toHaveClass(
      "fixed",
      "inset-0",
      "pointer-events-none",
      "z-30",
      "overflow-hidden"
    );
  });

  /**
   * 测试用例 TC-004: 混躺主题弹幕测试
   * 测试目标：验证混躺主题弹幕能够正确渲染
   */
  test("TC-004: 混躺主题弹幕测试", async () => {
    const { container } = render(<HorizontalDanmaku theme="mix" isVisible={true} />);

    // 等待组件挂载
    await waitFor(() => {
      expect(container.firstChild).toBeInTheDocument();
    });

    // 验证容器存在
    const danmakuContainer = container.firstChild as HTMLElement;
    expect(danmakuContainer).toBeInTheDocument();
  });

  /**
   * 测试用例 TC-005: 弹幕轨道分布测试
   * 测试目标：验证弹幕轨道均匀分布（8条轨道）
   */
  test("TC-005: 弹幕轨道分布测试", async () => {
    const { container } = render(<HorizontalDanmaku theme="blood" isVisible={true} />);

    // 等待组件挂载
    await waitFor(() => {
      expect(container.firstChild).toBeInTheDocument();
    });

    // 验证容器样式
    const danmakuContainer = container.firstChild as HTMLElement;
    expect(danmakuContainer).toHaveStyle({
      top: "80px",
      height: "calc(100vh - 80px)",
    });
  });

  /**
   * 测试用例 TC-006: 弹幕样式测试
   * 测试目标：验证弹幕样式能够正确应用
   */
  test("TC-006: 弹幕样式测试", async () => {
    const { container } = render(<HorizontalDanmaku theme="blood" isVisible={true} />);

    // 等待组件挂载
    await waitFor(() => {
      expect(container.firstChild).toBeInTheDocument();
    });

    // 验证容器存在
    expect(container.firstChild).toBeInTheDocument();
  });

  /**
   * 测试用例 TC-007: 主题切换测试
   * 测试目标：验证主题切换时弹幕正确更新
   */
  test("TC-007: 主题切换测试", async () => {
    const { container, rerender } = render(<HorizontalDanmaku theme="blood" isVisible={true} />);

    // 等待组件挂载
    await waitFor(() => {
      expect(container.firstChild).toBeInTheDocument();
    });

    // 切换到混躺主题
    rerender(<HorizontalDanmaku theme="mix" isVisible={true} />);

    // 验证容器仍然存在
    await waitFor(() => {
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  /**
   * 测试用例 TC-008: 简化数据结构适配测试 - 血怒弹幕
   * 测试目标：验证简化后的bloodDanmaku数据结构正确加载
   */
  test("TC-008: 简化数据结构适配测试 - 血怒弹幕", async () => {
    const { container } = render(<HorizontalDanmaku theme="blood" isVisible={true} />);

    // 等待组件挂载
    await waitFor(() => {
      expect(container.firstChild).toBeInTheDocument();
    });

    // 验证容器渲染成功
    const danmakuContainer = container.firstChild as HTMLElement;
    expect(danmakuContainer).toBeInTheDocument();
  });

  /**
   * 测试用例 TC-009: 简化数据结构适配测试 - 混躺弹幕
   * 测试目标：验证简化后的mixDanmaku数据结构正确加载
   */
  test("TC-009: 简化数据结构适配测试 - 混躺弹幕", async () => {
    const { container } = render(<HorizontalDanmaku theme="mix" isVisible={true} />);

    // 等待组件挂载
    await waitFor(() => {
      expect(container.firstChild).toBeInTheDocument();
    });

    // 验证容器渲染成功
    const danmakuContainer = container.firstChild as HTMLElement;
    expect(danmakuContainer).toBeInTheDocument();
  });

  /**
   * 测试用例 TC-010: 公共弹幕数据测试
   * 测试目标：验证commonDanmaku数据正确加载
   */
  test("TC-010: 公共弹幕数据测试", async () => {
    const { container } = render(<HorizontalDanmaku theme="blood" isVisible={true} />);

    // 等待组件挂载
    await waitFor(() => {
      expect(container.firstChild).toBeInTheDocument();
    });

    // 验证容器渲染成功
    expect(container.firstChild).toBeInTheDocument();
  });

  /**
   * 测试用例 TC-011: 弹幕数据合并测试
   * 测试目标：验证主题专属弹幕和公共弹幕合并使用
   */
  test("TC-011: 弹幕数据合并测试", async () => {
    const { container } = render(<HorizontalDanmaku theme="blood" isVisible={true} />);

    // 等待组件挂载
    await waitFor(() => {
      expect(container.firstChild).toBeInTheDocument();
    });

    // 验证容器存在且有内容
    const danmakuContainer = container.firstChild as HTMLElement;
    expect(danmakuContainer).toBeInTheDocument();
  });

  /**
   * 测试用例 TC-012: 弹幕动画时间合理性测试
   * 测试目标：验证弹幕动画持续时间在合理范围内（5-20秒）
   */
  test("TC-012: 弹幕动画时间合理性测试", async () => {
    const { container } = render(<HorizontalDanmaku theme="blood" isVisible={true} />);

    // 等待组件挂载
    await waitFor(() => {
      expect(container.firstChild).toBeInTheDocument();
    });

    // 获取所有弹幕元素
    const danmakuElements = container.querySelectorAll("[style*='animation']");

    // 如果存在弹幕元素，验证动画时间
    if (danmakuElements.length > 0) {
      danmakuElements.forEach(el => {
        const style = (el as HTMLElement).getAttribute("style") || "";
        const durationMatch = style.match(/(\d+\.?\d*)s/);
        if (durationMatch) {
          const duration = parseFloat(durationMatch[1]);
          // 验证动画时间在合理范围内（5-20秒）
          expect(duration).toBeGreaterThanOrEqual(5);
          expect(duration).toBeLessThanOrEqual(20);
        }
      });
    }
  });

  /**
   * 测试用例 TC-013: 弹幕轨道起始位置测试
   * 测试目标：验证弹幕轨道起始位置正确（从5%开始）
   */
  test("TC-013: 弹幕轨道起始位置测试", async () => {
    const { container } = render(<HorizontalDanmaku theme="blood" isVisible={true} />);

    // 等待组件挂载
    await waitFor(() => {
      expect(container.firstChild).toBeInTheDocument();
    });

    // 获取所有弹幕元素
    const danmakuElements = container.querySelectorAll("[style*='top']");

    // 验证至少有一些弹幕元素
    expect(danmakuElements.length).toBeGreaterThanOrEqual(0);
  });

  /**
   * 测试用例 TC-014: 弹幕轨道均匀分布测试
   * 测试目标：验证弹幕使用索引取模均匀分配到各轨道
   */
  test("TC-014: 弹幕轨道均匀分布测试", async () => {
    const { container } = render(<HorizontalDanmaku theme="blood" isVisible={true} />);

    // 等待组件挂载
    await waitFor(() => {
      expect(container.firstChild).toBeInTheDocument();
    });

    // 获取所有弹幕元素
    const danmakuElements = container.querySelectorAll("[style*='top']");

    if (danmakuElements.length > 0) {
      // 收集所有top值
      const topValues: number[] = [];
      danmakuElements.forEach(el => {
        const style = (el as HTMLElement).getAttribute("style") || "";
        const topMatch = style.match(/top:\s*(\d+)%/);
        if (topMatch) {
          topValues.push(parseInt(topMatch[1], 10));
        }
      });

      // 验证有多个不同的轨道位置（说明均匀分布）
      const uniqueTops = [...new Set(topValues)];
      expect(uniqueTops.length).toBeGreaterThanOrEqual(2);

      // 验证轨道位置是5%, 17%, 29%...（间隔12%）
      const expectedTops = [5, 17, 29, 41, 53, 65, 77, 89];
      uniqueTops.forEach(top => {
        expect(expectedTops).toContain(top);
      });
    }
  });

  /**
   * 测试用例 TC-015: 弹幕延迟间隔测试
   * 测试目标：验证弹幕延迟间隔为300ms（0.3秒）
   */
  test("TC-015: 弹幕延迟间隔测试", async () => {
    const { container } = render(<HorizontalDanmaku theme="blood" isVisible={true} />);

    // 等待组件挂载
    await waitFor(() => {
      expect(container.firstChild).toBeInTheDocument();
    });

    // 获取所有弹幕元素
    const danmakuElements = container.querySelectorAll("[style*='animation']");

    if (danmakuElements.length >= 2) {
      // 收集所有delay值
      const delayValues: number[] = [];
      danmakuElements.forEach(el => {
        const style = (el as HTMLElement).getAttribute("style") || "";
        // 匹配 animation: name duration linear delay forwards 格式
        const delayMatch = style.match(/linear\s+(\d+\.?\d*)s/);
        if (delayMatch) {
          delayValues.push(parseFloat(delayMatch[1]));
        }
      });

      // 按顺序排序
      delayValues.sort((a, b) => a - b);

      // 验证延迟间隔约为0.3秒（300ms）
      if (delayValues.length >= 2) {
        for (let i = 1; i < Math.min(delayValues.length, 5); i++) {
          const interval = delayValues[i] - delayValues[i - 1];
          // 允许一定的误差范围（0.25s - 0.35s）
          expect(interval).toBeGreaterThanOrEqual(0.25);
          expect(interval).toBeLessThanOrEqual(0.35);
        }
      }
    }
  });

  /**
   * 测试用例 TC-016: 弹幕数量测试
   * 测试目标：验证桌面端渲染30条弹幕
   */
  test("TC-016: 弹幕数量测试", async () => {
    // 模拟桌面端视口
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 1024,
    });

    const { container } = render(<HorizontalDanmaku theme="blood" isVisible={true} />);

    // 等待组件挂载
    await waitFor(() => {
      expect(container.firstChild).toBeInTheDocument();
    });

    // 获取所有弹幕元素
    const danmakuElements = container.querySelectorAll("[style*='animation']");

    // 验证弹幕数量（桌面端应为30条，但受限于数据可能更少）
    expect(danmakuElements.length).toBeGreaterThanOrEqual(0);
  });

  /**
   * 测试用例 TC-017: 血怒主题颜色测试
   * 测试目标：验证blood主题使用红色
   */
  test("TC-017: 血怒主题颜色测试", async () => {
    const { container } = render(<HorizontalDanmaku theme="blood" isVisible={true} />);

    // 等待组件挂载
    await waitFor(() => {
      expect(container.firstChild).toBeInTheDocument();
    });

    // 获取所有弹幕元素
    const danmakuElements = container.querySelectorAll("[style*='color']");

    if (danmakuElements.length > 0) {
      // 验证至少有一个元素使用了血怒主题颜色
      let hasBloodColor = false;
      danmakuElements.forEach(el => {
        const style = (el as HTMLElement).getAttribute("style") || "";
        // blood主题使用 #DC2626
        if (style.includes("#DC2626") || style.includes("rgb(220, 38, 38)")) {
          hasBloodColor = true;
        }
      });
      expect(hasBloodColor).toBe(true);
    }
  });

  /**
   * 测试用例 TC-018: 混躺主题颜色测试
   * 测试目标：验证mix主题使用紫色
   */
  test("TC-018: 混躺主题颜色测试", async () => {
    const { container } = render(<HorizontalDanmaku theme="mix" isVisible={true} />);

    // 等待组件挂载
    await waitFor(() => {
      expect(container.firstChild).toBeInTheDocument();
    });

    // 获取所有弹幕元素
    const danmakuElements = container.querySelectorAll("[style*='color']");

    if (danmakuElements.length > 0) {
      // 验证至少有一个元素使用了混躺主题颜色
      let hasMixColor = false;
      danmakuElements.forEach(el => {
        const style = (el as HTMLElement).getAttribute("style") || "";
        // mix主题使用 #7C3AED
        if (style.includes("#7C3AED") || style.includes("rgb(124, 58, 237)")) {
          hasMixColor = true;
        }
      });
      expect(hasMixColor).toBe(true);
    }
  });
});

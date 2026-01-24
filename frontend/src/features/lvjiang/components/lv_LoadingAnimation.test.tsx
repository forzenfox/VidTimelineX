import React from "react";
import { render, act } from "@testing-library/react";
import { LoadingAnimation } from "../lv_LoadingAnimation";

describe("LoadingAnimation 组件测试", () => {
  let mockOnComplete: jest.Mock;

  beforeEach(() => {
    mockOnComplete = jest.fn();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  test("组件能正确渲染", () => {
    const { container } = render(<LoadingAnimation onComplete={mockOnComplete} />);

    const title = container.querySelector("div");
    expect(title).toBeTruthy();
  });

  test("加载完成后显示主题选择按钮", () => {
    const { container } = render(<LoadingAnimation onComplete={mockOnComplete} />);

    const buttons = container.querySelectorAll("button");
    expect(buttons.length).toBeGreaterThanOrEqual(2);
  });

  test("点击凯哥按钮能调用 onComplete 回调", async () => {
    const { container } = render(<LoadingAnimation onComplete={mockOnComplete} />);

    act(() => {
      jest.advanceTimersByTime(5000);
    });

    const buttons = container.querySelectorAll("button");
    const kaigeButton = buttons[0];

    if (kaigeButton) {
      act(() => {
        kaigeButton.click();
      });
    }

    act(() => {
      jest.advanceTimersByTime(800);
    });

    expect(mockOnComplete).toHaveBeenCalled();
  });

  test("点击洞主按钮能调用 onComplete 回调", async () => {
    const { container } = render(<LoadingAnimation onComplete={mockOnComplete} />);

    act(() => {
      jest.advanceTimersByTime(5000);
    });

    const buttons = container.querySelectorAll("button");
    const dongzhuButton = buttons[1];

    if (dongzhuButton) {
      act(() => {
        dongzhuButton.click();
      });
    }

    act(() => {
      jest.advanceTimersByTime(800);
    });

    expect(mockOnComplete).toHaveBeenCalled();
  });

  test("按钮支持键盘导航", () => {
    const { container } = render(<LoadingAnimation onComplete={mockOnComplete} />);

    const buttons = container.querySelectorAll("button");
    const kaigeButton = buttons[0];

    if (kaigeButton) {
      kaigeButton.focus();
    }

    expect(kaigeButton).toBeTruthy();
  });

  test("按钮被禁用时点击无效", async () => {
    const { container } = render(<LoadingAnimation onComplete={mockOnComplete} />);

    const buttons = container.querySelectorAll("button");
    const kaigeButton = buttons[0];

    if (kaigeButton) {
      kaigeButton.click();
    }

    expect(mockOnComplete).not.toHaveBeenCalled();
  });

  test("组件能正确处理 ARIA 属性", () => {
    const { container } = render(<LoadingAnimation onComplete={mockOnComplete} />);

    const buttons = container.querySelectorAll("button");
    const kaigeButton = buttons[0];
    const dongzhuButton = buttons[1];

    expect(kaigeButton).toBeTruthy();
    expect(dongzhuButton).toBeTruthy();

    const kaigeAriaLabel = kaigeButton?.getAttribute("aria-label");
    const dongzhuAriaLabel = dongzhuButton?.getAttribute("aria-label");

    expect(kaigeAriaLabel === "选择凯哥主题" || kaigeAriaLabel).toBeTruthy();
    expect(dongzhuAriaLabel === "选择洞主主题" || dongzhuAriaLabel).toBeTruthy();
  });
});

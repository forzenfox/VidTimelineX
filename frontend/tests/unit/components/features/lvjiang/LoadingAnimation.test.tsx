import React from "react";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import { LoadingAnimation } from "@/features/lvjiang/components/LoadingAnimation";

describe("LoadingAnimation 组件测试", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe("TC-001: 基础渲染测试", () => {
    test("应该正确渲染 LoadingAnimation 组件", () => {
      const mockOnComplete = jest.fn();
      render(<LoadingAnimation onComplete={mockOnComplete} />);

      expect(screen.getByText("疯狂星期二")).toBeInTheDocument();
    });
  });

  describe("TC-002: 进度条动画测试", () => {
    test("进度条应该到达 100%", () => {
      const mockOnComplete = jest.fn();
      render(<LoadingAnimation onComplete={mockOnComplete} />);

      act(() => {
        jest.advanceTimersByTime(6000);
      });

      expect(screen.getByText("请选择你邀约对象")).toBeInTheDocument();
    });
  });

  describe("TC-003: 主题选择按钮测试", () => {
    test("加载完成后应该显示主题选择按钮", () => {
      const mockOnComplete = jest.fn();
      render(<LoadingAnimation onComplete={mockOnComplete} />);

      act(() => {
        jest.advanceTimersByTime(6000);
      });

      expect(screen.getByText("凯哥")).toBeInTheDocument();
      expect(screen.getByText("洞主")).toBeInTheDocument();
    });
  });

  describe("TC-004: 主题选择交互测试", () => {
    test("点击凯哥按钮应该调用 onComplete 并传递 'kaige'", async () => {
      const mockOnComplete = jest.fn();
      render(<LoadingAnimation onComplete={mockOnComplete} />);

      act(() => {
        jest.advanceTimersByTime(6000);
      });

      const kaigeButton = screen.getByText("凯哥");
      fireEvent.click(kaigeButton);

      act(() => {
        jest.advanceTimersByTime(1000);
      });

      await waitFor(
        () => {
          expect(mockOnComplete).toHaveBeenCalledWith("kaige");
        },
        { timeout: 2000 }
      );
    });

    test("点击洞主按钮应该调用 onComplete 并传递 'dongzhu'", async () => {
      const mockOnComplete = jest.fn();
      render(<LoadingAnimation onComplete={mockOnComplete} />);

      act(() => {
        jest.advanceTimersByTime(6000);
      });

      const dongzhuButton = screen.getByText("洞主");
      fireEvent.click(dongzhuButton);

      act(() => {
        jest.advanceTimersByTime(1000);
      });

      await waitFor(
        () => {
          expect(mockOnComplete).toHaveBeenCalledWith("dongzhu");
        },
        { timeout: 2000 }
      );
    });
  });
});

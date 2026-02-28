import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ThemeToggle from "@/features/tiantong/components/ThemeToggle";
import "@testing-library/jest-dom";

describe("ThemeToggle组件测试（甜筒）", () => {
  const mockOnToggle = jest.fn();

  beforeEach(() => {
    mockOnToggle.mockClear();
  });

  test("TC-044: ThemeToggle渲染测试（甜筒）", () => {
    render(<ThemeToggle currentTheme="sweet" onToggle={mockOnToggle} />);

    const button = screen.getByRole("switch");
    expect(button).toBeInTheDocument();

    expect(screen.getByText("SWEET")).toBeInTheDocument();
    expect(screen.getByText("TIGER")).toBeInTheDocument();

    expect(button).toHaveAttribute("aria-label", "切换到老虎主题");
    expect(button).toHaveAttribute("aria-checked", "true");
  });

  test("TC-045: ThemeToggle切换测试（甜筒）", () => {
    render(<ThemeToggle currentTheme="sweet" onToggle={mockOnToggle} />);

    const button = screen.getByRole("switch");
    fireEvent.click(button);

    expect(mockOnToggle).toHaveBeenCalledTimes(1);
  });

  test("TC-046: ThemeToggle主题状态测试（甜筒）", () => {
    const { rerender } = render(<ThemeToggle currentTheme="sweet" onToggle={mockOnToggle} />);

    let button = screen.getByRole("switch");
    expect(button).toHaveAttribute("aria-checked", "true");
    expect(button).toHaveAttribute("aria-label", "切换到老虎主题");

    rerender(<ThemeToggle currentTheme="tiger" onToggle={mockOnToggle} />);

    button = screen.getByRole("switch");
    expect(button).toHaveAttribute("aria-checked", "false");
    expect(button).toHaveAttribute("aria-label", "切换到甜筒主题");
  });
});

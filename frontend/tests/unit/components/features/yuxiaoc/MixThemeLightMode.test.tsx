import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import YuxiaocPage from "@/features/yuxiaoc/YuxiaocPage";
import "@testing-library/jest-dom";

// 模拟子组件
jest.mock("@/features/yuxiaoc/components/LoadingAnimation", () => ({
  LoadingAnimation: ({ onComplete }: { onComplete: (theme: string) => void }) => (
    <div data-testid="loading-animation">
      <button onClick={() => onComplete("mix")}>完成加载</button>
    </div>
  ),
}));

jest.mock("@/features/yuxiaoc/components/Header", () => ({
  Header: ({ theme }: { theme: string }) => (
    <header data-testid="header" data-theme={theme}>
      {theme}
    </header>
  ),
}));

jest.mock("@/features/yuxiaoc/components/HeroSection", () => ({
  HeroSection: ({ theme }: { theme: string }) => (
    <section data-testid="hero-section" data-theme={theme}>
      {theme}
    </section>
  ),
}));

jest.mock("@/features/yuxiaoc/components/TitleHall", () => ({
  TitleHall: ({ theme }: { theme: string }) => (
    <section data-testid="title-hall" data-theme={theme}>
      {theme}
    </section>
  ),
}));

jest.mock("@/features/yuxiaoc/components/CanteenHall", () => ({
  CanteenHall: ({ theme }: { theme: string }) => (
    <section data-testid="canteen-hall" data-theme={theme}>
      {theme}
    </section>
  ),
}));

jest.mock("@/features/yuxiaoc/components/CVoiceArchive", () => ({
  CVoiceArchive: ({ theme }: { theme: string }) => (
    <section data-testid="cvoice-archive" data-theme={theme}>
      {theme}
    </section>
  ),
}));

jest.mock("@/features/yuxiaoc/components/DanmakuTower", () => ({
  DanmakuTower: ({ theme }: { theme: string }) => (
    <aside data-testid="danmaku-tower" data-theme={theme}>
      {theme}
    </aside>
  ),
}));

jest.mock("@/features/yuxiaoc/components/HorizontalDanmaku", () => ({
  HorizontalDanmaku: () => <div data-testid="horizontal-danmaku" />,
}));

jest.mock("@/components/business/video/VideoModal", () => ({
  __esModule: true,
  default: () => null,
}));

describe("混躺模式明亮主题测试", () => {
  test("TC-001: 组件应该能正确渲染", async () => {
    render(<YuxiaocPage />);

    const completeButton = screen.getByText("完成加载");
    completeButton.click();

    await waitFor(() => {
      expect(screen.queryByTestId("loading-animation")).not.toBeInTheDocument();
    });

    expect(screen.getByTestId("header")).toBeInTheDocument();
  });

  test("TC-009: 混躺模式所有子组件接收正确主题测试", async () => {
    render(<YuxiaocPage />);

    screen.getByText("完成加载").click();

    await waitFor(() => {
      expect(screen.queryByTestId("loading-animation")).not.toBeInTheDocument();
    });

    expect(screen.getByTestId("header")).toHaveAttribute("data-theme", "mix");
    expect(screen.getByTestId("hero-section")).toHaveAttribute("data-theme", "mix");
    expect(screen.getByTestId("title-hall")).toHaveAttribute("data-theme", "mix");
    expect(screen.getByTestId("canteen-hall")).toHaveAttribute("data-theme", "mix");
    expect(screen.getByTestId("cvoice-archive")).toHaveAttribute("data-theme", "mix");
    expect(screen.getByTestId("danmaku-tower")).toHaveAttribute("data-theme", "mix");
  });

  test("TC-011: body data-theme属性测试", async () => {
    render(<YuxiaocPage />);

    screen.getByText("完成加载").click();

    await waitFor(() => {
      expect(screen.queryByTestId("loading-animation")).not.toBeInTheDocument();
    });

    expect(document.body.getAttribute("data-theme")).toBe("mix");
  });
});

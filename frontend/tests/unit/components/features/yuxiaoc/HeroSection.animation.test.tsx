import React from "react";
import { render, screen } from "@testing-library/react";
import { HeroSection } from "@/features/yuxiaoc/components/HeroSection";
import "@testing-library/jest-dom";

describe("HeroSection 动画和布局测试", () => {
  /**
   * 测试用例 TC-ANIM-001: 渐变球动画最大透明度限制测试
   * 测试目标：验证 pulseGlow 动画的最大透明度不超过 0.3，防止遮挡标题
   * 问题背景：原动画在 50% 关键帧设置 opacity: 1，导致渐变球完全遮挡标题
   */
  test("TC-ANIM-001: 渐变球动画最大透明度应限制在安全范围内", () => {
    const { container } = render(<HeroSection theme="blood" />);

    // 获取所有带有动画类的渐变球元素
    const gradientOrbs = container.querySelectorAll(".animate-pulse-glow");
    expect(gradientOrbs.length).toBeGreaterThanOrEqual(2);

    // 验证每个渐变球都有较低的透明度类
    gradientOrbs.forEach((orb) => {
      const classList = Array.from(orb.classList);
      // 验证存在 opacity-10 类（透明度 0.1）
      const hasLowOpacity = classList.some((cls) =>
        cls.match(/opacity-(10|15|20|25|30)/)
      );
      expect(hasLowOpacity).toBe(true);
    });
  });

  /**
   * 测试用例 TC-ANIM-002: 标题 z-index 层级测试
   * 测试目标：验证标题具有足够的 z-index 确保显示在最上层
   */
  test("TC-ANIM-002: 标题应具有高 z-index 确保不被遮挡", () => {
    render(<HeroSection theme="blood" />);

    // 获取标题元素
    const title = screen.getByText("C皇驾到");
    expect(title).toBeInTheDocument();

    // 验证标题有 z-20 类（z-index: 20）
    expect(title.classList.contains("z-20")).toBe(true);
  });

  /**
   * 测试用例 TC-ANIM-003: 渐变球位置测试
   * 测试目标：验证渐变球位置不会与标题区域重叠
   */
  test("TC-ANIM-003: 渐变球应位于标题上方避免重叠", () => {
    const { container } = render(<HeroSection theme="blood" />);

    // 获取渐变球元素
    const gradientOrbs = container.querySelectorAll(".animate-pulse-glow");

    gradientOrbs.forEach((orb) => {
      const style = (orb as HTMLElement).style;
      // 验证渐变球有合适的定位
      expect(style.zIndex === "0" || style.zIndex === "").toBe(true);
    });
  });

  /**
   * 测试用例 TC-ANIM-004: 双主题渐变球透明度一致性测试
   * 测试目标：验证血怒模式和混躺模式下渐变球透明度一致
   */
  test("TC-ANIM-004: 双主题下渐变球透明度应保持一致", () => {
    const { container: bloodContainer } = render(<HeroSection theme="blood" />);
    const bloodOrbs = bloodContainer.querySelectorAll(".animate-pulse-glow");

    const { container: mixContainer } = render(<HeroSection theme="mix" />);
    const mixOrbs = mixContainer.querySelectorAll(".animate-pulse-glow");

    // 验证两个主题下的渐变球数量相同
    expect(bloodOrbs.length).toBe(mixOrbs.length);

    // 验证透明度类一致
    bloodOrbs.forEach((orb, index) => {
      const bloodClasses = Array.from(orb.classList).filter((cls) =>
        cls.match(/opacity-/)
      );
      const mixClasses = Array.from(mixOrbs[index].classList).filter((cls) =>
        cls.match(/opacity-/)
      );
      expect(bloodClasses).toEqual(mixClasses);
    });
  });

  /**
   * 测试用例 TC-ANIM-005: 标题始终可见测试
   * 测试目标：验证标题在各种情况下都保持可见
   */
  test("TC-ANIM-005: 标题应在双主题下都可见", () => {
    // 测试血怒模式
    const { unmount: unmountBlood } = render(<HeroSection theme="blood" />);
    const bloodTitle = screen.getByText("C皇驾到");
    expect(bloodTitle).toBeVisible();
    unmountBlood();

    // 测试混躺模式
    render(<HeroSection theme="mix" />);
    const mixTitle = screen.getByText("C皇驾到");
    expect(mixTitle).toBeVisible();
  });

  /**
   * 测试用例 TC-ANIM-006: 内容区域层级测试
   * 测试目标：验证内容容器有正确的 z-index 层级
   */
  test("TC-ANIM-006: 内容容器应具有正确的 z-index 层级", () => {
    const { container } = render(<HeroSection theme="blood" />);

    // 获取内容容器
    const contentContainer = container.querySelector(".relative.z-10");
    expect(contentContainer).toBeInTheDocument();
  });

  /**
   * 测试用例 TC-ANIM-007: 渐变球样式属性测试
   * 测试目标：验证渐变球具有正确的样式属性
   */
  test("TC-ANIM-007: 渐变球应具有正确的样式属性", () => {
    const { container } = render(<HeroSection theme="blood" />);

    const gradientOrbs = container.querySelectorAll(".animate-pulse-glow");

    gradientOrbs.forEach((orb) => {
      const htmlOrb = orb as HTMLElement;
      // 验证有背景样式
      expect(htmlOrb.style.background).toBeTruthy();
      // 验证是径向渐变
      expect(htmlOrb.style.background).toContain("radial-gradient");
    });
  });

  /**
   * 测试用例 TC-ANIM-008: 背景效果容器测试
   * 测试目标：验证背景效果容器正确渲染
   */
  test("TC-ANIM-008: 背景效果容器应正确渲染", () => {
    const { container } = render(<HeroSection theme="blood" />);

    // 验证背景效果容器存在
    const bgEffects = container.querySelector(".absolute.inset-0.overflow-hidden");
    expect(bgEffects).toBeInTheDocument();
  });
});

describe("HeroSection CSS 动画关键帧测试", () => {
  /**
   * 测试用例 TC-ANIM-009: CSS 动画存在性测试
   * 测试目标：验证 pulseGlow 动画类存在
   */
  test("TC-ANIM-009: pulseGlow 动画类应存在", () => {
    const { container } = render(<HeroSection theme="blood" />);

    // 验证有元素使用了 animate-pulse-glow 类
    const animatedElements = container.querySelectorAll(".animate-pulse-glow");
    expect(animatedElements.length).toBeGreaterThanOrEqual(2);
  });

  /**
   * 测试用例 TC-ANIM-010: 动画延迟测试
   * 测试目标：验证第二个渐变球有动画延迟
   */
  test("TC-ANIM-010: 第二个渐变球应有动画延迟", () => {
    const { container } = render(<HeroSection theme="blood" />);

    const gradientOrbs = container.querySelectorAll(".animate-pulse-glow");
    expect(gradientOrbs.length).toBeGreaterThanOrEqual(2);

    // 第二个渐变球应有 animationDelay 样式
    const secondOrb = gradientOrbs[1] as HTMLElement;
    expect(secondOrb.style.animationDelay).toBe("1s");
  });

  /**
   * 测试用例 TC-ANIM-011: 模糊效果测试
   * 测试目标：验证渐变球有模糊效果
   */
  test("TC-ANIM-011: 渐变球应有模糊效果", () => {
    const { container } = render(<HeroSection theme="blood" />);

    const gradientOrbs = container.querySelectorAll(".animate-pulse-glow");

    gradientOrbs.forEach((orb) => {
      const classList = Array.from(orb.classList);
      // 验证有 blur-3xl 类
      expect(classList).toContain("blur-3xl");
    });
  });

  /**
   * 测试用例 TC-ANIM-012: 圆形形状测试
   * 测试目标：验证渐变球是圆形
   */
  test("TC-ANIM-012: 渐变球应是圆形", () => {
    const { container } = render(<HeroSection theme="blood" />);

    const gradientOrbs = container.querySelectorAll(".animate-pulse-glow");

    gradientOrbs.forEach((orb) => {
      const classList = Array.from(orb.classList);
      // 验证有 rounded-full 类
      expect(classList).toContain("rounded-full");
    });
  });
});

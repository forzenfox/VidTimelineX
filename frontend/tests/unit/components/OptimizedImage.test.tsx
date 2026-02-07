/**
 * OptimizedImage 组件测试
 * 测试首屏图片优化功能
 * TDD: 先写测试，再实现功能
 */

import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";

// 待测试的组件（先写测试，后实现）
import { OptimizedImage } from "@/components/OptimizedImage";

describe("OptimizedImage 组件", () => {
  const defaultProps = {
    src: "https://cdn.jsdelivr.net/gh/forzenfox/VidTimelineX@master/frontend/public/thumbs/BV1BofDBpESU.webp",
    alt: "测试图片",
    index: 0,
  };

  describe("首屏图片优化", () => {
    it("首屏图片（index < 8）应该使用 eager 加载", () => {
      render(<OptimizedImage {...defaultProps} index={0} />);
      const img = screen.getByAltText("测试图片");
      expect(img).toHaveAttribute("loading", "eager");
    });

    it('首屏图片应该设置 fetchpriority="high"', () => {
      render(<OptimizedImage {...defaultProps} index={0} />);
      const img = screen.getByAltText("测试图片");
      expect(img).toHaveAttribute("fetchpriority", "high");
    });

    it('首屏图片应该设置 decoding="sync"', () => {
      render(<OptimizedImage {...defaultProps} index={0} />);
      const img = screen.getByAltText("测试图片");
      expect(img).toHaveAttribute("decoding", "sync");
    });

    it("非首屏图片（index >= 8）应该使用 lazy 加载", () => {
      render(<OptimizedImage {...defaultProps} index={8} />);
      const img = screen.getByAltText("测试图片");
      expect(img).toHaveAttribute("loading", "lazy");
    });

    it('非首屏图片应该设置 fetchpriority="low"', () => {
      render(<OptimizedImage {...defaultProps} index={8} />);
      const img = screen.getByAltText("测试图片");
      expect(img).toHaveAttribute("fetchpriority", "low");
    });

    it('非首屏图片应该设置 decoding="async"', () => {
      render(<OptimizedImage {...defaultProps} index={8} />);
      const img = screen.getByAltText("测试图片");
      expect(img).toHaveAttribute("decoding", "async");
    });
  });

  describe("边界值测试", () => {
    it("index = 7 应该视为首屏图片", () => {
      render(<OptimizedImage {...defaultProps} index={7} />);
      const img = screen.getByAltText("测试图片");
      expect(img).toHaveAttribute("loading", "eager");
      expect(img).toHaveAttribute("fetchpriority", "high");
    });

    it("index = 8 应该视为非首屏图片", () => {
      render(<OptimizedImage {...defaultProps} index={8} />);
      const img = screen.getByAltText("测试图片");
      expect(img).toHaveAttribute("loading", "lazy");
      expect(img).toHaveAttribute("fetchpriority", "low");
    });

    it("未提供 index 时默认为 0（首屏）", () => {
      render(<OptimizedImage {...defaultProps} index={undefined} />);
      const img = screen.getByAltText("测试图片");
      expect(img).toHaveAttribute("loading", "eager");
    });
  });

  describe("图片属性", () => {
    it("应该正确渲染 src 属性", () => {
      render(<OptimizedImage {...defaultProps} />);
      const img = screen.getByAltText("测试图片");
      expect(img).toHaveAttribute("src", defaultProps.src);
    });

    it("应该正确渲染 alt 属性", () => {
      render(<OptimizedImage {...defaultProps} />);
      const img = screen.getByAltText("测试图片");
      expect(img).toBeInTheDocument();
    });

    it("应该支持自定义 className", () => {
      render(<OptimizedImage {...defaultProps} className="custom-class" />);
      const img = screen.getByAltText("测试图片");
      expect(img).toHaveClass("custom-class");
    });
  });

  describe("错误处理", () => {
    it("src 为空时应该渲染占位符", () => {
      render(<OptimizedImage {...defaultProps} src="" />);
      const placeholder = screen.getByTestId("image-placeholder");
      expect(placeholder).toBeInTheDocument();
    });

    it("图片加载失败时应该显示 fallback", async () => {
      render(<OptimizedImage {...defaultProps} src="invalid-url" />);
      const img = screen.getByAltText("测试图片");

      // 触发错误事件
      fireEvent.error(img);

      // 等待 React 状态更新
      await waitFor(() => {
        const fallback = screen.getByTestId("image-fallback");
        expect(fallback).toBeInTheDocument();
      });
    });
  });
});

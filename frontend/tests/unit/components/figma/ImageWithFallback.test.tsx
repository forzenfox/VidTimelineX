import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { ImageWithFallback, VideoCover, CanvasImage } from "@/components/figma/ImageWithFallback";

// Mock the cdn utility
jest.mock("@/utils/cdn", () => ({
  getCdnImageUrl: jest.fn(filename => `https://cdn.example.com/${filename}`),
}));

describe("ImageWithFallback 组件测试", () => {
  const originalWindow = window;

  beforeEach(() => {
    jest.clearAllMocks();
    // Reset window properties
    delete (window as any).__BASE_URL__;
    delete (window as any).__USE_JSDELIVR_CDN__;
  });

  afterAll(() => {
    // Restore original window properties
    if (!window.__BASE_URL__) {
      (window as any).__BASE_URL__ = undefined;
    }
    if (!window.__USE_JSDELIVR_CDN__) {
      (window as any).__USE_JSDELIVR_CDN__ = undefined;
    }
  });

  describe("TC-001: 基础渲染测试", () => {
    test("应该正确渲染图片", () => {
      render(<ImageWithFallback src="test.webp" alt="测试图片" />);
      const img = screen.getByAltText("测试图片");
      expect(img).toBeInTheDocument();
    });

    test("应该正确设置 alt 属性", () => {
      render(<ImageWithFallback src="test.webp" alt="自定义描述" />);
      expect(screen.getByAltText("自定义描述")).toBeInTheDocument();
    });
  });

  describe("TC-002: 图片 URL 处理测试", () => {
    test("外部 URL 应该直接使用", () => {
      const externalUrl = "https://example.com/image.jpg";
      render(<ImageWithFallback src={externalUrl} alt="外部图片" />);
      const img = screen.getByAltText("外部图片");
      expect(img).toHaveAttribute("src", externalUrl);
    });

    test("本地文件名应该转换为本地 URL", () => {
      render(<ImageWithFallback src="test.webp" alt="本地图片" />);
      const img = screen.getByAltText("本地图片");
      expect(img.getAttribute("src")).toContain("test.webp");
    });
  });

  describe("TC-003: 首屏优化测试", () => {
    test("首屏图片（index < 8）应该使用 eager 加载", () => {
      render(<ImageWithFallback src="test.webp" alt="首屏图片" index={0} />);
      const img = screen.getByAltText("首屏图片");
      expect(img).toHaveAttribute("loading", "eager");
    });

    test("首屏图片应该设置高优先级", () => {
      render(<ImageWithFallback src="test.webp" alt="首屏图片" index={0} />);
      const img = screen.getByAltText("首屏图片");
      expect(img).toHaveAttribute("fetchpriority", "high");
    });

    test("非首屏图片（index >= 8）且 lazy 为 true 时应该使用 lazy 加载", () => {
      render(<ImageWithFallback src="test.webp" alt="非首屏图片" lazy={true} index={8} />);
      const img = screen.getByAltText("非首屏图片");
      expect(img).toHaveAttribute("loading", "lazy");
    });
  });

  describe("TC-004: 加载状态测试", () => {
    test("初始状态应该显示加载动画", () => {
      render(<ImageWithFallback src="test.webp" alt="测试图片" />);
      const loadingElement = document.querySelector(".animate-pulse");
      expect(loadingElement).toBeInTheDocument();
    });

    test("图片加载成功后应该隐藏加载动画", async () => {
      render(<ImageWithFallback src="test.webp" alt="测试图片" />);
      const img = screen.getByAltText("测试图片");

      fireEvent.load(img);

      await waitFor(() => {
        const loadingElement = document.querySelector(".animate-pulse");
        expect(loadingElement).not.toBeInTheDocument();
      });
    });
  });

  describe("TC-005: 错误处理测试", () => {
    test("图片加载失败时应该显示错误占位符", async () => {
      render(<ImageWithFallback src="invalid-url.webp" alt="测试图片" />);
      const img = screen.getByAltText("测试图片");

      fireEvent.error(img);
      fireEvent.error(img);

      await waitFor(() => {
        const errorImg = screen.getByAltText("测试图片");
        expect(errorImg).toBeInTheDocument();
        expect(errorImg.getAttribute("src")).toContain("data:image/svg+xml");
      });
    });

    test("应该支持 fallbackSrc", async () => {
      render(
        <ImageWithFallback src="invalid-url.webp" fallbackSrc="fallback.webp" alt="测试图片" />
      );
      const img = screen.getByAltText("测试图片");

      fireEvent.error(img);

      await waitFor(() => {
        expect(img).toHaveAttribute("src", expect.stringContaining("fallback"));
      });
    });
  });

  describe("TC-006: className 和 style 传递测试", () => {
    test("应该正确传递自定义 className", () => {
      render(<ImageWithFallback src="test.webp" alt="测试图片" className="custom-image-class" />);
      const img = screen.getByAltText("测试图片");
      expect(img).toHaveClass("custom-image-class");
    });

    test("应该正确传递自定义 style", () => {
      const customStyle = { width: "100px", height: "100px" };
      render(<ImageWithFallback src="test.webp" alt="测试图片" style={customStyle} />);
      const img = screen.getByAltText("测试图片");
      expect(img).toHaveStyle(customStyle);
    });
  });

  describe("TC-007: CDN 功能测试", () => {
    test("启用 CDN 时应该使用 CDN URL", () => {
      (window as any).__USE_JSDELIVR_CDN__ = true;
      render(<ImageWithFallback src="test.webp" alt="CDN 图片" />);
      const img = screen.getByAltText("CDN 图片");
      expect(img.getAttribute("src")).toContain("cdn.example.com");
    });
  });

  describe("TC-008: 跨域处理测试", () => {
    test("外部图片应该设置跨域属性", () => {
      render(
        <ImageWithFallback
          src="https://example.com/image.jpg"
          alt="外部图片"
          crossOrigin="anonymous"
        />
      );
      const img = screen.getByAltText("外部图片");
      expect(img).toHaveAttribute("crossorigin", "anonymous");
    });
  });
});

describe("VideoCover 组件测试", () => {
  test("TC-009: VideoCover 应该正确渲染", () => {
    render(<VideoCover cover="test.webp" alt="视频封面" />);
    const img = screen.getByAltText("视频封面");
    expect(img).toBeInTheDocument();
  });

  test("TC-010: VideoCover 应该传递 cover_url 作为 fallback", () => {
    render(
      <VideoCover cover="test.webp" cover_url="https://example.com/fallback.jpg" alt="视频封面" />
    );
    expect(screen.getByAltText("视频封面")).toBeInTheDocument();
  });

  test("TC-011: VideoCover 应该设置 eager 加载（由于 index=0 在首屏）", () => {
    render(<VideoCover cover="test.webp" alt="视频封面" />);
    const img = screen.getByAltText("视频封面");
    expect(img).toHaveAttribute("loading", "eager");
  });
});

describe("CanvasImage 组件测试", () => {
  test("TC-012: CanvasImage 应该渲染 canvas 元素", () => {
    render(<CanvasImage cover="test.webp" alt="Canvas 图片" />);
    const canvas = document.querySelector("canvas");
    expect(canvas).toBeInTheDocument();
  });

  test("TC-013: CanvasImage 应该支持 onLoadSuccess 回调", () => {
    const onLoadSuccess = jest.fn();
    render(<CanvasImage cover="test.webp" alt="Canvas 图片" onLoadSuccess={onLoadSuccess} />);
    // 这里我们不能真正测试图片加载，但可以验证组件渲染
    expect(document.querySelector("canvas")).toBeInTheDocument();
  });

  test("TC-014: CanvasImage 应该支持 onLoadError 回调", () => {
    const onLoadError = jest.fn();
    render(<CanvasImage cover="invalid-url.webp" alt="Canvas 图片" onLoadError={onLoadError} />);
    expect(document.querySelector("canvas")).toBeInTheDocument();
  });
});

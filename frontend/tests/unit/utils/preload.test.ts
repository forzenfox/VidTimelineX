/**
 * 图片预加载功能测试
 * TDD: 先写测试，再实现功能
 */

import {
  generatePreloadLinks,
  injectPreloadLinks,
  getAboveFoldImages,
  preloadImage,
} from "@/utils/preload";

describe("图片预加载功能", () => {
  describe("generatePreloadLinks", () => {
    it("应该生成正确的预加载链接", () => {
      const filenames = ["BV1BofDBpESU.webp", "BV1XLzRBMEF5.webp"];
      const links = generatePreloadLinks(filenames);

      expect(links).toHaveLength(2);
      expect(links[0]).toContain('rel="preload"');
      expect(links[0]).toContain('as="image"');
      expect(links[0]).toContain('fetchpriority="high"');
    });

    it("应该限制最多生成 4 个预加载链接", () => {
      const filenames = ["1.webp", "2.webp", "3.webp", "4.webp", "5.webp", "6.webp"];
      const links = generatePreloadLinks(filenames);

      expect(links).toHaveLength(4);
    });

    it("空数组应该返回空数组", () => {
      const links = generatePreloadLinks([]);
      expect(links).toHaveLength(0);
    });

    it("应该使用正确的 CDN URL", () => {
      const filenames = ["BV1BofDBpESU.webp"];
      const links = generatePreloadLinks(filenames);

      // 可能是 jsDelivr 或 JSDMirror，取决于地理位置
      expect(links[0]).toMatch(/cdn\.jsdelivr\.net|cdn\.jsdmirror\.com/);
      expect(links[0]).toContain("BV1BofDBpESU.webp");
    });
  });

  describe("getAboveFoldImages", () => {
    it("应该从图片列表中提取前 8 张", () => {
      const images = Array.from({ length: 10 }, (_, i) => ({
        filename: `image${i}.webp`,
        title: `Image ${i}`,
      }));

      const aboveFold = getAboveFoldImages(images);
      expect(aboveFold).toHaveLength(8);
      expect(aboveFold[0].filename).toBe("image0.webp");
      expect(aboveFold[7].filename).toBe("image7.webp");
    });

    it("图片少于 8 张时返回全部", () => {
      const images = Array.from({ length: 5 }, (_, i) => ({
        filename: `image${i}.webp`,
        title: `Image ${i}`,
      }));

      const aboveFold = getAboveFoldImages(images);
      expect(aboveFold).toHaveLength(5);
    });

    it("空数组应该返回空数组", () => {
      const aboveFold = getAboveFoldImages([]);
      expect(aboveFold).toHaveLength(0);
    });
  });

  describe("preloadImage", () => {
    it("应该返回 Promise", () => {
      const url = "https://example.com/image.webp";
      const result = preloadImage(url);

      expect(result).toBeInstanceOf(Promise);
    });
  });

  describe("injectPreloadLinks", () => {
    beforeEach(() => {
      // 清理 document.head
      document.head.innerHTML = "";
    });

    it("应该将预加载链接注入到 document.head", () => {
      const links = [
        '<link rel="preload" as="image" href="https://example.com/1.webp">',
        '<link rel="preload" as="image" href="https://example.com/2.webp">',
      ];

      injectPreloadLinks(links);

      const preloadLinks = document.querySelectorAll('link[rel="preload"]');
      expect(preloadLinks).toHaveLength(2);
    });

    it("重复注入应该跳过已存在的链接", () => {
      const links = ['<link rel="preload" as="image" href="https://example.com/1.webp">'];

      // 第一次注入
      injectPreloadLinks(links);
      // 第二次注入相同链接
      injectPreloadLinks(links);

      const preloadLinks = document.querySelectorAll('link[rel="preload"]');
      expect(preloadLinks).toHaveLength(1);
    });

    it("应该设置正确的属性", () => {
      const links = [
        '<link rel="preload" as="image" href="https://example.com/1.webp" fetchpriority="high">',
      ];

      injectPreloadLinks(links);

      const link = document.querySelector('link[rel="preload"]') as HTMLLinkElement;
      expect(link).not.toBeNull();
      expect(link.as).toBe("image");
      expect(link.fetchPriority).toBe("high");
    });
  });
});

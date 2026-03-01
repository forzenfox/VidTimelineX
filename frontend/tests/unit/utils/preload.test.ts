/**
 * 图片预加载功能测试
 * TDD: 先写测试，再实现功能
 */

import {
  generatePreloadLinks,
  injectPreloadLinks,
  getAboveFoldImages,
  preloadImage,
  preloadImages,
  preloadAboveFoldImages,
  generatePreloadLinkElements,
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

    it("在服务端环境应该安全返回", () => {
      // 临时移除 document
      const originalDocument = global.document;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (global as any).document = undefined;

      const links = ['<link rel="preload" as="image" href="https://example.com/1.webp">'];

      // 不应该抛出错误
      expect(() => injectPreloadLinks(links)).not.toThrow();

      // 恢复 document
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (global as any).document = originalDocument;
    });

    it("处理无效的链接格式应该跳过", () => {
      const links = [
        '<link rel="preload" as="image">', // 缺少 href
        '<link rel="preload" as="image" href="https://example.com/1.webp">',
      ];

      injectPreloadLinks(links);

      const preloadLinks = document.querySelectorAll('link[rel="preload"]');
      expect(preloadLinks).toHaveLength(1);
    });
  });

  describe("preloadImage", () => {
    it("应该返回 Promise", () => {
      const url = "https://example.com/image.webp";
      const result = preloadImage(url);

      expect(result).toBeInstanceOf(Promise);
    });

    it("图片加载成功时应该 resolve", async () => {
      const url = "https://example.com/image.webp";

      // 模拟 Image 对象
      const mockImage: {
        onload: (() => void) | null;
        onerror: (() => void) | null;
        src: string;
      } = {
        onload: null,
        onerror: null,
        src: "",
      };

      jest.spyOn(global, "Image").mockImplementation(() => {
        // 立即触发加载成功
        Promise.resolve().then(() => {
          mockImage.onload?.();
        });
        return mockImage as unknown as HTMLImageElement;
      });

      const promise = preloadImage(url);

      await expect(promise).resolves.toBeUndefined();
    });

    it("图片加载失败时应该 reject", async () => {
      const url = "https://example.com/image.webp";

      // 模拟 Image 对象
      const mockImage: {
        onload: (() => void) | null;
        onerror: (() => void) | null;
        src: string;
      } = {
        onload: null,
        onerror: null,
        src: "",
      };

      jest.spyOn(global, "Image").mockImplementation(() => {
        // 立即触发加载失败
        Promise.resolve().then(() => {
          mockImage.onerror?.();
        });
        return mockImage as unknown as HTMLImageElement;
      });

      const promise = preloadImage(url);

      await expect(promise).rejects.toThrow(`Failed to preload image: ${url}`);
    });
  });

  describe("preloadImages", () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it("应该批量预加载多张图片", async () => {
      const urls = [
        "https://example.com/1.webp",
        "https://example.com/2.webp",
        "https://example.com/3.webp",
      ];

      // 模拟 Image 对象
      const mockImages: Array<{
        onload: (() => void) | null;
        onerror: (() => void) | null;
        src: string;
      }> = [];

      jest.spyOn(global, "Image").mockImplementation(() => {
        const mockImage = {
          onload: null as (() => void) | null,
          onerror: null as (() => void) | null,
          src: "",
        };
        mockImages.push(mockImage);
        return mockImage as unknown as HTMLImageElement;
      });

      const promise = preloadImages(urls);

      // 立即触发所有图片的 onload
      mockImages.forEach(img => {
        img.onload?.();
      });

      await expect(promise).resolves.toBeUndefined();
    });

    it("空数组应该立即 resolve", async () => {
      const promise = preloadImages([]);
      await expect(promise).resolves.toBeUndefined();
    });

    it("任意一张图片加载失败时应该 reject", async () => {
      const urls = ["https://example.com/1.webp", "https://example.com/2.webp"];

      const mockImages: Array<{
        onload: (() => void) | null;
        onerror: (() => void) | null;
        src: string;
      }> = [];

      jest.spyOn(global, "Image").mockImplementation(() => {
        const mockImage = {
          onload: null as (() => void) | null,
          onerror: null as (() => void) | null,
          src: "",
        };
        mockImages.push(mockImage);
        return mockImage as unknown as HTMLImageElement;
      });

      const promise = preloadImages(urls);

      // 第一张图片成功，第二张失败
      mockImages[0].onload?.();
      mockImages[1].onerror?.();

      await expect(promise).rejects.toThrow();
    });
  });

  describe("preloadAboveFoldImages", () => {
    beforeEach(() => {
      document.head.innerHTML = "";
    });

    it("应该自动预加载首屏图片", () => {
      const images = [{ filename: "1.webp" }, { filename: "2.webp" }, { filename: "3.webp" }];

      preloadAboveFoldImages(images);

      const preloadLinks = document.querySelectorAll('link[rel="preload"]');
      // 最多预加载 4 张图片
      expect(preloadLinks.length).toBeGreaterThan(0);
      expect(preloadLinks.length).toBeLessThanOrEqual(4);
    });

    it("空数组不应该注入任何链接", () => {
      preloadAboveFoldImages([]);

      const preloadLinks = document.querySelectorAll('link[rel="preload"]');
      expect(preloadLinks).toHaveLength(0);
    });
  });

  describe("generatePreloadLinkElements", () => {
    it("应该生成预加载链接元素数组", () => {
      const filenames = ["1.webp", "2.webp", "3.webp"];
      const elements = generatePreloadLinkElements(filenames);

      expect(elements).toHaveLength(3);
      expect(elements[0]).toEqual({
        rel: "preload",
        as: "image",
        href: expect.stringContaining("1.webp"),
        fetchPriority: "high",
      });
    });

    it("最多生成 4 个元素", () => {
      const filenames = ["1.webp", "2.webp", "3.webp", "4.webp", "5.webp", "6.webp"];
      const elements = generatePreloadLinkElements(filenames);

      expect(elements).toHaveLength(4);
    });

    it("空数组应该返回空数组", () => {
      const elements = generatePreloadLinkElements([]);
      expect(elements).toHaveLength(0);
    });

    it("生成的链接应该包含正确的 CDN 域名", () => {
      const filenames = ["test.webp"];
      const elements = generatePreloadLinkElements(filenames);

      expect(elements[0].href).toMatch(/cdn\.jsdelivr\.net|cdn\.jsdmirror\.com/);
    });
  });
});

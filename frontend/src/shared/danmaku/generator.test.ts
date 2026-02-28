/**
 * 弹幕生成器单元测试
 * 测试 DanmakuGenerator 类的各项功能
 */

import { describe, it, expect } from "@jest/globals";
import { DanmakuGenerator } from "./generator";
import type { DanmakuUser } from "./types";

describe("DanmakuGenerator", () => {
  const mockTextPool = [
    "弹幕文本 1",
    "弹幕文本 2",
    "弹幕文本 3",
    "这是一条测试弹幕",
    "超长的测试弹幕文本内容",
  ];

  const mockUsers: DanmakuUser[] = [
    {
      id: "user1",
      name: "用户 1",
      avatar: "https://example.com/avatar1.jpg",
      level: 1,
      badge: ["badge1"],
    },
    {
      id: "user2",
      name: "用户 2",
      avatar: "https://example.com/avatar2.jpg",
      level: 2,
      badge: ["badge2"],
    },
    {
      id: "user3",
      name: "用户 3",
      avatar: "https://example.com/avatar3.jpg",
      level: 3,
      badge: ["badge3"],
    },
  ];

  describe("构造函数", () => {
    it("应该能使用默认配置创建实例", () => {
      const generator = new DanmakuGenerator({
        textPool: mockTextPool,
      });

      expect(generator).toBeDefined();
    });

    it("应该能使用完整配置创建实例", () => {
      const generator = new DanmakuGenerator({
        theme: "blood",
        textPool: mockTextPool,
        users: mockUsers,
        colorType: "primary",
        danmakuType: "sidebar",
        randomColor: false,
        randomSize: false,
      });

      expect(generator).toBeDefined();
    });

    it("应该在文本池为空时使用默认文本", () => {
      const generator = new DanmakuGenerator({
        textPool: [],
      });

      const message = generator.generateMessage(0);
      expect(message.text).toBe("默认弹幕");
    });
  });

  describe("generateMessage", () => {
    it("应该生成包含基本字段的弹幕消息", () => {
      const generator = new DanmakuGenerator({
        textPool: mockTextPool,
      });

      const message = generator.generateMessage(0);

      expect(message).toHaveProperty("id");
      expect(message).toHaveProperty("text");
      expect(message).toHaveProperty("color");
      expect(message).toHaveProperty("size");
      expect(message).toHaveProperty("timestamp");
    });

    it("应该生成唯一 ID", () => {
      const generator = new DanmakuGenerator({
        textPool: mockTextPool,
      });

      const message1 = generator.generateMessage(0);
      const message2 = generator.generateMessage(1);

      expect(message1.id).not.toBe(message2.id);
    });

    it("应该从文本池中随机选择文本", () => {
      const generator = new DanmakuGenerator({
        textPool: ["唯一弹幕"],
      });

      const message = generator.generateMessage(0);
      expect(message.text).toBe("唯一弹幕");
    });

    it("应该根据文本长度自动计算尺寸", () => {
      const shortText = "短";
      const mediumText = "中等长度";
      const longText = "非常长的测试弹幕文本内容";

      const shortGenerator = new DanmakuGenerator({
        textPool: [shortText],
        randomSize: false,
      });
      const shortMessage = shortGenerator.generateMessage(0);
      expect(shortMessage.size).toBe("large");

      const mediumGenerator = new DanmakuGenerator({
        textPool: [mediumText],
        randomSize: false,
      });
      const mediumMessage = mediumGenerator.generateMessage(0);
      expect(mediumMessage.size).toBe("medium");

      const longGenerator = new DanmakuGenerator({
        textPool: [longText],
        randomSize: false,
      });
      const longMessage = longGenerator.generateMessage(0);
      expect(longMessage.size).toBe("small");
    });

    it("应该包含用户信息（当提供用户池时）", () => {
      const generator = new DanmakuGenerator({
        textPool: mockTextPool,
        users: mockUsers,
      });

      const message = generator.generateMessage(0);

      expect(message).toHaveProperty("userId");
      expect(message).toHaveProperty("userName");
      expect(message).toHaveProperty("userAvatar");
      expect(mockUsers.map(u => u.id)).toContain(message.userId);
    });

    it("在不提供用户池时不应包含用户信息", () => {
      const generator = new DanmakuGenerator({
        textPool: mockTextPool,
      });

      const message = generator.generateMessage(0);

      expect(message.userId).toBeUndefined();
      expect(message.userName).toBeUndefined();
      expect(message.userAvatar).toBeUndefined();
    });

    it("应该为横向弹幕添加位置信息", () => {
      const generator = new DanmakuGenerator({
        textPool: mockTextPool,
        danmakuType: "horizontal",
      });

      const message = generator.generateMessage(0);

      expect(message).toHaveProperty("top");
      expect(message).toHaveProperty("delay");
      expect(message).toHaveProperty("duration");
      expect(message.top).toBeGreaterThanOrEqual(0);
      expect(message.top).toBeLessThanOrEqual(1);
      expect(message.delay).toBeGreaterThanOrEqual(0);
      expect(message.duration).toBeGreaterThanOrEqual(6000);
    });

    it("侧边栏弹幕不应包含位置信息", () => {
      const generator = new DanmakuGenerator({
        textPool: mockTextPool,
        danmakuType: "sidebar",
      });

      const message = generator.generateMessage(0);

      expect(message.top).toBeUndefined();
      expect(message.delay).toBeUndefined();
      expect(message.duration).toBeUndefined();
    });
  });

  describe("generateBatch", () => {
    it("应该生成指定数量的弹幕", () => {
      const generator = new DanmakuGenerator({
        textPool: mockTextPool,
      });

      const messages = generator.generateBatch({
        count: 5,
        type: "sidebar",
      });

      expect(messages).toHaveLength(5);
    });

    it("应该生成不同 ID 的弹幕", () => {
      const generator = new DanmakuGenerator({
        textPool: mockTextPool,
      });

      const messages = generator.generateBatch({
        count: 10,
        type: "sidebar",
      });

      const ids = messages.map(m => m.id);
      const uniqueIds = new Set(ids);

      expect(uniqueIds.size).toBe(ids.length);
    });

    it("应该支持覆盖主题配置", () => {
      const generator = new DanmakuGenerator({
        theme: "dongzhu",
        textPool: mockTextPool,
      });

      const messages = generator.generateBatch({
        count: 3,
        type: "sidebar",
        theme: "blood",
      });

      expect(messages).toHaveLength(3);
    });

    it("应该支持时间范围生成", () => {
      const generator = new DanmakuGenerator({
        textPool: mockTextPool,
      });

      const messages = generator.generateBatch({
        count: 5,
        type: "sidebar",
        timeRangeStart: 0,
        timeRangeEnd: 10000,
      });

      expect(messages).toHaveLength(5);
      expect(messages[0].timestamp).toBeDefined();
    });

    it("应该支持随机颜色", () => {
      const generator = new DanmakuGenerator({
        theme: "blood",
        textPool: mockTextPool,
        randomColor: false,
      });

      const messages = generator.generateBatch({
        count: 5,
        type: "sidebar",
        randomColor: true,
      });

      expect(messages).toHaveLength(5);
    });

    it("应该支持随机尺寸", () => {
      const generator = new DanmakuGenerator({
        textPool: mockTextPool,
        randomSize: false,
      });

      const messages = generator.generateBatch({
        count: 5,
        type: "sidebar",
        randomSize: true,
      });

      expect(messages).toHaveLength(5);
    });

    it("应该为横向弹幕生成位置信息", () => {
      const generator = new DanmakuGenerator({
        textPool: mockTextPool,
      });

      const messages = generator.generateBatch({
        count: 5,
        type: "horizontal",
      });

      messages.forEach(message => {
        expect(message).toHaveProperty("top");
        expect(message).toHaveProperty("delay");
        expect(message).toHaveProperty("duration");
      });
    });

    it("批量生成后应该恢复原始配置", () => {
      const generator = new DanmakuGenerator({
        theme: "dongzhu",
        textPool: mockTextPool,
        danmakuType: "sidebar",
        randomColor: false,
        randomSize: false,
      });

      generator.generateBatch({
        count: 3,
        type: "horizontal",
        theme: "blood",
        randomColor: true,
        randomSize: true,
      });

      const message = generator.generateMessage(0);
      expect(message).toBeDefined();
    });
  });

  describe("边缘情况", () => {
    it("应该处理空用户池", () => {
      const generator = new DanmakuGenerator({
        textPool: mockTextPool,
        users: [],
      });

      const message = generator.generateMessage(0);
      expect(message.userId).toBeUndefined();
    });

    it("应该处理只有一个用户的用户池", () => {
      const generator = new DanmakuGenerator({
        textPool: mockTextPool,
        users: [mockUsers[0]],
      });

      const message = generator.generateMessage(0);
      expect(message.userId).toBe("user1");
    });

    it("应该处理 count 为 0 的批量生成", () => {
      const generator = new DanmakuGenerator({
        textPool: mockTextPool,
      });

      const messages = generator.generateBatch({
        count: 0,
        type: "sidebar",
      });

      expect(messages).toHaveLength(0);
    });

    it("应该处理大量弹幕生成", () => {
      const generator = new DanmakuGenerator({
        textPool: mockTextPool,
      });

      const messages = generator.generateBatch({
        count: 100,
        type: "sidebar",
      });

      expect(messages).toHaveLength(100);
    });
  });
});

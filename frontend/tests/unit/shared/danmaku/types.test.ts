import type {
  DanmakuMessage,
  DanmakuUser,
  DanmakuPoolConfig,
  DanmakuTheme,
  DanmakuSize,
  DanmakuType,
  BatchOptions,
  UseDanmakuConfig,
  GeneratorConfig,
  ColorType,
} from "@/shared/danmaku/types";

describe("Danmaku Types", () => {
  describe("DanmakuMessage", () => {
    it("应该能正确创建完整的 DanmakuMessage 对象", () => {
      const message: DanmakuMessage = {
        id: "msg-001",
        text: "这是一条测试弹幕",
        color: "#FF5722",
        size: "medium",
        userId: "user-123",
        userName: "测试用户",
        userAvatar: "https://example.com/avatar.jpg",
        timestamp: String(Date.now()),
        top: 0.5,
        delay: 1000,
        duration: 5000,
      };

      expect(message.id).toBe("msg-001");
      expect(message.text).toBe("这是一条测试弹幕");
      expect(message.color).toBe("#FF5722");
      expect(message.size).toBe("medium");
      expect(message.userId).toBe("user-123");
      expect(message.userName).toBe("测试用户");
      expect(message.top).toBe(0.5);
    });

    it("应该支持不同的尺寸类型", () => {
      const smallMessage: DanmakuMessage = {
        id: "1",
        text: "小弹幕",
        color: "#000",
        size: "small",
        userId: "u1",
        userName: "user1",
        userAvatar: "",
        timestamp: "0",
        top: 0,
        delay: 0,
        duration: 0,
      };

      const largeMessage: DanmakuMessage = {
        id: "2",
        text: "大弹幕",
        color: "#000",
        size: "large",
        userId: "u2",
        userName: "user2",
        userAvatar: "",
        timestamp: "0",
        top: 0,
        delay: 0,
        duration: 0,
      };

      expect(smallMessage.size).toBe("small");
      expect(largeMessage.size).toBe("large");
    });
  });

  describe("DanmakuUser", () => {
    it("应该能正确创建 DanmakuUser 对象", () => {
      const user: DanmakuUser = {
        id: "user-456",
        name: "高级用户",
        avatar: "https://example.com/user-avatar.png",
        level: 10,
        badge: ["vip", "creator", "moderator"],
      };

      expect(user.id).toBe("user-456");
      expect(user.name).toBe("高级用户");
      expect(user.level).toBe(10);
      expect(user.badge).toHaveLength(3);
      expect(user.badge).toContain("vip");
    });

    it("应该支持空徽章列表", () => {
      const newUser: DanmakuUser = {
        id: "user-789",
        name: "新用户",
        avatar: "",
        level: 1,
        badge: [],
      };

      expect(newUser.badge).toHaveLength(0);
    });
  });

  describe("DanmakuPoolConfig", () => {
    it("应该能正确创建弹幕池配置对象", () => {
      const config: DanmakuPoolConfig = {
        maxCapacity: 1000,
        displaySpeed: 100,
        enableMerge: true,
        enableFilter: true,
        trackCount: 10,
        opacity: 0.8,
      };

      expect(config.maxCapacity).toBe(1000);
      expect(config.displaySpeed).toBe(100);
      expect(config.enableMerge).toBe(true);
      expect(config.enableFilter).toBe(true);
      expect(config.trackCount).toBe(10);
      expect(config.opacity).toBe(0.8);
    });

    it("应该支持透明度范围验证", () => {
      const validConfig: DanmakuPoolConfig = {
        maxCapacity: 500,
        displaySpeed: 200,
        enableMerge: false,
        enableFilter: false,
        trackCount: 5,
        opacity: 1.0,
      };

      expect(validConfig.opacity).toBeLessThanOrEqual(1);
      expect(validConfig.opacity).toBeGreaterThanOrEqual(0);
    });
  });

  describe("DanmakuTheme", () => {
    it("应该支持所有预定义的主题类型", () => {
      const themes: DanmakuTheme[] = ["blood", "mix", "dongzhu", "kaige", "tiger", "sweet"];

      themes.forEach(theme => {
        expect(["blood", "mix", "dongzhu", "kaige", "tiger", "sweet"]).toContain(theme);
      });
    });

    it("应该能正确使用主题类型", () => {
      const theme: DanmakuTheme = "sweet";
      expect(theme).toBe("sweet");
    });
  });

  describe("DanmakuSize", () => {
    it("应该支持所有预定义的尺寸类型", () => {
      const sizes: DanmakuSize[] = ["small", "medium", "large"];

      expect(sizes).toHaveLength(3);
      expect(sizes).toContain("small");
      expect(sizes).toContain("medium");
      expect(sizes).toContain("large");
    });

    it("应该能正确使用尺寸类型", () => {
      const size: DanmakuSize = "large";
      expect(size).toBe("large");
    });
  });

  describe("DanmakuType", () => {
    it("应该支持所有预定义的弹幕类型", () => {
      const types: DanmakuType[] = ["sidebar", "horizontal"];

      expect(types).toHaveLength(2);
    });

    it("应该能正确使用弹幕类型", () => {
      const sidebarType: DanmakuType = "sidebar";
      const horizontalType: DanmakuType = "horizontal";

      expect(sidebarType).toBe("sidebar");
      expect(horizontalType).toBe("horizontal");
    });
  });

  describe("BatchOptions", () => {
    it("应该能创建完整的批量生成选项", () => {
      const options: BatchOptions = {
        count: 100,
        type: "horizontal",
        theme: "mix",
        timeRangeStart: 0,
        timeRangeEnd: 60000,
        randomColor: true,
        randomSize: true,
      };

      expect(options.count).toBe(100);
      expect(options.type).toBe("horizontal");
      expect(options.theme).toBe("mix");
      expect(options.randomColor).toBe(true);
      expect(options.randomSize).toBe(true);
    });

    it("应该支持可选参数", () => {
      const minimalOptions: BatchOptions = {
        count: 50,
        type: "sidebar",
      };

      expect(minimalOptions.count).toBe(50);
      expect(minimalOptions.type).toBe("sidebar");
      expect(minimalOptions.theme).toBeUndefined();
    });
  });

  describe("UseDanmakuConfig", () => {
    it("应该能创建完整的 Hook 配置", () => {
      const config: UseDanmakuConfig = {
        poolConfig: {
          maxCapacity: 500,
          displaySpeed: 150,
          enableMerge: true,
          enableFilter: false,
          trackCount: 8,
          opacity: 0.9,
        },
        defaultTheme: "blood",
        defaultSize: "medium",
        autoPlay: true,
        loop: false,
        danmakuType: "horizontal",
      };

      expect(config.poolConfig).toBeDefined();
      expect(config.poolConfig?.maxCapacity).toBe(500);
      expect(config.defaultTheme).toBe("blood");
      expect(config.defaultSize).toBe("medium");
      expect(config.autoPlay).toBe(true);
      expect(config.loop).toBe(false);
    });

    it("应该支持空配置", () => {
      const emptyConfig: UseDanmakuConfig = {};

      expect(emptyConfig.poolConfig).toBeUndefined();
      expect(emptyConfig.defaultTheme).toBeUndefined();
      expect(emptyConfig.autoPlay).toBeUndefined();
    });
  });

  describe("GeneratorConfig", () => {
    it("应该能创建完整的生成器配置", () => {
      const config: GeneratorConfig = {
        videoDuration: 300000, // 5 分钟
        density: 2, // 每秒 2 条
        theme: "tiger",
        colorType: "primary",
        minInterval: 500,
        maxInterval: 2000,
      };

      expect(config.videoDuration).toBe(300000);
      expect(config.density).toBe(2);
      expect(config.theme).toBe("tiger");
      expect(config.colorType).toBe("primary");
      expect(config.minInterval).toBe(500);
      expect(config.maxInterval).toBe(2000);
    });

    it("应该只要求必需参数", () => {
      const minimalConfig: GeneratorConfig = {
        videoDuration: 120000,
        density: 1,
      };

      expect(minimalConfig.videoDuration).toBe(120000);
      expect(minimalConfig.density).toBe(1);
      expect(minimalConfig.theme).toBeUndefined();
      expect(minimalConfig.colorType).toBeUndefined();
    });
  });

  describe("ColorType", () => {
    it("应该支持所有预定义的颜色类型", () => {
      const colors: ColorType[] = ["primary", "secondary", "accent"];

      expect(colors).toHaveLength(3);
    });

    it("应该能正确使用颜色类型", () => {
      const primary: ColorType = "primary";
      const secondary: ColorType = "secondary";
      const accent: ColorType = "accent";

      expect(primary).toBe("primary");
      expect(secondary).toBe("secondary");
      expect(accent).toBe("accent");
    });
  });

  describe("类型组合使用", () => {
    it("应该能组合多个类型创建复杂配置", () => {
      const complexConfig: {
        generator: GeneratorConfig;
        batch: BatchOptions;
        hook: UseDanmakuConfig;
      } = {
        generator: {
          videoDuration: 600000,
          density: 3,
          theme: "dongzhu",
          colorType: "accent",
        },
        batch: {
          count: 200,
          type: "horizontal",
          theme: "dongzhu",
          randomColor: true,
          randomSize: false,
        },
        hook: {
          defaultTheme: "dongzhu",
          defaultSize: "large",
          autoPlay: true,
          loop: true,
          danmakuType: "horizontal",
        },
      };

      expect(complexConfig.generator.theme).toBe("dongzhu");
      expect(complexConfig.batch.type).toBe("horizontal");
      expect(complexConfig.hook.defaultSize).toBe("large");
      expect(complexConfig.hook.loop).toBe(true);
    });

    it("应该能创建弹幕消息数组", () => {
      const messages: DanmakuMessage[] = [
        {
          id: "1",
          text: "弹幕 1",
          color: "#FF0000",
          size: "small",
          userId: "u1",
          userName: "用户 1",
          userAvatar: "",
          timestamp: "1000",
          top: 0.1,
          delay: 0,
          duration: 5000,
        },
        {
          id: "2",
          text: "弹幕 2",
          color: "#00FF00",
          size: "medium",
          userId: "u2",
          userName: "用户 2",
          userAvatar: "",
          timestamp: "2000",
          top: 0.3,
          delay: 500,
          duration: 5000,
        },
        {
          id: "3",
          text: "弹幕 3",
          color: "#0000FF",
          size: "large",
          userId: "u3",
          userName: "用户 3",
          userAvatar: "",
          timestamp: "3000",
          top: 0.5,
          delay: 1000,
          duration: 5000,
        },
      ];

      expect(messages).toHaveLength(3);
      expect(messages.map(m => m.size)).toEqual(["small", "medium", "large"]);
    });
  });
});

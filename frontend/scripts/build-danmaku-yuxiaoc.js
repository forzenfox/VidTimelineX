import fs from "fs";
import path from "path";

// 获取当前模块的目录路径（ESM 兼容方式）
const __filename = new URL(import.meta.url).pathname;
const __dirname = path.dirname(__filename);

// 修复 Windows 路径问题
const normalizedDirname = __dirname.replace(/^\//, "").replace(/\//g, "\\");

// 弹幕类型权重配置
const danmakuTypeWeights = {
  normal: 70, // 70% 概率
  highlight: 20, // 20% 概率
  super: 10, // 10% 概率
};

// 血怒主题颜色配置 - 红色系
const bloodDanmakuColors = {
  primary: "#E11D48", // 玫瑰红
  secondary: "#DC2626", // 深红
  accent: "#F87171", // 浅红
  highlight: "#FBBF24", // 琥珀黄
  super: "#F59E0B", // 橙色
};

// 混躺主题颜色配置 - 蓝/绿/琥珀色系
const mixDanmakuColors = {
  primary: "#F59E0B", // 琥珀色
  secondary: "#3B82F6", // 蓝色
  accent: "#10B981", // 绿色
  highlight: "#7C3AED", // 紫色
  super: "#EC4899", // 粉色
};

// 公共弹幕颜色
const commonDanmakuColors = ["#6B7280", "#8B5CF6", "#EC4899", "#10B981", "#3B82F6"];

/**
 * 随机分配弹幕类型
 * @returns 随机弹幕类型
 */
function getRandomDanmakuType() {
  const totalWeight = Object.values(danmakuTypeWeights).reduce((sum, weight) => sum + weight, 0);
  let random = Math.random() * totalWeight;

  for (const [type, weight] of Object.entries(danmakuTypeWeights)) {
    random -= weight;
    if (random <= 0) {
      return type;
    }
  }

  return "normal";
}

/**
 * 获取主题对应的弹幕颜色
 * @param theme 主题
 * @param type 弹幕类型
 * @returns 颜色值
 */
function getDanmakuColor(theme, type = "normal") {
  const colors = theme === "blood" ? bloodDanmakuColors : mixDanmakuColors;

  switch (type) {
    case "super":
      return colors.super;
    case "highlight":
      return colors.highlight;
    default:
      const normalColors = [colors.primary, colors.secondary, colors.accent];
      return normalColors[Math.floor(Math.random() * normalColors.length)];
  }
}

/**
 * 获取公共弹幕颜色
 * @returns 随机公共颜色
 */
function getCommonDanmakuColor() {
  return commonDanmakuColors[Math.floor(Math.random() * commonDanmakuColors.length)];
}

/**
 * 处理弹幕数据
 * 融合用户数据和弹幕数据，生成 processed 文件
 */
function processDanmakuData() {
  try {
    // 定义文件路径
    const dataDir = path.join(normalizedDirname, "../src/features/yuxiaoc/data");
    const danmakuPath = path.join(dataDir, "danmaku.json");
    const usersPath = path.join(dataDir, "users.json");
    const outputPath = path.join(dataDir, "danmaku-processed.json");

    // 读取弹幕数据
    console.log("Reading danmaku.json file...");
    const danmakuContent = fs.readFileSync(danmakuPath, "utf-8");
    const danmakuData = JSON.parse(danmakuContent);

    // 读取用户数据
    console.log("Reading users.json file...");
    const usersContent = fs.readFileSync(usersPath, "utf-8");
    const usersData = JSON.parse(usersContent);

    // 合并所有弹幕
    const allDanmaku = [
      ...danmakuData.bloodDanmaku.map((text) => ({ text, theme: "blood" })),
      ...danmakuData.mixDanmaku.map((text) => ({ text, theme: "mix" })),
      ...danmakuData.commonDanmaku.map((text) => ({ text, theme: "common" })),
    ];

    console.log(`Found ${allDanmaku.length} danmaku items`);
    console.log(`Found ${usersData.length} users`);

    // 处理每条弹幕，融合用户信息
    const processedDanmaku = allDanmaku.map((item, index) => {
      // 生成唯一id
      const id = `danmu-${index}`;

      // 随机分配用户
      const user = usersData[index % usersData.length];

      // 随机分配弹幕类型
      const type = getRandomDanmakuType();

      // 根据主题获取颜色
      let color;
      if (item.theme === "common") {
        color = getCommonDanmakuColor();
      } else {
        color = getDanmakuColor(item.theme, type);
      }

      // 随机分配速度 (6-14秒)
      const duration = 6 + Math.random() * 8;

      return {
        id,
        text: item.text,
        theme: item.theme,
        type,
        color,
        duration: Math.round(duration * 100) / 100, // 保留2位小数
        user: {
          id: user.id,
          name: user.name,
          avatar: user.avatar,
        },
      };
    });

    // 写入处理后的数据
    console.log("Writing processed data to danmaku-processed.json...");
    fs.writeFileSync(outputPath, JSON.stringify(processedDanmaku, null, 2));

    console.log(`✅ Processed ${processedDanmaku.length} danmaku items successfully!`);
    console.log(`Output saved to: ${outputPath}`);

    // 统计信息
    const bloodCount = processedDanmaku.filter((d) => d.theme === "blood").length;
    const mixCount = processedDanmaku.filter((d) => d.theme === "mix").length;
    const commonCount = processedDanmaku.filter((d) => d.theme === "common").length;
    console.log(`\nTheme distribution:`);
    console.log(`  - Blood: ${bloodCount}`);
    console.log(`  - Mix: ${mixCount}`);
    console.log(`  - Common: ${commonCount}`);
  } catch (error) {
    console.error("❌ Error processing danmaku data:", error);
    process.exit(1);
  }
}

// 执行处理
processDanmakuData();

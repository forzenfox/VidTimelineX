const fs = require('fs');
const path = require('path');

// 弹幕类型权重配置
const danmakuTypeWeights = {
  normal: 60, // 60% 概率
  gift: 20,   // 20% 概率
  super: 20,  // 20% 概率
};

// super类型弹幕颜色配置
const superDanmakuColors = {
  // 老虎主题：橙色调为主
  tiger: [
    "rgb(255, 95, 0)", // 亮橙色
    "rgb(255, 215, 0)", // 金黄色
    "rgb(255, 165, 0)", // 橙色
    "rgb(255, 140, 0)", // 深橙色
    "rgb(255, 190, 40)", // 浅橙色
  ],
  // 甜筒主题：粉色调为主
  sweet: [
    "rgb(255, 140, 180)", // 浅粉色
    "rgb(255, 192, 203)", // 淡粉色
    "rgb(255, 105, 180)", // 亮粉色
    "rgb(255, 127, 80)", // 珊瑚色
    "rgb(255, 20, 147)", // 深粉色
  ],
};

/**
 * 随机分配弹幕类型
 * @returns 随机弹幕类型
 */
function getRandomDanmakuType() {
  // 计算总权重
  const totalWeight = Object.values(danmakuTypeWeights).reduce((sum, weight) => sum + weight, 0);
  
  // 生成随机数
  let random = Math.random() * totalWeight;
  
  // 根据权重分配类型
  for (const [type, weight] of Object.entries(danmakuTypeWeights)) {
    random -= weight;
    if (random <= 0) {
      return type;
    }
  }
  
  // 默认返回normal类型
  return "normal";
}

/**
 * 获取随机的super弹幕颜色
 * @param theme 当前主题
 * @returns 随机颜色值
 */
function getRandomSuperDanmakuColor(theme) {
  const colors = superDanmakuColors[theme];
  const randomIndex = Math.floor(Math.random() * colors.length);
  return colors[randomIndex];
}

/**
 * 处理弹幕数据
 */
function processDanmakuData() {
  try {
    // 定义文件路径
    const txtFilePath = path.join(__dirname, '../src/features/tiantong/data/danmaku.txt');
    const outputPath = path.join(__dirname, '../src/features/tiantong/data/danmaku-processed.json');
    
    // 读取txt文件内容
    console.log('Reading danmaku.txt file...');
    const txtContent = fs.readFileSync(txtFilePath, 'utf-8');
    
    // 按行分割，过滤空行
    const lines = txtContent.split('\n').filter(line => line.trim() !== '');
    console.log(`Found ${lines.length} lines in danmaku.txt`);
    
    // 处理每条弹幕
    const processedDanmaku = lines.map((text, index) => {
      // 生成唯一id
      const id = `danmu-${index}`;
      
      // 生成随机类型
      const type = getRandomDanmakuType();
      
      // 生成颜色配置
      const colors = {
        tiger: "",
        sweet: ""
      };
      
      // 对super类型弹幕，为每个主题生成随机颜色
      if (type === 'super') {
        colors.tiger = getRandomSuperDanmakuColor('tiger');
        colors.sweet = getRandomSuperDanmakuColor('sweet');
      }
      
      return {
        id,
        text,
        type,
        colors
      };
    });
    
    // 写入处理后的数据
    console.log('Writing processed data to danmaku-processed.json...');
    fs.writeFileSync(outputPath, JSON.stringify(processedDanmaku, null, 2));
    
    console.log(`✅ Processed ${processedDanmaku.length} danmaku items successfully!`);
    console.log(`Output saved to: ${outputPath}`);
    
  } catch (error) {
    console.error('❌ Error processing danmaku data:', error);
    process.exit(1);
  }
}

// 执行处理
processDanmakuData();

// 从文件导入数据
import videosData from "./videos.json";
import usersData from "./users.json";
import { getRandomDanmakuType } from "./danmakuColors";

// 直接导入txt文件内容
const danmuText = "欢迎来到直播间！\n主播好厉害！\n哈哈哈哈笑死我了\n这个操作太秀了\n主播加油！\n这个游戏我也在玩\n能不能教一下这个技巧\n主播声音好好听\n什么时候再直播？\n支持主播！";

// 处理弹幕数据，添加随机类型和id
const processDanmuData = (text: string) => {
  // 按行分割文本
  const lines = text.split('\n').filter(line => line.trim() !== '');
  
  // 为每条弹幕添加随机类型和id
  return lines.map((text, index) => ({
    id: `danmu-${index}-${Date.now()}`,
    text,
    type: getRandomDanmakuType()
  }));
};

// 导出数据
export * from "./types";
export const videos = videosData;
export const danmuPool = processDanmuData(danmuText);
export const users = usersData;

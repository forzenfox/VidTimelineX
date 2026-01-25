export interface Video {
  id: string;
  title: string;
  date: string;
  bvid: string;
  cover: string;
  tags: string[];
  duration: string;
}

export interface Danmu {
  id: string;
  text: string;
  type: "normal" | "gift" | "super";
  user?: string;
  color?: string;
}

export const videos: Video[] = [
  {
    id: "1",
    title: "【亿口甜筒】霸总变身小猫咪？这反差谁顶得住！",
    date: "2023-10-15",
    bvid: "BV1xx411c7mD",
    cover: "https://images.unsplash.com/photo-1533738363-b7f9aef128ce?w=800&q=80",
    tags: ["反差萌", "搞笑"],
    duration: "10:30",
  },
  {
    id: "2",
    title: "224团播高光：狮子座的胜负欲燃起来了！",
    date: "2023-11-02",
    bvid: "BV1yy4y1B7Mm",
    cover: "https://images.unsplash.com/photo-1517030335964-65ad7b05397d?w=800&q=80",
    tags: ["团播", "高光时刻"],
    duration: "15:20",
  },
  {
    id: "3",
    title: "冬日恋歌 Cover - 甜度满分预警",
    date: "2023-12-24",
    bvid: "BV1zz4y1e7KL",
    cover: "https://images.unsplash.com/photo-1516280440614-6697288d5d38?w=800&q=80",
    tags: ["唱歌", "冬日恋歌"],
    duration: "5:45",
  },
  {
    id: "4",
    title: "极乐净土 舞蹈纯享版",
    date: "2024-01-10",
    bvid: "BV1xx411c7mE",
    cover: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=800&q=80",
    tags: ["舞蹈", "极乐净土"],
    duration: "4:30",
  },
  {
    id: "5",
    title: "直播间读粉丝来信，感动落泪...",
    date: "2024-02-14",
    bvid: "BV1yy4y1B7Mn",
    cover: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=800&q=80",
    tags: ["日常", "感动"],
    duration: "12:15",
  },
  {
    id: "6",
    title: "挑战三分钟不笑，结果一秒破功",
    date: "2024-03-01",
    bvid: "BV1zz4y1e7KM",
    cover: "https://images.unsplash.com/photo-1453728013993-6d66e9c9123a?w=800&q=80",
    tags: ["搞笑", "挑战"],
    duration: "8:45",
  },
];

export const danmuPool: Danmu[] = [
  { id: "1", text: "霸总虎来巡山了！🦁️", type: "super", color: "rgb(255, 95, 0)" },
  { id: "2", text: "甜筒今天有点甜🍦", type: "normal" },
  { id: "3", text: "224大军前来报到！", type: "normal" },
  { id: "4", text: "这是什么绝世反差萌啊awsl", type: "gift", color: "rgb(255, 0, 100)" },
  { id: "5", text: "主播房间号 12195609 关注不迷路", type: "super", color: "rgb(255, 215, 0)" },
  { id: "6", text: "瑞哥哥大气！", type: "gift" },
  { id: "7", text: "为了甜筒，冲鸭！", type: "normal" },
  { id: "8", text: "狮子座的光芒无法掩盖✨", type: "normal" },
  { id: "9", text: "今天也是元气满满的一天", type: "normal" },
  { id: "10", text: "这个wink我承包了😉", type: "super", color: "rgb(255, 95, 0)" },
  { id: "11", text: "哈哈哈笑死我了", type: "normal" },
  { id: "12", text: "亿口甜筒，入股不亏", type: "normal" },
  { id: "13", text: "好听好听耳朵怀孕了🎵", type: "gift" },
  { id: "14", text: "这波操作666", type: "normal" },
  { id: "15", text: "守护最好的甜筒", type: "super", color: "rgb(255, 192, 203)" },
  { id: "16", text: "什么时候播户外呀？", type: "normal" },
  { id: "17", text: "这就是心动的感觉吗💖", type: "gift" },
  { id: "18", text: "霸总气质拿捏得死死的", type: "normal" },
  { id: "19", text: "小老虎发威了🐯", type: "normal" },
  { id: "20", text: "224团魂炸裂！", type: "super", color: "rgb(255, 215, 0)" },
];

export * from "./types";

import type { Video, Danmaku, Title, CVoice, CanteenCategory } from "./types";

// 视频数据
export const videos: Video[] = [
  {
    id: "1",
    bvid: "BV1xx411c7mD",
    title: "【余小C】无情铁手！这波操作你打几分？",
    cover: "/thumbs/BV1xx411c7mD.webp",
    duration: "05:23",
    category: "hardcore",
    tags: ["血怒", "高光", "诺手"],
    description: "C皇血怒时刻，无情铁手拿下五杀",
  },
  {
    id: "2",
    bvid: "BV1yy411c7mE",
    title: "【余小C】这波啊，这波是下饭操作",
    cover: "/thumbs/BV1yy411c7mE.webp",
    duration: "03:45",
    category: "main",
    subCategory: "fried",
    tags: ["下饭", "炒饭", "混"],
    description: "经典下饭操作，观众直呼吃饱了",
  },
  {
    id: "3",
    bvid: "BV1zz411c7mF",
    title: "【余小C】A就完事了！",
    cover: "/thumbs/BV1zz411c7mF.webp",
    duration: "02:18",
    category: "hardcore",
    tags: ["A就完事了", "经典", "血C"],
    description: "C皇经典语录时刻",
  },
  {
    id: "4",
    bvid: "BV1aa411c7mG",
    title: "【余小C】混与躺轮回不止",
    cover: "/thumbs/BV1aa411c7mG.webp",
    duration: "08:12",
    category: "soup",
    tags: ["哲学", "混躺", "名言"],
    description: "C皇哲学时刻，混与躺的辩证关系",
  },
  {
    id: "5",
    bvid: "BV1bb411c7mH",
    title: "【余小C】致残打击！",
    cover: "/thumbs/BV1bb411c7mH.webp",
    duration: "04:33",
    category: "hardcore",
    tags: ["致残打击", "技能", "血怒"],
    description: "致残打击精准命中",
  },
  {
    id: "6",
    bvid: "BV1cc411c7mI",
    title: "【余小C】这把混，下把躺",
    cover: "/thumbs/BV1cc411c7mI.webp",
    duration: "06:47",
    category: "main",
    subCategory: "mixed",
    tags: ["混", "躺", "哲学"],
    description: "C皇混躺哲学经典演绎",
  },
];

// 弹幕数据
export const danmakuList: Danmaku[] = [
  { id: "1", text: "C皇！", color: "#E11D48", size: "large", speed: "normal" },
  { id: "2", text: "饱了饱了", color: "#F59E0B", size: "medium", speed: "fast" },
  { id: "3", text: "离谱", color: "#3B82F6", size: "medium", speed: "normal" },
  { id: "4", text: "无情铁手！", color: "#E11D48", size: "large", speed: "slow" },
  { id: "5", text: "混与躺轮回不止", color: "#EAB308", size: "medium", speed: "normal" },
  { id: "6", text: "A就完事了", color: "#E11D48", size: "large", speed: "fast" },
  { id: "7", text: "致残打击！", color: "#E11D48", size: "large", speed: "normal" },
  { id: "8", text: "这把混", color: "#F59E0B", size: "medium", speed: "normal" },
  { id: "9", text: "下把躺", color: "#3B82F6", size: "medium", speed: "normal" },
  { id: "10", text: "血怒！", color: "#DC2626", size: "large", speed: "fast" },
  { id: "11", text: "C！", color: "#E11D48", size: "large", speed: "fast" },
  { id: "12", text: "塔下战神", color: "#EAB308", size: "medium", speed: "normal" },
];

// 称号数据
export const titles: Title[] = [
  { id: "1", name: "C皇", description: "核心尊称", color: "#E11D48" },
  { id: "2", name: "鳃皇", description: "经典梗", color: "#F59E0B" },
  { id: "3", name: "鱼酱", description: "鱼吧文化", color: "#3B82F6" },
  { id: "4", name: "反驴复鱼", description: "历史使命", color: "#E11D48" },
  { id: "5", name: "solo king", description: "单挑之王", color: "#EAB308" },
  { id: "6", name: "鱼人", description: "峡谷身份", color: "#3B82F6" },
  { id: "7", name: "峡谷第一混", description: "混学宗师", color: "#F59E0B" },
  { id: "8", name: "峡谷鬼见愁", description: "威慑力", color: "#DC2626" },
  { id: "9", name: "峡谷养爹人", description: "特殊技能", color: "#7C3AED" },
  { id: "10", name: "塔下战神", description: "防御专精", color: "#EAB308" },
  { id: "11", name: "塔之子", description: "守塔专家", color: "#3B82F6" },
];

// C言C语数据
export const cVoices: CVoice[] = [
  { id: "1", text: "无情铁手！", category: "skill" },
  { id: "2", text: "致残打击！", category: "skill" },
  { id: "3", text: "A就完事了！", category: "classic" },
  { id: "4", text: "混与躺轮回不止，这把混，下把躺", category: "philosophy" },
  { id: "5", text: "这把混", category: "philosophy" },
  { id: "6", text: "下把躺", category: "philosophy" },
  { id: "7", text: "血怒！", category: "skill" },
  { id: "8", text: "C！", category: "classic" },
];

// 食堂分类数据
export const canteenCategories: CanteenCategory[] = [
  {
    id: "hardcore",
    name: "硬核区",
    description: "血怒时刻，天神下凡",
    color: "#E11D48",
    icon: "sword",
  },
  {
    id: "main",
    name: "主食区",
    description: "下饭操作，吃饱为止",
    color: "#F59E0B",
    icon: "utensils",
  },
  {
    id: "soup",
    name: "汤肴区",
    description: "破防片段，汤鲜味美",
    color: "#3B82F6",
    icon: "soup",
  },
];

// 导出所有数据
export { videos as default };

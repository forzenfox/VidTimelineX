/**
 * 余小C页面类型定义
 */

// 主题类型
export type Theme = "blood" | "mix";

// 视频类型
export interface Video {
  id: string;
  bvid: string;
  title: string;
  cover: string;
  duration: string;
  category: "hardcore" | "main" | "soup";
  subCategory?: "fried" | "mixed" | "covered";
  tags: string[];
  description?: string;
  createdAt?: string;
}

// 弹幕类型
export interface Danmaku {
  id: string;
  text: string;
  color: string;
  size: "small" | "medium" | "large";
  speed: "slow" | "normal" | "fast";
}

// 称号类型
export interface Title {
  id: string;
  name: string;
  description: string;
  color: string;
  icon?: string;
}

// C言C语音频类型
export interface CVoice {
  id: string;
  text: string;
  audioUrl?: string;
  category: "skill" | "philosophy" | "classic";
}

// 轮回状态类型
export interface ReincarnationState {
  type: "blood" | "mix" | "lie";
  percentage: number;
  label: string;
}

// 食堂分类类型
export interface CanteenCategory {
  id: string;
  name: string;
  description: string;
  color: string;
  icon: string;
}

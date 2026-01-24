// 甜筒模块类型定义
import type { LucideIcon } from "lucide-react";

export interface Video {
  id: string;
  title: string;
  category: string;
  tags: string[];
  cover: string;
  date: string;
  views: string;
  icon: LucideIcon;
}

export interface Danmu {
  id: string;
  text: string;
  type: "normal" | "gift" | "super";
  user?: string;
  color?: string;
}

export interface Category {
  id: string;
  name: string;
  icon: LucideIcon;
}

export type Theme = "tiger" | "sweet";

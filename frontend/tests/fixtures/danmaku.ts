/**
 * 弹幕测试数据
 * 提供测试用的弹幕数据
 */

import type { Danmu } from "@/features/tiantong/data/types";

export const mockDanmaku: Danmu[] = [
  {
    id: "1",
    text: "欢迎来到老虎主题！",
    type: "normal",
    user: "user1",
    color: "#FF5F00"
  },
  {
    id: "2",
    text: "虎头咆哮！",
    type: "gift",
    user: "user2",
    color: "#FFBE28"
  },
  {
    id: "3",
    text: "老虎威武！",
    type: "super",
    user: "user3",
    color: "#FFFFFF"
  },
  {
    id: "4",
    text: "测试弹幕1",
    type: "normal",
    user: "user4",
    color: "#FF5F00"
  },
  {
    id: "5",
    text: "测试弹幕2",
    type: "gift",
    user: "user5",
    color: "#FFBE28"
  }
];

export const mockDanmu: Danmu = mockDanmaku[0];

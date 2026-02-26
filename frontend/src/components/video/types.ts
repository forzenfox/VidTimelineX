// 统一视频类型定义

// 主题类型
export type Theme = "tiger" | "sweet" | "blood" | "mix" | "dongzhu" | "kaige";

// 统一视频接口
export interface Video {
  id: string;
  title: string;
  date: string;
  videoUrl: string;
  bv: string; // 视频BV号（必填）
  cover: string;
  cover_url?: string; // B站CDN封面图URL（前端优先加载）
  tags: string[];
  duration: string;
  author?: string; // 视频作者（UP主）
  views?: number; // 播放量
}

// 视频卡片属性接口
export interface VideoCardProps {
  video: Video;
  onClick: (video: Video) => void;
  theme: Theme;
  /** 卡片索引，用于首屏图片优化 */
  index?: number;
  /** 卡片尺寸，默认 medium */
  size?: "small" | "medium" | "large" | "compact";
  /** 卡片布局，默认 horizontal */
  layout?: "horizontal" | "vertical";
  /** 自定义样式 */
  className?: string;
}

// 视频弹窗属性接口
export interface VideoModalProps {
  video: Video | null;
  onClose: () => void;
  theme: Theme;
  /** 自定义样式 */
  className?: string;
}

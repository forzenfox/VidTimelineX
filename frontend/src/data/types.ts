/**
 * 视频数据类型定义
 */
export interface Video {
  /** 视频唯一ID */
  id: string;
  /** 视频标题 */
  title: string;
  /** 视频描述 */
  description: string;
  /** 视频URL链接 */
  url: string;
  /** 视频缩略图URL */
  thumbnail: string;
  /** 视频发布日期 */
  date: string;
  /** 视频标签 */
  tags: string[];
}
/**
 * Video 类型测试 - TDD 方式
 * 测试新的 bv 和 author 字段
 */

import { Video } from '@/features/lvjiang/data/types';

describe('Video Type', () => {
  it('should require bv field', () => {
    const video: Video = {
      id: '1',
      title: '测试视频',
      date: '2026-02-04',
      videoUrl: 'https://www.bilibili.com/video/av116012955473501',
      bv: 'BV1XCffBPEj4',  // 必填字段
      cover: 'BV1XCffBPEj4.webp',
      tags: [],
      duration: '7:16'
    };
    expect(video.bv).toBeDefined();
    expect(video.bv).toBe('BV1XCffBPEj4');
  });

  it('should have optional author field', () => {
    const video: Video = {
      id: '1',
      title: '测试视频',
      date: '2026-02-04',
      videoUrl: 'https://www.bilibili.com/video/av116012955473501',
      bv: 'BV1XCffBPEj4',
      cover: 'BV1XCffBPEj4.webp',
      tags: [],
      duration: '7:16',
      author: '测试作者'  // 可选字段
    };
    expect(video.author).toBe('测试作者');
  });

  it('should work without author field', () => {
    const video: Video = {
      id: '1',
      title: '测试视频',
      date: '2026-02-04',
      videoUrl: 'https://www.bilibili.com/video/av116012955473501',
      bv: 'BV1XCffBPEj4',
      cover: 'BV1XCffBPEj4.webp',
      tags: [],
      duration: '7:16'
      // 没有 author 字段
    };
    expect(video.author).toBeUndefined();
  });

  it('should have optional cover_url field', () => {
    const video: Video = {
      id: '1',
      title: '测试视频',
      date: '2026-02-04',
      videoUrl: 'https://www.bilibili.com/video/av116012955473501',
      bv: 'BV1XCffBPEj4',
      cover: 'BV1XCffBPEj4.webp',
      cover_url: 'https://i2.hdslb.com/bfs/archive/test.jpg',
      tags: [],
      duration: '7:16'
    };
    expect(video.cover_url).toBeDefined();
  });

  it('should preserve backward compatibility with bvid field', () => {
    const video: Video = {
      id: '1',
      title: '测试视频',
      date: '2026-02-04',
      videoUrl: 'https://www.bilibili.com/video/av116012955473501',
      bv: 'BV1XCffBPEj4',
      bvid: 'BV1XCffBPEj4',  // 兼容旧字段
      cover: 'BV1XCffBPEj4.webp',
      tags: [],
      duration: '7:16'
    };
    expect(video.bvid).toBe('BV1XCffBPEj4');
  });
});

<template>
  <div class="app min-h-screen flex flex-col">
    <!-- 加载动画 -->
    <div class="loading-overlay fixed inset-0 bg-bg flex items-center justify-center z-50 animate-fadeOut">
      <div class="loading-animation w-15 h-15 border-4 border-light-brown border-t-4 border-ink-blue rounded-full animate-spin relative">
        <div class="loading-animation::before absolute inset-[-12px] border-4 border-light-cyan rounded-full opacity-30 animate-pulse"></div>
      </div>
    </div>
    
    <!-- 页面头部 -->
    <Header class="fade-in" />
    
    <!-- 主要内容 -->
    <main class="flex-1 container mx-auto max-w-[1100px] px-5 py-7 pb-20">
      <!-- 播放器占位符 -->
      <div id="player" class="player mb-7" aria-live="polite">
        <div class="placeholder flex items-center justify-center h-[280px] rounded-lg bg-gradient-to-br from-black/05 to-black/02 border-2 border-dashed border-gray-400 text-muted">
          点击任意卡片以播放视频（B站 iframe）
        </div>
      </div>
      
      <!-- 分隔线 -->
      <div class="ink-sep h-0.5 bg-gradient-to-r from-black/18 via-black/02 to-black/18 my-4.5 opacity-70 rounded"></div>
      
      <!-- 时光轴 -->
      <Timeline 
        :items="timelineData.events || []"
        @play="handlePlayVideo"
        @open-original="handleOpenOriginal"
      />
    </main>
    
    <!-- 页面底部 -->
    <Footer />
    
    <!-- 视频播放器 -->
    <VideoPlayer 
      :media="currentMedia"
      :autoplay="true"
      :is-open="isPlayerOpen"
      @close="closePlayer"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import Header from './components/Header.vue';
import Timeline from './components/Timeline.vue';
import VideoPlayer from './components/VideoPlayer.vue';
import Footer from './components/Footer.vue';
import axios from 'axios';

// 状态管理
const timelineData = ref({ events: [] });
const currentMedia = ref(null);
const isPlayerOpen = ref(false);

// 加载时光轴数据
async function loadTimelineData() {
  try {
    // 从public目录加载数据
    const response = await axios.get('/timeline.json');
    // 转换数据结构以匹配前端期望
    timelineData.value = {
      events: response.data.map(item => ({
        id: item.id,
        date: item.date,
        title: item.title,
        content: item.content,
        media: {
          bv: item.video?.bv,
          url: item.video?.url
        },
        thumbnail: item.thumbnail,
        views: item.views,
        danmaku: item.danmaku,
        up主: item.up主
      }))
    };
  } catch (error) {
    console.error('加载 timeline.json 失败:', error);
    // 添加错误处理，使用默认数据
    timelineData.value = {
      events: [
        {
          id: 1,
          date: "2026-01-21",
          title: "示例视频",
          content: "这是一个示例视频，用于测试时光轴功能",
          media: {
            bv: "1ZHiyBkExG",
            url: "https://www.bilibili.com/video/BV1ZHiyBkExG"
          },
          thumbnail: "//i1.hdslb.com/bfs/archive/57b7a6358b0a552852242e66d1610eada2ac61b6.jpg@100w_100h_1c.png",
          views: 1000000,
          danmaku: 10000,
          up主: "示例UP主"
        }
      ]
    };
  }
}

// 处理视频播放
function handlePlayVideo(item) {
  currentMedia.value = item.media;
  isPlayerOpen.value = true;
}

// 处理打开原始URL
function handleOpenOriginal(url) {
  if (url) {
    window.open(url, '_blank');
  }
}

// 关闭播放器
function closePlayer() {
  isPlayerOpen.value = false;
  currentMedia.value = null;
}

// 页面加载完成后初始化
onMounted(() => {
  loadTimelineData();
});
</script>

<style scoped>
/* 组件样式已通过Tailwind CSS实现 */
</style>
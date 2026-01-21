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
    // 尝试从相对路径获取数据
    const response = await axios.get('../data/timeline.json');
    timelineData.value = response.data;
  } catch (error) {
    console.error('加载 timeline.json 失败:', error);
    // 可以添加错误处理逻辑，如显示错误提示
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
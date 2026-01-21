<template>
  <div class="timeline-item flex items-center relative mb-7 gap-6 min-h-[140px]">
    <!-- 时间线点 -->
    <div class="timeline-point w-12 flex flex-col items-center justify-center cursor-pointer transition-all z-2 flex-shrink-0 absolute left-[-50px] top-1/2 -translate-y-1/2" 
         :style="{ animationDelay: `${index * 0.1}s` }"
         @click="scrollToItem">
      <div class="dot w-5.5 h-5.5 rounded-full bg-accent border-3 border-bg shadow-[0_2px_8px_var(--shadow-medium)] transition-all relative z-1" :class="{ 'inactive': !isActive }">
        <div class="dot::before absolute inset-0 rounded-full bg-light-cyan opacity-30 scale-0 transition-transform duration-400" :class="{ 'scale-100': isActive }"></div>
      </div>
      <div class="date-label text-xs text-light-brown font-medium whitespace-nowrap opacity-80 transition-opacity mt-1.5 text-center" @mouseenter="$event.target.style.opacity = '1'" @mouseleave="$event.target.style.opacity = '0.8'">
        {{ formatDate(item.start_date) }}
      </div>
    </div>
    
    <!-- 视频卡片 -->
    <VideoCard 
      :item="item" 
      :is-active="isActive"
      @play="playVideo"
      @open-original="openOriginalUrl"
      class="stagger-in"
      :style="{ animationDelay: `${index * 0.15}s` }"
    />
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';
import VideoCard from './VideoCard.vue';

const props = defineProps({
  item: {
    type: Object,
    required: true
  },
  index: {
    type: Number,
    required: true
  },
  isActive: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['play', 'open-original', 'scroll']);

// 格式化日期
function formatDate(sd) {
  if (!sd) return '';
  const y = sd.year || '';
  const m = sd.month ? ('0' + sd.month).slice(-2) : '';
  const d = sd.day ? ('0' + sd.day).slice(-2) : '';
  return [y, m, d].filter(Boolean).join('-');
}

// 滚动到当前项
function scrollToItem() {
  emit('scroll', props.index);
}

// 播放视频
function playVideo(item) {
  emit('play', item);
}

// 打开原始URL
function openOriginalUrl(url) {
  emit('open-original', url);
}
</script>

<style scoped>
.dot.inactive {
  background: var(--muted);
  opacity: 0.6;
}

.dot.inactive:hover {
  background: var(--light-brown);
  opacity: 1;
  transform: scale(1.1);
}

@media (max-width: 800px) {
  .timeline-point {
    width: 100%;
    height: 90px;
    justify-content: flex-start;
    padding-left: 18px;
  }
  
  .dot {
    margin-left: -8px;
  }
}
</style>
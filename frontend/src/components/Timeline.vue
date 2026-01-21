<template>
  <div class="timeline-container">
    <div class="layout flex flex-col relative">
      <div class="timeline-column" id="timeline-col" aria-hidden="false">
        <div class="timeline-line absolute left-[23px] top-0 bottom-0 w-1 bg-gradient-to-b from-ink-blue to-light-brown rounded-full shadow-[0_2px_4px_var(--shadow-light)] z-1"></div>
      </div>
      
      <div class="cards flex flex-col gap-7 pt-1.5 pl-[50px] relative">
        <TimelineItem 
          v-for="(item, index) in items" 
          :key="index"
          :item="item"
          :index="index"
          :is-active="activeIndex === index"
          @play="playVideo"
          @open-original="openOriginalUrl"
          @scroll="scrollToItem"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue';
import TimelineItem from './TimelineItem.vue';

const props = defineProps({
  items: {
    type: Array,
    required: true
  }
});

const emit = defineEmits(['play', 'open-original']);

const activeIndex = ref(0);

// 滚动到指定项
function scrollToItem(index) {
  activeIndex.value = index;
  const card = document.querySelector(`.timeline-item:nth-child(${index + 1})`);
  if (card) {
    const top = card.getBoundingClientRect().top + window.scrollY - 120;
    window.scrollTo({ top, behavior: 'smooth' });
    playVideo(props.items[index]);
  }
}

// 播放视频
function playVideo(item) {
  emit('play', item);
}

// 打开原始URL
function openOriginalUrl(url) {
  if (url) {
    window.open(url, '_blank');
  }
}
</script>

<style scoped>
@media (max-width: 800px) {
  .layout {
    grid-template-columns: 1fr;
    gap: 12px;
  }
  
  .timeline-column {
    order: 2;
    display: flex;
    justify-content: center;
  }
  
  .timeline-line {
    left: 50%;
    transform: translateX(-50%);
    width: 6px;
  }
  
  .cards {
    order: 1;
    gap: 18px;
  }
}
</style>
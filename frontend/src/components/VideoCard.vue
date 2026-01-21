<template>
  <article class="card flex gap-6 bg-gradient-to-br from-card-bg to-gray-100 rounded-xl shadow-[0_8px_20px_var(--shadow-light),0_2px_4px_var(--shadow-medium)] p-3.5 border-l-2 border-transparent transition-all hover:-translate-y-2 hover:rotate-[0.5deg] hover:shadow-[0_12px_28px_var(--shadow-medium),0_4px_8px_var(--shadow-heavy)] hover:border-l-light-brown min-h-[140px] relative overflow-hidden max-w-full" :class="{ 'active': isActive }">
    <div class="card::before absolute inset-0 border border-black/05 rounded-xl pointer-events-none"></div>
    
    <figure class="thumb w-48 max-w-[34%] bg-gradient-to-b from-black/04 to-black/02 rounded-lg flex items-center justify-center text-muted text-sm relative overflow-hidden transition-all border-4 border-black shadow-inner shadow-black/30">
      <div class="absolute top-0 left-0 right-0 h-2.5 bg-gradient-to-r from-black via-gray-700 to-black"></div>
      <div class="absolute bottom-0 left-0 right-0 h-2.5 bg-gradient-to-r from-black via-gray-700 to-black"></div>
      
      <img v-if="item.media && item.media.thumbnail" 
           :src="item.media.thumbnail" 
           :alt="item.text && item.text.headline ? item.text.headline : '缩略图'"
           class="w-full h-full object-cover transition-transform hover:scale-105"
      >
      <div v-else class="p-3 text-center">
        {{ item.media && item.media.type && item.media.type === 'mp4' ? '本地视频' : 'Bilibili 视频' }}
      </div>
      
      <div class="play-btn absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-black/60 flex items-center justify-center text-white border-2 border-white/08 shadow-[0_6px_18px_rgba(0,0,0,0.35)] opacity-0 hover:opacity-100 hover:scale-110 transition-all">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M5 3v18l15-9L5 3z" fill="#fff"/>
        </svg>
      </div>
    </figure>
    
    <div class="card-body flex-1 flex flex-col justify-between">
      <div class="meta text-muted text-sm mb-1">{{ formatDate(item.start_date) }}</div>
      <h3 class="headline text-accent text-lg font-bold mb-1.5 leading-tight">{{ item.text && item.text.headline ? item.text.headline : '无标题' }}</h3>
      <div class="description text-muted text-sm line-clamp-2">{{ item.text && item.text.text ? item.text.text : '' }}</div>
      <div class="card-actions mt-2.5 flex gap-3 items-center">
        <button class="btn px-3 py-2 rounded-lg bg-transparent border border-black/08 text-accent hover:bg-light-cyan hover:border-light-cyan hover:text-ink transition-all" @click.stop="playVideo">
          播放
        </button>
        <button class="btn px-3 py-2 rounded-lg bg-transparent border border-black/08 text-accent hover:bg-light-cyan hover:border-light-cyan hover:text-ink transition-all" @click.stop="openOriginalUrl">
          打开原页
        </button>
      </div>
    </div>
  </article>
</template>

<script setup>
const props = defineProps({
  item: {
    type: Object,
    required: true
  },
  isActive: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['play', 'open-original']);

// 格式化日期
function formatDate(sd) {
  if (!sd) return '';
  const y = sd.year || '';
  const m = sd.month ? ('0' + sd.month).slice(-2) : '';
  const d = sd.day ? ('0' + sd.day).slice(-2) : '';
  return [y, m, d].filter(Boolean).join('-');
}

// 播放视频
function playVideo() {
  emit('play', props.item);
}

// 打开原始URL
function openOriginalUrl() {
  emit('open-original', props.item.media.url);
}
</script>

<style scoped>
.card.active {
  border-left-color: var(--ink-blue);
  box-shadow: 0 14px 32px var(--shadow-medium), 0 6px 12px var(--shadow-heavy);
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

@media (max-width: 800px) {
  .card {
    flex-direction: column;
    transform: none !important;
    box-shadow: 0 6px 16px var(--shadow-light);
  }
  
  .card:hover {
    transform: translateY(-1.5px) !important;
  }
  
  .thumb {
    width: 100%;
    max-width: 100%;
    height: 180px;
  }
}
</style>
<template>
  <!-- 视频播放弹窗 -->
  <div id="player-modal" class="player-modal fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-5 backdrop-blur-sm" :class="{ 'active': isOpen }">
    <div class="modal-content relative w-full max-w-5xl max-h-[90vh] bg-white/05 rounded-lg shadow-2xl overflow-hidden border border-white/10">
      <button id="modal-close" class="modal-close absolute top-3 right-3 bg-white/10 border border-white/20 text-white text-2xl cursor-pointer p-2 rounded-full transition-all hover:bg-white/20 hover:scale-110 z-10">
        ×
      </button>
      <div id="modal-player" class="modal-player">
        <iframe
          v-if="media && media.url && isBilibiliUrl(media.url)"
          :src="getBilibiliEmbedUrl(media.url, autoplay)"
          width="100%"
          height="500"
          class="rounded-lg border-none block"
          :allow="'autoplay; fullscreen'"
          frameborder="0"
        ></iframe>
        <video
          v-else-if="media && media.url && isMp4Url(media.url)"
          :src="media.url"
          controls
          playsinline
          preload="metadata"
          class="w-full h-96 rounded-lg"
          :autoplay="autoplay"
        ></video>
        <div v-else-if="media && media.url"
             class="placeholder flex items-center justify-center h-96 rounded-lg border-2 border-dashed border-gray-400 bg-gradient-to-br from-gray-50 to-gray-100">
          <div class="text-center p-6">
            <p class="text-muted mb-4">无法解析视频链接</p>
            <button class="btn px-4 py-2 rounded-lg bg-transparent border border-black/08 text-accent hover:bg-light-cyan hover:border-light-cyan hover:text-ink transition-all" @click="openOriginalUrl">
              打开原页
            </button>
          </div>
        </div>
        <div v-else
             class="placeholder flex items-center justify-center h-96 rounded-lg border-2 border-dashed border-gray-400 bg-gradient-to-br from-gray-50 to-gray-100">
          <p class="text-muted">无媒体 URL</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  media: {
    type: Object,
    default: null
  },
  autoplay: {
    type: Boolean,
    default: false
  },
  isOpen: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['close']);

// 提取BVID
function extractBVID(url) {
  if (!url) return null;
  const bvidMatch = url.match(/(BV[0-9A-Za-z]+)/);
  if (bvidMatch) return bvidMatch[1];
  const avMatch = url.match(/av(\d+)/i);
  if (avMatch) return { av: avMatch[1] };
  return null;
}

// 检查是否是B站链接
function isBilibiliUrl(url) {
  return url.includes('bilibili.com');
}

// 检查是否是MP4链接
function isMp4Url(url) {
  return url.match(/\.mp4(\?.*)?$/i);
}

// 获取B站嵌入URL
function getBilibiliEmbedUrl(url, autoplay) {
  const b = extractBVID(url);
  if (b && typeof b === 'string') {
    return `https://player.bilibili.com/player.html?bvid=${encodeURIComponent(b)}&page=1${autoplay ? '&autoplay=1' : ''}`;
  } else if (b && b.av) {
    return `https://player.bilibili.com/player.html?aid=${encodeURIComponent(b.av)}${autoplay ? '&autoplay=1' : ''}`;
  }
  return url;
}

// 打开原始URL
function openOriginalUrl() {
  if (props.media && props.media.url) {
    window.open(props.media.url, '_blank');
  }
}

// 关闭弹窗
function closeModal() {
  emit('close');
}
</script>

<style scoped>
.player-modal {
  display: none;
}

.player-modal.active {
  display: flex;
}

@media (max-width: 800px) {
  .modal-content iframe,
  .modal-content video {
    height: 360px;
  }
}
</style>
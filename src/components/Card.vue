<template>
  <router-link 
    :to="{ name: 'Detail', params: { id: card.id } }" 
    class="scanner-gallery-item group block relative"
  >
    <div class="scanner-target-frame">
      <div class="scanner-target-corner scanner-target-corner-tl"></div>
      <div class="scanner-target-corner scanner-target-corner-tr"></div>
      <div class="scanner-target-corner scanner-target-corner-bl"></div>
      <div class="scanner-target-corner scanner-target-corner-br"></div>
      <div class="scanner-target-scanline"></div>
      <div class="scanner-target-bottom-bar"></div>
      <div class="scanner-target-pulse"></div>
    </div>

    <figure class="relative overflow-hidden">
      <img 
        :src="card.image || ''" 
        :alt="card.name" 
        class="w-full h-auto block transition-all duration-300 group-hover:brightness-110 group-hover:contrast-110 group-focus:brightness-110 group-focus:contrast-110"
        loading="lazy"
        decoding="async"
        @load="onImageLoad"
        @error="handleImageError"
        :class="{ 'opacity-0': !imageLoaded }"
      />
      
      <div v-if="!imageLoaded" class="absolute inset-0 flex items-center justify-center bg-scanner-panel scanner-image-placeholder">
        <div class="scanner-loader-mini">
          <div class="scanner-loader-mini-ring"></div>
          <div class="scanner-loader-mini-ring"></div>
          <div class="scanner-loader-mini-core"></div>
        </div>
      </div>
    </figure>
  </router-link>
</template>

<script setup>
import { ref } from 'vue';

defineProps(['card']);

const imageLoaded = ref(false);

function onImageLoad() {
  imageLoaded.value = true;
}

function handleImageError(e) {
  console.warn(`[Card] Image failed to load: ${e.target.src}`);
  imageLoaded.value = true;
  e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="280" viewBox="0 0 200 280"%3E%3Cdefs%3E%3ClinearGradient id="g" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" stop-color="%23f1f5f9"/%3E%3Cstop offset="100%25" stop-color="%23e2e8f0"/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect fill="url(%23g)" width="200" height="280" rx="4"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" fill="%230891b2" font-size="10" font-family="monospace"%3ENO SIGNAL%3C/text%3E%3C/svg%3E';
}
</script>

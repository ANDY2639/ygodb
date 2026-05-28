<template>
  <div v-if="loading" class="scanner-loading-status min-h-[400px]">
    <div class="scanner-loader">
      <div class="scanner-loader-ring"></div>
      <div class="scanner-loader-ring"></div>
      <div class="scanner-loader-ring"></div>
      <div class="scanner-loader-core"></div>
    </div>
    <span class="scanner-loading-label">RETRIEVING DATA</span>
  </div>

  <div v-if="!loading && card" class="scanner-card-frame rounded-lg bg-scanner-panel border border-scanner p-6">
    <div class="flex flex-col md:flex-row gap-6">
      <figure class="shrink-0 mx-auto md:mx-0">
        <img 
          :src="card.image || ''" 
          :alt="card.name" 
          class="rounded-lg max-w-64 w-full border border-scanner" 
          @error="handleImageError"
        />
      </figure>
      <div class="flex-1 space-y-4">
        <div>
          <h2 class="text-xl font-bold text-scanner font-mono mb-4">{{ card.name }}</h2>
          <div class="scanner-card-frame rounded-lg bg-scanner-card border border-scanner overflow-hidden">
            <h3 class="text-sm font-bold text-cyan-600 dark:text-cyan-400 text-center py-2 px-3 border-b border-scanner font-mono">INFORMATION</h3>
            <table class="table table-sm w-full">
              <template v-if="!['spell', 'trap'].includes(card.frameType)">
                <tr class="border-b border-scanner/50">
                  <td class="font-medium w-1/3 text-scanner-dim font-mono text-xs">ATTRIBUTE</td>
                  <td class="text-scanner font-mono text-sm">{{ card.attribute }}</td>
                </tr>
                <tr class="border-b border-scanner/50">
                  <td class="font-medium text-scanner-dim font-mono text-xs">TYPES</td>
                  <td class="text-scanner font-mono text-sm">{{ card.type }}</td>
                </tr>
                <tr v-if="card.level" class="border-b border-scanner/50">
                  <td class="font-medium text-scanner-dim font-mono text-xs">LEVEL</td>
                  <td class="text-scanner font-mono text-sm">{{ card.level }}</td>
                </tr>
                <tr v-if="card.linkval" class="border-b border-scanner/50">
                  <td class="font-medium text-scanner-dim font-mono text-xs">LINKVAL</td>
                  <td class="text-scanner font-mono text-sm">{{ card.linkval }}</td>
                </tr>
                <tr class="border-b border-scanner/50">
                  <td class="font-medium text-scanner-dim font-mono text-xs">ATK</td>
                  <td class="text-cyan-600 dark:text-cyan-400 font-mono text-sm font-bold">{{ card.atk }}</td>
                </tr>
                <tr v-if="card.def">
                  <td class="font-medium text-scanner-dim font-mono text-xs">DEF</td>
                  <td class="text-cyan-600 dark:text-cyan-400 font-mono text-sm font-bold">{{ card.def }}</td>
                </tr>
              </template>
              <template v-else>
                <tr>
                  <td class="font-medium w-1/3 text-scanner-dim font-mono text-xs">PROPERTY</td>
                  <td class="text-scanner font-mono text-sm">{{ card.race }}</td>
                </tr>
              </template>
            </table>
          </div>
        </div>
        <div class="scanner-card-frame rounded-lg bg-scanner-card border border-scanner overflow-hidden">
          <h3 class="text-sm font-bold text-cyan-600 dark:text-cyan-400 text-center py-2 px-3 border-b border-scanner font-mono">CARD INFO</h3>
          <div class="p-4 text-sm text-scanner whitespace-pre-line text-justify font-mono leading-relaxed" v-html="card.desc"></div>
        </div>
      </div>
    </div>
  </div>

  <div v-if="!loading && !card && !error" role="alert" class="scanner-card-frame rounded-lg bg-scanner-panel border border-scanner p-6">
    <div class="flex flex-col items-center gap-3">
      <div class="flex gap-1">
        <div class="w-1 h-4 bg-cyan-500/30 rounded signal-bar"></div>
        <div class="w-1 h-4 bg-cyan-500/30 rounded signal-bar"></div>
        <div class="w-1 h-4 bg-cyan-500/30 rounded signal-bar"></div>
        <div class="w-1 h-4 bg-cyan-500/30 rounded signal-bar"></div>
      </div>
      <span class="text-sm font-mono text-scanner-dim/60">NO DATA FOUND</span>
      <span class="text-xs font-mono text-scanner-dim/40">Card not found in database</span>
      <router-link :to="{ name: 'Home' }" class="btn btn-sm bg-cyan-500/10 border border-cyan-500/30 text-cyan-600 dark:text-cyan-400 hover:bg-cyan-500/20 font-mono text-xs">RETURN TO DATABASE</router-link>
    </div>
  </div>

  <div v-if="error" role="alert" class="scanner-card-frame rounded-lg bg-scanner-panel border border-red-500/30 p-4">
    <div class="flex items-center gap-3">
      <div class="w-2 h-2 rounded-full bg-red-500 pulse-dot"></div>
      <span class="text-sm font-mono text-red-500">SYSTEM ERROR</span>
    </div>
    <p class="text-xs font-mono text-scanner-dim/60 mt-2">{{ error }}</p>
    <button class="btn btn-sm mt-3 bg-red-500/10 border border-red-500/30 text-red-500 hover:bg-red-500/20 font-mono text-xs" @click="retryLoad">RETRY CONNECTION</button>
  </div>
</template>

<script setup>
import { onMounted, watch } from 'vue';
import useCardDetail from "@/composables/useCardDetail";

const { id } = defineProps(['id']);
const { card, error, loading, getCardDetail } = useCardDetail();

onMounted(() => {
  getCardDetail({ id });
});

watch(() => id, (newId) => {
  if (newId) {
    getCardDetail({ id: newId });
  }
});

function retryLoad() {
  getCardDetail({ id });
}

function handleImageError(e) {
  console.warn(`[CardDetail] Image failed to load: ${e.target.src}`);
  e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="280" viewBox="0 0 200 280"%3E%3Cdefs%3E%3ClinearGradient id="g" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" stop-color="%23f1f5f9"/%3E%3Cstop offset="100%25" stop-color="%23e2e8f0"/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect fill="url(%23g)" width="200" height="280" rx="8"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" fill="%230891b2" font-size="14"%3ENo Image%3C/text%3E%3C/svg%3E';
}
</script>

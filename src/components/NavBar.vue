<template>
  <div class="navbar bg-scanner-panel border-b border-scanner fixed top-0 z-50">
    <div class="container mx-auto px-4 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <router-link :to="{ name: 'Home' }" class="flex items-center gap-2 no-underline group">
          <div class="relative">
            <div class="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-cyan-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div class="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-cyan-500 pulse-dot"></div>
          </div>
          <div>
            <span class="text-lg font-bold text-scanner font-mono tracking-wider group-hover:text-cyan-500 transition-colors">YGODB</span>
            <span class="block text-[8px] text-scanner-dim/50 font-mono tracking-widest">CREATURE DATABASE</span>
          </div>
        </router-link>
      </div>
      
      <div class="flex items-center gap-2">
        <div class="hidden sm:flex items-center gap-1 text-[8px] font-mono text-scanner-dim/40">
          <div class="flex gap-0.5">
            <div class="w-1 h-2 bg-cyan-500/30 rounded signal-bar"></div>
            <div class="w-1 h-2 bg-cyan-500/30 rounded signal-bar"></div>
            <div class="w-1 h-2 bg-cyan-500/30 rounded signal-bar"></div>
          </div>
          <span>SYS.ONLINE</span>
        </div>
        
        <button
          class="btn btn-ghost btn-circle btn-sm border border-scanner hover:border-cyan-500/30 hover:bg-cyan-500/5"
          @click="toggleTheme"
          :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
        >
          <svg v-if="isDark" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-cyan-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-scanner-dim" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const isDark = ref(false);

function toggleTheme() {
  isDark.value = !isDark.value;
  document.documentElement.setAttribute('data-theme', isDark.value ? 'dark' : 'light');
  localStorage.setItem('ygodb-theme', isDark.value ? 'dark' : 'light');
}

onMounted(() => {
  const saved = localStorage.getItem('ygodb-theme');
  if (saved) {
    isDark.value = saved === 'dark';
  } else {
    isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
  document.documentElement.setAttribute('data-theme', isDark.value ? 'dark' : 'light');
});
</script>

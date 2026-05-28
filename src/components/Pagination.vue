<template>
  <div class="flex flex-col items-center gap-3 py-4">
    <div class="scanner-card-frame rounded-lg bg-[#0d1321] border border-[#1e293b] px-4 py-3">
      <div class="flex items-center gap-3 flex-wrap justify-center">
        <button
          class="btn btn-sm bg-[#111827] border border-[#1e293b] text-[#94a3b8] hover:border-[#00f0ff]/30 hover:text-[#00f0ff] gap-1 font-mono text-xs"
          :class="{ 'opacity-40 cursor-not-allowed': currentPage <= 1 }"
          :disabled="currentPage <= 1 || loading"
          @click="$emit('change', currentPage - 1)"
          aria-label="Página anterior"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          <span>ANTERIOR</span>
        </button>

        <div class="flex items-center gap-1">
          <template v-for="p in visiblePages" :key="p">
            <button
              v-if="p === '...'"
              class="btn btn-sm btn-ghost btn-disabled px-1 min-w-[1.5rem] font-mono text-xs text-[#94a3b8]/40"
              disabled
            >
              …
            </button>
            <button
              v-else
              class="btn btn-sm min-w-[2rem] font-mono text-xs"
              :class="p === currentPage ? 'bg-[#00f0ff]/20 border border-[#00f0ff]/40 text-[#00f0ff]' : 'bg-[#111827] border border-[#1e293b] text-[#94a3b8] hover:border-[#00f0ff]/30 hover:text-[#00f0ff]'"
              @click="$emit('change', p)"
            >
              {{ p }}
            </button>
          </template>
        </div>

        <button
          class="btn btn-sm bg-[#111827] border border-[#1e293b] text-[#94a3b8] hover:border-[#00f0ff]/30 hover:text-[#00f0ff] gap-1 font-mono text-xs"
          :class="{ 'opacity-40 cursor-not-allowed': currentPage >= totalPages }"
          :disabled="currentPage >= totalPages || loading"
          @click="$emit('change', currentPage + 1)"
          aria-label="Página siguiente"
        >
          <span>SIGUIENTE</span>
          <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>

    <div class="flex items-center gap-2">
      <div class="w-1 h-1 rounded-full bg-[#00f0ff]/40"></div>
      <span class="text-xs font-mono text-[#94a3b8]/50">
        REGISTROS {{ start }} - {{ end }} DE {{ total }}
      </span>
      <div class="w-1 h-1 rounded-full bg-[#00f0ff]/40"></div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  currentPage: { type: Number, default: 1 },
  total: { type: Number, default: 0 },
  perPage: { type: Number, default: 25 },
  loading: { type: Boolean, default: false },
});

defineEmits(['change']);

const totalPages = computed(() => Math.max(1, Math.ceil(props.total / props.perPage)));

const start = computed(() => props.total === 0 ? 0 : (props.currentPage - 1) * props.perPage + 1);
const end = computed(() => Math.min(props.currentPage * props.perPage, props.total));

const visiblePages = computed(() => {
  const pages = [];
  const total = totalPages.value;
  const current = props.currentPage;

  if (total <= 1) return pages;

  if (total <= 7) {
    for (let i = 1; i <= total; i++) pages.push(i);
  } else {
    pages.push(1);
    if (current > 4) pages.push('...');
    const rangeStart = Math.max(2, current - 2);
    const rangeEnd = Math.min(total - 1, current + 2);
    for (let i = rangeStart; i <= rangeEnd; i++) pages.push(i);
    if (current < total - 3) pages.push('...');
    pages.push(total);
  }
  return pages;
});
</script>

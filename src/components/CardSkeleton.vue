<template>
  <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
    <div v-for="n in count" :key="n" class="scanner-skeleton rounded-md overflow-hidden aspect-[200/280] relative">
      <div class="absolute inset-0 flex items-center justify-center z-10">
        <div class="scanner-loader-mini">
          <div class="scanner-loader-mini-ring"></div>
          <div class="scanner-loader-mini-ring"></div>
          <div class="scanner-loader-mini-core"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  count: { type: Number, default: 25 }
})
</script>

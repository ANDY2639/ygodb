<template>
  <Suspense>
    <template #default>
      <Cards />
    </template>
    <template #fallback>
      <p>Loading...</p>
    </template>
  </Suspense>
</template>

<script setup>
import Cards from "@/components/Cards.vue";
</script>
<template>
  <Suspense>
    <template #default>
      <Cards />
    </template>
    <template #fallback>
      <CardSkeleton :count="8" />
    </template>
  </Suspense>
</template>

<script setup>
import Cards from "@/components/Cards.vue";
import CardSkeleton from "@/components/CardSkeleton.vue";
</script>

<template>
  <div>
    <NavBarDetail />

    <CardDetail :id="$route.params.id" />
  </div>
</template>

<script setup>
import NavBarDetail from "@/components/NavBarDetail.vue";
import CardDetail from "@/components/CardDetail.vue";
</script>
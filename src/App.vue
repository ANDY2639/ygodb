<template>
  <div class="container mx-auto">
    <NavBar />

    <router-view />
  </div>
</template>

<script setup>
import NavBar from "@/components/NavBar.vue";
</script>
<template>
  <nav class="navbar fixed-top bg-body-tertiary bg-primary" data-bs-theme="dark">
    <div class="container">
      <router-link :to="{ name: 'Home' }" class="enlace">Home</router-link>
    </div>
  </nav>
</template>

<style>
  .enlace {
    color: #ffffff;
    text-decoration: none;
    font-size: 1.5rem;
  }
</style>
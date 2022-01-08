<template>
  <MacDesktop :apps="[]" background-image="/img/wallpapers/macos-wallpaper.jpg">
    <div class="page">
      <router-view/>
    </div>
  </MacDesktop>

  <MacOsDock position="right" />
</template>

<script setup>
import MacOsDock from '@/components/MacOsDock.vue';
import MacDesktop from '@/components/MacDesktop.vue';
</script>

<style>
html,
body {
  margin: 0;
  padding: 0;
}
body,
#app,
.page {
  height: 100vh;
}
</style>

<style lang="scss">
* {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>

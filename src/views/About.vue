<template>
  <MacApplication app-name="Application test" :dock-height="dockHeight">
    <div class="app-about">
      <h1>This is an about page</h1>
    </div>
  </MacApplication>
</template>

<script setup>
import MacApplication from '@/components/MacApplication.vue';

const dockHeight = document.querySelector('.dock__wrapper').offsetHeight;
</script>

<style lang="scss" scoped>
.app-about {
  background: white;
  height: 100%;

  h1 { margin: 0; }
}
</style>


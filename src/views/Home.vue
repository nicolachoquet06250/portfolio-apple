<template>
  <div class="home">
    <MacApplication app-name="Application Home" :dock-height="dockHeight">
      <div class="app-home">
        <h1>Home</h1>
      </div>
    </MacApplication>
    
  </div>
</template>

<script setup>
import MacApplication from '@/components/MacApplication.vue';

const dockHeight = document.querySelector('.dock__wrapper').offsetHeight;
</script>

<style lang="scss" scoped>
.app-home {
  background: red;
  height: 100%;

  h1 { margin: 0; }
}
</style>

<template>
  <div class="home">
    <MacApplication app-name="Application Home">
      <div class="app-home">
        <h1>Home</h1>
      </div>
    </MacApplication>
    
  </div>
</template>

<script setup>
import MacApplication from '@/components/MacApplication.vue';
import { useCurrentApp } from '@/hooks/apps';

const { setCurrentApp } = useCurrentApp();

setCurrentApp('Application Home');
</script>

<style lang="scss" scoped>
.app-home {
  background: white;
  height: 100%;

  h1 { margin: 0; }
}
</style>

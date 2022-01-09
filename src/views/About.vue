<template>
  <MacApplication app-name="Application About">
    <div class="app-about">
      <h1>This is an about page</h1>
    </div>
  </MacApplication>
</template>

<script setup>
import MacApplication from '@/components/MacApplication.vue';
import { useCurrentApp } from '@/hooks/apps';

const { setCurrentApp } = useCurrentApp();

setCurrentApp('Application About');
</script>

<style lang="scss" scoped>
.app-about {
  background: white;
  height: 100%;

  h1 { margin: 0; }
}
</style>


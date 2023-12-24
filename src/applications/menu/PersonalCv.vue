<template>
  <div class="cv-menu-root">
    <div v-for="(item, i) of items" :key="`item-${i}`">
      <ApplicationMenuButton
          :active="item.key === tab"
          @click="setTab(item.key)"
      >
        {{ item.label }}
      </ApplicationMenuButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import {useCv} from '@/hooks/my-cv';
import ApplicationMenuButton from '@/components/macos/ApplicationMenuButton.vue';

const {items, tab, setTab} = useCv();
</script>

<style scoped lang="scss">
  .cv-menu-root {
    display: flex;
    flex-direction: column;
    padding-top: 20px;

    > div {
      margin-right: 12px;
    }
  }
</style>

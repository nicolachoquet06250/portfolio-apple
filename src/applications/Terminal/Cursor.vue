<template>
  <div :class="{
      cursor: true,
      blink,
      isDarkMode
  }" />
</template>

<script setup lang="ts">
import {useDark} from "@/hooks/theme";

withDefaults(defineProps<{
  blink: boolean
}>(), {
  blink: true
});

const { isDark: isDarkMode } = useDark();
</script>

<style scoped lang="scss">
.cursor {
  display: inline-block;
  height: 20px;
  width: 5px;
  background: black;
  opacity: 0;

  &.isDarkMode {
    background: white;
  }

  &.blink {
    animation: blink .5s linear alternate infinite;
  }
}

@keyframes blink {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
</style>
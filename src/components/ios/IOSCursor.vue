<template>
  <div class="cursor" />
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useMouse } from "@vueuse/core";

const { x, y } = useMouse();

const cursorX = computed(() => x.value + "px");
const cursorY = computed(() => y.value + "px");
</script>

<style lang="scss" scoped>
  .cursor {
    position: absolute;
    top: v-bind(cursorY);
    left: v-bind(cursorX);
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background-color: rgba(255, 255, 255, 0.5);
    animation: pulse 2s ease-in-out infinite;
    transform-origin: center;
    z-index: 9999;
    backdrop-filter: invert(100%);
    cursor: none;
    transform: scale(1) translate(-50%, -50%);
  }

  @keyframes pulse {
    0% {
      transform: scale(1) translate(-50%, -50%);
    }
    50% {
      transform: scale(1.2) translate(-50%, -50%);
      opacity: 0.7;
    }
    100% {
      transform: scale(1) translate(-50%, -50%);
    }
  }
</style>

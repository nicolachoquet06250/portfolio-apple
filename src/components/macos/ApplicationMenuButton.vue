<template>
  <button :class="{ active }"
          @click="$emit('click')">
    <slot />
  </button>
</template>

<script setup lang="ts">
defineEmits(['click']);
defineProps<{
  active: boolean
}>();
</script>

<style scoped lang="scss">
button {
  padding: 10px;
  border: none;
  background-color: transparent;
  border-radius: 10px;
  text-align: left;

  &.active {
    background-color: #DCD4D5;
  }
}
</style>

<style lang="scss">
.mac-application.dark {
  .menu-application {
    button.active {
      background-color: rgba(255, 255, 255, .3);
    }
  }
}
</style>

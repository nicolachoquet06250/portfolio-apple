<template>
  <progress :value="note" :max="max" />
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  note: number,
  max?: number
}>(), {
  max: 5
})
</script>

<style scoped lang="scss">

</style>
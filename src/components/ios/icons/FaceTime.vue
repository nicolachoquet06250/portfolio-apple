<template>
  <svg xmlns="http://www.w3.org/2000/svg" data-name="Layer 1"
       :width="width" :height="height"
       viewBox="0 0 120 120">
    <defs>
      <linearGradient id="facetimeColor" x1="60" x2="60" y2="120" gradientUnits="userSpaceOnUse">
        <stop offset="0" stop-color="#5bf776"/>
        <stop offset="1" stop-color="#0dbc29"/>
      </linearGradient>
    </defs>
    <rect width="120" height="120" fill="url(#facetimeColor)" rx="26"/>
    <path fill="#fefefe"
          d="M18.49 73.73V45.44c0-7.8 4.22-12.06 12.1-12.06h34.57c7.84 0 12.1 4.26 12.1 12.06v28.29c0 7.8-4.26 12.06-12.1 12.06H30.59c-7.84 0-12.1-4.26-12.1-12.06zM79.6 51.17l15.2-12.39a6.26 6.26 0 0 1 3.89-1.7c2.07 0 3.47 1.44 3.47 4v38c0 2.59-1.4 4-3.47 4a6.1 6.1 0 0 1-3.89-1.7l-15.2-12.5z"/>
  </svg>
</template>

<script setup lang="ts">
defineProps<{
  width: number,
  height: number
}>();
</script>

<style scoped lang="scss">

</style>
<template>
  <svg xmlns="http://www.w3.org/2000/svg" data-name="Layer 1" :width="width" :height="height" viewBox="0 0 120 120"
       id="safari">
    <path fill="#fff" fill-rule="evenodd"
          d="M0,94V26A25.94821,25.94821,0,0,1,26,0H94a25.94821,25.94821,0,0,1,26,26V94a25.94821,25.94821,0,0,1-26,26H26A25.94821,25.94821,0,0,1,0,94Z"></path>
    <text x="24%" y="35" font-size="30" font-weight="bold" fill="#ff0000">{{ dayLabel }}</text>
    <text :x="day.toString().length < 2 ? '30%' : '12%'" y="90%" font-size="80" fill="#000000">{{ day }}</text>
  </svg>
</template>

<script setup>
import {computed, ref} from "vue";

defineProps({
  width: Number,
  height: Number
});

const days = [
    'Dim.',
    'Lun.',
    'Mar.',
    'Mer.',
    'Jeu.',
    'Ven.',
    'Sam.'
];

const date = ref(new Date());
const dayLabel = computed(() => days[date.value.getDay()]);
const day = computed(() => date.value.getDate());
</script>

<style scoped lang="scss">

</style>
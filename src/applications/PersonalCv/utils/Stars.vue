<template>
  <div>
    <i v-for="i of starsArray" :key="`note-${i}`" :class="classes(i)" style="color:#8B8000"></i>
    <i v-for="i of restArray" :key="`rest-${i}`" :class="classes()" style="color:#8B8000"></i>
  </div>
</template>

<script setup lang="ts">
import {computed, onMounted, watch} from 'vue';

const props = withDefaults(
    defineProps<{
      note?: number,
      max?: number
    }>(),
    {note: 0, max: 5}
)

const note = computed(() => Math.min(props.note, props.max));
const roundedNote = computed(() => Math.round(note.value));
const isHalf = computed(() => roundedNote.value - note.value === 0.5);
const starsArray = computed(() => Array.from(new Array(roundedNote.value).keys()));
const roundedRest = computed(() => {
  if (isHalf.value) {
    return Math.round(props.max) - roundedNote.value;
  }
  return Math.round(props.max) - roundedNote.value;
});
const restArray = computed(() => Array.from(new Array(roundedRest.value).keys()));
const classes = (n: number|null = null): string => {
  if (n === null) return 'fa-regular fa-star'

  if (n === roundedNote.value - 1 && isHalf.value) {
    return 'fa-solid fa-star-half-stroke'
  }
  return 'fa-solid fa-star';
};

onMounted(() => {
  console.log(props.note > props.max)
  if (props.note > props.max) {
    console.warn(`La note doit être inferieure ou éguale à la note maxinum. (note: ${props.note}), max: ${props.max}`)
  }
})

watch(() => props.note, (note) => {
  if (note > props.max) {
    console.warn(`La note doit être inferieure ou éguale à la note maxinum. (note: ${note}), max: ${props.max}`)
  }
})
</script>

<style scoped lang="scss">
div {
  display: flex;
  flex-direction: row!important;
  justify-content: center;
  align-items: center;
}
</style>
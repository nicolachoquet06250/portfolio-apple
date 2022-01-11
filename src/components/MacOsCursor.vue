<template>
    <div class="cursor"></div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useMouse } from '@vueuse/core';
import { useCursor } from '@/hooks/cursor';

const { x, y } = useMouse();
const { setCursor, cursorImage } = useCursor();

const cursorPositionsFor1second = ref(0);
const bigCursor = ref(false);
const displayBigCursor = computed(() => bigCursor.value ? 'block' : 'none');

watch([x, y], () => {
  cursorPositionsFor1second.value++;
});

setInterval(() => {
  if (cursorPositionsFor1second.value >= 30) {
    document.querySelector('#app').classList.add('show-big-cursor')
    bigCursor.value = true;
  } else {
    document.querySelector('#app').classList.remove('show-big-cursor')
    bigCursor.value = false;
  }
  cursorPositionsFor1second.value = 0;
}, 500);

const cursorX = computed(() => x.value + 'px');
const cursorY = computed(() => y.value + 'px');
</script>

<style lang="scss">
#app {
    cursor: url('/cursors/_normal.png'), default!important;

    &.show-big-cursor {
        cursor: none!important;
    }

    a, a *, 
    button, button *, 
    [clickable] {
        cursor: url('/cursors/_pointer.png'), pointer!important;
    }

    div.cursor {
        cursor: none;
        display: v-bind(displayBigCursor);
        width: 50px;
        height: 50px;
        background: url("/cursors/_normal.png");
        background-repeat: no-repeat;
        background-size: cover;
        position: absolute;
        left: v-bind(cursorX);
        top: v-bind(cursorY);
        z-index: 999999;
    }
}
</style>
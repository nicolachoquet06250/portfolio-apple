<template>
  <div :class="`cursor ${classes.join(' ')}`">
    <slot />
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import { useMouse } from "@vueuse/core";
import { useWait } from "@/hooks/wait";

const { x, y } = useMouse();
const { waiting } = useWait();

const cursorPositionsFor1second = ref(0);
const bigCursor = ref(false);
const interval = ref(null);
const cmp = ref(0);
const classes = ref([]);

if (waiting.value) {
  document.querySelector('#app').classList.add('waiting');

  interval.value = setInterval(async () => {
    document.querySelector('#app').classList.remove(`waiting-${(cmp.value)}`);
    cmp.value++;
    if (cmp.value > 14) {
      cmp.value = 0;
    }
    //document.querySelector('#app').classList.remove(`waiting-${(cmp.value === 0 ? 14 : cmp.value - 1)}`);
    document.querySelector('#app').classList.add(`waiting-${cmp.value}`);
  }, 100);
}

watch([x, y], () => {
  cursorPositionsFor1second.value++;
});

watch(waiting, () => {
  if (waiting.value) {
    if (!classes.value.includes('waiting')) {
      classes.value = [...classes.value, 'waiting'];
    }

    interval.value = setInterval(() => {
      classes.value = classes.value.filter(c => c !== `waiting-${(cmp.value)}`);
      cmp.value++;

      if (cmp.value > 14) cmp.value = 0;

      if (!classes.value.includes(`waiting-${cmp.value}`)) {
        classes.value = [...classes.value, `waiting-${cmp.value}`];
      }
    }, 50);
  } else {
    clearInterval(interval.value);

    classes.value = classes.value.filter(c => c !== 'waiting' && c !== `waiting-${(cmp.value)}`);
    
    cmp.value = 0;
  }
});

setInterval(async () => {
  if (cursorPositionsFor1second.value >= 30) {
    if (!classes.value.includes('show-big-cursor')) {
      classes.value = [...classes.value, 'show-big-cursor'];
    }
    bigCursor.value = true;
  } else {
    classes.value = classes.value.filter(c => c !== 'show-big-cursor');
    bigCursor.value = false;
  }
  cursorPositionsFor1second.value = 0;
}, 500);
</script>

<style lang="scss" scoped>
.cursor {
  display: contents;
  cursor: url(/cursors/_normal.png), default;

  :global(a),
  :global(a *),
  :global(button),
  :global(button *),
  :global(input),
  :global(textarea),
  :global([clickable]),
  &:global(.pointer),
  &:global(.pointer *) {
    cursor: url(/cursors/_pointer.png), pointer !important;
  }

  &:global(.waiting) {
    cursor: url(/cursors/_waiting.gif), wait !important;
  }

  &:global(.waiting.waiting-0 *) {
    cursor: url(/cursors/_waiting-frame1.png), wait !important;
  }
  &:global(.waiting.waiting-1 *) {
    cursor: url(/cursors/_waiting-frame2.png), wait !important;
  }
  &:global(.waiting.waiting-2 *) {
    cursor: url(/cursors/_waiting-frame3.png), wait !important;
  }
  &:global(.waiting.waiting-3 *) {
    cursor: url(/cursors/_waiting-frame4.png), wait !important;
  }
  &:global(.waiting.waiting-4 *) {
    cursor: url(/cursors/_waiting-frame5.png), wait !important;
  }
  &:global(.waiting.waiting-5 *) {
    cursor: url(/cursors/_waiting-frame6.png), wait !important;
  }
  &:global(.waiting.waiting-6 *) {
    cursor: url(/cursors/_waiting-frame7.png), wait !important;
  }
  &:global(.waiting.waiting-7 *) {
    cursor: url(/cursors/_waiting-frame8.png), wait !important;
  }
  &:global(.waiting.waiting-8 *) {
    cursor: url(/cursors/_waiting-frame9.png), wait !important;
  }
  &:global(.waiting.waiting-9 *) {
    cursor: url(/cursors/_waiting-frame10.png), wait !important;
  }
  &:global(.waiting.waiting-10 *) {
    cursor: url(/cursors/_waiting-frame11.png), wait !important;
  }
  &:global(.waiting.waiting-11 *) {
    cursor: url(/cursors/_waiting-frame12.png), wait !important;
  }
  &:global(.waiting.waiting-12 *) {
    cursor: url(/cursors/_waiting-frame13.png), wait !important;
  }
  &:global(.waiting.waiting-13 *) {
    cursor: url(/cursors/_waiting-frame14.png), wait !important;
  }
  &:global(.waiting.waiting-14 *) {
    cursor: url(/cursors/_waiting-frame15.png), wait !important;
  }

  &:global(.show-big-cursor) {
    cursor: url(/cursors/normal-50x50.png), default!important;
  }
  &:global(.show-big-cursor.waiting) {
    cursor: url(/cursors/waiting-50x50.gif), wait!important;
  }
  &:global(.show-big-cursor.waiting.waiting-0) {
    cursor: url(/cursors/_waiting-frame1-50x50.png)!important;
  }
  &:global(.show-big-cursor.waiting.waiting-1) {
    cursor: url(/cursors/_waiting-frame2-50x50.png)!important;
  }
  &:global(.show-big-cursor.waiting.waiting-2) {
    cursor: url(/cursors/_waiting-frame3-50x50.png)!important;
  }
  &:global(.show-big-cursor.waiting.waiting-3) {
    cursor: url(/cursors/_waiting-frame4-50x50.png)!important;
  }
  &:global(.show-big-cursor.waiting.waiting-4) {
    cursor: url(/cursors/_waiting-frame5-50x50.png)!important;
  }
  &:global(.show-big-cursor.waiting.waiting-5) {
    cursor: url(/cursors/_waiting-frame6-50x50.png)!important;
  }
  &:global(.show-big-cursor.waiting.waiting-6) {
    cursor: url(/cursors/_waiting-frame7-50x50.png)!important;
  }
  &:global(.show-big-cursor.waiting.waiting-7) {
    cursor: url(/cursors/_waiting-frame8-50x50.png)!important;
  }
  &:global(.show-big-cursor.waiting.waiting-8) {
    cursor: url(/cursors/_waiting-frame9-50x50.png)!important;
  }
  &:global(.show-big-cursor.waiting.waiting-9) {
    cursor: url(/cursors/_waiting-frame10-50x50.png)!important;
  }
  &:global(.show-big-cursor.waiting.waiting-10) {
    cursor: url(/cursors/_waiting-frame11-50x50.png)!important;
  }
  &:global(.show-big-cursor.waiting.waiting-11) {
    cursor: url(/cursors/_waiting-frame12-50x50.png)!important;
  }
  &:global(.show-big-cursor.waiting.waiting-12) {
    cursor: url(/cursors/_waiting-frame13-50x50.png)!important;
  }
  &:global(.show-big-cursor.waiting.waiting-13) {
    cursor: url(/cursors/_waiting-frame14-50x50.png)!important;
  }
  &:global(.show-big-cursor.waiting.waiting-14) {
    cursor: url(/cursors/_waiting-frame15-50x50.png)!important;
  }
  &:global(.show-big-cursor a),
  &:global(.show-big-cursor a *),
  &:global(.show-big-cursor button),
  &:global(.show-big-cursor button *),
  &:global(.show-big-cursor input),
  &:global(.show-big-cursor textarea),
  &:global(.show-big-cursor [clickable]),
  &:global(.show-big-cursor.pointer) {
    cursor: url(/cursors/pointer-50x50.png), pointer!important;
  }
}
</style>

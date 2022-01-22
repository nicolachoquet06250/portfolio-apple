<script setup>
import { ref, computed, watch } from "vue";
import { useMouse } from "@vueuse/core";
import { useWait } from "@/hooks/wait";

const { x, y } = useMouse();
const { waiting } = useWait();

const cursorPositionsFor1second = ref(0);
const bigCursor = ref(false);
const displayBigCursor = computed(() => bigCursor.value ? 'block' : 'none');
const interval = ref(null);
const cmp = ref(0);

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
    document.querySelector('#app').classList.add('waiting');

    interval.value = setInterval(() => {
      document.querySelector('#app').classList.remove(`waiting-${(cmp.value)}`);
      cmp.value++;

      if (cmp.value > 14) cmp.value = 0;

      //document.querySelector('#app').classList.remove(`waiting-${(cmp.value === 0 ? 14 : cmp.value - 1)}`);
      document.querySelector('#app').classList.add(`waiting-${cmp.value}`);
    }, 50);
  } else {
    clearInterval(interval.value);

    document.querySelector('#app').classList.remove('waiting');
    document.querySelector('#app').classList.remove(`waiting-${(cmp.value)}`);
    
    cmp.value = 0;
  }
});

setInterval(async () => {
  if (cursorPositionsFor1second.value >= 30) {
    document.querySelector('#app').classList.add('show-big-cursor')
    bigCursor.value = true;
  } else {
    document.querySelector('#app').classList.remove('show-big-cursor')
    bigCursor.value = false;
  }
  cursorPositionsFor1second.value = 0;
}, 500);

const cursorX = computed(() => x.value + "px");
const cursorY = computed(() => y.value + "px");
</script>

<style lang="scss">
#app {
  cursor: url(/cursors/_normal.png), default !important;

  a,
  a *,
  button,
  button *,
  input,
  textarea,
  [clickable],
  &.pointer,
  &.pointer * {
    cursor: url(/cursors/_pointer.png), pointer !important;
  }

  &.waiting {
    &.waiting-0 * {
      cursor: url(/cursors/_waiting-frame1.png), wait !important;
    }
    &.waiting-1 * {
      cursor: url(/cursors/_waiting-frame2.png), wait !important;
    }
    &.waiting-2 * {
      cursor: url(/cursors/_waiting-frame3.png), wait !important;
    }
    &.waiting-3 * {
      cursor: url(/cursors/_waiting-frame4.png), wait !important;
    }
    &.waiting-4 * {
      cursor: url(/cursors/_waiting-frame5.png), wait !important;
    }
    &.waiting-5 * {
      cursor: url(/cursors/_waiting-frame6.png), wait !important;
    }
    &.waiting-6 * {
      cursor: url(/cursors/_waiting-frame7.png), wait !important;
    }
    &.waiting-7 * {
      cursor: url(/cursors/_waiting-frame8.png), wait !important;
    }
    &.waiting-8 * {
      cursor: url(/cursors/_waiting-frame9.png), wait !important;
    }
    &.waiting-9 * {
      cursor: url(/cursors/_waiting-frame10.png), wait !important;
    }
    &.waiting-10 * {
      cursor: url(/cursors/_waiting-frame11.png), wait !important;
    }
    &.waiting-11 * {
      cursor: url(/cursors/_waiting-frame12.png), wait !important;
    }
    &.waiting-12 * {
      cursor: url(/cursors/_waiting-frame13.png), wait !important;
    }
    &.waiting-13 * {
      cursor: url(/cursors/_waiting-frame14.png), wait !important;
    }
    &.waiting-14 * {
      cursor: url(/cursors/_waiting-frame15.png), wait !important;
    }
  }

  &.show-big-cursor {
    cursor: url(/cursors/normal-50x50.png), default !important;

    &.waiting {
      &.waiting-0 * {
        cursor: url(/cursors/_waiting-frame1-50x50.png), wait !important;
      }
      &.waiting-1 * {
        cursor: url(/cursors/_waiting-frame2-50x50.png), wait !important;
      }
      &.waiting-2 * {
        cursor: url(/cursors/_waiting-frame3-50x50.png), wait !important;
      }
      &.waiting-3 * {
        cursor: url(/cursors/_waiting-frame4-50x50.png), wait !important;
      }
      &.waiting-4 * {
        cursor: url(/cursors/_waiting-frame5-50x50.png), wait !important;
      }
      &.waiting-5 * {
        cursor: url(/cursors/_waiting-frame6-50x50.png), wait !important;
      }
      &.waiting-6 * {
        cursor: url(/cursors/_waiting-frame7-50x50.png), wait !important;
      }
      &.waiting-7 * {
        cursor: url(/cursors/_waiting-frame8-50x50.png), wait !important;
      }
      &.waiting-8 * {
        cursor: url(/cursors/_waiting-frame9-50x50.png), wait !important;
      }
      &.waiting-9 * {
        cursor: url(/cursors/_waiting-frame10-50x50.png), wait !important;
      }
      &.waiting-10 * {
        cursor: url(/cursors/_waiting-frame11-50x50.png), wait !important;
      }
      &.waiting-11 * {
        cursor: url(/cursors/_waiting-frame12-50x50.png), wait !important;
      }
      &.waiting-12 * {
        cursor: url(/cursors/_waiting-frame13-50x50.png), wait !important;
      }
      &.waiting-13 * {
        cursor: url(/cursors/_waiting-frame14-50x50.png), wait !important;
      }
      &.waiting-14 * {
        cursor: url(/cursors/_waiting-frame15-50x50.png), wait !important;
      }

      //cursor: url(/cursors/waiting-50x50.gif), wait !important;
    }

    a,
    a *,
    button,
    button *,
    input,
    textarea,
    [clickable],
    &.pointer {
      cursor: url(/cursors/pointer-50x50.png), pointer !important;
    }
  }
}
</style>

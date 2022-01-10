<template>
  <MacDesktop
    :apps="[]"
    :current-app-name="currentApp"
    background-image="/img/wallpapers/macos-wallpaper.jpg"
    :top-bar="desktopTopBar"
  >
    <div class="page">
      <router-view />
    </div>
  </MacDesktop>

  <MacOsDock position="right" />

  <div class="cursor"></div>
</template>

<script setup>
import MacOsDock from "@/components/MacOsDock.vue";
import MacDesktop from "@/components/MacDesktop.vue";

import { computed, reactive, ref, watch } from "vue";
import { useNetwork, useBattery, useMouse } from "@vueuse/core";

import { useCurrentApp } from "@/hooks/apps";
import { useCursor } from '@/hooks/cursor';

const { isOnline } = useNetwork();
const { charging, chargingTime, dischargingTime, level } = useBattery();
const { x, y } = useMouse();

const cursorPositionsFor1second = ref(0);
const bigCursor = ref(false);
const displayBigCursor = computed(() => bigCursor.value ? 'block' : 'none');

watch([x, y], () => {
  // console.log('x', x.value, 'y', y.value, new Date().getHours() + ':' + new Date().getMinutes() + ':' + new Date().getSeconds());
  cursorPositionsFor1second.value++;
});

setInterval(() => {
  if (cursorPositionsFor1second.value > 45) {
    document.querySelector('#app').classList.add('show-big-cursor')
    bigCursor.value = true;
  } else {
    document.querySelector('#app').classList.remove('show-big-cursor')
    bigCursor.value = false;
  }
  cursorPositionsFor1second.value = 0;
}, 1000);

const cursorX = computed(() => x.value + 'px');
const cursorY = computed(() => y.value + 'px');

const { currentApp } = useCurrentApp();
const { setCursor, cursorImage } = useCursor();

const desktopTopBar = reactive({
  network: {
    wifi: {
      online: isOnline.value,
    },
  },
  batterie: {
    charging: charging.value,
    chargingTime: chargingTime.value,
    dischargingTime: dischargingTime.value,
    level: level.value,
  },
});
</script>

<style>
html, body {
  margin: 0;
  padding: 0;
}
body, #app, .page {
  height: 100vh;
  overflow: hidden;
}

#app {
  /*cursor: none!important;
  --cursor-img: url('/cursors/_normal.png');*/
  cursor: url('/cursors/_normal.png'), default!important;
}

#app.show-big-cursor {
  cursor: none!important;
}

#app a, #app a *,
#app button, #app button *,
#app [clickable] {
  /*cursor: none!important;
  --cursor-img: url('/cursors/_pointer.png');*/
  cursor: url('/cursors/_pointer.png'), pointer!important;
}

#app div.cursor {
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
</style>

<style lang="scss">
* {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>

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

  <MacOsCursor />
</template>

<script setup>
import MacOsDock from "@/components/MacOsDock.vue";
import MacDesktop from "@/components/MacDesktop.vue";
import MacOsCursor from '@/components/MacOsCursor.vue';

import { reactive } from "vue";
import { useNetwork, useBattery } from "@vueuse/core";

import { useCurrentApp } from "@/hooks/apps";

const { isOnline } = useNetwork();
const { charging, chargingTime, dischargingTime, level } = useBattery();

const { currentApp } = useCurrentApp();

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

<style lang="scss">
html, body {
  margin: 0;
  padding: 0;
}

body, #app, .page {
  height: 100vh;
  overflow: hidden;
}

* {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>

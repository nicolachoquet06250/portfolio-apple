<template>
  <template v-if="installed">
    <IOSDesktop
      v-if="isMobile || isTablet || screenWidth <= 507"
      :apps="[]"
      :current-app-name="currentApp"
      background-image="/img/wallpapers/macos-wallpaper.jpg"
      :top-bar="desktopTopBar"></IOSDesktop>

    <MacDesktop
      v-else
      :apps="[]"
      :current-app-name="currentApp"
      background-image="/img/wallpapers/macos-wallpaper.jpg"
      :top-bar="desktopTopBar">

      <MacOsAlert v-if="displayAlert" @close="hideAlert" />

      <MacOsDock position="right" />

      <MacOsCursor />

      <MacOsSystemLoader v-if="systemLoading" @loaded="handleSystemLoaded" />
    </MacDesktop>
  </template>

  <installation @installed="installed = true" v-else />
</template>

<script setup>
import { deviceType, isMobile, isTablet } from 'mobile-device-detect';
import MacOsDock from "@/components/MacOsDock.vue";
import MacDesktop from "@/components/MacDesktop.vue";
import IOSDesktop from '@/components/IOSDesktop.vue';
import MacOsCursor from '@/components/MacOsCursor.vue';
import MacOsAlert from '@/components/MacOsAlert.vue';
import MacOsSystemLoader from '@/components/MacOsSystemLoader.vue';
import Installation from '@/components/Installation.vue';

import { ref, reactive, watch } from "vue";
import { useNetwork, useBattery, useWindowSize } from "@vueuse/core";
import { APPLICATION, useCurrentApp } from "@/hooks/apps";

const { isOnline } = useNetwork();
const { charging, chargingTime, dischargingTime, level } = useBattery();
const { width: screenWidth } = useWindowSize();
const { currentApp, setCurrentApp } = useCurrentApp();
const systemLoading = ref(true);

setCurrentApp(APPLICATION.FINDER);

const installed = ref(localStorage.getItem('installed') !== null);
const displayAlert = ref(false);
const showAlert = () => {
  displayAlert.value = true;
};
const hideAlert = () => {
  displayAlert.value = false;
};
const handleSystemLoaded = () => {
  systemLoading.value = false;
};

const desktopTopBar = reactive({
  network: {
    wifi: {
      online: isOnline.value,
    },
  },
  battery: {
    charging: charging.value,
    chargingTime: chargingTime.value,
    dischargingTime: dischargingTime.value,
    level: level.value,
  },
  menu: [
    {
      name: 'Fichier',
      children: [
        {
          name: 'Nouveau fichier'
        },
        {
          name: 'Nouveau dossier'
        }
      ]
    },
    {
      name: 'Edition',
      children: []
    },
    {
      name: 'Voir',
      children: [
        {
          name: `Afficher l'alerte`,
          click: showAlert
        }
      ]
    },
    {
      name: 'Aller',
      children: []
    },
    {
      name: 'Fenêtre',
      children: []
    },
    {
      name: 'Aide',
      children: []
    },
  ]
});

watch([isOnline, charging, chargingTime, dischargingTime, level], () => {
  desktopTopBar.network.wifi.online = isOnline.value;
  desktopTopBar.battery.charging = charging.value;
  desktopTopBar.battery.chargingTime = chargingTime.value;
  desktopTopBar.battery.dischargingTime = dischargingTime.value;
  desktopTopBar.battery.level = level.value;
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

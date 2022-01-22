<template>
  <template v-if="installed || installSkipped">
    <template v-if="isMobile || isTablet || screenWidth <= 507">
      <IOSDesktop
            :apps="[]"
            :current-app-name="currentApp"
            background-image="/img/wallpapers/macos-wallpaper.jpg"
            :top-bar="desktopTopBar"></IOSDesktop>
    </template>

    <template v-else>
      <MacOsSystemLoader v-if="systemLoading" 
                         @loaded="handleSystemLoaded" />

      <LoginView v-if="!connected && !installSkipped" 
                 @connected="connected = true" />

      <MacDesktop v-else
        :apps="[]"
        :current-app-name="currentApp"
        background-image="/img/wallpapers/macos-wallpaper.jpg"
        :top-bar="desktopTopBar">

        <InstallDesktopIcon v-if="installSkipped" @install="installMac()" />

        <MacOsAlert v-if="displayAlert" @close="hideAlert" />

        <MacOsDock position="right" />
      </MacDesktop>
    </template>
  </template>

  <Installation v-else @installed="hasInstalled($event)" />

  <MacOsCursor />
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
import LoginView from '@/components/LoginView.vue';
import InstallDesktopIcon from '@/components/InstallDesktopIcon.vue';

import { ref, reactive, watch } from "vue";
import { useNetwork, useBattery, useWindowSize } from "@vueuse/core";
import { APPLICATION, useCurrentApp } from "@/hooks/apps";

const { isOnline } = useNetwork();
const { charging, chargingTime, dischargingTime, level } = useBattery();
const { width: screenWidth } = useWindowSize();
const { currentApp, setCurrentApp } = useCurrentApp();
const systemLoading = ref(true);

setCurrentApp(APPLICATION.FINDER);

const connected = ref(false);
const installed = ref(localStorage.getItem('installed') !== null);
const installSkipped = ref(localStorage.getItem('install_skipped') !== null);
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
const hasInstalled = e => {
  installed.value = true;
  if (e.install_skipped) {
    installSkipped.value = true;
  }
};
const installMac = () => {
  localStorage.removeItem('installed');
  installed.value = false;
  localStorage.removeItem('install_skipped');
  installSkipped.value = false;
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

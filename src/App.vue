<template>
  <template v-if="installed || installSkipped">
    <template v-if="isMobile || isTablet || screenWidth <= 507">
      <IOSDesktop
            :apps="[]"
            :current-app-name="currentApp"
            background-image="/img/wallpapers/wallpaper-install-macos.jpg"
            :top-bar="desktopTopBar"></IOSDesktop>
    </template>

    <template v-else>
      <template v-if="installSkipped">
        <MacOsSystemLoader v-if="systemLoading" @loaded="handleSystemLoaded(true)" />

        <MacDesktop v-else
          :apps="[]"
          :current-app-name="currentApp"
          :background-image="wallpaper"
          :top-bar="desktopTopBar">

          <Notification v-for="(notif, i) of notifications" :key="i"
                        :opened="notif.opened" :index="notif.index"
                        :image="notif.image" :latence="2000"
                        @closed="closeNotification(i)">
            <template v-slot:title>
              <span> {{ notif.title }} </span>
            </template>

            <template v-slot:content>
              <span>
                {{ notif.content }}
              </span>
            </template>

            <template v-slot:button>
              <button v-for="(button, b) of notif.buttons" :key="b" 
                      @click="button.click?.()">
                {{ button.text }}
              </button>
            </template>
          </Notification>

          <MacOsAlert v-if="displayAlert" 
                      @close="hideAlert" 
                      @validate="hideAlert">
            <template v-slot:title>
              <span>{{ alertContent.title }}</span>
            </template>

            <template v-slot:body>
              <p v-for="(p, i) of alertContent.content" :key="i">
                {{ p }}
              </p>
            </template>

            <template v-slot:footer>
              <Checkbox id="dont-ask-again">
                  Dont ask again
              </Checkbox>
            </template>
          </MacOsAlert>

          <MacOsDock />
        </MacDesktop>
      </template>

      <template v-else>
        <MacOsSystemLoader v-if="systemLoading" @loaded="handleSystemLoaded(false)" />

        <LoginView v-if="!connected" @connected="connectUser()" />

        <MacDesktop v-else
          :apps="[]"
          :current-app-name="currentApp"
          :background-image="wallpaper"
          :top-bar="desktopTopBar">

          <Notification v-for="(notif, i) of notifications" :key="i"
                        :opened="notif.opened" :index="notif.index"
                        :image="notif.image" :latence="2000"
                        @closed="closeNotification(i)">
            <template v-slot:title>
              <span> {{ notif.title }} </span>
            </template>

            <template v-slot:content>
              <span>
                {{ notif.content }}
              </span>
            </template>

            <template v-slot:button>
              <button v-for="(button, b) of notif.buttons" :key="b" 
                      @click="button.click?.()">
                {{ button.text }}
              </button>
            </template>
          </Notification>

          <MacOsAlert v-if="displayAlert" 
                      @close="hideAlert" 
                      @validate="hideAlert">
            <template v-slot:title>
              <span>{{ alertContent.title }}</span>
            </template>

            <template v-slot:body>
              <p v-for="(p, i) of alertContent.content" :key="i">
                {{ p }}
              </p>
            </template>

            <template v-slot:footer>
              <Checkbox id="dont-ask-again">
                  Dont ask again
              </Checkbox>
            </template>
          </MacOsAlert>

          <MacOsDock />
        </MacDesktop>
      </template>
    </template>
  </template>

  <Installation v-else @installed="hasInstalled($event)" />

  <MacOsCursor />
</template>

<script setup>
import { isMobile, isTablet } from 'mobile-device-detect';
import MacOsDock from "@/components/MacOsDock.vue";
import MacDesktop from "@/components/MacDesktop.vue";
import IOSDesktop from '@/components/IOSDesktop.vue';
import MacOsCursor from '@/components/MacOsCursor.vue';
import MacOsAlert from '@/components/MacOsAlert.vue';
import MacOsSystemLoader from '@/components/MacOsSystemLoader.vue';
import Installation from '@/components/Installation.vue';
import LoginView from '@/components/LoginView.vue';
// import InstallDesktopIcon from '@/components/InstallDesktopIcon.vue';
import Checkbox from '@/components/Checkbox.vue';
import Notification from '@/components/utilities/Notification.vue';

import iconCdInstall from '@/assets/icon-cd-install-mac.png';
import appstore from '@/assets/dock/appstore.png';

import { ref, computed, reactive, watch } from "vue";
import { useNetwork, useBattery, useWindowSize } from "@vueuse/core";
import { APPLICATION, useCurrentApp } from "@/hooks/apps";
import { useInstalled } from '@/hooks/installed';
import { useNotifications } from '@/hooks/notifications';

const { isOnline } = useNetwork();
const { charging, chargingTime, dischargingTime, level } = useBattery();
const { width: screenWidth } = useWindowSize();
const { currentApp, setCurrentApp } = useCurrentApp();
const { installed, skipped: installSkipped, isInstalled, isNotInstalled, isSkipped, isNotSkipped } = useInstalled();
const { notifications, createNotification, deleteNotification, closeNotification } = useNotifications();

const systemLoading = ref(true);

setCurrentApp(APPLICATION.FINDER);

const wallpaper = ref('/img/wallpapers/wallpaper-install-macos.jpg');
const connected = ref(false);
const displayAlert = ref(false);
const displayAlertAppInDev = ref(true);
const displayInstallNotif = ref(true);
const alertContent = reactive({
  title: 'Alert title will be here',
  content: [
    `Lorem ipsum dolor sit amet consectetur adipisicing elit. 
    Reiciendis nesciunt veritatis praesentium veniam eveniet nostrum, 
    enim natus corrupti!`
  ]
});
const alertAppInDev = reactive({
  show: localStorage.getItem('dontShowWarningAlertAgain') === null,
  dontShowAgain: localStorage.getItem('dontShowWarningAlertAgain') !== null,
  title: 'Application en developement',
  content: [
    `Cette application est en cours de développement.`,
    `Toutes les fonctionnalitées ne fonctionnent pas encore.`,
    `Merci de votre compréhantion.`
  ]
});

const showAlert = () => {
  displayAlert.value = true;
};
const hideAlert = () => {
  displayAlert.value = false;
};
const hasInstalled = e => {
  isInstalled();
  if (e.install_skipped) {
    isSkipped();
    //installSkipped.value = true;
  }
};
const installMac = () => {
  isNotInstalled();
  isNotSkipped();
  //installSkipped.value = false;
};
const installNotifOpened = computed(() => (installSkipped.value === null ? false : installSkipped.value) && displayInstallNotif.value);

const initNotifsQueue = () => {
  createNotification({
    image: iconCdInstall,
    title: 'Installez macOS',
    content: `Une npuvelle version de macOS est disponible`,
    opened: installNotifOpened,
    buttons: [
      {
        text: 'Installer',
        click() {
          deleteNotification(0);
          installMac();
        }
      },
      {
        text: 'Fermer',
        click() {
          displayInstallNotif.value = false;
          deleteNotification(0);
        }
      }
    ]
  });

  createNotification({
    index: (installNotifOpened.value ? 1 : 0),
    image: appstore,
    title: alertAppInDev.title,
    content: alertAppInDev.content.join(''),
    opened: computed(() => displayAlertAppInDev.value && alertAppInDev.show),
    buttons: [
      {
        text: 'OK',
        click() {
          displayAlertAppInDev.value = false;
          deleteNotification(1);
        }
      },
      {
        text: 'Ne plus voir',
        click() {
          alertAppInDev.dontShowAgain = true;
          deleteNotification(1);
        }
      }
    ]
  });
}
const handleSystemLoaded = (initNotifs) => {
  systemLoading.value = false;
  if (initNotifs) {
    initNotifsQueue();
  }
};
const connectUser = () => {
  connected.value = true;
  initNotifsQueue();
}

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

watch(() => alertAppInDev.dontShowAgain, () => {
  if (alertAppInDev.dontShowAgain) {
    localStorage.setItem('dontShowWarningAlertAgain', '1');
  } else {
    localStorage.removeItem('dontShowWarningAlertAgain');
  }
})
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
}
</style>

<template>
  <template v-if="installed || installSkipped">
    <IOSDesktop
        v-if="showMobileVersion"
        :apps="[]"
        :current-app-name="currentApp!"
        background-image="/img/wallpapers/ios-wallpaper.png"
        :top-bar="desktopTopBar"
        @lock-screen="showIOSLoginView = true"
    >
      <IOSUnlockView
        v-if="showIOSLoginView" 
        @unlock-screen="showIOSLoginView = false" 
        :current-app-name="currentApp!"
        background-image="/img/wallpapers/ios-wallpaper.png"
        :top-bar="desktopTopBar"
        :apps="[]"
      />
<!--      <StartInstall />-->

<!--      <IOSCursor v-if="!showIOSLoginView" />-->
    </IOSDesktop>

    <MacOsCursor :white="isDark" v-else>
      <template v-if="installSkipped">
        <MacOsSystemLoader
            v-if="systemLoading"
            @loaded="handleSystemLoaded(true)" />

        <MacDesktop
          v-else
          :apps="[]"
          :current-app-name="currentApp!"
          :background-image="wallpaper"
          :top-bar="desktopTopBar"
          @lock-screen="connected = false"
        >

          <Notification
              v-for="({ opened, index, image, title, content, buttons }, i) of notifications" :key="i"
              :opened="opened" :index="index"
              :image="image" :latence="2000"
              @closed="closeNotification(i)">
            <template v-slot:title>
              <span> {{ title }} </span>
            </template>

            <template v-slot:content>
              <span> {{ content }} </span>
            </template>

            <template v-slot:button>
              <button v-for="(button, b) of buttons" :key="b"
                      @click="button.click()">
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
        <MacOsSystemLoader
            v-if="systemLoading"
            @loaded="handleSystemLoaded(false)" />

        <MacOsLoginView
            v-if="!connected"
            :show-buttons="screenId === 0"
            :show-form="screenId === 0"
            @connected="connectUser()" />

        <MacDesktop
          v-else
          :apps="[]"
          :current-app-name="currentApp!"
          :background-image="wallpaper"
          :top-bar="desktopTopBar"
          @lock-screen="connected = false"
        >

          <Notification v-for="({opened, image, index, title, content, buttons}, i) of notifications" :key="i"
                        :opened="opened" :index="index"
                        :image="image" :latence="2000"
                        @closed="closeNotification(i)">
            <template v-slot:title>
              <span> {{ title }} </span>
            </template>

            <template v-slot:content>
              <span> {{ content }} </span>
            </template>

            <template v-slot:button>
              <button v-for="(button, b) of buttons" :key="b"
                      @click="button.click()">
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
    </MacOsCursor>
  </template>

  <template v-else>
    <IOSDesktop
        v-if="showMobileVersion"
        :apps="[]"
        :current-app-name="currentApp!"
        background-image="/img/wallpapers/ios-wallpaper.png"
        :top-bar="desktopTopBar"
        @lock-screen="showIOSLoginView = true"
    >
      <IOSUnlockView
        v-if="showIOSLoginView" 
        @unlock-screen="showIOSLoginView = false" 
        :current-app-name="currentApp!"
        background-image="/img/wallpapers/ios-wallpaper.png"
        :top-bar="desktopTopBar"
        :apps="[]"
      />
<!--      <StartInstall />-->

<!--      <IOSCursor v-if="!showIOSLoginView" />-->
    </IOSDesktop>

    <MacOsCursor white v-else>
      <Installation @installed="hasInstalled($event)" />
    </MacOsCursor>
  </template>
</template>

<script setup lang="ts">
import MacOsDock from "@/components/macos/MacOsDock.vue";
import MacDesktop from "@/components/macos/MacDesktop.vue";
import IOSDesktop from '@/components/ios/IOSDesktop.vue';
import MacOsCursor from '@/components/macos/MacOsCursor.vue';
import MacOsAlert from '@/components/macos/MacOsAlert.vue';
import MacOsSystemLoader from '@/components/macos/MacOsSystemLoader.vue';
import Installation from '@/components/Installation.vue';
import MacOsLoginView from '@/components/macos/LoginView.vue';
import IOSUnlockView from '@/components/ios/UnlockView.vue';
import Checkbox from '@/components/macos/Checkbox.vue';
import Notification from '@/components/utilities/macos/Notification.vue';

import iconCdInstall from '@/assets/icon-cd-install-mac.png';
import appstore from '@/assets/dock/appstore.png';

import { ref, computed, reactive, watch } from "vue";
import { useNetwork, useBattery, useWindowSize } from "@vueuse/core";
import { APPLICATION, useCurrentApp } from "@/hooks/apps";
import { useInstalled } from '@/hooks/installed';
import { useNotifications } from '@/hooks/notifications';
import { useSystemLoading } from "@/hooks/system-loading";
import { useScreens } from "@/hooks/screens";
import { useDark } from "@/hooks/theme";
import { useMobile, useTablet } from '@/hooks/device-type';

const { isOnline } = useNetwork();
const { isDark } = useDark();
const { charging, chargingTime, dischargingTime, level } = useBattery();
const { width: screenWidth } = useWindowSize();
const { currentApp, setCurrentApp } = useCurrentApp();
const { installed, skipped: installSkipped, isInstalled, isNotInstalled, isSkipped, isNotSkipped } = useInstalled();
const { notifications, createNotification, deleteNotification, closeNotification, cleanNotifications } = useNotifications();
const { systemLoading, setSystemLoading } = useSystemLoading();
const { screenId/*, screenNumber*/, isMultiScreen, post, on } = useScreens();

setCurrentApp(APPLICATION.FINDER);

const showIOSLoginView = ref(true);

watch(showIOSLoginView, (showLoginView) => {
  if (!showLoginView) {
    // setTimeout(() => {
    //   showIOSLoginView.value = true;
    // }, 5000);
  }
})

const wallpaper = ref('/img/wallpapers/wallpaper-install-macos.jpg');
const connected = ref(false);
const displayAlert = ref(false);
const displayAlertAppInDev = ref(true);
const displayInstallNotify = ref(true);
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

const isMobile = useMobile();
const isTablet = useTablet();

const showMobileVersion = computed(() => isMobile.value || isTablet.value || screenWidth.value <= 950);

const showAlert = () => {
  displayAlert.value = true;
};
const hideAlert = () => {
  displayAlert.value = false;
};
const hasInstalled = (e: {install_skipped: boolean}) => {
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
const installNotifyOpened = computed(() => (installSkipped.value === null
    ? false : installSkipped.value) && displayInstallNotify.value);

const initNotifsQueue = () => {
  cleanNotifications();

  createNotification({
    image: iconCdInstall,
    title: 'Installez macOS',
    content: `Une npuvelle version de macOS est disponible`,
    opened: installNotifyOpened,
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
          displayInstallNotify.value = false;
          deleteNotification(0);
        }
      }
    ]
  });

  createNotification({
    index: (installNotifyOpened.value ? 1 : 0),
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
const handleSystemLoaded = (initNotifs: boolean) => {
  setSystemLoading(false);

  // console.log(
  //     initNotifs,
  //     isMultiScreen.value,
  //     screenId.value,
  //     isMultiScreen.value && screenId.value !== 0,
  //     initNotifs || isMultiScreen.value && screenId.value !== 0
  // );
  (initNotifs || isMultiScreen.value && screenId.value === 0) && initNotifsQueue();
};
const connectUser = () => {
  connected.value = true;

  if (screenId.value === 0) {
    initNotifsQueue();

    isMultiScreen.value && post('log-screen');
  }
}

on('log-screen', connectUser)

const desktopTopBar = reactive<DesktopTopBar>({
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

watch(isOnline, (isOnline) => (desktopTopBar.network.wifi.online = isOnline));
watch(
    [charging, chargingTime, dischargingTime, level],
    ([charging, chargingTime, dischargingTime, level]) => {
        desktopTopBar.battery.charging = charging;
        desktopTopBar.battery.chargingTime = chargingTime;
        desktopTopBar.battery.dischargingTime = dischargingTime;
        desktopTopBar.battery.level = level;
    });

watch(() => alertAppInDev.dontShowAgain, () => {
  if (alertAppInDev.dontShowAgain) {
    localStorage.setItem('dontShowWarningAlertAgain', '1');
  } else {
    localStorage.removeItem('dontShowWarningAlertAgain');
  }
})
</script>

<script lang="ts">
  export type Menu = {
    name?: string,
    click?: (e?: MouseEvent) => void,
    children?: Menu[],
    type?: string,
    shortcut?: string
  };

  type DesktopTopBar = {
    network: {
      wifi: {
        online: boolean
      }
    },
    battery: {
      charging: boolean,
      chargingTime: number,
      dischargingTime: number,
      level: number,
    },
    menu: Menu[]
  };
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

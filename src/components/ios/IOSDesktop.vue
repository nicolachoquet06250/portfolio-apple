<template>
<!--  Ne plus afficher le curseur -->
  <slot></slot>

  <div class="desktop">
    <top-bar :top-bar="topBar" show-hour />

    <main class="grid">
      <div role="row" v-for="(row, i) in gridDesktopApps" :key="i">
        <div role="cell" v-for="(cel, j) in row" :key="j">
          <template v-if="cel !== null">
            <img :src="cel.icon" alt="icon" v-if="typeof cel.icon === 'string'">
            <component :is="cel.icon" :width="70" :height="70" v-else />

            <span> {{ cel.label }} </span>
          </template>
        </div>
      </div>
    </main>

    <div class="dock-container">
      <dock />
    </div>
  </div>
</template>

<script setup>
import {computed, onMounted, defineProps, watch, ref} from 'vue';
import {useScreenLocker} from "@/hooks/screen-locker";
import {useDocumentVisibility, useWindowSize} from "@vueuse/core";
import TopBar from "@/components/ios/TopBar.vue";
import Dock from "@/components/ios/Dock.vue";
import FaceTime from "@/components/ios/icons/FaceTime.vue";
import Calendar from "@/components/ios/icons/Calendar.vue";
import Photo from "@/components/ios/icons/Photo.vue";
import Camera from "@/components/ios/icons/Camera.vue";
import Mails from "@/components/ios/icons/Mails.vue";
import Notes from "@/components/ios/icons/Notes.vue";
import Remembers from "@/components/ios/icons/Remembers.vue";
import Clock from "@/components/ios/icons/Clock.vue";
import TV from "@/components/ios/icons/TV.vue";
import Podcasts from "@/components/ios/icons/Podcasts.vue";
import Store from "@/components/ios/icons/Store.vue";
import Health from "@/components/ios/icons/Health.vue";
import Maps from "@/components/ios/icons/Maps.vue";
import Settings from "@/components/ios/icons/Settings.vue";

const props = defineProps({
  backgroundImage: String,
  apps: Array,
  currentAppName: String,
  topBar: {
    network: () => ({
      wifi: () => ({
        online: Boolean,
      }),
    }),
    battery: () => ({
      charging: Boolean,
      chargingTime: Number,
      dischargingTime: Number,
      level: Number,
    })
  }
});
const emit = defineEmits(['lock-screen']);

useScreenLocker();
const { height, width } = useWindowSize({
  listenOrientation: true
});
const isVisible = useDocumentVisibility();

watch(isVisible, isVisible => {
  if (isVisible === 'hidden') {
    console.log('lock screen')
    emit('lock-screen');
  }
})

const rows = ref(6);
const cols = ref(4);
const desktopApps = ref([
  {
    icon: FaceTime,
    label: 'FaceTime',
    app: 'FaceTime'
  },
  {
    icon: Calendar,
    label: 'Calendrier',
    app: 'Calendrier'
  },
  {
    icon: Photo,
    label: 'Galerie',
    app: 'Galerie'
  },
  {
    icon: Camera,
    label: 'Appareil',
    app: 'Photo'
  },
  {
    icon: Mails,
    label: 'Mails',
    app: 'Mails'
  },
  {
    icon: Notes,
    label: 'Notes',
    app: 'Notes'
  },
  {
    icon: Remembers,
    label: 'Rappels',
    app: 'Rappels'
  },
  {
    icon: Clock,
    label: 'Horloge',
    app: 'Horloge'
  },
  {
    icon: TV,
    label: 'Apple TV',
    app: 'Apple TV'
  },
  {
    icon: Podcasts,
    label: 'Podcasts',
    app: 'Podcasts'
  },
  {
    icon: Store,
    label: 'App Store',
    app: 'App Store'
  },
  {
    icon: Maps,
    label: 'Maps',
    app: 'Maps'
  },
  {
    icon: Health,
    label: 'Health',
    app: 'Health'
  },
  {
    icon: Settings,
    label: 'Paramètres',
    app: 'Paramètres'
  },
]);
const gridDesktopApps = computed(() => {
  let cmp = 0;
  return Array.from((new Array(rows.value)).keys())
      .map(i => Array.from((new Array(cols.value)).keys())
          .map(j => {
            const r = desktopApps.value[cmp] ?? null;
            cmp++;
            return r;
          }));
});

watch([width, height], ([width, height]) => {
  if (width > height) {
    rows.value = 3;
    cols.value = 7;

    if (height < 450) {
      rows.value = 1;
      cols.value = 9;
    }
  }
  else {
    rows.value = 6;
    cols.value = 4;
  }
});

const backgroundImage = computed(() => `url(${props.backgroundImage})`);

onMounted(() => {
  if (width.value > height.value) {
    rows.value = 3;
    cols.value = 7;

    if (height.value < 450) {
      rows.value = 1;
      cols.value = 9;
    }
  }
  else {
    rows.value = 6;
    cols.value = 4;
  }
});
</script>

<style lang="scss" scoped>
  .desktop {
    height: 100%;
    background: v-bind(backgroundImage);

    display: flex;
    flex-direction: column;
  }

  .grid {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;

    column-gap: 10px;
    row-gap: 10px;

    div {
      background: none;
      color: white;
    }

    [role="row"] {
      width: calc(100% - 10px);
      height: calc((100% - 150px) / 6);
      flex: 1;
      display: flex;
      flex-direction: row;
      justify-content: space-around;
      align-items: center;

      [role="cell"] {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        img {
          width: 70px;
          height: 70px;
          border-radius: 20px;
        }

        span {
          display: inline-block;
          text-align: center;
          padding-top: 5px;
        }
      }
    }
  }

  .dock-container {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background: none;
    position: relative;
    padding-bottom: 10px;
  }
</style>

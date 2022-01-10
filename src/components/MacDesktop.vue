<template>
  <div id="desktop">
    <div class="top-bar">
      <div class="menu">
          <ul>
              <li>
                  <i class="fab fa-apple"></i>
              </li>

              <li>
                  {{ currentAppName }}
              </li>
          </ul>
      </div>

      <div class="connectivity">
        <ul>
          <li>
            <i class="fas fa-wifi" v-if="topBar.network.wifi.online"></i>
          </li>

          <li>
            {{ topBar.batterie.level * 100 }}%
            <i
              :class="{
                fas: true,
                'fa-battery-empty': topBar.batterie.level * 100 === 0,
                'fa-battery-quarter': topBar.batterie.level * 100 <= 25,
                'fa-battery-half': topBar.batterie.level * 100 === 50,
                'fa-battery-full': topBar.batterie.level * 100 > 50,
              }"
              :title="topBar.batterie.dischargingTime"
              v-if="!topBar.batterie.charging"
            ></i>
            <span v-else :title="topBar.batterie.chargingTime"></span>
          </li>

          <li>
            {{ formatedDate }}
          </li>

          <li>
            <button>
              <i class="fas fa-search"></i>
            </button>
          </li>

          <li>
            <img :src="siriIcon" />
          </li>

          <li>
            <i class="fas fa-list"></i>
          </li>
        </ul>
      </div>
    </div>

    <slot></slot>
  </div>
</template>

<script setup>
import { defineProps, ref, computed } from "vue";
import { CURSOR, useCursor } from '@/hooks/cursor';

import siriIcon from "@/assets/icons/siri.png";

const { setCursor } = useCursor();

const props = defineProps({
  backgroundImage: String,
  apps: Array,
  currentAppName: String,
  topBar: () => ({
    network: () => ({
      wifi: () => ({
        online: Boolean,
      }),
    }),
    batterie: () => ({
      charging: Boolean,
      chargingTime: Number,
      dischargingTime: Number,
      level: Number,
    }),
  }),
});

const topBarFontSize = computed(() => '10px');
const backgroundImage = computed(() => `url(${props.backgroundImage})`);
const formatedDate = ref(
  new Date().toLocaleDateString("fr-FR", {
    weekday: "short",
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
  })
);

setInterval(() => {
  formatedDate.value = new Date(Date.now()).toLocaleDateString("fr-FR", {
    weekday: "short",
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
  });
}, 1000);
</script>

<style lang="scss" scoped>
#desktop {
  height: 100vh;
  background: v-bind(backgroundImage);
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;

  .top-bar {
    background: white;
    display: flex;
    font-size: v-bind(topBarFontSize);

    .menu {
        flex: 2;

        ul {
            margin: 0;
            padding-left: 0;
            display: flex;
            flex-direction: row;
            justify-content: flex-start;
            align-items: center;
            list-style: none;

            li {
                padding: 5px;

                &:first-child {
                    padding-left: 10px;
                }
            }
        }
    }

    .connectivity ul {
      display: flex;
      flex-direction: row;
      justify-content: space-around;
      align-items: center;
      list-style: none;
      margin: 0;

      li {
        padding: 5px;

        button {
            font-size: v-bind(topBarFontSize);
        }

        img {
            width: 15px;
        }
      }
    }
  }
}
</style>

<template>
  <div id="desktop" @contextmenu.prevent.stop="showContextMenu()">
    <div class="top-bar">
      <div class="menu">
          <ul>
              <li>
                  <i class="fab fa-apple"></i>
              </li>

              <li>
                  {{ currentAppName.substr(0, 1).toUpperCase() }}{{ currentAppName.substr(1, currentAppName.length - 1) }}
              </li>

              <li>
                  <ul>
                      <li v-for="(item, i) of topBar.menu" 
                          :key="item.name"
                          :class="`menu-item menu-item-${i}`" 
                          clickable @click="handleMenuClick($event, item.name)">
                          {{ item.name }}
                          
                          <ul :class="`sub-menu ${selectedMenu === item.name ? 'show' : ''}`" v-if="item.children.length > 0">
                            <li v-for="(_item, _i) of (item?.children ?? [])" :key="_i" @click="selectSubMenuItem(_item, $event)">
                              {{ _item.name }}
                            </li>
                          </ul>
                      </li>
                  </ul>
              </li>
          </ul>
      </div>

      <div class="connectivity">
        <ul>
          <li>
            <i class="fas fa-wifi" v-if="topBar.network.wifi.online"></i>
          </li>

          <li>
            {{ topBar.battery.level * 100 }}%
            <i
              :class="{
                fas: true,
                'fa-battery-empty': !topBar.battery.charging && topBar.battery.level * 100 === 0,
                'fa-battery-quarter': !topBar.battery.charging && topBar.battery.level * 100 <= 25,
                'fa-battery-half': !topBar.battery.charging && topBar.battery.level * 100 === 50,
                'fa-battery-full': !topBar.battery.charging && topBar.battery.level * 100 > 50,
                'fa-car-battery': topBar.battery.charging
              }"
              :title="topBar.battery.dischargingTime"
            ></i>
          </li>

          <li>
            {{ formattedDate }}
          </li>

          <li>
            <button class="search-btn">
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

    <MacApplication v-for="app of Object.keys(openedApplications)" 
                    :key="openedApplications[app].name"
                    :opened="openedApplications[app].state === APPLICATION_STATE.OPENED"
                    :app-name="openedApplications[app].name"
                    :has-header="AppHeaderComponent !== null"
                    :app-code="app" />
  </div>
</template>

<script setup>
import { defineProps, ref, computed, watch } from "vue";
import { APPLICATION_STATE, useOpenedApplications, useCurrentApp } from '@/hooks/apps';
import MacApplication from '@/components/MacApplication.vue';

import siriIcon from "@/assets/icons/siri.png";

const { currentApp } = useCurrentApp();
const { openedApplications, initApplicationHistory } = useOpenedApplications();

initApplicationHistory();

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
    battery: () => ({
      charging: Boolean,
      chargingTime: Number,
      dischargingTime: Number,
      level: Number,
    }),
    menu: Array
  }),
});

const topBarFontSize = computed(() => '10px');
const backgroundImage = computed(() => `url(${props.backgroundImage})`);
const formattedDate = ref(
  new Date().toLocaleDateString("fr-FR", {
    weekday: "short",
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
  })
);

setInterval(() => {
  formattedDate.value = new Date(Date.now()).toLocaleDateString("fr-FR", {
    weekday: "short",
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
  });
}, 1000);

const oldSecondClass = ref(null);
const nbIdenticSecondClass = ref(0);
const selectedMenu = ref('');

const handleMenuClick = (e, name) => {
  const firstClass = e.target.classList[0];
  const secondClass = e.target.classList[1];

  if (firstClass === 'menu-item') {
    Array.from(document.querySelectorAll('.menu .menu-item')).map(c => {
      c.style.backgroundColor = 'white';
      c.style.color = 'unset';
    });

    if (secondClass !== oldSecondClass.value) {
      e.target.style.backgroundColor = 'blue';
      e.target.style.color = 'white';
      nbIdenticSecondClass.value = 0;
      selectedMenu.value = name;
    } else {
      if (nbIdenticSecondClass.value % 2 === 1) {
        e.target.style.backgroundColor = 'blue';
        e.target.style.color = 'white';
        selectedMenu.value = name;
      } else {
        e.target.style.backgroundColor = 'white';
        e.target.style.color = 'unset';
        selectedMenu.value = '';
      }
      nbIdenticSecondClass.value++;
    }
    
    oldSecondClass.value = secondClass;
  }
};

const showContextMenu = () => {
  console.log('context menu on desktop');
};

const selectSubMenuItem = (item, e) => {
  selectedMenu.value = '';
  e.target.parentElement.parentElement.style.backgroundColor = 'white';
  e.target.parentElement.parentElement.style.color = 'black';
  return item?.click(e) ?? false;
};
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
    height: 25px;

    .menu {
        flex: 2;

        ul {
            height: 100%;
            margin: 0;
            padding-left: 0;
            display: flex;
            flex-direction: row;
            justify-content: flex-start;
            align-items: center;
            list-style: none;

            li {
                height: 100%;
                padding: 5px;
                padding-top: 0;
                padding-bottom: 0;
                display: flex;
                justify-content: center;
                align-items: center;

                &:first-child {
                    padding-left: 10px;

                    * {
                      font-size: 20px;
                    }
                }

                ul {
                    display: flex;
                    flex-direction: row;

                    li.menu-item {
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        position: relative;

                        &:first-child {
                          padding-left: 5px;
                        }

                        ul.sub-menu {
                            display: none;
                            
                            &.show {
                                display: flex;
                            }

                            flex-direction: column;
                            justify-content: center;
                            align-items: flex-start;
                            position: absolute;
                            top: 100%;
                            left: 0;
                            background: #DFDDE0;
                            border-bottom-left-radius: 5px;
                            border-bottom-right-radius: 5px;
                            height: auto;

                            li {
                                padding: 0;
                                padding-left: 5px;
                                padding-right: 10px;
                                padding-top: 5px;
                                width: max-content;
                                display: flex;
                                justify-content: flex-start;
                                align-items: flex-start;
                            
                                &:last-child {
                                  padding-bottom: 5px;
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    .connectivity {
      margin-right: 5px;

      ul {
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
              background: none;
              border: none;
          }

          img {
              width: 15px;
          }
        }
      }
    }
  }
}
</style>
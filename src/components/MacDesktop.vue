<template>
  <div id="desktop" :class="{ dark: isDark }" @contextmenu.prevent.stop="showContextMenu()">
      <div class="top-bar">
          <div class="menu">
              <ul>
                  <li>
                      <button @click="selectedMenu = selectedMenu === '' ? 'apple' : ''" :class="{
                        active: selectedMenu === 'apple'
                      }">
                          <i class="fab fa-apple"></i>
                      </button>

                      <ul class="sub-menu" ref="appleMenuRef">
                          <li v-for="(appleMenuItem, i) of appleMenu" :key="i" >
                              <button v-if="appleMenuItem.name"
                                      @click.prevent.stop="selectSubMenuItem(appleMenuItem, $event)">
                                  <span>
                                      {{ appleMenuItem.name }}
                                  </span>

                                  <span v-if="appleMenuItem.shortcut">
                                      {{ appleMenuItem.shortcut }}
                                  </span>
                              </button>

                              <template v-else>
                                  <hr />
                              </template>
                          </li>
                      </ul>
                  </li>

                  <li>
                      {{ currentAppName.substr(0, 1).toUpperCase() }}{{ currentAppName.substr(1, currentAppName.length - 1) }}
                  </li>

                  <li>
                      <ul>
                          <li v-for="(item, i) of topBar.menu" :key="item.name"
                              :class="{
                                  'menu-item': true,
                                  [`menu-item-${i}`]: true
                              }">
                              <button @click="selectedMenu = item.name; item.click?.($event)"
                                      :class="{
                                          active: selectedMenu === item.name
                                      }">
                                  {{ item.name }}
                              </button>
                              
                              <ul class="sub-menu" v-if="item.children.length > 0" 
                                  :ref="refs[i]">
                                  <li v-for="(_item, _i) of (item?.children ?? [])" :key="_i">
                                      <button @click="selectSubMenuItem(_item, $event)">
                                          {{ _item.name }}
                                      </button>
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
                  <button class="double-icon">
                      <i class="fas fa-toggle-off"></i>
                      <i class="fas fa-toggle-on"></i>
                  </button>
              </li>

              <li>
                <button class="search-btn">
                  <i class="fas fa-search"></i>
                </button>
              </li>
              
              <li>
                  <i class="fas fa-wifi" v-if="topBar.network.wifi.online"></i>
              </li>

              <li>
                {{ formattedDate }}
              </li>

              <li>
                <img :src="siriIcon" />
              </li>
            </ul>
          </div>
      </div>

      <slot></slot>

      <ToogleLiteDarkMode />

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
import { useDark } from '@/hooks/theme';
import { onClickOutside } from '@vueuse/core';
import MacApplication from '@/components/MacApplication.vue';
import ToogleLiteDarkMode from '@/components/ToogleLiteDarkMode.vue';
import siriIcon from "@/assets/icons/siri.png";

const { currentApp } = useCurrentApp();
const { openedApplications, initApplicationHistory } = useOpenedApplications();

initApplicationHistory();

const { isDark } = useDark();

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

const refs = props.topBar.menu.map(() => ref(null));

const appleMenu = ref([
    {
      name: 'About this Mac',
      click() {
        console.log('about')
      }
    },
    {
      type: 'separator'
    },
    {
      name: 'System Preferences...'
    },
    {
      name: 'App Store'
    },
    {
      type: 'separator'
    },
    {
      name: 'Recent Items',
      children: []
    },
    {
      type: 'separator'
    },
    {
      name: 'Force Quit Finder',
      shortcut: 'ctrl+Q'
    },
    {
      type: 'separator'
    },
    {
      name: 'Sleep'
    },
    {
      name: 'Restart'
    },
    {
      name: 'Shut Down'
    },
    {
      type: 'separator'
    },
    {
      name: 'Lock Screen',
      shortcut: 'ctrl+maj+L'
    },
    {
      name: 'Log Out Big Sur',
      shortcut: 'ctrl+maj+Q'
    }
]);
const appleMenuRef = ref(null);
onClickOutside(appleMenuRef, () => (selectedMenu.value = ''));

const topBarFontSize = computed(() => '1rem');
const backgroundImage = computed(() => `url(${props.backgroundImage})`);
const selectedMenu = ref('');
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

const showContextMenu = () => {
  console.log('context menu on desktop');
};

const selectSubMenuItem = (item, e) => {
  const r = item?.click?.(e) ?? false;
  selectedMenu.value = '';
  return r;
};

watch(refs, () => {
  refs.map(m => onClickOutside(m, () => (selectedMenu.value = '')))
});
</script>

<style lang="scss" scoped>
#desktop {
    height: 100vh;
    background-image: v-bind(backgroundImage);
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;

    &.dark {
        -webkit-filter : brightness(70%); /* Chrome, Safari, Opera */
        filter : brightness(70%);

        .top-bar {
            background: rgba(0, 0, 0, .1);

            .menu ul li button {
                &:active, &:hover, &.active {
                    background-color: rgba(0, 0, 0, .05);
                }
            }
        }
    }

    .top-bar {
        background: rgba(255, 255, 255, .1);
        backdrop-filter: blur(1.5rem);
        display: flex;
        font-size: v-bind(topBarFontSize);

        * {
            color: white;
        }

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

                    ul.sub-menu {
                        display: none;
                    }

                    button {
                        padding-left: 15px;
                        padding-right: 15px;
                        background: transparent;
                        border: 0;
                        border-radius: 5px;
                        margin-top: 2px;
                        margin-bottom: 2px;

                        &:active, &:hover, &.active {
                            background-color: rgba(255, 255, 255, .05);
                            backdrop-filter: blur(11.5rem);

                            + ul.sub-menu {
                                display: flex;
                                flex-direction: column;
                                justify-content: center;
                                align-items: flex-start;
                                position: absolute;
                                top: 100%;
                                left: 0;
                                margin-left: 10px;
                                margin-top: 5px;
                                background: rgba(255, 255, 255, .7);
                                backdrop-filter: blur(3rem);
                                border-radius: 5px;
                                height: auto;
                                min-width: 350px;

                                li {
                                    padding: 0;
                                    padding-left: 5px;
                                    padding-right: 10px;
                                    padding-top: 5px;
                                    width: calc(100% - 5px);
                                    display: flex;
                                    flex-direction: row;
                                    justify-content: flex-start;
                                    align-items: center;

                                    &:last-child {
                                        padding-bottom: 15px;
                                    }

                                    button {
                                        display: flex;
                                        flex-direction: row;
                                        justify-content: space-between;
                                        align-items: center;
                                        flex: 1;
                                        padding-top: 10px;
                                        padding-bottom: 10px;
                                        margin-right: 10px;
                                        margin-left: 10px;

                                        &:active, &:focus, &:hover {
                                          background-color: rgba(255, 255, 255, .1);
                                        }

                                        span:nth-child(2) {
                                          color: rgba(0, 0, 0, .4);
                                        }
                                    }

                                    * {
                                        color: black;
                                    }

                                    hr {
                                      width: 90%;
                                      border: 1px solid rgba(0, 0, 0, .1);
                                      margin-top: 0;
                                      margin-bottom: 0;
                                    }
                                }
                            }
                        }
                    }

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

                            * {
                              font-size: v-bind(topBarFontSize);
                            }

                            &:first-child {
                              padding-left: 5px;
                            }

                            button {
                              padding-top: 5px;
                              padding-bottom: 5px;
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
                height: 100%;

                li {
                    padding: 5px;
                    padding-left: 5px;
                    padding-right: 5px;

                    button {
                        font-size: v-bind(topBarFontSize);
                        background: none;
                        border: none;

                        &.double-icon {
                          display: flex;
                          flex-direction: column;
                          justify-content: center;
                          align-items: center;

                          i {
                            font-size: .7rem;
                          }
                        }
                    }

                    img {
                        width: 20px;
                    }
                }
            }
        }
    }
}
</style>
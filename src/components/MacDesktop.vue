<template>
  <div id="desktop" :class="{ dark: isDark }" 
        @contextmenu.prevent.stop="showDesktopContextMenu($event)">
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
                        <button @click="toggleBatteryData()">
                            <i :class="{
                                    fas: true,
                                    'fa-battery-empty': !topBar.battery.charging && topBar.battery.level * 100 === 0,
                                    'fa-battery-quarter': !topBar.battery.charging && topBar.battery.level * 100 <= 25,
                                    'fa-battery-half': !topBar.battery.charging && topBar.battery.level * 100 === 50,
                                    'fa-battery-full': !topBar.battery.charging && topBar.battery.level * 100 > 50 || topBar.battery.charging && topBar.battery.chargingTime === 0,
                                    'fa-car-battery': topBar.battery.charging && topBar.battery.chargingTime > 0
                                }" :title="topBar.battery.dischargingTime"></i>
                        </button>
                    </li>
                    
                    <li>
                        <button class="double-icon" 
                                @click="toggleSettingsHub">
                            <i class="fas fa-toggle-off"></i>

                            <i class="fas fa-toggle-on"></i>
                        </button>
                    </li>

                    <li>
                        <button class="search-btn" @click="openSpotlight = true">
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

        <div class="new-directory-overlay" v-if="displayNewDirectory" @click="createDirectory()"></div>

        <div class="settings-hub" ref="settingsHub">
            <div>
                <section class="network-container">
                    <ul>
                        <li>
                            <div>
                                <i class="fas fa-wifi" v-if="topBar.network.wifi.online"></i>
                            </div>

                            <div>
                                <span> Wi-Fi </span>
                                <span> Bbox-7C3F </span>
                            </div>
                        </li>
                    </ul>
                </section>

                <section class="dark-light-mode-container">
                    <ToogleLiteDarkMode :color="toggleLightDarkModeButtonTextColor" />
                </section>
            </div>

            <div>
                <section class="light-container">
                    <span>
                        Display
                    </span>

                    <input type="range" class="light-range" 
                            :value="lightValue" 
                            @input="lightValue = $event.target.value" 
                            max="100" style="width: 100%;" />

                    <i class="far fa-sun" style="z-index: -1;"></i>
                </section>
            </div>

            <div>
                <section class="music-container">
                    <img :src="musicIcon" />

                    <span>
                        The best songs of 2020
                    </span>

                    <div>
                        <button>
                            <i class="fas fa-play"></i>
                        </button>

                        <button>
                            <i class="fas fa-forward"></i>
                        </button>
                    </div>
                </section>
            </div>

            <div>
                <section class="sound-container">
                    <span>
                        Sound
                    </span>

                    <div style="width: 100%;">
                        <input type="range" class="sound-range"
                                :value="soundValue" 
                                @input="soundValue = $event.target.value" 
                                max="100" style="width: 100%;" />

                        <i class="fas fa-volume-mute"></i>

                        <button>
                            <i class="fas fa-podcast"></i>
                        </button>
                    </div>
                </section>
            </div>
        </div>

        <div class="battery-data" ref="batteryData">
            <div>
                <span> Batterie </span>

                <span> {{ topBar.battery.level * 100 }}% </span>
            </div>

            <div>
                <span>
                    Source d'alimentation: {{ alimSource }}
                </span>

                <template v-if="topBar.battery.charging">
                    <span v-if="topBar.battery.chargingTime > 0">
                        <!--1 h 36 mn remaining-->
                        {{ topBar.battery.chargingTime }}s restantes
                    </span>

                    <span v-else>
                        Batterie chargée
                    </span>
                </template>

                <template v-else>
                    <span>
                        <!--1 h 36 mn remaining-->
                        {{ topBar.battery.dischargingTime }}s restantes
                    </span>
                </template>
            </div>
        </div>

        <ul class="context-menu" v-if="displayContextMenu" ref="contextMenu">
            <template v-if="(contextMenuItems[0] instanceof Array)">
                <template v-for="(items, index) of contextMenuItems" :key="index">
                    <li v-for="(item, i) of items" :key="i">
                        <button @click="item.click?.($event)">
                            {{ item.name }}
                        </button>
                    </li>

                    <li v-if="index < contextMenuItems.length - 1">
                        <hr />
                    </li>
                </template>
            </template>

            <template v-else>
                <li v-for="(item, i) of contextMenuItems" :key="i">
                    <button @click="item.click?.($event)">
                        {{ item.name }}
                    </button>
                </li>
            </template>
        </ul>

        <div class="desktop-grid">
            <div class="desktop-grid-column" 
                 v-for="(treeColumn, x) of treeToGrid" :key="x">
                <button class="desktop-grid-cel" 
                        v-for="(treeCel, y) of treeColumn" :key="y"
                        @click="selectDirectory(treeCel, { x, y })"
                        :ref="el => { if(selectedDirectory === treeCel.name) { selectedDirectoryRef = el } }"
                        @contextmenu.prevent.stop="showDirectoryContextMenu({
                            event: $event,
                            id: treeCel.id,
                            x, y
                        })">
                    <img :src="iconDirectory" />

                    <span> {{ treeCel.name }} </span>
                </button>

                <button class="desktop-grid-cel desktop-grid-cel_new-directory" 
                        v-if="x === treeToGrid.length - 1 && treeToGrid[x].length < 5 && displayNewDirectory"
                        :ref="el => { if (el) { newDirectoryRef = el } else { newDirectoryRef = null } }">
                    <img :src="iconDirectory" />

                    <span> 
                        <input type="text" v-model="newDirectoryName" />
                    </span>
                </button>
            </div>

            <div class="desktop-grid-column" 
                 v-if="(treeToGrid.length === 0 || treeToGrid[treeToGrid.length - 1].length > 5) && displayNewDirectory">
                <button class="desktop-grid-cel desktop-grid-cel_new-directory"
                        :ref="el => { if (el) { newDirectoryRef = el } else { newDirectoryRef = null } }">
                    <img :src="iconDirectory" />

                    <span> 
                        <input type="text" v-model="newDirectoryName" />
                    </span>
                </button>
            </div>
        </div>

        <slot></slot>

        <MacApplication v-for="app of Object.keys(openedApplications)" 
                        :key="openedApplications[app].name"
                        :opened="openedApplications[app].state === APPLICATION_STATE.OPENED"
                        :app-name="openedApplications[app].name"
                        :has-header="AppHeaderComponent !== null"
                        :app-code="app" />

        <Spotlight :open="openSpotlight" @close="openSpotlight = false" />
  </div>
</template>

<script setup>
import { defineProps, ref, computed, watch, reactive } from "vue";
import { APPLICATION_STATE, useOpenedApplications, useCurrentApp } from '@/hooks/apps';
import { useAuthUser } from '@/hooks/account';
import { useDatabase, TABLES, getParams } from '@/hooks/database';
import { useInstalled } from '@/hooks/installed';
import { useDark } from '@/hooks/theme';
import { useContextualMenu } from '@/hooks/contextual-menu';
import { onClickOutside, useToggle, onKeyUp, useMouse } from '@vueuse/core';
import MacApplication from '@/components/MacApplication.vue';
import ToogleLiteDarkMode from '@/components/ToogleLiteDarkMode.vue';
import Spotlight from '@/components/Spotlight.vue';
import siriIcon from "@/assets/icons/siri.png";

import musicIcon from '@/assets/icons/icon-Music.png';
import iconAppleTV from '@/assets/icons/icon-AppleTV.png';
import iconDirectory from '@/assets/icons/icon-directory.png';
import iconMessages from '@/assets/icons/icon-Messages.png';
import iconMp4 from '@/assets/icons/icon-mp4.png';
import iconPages from '@/assets/icons/icon-Pages.png';
import iconPng from '@/assets/icons/icon-png.png';
import iconUnknownFile from '@/assets/icons/icon-unknownFile.png';

const { x: mouseX, y: mouseY } = useMouse();
const { user } = useAuthUser();
const { currentApp } = useCurrentApp();
const { setContextMenu, contextMenu: contextMenuItems } = useContextualMenu();
const { openedApplications, initApplicationHistory } = useOpenedApplications();
const { installed } = useInstalled();
const { onSuccess, results: treeStructure } = useDatabase(...getParams(TABLES.TREE_STRUCTURE));

if (installed.value) {
    onSuccess(({ context: { getAllValues } }) => getAllValues()).connect();
}

const treeToGrid = ref([]);
watch(treeStructure, () => {
    const maxPerColumn = 5;

    const tmp = [];
    let cmp = 0;

    let x = 0;
    let y = 0;
    for (const c of treeStructure.value) {
        if (c.parent === `/${user.value.account_name}/Desktop`) {
            if (cmp === 0) {
                tmp.push([c]);

                cmp++;
                y++;
            } else if (cmp < maxPerColumn) {
                const lastElement = tmp.pop();
                lastElement.push(c);
                tmp.push(lastElement);

                cmp++;
                y++;
            } else if (cmp === maxPerColumn) {
                const lastElement = tmp.pop();
                lastElement.push(c);
                tmp.push(lastElement);

                cmp = 0;
                y = 0;
                x++;
            }
        } else {
            continue;
        }
    }

    treeToGrid.value = tmp;
});

const displayNewDirectory = ref(false);
const newDirectoryName = ref('new directory');
const newDirectoryRef = ref(null);
watch(newDirectoryRef, () => {
    if (newDirectoryRef.value) {
        newDirectoryRef.value.querySelector('input[type=text]').select();
    }
});

const createDirectory = () => {
    onSuccess(({ context: { add, getAllValues } }) => {
        add({
            name: newDirectoryName.value,
            parent: `/${user.value.account_name}/Desktop`,
            type: 'directory',
            extention: null,
            content: null,
            creation_date: new Date(),
            opened_date: new Date(),
            updated_date: new Date(),
            user_id: user.value.id
        });

        getAllValues();

        displayNewDirectory.value = false;
        newDirectoryName.value = 'new directory';
    }).connect();
};
onKeyUp('Enter', createDirectory);
onKeyUp('Escape', () => {
    displayNewDirectory.value = false;
    newDirectoryName.value = 'new directory';
})
const addDirectory = () => {
    displayNewDirectory.value = true;
    displayContextMenu.value = false;
};
const selectedDirectory = ref('');
const selectedDirectoryId = ref(null);
const selectedDirectoryPosition = reactive({
    x: 0,
    y: 0
});
const selectedDirectoryRef = ref(null);
const selectDirectory = (treeCel, { x, y }) => {
    selectedDirectory.value = treeCel.name;
    selectedDirectoryId.value = treeCel.id;
    selectedDirectoryPosition.x = x;
    selectedDirectoryPosition.y = y;
}
onClickOutside(selectedDirectoryRef, () => selectedDirectory.value = '');
onKeyUp('Delete', () => {
    onSuccess(({ context: { remove, getAllValues } }) => {
        remove(selectedDirectoryId.value);
        getAllValues();
    }).connect();
});

const showDirectoryContextMenu = e => {
    console.log('context menu on directory');

    setContextMenu([
        {
            name: 'Remove',
            click() {
                console.log('supprimer un répertoire');
                //selectedDirectoryAction.value = 'remove';

                onSuccess(({ context: { remove, getAllValues } }) => {
                    remove(e.id);
                    getAllValues();
                }).connect();

                displayContextMenu.value = false;
            }
        }
    ]);

    contextMenuPosition.x = mouseX.value;
    contextMenuPosition.y = mouseY.value;
    displayContextMenu.value = true;
};

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

const toggleLightDarkModeButtonTextColor = ref(isDark.value ? 'white' : 'black');

const alimSource = computed(() => props.topBar.battery.charging ? 'Secteur' : 'batterie');

const openSpotlight = ref(false);

const lightValue = ref(50);
const displayLightValue = computed(() => `${lightValue.value}%`);

const soundValue = ref(50);
const displaySoundValue = computed(() => `${soundValue.value}%`);

const showSettingsHub = ref(false);
const toggleSettingsHub = useToggle(showSettingsHub);
const settingsHub = ref(null);
const displaySettingsHub = computed(() => showSettingsHub.value ? 'flex' : 'none');
onClickOutside(settingsHub, () => (showSettingsHub.value = false));

const showBatteryData = ref(false);
const toggleBatteryData = useToggle(showBatteryData);
const batteryData = ref(null);
const displayBatteryData = computed(() => showBatteryData.value ? 'flex' : 'none');
onClickOutside(batteryData, () => (showBatteryData.value = false));

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

const displayContextMenu = ref(false);
const contextMenu = ref(null);
onClickOutside(contextMenu, () => (displayContextMenu.value = false));
const contextMenuPosition = reactive({
    x: 0,
    y: 0
});
const contextMenuPositionX = computed(() => contextMenuPosition.x + 20 + 'px');
const contextMenuPositionY = computed(() => contextMenuPosition.y + 'px');

const showDesktopContextMenu = () => {
    console.log('context menu on desktop');

    setContextMenu([
        [
            {
                name: 'New folder',
                click: () => addDirectory()
            },
            {
                name: 'New file'
            }
        ],
        [
            {
                name: 'Copy'
            },
            {
                name: 'Cut'
            },
            {
                name: 'Past'
            }
        ],
        [
            {
                name: 'Open in terminal'
            }
        ],
        [
            {
                name: 'Show more options'
            }
        ]
    ]);

    contextMenuPosition.x = mouseX.value;
    contextMenuPosition.y = mouseY.value;
    displayContextMenu.value = true;
};

const selectSubMenuItem = (item, e) => {
  const r = item?.click?.(e) ?? false;
  selectedMenu.value = '';
  return r;
};

watch(refs, () => {
  refs.map(m => onClickOutside(m, () => (selectedMenu.value = '')))
});

watch(isDark, () => {
    toggleLightDarkModeButtonTextColor.value = isDark.value ? 'white' : 'black';
})

watch([contextMenu, () => contextMenuPosition.x], () => {
    if (contextMenu.value) {
        if ((document.body.offsetWidth - contextMenu.value.offsetWidth) < contextMenuPosition.x) {
            contextMenuPosition.x -= contextMenu.value.offsetWidth + 20;
        }
        if ((document.body.offsetHeight - contextMenu.value.offsetHeight) < contextMenuPosition.y) {
            contextMenuPosition.y -= contextMenu.value.offsetHeight - 20;
        }
    }
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

        .settings-hub {
            background-color: rgba(0, 0, 0, .3);
            backdrop-filter: blur(1.5rem);

            > div {
                //background: rgba(0, 0, 0, .1);
                //backdrop-filter: blur(1.5rem);

                * {
                    color: white;
                }
            }
        }

        .battery-data {
            background-color: rgba(0, 0, 0, .3);
            backdrop-filter: blur(1.5rem);

            > div {
                &:first-child {
                    span {
                        &:first-child {
                            color: white;
                        }

                        &:last-child {
                            color: rgba(255, 255, 255, .7);;
                        }
                    }
                }

                &:last-child span {
                    color: rgba(255, 255, 255, .7);;
                }
            }
        }

        .context-menu {
            background: rgba(0, 0, 0, .3);

            ul li button {
                &:active, &:focus, &:hover {
                    background-color: rgba(0, 0, 0, .3);
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

                        &:active, &.active {
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

                        &:active, &:hover, &.active {
                            background-color: rgba(255, 255, 255, .05);
                            backdrop-filter: blur(11.5rem);
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
                        position: relative;

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

    .settings-hub {
        display: v-bind(displaySettingsHub);
        position: absolute;
        right: 0;
        top: 0;
        z-index: 1;
        margin-top: 40px;
        margin-right: 5px;
        width: 400px;
        height: auto;
        background-color: white;
        flex-direction: column;
        border-radius: 15px;
        padding: 10px;
        box-shadow: 0px 0px 15px 5px rgba(0, 0, 0, .3);

        > div {
            display: flex;
            flex-direction: row;
            border-radius: 10px;

            &:not(:first-child) {
                margin-top: 5px;
            }

            &:not(:last-child) {
                margin-bottom: 5px;
            }

            > section {
                padding: 5px;
                border-radius: 10px;
                -webkit-box-shadow: 0px 0px 15px 5px #000000; 
                box-shadow: 0px 0px 15px 5px rgba(0, 0, 0, .3);
                flex: 1;
                display: flex;
                flex-direction: row;
                justify-content: center;
                align-items: center;

                &:first-child {
                    margin-right: 5px;
                    margin-left: 5px;
                }

                &:last-child {
                    margin-left: 5px;
                    margin-right: 5px;
                }

                &.network-container {
                    ul {
                        flex: 1; 
                        height: calc(100% - 20px);
                        list-style: none;
                        padding-left: 5px;

                        li {
                            display: flex;
                            flex-direction: row;
                            position: relative;

                            &::after {
                                content: '>';
                                position: absolute;
                                right: 10px;
                                top: calc(50% - 15px);
                                font-size: 25px;
                                color: #cbd0d3;
                            }

                            > div {
                                display: flex;
                                flex-direction: column;

                                &:first-child {
                                    display: flex;
                                    flex-direction: row;
                                    justify-content: center;
                                    align-items: center;
                                    width: 40px;
                                    height: 40px;
                                    border-radius: 50px;
                                    background-color: #007aff;
                                    color: white;
                                    margin-right: 10px;
                                }

                                > span:first-child {
                                    font-weight: bold;
                                }

                                > span:last-child {
                                    color: #cbd0d3;
                                }
                            }
                        }
                    }
                }

                &.dark-light-mode-container {
                    padding-bottom: 10px;
                }

                &.light-container,
                &.sound-container {
                    display: flex;
                    flex-direction: column;
                    padding-left: 10px;
                    padding-right: 10px;
                    padding-bottom: 10px;
                    position: relative;

                    > span {
                        font-size: 20px;
                        font-weight: bold;
                        margin-bottom: 10px;
                    }

                    > div {
                        display: flex;
                        flex-direction: row;
                        justify-content: space-around;
                        align-items: center;

                        input[type=range] {
                            margin-right: 4px!important;
                            background-size: v-bind(displaySoundValue) 100%!important;
                        }

                        > button {
                            border-radius: 20px;
                            background-color: #dcdddd;
                            border: 0;
                            display: flex;
                            flex-direction: column;
                            justify-content: center;
                            align-items: center;
                        }
                    }

                    > input[type=range],
                    > div input[type=range] {
                        flex: 1;
                        -webkit-appearance: none;
                        padding: 0;
                        outline: none;
                        opacity: .8;
                        box-sizing: border-box;
                        transition: opacity .2s;
                        height: auto;
                        margin: 0;
                        background: #dcdbdb;
                        border: 1px solid #cbcfd2;
                        --thumb-radius: 50%;
                        border-radius: 30px;
                        background-image: linear-gradient(#ffffff, #ffffff);
                        background-size: v-bind(displayLightValue) 100%;
                        background-repeat: no-repeat;

                        + i {
                            position: absolute;
                            left: 15px;
                            top: 45px;
                            color: #ececec;
                            z-index: -1;

                            + button {
                                width: 30px;
                                height: 30px;
                            }
                        }

                        &::-webkit-slider-runnable-track {
                            width: 100%;
                            position: relative;
                            height: 25px;
                            box-shadow: none;
                            border-radius: 14px;
                            border: none;
                        }

                        &::-webkit-slider-thumb {
                            -webkit-appearance: none;
                            width: 25px;
                            height: 25px;
                            box-sizing: border-box;
                            padding: 0.25em;
                            border: 1px solid #888;
                            border-radius: 50%;
                            box-shadow: 0 0 0.5em #fff inset;
                            background: white;
                        }
                    }

                    > input[type=range] + i {
                        top: 43px;
                    }
                }

                &.music-container {
                    display: flex;
                    flex-direction: row;
                    justify-content: flex-start;
                    align-items: center;

                    img {
                        width: 70px;
                    }

                    span {
                        font-weight: bold;
                    }

                    div {
                        display: flex;
                        flex-direction: row;
                        justify-content: flex-end;
                        align-items: center;
                        flex: 1;

                        button {
                            border: 0;
                            background: transparent;

                            i {
                                font-size: 20px;
                                margin: 10px;
                                color: #767879;
                            }
                        }
                    }
                }
            }
        }
    }

    .battery-data {
        display: v-bind(displayBatteryData);
        position: absolute;
        right: 220px;
        flex-direction: column;
        background: white;
        z-index: 1;
        margin-top: 5px;
        width: 350px;
        padding: 15px;
        padding-top: 10px;
        padding-bottom: 10px;
        border-radius: 15px;
        background-color: white;
        box-shadow: 0px 0px 15px 5px rgb(0 0 0 / 30%);

        > div {
            display: flex;
            margin-top: 5px;
            margin-bottom: 5px;

            &:first-child {
                flex-direction: row;
                justify-content: space-between;
                align-items: center;

                > span {
                    &:first-child {
                        font-weight: bold;
                    }

                    &:last-child {
                        color: #767879;
                    }
                }
            }

            &:last-child {
                flex-direction: column;
                justify-content: center;
                align-items: flex-start;

                span {
                    color: #767879;
                }
            }
        }
    }

    .context-menu {
        position: absolute;
        top: v-bind(contextMenuPositionY);
        left: v-bind(contextMenuPositionX);
        list-style: none;
        padding: 10px;
        margin: 0;
        background: rgba(255, 255, 255, .3);
        backdrop-filter: blur(1.5rem);
        min-width: 300px;
        border-radius: 10px;
        z-index: 9999;

        li {
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;

            + li > button {
                margin-top: 5px;
            }

            hr {
                flex: 1;
                margin-bottom: 2px;
                border: 1px solid rgba(0, 0, 0, .1);
            }

            button {
                flex: 1;
                display: flex;
                flex-direction: row;
                justify-content: flex-start;
                align-items: center;
                padding: 10px;
                border: 0;
                background-color: transparent;
                border-radius: 5px;

                &:hover, &:active, &:focus {
                    background-color: rgba(255, 255, 255, .3);
                }
            }
        }
    }

    .desktop-grid {
        position: absolute;
        top: 34px;
        left: 0;
        right: 0;
        bottom: 60px;
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: flex-start;

        &-column {
            display: flex;
            flex-direction: column;
            height: 100%;
            justify-content: flex-start;
            align-items: flex-start;
            padding: 10px;
        }

        &-cel {
            background: transparent;
            border: 0;
            border-radius: 10px;
            color: white;
            width: 100px;
            height: 100px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            font-weight: bold;

            span {
                width: 100px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }

            &_new-directory {
                z-index: 2;
            }

            input {
                width: 90%;
                background-color: transparent;
                outline: 1px solid lightskyblue;
                border-radius: 4px;
            }

            &:active, &:focus {
                background-color: lightskyblue;

                span {
                    color: black;
                    white-space: normal;
                    overflow: visible;
                    text-overflow: unset;
                }
            }

            img {
                width: 80%;
            }
        }
    }

    .new-directory-overlay {
        position: absolute;
        top: 0;
        right: 0;
        left: 0;
        bottom: 0;
        z-index: 1;
        background-color: transparent;
    }
}
</style>
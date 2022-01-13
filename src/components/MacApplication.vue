<template>
    <div :class="{
            'mac-application': true,
            'full-screen': openedApplications[appName.toLowerCase()].full_screen
        }" v-if="opened" @contextmenu.prevent.stop="showContextMenu()">

        <div class="left-bloc" :style="{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
            minWidth: '20%',
            paddingTop: '10px',
            backgroundColor: '#F2EAEE',
            borderRadius: '10px 0 0 10px'
        }">
            <div class="btn-container" :style="{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems: 'center',
                paddingLeft: '10px'
            }">
                <button class="btn-close" @click.prevent="closeApp"></button>
                <button class="btn-minmax" @click.prevent="() => (openedApplications[appName.toLowerCase()].full_screen ? minApp() : maxApp())"></button>
                <button class="btn-todock" @click.prevent="appToDock"></button>
            </div>

            <div class="menu-container">
                <h3> Favorites </h3>

                <div v-for="menuItemKey of Object.keys(currentAppMenus)" :key="menuItemKey">
                    <button @click="handleLeftMenuClick(currentAppMenus[menuItemKey], $event)" :class="{
                        active: currentAppMenus[menuItemKey]?.active ?? false
                    }">
                        {{ menuItemKey }}
                    </button>
                </div>
            </div>
        </div>

        <div class="right-bloc" :style="{
            width: '100%',
            backgroundColor: 'white',
            borderRadius: '0 10px 10px 0'
        }">
            <div class="app-header-bar" :style="{
                display: 'flex',
                flexDirection: 'row',
                height: '50px',
                borderBottom: '1px solid #C5BEBE'
            }">
                <div class="left-side" :style="{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    flex: 1
                }">
                    <button :style="{
                        width: '40px',
                        height: '40px',
                        fontSize: '20px',
                        marginRight: '10px',
                        color: '#C5C5C5',
                        backgroundColor: 'transparent',
                        border: 'none'
                    }">
                        <i class="fas fa-chevron-left" style="color: #C5C5C5"></i>
                    </button>

                    <button :style="{
                        width: '40px',
                        height: '40px',
                        fontSize: '20px',
                        marginRight: '10px',
                        color: '#C5C5C5',
                        backgroundColor: 'transparent',
                        border: 'none'
                    }">
                        <i class="fas fa-chevron-right" style="color: #C5C5C5"></i>
                    </button>

                    <h1 :style="{ margin: '0', marginRight: '10px' }"> {{ selectedTab }} </h1>
                </div>
                
                <div class="right-side" :style="{
                    display: 'flex',
                    flexDirection: 'row',
                    flex: 1,
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }">
                    <div :style="{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center'
                    }">
                        <button :style="{
                            width: '40px',
                            height: '40px',
                            fontSize: '25px',
                            marginRight: '15px',
                            color: '#C5C5C5',
                            backgroundColor: 'transparent',
                            border: 'none',
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }">
                            <i class="fas fa-border-all" style="font-size: 20px; margin-right: 5px; color: #C5C5C5;"></i>
                            <i class="fas fa-angle-down" style="font-size: 15px; color: #C5C5C5;"></i>
                        </button>

                        <button :style="{
                            width: '40px',
                            height: '40px',
                            fontSize: '25px',
                            marginRight: '15px',
                            color: '#C5C5C5',
                            backgroundColor: 'transparent',
                            border: 'none',
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }">
                            <i class="fas fa-table" style="font-size: 20px; margin-right: 5px; color: #C5C5C5;"></i>
                            <i class="fas fa-angle-down" style="font-size: 15px; color: #C5C5C5;"></i>
                        </button>

                        <button :style="{
                            width: '40px',
                            height: '40px',
                            fontSize: '25px',
                            marginRight: '15px',
                            color: '#C5C5C5',
                            backgroundColor: 'transparent',
                            border: 'none',
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }">
                            <i class="fas fa-ellipsis-h" style="font-size: 20px; margin-right: 5px; color: #C5C5C5;"></i>
                            <i class="fas fa-angle-down" style="font-size: 15px; color: #C5C5C5;"></i>
                        </button>
                    </div>

                    <div :style="{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center'
                    }">
                        <button :style="{
                            width: '40px',
                            height: '40px',
                            fontSize: '25px',
                            color: '#C5C5C5',
                            backgroundColor: 'transparent',
                            border: 'none',
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }">
                            <i class="fas fa-upload" style="font-size: 20px; color: #C5C5C5;"></i>
                        </button>
                        
                        <button :style="{
                            width: '40px',
                            height: '40px',
                            fontSize: '25px',
                            color: '#C5C5C5',
                            backgroundColor: 'transparent',
                            border: 'none',
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }">
                            <i class="fas fa-tag" style="font-size: 20px; color: #C5C5C5;"></i>
                        </button>
                        
                        <button :style="{
                            width: '40px',
                            height: '40px',
                            fontSize: '25px',
                            color: '#C5C5C5',
                            backgroundColor: 'transparent',
                            border: 'none',
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }">
                            <i class="fas fa-angle-double-right" style="font-size: 20px; color: #C5C5C5;"></i>
                        </button>
                        
                        <button :style="{
                            width: '40px',
                            height: '40px',
                            fontSize: '25px',
                            color: '#C5C5C5',
                            backgroundColor: 'transparent',
                            border: 'none',
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }">
                            <i class="fas fa-search" style="font-size: 20px; margin-right: 5px; color: #C5C5C5;"></i>
                        </button>
                    </div>
                </div>
            </div>

            <div class="application-body" :style="{
                padding: '10px'
            }">
                <slot></slot>
            </div>
        </div>
    </div>
</template>

<script setup>
import { defineProps, computed, ref, watch } from 'vue';
import { APPLICATION_STATE, useCurrentApp, useOpenedApplications } from '@/hooks/apps';
import { CURSOR, useCursor } from '@/hooks/cursor';

const { setCurrentApp, currentApp, resetCurrentAppMenus, resetCurrentAppHeaderBar, currentAppMenus, currentAppHeaderBar } = useCurrentApp();
const { setCursor } = useCursor();
const { lastApplicationOpened, closeApplication, applicationToDock, minifyApplication, maximizeApplication, openedApplications } = useOpenedApplications();

const props = defineProps({
    appName: String,
    dockHeight: Number,
    opened: Boolean
});

const opened = ref(props.opened);

const topBarHeight = ref('0px');

const selectedTab = computed(() => currentAppHeaderBar.value?.left?.[2]?.text ?? '');

watch(() => props.opened, () => {
    opened.value = props.opened;
});

watch(currentApp, () => {
    resetCurrentAppMenus();
    resetCurrentAppHeaderBar();
})

const dockHeight = computed(() => document.querySelector('.dock__wrapper')?.offsetHeight + 'px');
const desktopTopBarHeight = computed(() => document.querySelector('#desktop > .top-bar')?.offsetHeight + 'px');

const closeApp = () => {
    opened.value = false;
    closeApplication(props.appName);
    setCurrentApp(lastApplicationOpened.value);
};
const minApp = () => {
    minifyApplication(props.appName);
    setCurrentApp(lastApplicationOpened.value);
};
const maxApp = () => {
    maximizeApplication(props.appName);
    setCurrentApp(lastApplicationOpened.value);
};
const appToDock = () => {
    applicationToDock(props.appName);
    setCurrentApp(lastApplicationOpened.value);
};
const showContextMenu = () => {
  console.log('context menu on ' + props.appName + ' application');
};
const handleLeftMenuClick = (currentAppMenu, e) => {
    currentAppMenu?.click(e);
    Array.from(e.target.parentElement.parentElement.querySelectorAll('button.active')).map(c => c.classList.remove('active'));
    e.target.classList.add('active');
}
</script>

<style lang="scss" scoped>
.mac-application {
    height: calc(100vh - v-bind(dockHeight) - v-bind(topBarHeight) - v-bind(desktopTopBarHeight) - 5px);
    position: absolute;
    top: v-bind(desktopTopBarHeight);
    bottom: calc(v-bind(dockHeight) + 5px);
    left: 0;
    right: 0;
    z-index: 0;
    display: flex;
    flex-direction: row;
    box-shadow: 2px 20px 36px -5px rgba(0,0,0,0.59);

    &.full-screen {
        top: 0;
        height: 100vh;
        z-index: 9;
    }

    .left-bloc {
        .btn-container {
            button {
                cursor: pointer;
                height: 10px;
                width: 10px;
                border: none;
                border-radius: 10px;
                background: white;
                margin-right: 5px;

                &.btn-close {
                    background: red;
                }
                &.btn-minmax {
                    background: orange;
                }
                &.btn-todock {
                    background: green;
                }
            }
        }

        .menu-container {
            padding-left: 10px;
            display: flex;
            flex-direction: column;
            flex: 1;
            width: calc(100% - 20px);

            h3 {
                color: #C5BEBE;
                font-size: 15px;
                padding-left: 10px;
            }

            button {
                padding: 10px;
                border: none;
                background-color: transparent;
                border-radius: 10px;
                text-align: left;
                width: 100%;

                &.active {
                    background-color: #DCD4D5;
                }
            }
        }
    }
}
</style>
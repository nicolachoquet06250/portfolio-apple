<template>
    <div :class="{
            'mac-application': true,
            'full-screen': openedApplications[appName.toLowerCase()].full_screen
        }" v-if="opened" @contextmenu.prevent.stop="showContextMenu()">
        <div class="top-bar" ref="topBar">
            <div class="left-bloc">
                <button class="btn-close" @click.prevent="closeApp"></button>
                <button class="btn-minmax" @click.prevent="() => (openedApplications[appName.toLowerCase()].full_screen ? minApp() : maxApp())"></button>
                <button class="btn-todock" @click.prevent="appToDock"></button>
            </div>
            
            <div class="right-bloc">
                <span>{{ appName }}</span>
            </div>
        </div>

        <div class="application-body">
            <slot></slot>
        </div>
    </div>
</template>

<script setup>
import { defineProps, computed, ref, watch } from 'vue';
import { APPLICATION_STATE, useCurrentApp, useOpenedApplications } from '@/hooks/apps';
import { CURSOR, useCursor } from '@/hooks/cursor';

const { setCurrentApp } = useCurrentApp();
const { setCursor } = useCursor();
const { lastApplicationOpened, closeApplication, applicationToDock, minifyApplication, maximizeApplication, openedApplications } = useOpenedApplications();

const props = defineProps({
    appName: String,
    dockHeight: Number,
    opened: Boolean
});

const opened = ref(props.opened);

const topBar = ref(null);
const topBarHeight = ref('0px');

watch(topBar, () => {
    topBarHeight.value = topBar.value?.offsetHeight + 'px';
});

watch(() => props.opened, () => {
    opened.value = props.opened;
});

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
</script>

<style lang="scss" scoped>
.mac-application {
    height: calc(100vh - v-bind(dockHeight) - v-bind(topBarHeight) - v-bind(desktopTopBarHeight) - 5px);
    position: absolute;
    top: v-bind(desktopTopBarHeight);
    bottom: calc(v-bind(dockHeight) + 5px);
    left: 0;
    right: 0;

    .top-bar {
        display: flex;
        background: whitesmoke;
        font-size: 12px;

        .left-bloc {
            padding-left: 5px;
            display: flex;
            justify-content: center;
            align-items: center;

            button {
                cursor: pointer;
                height: 10px;
                width: 10px;
                border: 1px solid black;
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

        .right-bloc {
            display: flex;
            flex: 2;
            display: flex;
            justify-content: center;
            align-items: center;
            height: max-content;
            padding-top: 10px;
            padding-bottom: 10px;
        }
    }

    .application-body {
        height: 100%;
        background: white;
    }
}
</style>
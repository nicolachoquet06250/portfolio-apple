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
        </div>

        <div class="right-bloc" :style="{
            width: '100%',
            backgroundColor: 'white',
            borderRadius: '0 10px 10px 0',
            padding: '10px'
        }">
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

//const topBar = ref(null);
const topBarHeight = ref('0px');

/*watch(topBar, () => {
    topBarHeight.value = topBar.value?.offsetHeight + 'px';
});*/

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
}
</style>
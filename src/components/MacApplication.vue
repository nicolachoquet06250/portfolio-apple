<template>
    <div :class="{
            'mac-application': true,
            'full-screen': openedApplications[appName.toLowerCase()].full_screen,
            'movable': !isOutside && headerPressed,
            'not-header': !hasHeader,
            [appCode]: true,
            active: currentApp === appCode,
            close,
            dark: isDark
        }" v-if="opened" 
        ref="application"
        @contextmenu.prevent.stop="showContextMenu()"
        @click="handleApplicationClick($event)"
        :style="{
            'min-width': '777px'
        }">

        <div class="left-bloc">
            <div class="btn-container">
                <button class="btn-close" @click.prevent="closeApplication"></button>
                <button class="btn-minmax" @click.prevent="() => (openedApplications[appName.toLowerCase()].full_screen ? minApp() : maxApp())"></button>
                <button class="btn-todock" @click.prevent="appToDock"></button>
            </div>

            <div class="menu-container">
                <div v-for="menuItemKey of Object.keys(openedApplications[appCode]?.menus ?? {})" :key="menuItemKey">
                    <h3 v-if="openedApplications[appCode]?.menus[menuItemKey].type && openedApplications[appCode]?.menus[menuItemKey].type === 'title'">
                        {{ openedApplications[appCode]?.menus[menuItemKey].text }}
                    </h3>

                    <button v-else @click="handleLeftMenuClick(openedApplications[appCode]?.menus[menuItemKey], $event)" :class="{
                        active: openedApplications[appCode]?.menus[menuItemKey]?.active ?? false
                    }">
                        {{ menuItemKey }}
                    </button>
                </div>
            </div>
        </div>

        <div class="right-bloc">
            <div class="app-header-bar" v-if="hasHeader">
                <AppHeaderComponent />

                <slot name="header"></slot>
            </div>
            <div class="app-header-bar void" v-else></div>

            <div class="application-body">
                <AppComponent />

                <slot></slot>
            </div>
        </div>

        <div class="resize-left" 
             ref="resizeLeft" 
             @mousedown="resizePressed = 'left'"></div>

        <div class="resize-right" 
             ref="resizeRight" 
             @mousedown="resizePressed = 'right'"></div>

        <div class="resize-top" 
             ref="resizeTop" 
             @mousedown="resizePressed = 'top'"></div>

        <div class="resize-bottom" 
             ref="resizeBottom" 
             @mousedown="resizePressed = 'bottom'"></div>
    </div>
</template>

<script setup>
import { defineProps, computed, ref, watch, reactive } from 'vue';
import { useCurrentApp, useOpenedApplications, useAppActions } from '@/hooks/apps';
import { useDark } from '@/hooks/theme';
import { useWindowSize } from '@vueuse/core';

const { setCurrentApp, currentApp } = useCurrentApp();
const { lastApplicationOpened, applicationToDock, minifyApplication, maximizeApplication, openedApplications } = useOpenedApplications();
const { width: windowWidth } = useWindowSize();
const { isDark } = useDark();

const windowWidthForCss = computed(() => `${windowWidth.value}px`);

const props = defineProps({
    appName: String,
    dockHeight: Number,
    opened: Boolean,
    appCode: String
});

const AppComponent = ref(openedApplications.value[props.appCode].component);
const AppHeaderComponent = ref(openedApplications.value[props.appCode].componentHeader);

const hasHeader = computed(() => AppHeaderComponent.value !== null);

const opened = ref(props.opened);
const application = ref(null);

const { 
    size, position, close, bodyHeight: applicationBodyHeight, 
    closeApp 
} = useAppActions(application, props.appCode, opened);

const applicationWidth = computed(() => size.width + 'px');
const applicationHeight = computed(() => size.height + 'px');

watch(() => props.opened, () => {
    opened.value = props.opened;
});

const dockHeight = computed(() => document.querySelector('.dock__wrapper')?.offsetHeight + 'px');
const desktopTopBarHeight = computed(() => document.querySelector('#desktop > .top-bar')?.offsetHeight + 'px');
const zIndex = computed(() => currentApp.value === props.appCode ? 1 : 0);

const positionBeforeClose = reactive({
    x: 0,
    y: 0
});
const positionBeforeCloseXUnit = computed(() => `${positionBeforeClose.x}px`);
const positionBeforeCloseYUnit = computed(() => `${positionBeforeClose.y}px`);

const applicationCurrentPositionXUnit = computed(() => `${position.value.x}px`);
const applicationCurrentPositionYUnit = computed(() => `${position.value.y}px`);

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
};
const handleApplicationClick = (e) => {
    if (!(currentApp.value === props.appCode)) {
        setCurrentApp(props.appCode)
    } else {
        e.preventDefault();
    }
};
const closeApplication = () => {
    positionBeforeClose.x = position.value.x;
    positionBeforeClose.y = position.value.y;
    closeApp();
}
</script>

<style lang="scss" scoped>
* { 
    --scrollbar-width: 0;

    &::-webkit-scrollbar {
        width: var(--scrollbar-width);
    }

    &:hover {
        --scrollbar-width: 8px;
    }

    &::-webkit-scrollbar-thumb {
        background: #666;
        border-radius: 20px;
    }

    &::-webkit-scrollbar-track {
        background: #ddd;
        border-radius: 20px;
    }
}

.mac-application {
    /* desactivation de la mise en surbrillance du text */
    -moz-user-select: none; /* Firefox */
    -webkit-user-select: none; /* Chrome, Safari, Opéra depuis la version 15 */
    -ms-user-select: none; /* Internet explorer depuis la version 10 et Edge */
    user-select: none; /* Propriété standard */

    max-height: calc(100vh - v-bind(dockHeight) - v-bind(desktopTopBarHeight) - 5px);
    max-width: 100%;
    min-width: 777px;
    position: absolute;
    left: 0;
    top: auto;
    right: auto;
    bottom: auto;
    margin-top: 0;
    z-index: v-bind(zIndex);
    display: flex;
    flex-direction: row;
    box-shadow: 2px 20px 36px -5px rgba(0,0,0,0.59);
    width: v-bind(applicationWidth);
    height: v-bind(applicationHeight);

    &.dark {
        .left-bloc {
            background-color: #323436;

            * {
                color: white;
            }

            .menu-container {
                button.active {
                    background-color: rgba(255, 255, 255, .3);
                }
            }
        }

        .right-bloc {
            background-color: #1e1e1e;

            * {
                color: white;
            }
        }
    }

    &:not(.active) {
        &::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            bottom: 0;
            right: 0;
            display: block;
            background: transparent;
            //background: white;
            border-radius: 10px;
        }
    }

    &.not-header {
        height: 300px;
    }

    &.movable {
        transform: translateX(v-bind(applicationCurrentPositionXUnit)) translateY(v-bind(applicationCurrentPositionYUnit));
    }

    &.full-screen {
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        max-height: 100vh;
        height: 100vh!important;
        width: 100vw!important;
        z-index: 9;
        transform: translateX(0) translateY(0);
        animation: maximizeApp 1s ease-in-out both;

        .left-bloc,
        .right-bloc {
            border-radius: 0;
        }
    }

    .left-bloc {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: flex-start;
        width: 150px;
        padding-top: 10px;
        background-color: #F2EAEE;
        border-radius: 10px 0 0 10px;

        .btn-container {
            display: flex;
            flex-direction: row;
            justify-content: flex-start;
            align-items: center;
            padding-left: 10px;

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
            padding-right: 10px;
            display: flex;
            flex-direction: column;
            flex: 1;
            width: calc(100% - 20px);
            height: 100%;
            overflow-y: auto;

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

    .right-bloc {
        width: 100%;
        background-color: white;
        border-radius: 0 10px 10px 0;

        .app-header-bar {
            display: flex;
            flex-direction: row;
            height: 50px;
            border-bottom: 1px solid #C5BEBE;

            &.void {
                height: 25px;
                width: 100%;
            }
        }

        .application-body {
            padding: 10px;
            overflow: auto;
            height: v-bind(applicationBodyHeight);
        }
    }

    .resize-left {
        position: absolute;
        left: -10px;
        top: 0;
        bottom: 0;
        width: 20px;
        cursor: e-resize;
    }

    .resize-right {
        position: absolute;
        right: -10px;
        top: 0;
        bottom: 0;
        width: 20px;
        cursor: e-resize;
    }

    .resize-top {
        position: absolute;
        top: -10px;
        right: 0;
        left: 0;
        height: 20px;
        cursor: n-resize;
    }

    .resize-bottom {
        position: absolute;
        bottom: -10px;
        right: 0;
        left: 0;
        height: 20px;
        cursor: n-resize;
    }

    transform: translateX(v-bind(applicationCurrentPositionXUnit)) translateY(v-bind(applicationCurrentPositionYUnit));

    &.close {
        transform: translateX(v-bind(positionBeforeCloseXUnit)) translateY(v-bind(positionBeforeCloseYUnit));
        animation: closeApp .2s ease-in-out both;
    }
}

@keyframes openApp {
    0% {
        transform: translateX(calc((v-bind(windowWidthForCss) / 2) - (v-bind(applicationWidth) / 2))) translateY(600px);
        -webkit-clip-path: polygon(51% 98%, 54% 98%, 52% 100%, 53% 100%);
        clip-path: polygon(51% 98%, 54% 98%, 52% 100%, 53% 100%);
    }
    25% {
        transform: translateX(calc((v-bind(windowWidthForCss) / 2) - (v-bind(applicationWidth) / 2))) translateY(calc((600px / 4) * 3));
        -webkit-clip-path: polygon(34% 58%, 70% 58%, 52% 100%, 52% 100%);
        clip-path: polygon(34% 58%, 70% 58%, 52% 100%, 52% 100%);
    }
    50% {
        transform: translateX(calc((v-bind(windowWidthForCss) / 2) - (v-bind(applicationWidth) / 2))) translateY(calc((600px / 4) * 2));
        -webkit-clip-path: polygon(23% 39%, 82% 39%, 52% 100%, 52% 100%);
        clip-path: polygon(23% 39%, 82% 39%, 52% 100%, 52% 100%);
    }
    75% {
        transform: translateX(calc((v-bind(windowWidthForCss) / 2) - (v-bind(applicationWidth) / 2))) translateY(calc(600px / 4));
        -webkit-clip-path: polygon(0 0, 100% 0, 52% 100%, 52% 100%);
        clip-path: polygon(0 0, 100% 0, 52% 100%, 52% 100%);
    }
    100% {
        transform: translateX(v-bind(applicationCurrentPositionXUnit)) translateY(v-bind(applicationCurrentPositionYUnit));
        -webkit-clip-path: polygon(0 0, 100% 0, 100% 100%, 0% 100%);
        clip-path: polygon(0 0, 100% 0, 100% 100%, 0% 100%);
    }
}

@keyframes closeApp {
    0% {
        transform: translateX(v-bind(positionBeforeCloseXUnit)) translateY(v-bind(positionBeforeCloseYUnit)) scale(1, 1);
    }
    25% {
        transform: translateX(v-bind(positionBeforeCloseXUnit)) translateY(v-bind(positionBeforeCloseYUnit)) scale(0.75, 0.75);
    }
    50% {
        transform: translateX(v-bind(positionBeforeCloseXUnit)) translateY(v-bind(positionBeforeCloseYUnit)) scale(0.5, 0.5);
    }
    75% {
        transform: translateX(v-bind(positionBeforeCloseXUnit)) translateY(v-bind(positionBeforeCloseYUnit)) scale(0.25, 0.25);
    }
    100% {
        transform: translateX(v-bind(positionBeforeCloseXUnit)) translateY(v-bind(positionBeforeCloseYUnit)) scale(0, 0);
    }
}

@keyframes maximizeApp {
    0% {
        left: 0;
        top: auto;
        right: auto;
        bottom: auto;
    }
    100% {
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
    }
}
</style>
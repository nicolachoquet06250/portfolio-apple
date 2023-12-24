<template>
    <MacOsCursor :white="isDark">
        <div v-if="opened"
             :class="appClasses"
             ref="application"
             @click="handleApplicationClick"
             :style="{
               'min-width': '777px',
               '--dockHeight': dockHeight,
               '--desktopTopBarHeight': desktopTopBarHeight,
               '--zIndex': zIndex,
               '--applicationWidth': applicationWidth,
               '--applicationHeight': applicationHeight,
               '--applicationCurrentPositionXUnit': applicationCurrentPositionXUnit,
               '--applicationCurrentPositionYUnit': applicationCurrentPositionYUnit,
               '--positionBeforeCloseXUnit': positionBeforeCloseXUnit,
               '--positionBeforeCloseYUnit': positionBeforeCloseYUnit,
               '--windowWidthForCss': windowWidthForCss,
               '--menuWidth': leftBloc?.offsetWidth ? leftBloc?.offsetWidth + 'px' : '0px'
             }"
        >
            <div class="left-bloc" ref="leftBloc" v-if="hasMenu">
                <div class="btn-container">
                    <button class="btn-close"
                            @click.prevent="closeApplication"
                    />
                    <button class="btn-minmax"
                            @click.prevent="() => (isFullScreen ? minApp() : maxApp())"
                    />
                    <button class="btn-todock"
                            @click.prevent="appToDock"
                    />
                </div>

                <div class="menu-container">
                    <component :is="AppMenuComponent" />

                    <slot name="menu" />
                </div>
            </div>

            <div :class="{
                'right-bloc': true,
                'no-menu': !hasMenu
            }">
                <div class="header-container">
                    <div class="btn-container" v-if="!hasMenu">
                        <button class="btn-close"
                                @click.prevent="closeApplication"
                        />
                        <button class="btn-minmax"
                                @click.prevent="() => (isFullScreen ? minApp() : maxApp())"
                        />
                        <button class="btn-todock"
                                @click.prevent="appToDock"
                        />
                    </div>

                    <div class="app-header-bar" v-if="hasHeader">
                        <component :is="AppHeaderComponent" />

                        <slot name="header" />
                    </div>

                    <div class="app-header-bar void" v-else />
                </div>

                <div class="application-body" ref="appBody">
                    <component :is="AppComponent" :body-ref="appBody" @close-app="closeApplication" />

                    <slot />
                </div>
            </div>

            <div class="resize-left"
                 ref="resizeLeft"
                 @mousedown="resizePressed = 'left'" />

            <div class="resize-right"
                 ref="resizeRight"
                 @mousedown="resizePressed = 'right'" />

            <div class="resize-top"
                 ref="resizeTop"
                 @mousedown="resizePressed = 'top'" />

            <div class="resize-bottom"
                 ref="resizeBottom"
                 @mousedown="resizePressed = 'bottom'" />
        </div>
    </MacOsCursor>
</template>

<script setup lang="ts">
import { computed, ref, watch, reactive } from 'vue';
import {
    useCurrentApp,
    useOpenedApplications,
    useAppActions,
    APPLICATION,
    useApplicationBodyComponent,
    useApplicationHeaderComponent,
    useApplicationMenuComponent,
    useApplicationFullScreen
} from '@/hooks/apps';
import { useDark } from '@/hooks/theme';
import { useWindowSize } from '@vueuse/core';
import MacOsCursor from '@/components/macos/MacOsCursor.vue';

const { setCurrentApp, currentApp } = useCurrentApp();
const {
  lastApplicationOpened,
  applicationToDock,
  minifyApplication,
  maximizeApplication,
} = useOpenedApplications();
const { width: windowWidth } = useWindowSize();
const { isDark } = useDark();

const windowWidthForCss = computed(() => `${windowWidth.value}px`);

const props = defineProps<{
  appName: APPLICATION,
  opened: boolean,
  appCode: APPLICATION
}>();

const resizePressed = ref('');

const AppComponent = useApplicationBodyComponent(props.appCode);
const AppHeaderComponent = useApplicationHeaderComponent(props.appCode);
const AppMenuComponent = useApplicationMenuComponent(props.appCode);

const isFullScreen = useApplicationFullScreen(props.appCode);

watch(AppComponent, (c) => console.log(c))

const hasHeader = computed(() => AppHeaderComponent.value !== null);
const hasMenu = computed(() => AppMenuComponent.value !== null);
const leftBloc = ref<HTMLDivElement|null>(null);

const opened = ref(props.opened);
const application = ref<HTMLElement|null>(null);

const { size, position, close, headerPressed, isOutside, closeApp } = useAppActions(application, props.appCode, opened);

const applicationWidth = computed(() => size.width + 'px');
const applicationHeight = computed(() => size.height + 'px');

watch(() => props.opened, () => {
    opened.value = props.opened;
});

const dockHeight = computed(() => document.querySelector<HTMLElement>('.dock__wrapper')?.offsetHeight + 'px');
const desktopTopBarHeight = computed(() => document.querySelector<HTMLElement>('#desktop > .top-bar')?.offsetHeight + 'px');
const zIndex = computed(() => currentApp.value === props.appCode ? 1 : 0);

const positionBeforeClose = reactive({x: 0, y: 0});
const positionBeforeCloseXUnit = computed(() => `${positionBeforeClose.x}px`);
const positionBeforeCloseYUnit = computed(() => `${positionBeforeClose.y}px`);

const applicationCurrentPositionXUnit = computed(() => `${position.value.x}px`);
const applicationCurrentPositionYUnit = computed(() => `${position.value.y}px`);

const appClasses = computed(() => ({
  'mac-application': true,
  'full-screen': isFullScreen.value,
  'movable': !isOutside && headerPressed,
  'not-header': !hasHeader,
  [props.appCode]: true,
  active: currentApp.value === props.appCode,
  close: close.value,
  dark: isDark.value
}));

const appBody = ref<HTMLElement|null>(null);

const minApp = () => {
    minifyApplication(props.appName);
    setCurrentApp(lastApplicationOpened.value as APPLICATION);
};
const maxApp = () => {
    maximizeApplication(props.appName);
    setCurrentApp(lastApplicationOpened.value as APPLICATION);
};
const appToDock = () => {
    applicationToDock(props.appName);
    setCurrentApp(lastApplicationOpened.value as APPLICATION);
};
/*const handleLeftMenuClick = (currentAppMenu: Menu, e: MouseEvent) => {
    currentAppMenu.click?.(e);
    Array.from<HTMLElement>((e.target as unknown as HTMLElement).parentElement!.parentElement!.querySelectorAll('button.active'))
        .map(c => c.classList.remove('active'));
    (e.target as unknown as HTMLElement).classList.add('active');
};*/
const handleApplicationClick = (e: Event) => {
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

    max-height: calc(100vh - var(--dockHeight) - var(--desktopTopBarHeight) - 5px);
    max-width: 100%;
    min-width: 777px;
    position: absolute;
    left: 0;
    top: auto;
    right: auto;
    bottom: auto;
    margin-top: 0;
    z-index: var(--zIndex);
    display: flex;
    flex-direction: row;
    box-shadow: 2px 20px 36px -5px rgba(0,0,0,0.59);
    width: var(--applicationWidth);
    height: var(--applicationHeight);
    border-radius: 10px;

    &.dark {
        .left-bloc {
            background-color: #7c7c7c;

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
            border-radius: 10px;
        }

        &.dark {
            .left-bloc {
                background-color: #323436;

                .btn-container button {
                    &.btn-close,
                    &.btn-minmax,
                    &.btn-todock {
                        background-color: #4b4c4e;
                    }
                }
            }
        }

        .left-bloc {
            background-color: #f6f6f6;

            .btn-container button {
                &.btn-close,
                &.btn-minmax,
                &.btn-todock {
                    background-color: #e3e3e3;
                }
            }
        }
    }

    &.not-header {
        height: 300px;
    }

    &.movable {
        transform: translateX(var(--applicationCurrentPositionXUnit)) translateY(var(--applicationCurrentPositionYUnit));
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

    .header-container {
        display: flex; 
        flex-direction: row;
        border-bottom: 1px solid #C5BEBE;
    }

    .left-bloc {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: flex-start;
        width: 150px;
        padding-top: 10px;
        background-color: #fefefe;
        border-radius: 10px 0 0 10px;

        .btn-container {
            display: flex;
            flex-direction: row;
            justify-content: flex-start;
            align-items: center;
            padding-left: 10px;

            button {
                cursor: pointer;
                height: 12px;
                width: 12px;
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

            ::v-slotted(h3) {
                color: #C5BEBE;
                font-size: 15px;
                padding-left: 10px;
            }

            ::v-slotted(button) {
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
        width: calc(100% - var(--menuWidth));
        background-color: white;
        border-radius: 0 10px 10px 0;

        &.no-menu {
            width: 100%;
            border-radius: 10px;
        }

        .btn-container {
            display: flex;
            flex-direction: row;
            justify-content: flex-start;
            align-items: center;
            padding-left: 10px;

            button {
                cursor: pointer;
                height: 12px;
                width: 12px;
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

        .app-header-bar {
            display: flex;
            flex-direction: row;
            height: 50px;
            //border-bottom: 1px solid #C5BEBE;
            flex: 1;

            &.void {
                height: 50px;
                width: 100%;
            }
        }

        .application-body {
            padding: 10px;
            overflow: auto;
            height: calc(100% - 50px);
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

    transform: translateX(var(--applicationCurrentPositionXUnit)) translateY(var(--applicationCurrentPositionYUnit));

    &.close {
        transform: translateX(var(--positionBeforeCloseXUnit)) translateY(var(--positionBeforeCloseYUnit));
        animation: closeApp .2s ease-in-out both;
    }
}

@keyframes openApp {
    0% {
        $windowWidthForCss: var(--windowWidthForCss);
        $applicationWidth: var(--applicationWidth);
        transform: translateX(calc((#{$windowWidthForCss} / 2) - (#{$applicationWidth} / 2))) translateY(600px);
        -webkit-clip-path: polygon(51% 98%, 54% 98%, 52% 100%, 53% 100%);
        clip-path: polygon(51% 98%, 54% 98%, 52% 100%, 53% 100%);
    }
    25% {
        $windowWidthForCss: var(--windowWidthForCss);
        $applicationWidth: var(--applicationWidth);
        transform: translateX(calc((#{$windowWidthForCss} / 2) - (#{$applicationWidth} / 2))) translateY(calc((600px / 4) * 3));
        -webkit-clip-path: polygon(34% 58%, 70% 58%, 52% 100%, 52% 100%);
        clip-path: polygon(34% 58%, 70% 58%, 52% 100%, 52% 100%);
    }
    50% {
        $windowWidthForCss: var(--windowWidthForCss);
        $applicationWidth: var(--applicationWidth);
        transform: translateX(calc((#{$windowWidthForCss} / 2) - (#{$applicationWidth} / 2))) translateY(calc((600px / 4) * 2));
        -webkit-clip-path: polygon(23% 39%, 82% 39%, 52% 100%, 52% 100%);
        clip-path: polygon(23% 39%, 82% 39%, 52% 100%, 52% 100%);
    }
    75% {
        $windowWidthForCss: var(--windowWidthForCss);
        $applicationWidth: var(--applicationWidth);
        transform: translateX(calc((#{$windowWidthForCss} / 2) - (#{$applicationWidth} / 2))) translateY(calc(600px / 4));
        -webkit-clip-path: polygon(0 0, 100% 0, 52% 100%, 52% 100%);
        clip-path: polygon(0 0, 100% 0, 52% 100%, 52% 100%);
    }
    100% {
        transform: translateX(var(--applicationCurrentPositionXUnit)) translateY(var(--applicationCurrentPositionYUnit));
        -webkit-clip-path: polygon(0 0, 100% 0, 100% 100%, 0% 100%);
        clip-path: polygon(0 0, 100% 0, 100% 100%, 0% 100%);
    }
}

@keyframes closeApp {
    0% {
        transform: translateX(var(--positionBeforeCloseXUnit)) translateY(var(--positionBeforeCloseYUnit)) scale(1, 1);
    }
    25% {
        transform: translateX(var(--positionBeforeCloseXUnit)) translateY(var(--positionBeforeCloseYUnit)) scale(0.75, 0.75);
    }
    50% {
        transform: translateX(var(--positionBeforeCloseXUnit)) translateY(var(--positionBeforeCloseYUnit)) scale(0.5, 0.5);
    }
    75% {
        transform: translateX(var(--positionBeforeCloseXUnit)) translateY(var(--positionBeforeCloseYUnit)) scale(0.25, 0.25);
    }
    100% {
        transform: translateX(var(--positionBeforeCloseXUnit)) translateY(var(--positionBeforeCloseYUnit)) scale(0, 0);
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
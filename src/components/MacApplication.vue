<template>
    <div :class="{
            'mac-application': true,
            'full-screen': openedApplications[appName.toLowerCase()].full_screen,
            'movable': !isOutside && headerPressed,
            'not-header': !hasHeader,
            [appCode]: true,
            active: currentApp === appCode
        }" v-if="opened" 
        ref="application"
        @contextmenu.prevent.stop="showContextMenu()"
        @click="handleApplicationClick($event)"
        :style="{
            '--mousePositionX': `${x}px`,
            '--mousePositionY': `${y}px`,
        }">

        <div class="left-bloc">
            <div class="btn-container">
                <button class="btn-close" @click.prevent="closeApp"></button>
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
            <div class="app-header-bar" ref="applicationHeader" v-if="hasHeader" 
                 @mouseover="isOutside = false" @mouseout="isOutside = true" 
                 @mousedown="headerPressed = true" @mouseup="headerPressed = false">
                <AppHeaderComponent />

                <slot name="header"></slot>
            </div>
            <div class="app-header-bar void" v-else
                 @mouseover="isOutside = false" @mouseout="isOutside = true" 
                 @mousedown="headerPressed = true" @mouseup="headerPressed = false"></div>

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
import { APPLICATION_STATE, useCurrentApp, useOpenedApplications } from '@/hooks/apps';
import { CURSOR, useCursor } from '@/hooks/cursor';
import { useMouse, useElementSize } from '@vueuse/core';import { useWindowSize } from '@vueuse/core'

const { setCurrentApp, currentApp, currentAppMenus, currentAppHeaderBar } = useCurrentApp();
const { setCursor } = useCursor();
const { lastApplicationOpened, closeApplication, applicationToDock, minifyApplication, maximizeApplication, openedApplications } = useOpenedApplications();
const { x, y } = useMouse();
const { width: windowWidth } = useWindowSize();

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
const applicationHeader = ref(null);
const application = ref(null);
const { width, height } = useElementSize(application);
const resizePressed = ref(false);
const onClickPosition = reactive({
    x: 0,
    y: 0
});
const applicationSize = reactive({
    width: 0,
    height: 0
})

const resizeLeft = ref(null);
const resizeRight = ref(null);
const resizeTop = ref(null);
const resizeBottom = ref(null);

watch(resizePressed, () => {
    if (resizePressed.value !== false) {
        onClickPosition.x = x.value;
        onClickPosition.y = y.value;

        applicationSize.width = application.value?.offsetWidth;
        applicationSize.height = application.value?.offsetHeight;
    }
});

const isOutside = ref(true);
const headerPressed = ref(false);
const selectedTab = computed(() => currentAppHeaderBar.value?.left?.[2]?.text ?? '');

watch(() => props.opened, () => {
    opened.value = props.opened;
});

const dockHeight = computed(() => document.querySelector('.dock__wrapper')?.offsetHeight + 'px');
const desktopTopBarHeight = computed(() => document.querySelector('#desktop > .top-bar')?.offsetHeight + 'px');
const zIndex = computed(() => currentApp.value === props.appCode ? 1 : 0);

const applicationCurrentPositionX = ref(application.value?.getBoundingClientRect().left ?? 0);
const applicationCurrentPositionY = ref(application.value?.getBoundingClientRect().top ?? 0);
const applicationCurrentPositionXUnit = computed(() => applicationCurrentPositionX.value + 'px');
const applicationCurrentPositionYUnit = computed(() => applicationCurrentPositionY.value + 'px');

const applicationMovePositionX = computed(() => ((applicationCurrentPositionX.value + (x.value - onClickPosition.x))) + 'px');
const applicationMovePositionY = computed(() => ((applicationCurrentPositionY.value + (y.value - onClickPosition.y))) + 'px');

watch(() => application.value?.getBoundingClientRect().left, () => {
    applicationCurrentPositionX.value = application.value?.getBoundingClientRect().left;
});
watch(() => application.value?.getBoundingClientRect().top, () => {
    applicationCurrentPositionY.value = application.value?.getBoundingClientRect().top;
});

watch(headerPressed, () => {
    if (headerPressed.value && !isOutside.value) {
        onClickPosition.x = x.value;
        onClickPosition.y = y.value;
    }

    if (!headerPressed.value && !isOutside.value) {
        applicationCurrentPositionX.value += (x.value - onClickPosition.x);
        applicationCurrentPositionY.value += (y.value - onClickPosition.y);
    }
});

watch([x, y], () => {
    if (headerPressed.value && !isOutside.value) {
        if (applicationCurrentPositionY.value + (y.value - onClickPosition.y) < 0) {
            applicationCurrentPositionX.value = 0;
            applicationCurrentPositionY.value = 0;
            application.value?.classList.add('movable');
        }
    }

    if (headerPressed.value && isOutside.value) {
        applicationCurrentPositionX.value = 0;
        applicationCurrentPositionY.value = 0;
        application.value?.classList.remove('movable');
    }

    if (resizePressed.value && resizePressed.value === 'right') {
        application.value.style.width = `${applicationSize.width + (x.value - onClickPosition.x)}px`;
        
        if (applicationSize.width === application.value.offsetWidth) {
            resizePressed.value = false;
        }
    }

    if (resizePressed.value && resizePressed.value === 'left') {
        application.value.style.width = `${applicationSize.width + (onClickPosition.x - x.value)}px`;
        applicationCurrentPositionX.value = onClickPosition.x - (onClickPosition.x - x.value);

        if (applicationSize.width === application.value.offsetWidth) {
            resizePressed.value = false;
        }
    }

    if (resizePressed.value && resizePressed.value === 'bottom') {
        application.value.style.height = `${applicationSize.height + (y.value - onClickPosition.y)}px`;
        
        if (applicationSize.height === application.value.offsetHeight) {
            resizePressed.value = false;
        }
    }

    if (resizePressed.value && resizePressed.value === 'top') {
        application.value.style.height = `${applicationSize.height + (onClickPosition.y - y.value)}px`;
        applicationCurrentPositionY.value = onClickPosition.y - (onClickPosition.y - y.value) - 25;
        
        if (applicationSize.height === application.value.offsetHeight) {
            resizePressed.value = false;
        }
    }

    if (resizePressed.value && application.value.offsetWidth >= windowWidth.value) {
        resizePressed.value = false;
    }
})

const closeApp = () => {
    opened.value = false;
    closeApplication(props.appName);
    setTimeout(() => setCurrentApp(lastApplicationOpened.value), 1000);
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
};
const handleApplicationClick = (e) => {
    if (!(currentApp.value === props.appCode)) {
        setCurrentApp(props.appCode)
    } else {
        e.preventDefault();
    }
};

watch(application, () => {
    if (application.value) {
        application.value.addEventListener('mouseup', () => {
            resizePressed.value = false;
        })
    }
})

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
    max-height: calc(100vh - v-bind(dockHeight) - v-bind(desktopTopBarHeight) - 5px);
    max-width: 100%;
    min-width: 777px;
    position: absolute;
    left: 0;
    transform: translateX(v-bind(applicationCurrentPositionXUnit)) translateY(v-bind(applicationCurrentPositionYUnit));
    margin-top: 0;
    z-index: v-bind(zIndex);
    display: flex;
    flex-direction: row;
    box-shadow: 2px 20px 36px -5px rgba(0,0,0,0.59);

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
        transform: translateX(v-bind(applicationMovePositionX)) translateY(v-bind(applicationMovePositionY));
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
        }
    }

    .resize-left {
        position: absolute;
        left: -5px;
        top: 0;
        bottom: 0;
        width: 10px;
        cursor: e-resize;
    }

    .resize-right {
        position: absolute;
        right: -5px;
        top: 0;
        bottom: 0;
        width: 10px;
        cursor: e-resize;
    }

    .resize-top {
        position: absolute;
        top: -5px;
        right: 0;
        left: 0;
        height: 10px;
        cursor: n-resize;
    }

    .resize-bottom {
        position: absolute;
        bottom: -5px;
        right: 0;
        left: 0;
        height: 10px;
        cursor: n-resize;
    }
}
</style>
<template>
    <div class="dock__wrapper">
        <div class="dock" ref="dock">
            <DockIcon v-for="icon of icons" :key="icon" 
                      @click="icon.click" @mouseover="icon.mouseover" @mouseout="icon.mouseout" 
                      :href="icon.href" :img="icon.img" />
        </div>
    </div>
</template>

<script setup>
import DockIcon from '@/components/DockIcon.vue';

import { ref, watch } from 'vue';
import { CURSOR, useCursor } from '@/hooks/cursor';
import { APPLICATION, useOpenedApplications, useCurrentApp } from '@/hooks/apps';
import { Dock } from '@/services/dock';

import finder from '@/assets/dock/finder.png';
import appstore from '@/assets/dock/appstore.png';
import mail from '@/assets/dock/mail.png';
import messages from '@/assets/dock/messages.png';
import preferences from '@/assets/dock/systempreferences.png';
import terminal from '@/assets/dock/terminal.png';
import trash from '@/assets/dock/trashbin.png';

const { setCursor } = useCursor();
const { lastApplicationOpened, openApplication } = useOpenedApplications();
const { setCurrentApp } = useCurrentApp();

const dock = ref(null);

const icons = ref([
    {
        href: '#',
        mouseover: () => setCursor(CURSOR.POINTER),
        mouseout: () => setCursor(CURSOR.DEFAULT),
        click: () => {
            console.log('go to finder');
            setCurrentApp(APPLICATION.FINDER);
            openApplication(APPLICATION.FINDER);
        },
        img: finder
    },
    {
        href: '#',
        mouseover: () => setCursor(CURSOR.POINTER),
        mouseout: () => setCursor(CURSOR.DEFAULT),
        click: () => {
            console.log('go to app-store');
            openApplication(APPLICATION.STORE);
            setCurrentApp(APPLICATION.STORE);
        },
        img: appstore
    },
    {
        href: '#',
        mouseover: () => setCursor(CURSOR.POINTER),
        mouseout: () => setCursor(CURSOR.DEFAULT),
        click: () => {
            console.log('go to mails');
            openApplication(APPLICATION.MAILS);
            setCurrentApp(APPLICATION.MAILS);
        },
        img: mail
    },
    {
        href: '#',
        mouseover: () => setCursor(CURSOR.POINTER),
        mouseout: () => setCursor(CURSOR.DEFAULT),
        click: () => {
            console.log('go to messages');
            openApplication(APPLICATION.MESSAGES);
            setCurrentApp(APPLICATION.MESSAGES);
        },
        img: messages
    },
    {
        href: '#',
        mouseover: () => setCursor(CURSOR.POINTER),
        mouseout: () => setCursor(CURSOR.DEFAULT),
        click: () => {
            console.log('go to settings');
            openApplication(APPLICATION.SETTINGS);
            setCurrentApp(APPLICATION.SETTINGS);
        },
        img: preferences
    },
    {
        href: '#',
        mouseover: () => setCursor(CURSOR.POINTER),
        mouseout: () => setCursor(CURSOR.DEFAULT),
        click: () => {
            console.log('go to terminal');
            openApplication(APPLICATION.TERMINAL);
            setCurrentApp(APPLICATION.TERMINAL);
        },
        img: terminal
    },
    {
        href: '#',
        mouseover: () => setCursor(CURSOR.POINTER),
        mouseout: () => setCursor(CURSOR.DEFAULT),
        click: () => {
            console.log('go to trash');
            openApplication(APPLICATION.TRASH);
            setCurrentApp(APPLICATION.TRASH);
        },
        img: trash
    }
]);

watch(dock, () => {
    new Dock(dock.value);
});
</script>

<style lang="scss">
.dock {
    position: relative;
    display: flex;

    &__wrapper {
        position: fixed;
        left: 0;
        right: 0;
        bottom: 0;
        display: flex;
        justify-content: center;
        z-index: 8;
    }

    .dock-icon {
        position: relative;
        z-index: 2;
        cursor: pointer;
        width: 64px;
        height: 64px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #fff;

        img {
            width: 64px;
            height: 64px;
            object-fit: contain
        }

        &.router-link-active::before {
            content: '';
            position: absolute;
            display: block;
            width: 5px;
            height: 5px;
            border: 1px solid lightgray;
            border-radius: 10px;
            background: lightgray;
            top: 0;
            transform: translateY(-55%);
        }
    }
}
</style>
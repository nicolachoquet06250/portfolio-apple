<template>
    <div class="dock__wrapper">
        <div class="dock" ref="dock">
            <DockIcon v-for="icon of icons" :key="icon" 
                      @click="icon.click($event)" @mouseover="icon.mouseover" @mouseout="icon.mouseout" 
                      :img="icon.img" :active="openedApplications[icon.code] && openedApplications[icon.code]?.state !== APPLICATION_STATE.CLOSED" />
        </div>
    </div>
</template>

<script setup>
import DockIcon from '@/components/DockIcon.vue';

import { ref, watch } from 'vue';
import { CURSOR, useCursor } from '@/hooks/cursor';
import { APPLICATION, APPLICATION_STATE, useOpenedApplications, useCurrentApp } from '@/hooks/apps';
import { Dock } from '@/services/dock';

import finder from '@/assets/dock/finder.png';
import appstore from '@/assets/dock/appstore.png';
import mail from '@/assets/dock/mail.png';
import messages from '@/assets/dock/messages.png';
import preferences from '@/assets/dock/systempreferences.png';
import terminal from '@/assets/dock/terminal.png';
import trash from '@/assets/dock/trashbin.png';
import photos from '@/assets/dock/photos.png';

const { setCursor } = useCursor();
const { openApplication, openedApplications } = useOpenedApplications();
const { setCurrentApp } = useCurrentApp();

const dock = ref(null);

/**
 * @param {String} appCode
 */
const openApp = appCode => 
    /**
     * @param {Event} event
     */
    event => {
        event.target.classList.add('rebond');

        const handleAnimationEnd = () => {
            console.log(`go to ${appCode}`);
            openApplication(appCode);
            setCurrentApp(appCode);
            event.target.classList.remove('rebond');
            event.target.removeEventListener('animationend', handleAnimationEnd);
        }

        event.target.addEventListener('animationend', handleAnimationEnd);
    };

const icons = ref([
    {
        mouseover: () => setCursor(CURSOR.POINTER),
        mouseout: () => setCursor(CURSOR.DEFAULT),
        click: openApp(APPLICATION.FINDER),
        code: APPLICATION.FINDER,
        img: finder
    },
    {
        mouseover: () => setCursor(CURSOR.POINTER),
        mouseout: () => setCursor(CURSOR.DEFAULT),
        click: openApp(APPLICATION.STORE),
        code: APPLICATION.STORE,
        img: appstore
    },
    {
        mouseover: () => setCursor(CURSOR.POINTER),
        mouseout: () => setCursor(CURSOR.DEFAULT),
        click: openApp(APPLICATION.PHOTOS),
        code: APPLICATION.PHOTOS,
        img: photos
    },
    {
        mouseover: () => setCursor(CURSOR.POINTER),
        mouseout: () => setCursor(CURSOR.DEFAULT),
        click: openApp(APPLICATION.MAILS),
        code: APPLICATION.MAILS,
        img: mail
    },
    {
        mouseover: () => setCursor(CURSOR.POINTER),
        mouseout: () => setCursor(CURSOR.DEFAULT),
        click: openApp(APPLICATION.MESSAGES),
        code: APPLICATION.MESSAGES,
        img: messages
    },
    {
        mouseover: () => setCursor(CURSOR.POINTER),
        mouseout: () => setCursor(CURSOR.DEFAULT),
        click: openApp(APPLICATION.SETTINGS),
        code: APPLICATION.SETTINGS,
        img: preferences
    },
    {
        mouseover: () => setCursor(CURSOR.POINTER),
        mouseout: () => setCursor(CURSOR.DEFAULT),
        click: openApp(APPLICATION.TERMINAL),
        code: APPLICATION.TERMINAL,
        img: terminal
    },
    {
        mouseover: () => setCursor(CURSOR.POINTER),
        mouseout: () => setCursor(CURSOR.DEFAULT),
        click: openApp(APPLICATION.TRASH),
        code: APPLICATION.TRASH,
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

        .rebond {
            animation-name: rebond;
            animation-duration: .4s;
            animation-iteration-count: 4;
            animation-timing-function: ease-in-out;
            animation-direction: alternate;
        }

        img {
            width: 64px;
            height: 64px;
            object-fit: contain
        }

        &.active::before {
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

@keyframes rebond {
    0% {
        transform: translateY(0px);
    }
    50% {
        transform: translateY(-5px);
    }
    100% {
        transform: translateY(0px);
    }
}
</style>
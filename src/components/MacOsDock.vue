<template>
    <div class="dock__wrapper">
        <div class="dock" ref="dock">
            <template v-for="icon of icons" :key="icon">
                <a v-if="icon.href === '#'" href="#" class="dock-icon" @mouseover="icon.mouseover" @mouseout="icon.mouseout">
                    <img :src="icon.img" />
                </a>

                <router-link v-else :to="icon.href" class="dock-icon" @mouseover="icon.mouseover" @mouseout="icon.mouseout">
                    <img :src="icon.img" />
                </router-link>
            </template>
        </div>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { CURSOR, useCursor } from '@/hooks/cursor';
import { Dock } from '@/services/dock';

import finder from '@/assets/dock/finder.png';
import appstore from '@/assets/dock/appstore.png';
import mail from '@/assets/dock/mail.png';
import messages from '@/assets/dock/messages.png';
import preferences from '@/assets/dock/systempreferences.png';
import terminal from '@/assets/dock/terminal.png';
import trash from '@/assets/dock/trashbin.png';

const { setCursor } = useCursor();

const dock = ref(null);

const icons = ref([
    {
        href: '/',
        mouseover: () => setCursor(CURSOR.POINTER),
        mouseout: () => setCursor(CURSOR.DEFAULT),
        img: finder
    },
    {
        href: '/about',
        mouseover: () => setCursor(CURSOR.POINTER),
        mouseout: () => setCursor(CURSOR.DEFAULT),
        img: appstore
    },
    {
        href: '#',
        mouseover: () => setCursor(CURSOR.POINTER),
        mouseout: () => setCursor(CURSOR.DEFAULT),
        img: mail
    },
    {
        href: '#',
        mouseover: () => setCursor(CURSOR.POINTER),
        mouseout: () => setCursor(CURSOR.DEFAULT),
        img: messages
    },
    {
        href: '#',
        mouseover: () => setCursor(CURSOR.POINTER),
        mouseout: () => setCursor(CURSOR.DEFAULT),
        img: preferences
    },
    {
        href: '#',
        mouseover: () => setCursor(CURSOR.POINTER),
        mouseout: () => setCursor(CURSOR.DEFAULT),
        img: terminal
    },
    {
        href: '#',
        mouseover: () => setCursor(CURSOR.POINTER),
        mouseout: () => setCursor(CURSOR.DEFAULT),
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
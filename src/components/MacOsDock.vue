<template>
    <div class="dock__wrapper">
        <div class="dock" ref="dock">
            <router-link to="/" class="dock-icon">
                <img :src="finder" />
            </router-link>

            <router-link to="/about" class="dock-icon">
                <img :src="appstore" />
            </router-link>

            <a href="#" class="dock-icon">
                <img :src="mail" />
            </a>

            <a href="#" class="dock-icon">
                <img :src="messages" />
            </a>

            <a href="#" class="dock-icon">
                <img :src="preferences" />
            </a>

            <a href="#" class="dock-icon">
                <img :src="terminal" />
            </a>

            <a href="#" class="dock-icon">
                <img :src="trash" />
            </a>
        </div>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { Dock } from '@/services/dock';

import finder from '@/assets/dock/finder.png';
import appstore from '@/assets/dock/appstore.png';
import mail from '@/assets/dock/mail.png';
import messages from '@/assets/dock/messages.png';
import preferences from '@/assets/dock/systempreferences.png';
import terminal from '@/assets/dock/terminal.png';
import trash from '@/assets/dock/trashbin.png';

const dock = ref(null);

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
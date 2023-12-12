<template>
    <button @dblclick="$emit('install')">
        <img :src="iconCDInstall" />

        <span>
            Installer macOS
        </span>
    </button>
</template>

<script setup lang="ts">
import { defineEmits } from 'vue';
import iconCDInstall from '@/assets/icon-cd-install-mac.png';

defineEmits(['install']);
</script>

<style lang="scss" scoped>
button {
    border: 0;
    background-color: transparent;
    border-radius: 10px;
    outline: 0;
    width: 150px;
    height: 150px;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    align-items: center;
    position: absolute;
    right: 10px;
    margin-top: 10px;

    * {
        font-size: 15px;
        color: whitesmoke;
        font-weight: bold;
    }

    &:focus, &:active {
        background-color: lightskyblue;

        * {
            color: black;
        }
    }

    img {
        width: 90px;
    }
}
</style>
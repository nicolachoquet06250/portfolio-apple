<template>
    <div id="desktop">
        <slot></slot>
    </div>
</template>

<script setup>
import { defineProps, computed } from 'vue';

const props = defineProps({
    backgroundImage: String,
    apps: Array
});

const backgroundImage = computed(() => `url(${props.backgroundImage})`)
</script>

<style lang="scss">
#desktop {
    width: 100vw;
    height: 100vh;
    background: v-bind(backgroundImage);
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
}
</style>
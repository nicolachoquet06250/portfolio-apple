<template>
    <a v-if="href === '#'" href="#" class="dock-icon" @mouseover="$emit('mouseover', $event)" @mouseout="$emit('mouseout', $event)" @click="$emit('click', $event)">
        <img :src="img" />
    </a>

    <router-link v-else :to="href" class="dock-icon" @mouseover="$emit('mouseover', $event)" @mouseout="$emit('mouseout', $event)" @click="$emit('click', $event)">
        <img :src="img" />
    </router-link>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

defineProps({
    href: String,
    mouseover: Function,
    mouseout: Function,
    click: Function,
    img: String
});

defineEmits([
    'mouseover',
    'mouseout',
    'click'
]);
</script>

<style lang="scss">

</style>
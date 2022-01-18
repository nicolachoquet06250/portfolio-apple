<template>
    <a href="#" :class="{
        'dock-icon': true,
        active
    }" 
       @mouseover="$emit('mouseover', $event)" 
       @mouseout="$emit('mouseout', $event)" 
       @click="$emit('click', $event)">
        <img :src="img" />
    </a>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

defineProps({
    active: Boolean,
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
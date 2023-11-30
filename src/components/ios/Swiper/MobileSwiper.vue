<template>
    <div ref="swipe">
        <slot />
    </div>
</template>

<script setup>
import { useSwipe } from '@vueuse/core';
import { ref, defineModel, watch } from 'vue';

const swipe = ref(null)

const emit = defineEmits(['swipe', 'swipeEnd'])

const { lengthY: distanceY } = useSwipe(swipe, {
    onSwipe() { 
        emit('swipe', distanceY)
    },
    onSwipeEnd(_, direction) {
        emit('swipeEnd', direction)
    }
});
</script>

<style lang="scss" scoped>
    div {
        display: contents;
    }
</style>

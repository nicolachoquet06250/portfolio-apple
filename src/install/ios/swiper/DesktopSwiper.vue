<template>
    <div ref="swipe">
        <slot />
    </div>
</template>

<script setup lang="ts">
import { usePointerSwipe } from '@vueuse/core';
import { ref } from 'vue';

const swipe = ref(null)

const emit = defineEmits(['swipe', 'swipeEnd'])

const { distanceY } = usePointerSwipe(swipe, {
    onSwipe() { 
        emit('swipe', distanceY)
    },
    onSwipeEnd(_, direction) {
        emit('swipeEnd', {direction, distanceY})
    }
});
</script>

<style lang="scss" scoped>
    div {
        display: contents;
    }
</style>

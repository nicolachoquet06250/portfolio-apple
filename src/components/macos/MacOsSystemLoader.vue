<template>
    <div class="system-loader">
        <div class="icon-container">
            <i class="fab fa-apple" style="color: white;"></i>
        </div>

        <div class="progress-bar"></div>

        <div class="message-container">
            <slot></slot>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, defineEmits } from 'vue';
import { useWait } from '@/hooks/wait';

const { isWait, isNotWait } = useWait();

isWait();

const emit = defineEmits(['loaded']);

const progressNb = ref(0);
const progress = computed(() => `${progressNb.value}%`);

const interval = setInterval(() => {
    progressNb.value++;
    if(progressNb.value >= 100) {
        clearInterval(interval);
        emit('loaded');
        isNotWait();
    }
}, 60);
// 60000 / 100 = 600
</script>

<style lang="scss" scoped>
.system-loader {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: black;
    z-index: 9999;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-size: 100px;

    .progress-bar {
        position: relative;
        width: 300px;
        height: 5px;
        border-radius: 10px;
        margin-top: 20px;
        color: white;
        border: 1px solid white;

        &::before {
            content: '';
            display: block;
            width: v-bind(progress);
            height: 100%;
            position: absolute;
            left: 0;
            background: white;
        }
    }

    .message-container {
        margin-top: -55px;
    }
}
</style>
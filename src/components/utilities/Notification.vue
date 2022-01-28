<template>
    <div :class="{
        notification: true,
        open: open
    }" ref="notif" v-if="!closed">
        <img :src="image" />

        <div class="body">
            <slot name="title"></slot>

            <slot name="content"></slot>
        </div>

        <div class="btn-container">
            <slot name="button" class="button"></slot>
        </div>
    </div>
</template>

<script setup>
import { defineProps, defineEmits, ref, watch, computed } from 'vue';

const props = defineProps({
    index: {
        type: Number,
        default: 0
    },
    image: String,
    latence: {
        type: Number,
        default: 0
    },
    opened: {
        type: Boolean,
        default: true
    }
});

const emit = defineEmits(['closed']);

const notif = ref(null);
const open = ref(false);
const closed = ref(!props.opened);
const index = computed(() => props.index);

setTimeout(() => {
    open.value = true;
}, props.latence);

const onAnimEnd = () => {
    emit('closed');
    closed.value = true;
}

watch(() => props.opened, () => {
    if (!props.opened) {
        open.value = false;

        setTimeout(onAnimEnd, 500);
    }
});
</script>

<style lang="scss" scoped>
.notification {
    position: absolute;
    right: 5px;
    top: calc(40px + v-bind(index) * 90px);
    z-index: 2;
    background-color: rgba(255, 255, 255, .5);
    backdrop-filter: blur(1.5rem);
    display: flex;
    justify-content: center;
    align-items: center;
    width: 400px;
    height: 80px;
    border-radius: 10px;
    transform: translateX(410px);
    transition: transform .5s ease-out;

    &.open {
        transform: translateX(0);   
    }

    img {
        width: 60px;
        height: 60px;
        margin-left: 10px;
    }

    .body {
        display: flex;
        flex-direction: column;
        margin-top: 15px;
        margin-bottom: 15px;
        flex: 1;
        padding-left: 10px;
        padding-right: 10px;

        ::v-slotted(span) {
            &:first-child {
                font-weight: bold;
                margin-bottom: 5px;
            }

            &:last-child  {
                display: -webkit-box;
                max-height: 40px;
                max-width: 240px;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
                overflow: hidden;
                text-overflow: ellipsis;
            }
        }
    }

    .btn-container {
        display: flex;
        flex-direction: column;
        height: 100%;

        ::v-slotted(button) {
            flex: 1;
            width: 100%;
            height: 100%;
            border: 0;
            border-left: 1px solid rgba(0, 0, 0, .5);
            background-color: transparent;

            &:hover, &:active {
                background-color: rgba(0, 0, 0, .5);
                color: white;
            }

            &:first-child {
                border-top-right-radius: 10px;
                border-bottom: 1px solid rgba(0, 0, 0, .5);
                border-top: 0!important;
            }

            &:last-child {
                border-bottom-right-radius: 10px;
                border-top: 1px solid rgba(0, 0, 0, .5);
                border-bottom: 0!important;
            }
        }
    }
}
</style>
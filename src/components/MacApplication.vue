<template>
    <div class="mac-application">
        <div class="top-bar" ref="topBar">
            <div class="left-bloc">
                <button class="btn-close"></button>
                <button class="btn-minmax"></button>
                <button class="btn-todock"></button>
            </div>
            
            <div class="right-bloc">
                <span>{{ appName }}</span>
            </div>
        </div>

        <div class="application-body">
            <slot></slot>
        </div>
    </div>
</template>

<script setup>
import { defineProps, computed, ref, watch } from 'vue';

const props = defineProps({
    appName: String,
    dockHeight: Number
});

const topBar = ref(null);
const topBarHeight = ref('0px');

watch(topBar, () => {
    topBarHeight.value = topBar.value.offsetHeight + 'px';
})

const dockHeight = computed(() => props.dockHeight + 'px');
</script>

<style lang="scss" scoped>
.mac-application {
    height: calc(100vh - v-bind(dockHeight) - v-bind(topBarHeight) - 5px);

    .top-bar {
        display: flex;
        background: whitesmoke;

        .left-bloc {
            padding-left: 5px;

            button {
                cursor: pointer;
                height: 10px;
                width: 10px;
                border: 1px solid black;
                border-radius: 10px;
                background: white;
                margin-right: 5px;

                &.btn-close {
                    background: red;
                }
                &.btn-minmax {
                    background: orange;
                }
                &.btn-todock {
                    background: green;
                }
            }
        }

        .right-bloc {
            display: flex;
            flex: 2;
            display: flex;
            justify-content: center;
            align-items: center;
            height: max-content;
            padding-top: 10px;
            padding-bottom: 10px;
        }
    }

    .application-body {
        height: 100%;
    }
}
</style>
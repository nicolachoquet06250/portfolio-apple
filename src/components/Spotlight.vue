<template>
    <div class="spotlight" v-if="displaySpotlight" ref="spotlight" >
        <div class="header">
            <i class="fa fa-search"></i>
            
            <input type="search" placeholder="Spotlight" autofocus />
        </div>

        <div class="body"></div>
    </div>
</template>

<script setup>
import { ref, watch, defineProps, defineEmits } from 'vue';
import { onClickOutside, useToggle, onKeyDown, onKeyUp } from '@vueuse/core';

const props = defineProps({
    open: {
        default: false
    }
})

const emit = defineEmits(['close']);

const spotlight = ref(null);
const displaySpotlight = ref(props.open);
const toggleSpotlight = useToggle(displaySpotlight);
const readyToDisplayed = ref(false);

const closeSpotlight = () => {
    displaySpotlight.value = false;
    emit('close');
}

onClickOutside(spotlight, () => closeSpotlight());

onKeyDown(['f', 'F'], e => {
    if (e.ctrlKey) {
        e.stopPropagation();
        e.preventDefault();

        readyToDisplayed.value = true;
    }
});

onKeyUp(['f', 'F'], () => {
    if (readyToDisplayed.value) {
        toggleSpotlight();
        readyToDisplayed.value = false;
    }
});

onKeyUp('Escape', () => closeSpotlight());

watch(spotlight, () => {
    if (spotlight.value) {
        spotlight.value?.querySelector('input').focus();
    }
})

watch(() => props.open, () => {
    displaySpotlight.value = props.open;
})
</script>

<style lang="scss" scoped>
.spotlight {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateX(-50%) translateY(-300%);
    width: 80%;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    background-color: rgba(0, 0, 0, .5);
    backdrop-filter: blur(.5rem);
    padding: 20px;
    border-radius: 15px;

    * {
        color: white;
    }

    .header {
        flex: 1;
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;

        input {
            flex: 1;
            margin-left: 10px;
            font-size: 30px;
            background-color: transparent;
            border: 0;
            outline: 0;
        }

        i.fa {
            font-size: 30px;
        }
    }
}
</style>
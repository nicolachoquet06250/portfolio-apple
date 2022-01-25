<template>
    <a href="#" :class="{
        'dock-icon': true,
        active
    }" 
       @mouseover="onMouseOver($event)" 
       @mouseout="onMouseOut($event)" 
       @click="$emit('click', $event)">
        <img :src="img" />
        
        <span class="tooltype">
            {{ code }}
        </span>
    </a>
</template>

<script setup>
import { defineProps, defineEmits, ref, computed } from 'vue';

const props = defineProps({
    active: Boolean,
    mouseover: Function,
    mouseout: Function,
    click: Function,
    img: String,
    code: String
});

const emit = defineEmits([
    'mouseover',
    'mouseout',
    'click'
]);

const showTooltype = ref(false);
const displayTooltype = computed(() => showTooltype.value ? 'block' : 'none');
const code = computed(() => props.code.substr(0, 1).toUpperCase() + props.code.substr(1, props.code.length - 1).toLowerCase());

const onMouseOver = e => {
    emit('mouseover', e);
    showTooltype.value = true;
};

const onMouseOut = e => {
    emit('mouseout', e);
    showTooltype.value = false;
}
</script>

<style lang="scss">
.dock-icon .tooltype {
    display: v-bind(displayTooltype);
    position: absolute;
    top: -30px;
    background-color: white;
    color: black;
    padding: 2px;
    padding-left: 10px;
    padding-right: 10px;
    font-size: 12px;
    border-radius: 4px;
    box-shadow: 0px 0px 15px 5px rgba(0, 0, 0, .3);

    &::after {
        content: '';
        display: block;
        width: 5px;
        height: 5px;
        background-color: white;
        position: absolute;
        transform: rotate(45deg) translateX(-70%);
        bottom: -5px;
        z-index: -1;
        left: 50%;
        box-shadow: 0px 0px 15px 5px rgba(0, 0, 0, .3);
    }
}
</style>
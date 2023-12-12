<template>
    <button :class="{
                [primary ? 'btn-primary' : 'btn-secondary']: true,
                ...customClass
            }" 
            @click="$emit('click', $event)" 
            @mouseover="$emit('mouseover', $event)" 
            @mouseout="$emit('mouseout', $event)">
        <slot></slot>
    </button>
</template>

<script setup lang="ts">
import { defineEmits } from 'vue';

withDefaults(defineProps<{
  customClass: Record<string, any>,
  primary: boolean
}>(), {
  primary: true
});
defineEmits(['mouseover', 'mouseout', 'click'])
</script>

<style lang="scss" scoped>
button {
    width: 100%;
    padding: 10px;
    border: none;
    border-radius: 10px;

    &:first-child {
        margin-right: 5px;
    }

    &:last-child {
        margin-left: 5px;
    }

    &.btn-primary {
        background-color: #007AFF;
        color: white;

        &:hover {
            background-color: #57A7FF;
        }
    }

    &.btn-secondary {
        background-color: #E6E6E6;
        color: black;

        &:hover {
            background-color: #EFEFEF;
        }
    }
}
</style>
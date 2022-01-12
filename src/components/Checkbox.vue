<template>
    <div class="checkbox-container">
        <input type="checkbox" :id="id" :checked="modelValue" @change="$emit('update:modelValue', $event.target.checked)" />

        <label :for="id" clickable>
            <slot></slot>
        </label>
    </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

defineProps({
    id: String,
    modelValue: Boolean
});

defineEmits(['update:modelValue']);
</script>

<style lang="scss" scoped>
input[type="checkbox"] {
    display: none;

    + label {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 20px;

        &::before {
            content: '';
            display: flex;
            justify-content: center;
            align-items: center;
            display: inline-block;
            width: 20px;
            height: 20px;
            border: 1px solid #e7e3e3;
            border-radius: 5px;
            margin-right: 5px;
        }
    }

    &:checked {
        + label {
            &::before {
                content: '✔';
                display: flex;
                color: green;
                border-color: green;
            }
        }
    }
}
</style>
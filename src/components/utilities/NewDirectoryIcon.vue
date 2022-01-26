<template>
    <button class="desktop-grid-cel desktop-grid-cel_new-directory" :ref="el => { if (el) { newDirRef = el } }" v-if="show">
        <img :src="iconDirectory" />

        <span> 
            <input type="text" v-model="model" />
        </span>
    </button>
</template>

<script setup>
import { defineProps, defineEmits, ref, watch, onMounted } from 'vue';
import { useTreeActions } from '@/hooks/finder';
import { useAuthUser } from '@/hooks/account';
import { onKeyUp } from '@vueuse/core';
import iconDirectory from '@/assets/icons/icon-directory.png';

const { add } = useTreeActions();
const { user } = useAuthUser();

const props = defineProps({
    modelValue: String,
    show: Boolean
});
const emit = defineEmits(['update:modelValue', 'ready', 'hide']);

const model = ref(props.modelValue);
const newDirRef = ref(null);

const reset = () => {
    emit('hide');
    emit('update:modelValue', 'new directory');
};

watch(() => props.modelValue, () => (model.value = props.modelValue));
watch(model, () => emit('update:modelValue', model.value));

onKeyUp('Enter', () => {
    if (props.show) {
        add(`/${user.value.account_name}/Desktop`, model.value);
        reset();
    }
});
onKeyUp('Escape', () => reset())

onMounted(() => {
    emit('ready', newDirRef.value);
});

watch(newDirRef, () => {
    if (newDirRef.value) {
        newDirRef.value.querySelector('input[type=text]').select();
    }
})
</script>

<style lang="scss" scoped>
.desktop-grid-cel {
    background: transparent;
    border: 0;
    border-radius: 10px;
    color: white;
    width: 100px;
    height: 100px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-weight: bold;

    span {
        width: 100px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    input {
        width: 90%;
        background-color: transparent;
        outline: 1px solid lightskyblue;
        border-radius: 4px;
    }

    &:active, &:focus {
        outline: 0;
        background-color: lightskyblue;

        span {
            color: black;
            white-space: normal;
            overflow: visible;
            text-overflow: unset;
        }
    }

    img {
        width: 80%;
    }

    &_new-directory {
        z-index: 2;
    }
}
</style>
<template>
    <button class="desktop-grid-cel desktop-grid-cel_new-directory" 
            :ref="el => { if (el) { newDirRef = el } }" v-if="show"
            @contextmenu.prevent.stop="$emit('contextmenu', $event)">
        <img :src="iconDirectory" />

        <span> 
            <input type="text" v-model="model" />
        </span>
    </button>
</template>

<script setup>
import { defineProps, defineEmits, ref, watch, onMounted, computed } from 'vue';
import finder from '@/hooks/finder';
import { useAuthUser } from '@/hooks/account';
import { onKeyUp, onClickOutside } from '@vueuse/core';
import iconDirectory from '@/assets/icons/icon-directory.png';

const { useTreeActions, useRootDirectory } = finder();

const { root: rootDirectory, subDirectory } = useRootDirectory();
const { add } = useTreeActions();
const { user } = useAuthUser();

const props = defineProps({
    modelValue: String,
    show: Boolean,
    color: String,
    selectColor: String,
    rootPath: {
        default: ''
    }
});
const emit = defineEmits(['update:modelValue', 'ready', 'hide', 'contextmenu']);

const model = ref(props.modelValue);
const newDirRef = ref(null);

const color = computed(() => props.color);
const selectColor = computed(() => props.selectColor);

const reset = () => {
    emit('hide');
    emit('update:modelValue', 'new directory');
};

watch(() => props.modelValue, () => (model.value = props.modelValue));
watch(model, () => emit('update:modelValue', model.value));

const createNewDirectory = () => {
    const root = rootDirectory.value !== '' ? rootDirectory.value : 'Desktop';
    const path = props.rootPath === '' 
        ? `/${user.value.account_name}/${root}${subDirectory.value !== '' ? `/${subDirectory.value}` : ''}`.replace('//', '/') 
            : `/${user.value.account_name}/${props.rootPath}`;
            
    if (props.show) {
        add(path, model.value);
        reset();
    }
};

onKeyUp('Enter', createNewDirectory);
onKeyUp('Escape', () => reset())
onClickOutside(newDirRef, createNewDirectory);

onMounted(() => {
    emit('ready', newDirRef.value);
});

watch(newDirRef, () => {
    if (newDirRef.value) {
        const input = newDirRef.value.querySelector('input[type=text]');
        input.select();
    }
})
</script>

<style lang="scss" scoped>
.desktop-grid-cel {
    background: transparent;
    border: 0;
    border-radius: 10px;
    color: v-bind(color);
    //color: white;
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
            color: v-bind(selectColor);
            //color: white;
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
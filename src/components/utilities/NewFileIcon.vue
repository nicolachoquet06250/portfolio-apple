<template>
    <button class="desktop-grid-cel desktop-grid-cel_new-file" 
            :ref="el => { if (el) { newFileRef = el } }" v-if="show"
            @contextmenu.prevent.stop="$emit('contextmenu', $event)">
        <img :src="iconUnknownFile" />

        <span> 
            <input type="text" v-model="model" />
        </span>
    </button>
</template>

<script setup>
import { defineProps, defineEmits, ref, computed, watch, onMounted } from 'vue';
import finder from '@/hooks/finder';
import { useAuthUser } from '@/hooks/account';
import { onKeyUp, onClickOutside } from '@vueuse/core';
import iconUnknownFile from '@/assets/icons/icon-unknownFile.png';

const { useTreeActions, useRootDirectory } = finder();

const { root: rootDirectory, subDirectory } = useRootDirectory();
const { createFile } = useTreeActions();
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
const newFileRef = ref(null);

const color = computed(() => props.color);
const selectColor = computed(() => props.selectColor);

const reset = () => {
    emit('hide');
    emit('update:modelValue', 'file.txt');
};

watch(() => props.modelValue, () => (model.value = props.modelValue));
watch(model, () => emit('update:modelValue', model.value));

const createNewFile = () => {
    const root = rootDirectory.value !== '' ? rootDirectory.value : 'Desktop';
    const path = props.rootPath === '' 
        ? `/${user.value.account_name}/${root}${subDirectory.value !== '' ? `/${subDirectory.value}` : ''}`.replace('//', '/') 
            : `/${user.value.account_name}/${props.rootPath}`;
            
    if (props.show) {
        createFile(path, {
            extention: model.value.split('.')[model.value.split('.').length - 1],
            name: (() => {
                let _model = model.value.split('.');
                _model.pop();

                return _model.join('.');
            })(),
            type: 'text'
        });
        reset();
    }
};

onKeyUp('Enter', createNewFile);
onKeyUp('Escape', () => reset());
onClickOutside(newFileRef, createNewFile);

onMounted(() => {
    emit('ready', newFileRef.value);
});

watch(newFileRef, () => {
    if (newFileRef.value) {
        const input = newFileRef.value.querySelector('input[type=text]');
        input.focus();
        input.setSelectionRange(0, model.value.length - '.txt'.length);
    }
})
</script>

<style lang="scss" scoped>
.desktop-grid-cel {
    background: transparent;
    border: 0;
    border-radius: 10px;
    color: v-bind(color);
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
            white-space: normal;
            overflow: visible;
            text-overflow: unset;
        }
    }

    img {
        height: 80%;
    }

    &_new-file {
        z-index: 2;
    }
}
</style>
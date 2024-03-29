<template>
    <button class="desktop-grid-cel desktop-grid-cel_new-directory" 
            :ref="el => { if (el) { newDirRef = el as HTMLButtonElement } }" v-if="show"
            @contextmenu.prevent.stop="$emit('contextmenu', $event)">
        <img :src="iconDirectory" alt="icon directory" />

        <span> 
            <input type="text" v-model="model" />
        </span>
    </button>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, computed } from 'vue';
import finder from '@/hooks/finder';
import { useAuthUser } from '@/hooks/account';
import { onKeyUp, onClickOutside } from '@vueuse/core';
import iconDirectory from '@/assets/icons/icon-directory.png';

const { useTreeActions, useRootDirectory } = finder();

const { root: rootDirectory, subDirectory } = useRootDirectory();
const { add } = useTreeActions();
const { user } = useAuthUser();

const model = defineModel<string>({
  default: ''
});
const props = withDefaults(defineProps<{
  show: boolean,
  color: string,
  selectColor: string,
  rootPath: string
}>(), {
  rootPath: ''
});
const emit = defineEmits(['ready', 'hide', 'contextmenu']);

const newDirRef = ref<HTMLButtonElement|null>(null);

const color = computed(() => props.color);
const selectColor = computed(() => props.selectColor);

const reset = () => {
    emit('hide');
    model.value = 'new directory';
};

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
        const input = newDirRef.value.querySelector<HTMLInputElement>('input[type=text]')!;
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
        width: 80%;
    }

    &_new-directory {
        z-index: 2;
    }
}
</style>
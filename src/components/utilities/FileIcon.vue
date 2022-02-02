<template>
    <button :class="{
                'finder-item': true,
                'desktop-grid-cel': true,
                active: isSelected
            }" 
            @click="selectFile()"
            @focusin="selectFile()"
            @focusout="unselect()"
            @dblclick="openAppFromDesktop()"
            ref="fileRef"
            @contextmenu.prevent.stop="showFileContextMenu()">
        <img :src="icon" />

        <slot></slot>
    </button>
</template>

<script setup>
import { defineProps, defineEmits, ref, onMounted, computed, watch } from 'vue';
import finder from '@/hooks/finder';
import { useContextualMenu } from '@/hooks/contextual-menu';
import { APPLICATION, useOpenedApplications, useCurrentApp } from '@/hooks/apps';
import { useMouse, onClickOutside, onKeyUp } from '@vueuse/core';
import iconUnknownFile from '@/assets/icons/icon-unknownFile.png';

const { useRootDirectory, useTreeActions } = finder();

const props = defineProps({
    id: Number,
    name: String,
    x: Number,
    y: Number,
    color: String,
    selectColor: String,
    icon: {
        type: String,
        default: iconUnknownFile
    }
});

const emit = defineEmits(['select', 'ready', 'unselect']);

const { openApplication } = useOpenedApplications();
const { setCurrentApp } = useCurrentApp();
const { setRoot, setSubDirectory, subDirectory } = useRootDirectory();
const { setContextMenu, showContextMenu, hideContextMenu, setContextMenuPosition } = useContextualMenu();
const { remove } = useTreeActions();
const { x: mouseX, y: mouseY } = useMouse();

const fileRef = ref(null);
const isSelected = ref(false);

const color = computed(() => props.color);
const selectColor = computed(() => props.selectColor);

const unselect = () => {
    isSelected.value = false;
    emit('unselect');
}

onClickOutside(fileRef, unselect);
onKeyUp('Delete', () => {
    if (isSelected.value) {
        remove(props.id);
    }
});

/**
 * @param {String} appCode
 */
const openApp = appCode => {
    //openApplication(appCode);
    //setCurrentApp(appCode);
};
const openAppFromDesktop = () => {
    //setSubDirectory([subDirectory.value, props.name].join('/'));
    //setRoot(`Desktop`);
    //openApp(APPLICATION.FINDER);
};
const selectFile = () => {
    isSelected.value = true;
    emit('select', {
        name: props.name,
        id: props.id,
        positon: { x: props.x, y: props.y }
    });
};
const showFileContextMenu = e => {
    console.log('context menu on file');

    setContextMenu([
        {
            name: 'Remove',
            click() {
                remove(props.id);
                hideContextMenu();
            }
        }
    ]);

    setContextMenuPosition(mouseX.value, mouseY.value);
    showContextMenu();
};

onMounted(() => {
    emit('ready', fileRef.value);
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

    &:active, &:focus, &.active {
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
}
</style>
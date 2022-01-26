<template>
    <button class="desktop-grid-cel" 
            @focus="selectDirectory()"
            @dblclick="openAppFromDesktop()"
            ref="dirRef"
            @contextmenu.prevent.stop="showDirectoryContextMenu()">
        <img :src="iconDirectory" />

        <slot></slot>
    </button>
</template>

<script setup>
import { defineProps, defineEmits, ref, onMounted } from 'vue';
import { useRootDirectory, useTreeActions } from '@/hooks/finder';
import { useContextualMenu } from '@/hooks/contextual-menu';
import { APPLICATION, useOpenedApplications, useCurrentApp } from '@/hooks/apps';
import { useMouse, onClickOutside, onKeyUp } from '@vueuse/core';
import iconDirectory from '@/assets/icons/icon-directory.png';

const props = defineProps({
    id: Number,
    name: String,
    x: Number,
    y: Number
});

const emit = defineEmits(['select', 'ready', 'unselect']);

const { openApplication } = useOpenedApplications();
const { setCurrentApp } = useCurrentApp();
const { setRoot, setSubDirectory } = useRootDirectory();
const { setContextMenu, showContextMenu, hideContextMenu, setContextMenuPosition } = useContextualMenu();
const { remove } = useTreeActions();
const { x: mouseX, y: mouseY } = useMouse();

const dirRef = ref(null);
const isSelected = ref(false);

onClickOutside(dirRef, () => {
    isSelected.value = false;
    emit('unselect');
});
onKeyUp('Delete', () => {
    if (isSelected.value) {
        remove(props.id);
    }
});

/**
 * @param {String} appCode
 */
const openApp = appCode => {
    openApplication(appCode);
    setCurrentApp(appCode);
};
const openAppFromDesktop = () => {
    setSubDirectory(props.name);
    setRoot(`Desktop`);
    openApp(APPLICATION.FINDER);
};
const selectDirectory = () => {
    isSelected.value = true;
    emit('select', {
        name: props.name,
        id: props.id,
        positon: { x: props.x, y: props.y }
    });
};
const showDirectoryContextMenu = e => {
    console.log('context menu on directory');

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
    emit('ready', dirRef.value);
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
}
</style>
<template>
    <div>
        <template v-for="file of files" :key="file.id">
            <button :class="{ active: isActive(file) }" @click.prevent.stop="openFile(file)">
                {{ file.name }}.{{ file.extention }}
            </button>

            <span>
                {{ file.parent }}
            </span>
        </template>
    </div>
</template>

<script setup>
import { useTextEdit } from '@/hooks/textedit';

const { files, activeFile, openFile } = useTextEdit();

const isActive = file => activeFile.value?.name === file.name 
    && activeFile.value?.extention === file.extention 
    && activeFile.value?.parent === file.parent;
</script>

<style lang="scss" scoped>
button {
    padding: 10px;
    border: none;
    background-color: transparent;
    border-radius: 10px;
    text-align: left;
    width: 100%;

    &.active {
        background-color: #DCD4D5;
    }

    + span {
        font-size: 11px;
    }
}
</style>
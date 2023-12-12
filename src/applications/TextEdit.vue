<template>
    <div class="textedit-root" ref="root">
        <textarea style="cursor: text!important" v-model="fileContent"></textarea>
        <!--<div ref="editableDiv"
             @keydown="onKeyDown($event)" 
             @keyup="onKeyUp($event)">
            {{ activeFile?.content }}
        </div>-->
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import { useTextEdit } from '@/hooks/textedit';

const { updateFile, activeFile } = useTextEdit();

const root = ref<HTMLDivElement|null>(null);
// const editableDiv = ref<HTMLDivElement|null>(null);
const fileContent = ref('');

onMounted(() => (root.value!.parentElement!.style.paddingLeft = '0'));

/*const moveCursorToEnd = () => {
    const textChildren = Array.from(editableDiv.value?.childNodes ?? []).reduce((r, c) => {
        return c.nodeName && c.nodeName === '#text' ? [...r, c] : r;
    }, []);
    const lastChild = textChildren[textChildren.length - 1];

    const range = document.createRange();
    const sel = window.getSelection();
    
    range.setStart(lastChild, lastChild.length);
    range.collapse(true);

    sel.removeAllRanges();
    sel.addRange(range);

    editableDiv.value.focus();
}*/

// const isTab = ref(false);
/*const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Tab') {
        isTab.value = true;
        e.preventDefault();
        e.stopPropagation();
    }
};*/

/*const onKeyUp = (e: KeyboardEvent) => {
    console.log(isTab.value, e.key);
    if (isTab.value) {
        console.log('je fais rien pour les tabulations pour le moment')
        //fileContent.value += '&nbsp;&nbsp;&nbsp;&nbsp;';
        //moveCursorToEnd();
    } else {
        //activeFile.value.content = e.target.innerText + e.key;
    }
    isTab.value = false;
};*/

onBeforeUnmount(() => {
    updateFile(activeFile.value!, fileContent.value);
});

watch([activeFile], (_, [oldActiveFile]) => {
    if (oldActiveFile && activeFile.value!.id !== oldActiveFile.id) {
        updateFile(oldActiveFile, fileContent.value);
    }
    
    fileContent.value = activeFile.value!.content;
});
</script>

<style lang="scss" scoped>
.textedit-root {
    height: 100%;

    textarea {
        height: calc(100% - 5px);
        width: 100%;
        resize: none;
        border: none;
        outline: none;

        + div {
            padding: 5px;
            max-width: 100%;
            height: 100%;
            cursor: text;
            overflow-wrap: anywhere;
            outline: none;
        }
    }
}
</style>
<template>
    <div class="textedit-root" ref="root">
        <textarea style="cursor: text!important" v-model="fileContent"></textarea>
        <div contenteditable="true" 
             ref="editableDiv"
             @keydown="onKeyDown($event)" 
             @keyup="onKeyUp($event)" 
             v-html="fileContent"></div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const root = ref(null);
const editableDiv = ref(null);
const fileContent = ref('Voici un contenu de fichier');

onMounted(() => (root.value.parentElement.style.paddingLeft = '0'));

const moveCursorToEnd = () => {
    const range = document.createRange();
    const sel = window.getSelection();
    range.setStart(
        editableDiv.value.childNodes[editableDiv.value.childNodes.length - 1], 
        editableDiv.value.childNodes[editableDiv.value.childNodes.length - 1].length - 1
    );
    range.collapse(true);
    sel.removeAllRanges();
    sel.addRange(range);
    editableDiv.value.focus();
}

const isTab = ref(false);
const onKeyDown = e => {
    if (e.key === 'Tab') {
        isTab.value = true;
        e.preventDefault();
        e.stopPropagation();
    }
};

const onKeyUp = e => {
    console.log(isTab.value, e.key);
    if (isTab.value) {
        console.log('je fais rien pour les tabulations pour le moment')
        //fileContent.value += '&nbsp;&nbsp;&nbsp;&nbsp;';
        //moveCursorToEnd();
    }
    isTab.value = false;
};
</script>

<style lang="scss" scoped>
.textedit-root {
    height: 100%;

    textarea {
        display: none;
        height: calc(100% - 5px);
        width: 100%;
        resize: none;
        border: none;

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
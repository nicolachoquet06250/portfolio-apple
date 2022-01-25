import { ref, reactive, computed } from 'vue';

const contextMenu = ref([]);
const displayContextMenu = ref(false);
const contextMenuPosition = reactive({ x: 0, y: 0 });

export const useContextualMenu = () => ({
    show: computed(() => displayContextMenu.value),
    position: computed(() => contextMenuPosition),
    contextMenu: computed(() => contextMenu.value),

    setContextMenu(menu) {
        contextMenu.value = menu;
    },
    showContextMenu() {
        displayContextMenu.value = true;
    },
    hideContextMenu() {
        displayContextMenu.value = false;
    },
    setContextMenuPosition(x, y) {
        contextMenuPosition.x = x;
        contextMenuPosition.y = y;
    }
});
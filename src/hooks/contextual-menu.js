import { ref, computed } from 'vue';

const contextMenu = ref([]);

export const useContextualMenu = () => ({
    contextMenu: computed(() => contextMenu.value),

    setContextMenu(menu) {
        contextMenu.value = menu;
    }
});
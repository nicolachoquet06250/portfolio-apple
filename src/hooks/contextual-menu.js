import { ref, reactive, computed } from 'vue';
import { useAuthUser } from '@/hooks/account';

const contextMenu = ref([]);
const displayContextMenu = ref(false);
const contextMenuPosition = reactive({ x: 0, y: 0 });

export const useContextualMenu = () => {
    const onOverlayClick = ref(null);

    return {
        show: computed(() => displayContextMenu.value),
        position: computed(() => contextMenuPosition),
        contextMenu: computed(() => contextMenu.value),
    
        setContextMenu(menu) {
            contextMenu.value = menu;
        },
        showContextMenu(_onOverlayClick) {
            displayContextMenu.value = true;
            const overlay = document.createElement('div');
            overlay.classList.add('new-directory-overlay');
            onOverlayClick.value = _onOverlayClick;
            overlay.addEventListener('click', onOverlayClick.value);
            document.querySelector('#desktop').appendChild(overlay);
        },
        hideContextMenu() {
            const overlay = document.querySelector('#desktop .new-directory-overlay');
            overlay.removeEventListener('click', onOverlayClick.value);
            overlay.remove();
            displayContextMenu.value = false;
        },
        setContextMenuPosition(x, y) {
            contextMenuPosition.x = x;
            contextMenuPosition.y = y;
        }
    };
};
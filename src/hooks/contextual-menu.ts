import { ref, reactive, computed } from 'vue';

const contextMenu = ref<any[]>([]);
const displayContextMenu = ref(false);
const contextMenuPosition = reactive({ x: 0, y: 0 });

export const useContextualMenu = <Menu extends any[]>() => {
    const onOverlayClick = ref<MouseEvent|Function|null>(null);

    return {
        show: computed(() => displayContextMenu.value),
        position: computed(() => contextMenuPosition),
        contextMenu: computed(() => contextMenu.value),
    
        setContextMenu(menu: Menu) {
            contextMenu.value = menu;
        },
        showContextMenu(_onOverlayClick?: Function) {
            displayContextMenu.value = true;
            const overlay = document.createElement('div')!;
            overlay.classList.add('new-directory-overlay');
            onOverlayClick.value = _onOverlayClick ?? (() => null);
            // @ts-expect-error
            overlay.addEventListener('click', onOverlayClick.value);
            document.querySelector('#desktop')!.appendChild(overlay);
        },
        hideContextMenu() {
            const overlay = document.querySelector('#desktop .new-directory-overlay')!;
            // @ts-expect-error
            overlay.removeEventListener('click', onOverlayClick.value);
            overlay.remove();
            displayContextMenu.value = false;
        },
        setContextMenuPosition(x: number, y: number) {
            contextMenuPosition.x = x;
            contextMenuPosition.y = y;
        }
    };
};
import { ref, computed, watch } from 'vue';

export const CURSOR = {
    POINTER: 'pointer',
    DEFAULT: 'normal',
    MOVE: 'move'
};

const currentCursor = ref(CURSOR.DEFAULT);

export const useCursor = () => ({
    cursor: computed(() => currentCursor.value),
    cursorImage: computed(() => `url("/cursors/_${currentCursor.value}.png")`),

    setCursor(cursor) {
        if (Array.from(Object.keys(CURSOR)).map(c => CURSOR[c]).indexOf(cursor) === -1) {
            throw new Error('Le curseur doit être compris dans les valeures suivantes: ' + Array.from(Object.keys(CURSOR)).map(c => CURSOR[c]).join(' | ') + ', or il est ' + cursor)
        }
        
        currentCursor.value = cursor;
    }
});

watch(currentCursor, () => {
    if (currentCursor.value === CURSOR.POINTER) {
        document.querySelector('#app').classList.add('pointer');
    } else {
        document.querySelector('#app').classList.remove('pointer');
    }
})
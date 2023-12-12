import {ref, computed, watch, ComputedRef} from 'vue';

// export const CURSOR = {
//     POINTER: 'pointer',
//     DEFAULT: 'normal',
//     MOVE: 'move'
// };
export enum CURSOR {
    POINTER = 'pointer',
    DEFAULT = 'normal',
    MOVE = 'move',
    TEXT = 'text'
}

const currentCursor = ref<CURSOR>(CURSOR.DEFAULT);

type UseCursorReturn<C extends CURSOR> = {
    cursor: ComputedRef<C>,
    cursorImage: ComputedRef<`url("/cursors/_${C}.png")`>,

    setCursor(cursor: C): void
}

export const useCursor = <C extends CURSOR>(): UseCursorReturn<C> => ({
    cursor: computed<C>(() => currentCursor.value as C),
    cursorImage: computed(
        () => `url("/cursors/_${currentCursor.value}.png")` as `url("/cursors/_${C}.png")`
    ),

    setCursor(cursor) {
        if (Array.from(Object.entries(CURSOR)).map(([,c]) => c).indexOf(cursor) === -1) {
            throw new Error('Le curseur doit être compris dans les valeures suivantes: ' + Array.from(Object.entries(CURSOR)).map(([,c]) => c).join(' | ') + ', or il est ' + cursor)
        }
        
        currentCursor.value = cursor;
    }
});

watch(currentCursor, () => {
    if (currentCursor.value === CURSOR.POINTER) {
        document.querySelector('#app')!.classList.add('pointer');
    } else {
        document.querySelector('#app')!.classList.remove('pointer');
    }
})
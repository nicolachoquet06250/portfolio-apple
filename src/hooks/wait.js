import { ref, computed } from 'vue';

const waiting = ref(false);

export const useWait = () => ({
    waiting: computed(() => waiting.value),

    isWait() {
        waiting.value = true;
    },
    isNotWait() {
        waiting.value = false;
    }
});
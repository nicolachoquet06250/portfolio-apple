import { ref, computed, watch } from 'vue';

const installed = ref(localStorage.getItem('installed'));

export const useInstalled = () => ({
    installed: computed(() => installed.value),

    isInstalled() {
        installed.value = true;
    },
    isNotInstalled() {
        installed.value = false;
    }
});

watch(installed, () => {
    if (installed.value) {
        localStorage.setItem('installed', '1');
    } else {
        localStorage.removeItem('installed');
    }
});
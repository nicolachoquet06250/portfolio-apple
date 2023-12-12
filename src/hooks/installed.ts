import { ref, computed, watch } from 'vue';

const installed = ref(!!localStorage.getItem('installed'));
const skipped = ref(!!localStorage.getItem('install_skipped'));

export const useInstalled = () => ({
    installed: computed(() => installed.value),
    skipped: computed(() => skipped.value),

    isInstalled() {
        installed.value = true;
    },
    isNotInstalled() {
        installed.value = false;
    },

    isSkipped() {
        skipped.value = true;
    },
    isNotSkipped() {
        skipped.value = false;
    }
});

watch(installed, () => {
    if (installed.value) {
        localStorage.setItem('installed', '1');
    } else {
        localStorage.removeItem('installed');
    }
});

watch(skipped, () => {
    if (skipped.value) {
        localStorage.setItem('install_skipped', '1');
    } else {
        localStorage.removeItem('install_skipped');
    }
});
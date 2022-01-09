import { ref, computed } from 'vue';

const currentApp = ref(null);

export const useCurrentApp = () => ({
    currentApp: computed(() => currentApp.value),

    setCurrentApp(_currentApp) {
        currentApp.value = _currentApp;
    }
})
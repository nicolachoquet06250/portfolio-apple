import { ref, computed } from 'vue';

const selectedTab = ref('');

export const useStore = () => ({
    selectedTab: computed(() => selectedTab.value),

    selectTab(tab) {
        selectedTab.value = tab;
    }
});
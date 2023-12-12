
import { ref, computed } from 'vue';

const selectedTab = ref('');

export const useMails = () => ({
    selectedTab: computed(() => selectedTab.value),

    selectTab(tab: string) {
        selectedTab.value = tab;
    }
});
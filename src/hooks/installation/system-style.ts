import { ref, computed } from 'vue';
import iconThemeMacDark from '@/assets/install-icons/mac-style-dark.png';
import iconThemeMacLite from '@/assets/install-icons/mac-style-lite.png';
import iconThemeMacAuto from '@/assets/install-icons/mac-style-auto.png';

export const THEMES = [
    {
        icon: iconThemeMacLite,
        label: 'Clair',
        value: 'light'
    },
    {
        icon: iconThemeMacDark,
        label: 'Sombre',
        value: 'dark'
    },
    {
        icon: iconThemeMacAuto,
        label: 'Automatique',
        value: 'auto'
    }
];

const selectedTheme = ref(THEMES[0].value);

export const useTheme = () => ({
    selectedTheme: computed(() => selectedTheme.value),

    /**
     * @param {'lite'|'dark'|'auto'} theme 
     */
    selectTheme(theme) {
        selectedTheme.value = theme;
    }
});
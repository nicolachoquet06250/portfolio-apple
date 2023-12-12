import { ref, computed } from 'vue';
import iconThemeMacDark from '@/assets/install-icons/mac-style-dark.png';
import iconThemeMacLite from '@/assets/install-icons/mac-style-lite.png';
import iconThemeMacAuto from '@/assets/install-icons/mac-style-auto.png';

type Theme = {
    icon: string,
    label: string,
    value: Themes
}

enum Themes {
    LIGHT = 'light',
    DARK = 'dark',
    AUTO = 'auto'
}

export const THEMES: Theme[] = [
    {
        icon: iconThemeMacLite,
        label: 'Clair',
        value: Themes.LIGHT
    },
    {
        icon: iconThemeMacDark,
        label: 'Sombre',
        value: Themes.DARK
    },
    {
        icon: iconThemeMacAuto,
        label: 'Automatique',
        value: Themes.AUTO
    }
];

const selectedTheme = ref(THEMES[0].value);

export const useTheme = () => ({
    selectedTheme: computed(() => selectedTheme.value),

    selectTheme(theme: Themes) {
        selectedTheme.value = theme;
    }
});
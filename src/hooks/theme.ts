import { ref, computed, watch } from 'vue';
import { useDatabase } from '@/hooks/database/hooks';
import { useInstalled } from '@/hooks/installed';

const { installed, skipped } = useInstalled();
const {
    settings,
    getSettingsFromIndex
} = useDatabase('portfolio-apple', 'settings');

const html = ref(document.querySelector('html')!);
const isDark = ref(localStorage.getItem('vueuse-color-scheme') === 'auto');

watch(html, () => {
    isDark.value = html.value.classList.contains('dark');
});

watch(isDark, () => {
    localStorage.setItem('vueuse-color-scheme', isDark.value ? 'auto' : 'light');
    html.value.classList[isDark.value ? 'add' : 'remove']('dark');
});

export const useDark = () => ({
    isDark: computed(() => isDark.value),

    toggleDark() {
        isDark.value = !isDark.value;
    }
});

watch(settings, (settings) => {
    isDark.value = settings!.value === 'dark';
});

watch(installed, (installed) => {
    if (installed && !skipped.value) {
        getSettingsFromIndex('field', 'theme');
    }
})
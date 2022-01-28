import { ref, computed, watch } from 'vue';
import { useDatabase, TABLES, getParams } from '@/hooks/database';
import { useInstalled } from '@/hooks/installed';

const { installed, skipped } = useInstalled();
const { onSuccess, results: settings } = useDatabase(...getParams(TABLES.SETTINGS));

const { connect } = onSuccess(({ context: { getFromIndex } }) => getFromIndex('field', 'theme'));

const html = ref(document.querySelector('html'));
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

watch(settings, () => {
    isDark.value = settings.value.value === 'dark';
});

watch(installed, () => {
    if (installed.value && !skipped.value) {
        connect();
    }
})
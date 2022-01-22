import { ref, computed } from 'vue';

const selectedLangue = ref('');
const selectedCountry = ref('');

export const LANGUES = [
    {
        value: 'fr',
        displayed: 'Français'
    },
    {
        value: 'en',
        displayed: 'English'
    }
];

export const COUNTRIES = [
    {
        value: 'us',
        displayed: 'Etats-Unis',
        lang: 'en'
    },
    {
        value: 'fr',
        displayed: 'France',
        lang: 'fr'
    },
    {
        value: 'en',
        displayed: 'Royaume-Uni',
        lang: 'en'
    },
];

const selectCountry = country => {
    selectedCountry.value = country;
};

export const useCountries = () => ({
    selectedCountry: computed(() => selectedCountry.value),
    country: computed(() => COUNTRIES.reduce((r, c) => c.value === selectedCountry.value ? c : r, null)),

    selectCountry
});

export const useLangues = () => ({
    selectedLangue: computed(() => selectedLangue.value),
    langue: computed(() => LANGUES.reduce((r, c) => c.value === selectedLangue.value ? c : r, null)),

    selectLangue(langue) {
        selectedLangue.value = langue;
        selectCountry(COUNTRIES.reduce((r, c) => c.lang === selectedLangue.value ? c.lang : r, ''));
    }
});
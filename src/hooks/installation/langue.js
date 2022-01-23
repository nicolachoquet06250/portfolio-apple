import { ref, computed } from 'vue';
import iconFrFlag from '@/assets/flags/flag-french.png';
import iconUkFlag from '@/assets/flags/flag-uk.png';
import iconUsFlag from '@/assets/flags/flag-usa.png';

const selectedLangue = ref('');
const selectedCountry = ref('');

export const LANGUES = [
    {
        value: 'fr',
        flag: iconFrFlag,
        displayed: 'Français'
    },
    {
        value: 'en',
        flag: iconUkFlag,
        displayed: 'English'
    }
];

export const COUNTRIES = [
    {
        value: 'us',
        flag: iconUsFlag,
        displayed: 'Etats-Unis',
        lang: 'en'
    },
    {
        value: 'fr',
        flag: iconFrFlag,
        displayed: 'France',
        lang: 'fr'
    },
    {
        value: 'en',
        flag: iconUkFlag,
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
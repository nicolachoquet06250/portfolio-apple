import { ref, computed } from 'vue';
import iconFrFlag from '@/assets/flags/flag-french.png';
import iconUkFlag from '@/assets/flags/flag-uk.png';
import iconUsFlag from '@/assets/flags/flag-usa.png';

const selectedLangue = ref((localStorage.getItem('compiled-install-data') && JSON.parse(localStorage.getItem('compiled-install-data')!).selectedLangue
    ? JSON.parse(localStorage.getItem('compiled-install-data')!).selectedLangue : ''));
const selectedCountry = ref((localStorage.getItem('compiled-install-data') && JSON.parse(localStorage.getItem('compiled-install-data')!).selectedCountry
    ? JSON.parse(localStorage.getItem('compiled-install-data')!).selectedCountry : ''));

export type Language = {
    value: string,
    flag: string,
    displayed: string
}

export const LANGUES: Language[] = [
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

export type Country = {
    value: string,
    flag: string,
    displayed: string,
    lang: string
}

export const COUNTRIES: Country[] = [
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

const selectCountry = (country: string) => {
    selectedCountry.value = country;
};

export const useCountries = () => ({
    selectedCountry: computed(() => selectedCountry.value),
    country: computed(() => COUNTRIES.reduce<Country|null>((r, c) =>
        c.value === selectedCountry.value ? c : r, null)),

    selectCountry
});

export const useLangues = () => ({
    selectedLangue: computed(() => selectedLangue.value),
    langue: computed(() => LANGUES.reduce<Language|null>((r, c) =>
        c.value === selectedLangue.value ? c : r, null)),

    selectLangue(langue: string) {
        selectedLangue.value = langue;
        selectCountry(COUNTRIES.reduce((r, c) => c.lang === selectedLangue.value ? c.lang : r, ''));
    }
});
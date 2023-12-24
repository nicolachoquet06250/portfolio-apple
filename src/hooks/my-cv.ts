import {Component, computed, ref} from 'vue';
import PersonalInformations from '@/applications/PersonalCv/body/PersonalInformations.vue';
import Competences from '@/applications/PersonalCv/body/Competences.vue';

export enum CV_TABS {
    PERSONAL_INFORMATIONS = 'personal-informations',
    COMPETENCES = 'competences',
}

const items: {key: CV_TABS, label: string, component: Component}[] = [
    {
        key: CV_TABS.PERSONAL_INFORMATIONS,
        label: 'Informations personnelles',
        component: PersonalInformations,
    },
    {
        key: CV_TABS.COMPETENCES,
        label: 'Competences',
        component: Competences,
    },
]

const tab = ref<CV_TABS>(items[0].key);

export const useCv = () => {
    return {
        tab: computed(() => tab.value),
        label: computed(() =>
            Object.entries(items)
                .filter(item => item[0] === tab.value)[1]!
        ),
        component: computed(() =>
            items.filter(({key}) => key === tab.value)
                .map(({component}) => component)[0]!
        ),
        items,

        setTab(t: CV_TABS) {
            tab.value = t;
        }
    }
}
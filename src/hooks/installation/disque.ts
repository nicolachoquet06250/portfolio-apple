import { ref, computed } from 'vue';
import iconDisque from '@/assets/install-icons/icon-disque.png';

const choosenDisque = ref<string>((localStorage.getItem('compiled-install-data') && JSON.parse(localStorage.getItem('compiled-install-data')!).choosenDisque
    ? JSON.parse(localStorage.getItem('compiled-install-data')!).choosenDisque : ''));

type Disque = {
    icon: string,
    name: string,
    stockage: number
};

export const DISQUES = [
    {
        icon: iconDisque,
        name: 'macOS Big Sur',
        stockage: 60
    }
];

export const useDisque = () => ({
    choosenDisque: computed(() => choosenDisque.value),
    disque: computed(() => DISQUES.reduce<Disque|null>((r, c) =>
        c.name === choosenDisque.value ? c : r, null)),

    chooseDisque(disque: string) {
        choosenDisque.value = disque;
    }
});
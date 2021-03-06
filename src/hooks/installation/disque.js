import { ref, computed } from 'vue';
import iconDisque from '@/assets/install-icons/icon-disque.png';

const choosenDisque = ref('');

export const DISQUES = [
    {
        icon: iconDisque,
        name: 'macOS Big Sur',
        stockage: 60
    }
];

export const useDisque = () => ({
    choosenDisque: computed(() => choosenDisque.value),
    disque: computed(() => DISQUES.reduce((r, c) => c.name === choosenDisque.value ? c : r, null)),

    chooseDisque(disque) {
        choosenDisque.value = disque;
    }
});
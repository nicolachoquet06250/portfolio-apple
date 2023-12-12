import { ref, computed } from 'vue';

const menus = ref({});
const stepTitle = ref('');
const rebooted = ref(false);

export const useMenu = () => ({
    menus: computed(() => menus.value),
    stepTitle: computed(() => stepTitle.value),
    rebooted: computed(() => rebooted.value),

    setMenu<M>(tab: string, menu: M) {
        menus.value = {...menus.value, [tab]: menu};
    },
    resetMenus() {
        menus.value = {};
    }
});

export const useStepTitle = (title: string) => {
    stepTitle.value = title;
};

export const isRebooted = () => (rebooted.value = true);
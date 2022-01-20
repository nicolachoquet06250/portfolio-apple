import { ref, computed } from 'vue';

const menus = ref({});
const stepTitle = ref('');
const rebooted = ref(false);

export const useMenu = () => ({
    menus: computed(() => menus.value),
    stepTitle: computed(() => stepTitle.value),
    rebooted: computed(() => rebooted.value),

    setMenu(tab, menu) {
        menus.value = {...menus.value, [tab]: menu};
    },
    resetMenus() {
        menus.value = {};
    }
});

/**
 * @param {String} title 
 */
export const useStepTitle = title => {
    stepTitle.value = title;
};

export const isRebooted = () => (rebooted.value = true);
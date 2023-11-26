import {computed, ref} from "vue";

const systemLoading = ref(true);

export const useSystemLoading = () => ({
    systemLoading: computed(() => systemLoading.value),
    setSystemLoading(isLoading) {
        systemLoading.value = isLoading;
    }
})
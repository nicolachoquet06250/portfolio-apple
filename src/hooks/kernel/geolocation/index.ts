import {ComputedRef} from 'vue';
import {useGeolocation as useGeolocationFromVueUse} from '@vueuse/core';
import {toComputed} from '@/macros/vue';

export const useGeolocation = () => {
    const {coords, error} = useGeolocationFromVueUse({
        immediate: true
    });

    return {
        ...Array.from(Object.keys(coords.value)).reduce((r, k) => ({
            ...r,
            [k]: toComputed(() => coords.value[k as keyof typeof coords.value])
        }), {} as Record<keyof typeof coords.value, ComputedRef<keyof typeof coords.value>>),
        error: toComputed(error),
        accuracyUnit: 'm'
    };
};
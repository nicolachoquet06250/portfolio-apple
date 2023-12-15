import {computed, ComputedRef, ref} from 'vue';
import {createSetter, Setter} from '@/commands/types';

export const useTerminalLocation = (): [location: ComputedRef<string>, setLocation: Setter<string>] => {
    const location = ref('/');
    const setLocation = createSetter(location);

    return [computed(() => location.value), setLocation];
}
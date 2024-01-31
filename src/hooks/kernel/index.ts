import { useScheduler, useProcess } from './scheduler.ts';
import type { KernelScheduler } from './scheduler.ts';

import keyboard, { useKeyboard } from './keyboard';
import type { KernelKeyboard } from './keyboard/types';
export { KeyboardEvent } from './keyboard/enums';

export type UseKernel = () => {
    keyboard: KernelKeyboard,
    scheduler: KernelScheduler
};

export const useKernel: UseKernel = () => {
    const scheduler = useScheduler();
    
    return {
        keyboard,
        scheduler
    }
}

export default () => ({
    useKernel,
    useScheduler,
    useProcess,
    useKeyboard
})
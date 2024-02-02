import { useScheduler, useProcess } from './scheduler';
import type { KernelScheduler } from './scheduler';

import keyboard, { useKeyboard } from './keyboard';
import type { KernelKeyboard } from './keyboard/types';
export { KeyboardEvent } from './keyboard/enums';

import { useNetwork } from './network';

import { useClipboard } from '@/hooks/kernel/clipboard';

import { useGeolocation } from './geolocation';

import {
    useFileSystem, useFSTree,
    useFiles, useFolders,
    useDirectories, useMock
} from './filesystem';

export type UseKernel = () => {
    keyboard: KernelKeyboard,
    scheduler: KernelScheduler
};

export const useKernel: UseKernel = () => {
    const scheduler = useScheduler();
    
    return {keyboard, scheduler}
}

export default () => ({
    useKernel, useScheduler,
    useProcess, useKeyboard,
    useNetwork, useClipboard,
    useGeolocation,
    useFileSystem, useFSTree,
    useFiles, useFolders,
    useDirectories, useMock
})
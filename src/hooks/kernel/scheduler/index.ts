import {ref, computed} from "vue";
import type { ComputedRef } from "vue";
import { useUuid } from '@/hooks/uuid.ts';

export type Process<D extends Record<string, any>> = {
    id: string,
    time: number,
    data: D,
    run(data: D): Promise<void|D>|string|boolean,
    deleted?: (data: D) => void
};

const runProcess = <D extends Record<string, any>>(process: Process<D>) =>
    new Promise<D>(
        (resolve, reject) => {
            const result = process.run(process.data);
            
            if (result instanceof Promise) {
                result.then(() => resolve(process.data)).catch(reject);
            }
            else if (typeof result === 'boolean' && result)
                resolve(process.data);
            else reject(result);
        }
    );

export type KernelScheduler = {
    processes: ComputedRef<Process<any>[]>,
    
    createProcess<D extends Record<string, any>>(process: Omit<Process<D>, 'id'|'time'>): Promise<D>,
    removeProcess<D extends Record<string, any>>(process: Process<D>): void
};

type UseScheduler = () => KernelScheduler;

const processes = ref<Process<any>[]>([]);

const removeProcess = <D extends Record<string, any>>(process: Process<D>) => {
    const index = processes.value.indexOf(process);

    if (index !== -1) {
        processes.value.splice(index, 1);
    }
};
const createProcess = (id: ComputedRef<string>) => async <D extends Record<string, any>>(process: Omit<Process<D>, 'id' | 'time'>) => {
    const completeProcess: Process<any> = {
        ...process,
        id: id.value,
        time: Date.now()
    };
    processes.value.push(completeProcess);

    try {
        return await runProcess(completeProcess);
    }
    finally {
        removeProcess(completeProcess);
        completeProcess.deleted?.(completeProcess.data);
    }
};

export const useScheduler: UseScheduler = () => {
    const id = useUuid();

    return {
        processes: computed(() => processes.value.sort((a, b) =>
            a.time - b.time
        )),

        createProcess: createProcess(id),
        removeProcess
    };
};

export type UseProcess = () => [create: KernelScheduler['createProcess'], remove: KernelScheduler['removeProcess']]

export const useProcess: UseProcess = () => {
    const id = useUuid();

    return [
        createProcess(id),
        removeProcess
    ];
}
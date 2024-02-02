import {computed, ComputedGetter, ComputedRef, isRef, Ref} from 'vue';

export const toComputed = <
    T extends any,
    R extends ComputedRef<T>
>(v: ComputedRef<T>|Ref<T>|ComputedGetter<T>): R => {
    if (isRef(v)) return computed(() => (v as Ref<T>).value) as unknown as R;
    else if ('value' in v && !isRef(v)) return v as unknown as R;
    return computed(v as unknown as ComputedGetter<R>) as unknown as R;
};

export type ToMultiComputed<L extends Record<string, any>> = {
    [K in keyof L]: L[K] extends Ref<infer T>
        ? ComputedRef<T> : (L[K] extends ComputedRef<infer T2>
            ? ComputedRef<T2> : (L[K] extends ComputedGetter<infer T3>
                ? ComputedRef<T3> : ComputedRef<L[K]>))
}

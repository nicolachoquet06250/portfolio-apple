import {Models} from '@/hooks/database';
import {ComputedRef, Ref, UnwrapRef} from 'vue';

export type ModelKeysType = {
    [K in keyof Models]: Partial<
        Record<
            keyof Models[K],
            boolean | { unique: boolean, primary?: boolean }
        >
    >
};

export type BaseModel = { id: number };

type StrToUcFirst<Str extends string> = Str extends `${infer FirstLetter}${infer Rest}` ?
    `${Uppercase<FirstLetter>}${Rest}` :
    Str;

export type AddMethod<C extends keyof Models> = {
    [K in `add${StrToUcFirst<C>}`]: (item: Models[C]) => Ref<IDBValidKey|null>
}
export type AddMultiMethod<C extends keyof Models> = {
    [K in `add${StrToUcFirst<C>}s`]: (...item: Models[C][]) => Ref<(IDBValidKey|null)[]>
}
export type GetMethod<C extends keyof Models> = {
    [K in `get${StrToUcFirst<C>}s`]: (count?: number) => Ref<UnwrapRef<Models[C][]>|null>
}
export type GetFromIdMethod<C extends keyof Models> = {
    [K in `get${StrToUcFirst<C>}FromId`]: (id: number) => Ref<UnwrapRef<Models[C]>|null>
}
export type GetFromIndexMethod<C extends keyof Models> = {
    [K in `get${StrToUcFirst<C>}FromIndex`]:
        (index: string, value: string) => Ref<UnwrapRef<Models[C]>|null>
}
export type DeleteMethod<C extends keyof Models> = {
    [K in `delete${StrToUcFirst<C>}`]: (id: number) => Ref<UnwrapRef<Models[C][]>>
}
export type UpdateMethod<C extends keyof Models> = {
    [K in `update${StrToUcFirst<C>}`]:
        <
            T extends Partial<Models[C]>,
            SecondType = Required<{id: Models[C]['id']}> & Exclude<Partial<Models[C]>, 'id'>
        >(model: SecondType&T) => Ref<UnwrapRef<Models[C][]>>
}

export type UseDatabaseReturn<
    Collection extends keyof Models,
    Model = Models[Collection]
> = AddMethod<Collection> &
    AddMultiMethod<Collection> &
    GetMethod<Collection> &
    GetFromIdMethod<Collection> &
    GetFromIndexMethod<Collection> &
    DeleteMethod<Collection> &
    UpdateMethod<Collection> &
    { [K in `${Collection}s`]: ComputedRef<Model[]> } &
    { [K in Collection]: ComputedRef<Model|null> } &
    {
        result: ComputedRef<Model|Model[]|null>,
        error: ComputedRef<string|false>,
        ready: ComputedRef<boolean>
    }

export type UseDatabase = <
    Collection extends keyof Models,
    Model extends Models[Collection] = Models[Collection],
    Return = UseDatabaseReturn<Collection, Model>
>(dbName: string, collection: Collection) => Return;
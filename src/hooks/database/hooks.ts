import type {Ref, UnwrapRef} from 'vue';
import type {ItemServices} from '@/hooks/database/service/item-service';
import type {UseDatabase, UseDatabaseReturn} from '@/hooks/database/types';
import {computed, ref, watch} from 'vue';
import {Database, getModels, Models} from '@/hooks/database/service';
import modelsCollection from './models';

export enum CRUD_ACTION {
    ADD_ONE = 'addOne',
    ADD_MULTI = 'addMulti',
    GET_FROM_ID = 'getFromId',
    GET_FROM_INDEX = 'getFromIndex',
    GET_ALL = 'getAll',
    DELETE_ONE = 'deleteOne',
    UPDATE_ONE = 'UpdateOne',
}

export const useDatabase: UseDatabase = <
    Collection extends keyof Models,
    Model extends Models[Collection] = Models[Collection],
    Return = UseDatabaseReturn<Collection, Model>
>(dbName: string, collection: Collection) => {
    const error = ref('');
    const result = ref<Model|Model[]|null>(null);
    const model = ref<ItemServices|null>(null);

    const simpleResult = ref<Model|null>(null);
    const multiResults = ref<Model[]>([]);

    const ready = computed(() => model.value !== null);

    const actionQueue = ref<{
        action: CRUD_ACTION,
        fn(): Promise<void>
    }[]>([]);

    (new Database(dbName, 1)).open(...getModels())
        .then(db => {
            model.value = new modelsCollection[collection](db) as unknown as ItemServices;
            getAll();
        })
        .catch(err => {
            console.error(err)
        });

    const ucFirstCollectionName = `${collection.substring(0, 1).toUpperCase()}${collection.substring(1)}`;

    const addOne = (item: Model): Ref<IDBValidKey|null> => {
        // @ts-expect-error
        const id = ref<IDBValidKey|null>(null);

        const apply = async () => {
            id.value = await model.value!.addItem(item);
            getAll();
        };

        if (!ready.value) {
            actionQueue.value = [
                ...actionQueue.value,
                {
                    action: CRUD_ACTION.ADD_ONE,
                    fn: apply
                }
            ]
        }
        else apply();

        return id;
    };
    const addMulti = (...items: Model[]): Ref<(IDBValidKey|null)[]> => {
        const ids = ref<(IDBValidKey|null)[]>([]);

        const apply = async () => {
            return Promise.all(
                items.map(item =>
                    model.value!.addItem(item))
            ).then(p => {
                ids.value = [...p];
                getAll();
            });
        }

        if (!ready.value) {
            actionQueue.value = [
                ...actionQueue.value,
                {
                    action: CRUD_ACTION.ADD_MULTI,
                    // props: items,
                    fn: apply,
                }
            ]
        } else apply();

        return ids;
    }
    const getAll = (count?: number): Ref<UnwrapRef<Model[]>|null> => {
        const results = ref<Model[]|null>(null);

        const apply = async () => {
            const r = await model.value!.getItems(count) as UnwrapRef<Model[]>;
            result.value = r;
            results.value = r;
            multiResults.value = r;
        }

        if (!ready.value) {
            actionQueue.value = [
                ...actionQueue.value,
                {
                    action: CRUD_ACTION.GET_ALL,
                    fn: apply
                }
            ]
        }
        else apply()

        return results;
    };
    const getFromId = (id: number): Ref<UnwrapRef<Model>|null> => {
        const results = ref<Model|null>(null);

        const apply = async () => {
            const r = await model.value!.getItem(id) as UnwrapRef<Model>;
            result.value = r;
            results.value = r;
            simpleResult.value = r;
        }

        if (!ready.value) {
            actionQueue.value = [
                ...actionQueue.value,
                {
                    action: CRUD_ACTION.GET_FROM_ID,
                    fn: apply
                }
            ]
        }
        else apply();

        return results;
    };
    const getFromIndex = (index: string, value: string): Ref<UnwrapRef<Model>|null> => {
        const results = ref<Model|null>(null);

        const apply = async () => {
            const r = await model.value!.getFromIndex(index, value);
            result.value = r;
            results.value = r;
            if (r instanceof Array) {
                multiResults.value = r;
            }
            else {
                    simpleResult.value = r;
                }
        }

        if (!ready.value) {
            actionQueue.value = [
                ...actionQueue.value,
                {
                    action: CRUD_ACTION.GET_FROM_INDEX,
                    fn: apply
                }
            ]
        }
        else apply();

        return results;
    };
    const deleteOne = (id: number): Ref<UnwrapRef<Model[]>> => {
        const results = ref<Model[]>([]);

        const apply = async () => {
            await model.value!.deleteItem(id);
            const r = getAll();
            results.value = r.value!
        }

        if (!ready.value) {
            actionQueue.value = [
                ...actionQueue.value,
                {
                    action: CRUD_ACTION.DELETE_ONE,
                    fn: apply
                }
            ]
        }
        else apply();

        return results;
    };
    const updateOne = <T extends Partial<Model>, SecondType = {id: Model['id']} & Exclude<Partial<Model>, 'id'>>(item: SecondType & T): Ref<UnwrapRef<Model[]>> => {
        const results = ref<Model[]>([]);

        const apply = async () => {
            // @ts-expect-error
            await model.value!.updateItem(item);
            const r = getAll();
            results.value = r.value!
        }

        if (!ready.value) {
            actionQueue.value = [
                ...actionQueue.value,
                {
                    action: CRUD_ACTION.UPDATE_ONE,
                    fn: apply
                }
            ]
        }
        else apply();

        return results;
    };

    watch([ready, actionQueue], ([ready, actionQueue]) => {
        if (ready) {
            actionQueue.map(({fn}) => {
                fn();
            });
        }
    })

    return {
        result: computed(() => result.value),
        error: computed<string|false>(() => error.value ?? false),
        ready,
        [`${collection}s`]: computed(() => multiResults.value),
        [collection]: computed(() => simpleResult.value),

        [`add${ucFirstCollectionName}`]: addOne,
        [`add${ucFirstCollectionName}s`]: addMulti,
        [`get${ucFirstCollectionName}s`]: getAll,
        [`get${ucFirstCollectionName}FromId`]: getFromId,
        [`delete${ucFirstCollectionName}`]: deleteOne,
        [`update${ucFirstCollectionName}`]: updateOne,
        [`get${ucFirstCollectionName}FromIndex`]: getFromIndex
    } as Return
}

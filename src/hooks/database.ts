import { ref, computed, watch } from 'vue';
import type { ComputedRef } from 'vue';

const keyOptions = {
    keyPath: "id", 
    autoIncrement: true
};

export const INDEX_PARAMS = {
    UNIQUE: { unique: true }
};

export enum TABLES {
    ACCOUNT = 'account',
    SETTINGS = 'settings',
    TREE_STRUCTURE = 'tree_structure'
}

export const getParams = <T extends TABLES>(table: T): [dbName: `portfolio-apple_${T}`, table: T] =>
    [`portfolio-apple_${table}`, table];

type Request = {
    onsuccess: (e: Event) => void,
    onupgradeneeded: (e: Event) => void
};

export const useDatabase = <
    UseDatabaseResult extends {[k: string]: any} | {[k: string]: any}[] | IDBOpenDBRequest
>(dbName: string, table: string) => {
    const request = ref<Request|IDBOpenDBRequest|null>(null);
    const error = ref<string|null>(null);
    const results = ref<UseDatabaseResult>([] as unknown as UseDatabaseResult);
    
    const onSuccess = ref<((e: Event) => void)|null>(null);
    const onUpgradeNeeded = ref<((e: Event) => void)|null>(null);

    const requestEventsQueue = ref<{
        name: keyof Request,
        event: Request[keyof Request]
    }[]>([]);

    watch(onSuccess, () => {
        if (onSuccess.value) {
            if (request.value) {
                request.value.onsuccess = onSuccess.value;
            } else {
                requestEventsQueue.value = [...requestEventsQueue.value, {
                    name: 'onsuccess',
                    event: onSuccess.value
                }];
            }
        }
    });

    watch(onUpgradeNeeded, () => {
        if (onUpgradeNeeded.value) {
            if (request.value) {
                request.value.onupgradeneeded = onUpgradeNeeded.value;
            } else {
                requestEventsQueue.value = [...requestEventsQueue.value, {
                    name: 'onupgradeneeded',
                    event: onUpgradeNeeded.value
                }];
            }
        }
    });

    watch(request, () => {
        if (request.value) {
            requestEventsQueue.value.map(e => {
                if (request.value) {
                    request.value[e.name] = e.event;
                }
            });
            requestEventsQueue.value = [];
        }
    });

    type GetCbParamFromObjectReturn = {
        db: IDBDatabase,

        context: {
            store: IDBObjectStore,

            add(...els: Record<string, any>[]): void,
            remove(...els: number[]): void,
            update<E>(element: E): void,
            get(id: number): ComputedRef<UseDatabaseResult[]>,
            getAllValues(): ComputedRef<UseDatabaseResult[]>,
            getAllKeys?: <R>() => ComputedRef<R[]>,
            getFromIndex(index: string, value: string): ComputedRef<UseDatabaseResult[]>,
            addIndex?: (
                key: string,
                params: {
                    unique?: boolean,
                    multiEntry?: boolean
                }) => void
        }
    };
    type GetCbParamObject = (db: IDBDatabase, created: boolean) => GetCbParamFromObjectReturn;

    const getCbParamObject: GetCbParamObject = (db, created = true) => {
        const store = created 
            ? db.createObjectStore(table, keyOptions) 
                : db.transaction(table, "readwrite").objectStore(table);

        const params: GetCbParamFromObjectReturn  = {
            db,
            context: {
                store,

                add(...els) {
                    els.map(e => {
                        store.add(e);
                    });
                },
                remove(...ids) {
                    ids.map(id => {
                        store.delete(id)
                    });
                },
                update(element) {
                    store.put(element);
                },
                // @ts-expect-error
                get(id) {
                    store.get(id).onsuccess = e => {
                        // @ts-expect-error
                        results.value = (e.target as unknown as { result: UseDatabaseResult[] }).result
                            ? [(e.target as unknown as { result: UseDatabaseResult }).result] : [];
                    };

                    return computed(() => results.value);
                },
                // @ts-expect-error
                getAllValues() {
                    store.getAll().onsuccess = e => {
                        // @ts-expect-error
                        results.value = (e.target as unknown as { result: UseDatabaseResult[] }).result;
                    };

                    return computed(() => results.value);
                },
                // @ts-expect-error
                getFromIndex(index, value) {
                    store.index(index).get(value).onsuccess = e => {
                        // @ts-expect-error
                        results.value = (e.target as unknown as { result: UseDatabaseResult[] }).result;
                    };

                    return computed(() => results.value);
                }
            }
        };

        if (created) {
            params.context.addIndex = (key, params) => {
                store.createIndex(key, key, params);
            };
        }

        return params;
    };

    const connect = () => {
        // @ts-expect-error
        request.value = indexedDB.open(dbName, 1) as IDBOpenDBRequest;

        request.value.onerror = function() {
            error.value = 'IndexedDB n\'est pas pris en charge par votre navigateur';
        };
    };

    function _onUpgradeNeeded(cb: Function): { onSuccess: Function, connect: Function } {
        onUpgradeNeeded.value = e => {
            const db = (e.target! as unknown as { result: IDBDatabase }).result;

            // @ts-expect-error
            cb = cb?.bind(this);
            
            cb?.(getCbParamObject(db, false));

            db.close();
            request.value = null;
        };

        return {
            onSuccess: _onSuccess,
            connect
        }
    }

    function _onSuccess(cb: Function): { onUpgradeNeeded: Function, connect: Function } {
        onSuccess.value = e => {
            const db = (e.target! as unknown as { result: IDBDatabase }).result;

            // @ts-expect-error
            cb = cb?.bind(this);

            cb?.(getCbParamObject(db, false));

            db.close();
            request.value = null;
        };

        return {
            onUpgradeNeeded: _onUpgradeNeeded,
            connect
        }
    }

    return {
        error: computed(() => error.value),
        request: computed(() => request.value),
        results,

        onSuccess: _onSuccess,
        onUpgradeNeeded: _onUpgradeNeeded,
        removeDatabase() {
            indexedDB.deleteDatabase(dbName);
        },
        connect
    };
};
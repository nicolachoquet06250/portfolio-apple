import { ref, computed, watch } from 'vue';

const keyOptions = {
    keyPath: "id", 
    autoIncrement: true
};

export const INDEX_PARAMS = {
    UNIQUE: { unique: true }
};

export const TABLES = {
    ACCOUNT: 'account',
    SETTINGS: 'settings',
    TREE_STRUCTURE: 'tree_structure'
};

/**
 * @param {String} table 
 */
export const getParams = (table: string) => [`portfolio-apple_${table}`, table] as const;

export const useDatabase = <T>(dbName: string, table: string) => {
    const request = ref<IDBOpenDBRequest|null>();
    const error = ref<string>();
    const results = ref<string[]|string|Record<string, any>|T>([]);
    
    const onSuccess = ref<IDBOpenDBRequest['onsuccess']|null>(null);
    const onUpgradeNeeded = ref<IDBOpenDBRequest['onupgradeneeded']|null>(null);

    const requestEventsQueue = ref<{name: string, event: Function}[]>([]);

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
                // @ts-ignore
                request.value && (request.value[e.name] = e.event);
            });
            requestEventsQueue.value = [];
        }
    });

    const getCbParamObject = (db: IDBDatabase, created = true) => {
        const store = created 
            ? db.createObjectStore(table, keyOptions) 
                : db.transaction(table, "readwrite").objectStore(table);

        const params = {
            db,
            context: {
                store,

                add<Els extends Record<string, any>[]>(...els: Els) {
                    els.map(e => {
                        store.add(e);
                    });
                },
                remove<Ids extends number[]>(...ids: Ids) {
                    ids.map(id => {
                        store.delete(id)
                    });
                },
                update<El extends HTMLElement>(element: El) {
                    store.put(element);
                },
                get(id: number) {
                    store.get(id).onsuccess = e => {
                        results.value = (e.target as unknown as {result: string})!.result
                            ? [(e.target as unknown as {result: string})!.result] : [];
                    };

                    return computed(() => results.value);
                },
                getAllValues() {
                    store.getAll().onsuccess = e => {
                        results.value = (e.target as unknown as {result: string})!.result;
                    };

                    return computed(() => results.value);
                },
                getFromIndex(index: string, value: string) {
                    store.index(index).get(value).onsuccess = e => {
                        results.value = (e.target as unknown as {result: string})!.result;
                    };

                    return computed(() => results.value);
                }
            }
        };

        if (created) {
            type Context = typeof params.context & {
                addIndex: (
                    key: string,
                    params: {
                        unique?: boolean,
                        multiEntry?: boolean
                    }
                ) => void
            }

            (params.context as Context).addIndex = (key, params) => {
                store.createIndex(key, key, params);
            };
        }

        return params;
    };

    const connect = () => {
        request.value = indexedDB.open(dbName, 1);

        request.value.onerror = function() {
            error.value = 'IndexedDB n\'est pas pris en charge par votre navigateur';
        };
    };

    function _onUpgradeNeeded<Cb extends Function>(cb: Cb) {
        onUpgradeNeeded.value = (e) => {
            const db = (e.target as unknown as {result: IDBDatabase})!.result;

            // @ts-ignore
            cb = cb?.bind(this);
            
            cb?.(getCbParamObject(db));

            db.close();
            request.value = null;
        };

        return {
            onSuccess: _onSuccess,
            connect
        }
    }

    function _onSuccess<Cb extends Function>(cb: Cb) {
        onSuccess.value = e => {
            const db = (e.target as unknown as {result: IDBDatabase})!.result;

            // @ts-ignore
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
        results: computed<T>(() => results.value as T),

        onSuccess: _onSuccess,
        onUpgradeNeeded: _onUpgradeNeeded,
        removeDatabase() {
            indexedDB.deleteDatabase(dbName);
        },
        connect
    };
};
import { ref, computed, watch } from 'vue';

const keyOptions = {
    keyPath: "id", 
    autoIncrement: true
};

export const INDEX_PARAMS = {
    UNIQUE: { unique: true }
};

export const useDatabase = (dbName, table) => {
    const request = ref(null);
    const error = ref(null);
    const results = ref([]);
    
    const onSuccess = ref(null);
    const onUpgradeNeeded = ref(null);

    const requestEventsQueue = ref([]);

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
                request.value[e.name] = e.event;
            });
            requestEventsQueue.value = [];
        }
    });

    const getCbParamObject = (db, created = true) => {
        const store = created 
            ? db.createObjectStore(table, keyOptions) 
                : db.transaction(table, "readwrite").objectStore(table);

        const params = {
            db,
            context: {
                store,

                /**
                 * @param {...Record<String, any>} els 
                 */
                add(...els) {
                    els.map(e => {
                        store.add(e);
                    });
                },
                /**
                 * @param  {...Number} ids 
                 */
                remove(...ids) {
                    ids.map(id => {
                        store.delete(id)
                    });
                },
                /**
                 * @param {Number} id 
                 * @returns {import('vue').ComputedGetter<Array<Record<String, any>>>}
                 */
                get(id) {
                    store.get(id).onsuccess = e => {
                        results.value = e.target.result ? [e.target.result] : [];
                    };

                    return computed(() => results.value);
                },
                /**
                 * @returns {import('vue').ComputedGetter<Array<Record<String, any>>>}
                 */
                getAllValues() {
                    store.getAll().onsuccess = e => {
                        results.value = e.target.result;
                    };

                    return computed(() => results.value);
                },
                /**
                 * @returns {import('vue').ComputedGetter<Array<Record<String, any>>>}
                 */
                getAllKeys() {
                    store.getAllKeys().onsuccess = e => {
                        results.value = e.target.result;
                    };

                    return computed(() => results.value);
                },
                /**
                 * @param {String} index 
                 * @param {String} value
                 * @returns {import('vue').ComputedGetter<Array<Record<String, any>>>}
                 */
                getFromIndex(index, value) {
                    store.index(index).get(value).onsuccess = e => {
                        results.value = e.target.result;
                    };

                    return computed(() => results.value);
                }
            }
        };

        if (created) {
            /**
             * @param {String} key 
             * @param {{ unique?: Boolean, multiEntry?: Boolean }} params 
             */
            params.context.addIndex = (key, params) => {
                store.createIndex(key, key, params);
            };
        }

        return params;
    }

    return {
        error: computed(() => error.value),
        request: computed(() => request.value),
        results: computed(() => results.value),

        onSuccess(cb) {
            onSuccess.value = e => {
                const db = e.target.result;

                cb = cb?.bind(this);

                cb?.(getCbParamObject(db, false));

                db.close();
                request.value = null;
            };
        },
        onUpgradeNeeded(cb) {
            onUpgradeNeeded.value = e => {
                const db = e.target.result;

                cb = cb?.bind(this);
                
                cb?.(getCbParamObject(db));

                db.close();
                request.value = null;
            };
        },
        connect() {
            request.value = indexedDB.open(dbName, 1);

            request.value.onerror = function() {
                error.value = 'IndexedDB n\'est pas pris en charge par votre navigateur';
            };
        }
    };
};
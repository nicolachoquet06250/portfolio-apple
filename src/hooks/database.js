import { ref, computed, watch } from 'vue';

const keyOptions = {
    keyPath: "id", 
    autoIncrement: true
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
        requestEventsQueue.value.map(e => {
            request.value[e.name] = e.event;
        });
        requestEventsQueue.value = [];
    });

    return {
        error: computed(() => error.value),
        request: computed(() => request.value),
        results: computed(() => results.value),

        onSuccess(cb) {
            onSuccess.value = e => {
                const db = e.target.result;

                cb = cb?.bind(this);

                const store = db.transaction(table, "readwrite")
                    .objectStore(table);

                cb?.({
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
                        get(id) {
                            store.get(id).onsuccess = e => {
                                results.value = e.target.result ? [e.target.result] : [];
                            };

                            return computed(() => results.value);
                        },
                        getAllValues() {
                            store.getAll().onsuccess = e => {
                                results.value = e.target.result;
                            };

                            return computed(() => results.value);
                        },
                        getAllKeys() {
                            store.getAllKeys().onsuccess = e => {
                                results.value = e.target.result;
                            };

                            return computed(() => results.value);
                        }
                    }
                });
            };
        },
        onUpgradeNeeded(cb) {
            onUpgradeNeeded.value = e => {
                const db = e.target.result;

                cb = cb?.bind(this);

                const store = db.createObjectStore(table, keyOptions);

                cb?.({
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
                        get(id) {
                            store.get(id).onsuccess = e => {
                                results.value = e.target.result ? [e.target.result] : [];
                            };

                            return computed(() => results.value);
                        },
                        getAllValues() {
                            store.getAll().onsuccess = e => {
                                results.value = e.target.result;
                            };

                            return computed(() => results.value);
                        },
                        getAllKeys() {
                            store.getAllKeys().onsuccess = e => {
                                results.value = e.target.result;
                            };

                            return computed(() => results.value);
                        }
                    }
                })
            };
        },
        connect() {
            request.value = indexedDB.open(dbName, 2);

            request.value.onerror = function() {
                error.value = 'IndexedDB n\'est pas pris en charge par votre navigateur';
            };
        }
    };
};
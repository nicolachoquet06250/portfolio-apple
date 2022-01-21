import { ref, computed, watch } from 'vue';

const request = ref(null);
const error = ref(null);

const onSuccess = ref(null);
const onUpgradeNeeded = ref(null);

const keyOptions = {
    keyPath: "id", 
    autoIncrement: true
};

export const useDatabase = (dbName, table) => {
    return {
        error: computed(() => error.value),
        request: computed(() => request.value),

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
                            const result = ref(null);
                            store.get(id).onsuccess = e => {
                                result.value = e.target.result;
                            };

                            return computed(() => result.value);
                        },
                        getAllValues() {
                            const result = ref(null);
                            store.getAll().onsuccess = e => {
                                result.value = e.target.result;
                            };

                            return computed(() => result.value);
                        },
                        getAllKeys() {
                            const result = ref(null);
                            store.getAllKeys().onsuccess = e => {
                                result.value = e.target.result;
                            };

                            return computed(() => result.value);
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
                            const result = ref(null);
                            store.get(id).onsuccess = e => {
                                result.value = e.target.result;
                            };

                            return computed(() => result.value);
                        },
                        getAllValues() {
                            const result = ref(null);
                            store.getAll().onsuccess = e => {
                                result.value = e.target.result;
                            };

                            return computed(() => result.value);
                        },
                        getAllKeys() {
                            const result = ref(null);
                            store.getAllKeys().onsuccess = e => {
                                result.value = e.target.result;
                            };

                            return computed(() => result.value);
                        }
                    }
                })
            };
        },
        connect() {
            request.value = indexedDB.open(dbName, 2);

            request.value.onerror = function(event) {
                error.value = 'IndexedDB n\'est pas pris en charge par votre navigateur';
            };
        }
    };
};

watch(onSuccess, () => {
    if (onSuccess.value) {
        request.value.onsuccess = onSuccess.value;
    }
});

watch(onUpgradeNeeded, () => {
    request.value.onupgradeneeded = onUpgradeNeeded.value;
});
import {Models, modelsKeys} from '@/hooks/database/service';

export class Database {
    private db: IDBDatabase | null = null;

    constructor(private dbName: string, private version: number) {}

    public open(...collections: (keyof Models)[]): Promise<IDBDatabase> {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.version);

            request.addEventListener('error', (event) => {
                reject((event.target as IDBOpenDBRequest).error);
            });

            request.addEventListener('success', (event) => {
                this.db = (event.target as IDBOpenDBRequest).result;
                if (!this.getDB()) {
                    reject(`Erreur lors de la connexion à indexedDb`);
                }
                else {
                    resolve(this.getDB()!);
                }
            });

            request.addEventListener('upgradeneeded', (event) => {
                this.createStore((event.target as IDBOpenDBRequest).result, collections);
            });
        });
    }

    private createStore(db: IDBDatabase, collections: (keyof Models)[]): void {
        for (const collection of collections) {
            let options: IDBObjectStoreParameters | undefined = undefined;
            const allKeys =
                Object.entries(modelsKeys[collection as keyof Models]);

            const primaryKeys =
                allKeys.filter(([, d]) =>
                    d && typeof d === 'object' && d.primary);

            if (primaryKeys.length > 0) {
                const keys = primaryKeys.map(([k]) => k);

                options = {
                    keyPath: keys.length === 1 ? keys.pop() : keys,
                    autoIncrement: true
                }
            }

            const objectStore = db.createObjectStore(collection, options);
            allKeys.map(([key, options]) => {
                objectStore.createIndex(key, key, options as IDBIndexParameters);
            });
        }
    }

    public remove() {
        indexedDB.deleteDatabase(this.dbName);
    }

    public getDB(): IDBDatabase | null {
        return this.db;
    }
}
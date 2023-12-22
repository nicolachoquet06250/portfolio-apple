import {Models} from '@/hooks/database/service';

export class ItemService<
    Collection extends keyof Models,
    Id extends IDBValidKey = IDBValidKey&(Models[Collection] extends {id: infer T} ? T : number)
> {
    constructor(
        private db: IDBDatabase,
        protected collectionName: Collection
    ) {}

    public addItem(item: Models[Collection]): Promise<Id> {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.collectionName], 'readwrite');
            const objectStore = transaction.objectStore(this.collectionName);

            const request = objectStore.add(item);

            request.addEventListener('success', (event) => {
                resolve((event.target as IDBRequest).result as Id);
            });

            request.addEventListener('error', (event) => {
                reject((event.target as IDBRequest).error);
            });
        });
    }

    public getItem(itemId: Id): Promise<Models[Collection] | null> {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.collectionName], 'readonly');
            const objectStore = transaction.objectStore(this.collectionName);

            const request = objectStore.get(itemId as IDBValidKey);

            request.addEventListener('success', (event) => {
                resolve((event.target as IDBRequest).result);
            });

            request.addEventListener('error', (event) => {

                reject((event.target as IDBRequest).error);
            });
        });
    }

    public getItems(count?: number): Promise<Models[Collection][]> {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.collectionName], 'readonly');
            const objectStore = transaction.objectStore(this.collectionName);

            const request = count === undefined ?
                objectStore.getAll() :
                objectStore.getAll(null, count);

            request.addEventListener('success', (event) => {
                resolve((event.target as IDBRequest).result);
            });

            request.addEventListener('error', (event) => {
                reject((event.target as IDBRequest).error);
            });
        })
    }

    public updateItem(item: {id: Models[Collection]['id']} & Partial<Exclude<Models[Collection], 'id'>>): Promise<void> {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.collectionName], 'readwrite');
            const objectStore = transaction.objectStore(this.collectionName);

            const request = objectStore.put(item);

            request.addEventListener('success', () => {
                resolve();
            });

            request.addEventListener('error', (event) => {
                reject((event.target as IDBRequest).error);
            });
        });
    }

    public deleteItem(itemId: Id): Promise<void> {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.collectionName], 'readwrite');
            const objectStore = transaction.objectStore(this.collectionName);

            const request = objectStore.delete(itemId as IDBValidKey);

            request.addEventListener('success', () => {
                resolve();
            });

            request.addEventListener('error', (event) => {
                reject((event.target as IDBRequest).error);
            });
        });
    }

    public getFromIndex<T extends IDBValidKey>(index: string, value: T): Promise<any> {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.collectionName], 'readwrite');
            const objectStore = transaction.objectStore(this.collectionName);

            const request = objectStore.index(index).get(value as IDBValidKey);

            request.addEventListener('success', (e) => {
                resolve((e.target as IDBRequest).result);
            });

            request.addEventListener('error', (event) => {
                reject((event.target as IDBRequest).error);
            });
        });
    }
}

export type ItemServices = {
    collectionName: keyof Models,
    db: IDBDatabase,

    new(db: IDBDatabase): any

    addItem(item: Models[keyof Models]): Promise<IDBValidKey>
    getItem(itemId: IDBValidKey): Promise<Models[keyof Models] | null>
    getItems(count?: number): Promise<Models[keyof Models][]>
    updateItem(item: {id: Models[keyof Models]['id']} & Partial<Exclude<Models[keyof Models], 'id'>>): Promise<void>
    deleteItem(itemId: IDBValidKey): Promise<void>
    getFromIndex<T extends IDBValidKey>(index: string, value: T): Promise<any>
}
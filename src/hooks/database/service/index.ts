export * from '@/hooks/database/service/database';
export * as models from '../models';

import type {ModelKeysType} from '@/hooks/database/types';
import type {AccountType, SettingsType, TreeStructureType} from '@/hooks/database/models';
import {Account} from '@/hooks/database/models';
import {Database} from '@/hooks/database/service/database';

export type Models = {
    'settings': SettingsType,
    'account': AccountType,
    'treeStructure': TreeStructureType
};

export const modelsKeys: ModelKeysType = {
    'settings': {
        id: {
            unique: true,
            primary: true
        },
        field: {
            unique: true
        }
    },
    'account': {
        id: {
            unique: true,
            primary: true
        },
        account_name: {
            unique: true
        }
    },
    'treeStructure': {
        id: {
            unique: true,
            primary: true
        },
        parent: {
            unique: false
        },
        name: {
            unique: false
        },
        extension: {
            unique: false
        },
        type: {
            unique: false
        },
    }
};

export const getModels = () => Object.keys(modelsKeys) as (keyof Models)[];

// @ts-expect-error
async function example() {
    const database = new Database('MyDatabase', 1);
    const db = await database.open(...Object.keys(modelsKeys) as (keyof Models)[]);

    if (!db) return

    const account = new Account(db);

    // Exemple d'utilisation
    const newItemId = await account.addItem({
        full_name: 'Nicolas Choquet',
        account_name: 'nchoquet'
    });
    console.log(`Added item with ID: ${newItemId}`);

    const retrievedItem = await account.getItem(newItemId);
    console.log('Retrieved item:', retrievedItem);

    await account.updateItem({ id: newItemId, account_name: 'nchoquet 2' });
    console.log('Item updated');

    await account.deleteItem(newItemId);
    console.log('Item deleted');
}

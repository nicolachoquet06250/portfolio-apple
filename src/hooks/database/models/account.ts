import {ItemService} from '@/hooks/database/service/item-service';
import type {BaseModel} from '@/hooks/database/types';

export class Account extends ItemService<'account'> {
    constructor(db: IDBDatabase) {
        super(db, 'account');
    }
}

export type AccountType = Partial<BaseModel> & {
    full_name: string,
    account_name: string
}
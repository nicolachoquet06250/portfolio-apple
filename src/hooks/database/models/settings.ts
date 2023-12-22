import {ItemService} from '@/hooks/database/service/item-service';
import {BaseModel} from '@/hooks/database/types';

export class Settings extends ItemService<'settings'> {
    constructor(db: IDBDatabase) {
        super(db, 'settings');
    }
}

export type SettingsType = Partial<BaseModel> & Partial<{
    field: string,
    value: any
}>;
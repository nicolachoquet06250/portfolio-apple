import {ItemService} from '@/hooks/database/service/item-service';
import type {BaseModel} from '@/hooks/database/types';

export class TreeStructure extends ItemService<'treeStructure'> {
    constructor(db: IDBDatabase) {
        super(db, 'treeStructure');
    }
}

export type TreeStructureType = Partial<BaseModel> & {
    user_id: number,
    name: string,
    type: string,
    parent: string,
    icon?: string,
    children?: TreeStructureType[],
    content: string|null,
    extension: string|null,
    creation_date: Date|string,
    updated_date: Date|string,
    opened_date: Date|string,
};
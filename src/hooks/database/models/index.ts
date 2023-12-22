import {Account} from '@/hooks/database/models/account';
import {Settings} from '@/hooks/database/models/settings';
import {TreeStructure} from '@/hooks/database/models/tree_structure';

export * from '@/hooks/database/models/account';
export * from '@/hooks/database/models/settings';
export * from '@/hooks/database/models/tree_structure';

export default {
    'account': Account,
    'settings': Settings,
    'treeStructure': TreeStructure
} as const
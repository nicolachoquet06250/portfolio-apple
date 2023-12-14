import { ref, computed, watch } from 'vue';
import { useDatabase, getParams, TABLES } from '@/hooks/database';
import { useAuthUser } from '@/hooks/account';
import type { FinderEvent, Item } from '@/hooks/finder/types.ts';
import {
    createBreadcrumbInitializer,
    createItemActivator,
    createItemSelector,
    createTabSelector, getChildren,
    getComputedShowedItems
} from '@/hooks/finder/index.ts';

const { user } = useAuthUser();
const { 
    onSuccess: onTreeSuccess, 
    results: tree 
} = useDatabase<Item[]>(...getParams(TABLES.TREE_STRUCTURE));

const selectedTab = ref('');
const items = ref<Item[]>([]);
const showedItems = ref<Item[]>(items.value.reduce<Item[]>((r, c) =>
    c.name === selectedTab.value ? (c.children ?? []) : r, []));
const activeItem = ref('');
const breadcrumb = ref<string[]>([]);
const rootDir = ref('');
const subDirectory = ref('');

export const initBreadcrumb = createBreadcrumbInitializer(breadcrumb, selectedTab);

export const useFinder = (maxPerLine: number) => {
    onTreeSuccess(({ context: { getAllValues } }: FinderEvent) => getAllValues()).connect();

    const selectItem = createItemSelector(breadcrumb, showedItems, activeItem);
    const showedItemsComputed = getComputedShowedItems(showedItems, maxPerLine);

    return {
        selectedTab: computed(() => selectedTab.value),
        showedItems: showedItemsComputed,
        activatedItem: computed(() => activeItem.value),
        breadcrumb: computed(() => breadcrumb.value),

        selectTab: createTabSelector(rootDir, selectedTab),
        initBreadcrumb,
        selectItem,
        activeItem: createItemActivator(activeItem),
        
        backInPath() {
            if (breadcrumb.value.length > 1) {
                const copy = [...breadcrumb.value];
                copy.pop();
                const last = copy.pop()!;
                
                showedItems.value = getChildren(tree)(`/${user.value.account_name}/${copy.join('/')}`, last);
                breadcrumb.value = [...copy, last];
                subDirectory.value = breadcrumb.value.join('/').replace(selectedTab.value, '');
            }
        }
    };
};

export const useRootDirectory = () => {
    onTreeSuccess(({ context: { getAllValues } }: FinderEvent) => getAllValues()).connect();

    return {
        root: computed(() => rootDir.value),
        subDirectory: computed(() => subDirectory.value),
    
        setRoot(root: string) {
            rootDir.value = root;
        },
    
        setSubDirectory(subDir: string) {
            subDirectory.value = subDir;

            if (subDirectory.value) {
                showedItems.value = getChildren(tree)(`/${user.value.account_name}/${selectedTab.value}`, subDirectory.value)
                
                breadcrumb.value = [...`${selectedTab.value}${subDirectory.value}`.replace('//', '/').split('/')];
            } else {
                breadcrumb.value = [selectedTab.value];
                const copy = [...breadcrumb.value];

                showedItems.value = getChildren(tree)(`/${user.value.account_name}`, copy.join('/'));
            }
        }
    };
};

export const useTreeActions = () => {
    return {
        tree,

        get() {
            onTreeSuccess(({ context: { getAllValues } }: FinderEvent) => getAllValues()).connect();
        },

        add(root: string, dirName: string) {
            onTreeSuccess(({ context: { add, getAllValues } }: FinderEvent) => {
                add({
                    user_id: user.value.id,
                    content: null,
                    extension: null,
                    name: dirName,
                    parent: root.replace('//', '/'),
                    type: 'directory',
                    creation_date: new Date(),
                    updated_date: new Date(),
                    opened_date: new Date()
                });
                getAllValues();
            }).connect();
        },
        
        remove(id: number) {
            onTreeSuccess(({ context: { remove, getAllValues } }: FinderEvent) => {
                remove(id);
                getAllValues();
            }).connect();
        },

        createFile(path: string, { name, type, extension }: Pick<Item, 'name' | 'type' | 'extension'>) {
            onTreeSuccess(({ context: { add, getAllValues } }: FinderEvent) => {
                add({
                    user_id: user.value.id,
                    content: '',
                    extension, name, type,
                    parent: path.replace('//', '/'),
                    creation_date: new Date(),
                    updated_date: new Date(),
                    opened_date: new Date()
                });
                getAllValues();
            }).connect();
        }
    };
};

watch(
    [selectedTab, subDirectory, items],
    (_, [
        oldSelectedTab,, oldItems
    ]) => {
        if (selectedTab.value !== oldSelectedTab) {
            initBreadcrumb();
            subDirectory.value = '';
            showedItems.value = items.value.reduce<Item[]>((r, c) =>
                c.name === selectedTab.value ? (c.children ?? []) : r, []);
        }

        if (JSON.stringify(items.value) !== JSON.stringify(oldItems)) {
            if (subDirectory.value) {
                showedItems.value = getChildren(tree)(`/${user.value.account_name}/${selectedTab.value}`, subDirectory.value);

               breadcrumb.value = `${selectedTab.value}${subDirectory.value}`.split('/');
            } else {
                breadcrumb.value = [selectedTab.value];
                const copy = [...breadcrumb.value];

                showedItems.value = getChildren(tree)(`/${user.value.account_name}`, copy.join('/'));
            }
        }
    });

watch(tree, (oldTree) => {
    items.value = getChildren(tree)('', user.value.account_name);

    if (subDirectory.value && JSON.stringify(tree.value) !== JSON.stringify(oldTree)) {
        showedItems.value = getChildren(tree)(`/${user.value.account_name}/${selectedTab.value}`, subDirectory.value)
        
        breadcrumb.value = [...`${selectedTab.value}${subDirectory.value}`.replace('//', '/').split('/')];
    }
});
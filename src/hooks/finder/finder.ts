import { ref, computed, watch } from 'vue';
import { useDatabase, getParams, TABLES } from '@/hooks/database';
import { useAuthUser } from '@/hooks/account';
import iconDirectory from '@/assets/icons/icon-directory.png';
import iconUnknownFile from '@/assets/icons/icon-unknownFile.png';
import {FinderEvent, Item} from '@/hooks/finder/types.ts';

// import iconAppleTV from '@/assets/icons/icon-AppleTV.png';
// import iconMessages from '@/assets/icons/icon-Messages.png';
// import iconMp4 from '@/assets/icons/icon-mp4.png';
// import iconMusic from '@/assets/icons/icon-Music.png';
// import iconPages from '@/assets/icons/icon-Pages.png';
// import iconPng from '@/assets/icons/icon-png.png';

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

const getChildren = (root: string, dirName: string): Item[] => {
    return tree.value.reduce<Item[]>((r, c) => {
        if (c.parent === `${root}/${dirName}`.replace('//', '/')) {
            return [
                ...r, 
                {
                    ...c,
                    icon: c.type === 'directory' ? iconDirectory : iconUnknownFile,
                    children: getChildren(`${root}/${dirName}`, c.name)
                }
            ];
        }
        return r;
    }, []);
};

export const initBreadcrum = () => {
    breadcrumb.value = [selectedTab.value];
};

export const useFinder = (maxPerLine: number) => {
    onTreeSuccess(({ context: { getAllValues } }: FinderEvent) => getAllValues()).connect();

    return {
        selectedTab: computed(() => selectedTab.value),
        showedItems: computed<Item[][]>(() => showedItems.value?.reduce<{cmp: number, result: Item[][]}>((r, c) => {
            if (r.cmp === 0) {
                return {
                    cmp: r.cmp + 1,
                    result: [...r.result, [c]]
                }
            } else if (r.cmp < maxPerLine) {
                const lastItem = r.result.pop()!;
                return {
                    cmp: r.cmp + 1,
                    result: [...r.result, [...lastItem, c]]
                };
            } else if (r.cmp === maxPerLine) {
                return {
                    cmp: 1,
                    result: [...r.result, [c]]
                }
            }

            return r
        }, {
            cmp: 0,
            result: []
        }).result ?? []),
        activedItem: computed(() => activeItem.value),
        breadcrum: computed(() => breadcrumb.value),

        selectTab(tab: string) {
            selectedTab.value = tab;
            rootDir.value = tab;
        },
    
        initBreadcrum,
    
        selectItem(item: Item) {
            if (item.type === 'directory' && breadcrumb.value.indexOf(item.name) === -1) {
                breadcrumb.value = [
                    ...breadcrumb.value,
                    item.name
                ];
        
                activeItem.value = '';
                showedItems.value = item.children!;
            }
        },

        activeItem(item: string) {
            activeItem.value = item;
        },
        
        backInPath() {
            if (breadcrumb.value.length > 1) {
                const copy = [...breadcrumb.value];
                copy.pop();
                const last = copy.pop()!;
                
                showedItems.value = getChildren(`/${user.value.account_name}/${copy.join('/')}`, last);
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
                showedItems.value = getChildren(`/${user.value.account_name}/${selectedTab.value}`, subDirectory.value)
                
                breadcrumb.value = [...`${selectedTab.value}${subDirectory.value}`.replace('//', '/').split('/')];
            } else {
                breadcrumb.value = [selectedTab.value];
                const copy = [...breadcrumb.value];

                showedItems.value = getChildren(`/${user.value.account_name}`, copy.join('/'));
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
                    extention: null,
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

        createFile(path: string, { name, type, extention }: Pick<Item, 'name' | 'type' | 'extention'>) {
            onTreeSuccess(({ context: { add, getAllValues } }: FinderEvent) => {
                add({
                    user_id: user.value.id,
                    content: '',
                    extention, name, type,
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

watch([selectedTab, subDirectory, items], (_, [
    oldSelectedTab,, oldItems
]) => {
    if (selectedTab.value !== oldSelectedTab) {
        initBreadcrum();
        subDirectory.value = '';
        showedItems.value = items.value.reduce<Item[]>((r, c) =>
            c.name === selectedTab.value ? (c.children ?? []) : r, []);
    }

    if (JSON.stringify(items.value) !== JSON.stringify(oldItems)) {
        if (subDirectory.value) {
            showedItems.value = getChildren(`/${user.value.account_name}/${selectedTab.value}`, subDirectory.value);
            
           breadcrumb.value = `${selectedTab.value}${subDirectory.value}`.split('/');
        } else {
            breadcrumb.value = [selectedTab.value];
            const copy = [...breadcrumb.value];

            showedItems.value = getChildren(`/${user.value.account_name}`, copy.join('/'));
        }
    }
});

watch(tree, (oldTree) => {
    items.value = getChildren('', user.value.account_name);

    if (subDirectory.value && JSON.stringify(tree.value) !== JSON.stringify(oldTree)) {
        showedItems.value = getChildren(`/${user.value.account_name}/${selectedTab.value}`, subDirectory.value)
        
        breadcrumb.value = [...`${selectedTab.value}${subDirectory.value}`.replace('//', '/').split('/')];
    }
});
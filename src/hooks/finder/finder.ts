import { ref, computed, watch } from 'vue';
import { useDatabase, getParams, TABLES } from '@/hooks/database';
import { useAuthUser } from '@/hooks/account';
import type { FinderEvent, Item } from '@/hooks/finder/types';
import {
    createBreadcrumbInitializer,
    createItemActivator,
    createItemSelector,
    createTabSelector, getChildren,
    getComputedShowedItems, realpath
} from '@/hooks/finder';
import type { Finder } from '@/hooks/finder';

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

export const initBreadcrumb: Finder['initBreadcrumb'] = createBreadcrumbInitializer(breadcrumb, selectedTab);

export const useFinder: Finder['useFinder'] = (maxPerLine: number) => {
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

export const useRootDirectory: Finder['useRootDirectory'] = () => {
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

export const useTreeActions: Finder['useTreeActions'] = () => {
    return {
        tree: computed(() => tree.value),

        get() {
            onTreeSuccess(({ context: { getAllValues } }: FinderEvent) => getAllValues()).connect();
        },

        add(root, dirName) {
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
        
        remove(id) {
            onTreeSuccess(({ context: { remove, getAllValues } }: FinderEvent) => {
                remove(id);
                getAllValues();
            }).connect();
        },

        createFile(path, { name, type, extension }, content) {
            onTreeSuccess(({ context: { add, getAllValues } }: FinderEvent) => {
                add({
                    user_id: user.value.id,
                    content: content ?? '',
                    extension, name, type,
                    parent: path.replace('//', '/'),
                    creation_date: new Date(),
                    updated_date: new Date(),
                    opened_date: new Date()
                });
                getAllValues();
            }).connect();
        },

        move(from, to) {
            if (isPathExists(realpath(from))) {
                const fromParentPath = from.split('/');
                const fromCompleteName = fromParentPath.pop()!;
                let fromExtension: string[]|string|null = null;
                let fromName: string = fromCompleteName;
                let fromIsDirectory = true;
                if (fromCompleteName.includes('.')) {
                    fromIsDirectory = false;
                    [fromName, ...fromExtension] = fromCompleteName.split('.');
                    fromExtension = (fromExtension as string[]).join('.');
                }

                const toParentPath = to.split('/');
                const toCompleteName = toParentPath.pop()!;
                let toExtension: string[]|string|null = null;
                let toName: string = toCompleteName;
                let toIsDirectory = true;
                if (toCompleteName.includes('.')) {
                    toIsDirectory = false;
                    [toName, ...toExtension] = toCompleteName.split('.');
                    toExtension = (toExtension as string[]).join('.');
                }

                if (!isPathExists(realpath(from))) return false

                if (fromIsDirectory) {
                    // je déplace un répertoire

                    if (!toIsDirectory) {
                        // erreur (ça n'a pas de sens de déplacer un répertoire dans un fichier)
                        return false
                    }

                    const oldItem = tree.value.filter(item =>
                        item.type === 'directory' &&
                        item.parent === realpath((fromParentPath.join('/') === '' ? '/' : fromParentPath.join('/'))) &&
                        item.name === fromName
                    ).pop();

                    if (isPathExists(realpath(to))) {
                        // dans un répertoire

                        if (!oldItem) return false;

                        const newItem = {
                            ...oldItem,
                            parent: realpath(to)
                        }

                        tree.value = tree.value.map<Item>(item => {
                            if (JSON.stringify(item) === JSON.stringify(oldItem)) {
                                return {
                                    ...item,
                                    parent: newItem.parent
                                }
                            } else if (item.parent.startsWith(oldItem.parent + '/' + oldItem.name)) {
                                return {
                                    ...item,
                                    parent: newItem.parent + item.parent.substring(oldItem.parent.length)
                                }
                            }

                            return item;
                        });
                    }
                    else {
                        // et le renomme en un nouveau répertoire

                        if (!oldItem) return false;

                        const newItem = {
                            ...oldItem,
                            parent: realpath((toParentPath.join('/') === '' ? '/' : toParentPath.join('/'))),
                            name: toName
                        };

                        tree.value = tree.value.map<Item>(item => {
                            if (
                                item.parent !== oldItem.parent &&
                                item.parent.startsWith(oldItem.parent + '/' + oldItem.name)
                            ) {
                                return {
                                    ...item,
                                    parent: newItem.parent + '/' + newItem.name + item.parent.substring((oldItem.parent + '/' + oldItem.name).length)
                                }
                            } else if (
                                item.parent === oldItem.parent &&
                                item.name === oldItem.name
                            ) {
                                return {
                                    ...item,
                                    parent: newItem.parent,
                                    name: newItem.name
                                }
                            }

                            return item;
                        });
                    }
                }
                else {
                    // je déplace un fichier
                    const oldItem = tree.value.filter(item =>
                        item.type !== 'directory' &&
                        item.parent === realpath(fromParentPath.join('/') === '' ? '/' : fromParentPath.join('/')) &&
                        item.name === fromName &&
                        item.extension === fromExtension
                    ).pop()!;

                    if (toIsDirectory) {
                        // dans un répertoire
                        if (!isPathExists(realpath(to))) return false

                        tree.value = tree.value.map<Item>(item =>
                            item.id === oldItem.id ? {
                                ...item,
                                parent: realpath(to)
                            } : item
                        )
                    }
                    else {
                        // dans un répertoire en le renommant
                        const newParent = realpath(toParentPath.join('/') === '' ? '/' : toParentPath.join('/'));
                        if (!isPathExists(newParent)) return false

                        tree.value = tree.value.map<Item>(item =>
                            item.id === oldItem.id ? {
                                ...item,
                                parent: newParent,
                                name: toName,
                                extension: toExtension as string
                            } : item
                        )
                    }
                }

                return true
            }

            return false;
        }
    };
};

export const getChildrenItems: Finder['getChildrenItems'] = () => getChildren(tree);

export const isPathExists: Finder['isPathExists'] = path => {
    return tree.value.filter(item => {
        if (item.parent === path) {
            return true;
        }

        const p = path.split('/');
        const dirname = p.pop()!;
        return item.parent === p.join('/') && item.name === dirname;
    }).length > 0
}

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
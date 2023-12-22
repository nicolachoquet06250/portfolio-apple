import { ref, computed, watch } from 'vue';
import { useDatabase } from '@/hooks/database/hooks';
import { useAuthUser } from '@/hooks/account';
import type { Item } from '@/hooks/finder/types';
import {
    createBreadcrumbInitializer,
    createItemActivator,
    createItemSelector,
    createTabSelector, getChildren,
    getComputedShowedItems, realpath
} from '@/hooks/finder';
import type { Finder } from '@/hooks/finder';
import { TreeStructureType } from '@/hooks/database/models';

const { user } = useAuthUser();
const {
    treeStructures: tree,
    updateTreeStructure, getTreeStructures,
    addTreeStructure, deleteTreeStructure
} = useDatabase('portfolio-apple', 'treeStructure');

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
    getTreeStructures();

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
    getTreeStructures();

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
    type UpdatedTreeStructure = Required<{
        id?: number
    }> & Partial<TreeStructureType>;

    return {
        tree,

        get() {
            getTreeStructures();
        },

        add(root, dirName) {
            addTreeStructure({
                user_id: user.value.id,
                content: null,
                extension: null,
                name: dirName,
                parent: root.replace('//', '/'),
                type: 'directory',
                creation_date: new Date(),
                updated_date: new Date(),
                opened_date: new Date()
            })
        },
        
        remove(id) {
            deleteTreeStructure(id);
        },

        createFile(path, { name, type, extension }, content) {
            addTreeStructure({
                user_id: user.value.id,
                content: content ?? '',
                extension, name, type,
                parent: path.replace('//', '/'),
                creation_date: new Date(),
                updated_date: new Date(),
                opened_date: new Date()
            });
        },

        move(from, to): boolean {
            if (isPathExists(realpath(from))) {
                const fromParentPath = from.split('/');
                const fromCompleteName = fromParentPath.pop()!;
                let fromExtension: string[]|string|null = null;
                let fromName: string = fromCompleteName;
                let fromIsDirectory = true;
                if (fromCompleteName.includes('.')) {
                    fromIsDirectory = false;
                    [fromName, ...fromExtension] = fromCompleteName.split('.');
                    fromExtension = fromExtension!.join('.');
                }

                const toParentPath = to.split('/');
                const toCompleteName = toParentPath.pop()!;
                let toExtension: string[]|string|null = null;
                let toName: string = toCompleteName;
                let toIsDirectory = true;
                if (toCompleteName.includes('.')) {
                    toIsDirectory = false;
                    [toName, ...toExtension] = toCompleteName.split('.');
                    toExtension = toExtension!.join('.');
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
                        } as UpdatedTreeStructure;

                        updateTreeStructure(newItem);
                        updateTreeStructure({
                            ...tree.value
                                .filter(item =>
                                    item.parent.startsWith(oldItem.parent + '/' + oldItem.name) &&
                                    JSON.stringify(item) === JSON.stringify(oldItem)
                                ).map(item => ({
                                    ...item,
                                    parent: newItem.parent + item.parent.substring(oldItem.parent.length)
                                })).pop()! as UpdatedTreeStructure
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

                        for (const item of tree.value) {
                            if (
                                item.parent !== oldItem.parent &&
                                item.parent.startsWith(oldItem.parent + '/' + oldItem.name)
                            ) {
                                updateTreeStructure({
                                    ...item,
                                    parent: newItem.parent + '/' + newItem.name + item.parent.substring((oldItem.parent + '/' + oldItem.name).length)
                                } as UpdatedTreeStructure);
                            }
                            else if (
                                item.parent === oldItem.parent &&
                                item.name === oldItem.name
                            ) {
                                updateTreeStructure({
                                    ...item,
                                    parent: newItem.parent,
                                    name: newItem.name
                                } as UpdatedTreeStructure);
                            }
                        }
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
                        if (!isPathExists(realpath(to))) {
                            return false
                        }

                        updateTreeStructure({
                            ...oldItem as UpdatedTreeStructure,
                            parent: realpath(to)
                        });
                    }
                    else {
                        // dans un répertoire en le renommant
                        const newParent = realpath(toParentPath.join('/') === '' ? '/' : toParentPath.join('/'));
                        if (!isPathExists(newParent)) {
                            return false
                        }

                        updateTreeStructure({
                            ...oldItem as UpdatedTreeStructure,
                            parent: newParent,
                            name: toName,
                            extension: toExtension
                        });
                    }
                }

                return true
            }

            return false;
        }
    };
};

export const getChildrenItems: Finder['getChildrenItems'] =
    () => getChildren(tree);

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
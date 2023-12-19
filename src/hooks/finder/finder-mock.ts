import { ref, computed, watch } from 'vue';
import type { Item } from '@/hooks/finder/types.ts';
import {
    createBreadcrumbInitializer,
    createItemActivator,
    createItemSelector,
    createTabSelector, getChildren,
    getComputedShowedItems
} from '@/hooks/finder';
import type {Finder} from '@/hooks/finder';

const selectedTab = ref('');
const tree = ref<Item[]>([]);
const showedItems = ref(tree.value.reduce<Item[]>((r, c) =>
    c.name === selectedTab.value ? (c.children ?? []) : r, []));
const activeItem = ref('');
const breadcrumb = ref<string[]>([]);
const rootDir = ref('');
const subDirectory = ref('');

tree.value = [
    {
        content: null,
        creation_date: 'Tue Jan 25 2022 12:19:10 GMT+0100 (heure normale d’Europe centrale) {}',
        extension: null,
        id: 1,
        name: "Applications",
        opened_date: 'Tue Jan 25 2022 12:19:10 GMT+0100 (heure normale d’Europe centrale) {}',
        parent: "/",
        type: "directory",
        updated_date: 'Tue Jan 25 2022 12:19:10 GMT+0100 (heure normale d’Europe centrale) {}',
        user_id: 1,
    },
    {
        content: null,
        creation_date: 'Tue Jan 25 2022 12:19:10 GMT+0100 (heure normale d’Europe centrale) {}',
        extension: null,
        id: 2,
        name: "AirDrop",
        opened_date: 'Tue Jan 25 2022 12:19:10 GMT+0100 (heure normale d’Europe centrale) {}',
        parent: "/",
        type: "directory",
        updated_date: 'Tue Jan 25 2022 12:19:10 GMT+0100 (heure normale d’Europe centrale) {}',
        user_id: 1
    },
    {
        content: null,
        creation_date: 'Tue Jan 25 2022 12:19:10 GMT+0100 (heure normale d’Europe centrale) {}',
        extension: null,
        id: 3,
        name: "Desktop",
        opened_date: 'Tue Jan 25 2022 12:19:10 GMT+0100 (heure normale d’Europe centrale) {}',
        parent: "/",
        type: "directory",
        updated_date: 'Tue Jan 25 2022 12:19:10 GMT+0100 (heure normale d’Europe centrale) {}',
        user_id: 1
    },
    {
        content: null,
        creation_date: 'Tue Jan 25 2022 12:19:10 GMT+0100 (heure normale d’Europe centrale) {}',
        extension: null,
        id: 4,
        name: "Images",
        opened_date: 'Tue Jan 25 2022 12:19:10 GMT+0100 (heure normale d’Europe centrale) {}',
        parent: "/",
        type: "directory",
        updated_date: 'Tue Jan 25 2022 12:19:10 GMT+0100 (heure normale d’Europe centrale) {}',
        user_id: 1
    },
    {
        content: null,
        creation_date: 'Tue Jan 25 2022 12:19:10 GMT+0100 (heure normale d’Europe centrale) {}',
        extension: null,
        id: 5,
        name: "Videos",
        opened_date: 'Tue Jan 25 2022 12:19:10 GMT+0100 (heure normale d’Europe centrale) {}',
        parent: "/",
        type: "directory",
        updated_date: 'Tue Jan 25 2022 12:19:10 GMT+0100 (heure normale d’Europe centrale) {}',
        user_id: 1
    },
    {
        content: null,
        creation_date: 'Tue Jan 25 2022 12:19:10 GMT+0100 (heure normale d’Europe centrale) {}',
        extension: null,
        id: 6,
        name: "Documents",
        opened_date: 'Tue Jan 25 2022 12:19:10 GMT+0100 (heure normale d’Europe centrale) {}',
        parent: "/",
        type: "directory",
        updated_date: 'Tue Jan 25 2022 12:19:10 GMT+0100 (heure normale d’Europe centrale) {}',
        user_id: 1
    },
    {
        content: null,
        creation_date: 'Tue Jan 25 2022 12:19:10 GMT+0100 (heure normale d’Europe centrale) {}',
        extension: null,
        id: 7,
        name: "Downloads",
        opened_date: 'Tue Jan 25 2022 12:19:10 GMT+0100 (heure normale d’Europe centrale) {}',
        parent: "/",
        type: "directory",
        updated_date: 'Tue Jan 25 2022 12:19:10 GMT+0100 (heure normale d’Europe centrale) {}',
        user_id: 1
    },
    {
        content: null,
        creation_date: 'Tue Jan 25 2022 12:20:03 GMT+0100 (heure normale d’Europe centrale) {}',
        extension: null,
        id: 8,
        name: "prod",
        opened_date: 'Tue Jan 25 2022 12:20:03 GMT+0100 (heure normale d’Europe centrale) {}',
        parent: "/Desktop",
        type: "directory",
        updated_date: 'Tue Jan 25 2022 12:20:03 GMT+0100 (heure normale d’Europe centrale) {}',
        user_id: 1
    },
    {
        content: null,
        creation_date: 'Tue Jan 25 2022 12:20:03 GMT+0100 (heure normale d’Europe centrale) {}',
        extension: null,
        id: 9,
        name: "portfolio-apple",
        opened_date: 'Tue Jan 25 2022 12:20:03 GMT+0100 (heure normale d’Europe centrale) {}',
        parent: "/Desktop/prod",
        type: "directory",
        updated_date: 'Tue Jan 25 2022 12:20:03 GMT+0100 (heure normale d’Europe centrale) {}',
        user_id: 1
    },
    {
        content: null,
        creation_date: 'Tue Jan 25 2022 12:20:03 GMT+0100 (heure normale d’Europe centrale) {}',
        extension: null,
        id: 10,
        name: "répertoire dans documents",
        opened_date: 'Tue Jan 25 2022 12:20:03 GMT+0100 (heure normale d’Europe centrale) {}',
        parent: "/Documents",
        type: "directory",
        updated_date: 'Tue Jan 25 2022 12:20:03 GMT+0100 (heure normale d’Europe centrale) {}',
        user_id: 1
    },
    {
        content: 'un text de test',
        creation_date: 'Tue Jan 25 2022 12:20:03 GMT+0100 (heure normale d’Europe centrale) {}',
        extension: 'txt',
        id: 11,
        name: "fichier-de-test",
        opened_date: 'Tue Jan 25 2022 12:20:03 GMT+0100 (heure normale d’Europe centrale) {}',
        parent: "/Desktop/prod",
        type: "text",
        updated_date: 'Tue Jan 25 2022 12:20:03 GMT+0100 (heure normale d’Europe centrale) {}',
        user_id: 1
    }
];

export const initBreadcrumb: Finder['initBreadcrumb'] = createBreadcrumbInitializer(breadcrumb, selectedTab);

export const useFinder: Finder['useFinder'] = (maxPerLine: number) => ({
    selectedTab: computed(() => selectedTab.value),
    showedItems: getComputedShowedItems(showedItems, maxPerLine),
    activatedItem: computed(() => activeItem.value),
    breadcrumb: computed(() => breadcrumb.value),

    selectTab: createTabSelector(rootDir, selectedTab),
    initBreadcrumb,
    selectItem: createItemSelector(breadcrumb, showedItems, activeItem),
    activeItem: createItemActivator(activeItem),

    backInPath() {
        const currentSelectedDir = breadcrumb.value[breadcrumb.value.length - 1];

        if (breadcrumb.value.length > 1) {
            const copy = [...breadcrumb.value];
            copy.pop();

            subDirectory.value = copy.join('/').replace('Desktop', '');
            showedItems.value = getChildren(tree)('/', copy.join('/'));
            breadcrumb.value = breadcrumb.value.reduce<string[]>((r, c) =>
                c === currentSelectedDir ? r : [...r, c], []);
        }
    }
});

export const useRootDirectory: Finder['useRootDirectory'] = () => ({
    root: computed(() => rootDir.value),
    subDirectory: computed(() => subDirectory.value),

    setRoot(root: string) {
        rootDir.value = root;
    },

    setSubDirectory(subDir: string) {
        subDirectory.value = subDir;
    }
});

export const useTreeActions: Finder['useTreeActions'] = () => ({
    tree: computed(() => tree.value),

    get() {},

    createFile(path, { name, type, extension }, content) {
        if (!isPathExists(path)) {
            throw new Error(`${path}: Aucun fichier ou dossier de ce type`)
        }

        tree.value = [
            ...tree.value,
            {
                id: ([...tree.value].pop()?.id ?? 0) + 1,
                user_id: 1,
                name,
                type,
                extension,
                content: content ?? '',
                parent: path,
                creation_date: (new Date()).toString(),
                updated_date: (new Date()).toString(),
                opened_date: (new Date()).toString()
            }
        ]
    },

    add(root, dirName) {
        tree.value = [
            ...tree.value,
            {
                id: (tree.value[tree.value.length - 1].id ?? 0) + 1,
                user_id: 0,
                content: null,
                extension: null,
                name: dirName,
                parent: root.replace('//', '/'),
                type: 'directory',
                creation_date: new Date(),
                updated_date: new Date(),
                opened_date: new Date()
            }
        ];
    },

    remove(id) {
        tree.value = tree.value.reduce<Item[]>((r, c) => {
            if (c.id === id) {
                return r;
            }
            return [...r, c];
        }, []);
    }
});

export const getChildrenItems: Finder['getChildrenItems'] = () => getChildren(tree);

export const isPathExists: Finder['isPathExists'] = (path: string) => {
    return tree.value.filter(item => {
        if (item.parent === path) {
            return true;
        }

        const p = path.split('/');
        const dirname = p.pop()!;

        return (item.parent === p.join('/') && item.name === dirname) || (dirname.includes('.') && (() => {
            const splitDirname = dirname.split('.');
            const extension = splitDirname.pop()!;

            return item.name === splitDirname.join('.') && item.extension === extension
        })());
    }).length > 0
}

watch([selectedTab, subDirectory, tree], (_, [oldSelectedTab]) => {
    if (selectedTab.value !== oldSelectedTab) {
        breadcrumb.value = [selectedTab.value];
        subDirectory.value = '';
        
        const copy = [...breadcrumb.value];

        showedItems.value = getChildren(tree)('', copy.join('/'));
    }

    if (subDirectory.value) {
        showedItems.value = getChildren(tree)('/' + selectedTab.value, subDirectory.value);

        const splitSubDirectory = subDirectory.value.split('/');
        if (splitSubDirectory[0] === '') {
            splitSubDirectory.shift();
        }

        breadcrumb.value = [selectedTab.value, ...splitSubDirectory];
    } else {
        breadcrumb.value = [selectedTab.value];
        const copy = [...breadcrumb.value];

        showedItems.value = getChildren(tree)('', copy.join('/'));
    }
});

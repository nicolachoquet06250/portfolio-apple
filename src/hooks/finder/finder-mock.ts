import { ref, computed, watch } from 'vue';
import type { Item } from '@/hooks/finder/types.ts';
import {
    createBreadcrumbInitializer,
    createItemActivator,
    createItemSelector,
    createTabSelector, getChildren,
    getComputedShowedItems
} from '@/hooks/finder/index.ts';

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
        id: 9,
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
        id: 10,
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
    }
];

export const initBreadcrumb = createBreadcrumbInitializer(breadcrumb, selectedTab);

export const useFinder = (maxPerLine: number) => {
    return {
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
    };
};

export const useRootDirectory = () => {
   return {
        root: computed(() => rootDir.value),
        subDirectory: computed(() => subDirectory.value),
    
        setRoot(root: string) {
            rootDir.value = root;
        },
    
        setSubDirectory(subDir: string) {
            subDirectory.value = subDir;
        }
    };
};

export const useTreeActions = () => {
    return {
        tree: computed(() => tree.value),

        get() {},

        createFile() {},

        add(root: string, dirName: string) {
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
        
        remove(id: number) {
            tree.value = tree.value.reduce<Item[]>((r, c) => {
                if (c.id === id) {
                    return r;
                }
                return [...r, c];
            }, []);
        }
    };
};

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

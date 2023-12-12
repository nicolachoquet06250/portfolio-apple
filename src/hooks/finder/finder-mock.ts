import { ref, computed, watch } from 'vue';
import iconDirectory from '@/assets/icons/icon-directory.png';
import iconUnknownFile from '@/assets/icons/icon-unknownFile.png';
import {Item} from '@/hooks/finder/types.ts';

// import iconAppleTV from '@/assets/icons/icon-AppleTV.png';
// import iconMessages from '@/assets/icons/icon-Messages.png';
// import iconMp4 from '@/assets/icons/icon-mp4.png';
// import iconMusic from '@/assets/icons/icon-Music.png';
// import iconPages from '@/assets/icons/icon-Pages.png';
// import iconPng from '@/assets/icons/icon-png.png';

const selectedTab = ref('');
const items = ref<Item[]>([]);
const showedItems = ref(items.value.reduce<Item[]>((r, c) =>
    c.name === selectedTab.value ? (c.children ?? []) : r, []));
const activeItem = ref('');
const breadcrumb = ref<string[]>([]);
const rootDir = ref('');
const subDirectory = ref('');

items.value = [
    {
        content: null,
        creation_date: 'Tue Jan 25 2022 12:19:10 GMT+0100 (heure normale d’Europe centrale) {}',
        extention: null,
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
        extention: null,
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
        extention: null,
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
        extention: null,
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
        extention: null,
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
        extention: null,
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
        extention: null,
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
        extention: null,
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
        extention: null,
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
        extention: null,
        id: 10,
        name: "répertoire dans documents",
        opened_date: 'Tue Jan 25 2022 12:20:03 GMT+0100 (heure normale d’Europe centrale) {}',
        parent: "/Documents",
        type: "directory",
        updated_date: 'Tue Jan 25 2022 12:20:03 GMT+0100 (heure normale d’Europe centrale) {}',
        user_id: 1
    }
];

const getChildren = (root: string, dirName: string): Item[] => {
    return items.value.reduce<Item[]>((r, c) => {
        return c.parent === `${root}/${dirName}`.replace('//', '/') 
            ? [
                ...r, 
                {
                    ...c,
                    icon: c.type === 'directory' ? iconDirectory : iconUnknownFile,
                    children: getChildren(`${root}/${dirName}`, c.name)
                }
            ] : r
    }, []);
};

export const initBreadcrum = () => {
    breadcrumb.value = [selectedTab.value];
};

export const useFinder = (maxPerLine: number) => {
    return {
        selectedTab: computed(() => selectedTab.value),
        showedItems: computed(() => showedItems.value?.reduce<{cmp: number, result: Item[][]}>((r, c) => {
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

            return r;
        }, {
            cmp: 0,
            result: []
        }).result ?? []),
        activedItem: computed(() => activeItem.value),
        breadcrum: computed(() => breadcrumb.value),

        selectTab(tab: string) {
            selectedTab.value = tab;
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
            const currentSelectedDir = breadcrumb.value[breadcrumb.value.length - 1];
            
            if (breadcrumb.value.length > 1) {
                const copy = [...breadcrumb.value];
                copy.pop();

                showedItems.value = getChildren('/', copy.join('/'));
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
        tree: computed(() => items.value),

        get() {},

        // @ts-expect-error
        createFile(path: string, { name, type, extention }: Pick<Item, 'name' | 'type' | 'extention'>) {},

        add(root: string, dirName: string) {
            items.value = [
                ...items.value,
                {
                    id: (items.value[items.value.length - 1].id ?? 0) + 1,
                    user_id: 0,
                    content: null,
                    extention: null,
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
            items.value = items.value.reduce<Item[]>((r, c) => {
                if (c.id === id) {
                    return r;
                }
                return [...r, c];
            }, []);
        }
    };
};

watch([selectedTab, subDirectory, items], (_, [oldSelectedTab]) => {
    if (selectedTab.value !== oldSelectedTab) {
        breadcrumb.value = [selectedTab.value];
        subDirectory.value = '';
        
        const copy = [...breadcrumb.value];

        showedItems.value = getChildren('', copy.join('/'));
    }

    if (subDirectory.value) {
        showedItems.value = getChildren('/' + selectedTab.value, subDirectory.value);
        
        breadcrumb.value = [selectedTab.value, ...subDirectory.value.split('/')];
    } else {
        breadcrumb.value = [selectedTab.value];
        const copy = [...breadcrumb.value];

        showedItems.value = getChildren('', copy.join('/'));
    }
});

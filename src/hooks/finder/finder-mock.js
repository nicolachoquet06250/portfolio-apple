import { ref, computed, watch } from 'vue';

import iconAppleTV from '@/assets/icons/icon-AppleTV.png';
import iconDirectory from '@/assets/icons/icon-directory.png';
import iconMessages from '@/assets/icons/icon-Messages.png';
import iconMp4 from '@/assets/icons/icon-mp4.png';
import iconMusic from '@/assets/icons/icon-Music.png';
import iconPages from '@/assets/icons/icon-Pages.png';
import iconPng from '@/assets/icons/icon-png.png';
import iconUnknownFile from '@/assets/icons/icon-unknownFile.png';

const selectedTab = ref('');
const items = ref([]);
const showedItems = ref(items.value.reduce((r, c) => c.name === selectedTab.value ? c.children : r, []));
const activeItem = ref('');
const breadcrum = ref([]);
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

const getChildren = (root, dirName) => {
    return items.value.reduce((r, c) => {
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
    breadcrum.value = [selectedTab.value];
};

/**
 * @param {Number} maxPerLine 
 * @returns 
 */
export const useFinder = maxPerLine => {
    return {
        selectedTab: computed(() => selectedTab.value),
        showedItems: computed(() => showedItems.value?.reduce((r, c) => {
            if (r.cmp === 0) {
                return {
                    cmp: r.cmp + 1,
                    result: [...r.result, [c]]
                }
            } else if (r.cmp < maxPerLine) {
                const lastItem = r.result.pop();
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
        }, {
            cmp: 0,
            result: []
        }).result ?? []),
        activedItem: computed(() => activeItem.value),
        breadcrum: computed(() => breadcrum.value),
    
        /**
         * @param {String} tab 
         */
        selectTab(tab) {
            selectedTab.value = tab;
        },
    
        initBreadcrum,
    
        selectItem(item) {
            if (item.type === 'directory' && breadcrum.value.indexOf(item.name) === -1) {
                breadcrum.value = [
                    ...breadcrum.value,
                    item.name
                ];
        
                activeItem.value = '';
                showedItems.value = item.children;
            }
        },
    
        /**
         * @param {String} item 
         */
        activeItem(item) {
            activeItem.value = item;
        },
        
        backInPath() {
            const currentSelectedDir = breadcrum.value[breadcrum.value.length - 1];
            
            if (breadcrum.value.length > 1) {
                const copy = [...breadcrum.value];
                copy.pop();

                showedItems.value = getChildren('/', copy.join('/'));
                breadcrum.value = breadcrum.value.reduce((r, c) => c === currentSelectedDir ? r : [...r, c], []);
            }
        }
    };
};

export const useRootDirectory = () => {
   return {
        root: computed(() => rootDir.value),
        subDirectory: computed(() => subDirectory.value),
    
        setRoot(root) {
            rootDir.value = root;
        },
    
        setSubDirectory(subDir) {
            subDirectory.value = subDir;
        }
    };
};

export const useTreeActions = () => {
    return {
        tree: computed(() => items.value),

        get() {},

        add(root, dirName) {
            items.value = [
                ...items.value,
                {
                    id: items.value[items.value.length - 1].id + 1,
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
        
        remove(id) {
            items.value = items.value.reduce((r, c) => {
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
        breadcrum.value = [selectedTab.value];
        subDirectory.value = '';
        
        const copy = [...breadcrum.value];

        showedItems.value = getChildren('', copy.join('/'));
    }

    if (subDirectory.value) {
        showedItems.value = getChildren('/' + selectedTab.value, subDirectory.value);
        
        breadcrum.value = [selectedTab.value, ...subDirectory.value.split('/')];
    } else {
        breadcrum.value = [selectedTab.value];
        const copy = [...breadcrum.value];

        showedItems.value = getChildren('', copy.join('/'));
    }
});

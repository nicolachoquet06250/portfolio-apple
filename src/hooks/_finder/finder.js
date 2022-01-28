import { ref, computed, watch } from 'vue';
import { useDatabase, getParams, TABLES } from '@/hooks/database';
import { useAuthUser } from '@/hooks/account';

import iconAppleTV from '@/assets/icons/icon-AppleTV.png';
import iconDirectory from '@/assets/icons/icon-directory.png';
import iconMessages from '@/assets/icons/icon-Messages.png';
import iconMp4 from '@/assets/icons/icon-mp4.png';
import iconMusic from '@/assets/icons/icon-Music.png';
import iconPages from '@/assets/icons/icon-Pages.png';
import iconPng from '@/assets/icons/icon-png.png';
import iconUnknownFile from '@/assets/icons/icon-unknownFile.png';

const { user } = useAuthUser();
const { 
    onSuccess: onTreeSuccess, 
    results: tree 
} = useDatabase(...getParams(TABLES.TREE_STRUCTURE));

const selectedTab = ref('');
const items = ref([]);
const showedItems = ref(items.value.reduce((r, c) => c.name === selectedTab.value ? c.children : r, []));
const activeItem = ref('');
const breadcrum = ref([]);
const rootDir = ref('');
const subDirectory = ref('');

const getChildren = (root, dirName) => 
    tree.value.reduce((r, c) => 
        c.parent === `${root}/${dirName}` 
            ? [
                ...r, 
                {
                    ...c,
                    icon: c.type === 'directory' ? iconDirectory : iconUnknownFile,
                    children: getChildren(`${root}/${dirName}`, c.name)
                }
            ] : r, []);

export const initBreadcrum = () => {
    breadcrum.value = [selectedTab.value];
};

/**
 * @param {Number} maxPerLine 
 * @returns 
 */
export const useFinder = maxPerLine => {
    onTreeSuccess(({ context: { getAllValues } }) => getAllValues()).connect();

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
            const lastSelectedDir = breadcrum.value[breadcrum.value.length - 2];
    
            if (breadcrum.value.length > 1) {
                const back = arr => {
                    for(const c of arr) {
                        if (c.type === 'directory') {
                            if (c.name === lastSelectedDir) {
                                return c.children ?? [];
                            }
                            const r = back(c.children ?? []);
                            if (r.length > 0) {
                                return r;
                            }
                        }
                    }
    
                    return [];
                };
    
                showedItems.value = back(items.value);
                breadcrum.value = breadcrum.value.reduce((r, c) => c === currentSelectedDir ? r : [...r, c], []);
            }
        }
    };
};

export const useRootDirectory = () => {
    onTreeSuccess(({ context: { getAllValues } }) => getAllValues()).connect();

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
        tree,

        get() {
            onTreeSuccess(({ context: { getAllValues } }) => getAllValues()).connect();
        },

        add(root, dirName) {
            onTreeSuccess(({ context: { add, getAllValues } }) => {
                add({
                    user_id: user.value.id,
                    content: null,
                    extention: null,
                    name: dirName,
                    parent: root,
                    type: 'directory',
                    creation_date: new Date(),
                    updated_date: new Date(),
                    opened_date: new Date()
                });
                getAllValues();
            }).connect();
        },
        
        remove(id) {
            onTreeSuccess(({ context: { remove, getAllValues } }) => {
                remove(id);
                getAllValues();
            }).connect();
        }
    };
};

watch([selectedTab, subDirectory, items], (_, [oldSelectedTab]) => {
    if (selectedTab.value !== oldSelectedTab) {
        initBreadcrum();
        subDirectory.value = '';
    }

    if (subDirectory.value) {
        showedItems.value = items.value.reduce((r, c) => 
            c.name === selectedTab.value ? c.children : r, []).reduce((r, c) => 
                c.parent === `/${user.value.account_name}/${selectedTab.value}/${subDirectory.value}` ? [...r, c] : r, []);
        
        breadcrum.value = [selectedTab.value, ...subDirectory.value.split('/')];
    } else {
        showedItems.value = items.value.reduce((r, c) => c.name === selectedTab.value ? c.children : r, []);
    }
});

watch(tree, () => {
    items.value = getChildren('', user.value.account_name);
});
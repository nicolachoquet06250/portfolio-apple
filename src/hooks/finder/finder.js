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

const getChildren = (root, dirName) => {
    return tree.value.reduce((r, c) => {
        return c.parent === `${root}/${dirName}`.replace('//', '/') 
            ? [
                ...r, 
                {
                    ...c,
                    icon: c.type === 'directory' ? iconDirectory : iconUnknownFile,
                    children: getChildren(`${root}/${dirName}`, c.name)
                }
            ] : r;
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
            if (breadcrum.value.length > 1) {
                const copy = [...breadcrum.value];
                copy.pop();
                const last = copy.pop();
                
                showedItems.value = getChildren(`/${user.value.account_name}/${copy.join('/')}`, last);
                breadcrum.value = [...copy, last];
                subDirectory.value = breadcrum.value.join('/').replace(selectedTab.value, '');
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

            if (subDirectory.value) {
                showedItems.value = getChildren(`/${user.value.account_name}/${selectedTab.value}`, subDirectory.value)
                
                breadcrum.value = [...`${selectedTab.value}${subDirectory.value}`.replace('//', '/').split('/')];
            } else {
                breadcrum.value = [selectedTab.value];
                const copy = [...breadcrum.value];

                showedItems.value = getChildren(`/${user.value.account_name}`, copy.join('/'));
            }
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
            onTreeSuccess(({ context: { remove, getAllValues } }) => {
                remove(id);
                getAllValues();
            }).connect();
        }
    };
};

watch([selectedTab, subDirectory, items], (_, [oldSelectedTab, oldSubDirectory, oldItems]) => {
    if (selectedTab.value !== oldSelectedTab) {
        initBreadcrum();
        subDirectory.value = '';
        showedItems.value = items.value.reduce((r, c) => c.name === selectedTab.value ? c.children : r, []);
    }

    if (JSON.stringify(items.value) !== JSON.stringify(oldItems)) {
        if (subDirectory.value) {
            showedItems.value = getChildren(`/${user.value.account_name}/${selectedTab.value}`, subDirectory.value);
            
           breadcrum.value = `${selectedTab.value}${subDirectory.value}`.split('/');
        } else {
            breadcrum.value = [selectedTab.value];
            const copy = [...breadcrum.value];

            showedItems.value = getChildren(`/${user.value.account_name}`, copy.join('/'));
        }
    }
});

watch(tree, (oldTree) => {
    items.value = getChildren('', user.value.account_name);

    if (subDirectory.value && JSON.stringify(tree.value) !== JSON.stringify(oldTree)) {
        showedItems.value = getChildren(`/${user.value.account_name}/${selectedTab.value}`, subDirectory.value)
        
        breadcrum.value = [...`${selectedTab.value}${subDirectory.value}`.replace('//', '/').split('/')];
    }
});
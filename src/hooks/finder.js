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
const items = ref([
    {
        type: 'directory',
        name: 'Applications',
        icon: iconDirectory,
        children: [
            {
                type: 'application',
                name: 'Pages',
                icon: iconPages
            },
            {
                type: 'application',
                name: 'Music',
                icon: iconMusic
            },
            {
                type: 'application',
                name: 'Apple TV',
                icon: iconAppleTV
            },
            {
                type: 'application',
                name: 'Messages',
                icon: iconMessages
            }
        ]
    },
    {
        type: 'directory',
        name: 'Recent',
        icon: iconDirectory,
        children: [
            {
                type: 'image',
                extention: 'png',
                name: 'UI8-logo',
                path: '/Documents/Images',
                icon: iconPng
            },
            {
                type: 'application',
                name: 'Pages',
                icon: iconPages
            },
            {
                type: 'video',
                extention: 'mp4',
                name: 'UI-Kit-Promo',
                path: '/Documents/Videos',
                icon: iconMp4
            },
            {
                type: 'directory',
                name: 'Projects-2020',
                path: '/Documents',
                icon: iconDirectory,
                children: [
                    {
                        type: 'directory',
                        name: 'protfolio-apple',
                        path: '/Documents/Projects-2020',
                        icon: iconDirectory,
                    },
                    {
                        type: 'directory',
                        name: 'play-private-store',
                        path: '/Documents/Projects-2020',
                        icon: iconDirectory,
                    }
                ]
            },
            {
                type: 'image',
                extention: 'png',
                name: 'SaaS-App-Kit',
                path: '/Documents/Images',
                icon: iconPng
            },
            {
                type: 'video',
                extention: 'mp4',
                name: 'AE-Tutorial',
                path: '/Documents/Videos',
                icon: iconMp4
            },
            {
                type: 'application',
                name: 'Music',
                icon: iconMusic
            },
            {
                type: 'application',
                name: 'Apple TV',
                icon: iconAppleTV
            },
            {
                type: 'directory',
                name: '3D Assets',
                path: '/Documents',
                icon: iconDirectory
            },
            {
                type: 'video',
                extention: 'mp4',
                name: 'Promo',
                path: '/Documents/Videos',
                icon: iconMp4
            },
            {
                type: 'application',
                name: 'Messages',
                icon: iconMessages
            },
            {
                type: 'image',
                extention: 'png',
                name: 'Ut8',
                path: '/Documents/Images',
                icon: iconPng
            },
            {
                type: 'unknown',
                name: 'Figma-Plugin',
                path: '/Documents',
                icon: iconUnknownFile
            }
        ]
    },
    {
        type: 'directory',
        name: 'Desktop',
        icon: iconDirectory,
        children: [
            {
                type: 'directory',
                name: 'Projects-2020',
                path: '/Documents',
                icon: iconDirectory,
                children: [
                    {
                        type: 'directory',
                        name: 'protfolio-apple',
                        path: '/Documents/Projects-2020',
                        icon: iconDirectory,
                    },
                    {
                        type: 'directory',
                        name: 'play-private-store',
                        path: '/Documents/Projects-2020',
                        icon: iconDirectory,
                    }
                ]
            }
        ]
    },
    {
        type: 'directory',
        name: 'Documents',
        icon: iconDirectory,
        children: [
            {
                type: 'directory',
                name: 'Images',
                icon: iconDirectory,
                children: [
                    {
                        type: 'image',
                        extention: 'png',
                        name: 'UI8-logo',
                        path: '/Documents/Images',
                        icon: iconPng
                    },
                    {
                        type: 'image',
                        extention: 'png',
                        name: 'SaaS-App-Kit',
                        path: '/Documents/Images',
                        icon: iconPng
                    },
                    {
                        type: 'image',
                        extention: 'png',
                        name: 'Ut8',
                        path: '/Documents/Images',
                        icon: iconPng
                    }
                ]
            },
            {
                type: 'directory',
                name: 'Vidéos',
                icon: iconDirectory,
                children: [
                    {
                        type: 'video',
                        extention: 'mp4',
                        name: 'UI-Kit-Promo',
                        path: 'Documents/Vidéos',
                        icon: iconMp4
                    },
                    {
                        type: 'video',
                        extention: 'mp4',
                        name: 'AE-Tutorial',
                        path: '/Documents/Videos',
                        icon: iconMp4
                    },
                    {
                        type: 'video',
                        extention: 'mp4',
                        name: 'Promo',
                        path: '/Documents/Videos',
                        icon: iconMp4
                    }
                ]
            },
            {
                type: 'directory',
                name: '3D Assets',
                path: '/Documents',
                icon: iconDirectory
            },
            {
                type: 'unknown',
                name: 'Figma-Plugin',
                path: '/Documents',
                icon: iconUnknownFile
            }
        ]
    }
]);
const showedItems = ref(items.value.reduce((r, c) => c.name === selectedTab.value ? c.children : r, []));
const activeItem = ref('');
const breadcrum = ref([]);

/**
 * @param {Number} maxPerLine 
 * @returns 
 */
export const useFinder = maxPerLine => ({
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

    initBreadcrum() {
        breadcrum.value = [selectedTab.value];
    },

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
});

watch(selectedTab, () => {
    showedItems.value = items.value.reduce((r, c) => c.name === selectedTab.value ? c.children : r, []);
    breadcrum.value = [selectedTab.value];
});
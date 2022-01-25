<template>
    <div class="finder-root" ref="finderBody"
         @contextmenu="showFinderContextMenu()">
        <div class="finder-breadcrum" v-if="showBreadcrum">
            <div class="breadcrum-item" 
                 v-for="item of breadcrum" :key="item">
                {{ item }}
            </div>
        </div>
        
        <div class="finder-container">
            <div class="finder-line" 
                 v-for="line of showedItems" :key="line">
                <button :class="{
                        'finder-item': true,
                        active: activedItem === item.name
                    }" 
                     v-for="item of line" :key="item"
                     :ref="el => { if (activedItem === item.name) { selectedDir = el; selectedItem = item } }"
                     @focus="activeItem(item.name)"
                     @click="activeItem(item.name)"
                     @dblclick="selectItem(item)"
                     @contextmenu.prevent.stop="showDirectoryContextMenu(item)">
                    <img :src="item.icon" class="finder-item-icon">

                    <span class="finder-item-text" v-if="item.type === 'directory' || item.type === 'unknown' || item.type === 'application'">
                        {{ item.name }}
                    </span>
                    <span class="finder-item-text" v-else>
                        {{ item.name }}.{{ item.extention }}
                    </span>
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch, onBeforeUnmount } from 'vue';
import { useCurrentApp, useOpenedApplications } from '@/hooks/apps';
import { useFinder, useRootDirectory } from '@/hooks/finder';
import { useContextualMenu } from '@/hooks/contextual-menu';
import { onClickOutside, onKeyUp, useMouse } from '@vueuse/core';

const { x: mouseX, y: mouseY } = useMouse();
const { setCurrentAppMenus, setCurrentApp } = useCurrentApp();
const { openApplication } = useOpenedApplications();
const { selectTab, selectItem, activeItem, showedItems, activedItem, breadcrum } = useFinder(5);
const { root, setRoot, setSubDirectory } = useRootDirectory();
const {
    setContextMenu, showContextMenu, 
    hideContextMenu, setContextMenuPosition
} = useContextualMenu();

const TABS = {
    APPLICATIONS: 'Applications',
    RECENT: 'Recent',
    AIRDROP: 'AirDrop',
    DESKTOP: 'Desktop',
    DOCUMENTS: 'Documents',
    DOWNLOADS: 'Downloads'
};

selectTab(root.value ?? TABS.RECENT);

onBeforeUnmount(() => {
    setRoot(TABS.RECENT);
    setSubDirectory('');
});

setCurrentAppMenus({
    TitleSection1: {
        type: 'title',
        text: 'Favorites'
    },
    [TABS.APPLICATIONS]: {
        active: root.value === TABS.APPLICATIONS,
        click() {
            selectTab(TABS.APPLICATIONS);
        }
    },
    [TABS.RECENT]: {
        active: root.value === TABS.RECENT || !root.value,
        click() {
            selectTab(TABS.RECENT);
        }
    },
    [TABS.AIRDROP]: {
        active: root.value === TABS.AIRDROP,
        click() {
            selectTab(TABS.AIRDROP);
        }
    },
    [TABS.DESKTOP]: {
        active: root.value === TABS.DESKTOP,
        click() {
            selectTab(TABS.DESKTOP);
        }
    },
    [TABS.DOCUMENTS]: {
        active: root.value === TABS.DOCUMENTS,
        click() {
            selectTab(TABS.DOCUMENTS);
        }
    },
    [TABS.DOWNLOADS]: {
        active: root.value === TABS.DOWNLOADS,
        click() {
            selectTab(TABS.DOWNLOADS);
        }
    }
})

const finderBody = ref(null);
const selectedDir = ref(null);
const selectedItem = ref(null);
onClickOutside(selectedDir, () => {
    selectedDir.value = null;
    selectedItem.value = null;
});
onKeyUp('Enter', () => {
    if (selectedDir.value) {
        selectItem(selectedItem.value);
    }
})
const showBreadcrum = computed(() => breadcrum.value.length > 1);

const openAlert = () => displayAlert.value = true;
const hideAlert = () => displayAlert.value = false;

/**
 * @param {String} appCode
 */
const openApp = appCode => {
    openApplication(appCode);
    setCurrentApp(appCode);
};

const showFinderContextMenu = () => {
    console.log('context menu on finder');

    setContextMenu([
        [
            {
                name: 'New folder',
                //click: () => addDirectory()
            },
            {
                name: 'New file'
            }
        ],
        [
            {
                name: 'Copy'
            },
            {
                name: 'Cut'
            },
            {
                name: 'Past'
            }
        ],
        [
            {
                name: 'Open in terminal'
            }
        ],
        [
            {
                name: 'Show more options'
            }
        ]
    ]);

    setContextMenuPosition(mouseX.value, mouseY.value);
    showContextMenu();
};

const showDirectoryContextMenu = e => {
    console.log('context menu on directory');

    setContextMenu([
        {
            name: 'Remove',
            click() {
                remove(e.id);
                hideContextMenu();
            }
        }
    ]);

    setContextMenuPosition(mouseX.value, mouseY.value);
    showContextMenu();
};

watch(finderBody, () => {
    if (finderBody.value) {
        finderBody.value.parentElement.parentElement.parentElement.addEventListener('click', e => {
            e.preventDefault();
            e.stopPropagation();

            if (e.target.classList.length === 0 || 
            !(
                e.target.classList.contains('finder-item') ||
                e.target.classList.contains('finder-item-icon') ||
                e.target.classList.contains('finder-item-text')
            )) {
                activeItem('');
            }
        });
    }
})
</script>

<style lang="scss" scoped>
.finder {
    &-root {
        display: flex;
        flex-direction: column;

        > h1 {
            margin-top: 0;

            + div {
                display: flex; 
                justify-content: center; 
                align-items: center; 
                align-self: center;
            }
        }
    }

    &-breadcrum {
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;

        .breadcrum-item:not(:last-child) {
            &::after {
                content: '>';
                padding-left: 5px;
                padding-right: 5px;
            }
        }
    }

    &-container {
        display: flex;
        flex-direction: column;
    }

    &-line {
        display: flex;
        flex-direction: row;
    }

    &-item {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 100px;
        padding: 5px;
        background-color: transparent;
        border: 0;
        color: white;
        outline: 0;

        &.active {
            background-color: lightskyblue;
            border-radius: 10px;
        }

        span {
            font-size: 12px;
        }

        img {
            margin-bottom: 5px;
            height: 60px;
        }
    }
}

</style>
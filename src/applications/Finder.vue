<template>
    <div class="finder-root" ref="finderBody"
         @contextmenu.prevent.stop="showFinderContextMenu()">
        <div class="finder-breadcrum" v-if="showBreadcrum">
            <div class="breadcrum-item" 
                 v-for="item of breadcrum" :key="item">
                {{ item }}
            </div>
        </div>
        
        <div class="finder-container">
            <div class="finder-line" 
                 v-for="(line, x) of showedItems" :key="line">
                <Directory v-for="(item, y) of line" :key="y"
                           :name="item.name" :id="item.id" :x="x" :y="y"
                           :color="'black'" :select-color="'black'">
                    {{ item.name }}
                </Directory>

                <NewDirectory v-model="newDirectoryName" 
                              :show="x === showedItems.length - 1 && showedItems[x].length < 5 && displayNewDirectory"
                              :color="'black'" :select-color="'black'"
                              @hide="displayNewDirectory = false"/>
            </div>

            <div class="finder-line" v-if="(showedItems.length === 0 || showedItems[showedItems.length - 1].length >= 5) && displayNewDirectory">
                <NewDirectory v-model="newDirectoryName" 
                              :show="(showedItems.length === 0 || showedItems[showedItems.length - 1].length >= 5) && displayNewDirectory"
                              :color="'black'" :select-color="'black'"
                              @hide="displayNewDirectory = false"
                              @ready="$event.querySelector('input').select()" />
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch, onBeforeUnmount } from 'vue';
import { useCurrentApp, useOpenedApplications } from '@/hooks/apps';
import finder from '@/hooks/finder';
import { useContextualMenu } from '@/hooks/contextual-menu';
import { onClickOutside, onKeyUp, useMouse } from '@vueuse/core';

import NewDirectory from '@/components/utilities/NewDirectoryIcon.vue';
import Directory from '@/components/utilities/DirectoryIcon.vue';

const { useFinder, useRootDirectory } = finder();

const { x: mouseX, y: mouseY } = useMouse();
const { setCurrentApp } = useCurrentApp();
const { openApplication } = useOpenedApplications();
const { selectItem, activeItem, showedItems, activedItem, breadcrum, selectedTab } = useFinder(5);
const { setRoot, setSubDirectory } = useRootDirectory();
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

onBeforeUnmount(() => {
    setRoot(TABS.DESKTOP);
    setSubDirectory('');
});

const finderBody = ref(null);
const selectedDir = ref(null);
const selectedItem = ref(null);
const displayNewDirectory = ref(false);
const newDirectoryName = ref('new directory');

onClickOutside(selectedDir, () => {
    selectedDir.value = null;
    selectedItem.value = null;
});
onKeyUp('Enter', e => {
    if (selectedDir.value) {
        e.preventDefault();
        e.stopPropagation();
        selectItem(selectedItem.value);
    }
})

const showBreadcrum = computed(() => breadcrum.value.length > 1);

const openAlert = () => displayAlert.value = true;
const hideAlert = () => displayAlert.value = false;

const addDirectory = () => {
    displayNewDirectory.value = true;
    hideContextMenu();
};

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
                click: () => addDirectory()
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

<style>
.dark .finder .finder-item,
.dark .finder .finder-breadcrum {
    color: white;
}
</style>

<style lang="scss" scoped>
.finder {
    &-root {
        display: flex;
        flex-direction: column;
        height: 100%;

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
        color: black;

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
        color: black;
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
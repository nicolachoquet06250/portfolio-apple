<template>
    <div class="finder-root"
         ref="finderBody"
         @contextmenu.prevent.stop="showFinderContextMenu()"
    >
        <div class="finder-breadcrumb" v-if="showBreadcrumb">
          <template v-for="item of breadcrumb" :key="item">
              <div class="breadcrumb-item">
                {{ item }}
              </div>
          </template>
        </div>
        
        <div class="finder-container">
            <div class="finder-line" 
                 v-for="(line, x) of showedItems" :key="JSON.stringify(line)"
            >
                <template v-for="(item, y) of line" :key="y">
                    <Directory v-if="item.type === 'directory'"
                               :name="item.name" :id="item.id!" :x="x" :y="y"
                               :color="'black'" :select-color="'black'"
                    >
                        {{ item.name }}
                    </Directory>

                    <File v-else-if="item.type === 'text'"
                          :icon="item.icon" :name="item.name"
                          :id="item.id!" :x="x" :y="y"
                          :color="'black'" :select-color="'black'"
                    >
                        {{ item.name }}.{{ item.extension }}
                    </File>
                </template>

                <NewDirectory v-model="newDirectoryName" 
                              :show="x === showedItems.length - 1 && showedItems[x].length < 5 && displayNewDirectory"
                              :color="'black'" :select-color="'black'"
                              @hide="displayNewDirectory = false"
                />

                <NewFile v-model="newFile.name" 
                         :show="x === showedItems.length - 1 && showedItems[x].length < 5 && newFile.display"
                         :color="'black'" :select-color="'black'"
                         @hide="newFile.display = false"
                />
            </div>

            <div class="finder-line">
                <NewDirectory v-model="newDirectoryName" 
                              :show="(showedItems.length === 0 || showedItems[showedItems.length - 1].length >= 5) &&
                              displayNewDirectory"
                              :color="'black'" :select-color="'black'"
                              @hide="displayNewDirectory = false"
                              @ready="$event?.querySelector('input').select()"
                />

                <NewFile v-model="newFile.name" 
                        :show="(showedItems.length === 0 || showedItems[showedItems.length - 1].length >= 5) && newFile.display"
                        :color="'black'" :select-color="'black'"
                        @hide="newFile.display = false"
                        @ready="
                            $event?.querySelector('input').focus(); 
                            $event?.querySelector('input').setSelectionRange(0, newFile.name.length - '.txt'.length);
                        "
                />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onBeforeUnmount, reactive } from 'vue';
// import {APPLICATION, useCurrentApp, useOpenedApplications} from '@/hooks/apps';
import finder from '@/hooks/finder';
import { useContextualMenu } from '@/hooks/contextual-menu';
import { onClickOutside, onKeyUp, useMouse } from '@vueuse/core';

import NewDirectory from '@/components/utilities/macos/NewDirectoryIcon.vue';
import Directory from '@/components/utilities/macos/DirectoryIcon.vue';
import NewFile from '@/components/utilities/macos/NewFileIcon.vue';
import File from '@/components/utilities/macos/FileIcon.vue';
import {Item} from '@/hooks/finder/types';

const { useFinder, useRootDirectory } = finder();

const { x: mouseX, y: mouseY } = useMouse();
// const { setCurrentApp } = useCurrentApp();
// const { openApplication } = useOpenedApplications();
const { selectItem, activeItem, showedItems, breadcrumb } = useFinder(5);
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

const finderBody = ref<HTMLElement|null>(null);
const selectedDir = ref(null);
const selectedItem = ref<Item|null>(null);
const displayNewDirectory = ref(false);
const newDirectoryName = ref('new directory');
const newFile = reactive({
    display: false,
    name: 'file.txt'
});

onClickOutside(selectedDir, () => {
    selectedDir.value = null;
    selectedItem.value = null;
});
onKeyUp('Enter', e => {
    if (selectedDir.value) {
        e.preventDefault();
        e.stopPropagation();
        selectItem(selectedItem.value!);
    }
})

const showBreadcrumb = computed(() => breadcrumb.value.length > 1);

const addDirectory = () => {
    displayNewDirectory.value = true;
    hideContextMenu();
};
const addFile = () => {
    newFile.display = true;
    hideContextMenu();
};

/*const openApp = (appCode: APPLICATION) => {
    openApplication(appCode);
    setCurrentApp(appCode);
};*/

const showFinderContextMenu = () => {
    console.log('context menu on finder');

    setContextMenu([
        [
            {
                name: 'New folder',
                click: () => addDirectory()
            },
            {
                name: 'New file',
                click: () => addFile()
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

watch(finderBody, () => {
    if (finderBody.value) {
        finderBody.value.parentElement!.parentElement!.parentElement!.addEventListener('click', e => {
            e.preventDefault();
            e.stopPropagation();

            if ((e.target as HTMLElement).classList.length === 0 ||
            !(
                (e.target as HTMLElement).classList.contains('finder-item') ||
                (e.target as HTMLElement).classList.contains('finder-item-icon') ||
                (e.target as HTMLElement).classList.contains('finder-item-text')
            )) {
                activeItem('');
            }
        });
    }
})
</script>

<style>
.dark .finder .finder-item,
.dark .finder .finder-breadcrumb {
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

    &-breadcrumb {
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
        color: black;

        .breadcrumb-item:not(:last-child) {
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
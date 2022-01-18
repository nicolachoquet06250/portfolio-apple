<template>
    <div>
        <h1>Photos &lt;{{selectedTab}}&gt;</h1>
    </div>
</template>

<script setup>
import { useCurrentApp } from '@/hooks/apps';
import { usePhotos } from '@/hooks/photos';

const { setCurrentAppMenus } = useCurrentApp();

const { selectTab, selectedTab } = usePhotos();

const TABS = {
    LIBRARY: 'Library',
    MEMORIES: 'Memories',
    PEOPLE: 'People',
    PLACES: 'Places',
    FAVORITES: 'Favorites',
    RECENTS: 'Recents',
    IMPORTS: 'Imports',
    RECENTLY_DELETED: 'Recently Deleted'
};

selectTab(TABS.LIBRARY);

setCurrentAppMenus({
    TitleSection1: {
        type: 'title',
        text: 'Photos'
    },
    [TABS.LIBRARY]: {
        active: true,
        click() {
            selectTab(TABS.LIBRARY);
        }
    },
    [TABS.MEMORIES]: {
        click() {
            selectTab(TABS.MEMORIES);
        }
    },
    [TABS.PEOPLE]: {
        click() {
            selectTab(TABS.PEOPLE);
        }
    },
    [TABS.PLACES]: {
        click() {
            selectTab(TABS.PLACES);
        }
    },
    [TABS.FAVORITES]: {
        click() {
            selectTab(TABS.FAVORITES);
        }
    },
    [TABS.RECENTS]: {
        click() {
            selectTab(TABS.RECENTS);
        }
    },
    [TABS.IMPORTS]: {
        click() {
            selectTab(TABS.IMPORTS);
        }
    },
    [TABS.RECENTLY_DELETED]: {
        click() {
            selectTab(TABS.RECENTLY_DELETED);
        }
    },
})
</script>

<style lang="scss">

</style>
<template>
    <div>
        <h3> Favorites </h3>

        <button v-for="[tab, value] of Object.entries(TABS)" :key="tab"
            :class="{ active: isActive(tab as keyof typeof TABS) }"
            @click="handleClick(tab as keyof typeof TABS)">
            {{ value }}
        </button>
    </div>
</template>

<script setup lang="ts">
import finder from '@/hooks/finder';

const { useFinder, useRootDirectory } = finder();
const { selectTab, selectedTab } = useFinder(5);
const { root } = useRootDirectory();

enum TABS {
    APPLICATIONS = 'Applications',
    RECENT = 'Recent',
    AIRDROP = 'AirDrop',
    DESKTOP = 'Desktop',
    DOCUMENTS = 'Documents',
    DOWNLOADS = 'Downloads'
};

selectTab(root.value === '' ? TABS.RECENT : root.value);

const isActive = (tab: keyof typeof TABS) => selectedTab.value === TABS[tab];
const handleClick = (tab: keyof typeof TABS) => {
    selectTab(TABS[tab]);
};
</script>

<style lang="scss">
.mac-application.dark {
    .menu-container {
        button.active {
            background-color: rgba(255, 255, 255, .3);
        }
    }
}
</style>

<style lang="scss" scoped>
h3 {
    color: #C5BEBE;
    font-size: 15px;
    padding-left: 10px;
}

button {
    padding: 10px;
    border: none;
    background-color: transparent;
    border-radius: 10px;
    text-align: left;
    width: 100%;

    &.active {
        background-color: #DCD4D5;
    }
}
</style>
<template>
    <div>
        <button v-for="tab of Object.keys(TABS)" :key="tab"
            :class="{ active: isActive(tab) }" 
            @click="handleClick(tab)">
            {{ TABS[tab] }}
        </button>
    </div>
</template>

<script lang="ts" setup>
import { useStore } from '@/hooks/store';

const { selectTab, selectedTab } = useStore();

const TABS = {
    DISCOVER: 'Discover',
    ARCADE: 'Arcade',
    CREATE: 'Create',
    WORK: 'Work',
    PLAY: 'Play',
    DEVELOP: 'Develop',
    CATEGORIES: 'Categories',
    UPDATES: 'Updates'
};

selectTab(TABS.DISCOVER);

const isActive = tab => selectedTab.value === TABS[tab];
const handleClick = tab => {
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
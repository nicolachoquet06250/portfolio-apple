<template>
    <div class="finder-root" ref="root">
        <div class="finder-breadcrum" v-if="showBreadcrum">
            <div class="breadcrum-item" 
                 v-for="item of breadcrum" :key="item">
                {{ item }}
            </div>
        </div>
        
        <div class="finder-container">
            <div class="finder-line" 
                 v-for="line of showedItems" :key="line">
                <div :class="{
                        'finder-item': true,
                        active: activedItem === item.name
                    }" 
                     v-for="item of line" :key="item"
                     @click="clickOnItem(item)"
                     @dblclick="selectItem(item)" clickable>
                    <img :src="item.icon" class="finder-item-icon">

                    <span class="finder-item-text" v-if="item.type === 'directory'">
                        {{ item.name }}
                    </span>
                    <span class="finder-item-text" v-else>
                        {{ item.name }}.{{ item.extention }}
                    </span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useCurrentApp } from '@/hooks/apps';
import { useFinder } from '@/hooks/finder';
import MacOsAlert from '@/components/MacOsAlert.vue';
import Button from '@/components/Button.vue';

const { setCurrentAppMenus } = useCurrentApp();
const { selectTab, selectItem, activeItem, showedItems, activedItem, breadcrum } = useFinder(5);

const TABS = {
    APPLICATIONS: 'Applications',
    RECENT: 'Recent',
    AIRDROP: 'AirDrop',
    DESKTOP: 'Desktop',
    DOCUMENTS: 'Documents',
    DOWNLOADS: 'Downloads'
};

selectTab(TABS.RECENT);

setCurrentAppMenus({
    TitleSection1: {
        type: 'title',
        text: 'Favorites'
    },
    [TABS.APPLICATIONS]: {
        click() {
            selectTab(TABS.APPLICATIONS);
        }
    },
    [TABS.RECENT]: {
        active: true,
        click() {
            selectTab(TABS.RECENT);
        }
    },
    [TABS.AIRDROP]: {
        click() {
            selectTab(TABS.AIRDROP);
        }
    },
    [TABS.DESKTOP]: {
        click() {
            selectTab(TABS.DESKTOP);
        }
    },
    [TABS.DOCUMENTS]: {
        click() {
            selectTab(TABS.DOCUMENTS);
        }
    },
    [TABS.DOWNLOADS]: {
        click() {
            selectTab(TABS.DOWNLOADS);
        }
    }
})

const root = ref(null);
const showBreadcrum = computed(() => breadcrum.value.length > 1);

const openAlert = () => displayAlert.value = true;
const hideAlert = () => displayAlert.value = false;
const clickOnItem = item => activeItem(item.name);

watch(root, () => {
    if (root.value) {
        root.value.parentElement.parentElement.parentElement.addEventListener('click', e => {
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

        &.active {
            background-color: lightskyblue;
            border-radius: 10px;
        }

        span {
            font-size: 12px;
        }

        img {
            margin-bottom: 5px;
        }
    }
}

</style>
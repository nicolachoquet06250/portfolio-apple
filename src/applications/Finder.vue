<template>
    <div class="finder-root">
        <h1>Finder</h1>

        <div style="display: flex; justify-content: center; align-items: center; align-self: center;">
            <Button @click="openAlert">
                Ouvrir une alerte MacOS
            </Button>
        </div>

        <MacOsAlert v-if="displayAlert" @close="hideAlert" />
    </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useCurrentApp } from '@/hooks/apps';
import MacOsAlert from '@/components/MacOsAlert.vue';
import Button from '@/components/Button.vue';

const { setCurrentAppMenus, setCurrentAppHeaderBar, currentAppHeaderBar } = useCurrentApp();

const currentTabSelected = ref('Applications');

setCurrentAppMenus({
    Applications: {
        active: true,
        click() {
            currentTabSelected.value = 'Applications';
        }
    },
    Recent: {
        click() {
            currentTabSelected.value = 'Recent';
        }
    },
    AirDrop: {
        click() {
            currentTabSelected.value = 'AirDrop';
        }
    },
    Desktop: {
        click() {
            currentTabSelected.value = 'Desktop';
        }
    },
    Documents: {
        click() {
            currentTabSelected.value = 'Documents';
        }
    },
    Downloads: {
        click() {
            currentTabSelected.value = 'Downloads';
        }
    }
})

setCurrentAppHeaderBar({
    left: [
        {
            type: 'button',
            icon: 'chevron-left',
            click() {}
        },
        {
            type: 'button',
            icon: 'chevron-right',
            click() {}
        },
        {
            type: 'title',
            titleLevel: 1,
            text: currentTabSelected.value
        }
    ],
    right: [
        {
            type: 'container',
            children: [
                {
                    type: 'button',
                    icons: [
                        'border-all',
                        'angle-down'
                    ],
                    click() {}
                },
                {
                    type: 'button',
                    icons: [
                        'table',
                        'angle-down'
                    ],
                    click() {}
                },
                {
                    type: 'button',
                    icons: [
                        'ellipsis-h',
                        'angle-down'
                    ],
                    click() {}
                }
            ]
        },
        {
            type: 'container',
            children: [
                {
                    type: 'button',
                    icon: 'upload',
                    click() {}
                },
                {
                    type: 'button',
                    icon: 'tag',
                    click() {}
                },
                {
                    type: 'button',
                    icon: 'angle-double-right',
                    click() {}
                },
                {
                    type: 'button',
                    icon: 'search',
                    click() {}
                },
            ]
        }
    ]
});

const displayAlert = ref(false);

const openAlert = () => displayAlert.value = true;
const hideAlert = () => displayAlert.value = false;

watch(currentTabSelected, () => {
    setCurrentAppHeaderBar({
        left: (currentAppHeaderBar.value?.left ?? [])?.reduce((r, c) => c.type === 'title' && c.titleLevel === 1 ? [...r, {
            ...c,
            text: currentTabSelected.value
        }] : [...r, c], []) ?? []
    })
});
</script>

<style lang="scss" scoped>
.finder-root {
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

</style>
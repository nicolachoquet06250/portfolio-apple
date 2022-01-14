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

const { setCurrentAppMenus, currentAppHeaderBar } = useCurrentApp();

const currentTabSelected = ref('Applications');

setCurrentAppMenus({
    TitleSection1: {
        type: 'title',
        text: 'Favorites'
    },
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

const displayAlert = ref(false);

const openAlert = () => displayAlert.value = true;
const hideAlert = () => displayAlert.value = false;

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
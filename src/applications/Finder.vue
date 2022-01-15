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
import { useFinder } from '@/hooks/finder';
import MacOsAlert from '@/components/MacOsAlert.vue';
import Button from '@/components/Button.vue';

const { setCurrentAppMenus } = useCurrentApp();
const { selectTab } = useFinder();

selectTab('Applications');

setCurrentAppMenus({
    TitleSection1: {
        type: 'title',
        text: 'Favorites'
    },
    Applications: {
        active: true,
        click() {
            selectTab('Applications');
        }
    },
    Recent: {
        click() {
            selectTab('Recent');
        }
    },
    AirDrop: {
        click() {
            selectTab('AirDrop');
        }
    },
    Desktop: {
        click() {
            selectTab('Desktop');
        }
    },
    Documents: {
        click() {
            selectTab('Documents');
        }
    },
    Downloads: {
        click() {
            selectTab('Downloads');
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
<template>
    <h1>Store</h1>
</template>

<script setup>

import { useCurrentApp } from '@/hooks/apps';

const { setCurrentAppMenus, currentAppHeaderBar } = useCurrentApp();

setCurrentAppMenus({
    Discover: {
        active: true
    },
    Arcade: {},
    Create: {},
    Work: {},
    Play: {},
    Develop: {},
    Categories: {},
    Updates: {}
});
</script>

<style lang="scss" scoped>
h1 {
    margin-top: 0;
}
</style>
<template>
    <h1>Mail</h1>
</template>

<script setup>
import { useCurrentApp } from '@/hooks/apps';

const { setCurrentAppMenus } = useCurrentApp();

setCurrentAppMenus({
    TitleSection1: {
        type: 'title',
        text: 'Favorites'
    },
    Inbox: {
        active: true
    },
    Send: {},
    Drafts: {},
    VIPs: {},
    Flagged: {}
});
</script>

<style lang="scss" scoped>
h1 {
    margin-top: 0;
}
</style>
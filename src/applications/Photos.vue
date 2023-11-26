<template>
    <div>
        <h1>Photos &lt;{{selectedTab}}&gt;</h1>
    </div>
</template>

<script lang="ts" setup>
import { usePhotos } from '@/hooks/photos';

const { selectedTab } = usePhotos();
</script>

<style lang="scss">

</style>
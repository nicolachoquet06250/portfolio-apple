<template>
    <MacOsSystemLoader @loaded="$emit('nextStep', {
        event: $event,
        details: {}
    })">
        <span>
            Il reste environ 1 minute...
        </span>
    </MacOsSystemLoader>
</template>

<script lang="ts" setup>
import { useMenu } from '@/hooks/installation/menu';
import MacOsSystemLoader from '@/components/MacOsSystemLoader.vue';

defineEmits(['nextStep']);

const { resetMenus } = useMenu();

resetMenus();
</script>

<style lang="scss" scoped>
* {
    cursor: default;
}
span {
    font-size: 10px;
    color: white;
}
</style>
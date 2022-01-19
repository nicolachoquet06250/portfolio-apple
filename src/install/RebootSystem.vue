<template>
    <MacOsSystemLoader @loaded="$emit('nextStep')">
        <span>
            Il reste environ 1 minute...
        </span>
    </MacOsSystemLoader>
</template>

<script setup>
import { defineEmits } from 'vue';

import MacOsSystemLoader from '@/components/MacOsSystemLoader.vue';

defineEmits(['nextStep']);
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
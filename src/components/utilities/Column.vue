<template>
    <div class="desktop-grid-column">
        <slot></slot>
    </div>
</template>

<script setup>

</script>

<style lang="scss" scoped>
.desktop-grid-column {
    display: flex;
    flex-direction: column;
    height: 100%;
    justify-content: flex-start;
    align-items: flex-start;
    padding: 10px;
}
</style>
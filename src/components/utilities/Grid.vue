<template>
    <div class="desktop-grid">
        <slot></slot>
    </div>
</template>

<script setup>

</script>

<style lang="scss" scoped>
.desktop-grid {
    position: absolute;
    top: 34px;
    left: 0;
    right: 0;
    bottom: 60px;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: flex-start;
}
</style>
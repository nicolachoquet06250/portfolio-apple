<template>
    <section>
        <slot />
    </section>
</template>

<style scoped lang="scss">
    section {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: calc(100% - 20px);
        padding-bottom: 50px;
        position: relative;
        z-index: v-bind(buttonZIndex);
    }
</style>
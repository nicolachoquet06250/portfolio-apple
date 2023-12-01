<template>
    <section ref="container">
        <slot v-if="!error" />
    </section>
</template>

<script setup>
import { ref, useSlots, onMounted, onUnmounted, watch } from 'vue';

const $slots = useSlots();

const slots = ref([]);
const error = ref(false);
const container = ref();
const mutationObserver = ref(null);
const mockData = ref([]);

function setSlots() {
    slots.value = $slots.default()
        // remplacement des fragments par leur contenu
        .reduce((r, el) => [
            ...r, 
            ...(el.type.toString() === 'Symbol(v-fgt)') ? el.children : [el]
        ], [])
        // suppression des commentaires
        .filter(el => el.type.toString() !== 'Symbol(v-cmt)');
}

onMounted(() => {
    setSlots();

    mutationObserver.value = new MutationObserver(setSlots);

    mutationObserver.value.observe(container.value, {
        childList: true,
    });

    setTimeout(() => { mockData.value = [1, 2, 3]; }, 5000);
});

onUnmounted(() => {
    mutationObserver.value.disconnect();
});

watch(slots, (slots) => {
    const fullSize = slots
        .filter(el => el.type.toString() !== 'Symbol(v-cmt)')
        .length;

    if (slots
        .filter(el => typeof el.type !== 'string')
        .filter(el => el.type.__name === 'UnlockScreenNotification')
        .length !== fullSize
    ) {
        error.value = true;
        throw new Error('UnlockScreenNotificationList component accept only Notification components in slot !');
    }
});
</script>

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
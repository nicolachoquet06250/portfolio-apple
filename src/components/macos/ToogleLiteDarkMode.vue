<template>
    <button @dblclick="toggleDark()">
        <i class="fas fa-moon" v-if="isDark"></i>
        <i class="fas fa-sun" v-else></i>

        <span>
            {{ nextMode }} mode
        </span>
    </button>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useDark } from '@/hooks/theme';

const props = withDefaults(defineProps<{
  color: string
}>(), {
  color: 'whitesmoke'
});

const color = computed(() => props.color);

const { isDark, toggleDark } = useDark();
const nextMode = computed(() => isDark.value ? 'Light' : 'Dark');
</script>

<style lang="scss" scoped>
button {
    border: 0;
    background-color: transparent;
    border-radius: 10px;
    outline: 0;
    width: 150px;
    height: 150px;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    align-items: center;
    position: relative;
    margin-left: 15px;
    right: 10px;
    margin-top: 10px;

    * {
        font-size: 15px;
        color: whitesmoke;
        color: v-bind(color);
        font-weight: bold;
    }

    i {
        font-size: 50px;
    }

    &:focus, &:active {
        background-color: lightskyblue;

        * {
            color: black;
        }
    }
}
</style>
<template>
    <div class="alert" ref="alert">
        <div class="img-container">
            <img :src="appstore">
        </div>

        <div class="alert-title">
            Alert title will be here
        </div>

        <div class="alert-text">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Reiciendis nesciunt veritatis praesentium veniam eveniet nostrum, enim natus corrupti!
        </div>

        <div class="btn-container column">
            <Button>
                Validate
            </Button>
            
            <Button primary @click="$emit('close', $event)">
                Cancel
            </Button>

            <Checkbox id="dont-ask-again">
                Dont ask again
            </Checkbox>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch, defineEmits } from 'vue';
import appstore from '@/assets/dock/appstore.png';
import { useWindowSize } from "@vueuse/core";

import Button from '@/components/Button.vue';
import Checkbox from '@/components/Checkbox.vue';

defineEmits(['close']);

const { width } = useWindowSize();

const alert = ref(null);
const alertHeight = ref('0px');
const screenWidth = computed(() => width.value + 'px');

watch(alert, () => {
    if (alert.value) {
        alertHeight.value = alert.value?.offsetHeight + 'px';
    }
});
</script>

<style lang="scss" scoped>
.alert {
    width: 426px;
    height: auto;
    padding: 20px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    -webkit-border-radius: 10px;
    -moz-border-radius: 10px;
    border-radius: 10px;
    box-shadow: 2px 20px 36px -5px rgba(0,0,0,0.59);
    position: absolute;
    top: calc(50% - (v-bind(alertHeight) / 2));
    left: calc((v-bind(screenWidth) / 2) - (426px / 2));
    background-color: white;

    .img-container {
        margin-bottom: 25px;

        img {
            width: 94px;
            height: auto;
        }
    }

    .alert-title {
        font-weight: bold;
        margin-bottom: 20px;
    }

    .alert-text {
        text-align: center;
        margin-bottom: 15px;
    }

    .btn-container {
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;

        &.row {
            flex-direction: row;
        }

        &.column {
            flex-direction: column;

            * {
                margin-bottom: 10px;
            }
        }
    }
}
</style>
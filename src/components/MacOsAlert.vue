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
            <button class="btn-secondary">
                Validate
            </button>

            <button class="btn-primary" @click="$emit('close', $event)">
                Cancel
            </button>

            <div class="checkbox-container">
                <input type="checkbox" id="dont-ask-again" />

                <label for="dont-ask-again" clickable>Dont ask again</label>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch, defineEmits } from 'vue';
import appstore from '@/assets/dock/appstore.png';
import { useWindowSize } from "@vueuse/core";

defineEmits(['close']);

const { width } = useWindowSize();

const alert = ref(null);
const alertHeight = ref('0px');
const screenWidth = computed(() => width.value + 'px');

watch(alert, () => {
    if (alert.value) {
        alertHeight.value = alert.value?.offsetHeight + 'px';
    }
})
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

        button {
            width: 100%;
            padding: 10px;
            border: none;
            border-radius: 10px;

            &:first-child {
                margin-right: 5px;
            }

            &:last-child {
                margin-left: 5px;
            }

            &.btn-primary {
                background-color: #007AFF;
                color: white;

                &:hover {
                    background-color: #57A7FF;
                }
            }

            &.btn-secondary {
                background-color: #E6E6E6;
                color: black;

                &:hover {
                    background-color: #EFEFEF;
                }
            }
        }

        .checkbox-container {
            input[type="checkbox"] {
                display: none;

                + label {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 20px;

                    &::before {
                        content: '';
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        display: inline-block;
                        width: 20px;
                        height: 20px;
                        border: 1px solid #e7e3e3;
                        border-radius: 5px;
                        margin-right: 5px;
                    }
                }

                &:checked {
                    + label {
                        &::before {
                            content: '✔';
                            display: flex;
                            color: green;
                            border-color: green;
                        }
                    }
                }
            }
        }
    }
}
</style>
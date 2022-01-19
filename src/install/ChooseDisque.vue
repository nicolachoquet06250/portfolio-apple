<template>
    <div class="choose-disque-step">
        <div class="window">
            <div class="window-header">
                <span class="window-title">
                    Install macOS
                </span>
            </div>

            <div class="window-body">
                <img :src="iconInstallMac" />

                <h1> macOS </h1>

                <p v-if="choosenDisque !== ''">
                    macOS sera installé sur le disque <i class="fas fa-angle-double-left"></i> {{ choosenDisque }} <i class="fas fa-angle-double-right"></i>.
                </p>
                <div v-else style="height: 40px"></div>

                <div class="disques-container">
                    <div :class="{
                        disque: true,
                        active: choosenDisque === disque.name
                    }" clickable @click="chooseDisque(disque.name)"
                    v-for="disque of DISQUES" :key="disque.name">
                        <img :src="disque.icon" />

                        <span class="disque-title">
                            {{ disque.name }}
                        </span>

                        <span class="stockage-total">
                            {{ disque.stockage }} Go au total
                        </span>

                        <span class="stockage-available">
                            {{ disque.stockage }} Go disponible(s)
                        </span>
                    </div>
                </div>
            </div>

            <div class="window-footer">
                <button @click="$emit('previousStep', {
                    event: $event,
                    details: {
                        accepted: false
                    }
                })">
                    <i class="fas fa-arrow-left"></i>
                    <span> Précédent </span>
                </button>

                <button @click="$emit('nextStep', {
                    event: $event,
                    details: {
                        accepted: true
                    }
                })" :disabled="choosenDisque === ''">
                    <i class="fas fa-arrow-right"></i>
                    <span> Installer </span>
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, defineEmits } from 'vue';
import { useWindowSize } from '@vueuse/core';
import { DISQUES, useDisque } from '@/hooks/installation/disque';

import iconInstallMac from '@/assets/install-icons/icon-install-macos.png';

defineEmits(['nextStep', 'previousStep']);

const { chooseDisque, choosenDisque } = useDisque();

const { width } = useWindowSize();
const windowWidth = computed(() => `${width.value}px`);
</script>

<style lang="scss" scoped>
.choose-disque-step {
    cursor: default;
    background-color: #131313;
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;

    .window {
        background-color: #282828;
        position: absolute;
        top: 100px;
        width: 730px;
        height: 600px;
        display: flex;
        flex-direction: column;
        border-radius: 10px;
        overflow: hidden;
        transform: translateX(calc((v-bind(windowWidth) - 603px) / 2));

        &-header {
            background-color: #1E1E1E;
            border-bottom: 4px solid #080808;
            border-top: 2px solid #4E4E4E;
            height: 20px;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        .window-title {
            color: #BABABA;
        }

        &-body {
            display: flex;
            flex: 9;
            flex-direction: column;
            justify-content: flex-start;
            align-items: center;
            padding-top: 30px;

            img {
                width: 200px;
                height: auto;
            }

            h1, p {
                color: white;
            }

            h1 {
                margin-bottom: 0;
            }
            p {
                font-size: 12px;

                i.fas {
                    color: white;
                }
            }

            .disques-container {
                display: flex;
                flex-direction: row;
                justify-content: center;
                align-items: center;

                .disque {
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    padding-left: 20px;
                    padding-right: 20px;
                    padding-top: 10px;

                    &.active {
                        border: 2px solid #E9504E;
                    }

                    img {
                        width: 100px;
                    }

                    span {
                        color: white;
                        font-size: 15px;

                        &.stockage-total, 
                        &.stockage-available {
                            font-size: 12px;
                        }
                    }
                }
            }
        }

        &-footer {
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;
            height: 80px;
            
            button {
                background-color: transparent;
                border: none;
                margin-left: 10px;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                height: 60px;
                padding-left: 10px;
                padding-right: 10px;

                &:active, &:focus {
                    outline: 2px solid #E9504E;
                }

                i.fas {
                    transform: scale(1.5);
                    color: #7F7F7F;
                    margin-bottom: 10px;

                    &::after {
                        content: '';
                        font-family:"Font Awesome 6 Free";
                        font-weight: 400;
                        font-size: 20px;
                        position: absolute;
                        top: -3.75px;
                        left: -4px;
                    }

                    + span {
                        margin-bottom: -10px;
                        color: #DCDCDC;
                    }
                }
            }
        }
    }
}
</style>
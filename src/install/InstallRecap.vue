<template>
    <div class="recap-install-step">
        <div class="window">
            <div class="window-header">
                <span class="window-title">
                    Install macOS
                </span>
            </div>

            <div class="window-body">
                <img :src="iconInstallMac" />

                <h1> macOS </h1>

                <p> Pour configurer l'installation de macOS, cliquez sur Continuer. </p>
            </div>

            <div class="window-footer">
                <button @click="$emit('nextStep', {
                    event: $event,
                    details: {
                        continue: true
                    }
                })">
                    <i class="fas fa-arrow-right"></i>
                    <span> Continuer </span>
                </button>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';
import { useMenu, useStepTitle } from '@/hooks/installation/menu';
import { useWindowSize } from '@vueuse/core';
import iconInstallMac from '@/assets/install-icons/icon-install-macos.png';

defineEmits(['nextStep']);

useStepTitle('Install macOS');
const { setMenu, resetMenus } = useMenu();

resetMenus();
setMenu('Edition', {});
setMenu('Fenêtre', {});

const { width } = useWindowSize();
const windowWidth = computed(() => `${width.value}px`);
</script>

<style lang="scss" scoped>
.recap-install-step {
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
        width: 730px;
        height: 600px;
        display: flex;
        flex-direction: column;
        border-radius: 10px;
        overflow: hidden;
        left: calc(50% - (730px / 2));
        top: calc(50% - (600px / 2));

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
<template>
    <div class="install-choose-language-step">
        <div class="window">
            <div class="window-body">
                <img :src="iconLangues" alt="icon languages" />

                <h2>Langue</h2>

                <div class="langue-select">
                    <a href="#" :class="{
                        'langue-option': true,
                        active: selectedLangue === langue.value
                    }" 
                       v-for="langue of LANGUES" :key="langue.value" 
                       @click.prevent.stop="selectLangue(langue.value)">
                        {{langue.displayed}}
                    </a>
                </div>

                <div class="install-info">
                    <div class="alert-warning">
                        <div>
                            <i class="fas fa-exclamation-triangle"></i>
                        </div>

                        <div>
                            <p>
                                Cette application est un WebOS.
                            </p>
                            <p>
                                Aucune donnée ne sera donc envoyé sur un serveur distant ou stockée sous forme de fichier sur votre machine.
                            </p>
                            <p>
                                toutes vos données saisies resteront stockés sur votre navigateur et pourront donc être supprimées à tout moment.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div class="window-footer">
                <button v-if="show" @click="handleInstall">
                    <i class="far fa-circle-down"></i>

                    <span> Ajouter l'app<br>sur le bureau </span>
                </button>

                <button
                        @click="$emit('nextStep', {
                            event: $event,
                            details: {
                                skip_install: true
                            }
                        })"
                >
                    <i class="far fa-times-circle"></i>

                    <span> Passer<br>l'installation </span>
                </button>

                <button
                    @click="$emit('nextStep', {
                        event: $event,
                        details: {
                            selectedLangue
                        }
                    })"
                >
                    <i class="fas fa-arrow-right"></i>
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { defineEmits } from 'vue';
import { LANGUES, useLangues } from '@/hooks/installation/langue';
import { useMenu } from '@/hooks/installation/menu';
import iconLangues from '@/assets/install-icons/icon-langues.png';
import { usePwa } from '@/hooks/pwa';

const { selectLangue, selectedLangue } = useLangues();
const { resetMenus } = useMenu();
const {
    authorizedInstallation: show,
    onInstall: handleInstall
} = usePwa();

defineEmits(['nextStep']);

selectLangue(LANGUES[0].value);
resetMenus();
</script>

<style lang="scss" scoped>
.install-choose-language-step {
    background-color: #131313;
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;

    .window {
        background-color: #323232;
        position: absolute;
        width: 920px;
        height: 750px;
        max-height: calc(100% - 20px);
        display: flex;
        flex-direction: column;
        border-radius: 10px;
        overflow: hidden;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -52%);
        margin-bottom: 10px;
        margin-top: 10px;

        &-body {
            display: flex;
            flex: 9;
            flex-direction: column;
            justify-content: flex-start;
            align-items: center;
            padding-top: 70px;
            padding-bottom: 20px;
            overflow-y: auto;

            h2 {
                color: white;
            }

            .langue {
                &-select {
                    background-color: #1F1F1F;
                    width: 300px;
                    height: 350px;
                    display: flex;
                    flex-direction: column;
                    justify-content: flex-start;
                    align-items: center;
                    margin-bottom: 20px;
                    border: 4px solid #287099;
                    border-radius: 5px;
                }

                &-option {
                    text-decoration: none;
                    width: 100%;
                    height: auto;
                    color: white;
                    display: flex;
                    justify-content: center;
                    align-items: center;

                    &.active, &:active, &:focus {
                        background-color: #0059D1;
                    }
                }
            }

            .alert-warning {
                display: flex;
                flex-direction: row;
                justify-content: center;
                align-items: center;

                > div {
                    i {
                        color: orange;
                        font-size: 30px;
                        margin-right: 20px;
                    }

                    p {
                        margin: 0;
                        color: white;
                        font-size: 12px;
                    }
                }
            }
        }

        &-footer {
            background-color: #383838;
            display: flex;
            flex: .75;
            flex-direction: row;
            justify-content: flex-end;
            align-items: center;
            border-top: 2px solid #414141;

            button {
                background-color: transparent;
                border: none;
                margin-right: 30px;
                margin-top: 5px;
                margin-bottom: 5px;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                height: 100%;

                i {
                    &.fas, &.far {
                        color: #6D6D6D;
                        font-size: 30px;
                    }

                    + span {
                        color: #6D6D6D;
                        margin-top: 5px;
                    }
                }
            }
        }
    }
}
</style>
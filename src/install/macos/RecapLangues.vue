<template>
    <div class="recap-langue-step">
        <div class="blur"></div>

        <div class="window">
            <div class="window-body">
                <img :src="iconDialogue" alt="icon dialogue" />

                <h1> Langues parlées et écrites </h1>

                <div class="recap-list">
                    <div class="recap-item">
                        <img :src="iconLangues" alt="icon langues" />

                        <div class="recap-item-description">
                            <h5> Langues préférées </h5>

                            <p> {{ langue?.displayed }} ({{ country?.displayed }}) </p>
                        </div>
                    </div>
                    
                    <div class="recap-item">
                        <img :src="iconLangues" alt="icon langues" />

                        <div class="recap-item-description">
                            <h5> Méthodes de saisie </h5>

                            <p> {{ country?.displayed }} </p>
                        </div>
                    </div>

                    <div class="recap-item">
                        <img :src="iconLangues" alt="icon langues" />

                        <div class="recap-item-description">
                            <h5> Dictée </h5>
                            
                            <p>  {{ langue?.displayed }} ({{ country?.displayed }})  </p>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="window-footer">
                <button v-if="show" @click="handleInstall">
                    Ajouter l'app sur le bureau
                </button>

                <button @click="$emit('previousStep', {
                    event: $event,
                    details: {
                        continue: false
                    }
                })">
                    Retour
                </button>

                <button @click="$emit('nextStep', {
                    event: $event,
                    details: {
                        continue: true,
                        selectedLangue: langue!.value,
                        selectedCountry: country!.value
                    }
                })">
                    Continuer
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { defineEmits } from 'vue';
import { useLangues, useCountries } from '@/hooks/installation/langue';
import iconLangues from '@/assets/install-icons/icon-langues.png';
import iconDialogue from '@/assets/install-icons/icon-dialogue.png';
import { usePwa } from '@/hooks/pwa';

defineEmits(['nextStep', 'previousStep']);

const {
  authorizedInstallation: show,
  onInstall: handleInstall
} = usePwa();
const { langue } = useLangues();
const { country } = useCountries();
</script>

<style lang="scss" scoped>
.recap-langue-step {
    cursor: default;
    background-image: url(/img/wallpapers/wallpaper-install-macos.jpg);
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;

    .blur {
        position: absolute;
        top: 0;
        left:0;
        right: 0;
        bottom: 0;
        backdrop-filter: blur(1.5rem);
    }

    .window {
        box-shadow: 2px 20px 36px -5px rgba(0,0,0,0.59);
        background-color: #F7F7F7;
        backdrop-filter: blur(1.5rem);
        position: absolute;
        width: 920px;
        height: 750px;
        display: flex;
        flex-direction: column;
        border-radius: 10px;
        overflow: hidden;
        z-index: 1;
        left: calc(50% - (920px / 2));
        top: calc(50% - (750px / 2));

        &-body {
            display: flex;
            flex: 9;
            flex-direction: column;
            justify-content: flex-start;
            align-items: center;
            margin-top: 30px;
            padding-top: 70px;

            h2 {
                color: black;
            }

            .recap {
                &-list {
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                }

                &-item {
                    display: flex;
                    flex-direction: row;
                    justify-content: center;
                    align-items: center;
                    margin-top: 30px;

                    img {
                        width: 50px;
                    }

                    &-description {
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        align-items: flex-start;
                        font-size: 15px;
                        margin-left: 15px;

                        h5, p {
                            margin: 0;
                        }

                        h5 {
                            margin-bottom: 5px;
                        }

                        p {
                            font-size: 14px;
                        }
                    }
                }
            }
        }

        &-footer {
            background-color: #F2F2F2F2;
            display: flex;
            flex: .75;
            flex-direction: row;
            justify-content: flex-end;
            align-items: center;
            border-top: 2px solid #E9E9E9;

            > button {
                background-color: #DED8D2;
                color: black;
                margin-bottom: 20px;
                margin-right: 20px;
                margin-top: 20px;
                border-radius: 5px;
                border: none;
                padding-left: 15px;
                padding-right: 15px;
                padding-top: 5px;
                padding-bottom: 5px;

                &:active, &:focus {
                    outline: 4px solid #246896;
                }

                &:disabled {
                    background-color: #E5E5E5;
                    color: #D0D0D0;
                }
            }
        }
    }
}
</style>
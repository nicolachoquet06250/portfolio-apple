<template>
    <div class="choose-country-step">
        <div class="blur"></div>

        <div class="window">
            <div class="window-body">
                <img :src="iconCountry" alt="icon country" />

                <h1> Choisir un pays ou une région </h1>

                <div class="country-select">
                    <a href="#" :class="{
                        'country-option': true,
                        active: selectedCountry === country.value
                    }" 
                       v-for="country of COUNTRIES" :key="country.value" 
                       @click.prevent.stop="selectCountry(country.value)">
                        {{ country.displayed }}
                    </a>
                </div>
            </div>
            
            <div class="window-footer">
                <button @click="$emit('previousStep', {
                    event: $event,
                    details: {
                        continue: false
                    }
                })">
                    Retour
                </button>

                <button :disabled="selectedCountry === ''" 
                    @click="$emit('nextStep', {
                        event: $event,
                        details: {
                            continue: true,
                            selectedCountry
                        }
                    })">
                    Continuer
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { defineEmits } from 'vue';
import { COUNTRIES, useCountries } from '@/hooks/installation/langue';
import iconCountry from '@/assets/install-icons/icon-country.png';

defineEmits(['nextStep', 'previousStep']);

const { selectedCountry, selectCountry } = useCountries();
</script>

<style lang="scss" scoped>
.choose-country-step {
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
            padding-top: 70px;

            h2 {
                color: black;
            }

            .country {
                &-select {
                    background-color: #FFFFFF;
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
                    color: black;
                    display: flex;
                    justify-content: center;
                    align-items: center;

                    &.active, &:active, &:focus {
                        color: white;
                        background-color: #0059D1;
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
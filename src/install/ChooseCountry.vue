<template>
    <div class="choose-country-step">
        <div class="window">
            <div class="window-body">
                <img :src="iconCountry" />

                <h1> Choisir un pays ou une région </h1>

                <div class="country-select">
                    <a href="#" :class="{
                        'country-option': true,
                        active: selectedCountry === country.value
                    }" 
                       v-for="country of countries" :key="country.value" 
                       @click.prevent.stop="selectedCountry = country.value">
                        {{ country.displayed }}
                    </a>
                </div>
            </div>
            
            <div class="window-footer">

            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import iconCountry from '@/assets/install-icons/icon-country.png';

const countries = [
    {
        value: 'fr',
        displayed: 'France'
    },
    {
        value: 'us',
        displayed: 'Etats-Unis'
    },
    {
        value: 'en',
        displayed: 'Royaumes-Unis'
    },
];

const selectedCountry = ref('');
</script>

<style lang="scss">
.choose-country-step {
    cursor: default;
    background-image: url(/img/wallpapers/wallpaper-install-macos.jpg);
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;

    .window {
        background-color: #F7F7F7;
        backdrop-filter: blur(1.5rem);
        position: absolute;
        top: 100px;
        left: 10%;
        right: 10%;
        bottom: 70px;
        display: flex;
        flex-direction: column;
        border-radius: 10px;
        overflow: hidden;
        z-index: 1;

        &-body {
            display: flex;
            flex: 9;
            flex-direction: column;
            justify-content: flex-end;
            align-items: center;

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
                    color: white;
                    display: flex;
                    justify-content: center;
                    align-items: center;

                    &.active, &:active, &:focus {
                        background-color: #0059D1;
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

                i.fas {
                    color: #6D6D6D;
                    font-size: 30px;
                }
            }
            
        }
    }
}
</style>
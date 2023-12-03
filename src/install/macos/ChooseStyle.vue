<template>
    <div class="choose-style-step">
        <div class="blur"></div>

        <div class="window">
            <div class="window-body">
                <h1> Choisissez votre style </h1>
                
                <p>
                    Sélectionnez une apparence et voyez comment cela affecte le Dock, 
                    les menus, les boutons, et les fenêtres.
                </p>

                <p>
                    Vous pouvez modifier votre choix ultérieurement dans les paramètres système.
                </p>

                <div class="btn-container">
                    <button v-for="theme of THEMES" :key="theme.label" 
                            :autofocus="selectedTheme === theme.value"
                            :class="{
                                active: selectedTheme === theme.value
                            }" @click="selectTheme(theme.value)">
                        <img :src="theme.icon" alt="icon theme" />

                        <span> {{ theme.label }} </span>
                    </button>
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

                <button @click="$emit('nextStep', {
                    event: $event,
                    details: {
                        continue: true,
                        selectedTheme
                    }
                })">
                    Continuer
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { THEMES, useTheme } from '@/hooks/installation/system-style';

const { selectedTheme, selectTheme } = useTheme();
</script>

<style lang="scss" scoped>
.choose-style-step {
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

            h1 + p, 
            h1 + p + p {
                margin: 0;
                width: 550px;
                text-align: center;
            }

            p {
                font-size: 15px;
            }

            .btn-container {
                display: flex;
                flex-direction: row;
                justify-content: space-around;
                align-items: center;

                button {
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    background: transparent;
                    border: none;
                    outline: none;

                    &:active, &:focus, &.active {
                        img {
                            outline: 5px solid #246896;
                        }
                    }

                    img {
                        width: 200px;
                        border-radius: 5px;
                    }

                    span {
                        margin-top: 10px;
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
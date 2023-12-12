<template>
    <div class="start-install-step">
        <div class="window">
            <div class="window-body">
                <div :class="{
                        'select-option': true,
                        active: isActive(OPTIONS.INSTALL)
                     }" 
                clickable @click="selectOption(OPTIONS.INSTALL)">
                    <img :src="iconInstallMac" alt="icon install macosx" />
                    <div class="select-option-description">
                        <h4> Installer macOS </h4>
                        <p> Mettez à niveau ou installez une nouvelle copie de macOS. </p>
                    </div>
                </div>
            </div>

            <div class="window-footer">
                <button v-if="show" @click="handleInstall">
                    Ajouter l'app sur le bureau
                </button>

                <button :disabled="selectedOption === ''" @click="$emit('nextStep', {
                    event: $event,
                    details: {
                        selectedOption
                    }
                })">
                    Continuer
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, defineEmits } from 'vue';
import { useMenu, useStepTitle } from '@/hooks/installation/menu';
import iconInstallMac from '@/assets/install-icons/icon-install-macos.png';
import { usePwa } from '@/hooks/pwa';

defineEmits(['nextStep']);

const {
    authorizedInstallation: show,
    onInstall: handleInstall
} = usePwa();

const selectedOption = ref('');

enum OPTIONS {
    INSTALL = 'install'
}

const selectOption = (option: OPTIONS) => {
    selectedOption.value = option;
};

const isActive = (option: OPTIONS) => selectedOption.value === option;

useStepTitle('Récupération');
const { setMenu, resetMenus } = useMenu();

resetMenus();
setMenu('Fichier', {});
setMenu('Edition', {});
setMenu('Utilitaires', {});
setMenu('Fenêtre', {});
</script>

<style lang="scss" scoped>
.start-install-step {
    cursor: default;
    background-color: #131313;
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;

    .window {
        background-color: #282828;
        border-top: 2px solid #4E4E4E;
        position: absolute;
        top: 100px;
        width: 630px;
        height: 500px;
        display: flex;
        flex-direction: column;
        border-radius: 10px;
        overflow: hidden;
        left: calc(50% - (630px / 2));
        top: calc(50% - (500px / 2));

        &-body {
            display: flex;
            flex: 9;
            flex-direction: column;
            justify-content: flex-start;
            align-items: center;
            padding-top: 30px;

            .select-option {
                display: flex;
                flex-direction: row;

                &.active {
                    margin-top: -4px;
                    background-color: #3D3D3D;
                    border: 4px solid #E9504E;
                }

                img {
                    width: 100px;
                    height: 100px;
                }

                &-description {
                    display: flex;
                    flex-direction: column;
                    justify-content: center;

                    h4, p {
                        margin: 0;
                    }

                    h4 {
                        color: white;
                        margin-bottom: 5px;
                    }

                    p {
                        color: #858585;
                    }
                }
            }
        }

        &-footer {
            display: flex;
            flex-direction: row;
            justify-content: flex-end;
            align-items: flex-end;

            > button {
                background-color: #60605C;
                color: white;
                margin-bottom: 20px;
                margin-right: 20px;
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
                    background: #434343;
                    color: #696969;
                }
            }
        }
    }
}
</style>
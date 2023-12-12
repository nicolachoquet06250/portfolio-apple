<template>
    <div class="create-account-step">
        <div class="blur"></div>

        <div class="window">
            <div class="window-body">
                <h1> Créer un compte utilisateur </h1>
                
                <p>
                    Saisissez les informations suivantes pour créer votre compte utilisateur.
                </p>

                <p>
                    Ces informations ne seront pas envoyé à l'exterieur de votre navigateur.
                </p>

                <form>
                    <div>
                        <label for="fullname" clickable>
                            Nom complet :
                        </label>

                        <input type="text" id="fullname" v-model="fullName" />
                    </div>

                    <div>
                        <label for="accountname" clickable>
                            Nom du compte :
                        </label>

                        <div>
                            <input type="text" id="accountname" v-model="accountName" />

                            <p>
                                Celui-ci sera utilisé comme nom de votre dossier de départ.
                            </p>
                        </div>
                        
                    </div>

                    <div class="multi-field">
                        <label for="password1" clickable>
                            Mot de passe :
                        </label>

                        <input type="password" id="password1" disabled title="Pas besoin" />

                        <input type="password" id="password2" disabled title="Pas besoin" />
                    </div>

                    <div>
                        <label for="password-indices" clickable>
                            Indice :
                        </label>

                        <input type="text" id="password-indices" placeholder="facultatif" disabled title="Pas besoin" />
                    </div>
                </form>
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

                <button :disabled="fullName === '' || accountName === ''"
                        @click="_createAccount($event)">
                    Continuer
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { defineEmits, ref } from 'vue';
import { useAccount } from '@/hooks/installation/account';
import {usePwa} from '@/hooks/pwa';

const emit = defineEmits(['nextStep', 'previousStep']);

const {
  authorizedInstallation: show,
  onInstall: handleInstall
} = usePwa();
const { createAccount } = useAccount();

const fullName = ref('');
const accountName = ref('');

const _createAccount = (e: Event) => {
    createAccount(fullName.value, accountName.value);

    emit('nextStep', {
        event: e,
        details: {
            continue: true,
            fullName: fullName.value,
            accountName: accountName.value
        }
    })
}
</script>

<style lang="scss" scoped>
.create-account-step {
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

            form {
                margin-top: 40px;

                > div {
                    display: flex;
                    flex-direction: row;
                    margin-top: 10px;

                    label {
                        color: black;
                        flex: 1;
                        text-align: right;
                        padding-right: 20px;
                    }

                    input, & > div {
                        flex: 2;
                    }

                    input {
                        border: 2px solid #DBDBDB;
                        border-radius: 2px;

                        &:focus, &:active {
                            outline: 4px solid #6597D6;
                        }
                    }

                    input[type=password] {
                        flex: 1;
                        margin-left: 2.5px;
                        margin-right: 2.5px;
                    }

                    > div {
                        margin-left: -4px;

                        input {
                            width: calc(100% - 8px);
                        }

                        p {
                            margin-top: 0;
                            font-size: 12px;
                            width: 100%;
                            color: #BCBCBC;
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
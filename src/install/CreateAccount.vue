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
                <button @click="$emit('previousStep', {
                    event: $event,
                    details: {
                        continue: false
                    }
                })">
                    Retour
                </button>

                <button :disabled="fullName === '' || accountName === ''"
                    @click="$emit('nextStep', {
                        event: $event,
                        details: {
                            continue: true,
                            fullName,
                            accountName
                        }
                    })">
                    Continuer
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';

const fullName = ref('');
const accountName = ref('');
</script>

<style lang="scss">
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

    .alert {
        position: absolute;
        width: 300px;
        height: 200px;
        top: calc(50% - 100px);
        left: calc(50% - (300px / 2));
        background-color: white;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        border-radius: 10px;

        img {
            width: 50px;
        }

        p {
            padding-left: 20px;
            padding-right: 20px;
            text-align: center;
            font-weight: bold;
            font-size: 14px;
        }

        .btn-container {
            width: 100%;
            display: flex;
            flex-direction: row;
            justify-content: space-around;

            button {
                width: 100%;
                padding-top: 8px;
                padding-bottom: 8px;
                border: none;
                background-color: #CDCDCD;
                border-radius: 8px;

                &:focus, &:active {
                    outline: 4px solid #6597D6;
                }

                &:first-child {
                    margin-left: 10px;
                    margin-right: 5px;
                }

                &:last-child {
                    margin-right: 10px;
                    margin-left: 5px;
                }
            }
        }

        &-overlay {
            position: absolute;
            top: 0;
            left: 0;
            bottom: 0;
            right: 0;
            background-color: rgba(0, 0, 0, 0.7);
            z-index: 1;
        }
    }
}
</style>
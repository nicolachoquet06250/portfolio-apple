<template>
    <div class="general-conditions-step">
        <div class="blur"></div>

        <div class="window">
            <div class="window-body">
                <h1> Conditions générales </h1>
                
                <p>
                    Important : l'utilisation de mon portfolio est soumise aux présentes Conditions générales.
                </p>
                <p>
                    Lisez-les attentivement.
                </p>

                <div class="conditions-container">
                    <h3>A. Lorem ipsum dolor sit amet.</h3>

                    <p>
                        Lorem ipsum dolor, sit amet consectetur adipisicing elit. 
                        Fugit delectus cupiditate laborum a minus, maiores at, distinctio labore illum voluptas amet ducimus reprehenderit ipsa, 
                        enim culpa quaerat dolores sunt. Doloribus, earum nulla, 
                        perspiciatis amet recusandae mollitia harum ipsam ut molestiae sed reiciendis dicta quia repudiandae nam. 
                        Odit, enim eius cum vel similique sapiente corrupti velit molestiae, illum tempore ut voluptatum dolor, accusantium a id. 
                        Repellendus veritatis molestias perferendis minus doloremque aspernatur? 
                        Animi eum eius alias voluptates repellat ipsam fugiat earum quod odio unde ipsum dicta ut reiciendis esse quibusdam, 
                        perspiciatis modi saepe blanditiis optio rerum numquam rem, dignissimos et? Facere?
                    </p>

                    <h3>B. Lorem ipsum dolor sit amet consectetur.</h3>

                    <p>
                        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Nesciunt tenetur voluptates porro delectus maiores quo itaque quas animi, 
                        amet obcaecati eos in officia minima, aperiam culpa, voluptate consequatur quibusdam doloremque.
                    </p>
                </div>

                <p>
                    La licence, la garantie et d'autres informations importantes sur le produit sont enregistrées sur le système. 
                    Vous les trouverez dans <i class="fas fa-angle-double-left"></i> A propos de ce portfolio <i class="fas fa-angle-double-right"></i>.
                </p>
            </div>
            
            <div class="window-footer">
                <button @click="$emit('previousStep', {
                    event: $event,
                    details: {
                        accepte: false
                    }
                })">
                    Retour
                </button>

                <button
                    @click="showValidationAlert = true">
                    Accepter
                </button>
            </div>
        </div>

        <div class="alert-overlay" v-if="showValidationAlert">
            <div class="alert">
                <img :src="iconCountry" alt="icon country" />

                <p>
                    J'ai lu et j'accepte le contrat de licence du portfolio
                </p>

                <div class="btn-container">
                    <button @click="showValidationAlert = false">
                        Refuser
                    </button>

                    <button @click="$emit('nextStep', {
                        event: $event,
                        details: {
                            accepte: true
                        }
                    })">
                        Accepter
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import iconCountry from '@/assets/install-icons/icon-country.png';

const showValidationAlert = ref(false);
</script>

<style lang="scss" scoped>
.general-conditions-step {
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

            .conditions-container {
                width: 500px;
                height: 300px;
                overflow: auto;
                border-bottom: 1px solid #C8C8C8;

                p {
                    padding-left: 25px;
                }

                + p {
                    width: 500px;
                    text-align: center;
                    font-weight: bold;
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
<template>
    <div class="accept-licence-step">
        <div class="window">
            <div class="window-header">
                <span class="window-title">
                    Install macOS
                </span>
            </div>

            <div class="window-body">
                <img :src="iconInstallMac" alt="icon install macosx" />

                <h1> macOS </h1>

                <p> Pour pouvoir poursuivre l'installation du logiciel, vous devez accepter les thermes du contrat de licence correspondant. </p>

                <div class="licence-container">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Ratione placeat iure eaque provident architecto deleniti adipisci dolore, aspernatur repudiandae veritatis velit blanditiis inventore! Cupiditate, laboriosam quidem doloremque praesentium sequi alias.
                    Maxime asperiores vitae voluptatibus expedita. Provident expedita temporibus similique neque culpa eius voluptatum cupiditate, ratione maiores, dolorem quis impedit assumenda tempora numquam adipisci perspiciatis eligendi doloremque vitae nostrum, accusamus aperiam!
                    Sit et vel voluptate est sed, voluptatem dolor, non quis maxime, optio aliquid neque consequuntur. Dolorum quam accusamus unde ipsam laudantium voluptatum libero officiis perspiciatis quibusdam. Id eligendi harum qui?
                    Enim molestiae dolor laborum a. Ut perferendis velit asperiores, quaerat, distinctio fuga voluptatibus placeat eveniet vitae, dicta a laboriosam ad rerum sequi officia minima vero iste inventore illo odit totam?
                    Voluptates sit quod earum, dicta est veniam laboriosam voluptas fuga eum tempore quidem tempora perferendis ipsa eligendi labore dignissimos maiores quae officia dolores eveniet. Eveniet omnis fugit maiores nesciunt ducimus.
                </div>
            </div>

            <div class="window-footer">
                <button @click="$emit('previousStep', {
                    event: $event,
                    details: {
                        accepted: false
                    }
                })">
                    <i class="fas fa-arrow-left"></i>
                    <span> Refuser </span>
                </button>

                <button @click="$emit('nextStep', {
                    event: $event,
                    details: {
                        accepted: true
                    }
                })">
                    <i class="fas fa-arrow-right"></i>
                    <span> Accepter </span>
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { defineEmits } from 'vue';
import { useMenu, useStepTitle } from '@/hooks/installation/menu';
import iconInstallMac from '@/assets/install-icons/icon-install-macos.png';

defineEmits(['nextStep', 'previousStep']);

useStepTitle('Install macOS');
const { setMenu, resetMenus } = useMenu();

resetMenus();
setMenu('Edition', {});
setMenu('Fenêtre', {});
</script>

<style lang="scss" scoped>
.accept-licence-step {
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

            .licence-container {
                background-color: #1E1E1E;
                color: white;
                border: 1px solid #545454;
                padding: 15px;
                height: 150px;
                overflow: auto;
                margin-left: 100px;
                margin-right: 100px;
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
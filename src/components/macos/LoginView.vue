<template>
    <div class="login-view">
        <div class="login-view-header">
            <span> 
                {{ displayedLangue }} 
                <i class="far fa-keyboard"></i>
            </span>

            <span>
                <i :class="{
                    fas: true,
                    'fa-battery-empty': !charging && level * 100 === 0,
                    'fa-battery-quarter': !charging && level * 100 <= 25,
                    'fa-battery-half': !charging && level * 100 === 50,
                    'fa-battery-full': !charging && level * 100 > 50,
                    'fa-car-battery': charging
                }" :title="dischargingTime.toString()"></i>
            </span>
        
            <span> 
                <i class="fas fa-wifi" 
                    v-if="isOnline"></i>
            </span>

            <span> 
                {{ formattedDate }}
            </span>
        </div>
        
        <div class="login-view-body" v-if="showForm">
            <div class="account-container">
                <div v-for="account of accounts" :key="account.id"
                    class="account" clickable
                    @click="login($event, {...account})">
                    <img :src="defaultProfilePic" alt="profile picture" />

                    <h3> {{ account.full_name }} </h3>

                    <form class="password-container">
                        <input type="password"
                               disabled
                               title="Pas besoin"
                               placeholder="mot de passe" />

                        <button>
                            <i class="far fa-question-circle"></i>
                        </button>
                    </form>
                </div>
            </div>
        </div>
        
        <div class="login-view-footer" v-if="showButtons">
            <div>
                <div>
                    <button>
                        <i class="fas fa-power-off"></i>
                    </button>

                    <span>
                        Eteindre
                    </span>
                </div>
            </div>

            <div>
                <div>
                    <button>
                        <i class="far fa-play-circle"></i>
                    </button>
                    
                    <span>
                        Redémarrer
                    </span>
                </div>
            </div>

            <div>
                <div>
                    <button>
                        <img :src="iconSuspend" alt="suspend icon" />
                    </button>
                    
                    <span> Suspendre </span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useNetwork, useBattery } from "@vueuse/core";
import { useWait } from '@/hooks/wait';
import { useDatabase, TABLES, getParams } from '@/hooks/database';
import { useAuthUser } from '@/hooks/account';
import defaultProfilePic from '@/assets/default-profile-pic.png';
import iconSuspend from '@/assets/icon-suspend-login-view.png';
import type { User } from '@/hooks/account';

withDefaults(defineProps<{
  showButtons: boolean,
  showForm: boolean
}>(), {
  showButtons: true,
  showForm: true
})

const emit = defineEmits(['connected']);

const { authUser } = useAuthUser();
const { isWait, isNotWait } = useWait();
const { onSuccess: onAccountSuccess, results: accounts } = useDatabase<User[]>(...getParams(TABLES.ACCOUNT));
const { onSuccess: onSettingsSuccess, results: settings } = useDatabase<{value: { displayed: string }}>(...getParams(TABLES.SETTINGS));
const { isOnline } = useNetwork();
const { charging, dischargingTime, level } = useBattery();

type DbEvent = {
  context: {
    getAllValues(): void,
    getFromIndex(key: string, value: any): void
  }
};

onAccountSuccess(({ context: { getAllValues } }: DbEvent) => getAllValues()).connect();
onSettingsSuccess(({ context: { getFromIndex } }: DbEvent) => getFromIndex('field', 'langue')).connect();

const displayedLangue = ref('');

const formattedDate = ref(
  new Date().toLocaleDateString("fr-FR", {
    weekday: "short",
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
  })
);

setInterval(() => {
  formattedDate.value = new Date(Date.now()).toLocaleDateString("fr-FR", {
    weekday: "short",
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
  });
}, 1000);

const login = (event: Event, user: User) => {
    isWait();

    console.log(user);

    authUser(user.id, user.full_name, user.account_name);

    setTimeout(() => {
        isNotWait();

        emit('connected', {
            event,
            details: {
                user
            }
        });
    }, 1500);
};

watch(settings, (settings) => (displayedLangue.value = settings.value.displayed));
</script>

<style lang="scss" scoped>
.login-view {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: url(/img/wallpapers/wallpaper-install-macos.jpg);
    background-size: cover;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    z-index: 1;

    &-header {
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
        align-items: center;
        padding-top: 5px;

        span {
            margin-left: 15px;

            &:last-child {
                margin-right: 10px;
            }

            &, & i.fas, & i.far {
                color: white;
            }
        }
    }

    &-body {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        height: 100%;

        .account {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;

            img {
                width: 118px;
                border-radius: 118px;
            }

            * {
                color: white;
            }

            h3 {
                text-shadow: -1px 0 black, 
                    0 1px black, 
                    1px 0 black, 
                    0 -1px black;
                margin-bottom: 15px;
            }

            .password-container {
                display: flex;
                flex-direction: row;
                justify-content: center;
                align-items: center;

                input {
                    padding-top: 5px;
                    padding-bottom: 5px;
                    padding-right: 5px;
                    border-radius: 50px;
                    margin-right: 5px;
                    -webkit-box-shadow: 0 0 18px 6px rgba(0,0,0,0.77);
                    box-shadow: 0 0 18px 6px rgba(0,0,0,0.77);
                
                    &::placeholder {
                        color: #fe9db1;
                        padding-left: 10px;
                    }
                }

                button {
                    background-color: transparent;
                    border: 0;
                    font-size: 20px;

                    i {
                        color: #faf4f2;
                    }
                }
            }

            &-container {
                display: flex;
                flex-direction: row;
                justify-content: center;
                align-items: center;
            }
        }
    }

    &-footer {
        height: 150px;
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        align-items: center;

        * {
            font-size: 20px;
            color: white;
        }

        .fa-play-circle {
            transform: rotate(180deg);
        }

        > div {
            flex: 1;
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;

            &:first-child {
                justify-content: flex-end;
            }

            &:nth-child(2) {
                flex: .5;
            }

            &:last-child {
                justify-content: flex-start;
            }

            > div {
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
            }
        }

        button {
            border: 0;
            padding: 0;
            background-color: rgba(255, 255, 255, .3);
            border-radius: 50px;
            width: 30px;
            height: 30px;
            transform: scale(1.5);
            display: flex;
            justify-content: center;
            align-items: center;
            margin-bottom: 15px;

            i {
                opacity: .6;
            }

            img {
                width: 22px;
            }
        }
    }
}
</style>
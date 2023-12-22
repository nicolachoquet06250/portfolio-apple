<template>
    <div :class="{
        'menu-bar': true,
        rebooted
    }">
        <div v-if="rebooted">
            <span> {{ langue!.displayed }} <i class="far fa-keyboard"></i> </span>

            <span> {{ formattedDate }} </span>
        </div>

        <template v-else>
            <div v-if="Object.keys(menus).length > 0">
                <i class="fab fa-apple"></i>
            </div>

            <div> {{ stepTitle }} </div>

            <div v-for="menuTab of Object.keys(menus)" :key="menuTab" clickable>
                {{ menuTab }}
            </div>

            <div v-if="Object.keys(menus).length > 0">
                <img :src="langue!.flag" alt="language flag" />
            </div>
        </template>
    </div>

    <CurrentStep 
        @nextStep="components[currentStep]?.onNext"
        @previousStep="components[currentStep]?.onPrevious"
    />
</template>

<script setup lang="ts">
import { computed, ref, defineEmits, watch, onMounted } from 'vue';
import { useMenu, isRebooted } from '@/hooks/installation/menu';
import { useLangues } from '@/hooks/installation/langue';
import { useWait } from '@/hooks/wait';
import { useInstalled } from '@/hooks/installed';

import LanguesStep from '@/install/macos/Langues.vue';
import StartInstallStep from '@/install/macos/StartInstall.vue';
import InstallRecapStep from '@/install/macos/InstallRecap.vue';
import LicenceStep from '@/install/macos/Licence.vue';
import ChooseDisqueStep from '@/install/macos/ChooseDisque.vue';
import InstallStep from '@/install/macos/Install.vue';
import RebootSystemStep from '@/install/macos/RebootSystem.vue';
import ChooseCountryStep from '@/install/macos/ChooseCountry.vue';
import RecapLanguesStep from '@/install/macos/RecapLangues.vue';
import GeneralConditionsStep from '@/install/macos/GeneralConditions.vue';
import CreateAccountStep from '@/install/macos/CreateAccount.vue';
import ChooseStyleStep from '@/install/macos/ChooseStyle.vue';
import ConfigurationStep from '@/install/macos/Configuration.vue';
import { Database } from '@/hooks/database/service';

const emit = defineEmits(['installed']);

const { menus, rebooted, stepTitle } = useMenu();
const { langue } = useLangues();
const { isWait, isNotWait } = useWait();
const { isSkipped } = useInstalled()

const date = ref(new Date());
const formattedDate = computed(() => `${date.value.getHours()}:${date.value.getMinutes()}`);

setInterval(() => (date.value = new Date()), 1000);

const currentStep = ref(parseInt(localStorage.getItem('currentStep') ?? '0'));
watch(currentStep, currentStep => localStorage.setItem('currentStep', `${currentStep}`));

const components = [
    {
        component: LanguesStep,
        onNext(e: {details: {skip_install: boolean}}) {
            if (e.details.skip_install) {
                isSkipped();
                emit('installed', {
                    install_skipped: true
                });
            }
            localStorage.setItem(
                'compiled-install-data',
                JSON.stringify({
                  ...(localStorage.getItem('compiled-install-data')
                      ? JSON.parse(localStorage.getItem('compiled-install-data')!) : {}),
                  ...e.details
                })
            );
            console.log(e.details)
            console.log("passer à l'étape de démarrage de l'installation");
            currentStep.value++;
        }
    },
    {
        component: StartInstallStep,
        onNext(e: {details: any}) {
            localStorage.setItem(
                'compiled-install-data',
                JSON.stringify({
                  ...(localStorage.getItem('compiled-install-data')
                      ? JSON.parse(localStorage.getItem('compiled-install-data')!) : {}),
                  ...e.details
                })
            );
            console.log(e.details)
            console.log('passer à l\'étape de récapitulation de l\'installation pour pouvoir commencer');
            currentStep.value++;
        }
    },
    {
        component: InstallRecapStep,
        onNext(e: {details: any}) {
            localStorage.setItem(
                'compiled-install-data',
                JSON.stringify({
                  ...(localStorage.getItem('compiled-install-data')
                      ? JSON.parse(localStorage.getItem('compiled-install-data')!) : {}),
                  ...e.details
                })
            );
            console.log(e.details);
            console.log('passer à l\'étape d\'accéptation de la licence');
            currentStep.value++;
        }
    },
    {
        component: LicenceStep,
        onNext(e: {details: any}) {
            localStorage.setItem(
                'compiled-install-data',
                JSON.stringify({
                  ...(localStorage.getItem('compiled-install-data')
                      ? JSON.parse(localStorage.getItem('compiled-install-data')!) : {}),
                  ...e.details
                })
            );
            console.log(e.details);
            console.log('Passer à l\'étape de choix du disque');
            currentStep.value++;
        },
        onPrevious(e: {details: any}) {
            localStorage.setItem(
                'compiled-install-data',
                JSON.stringify({
                  ...(localStorage.getItem('compiled-install-data')
                      ? JSON.parse(localStorage.getItem('compiled-install-data')!) : {}),
                  ...e.details
                })
            );
            console.log(e.details);
            console.log('Revenir à l\'étape de récap');
            currentStep.value--;
        }
    },
    {
        component: ChooseDisqueStep,
        onNext(e: {details: any}) {
            localStorage.setItem(
                'compiled-install-data',
                JSON.stringify({
                  ...(localStorage.getItem('compiled-install-data')
                      ? JSON.parse(localStorage.getItem('compiled-install-data')!) : {}),
                  ...e.details
                })
            );
            console.log(e.details);
            console.log('Passer à l\'installation');
            isWait();
            currentStep.value++;
        },
        onPrevious(e: {details: any}) {
            localStorage.setItem(
                'compiled-install-data',
                JSON.stringify({
                  ...(localStorage.getItem('compiled-install-data')
                      ? JSON.parse(localStorage.getItem('compiled-install-data')!) : {}),
                  ...e.details
                })
            );
            console.log(e.details);
            console.log('Revenir à l\'étape d\'acceptation de la licence');
            currentStep.value--;
        }
    },
    {
        component: InstallStep,
        onNext(e: {details: any}) {
            localStorage.setItem(
                'compiled-install-data',
                JSON.stringify({
                  ...(localStorage.getItem('compiled-install-data')
                      ? JSON.parse(localStorage.getItem('compiled-install-data')!) : {}),
                  ...e.details
                })
            );
            console.log(e.details);
            console.log('Passer à l\'étape de reboot');
            isNotWait();
            currentStep.value++;
        },
        onPrevious(e: {details: any}) {
            localStorage.setItem(
                'compiled-install-data',
                JSON.stringify({
                  ...(localStorage.getItem('compiled-install-data')
                      ? JSON.parse(localStorage.getItem('compiled-install-data')!) : {}),
                  ...e.details
                })
            );
          console.log(e.details);
          console.log('Revenir à l\'étape de choix du disque');
          isNotWait();
          currentStep.value--;
        }
    },
    {
        component: RebootSystemStep,
        onNext(e: {details: any}) {
            localStorage.setItem(
                'compiled-install-data',
                JSON.stringify({
                  ...(localStorage.getItem('compiled-install-data')
                      ? JSON.parse(localStorage.getItem('compiled-install-data')!) : {}),
                  ...e.details
                })
            );
            console.log(e.details);
            console.log('Passer à l\'étape de choix du pays');
            isRebooted();
            currentStep.value++;
        }
    },
    {
        component: ChooseCountryStep,
        onNext(e: {details: any}) {
            localStorage.setItem(
                'compiled-install-data',
                JSON.stringify({
                  ...(localStorage.getItem('compiled-install-data')
                      ? JSON.parse(localStorage.getItem('compiled-install-data')!) : {}),
                  ...e.details
                })
            );
            console.log(e.details);
            console.log('Passer à l\'étape de récap des langues');
            currentStep.value++;
        },
        onPrevious(e: {details: any}) {
            localStorage.setItem(
                'compiled-install-data',
                JSON.stringify({
                  ...(localStorage.getItem('compiled-install-data')
                      ? JSON.parse(localStorage.getItem('compiled-install-data')!) : {}),
                  ...e.details
                })
            );
            console.log(e.details);
            console.log('Retour à l\'étape de récap de choix du disque');
            currentStep.value = 4;
        }
    },
    {
        component: RecapLanguesStep,
        onNext(e: {details: any}) {
            localStorage.setItem(
                'compiled-install-data',
                JSON.stringify({
                  ...(localStorage.getItem('compiled-install-data')
                      ? JSON.parse(localStorage.getItem('compiled-install-data')!) : {}),
                  ...e.details
                })
            );
            console.log(e.details);
            console.log('Passer à l\'étape des conditions générale d\'utilisation');
            currentStep.value++;
        },
        onPrevious(e: {details: any}) {
            localStorage.setItem(
                'compiled-install-data',
                JSON.stringify({
                  ...(localStorage.getItem('compiled-install-data')
                      ? JSON.parse(localStorage.getItem('compiled-install-data')!) : {}),
                  ...e.details
                })
            );
            console.log(e.details);
            console.log('Retour à l\'étape de choix du pays');
            currentStep.value--;
        }
    },
    {
        component: GeneralConditionsStep,
        onNext(e: {details: any}) {
            localStorage.setItem(
                'compiled-install-data',
                JSON.stringify({
                  ...(localStorage.getItem('compiled-install-data')
                      ? JSON.parse(localStorage.getItem('compiled-install-data')!) : {}),
                  ...e.details
                })
            );
            console.log(e.details);
            console.log('Passer à l\'étape de création de compte');
            currentStep.value++;
        },
        onPrevious(e: {details: any}) {
            localStorage.setItem(
                'compiled-install-data',
                JSON.stringify({
                  ...(localStorage.getItem('compiled-install-data')
                      ? JSON.parse(localStorage.getItem('compiled-install-data')!) : {}),
                  ...e.details
                })
            );
            console.log(e.details);
            console.log('Retour à l\'étape de récap des langues');
            currentStep.value--;
        }
    },
    {
        component: CreateAccountStep,
        onNext(e: {details: any}) {
            localStorage.setItem(
                'compiled-install-data',
                JSON.stringify({
                  ...(localStorage.getItem('compiled-install-data')
                      ? JSON.parse(localStorage.getItem('compiled-install-data')!) : {}),
                  ...e.details
                })
            );
            console.log(e.details);
            console.log('Passer à l\'étape de choix du style du mac');
            currentStep.value++;
        },
        onPrevious(e: {details: any}) {
            localStorage.setItem(
                'compiled-install-data',
                JSON.stringify({
                  ...(localStorage.getItem('compiled-install-data')
                      ? JSON.parse(localStorage.getItem('compiled-install-data')!) : {}),
                  ...e.details
                })
            );
            console.log(e.details);
            console.log('Revenir à l\'étape des conditions générale d\'utilisation');
            currentStep.value--;
        }
    },
    {
        component: ChooseStyleStep,
        onNext(e: {details: any}) {
            localStorage.setItem(
                'compiled-install-data',
                JSON.stringify({
                  ...(localStorage.getItem('compiled-install-data')
                      ? JSON.parse(localStorage.getItem('compiled-install-data')!) : {}),
                  ...e.details
                })
            );
            console.log(e.details);
            console.log('Passer à l\'étape de configuration');
            currentStep.value++;
        },
        onPrevious(e: {details: any}) {
            localStorage.setItem(
                'compiled-install-data',
                JSON.stringify({
                  ...(localStorage.getItem('compiled-install-data')
                      ? JSON.parse(localStorage.getItem('compiled-install-data')!) : {}),
                  ...e.details
                })
            );
            console.log(e.details);
            console.log('Revenir à l\'étape de création du compte');
            currentStep.value--;
        }
    },
    {
        component: ConfigurationStep,
        onNext(e: {details: any}) {
            localStorage.setItem(
                'compiled-install-data',
                JSON.stringify({
                  ...(localStorage.getItem('compiled-install-data')
                      ? JSON.parse(localStorage.getItem('compiled-install-data')!) : {}),
                  ...e.details
                })
            );
            console.log(e.details);
            console.log('Passer à l\'étape de reboot');
            currentStep.value++;
        }
    },
    {
        component: RebootSystemStep,
        onNext(e: {details: any}) {
            localStorage.setItem(
                'compiled-install-data',
                JSON.stringify({
                  ...(localStorage.getItem('compiled-install-data')
                      ? JSON.parse(localStorage.getItem('compiled-install-data')!) : {}),
                  ...e.details
                })
            );
            console.log(e.details);
            console.log('Finir le process et aller sur le bureau');
            localStorage.setItem('installed', '1');
            emit('installed', {
                install_skipped: false
            });
        }
    }
];
const CurrentStep = computed(() => components[currentStep.value].component);

onMounted(() => {
  if (localStorage.getItem('currentStep')) {
    (new Database('portfolio-apple', 1)).remove();
    localStorage.removeItem('compiled-install-data');
    localStorage.removeItem('currentStep');

    window.location.reload();
  }
})
</script>

<style lang="scss" scoped>
.menu-bar {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1;
    background: transparent;

    &:not(.rebooted) {
        background: transparent;
        display: flex;
        flex-direction: row;
        justify-content: flex-start;

        * {
            color: white;
        }

        div {
            padding-left: 5px;
            padding-right: 5px;
            padding-top: 5px;
            padding-bottom: 5px;
            display: flex;
            justify-content: center;
            align-items: center;

            &:first-child {
                font-size: 25px;
                margin-left: 15px;
            }

            &:nth-child(2) {
                font-weight: bold;
            }

            &:last-child {
                flex: 1;
                justify-content: flex-end;
                padding-right: 15px;

                img {
                    width: 20px;
                }
            }
        }
    }

    &.rebooted {
        display: flex;
        flex-direction: row;
        justify-content: flex-end;

        span {
            color: white;
            padding-left: 10px;
            padding-right: 10px;

            i.far {
                color: white;
            }
        }
    }
}
</style>

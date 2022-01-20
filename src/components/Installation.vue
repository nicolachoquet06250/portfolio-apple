<template>
    <div :class="{
        'menu-bar': true,
        rebooted
    }">
        <div v-if="rebooted">
            <span> {{ langue.displayed }} <i class="far fa-keyboard"></i> </span>
            <span> {{ formattedDate }} </span>
        </div>

        <template v-else>
            <div v-if="Object.keys(menus).length > 0"> <i class="fab fa-apple"></i> </div>

            <div> {{ stepTitle }} </div>

            <div v-for="menuTab of Object.keys(menus)" :key="menuTab" clickable>
                {{ menuTab }}
            </div>
        </template>
    </div>

    <CurrentStep 
        @nextStep="components[currentStep]?.onNext($event)" 
        @previousStep="components[currentStep]?.onPrevious($event)" />
</template>

<script setup>
import { computed, ref, defineEmits } from 'vue';
import { useMenu, isRebooted } from '@/hooks/installation/menu';
import { useLangues } from '@/hooks/installation/langue';

import LanguesStep from '@/install/Langues.vue';
import StartInstallStep from '@/install/StartInstall.vue';
import InstallRecapStep from '@/install/InstallRecap.vue';
import LicenceStep from '@/install/Licence.vue';
import ChooseDisqueStep from '@/install/ChooseDisque.vue';
import InstallStep from '@/install/Install.vue';
import RebootSystemStep from '@/install/RebootSystem.vue';
import ChooseCountryStep from '@/install/ChooseCountry.vue';
import RecapLanguesStep from '@/install/RecapLangues.vue';
import GeneralConditionsStep from '@/install/GeneralConditions.vue';
import CreateAccountStep from '@/install/CreateAccount.vue';
import ChooseStyleStep from '@/install/ChooseStyle.vue';
import ConfigurationStep from '@/install/Configuration.vue';

const emit = defineEmits(['installed']);

const { menus, rebooted, stepTitle } = useMenu();
const { langue } = useLangues();

const formattedDate = ref(
  new Date().getHours() + ':' + new Date().getMinutes()
);

setInterval(() => {
  formattedDate.value = new Date().getHours() + ':' + new Date().getMinutes();
}, 1000);

const currentStep = ref(0);
const components = [
    {
        component: LanguesStep,
        onNext(e) {
            console.log(e.details)
            console.log('passer à l\'étape de démarrage de l\'installation');
            currentStep.value++;
        }
    },
    {
        component: StartInstallStep,
        onNext(e) {
            console.log(e.details)
            console.log('passer à l\'étape de récapitulation de l\'installation pour pouvoir commencer');
            currentStep.value++;
        }
    },
    {
        component: InstallRecapStep,
        onNext(e) {
            console.log(e.details);
            console.log('passer à l\'étape d\'accéptation de la licence');
            currentStep.value++;
        }
    },
    {
        component: LicenceStep,
        onNext(e) {
            console.log(e.details);
            console.log('Passer à l\'étape de choix du disque');
            currentStep.value++;
        },
        onPrevious(e) {
            console.log(e.details);
            console.log('Revenir à l\'étape de récap');
            currentStep.value--;
        }
    },
    {
        component: ChooseDisqueStep,
        onNext(e) {
            console.log(e.details);
            console.log('Passer à l\'installation');
            currentStep.value++;
        },
        onPrevious(e) {
            console.log(e.details);
            console.log('Revenir à l\'étape d\'acceptation de la licence');
            currentStep.value--;
        }
    },
    {
        component: InstallStep,
        onPrevious(e) {
            console.log(e.details);
            console.log('Revenir à l\'étape de choix du disque');
            currentStep.value--;
        },
        onNext(e) {
            console.log(e.details);
            console.log('Passer à l\'étape de reboot');
            currentStep.value++;
        }
    },
    {
        component: RebootSystemStep,
        onNext(e) {
            console.log(e.details);
            console.log('Passer à l\'étape de choix du pays');
            isRebooted();
            currentStep.value++;
        }
    },
    {
        component: ChooseCountryStep,
        onNext(e) {
            console.log(e.details);
            console.log('Passer à l\'étape de récap des langues');
            currentStep.value++;
        },
        onPrevious(e) {
            console.log(e.details);
            console.log('Retour à l\'étape de récap de choix du disque');
            currentStep.value = 4;
        }
    },
    {
        component: RecapLanguesStep,
        onNext(e) {
            console.log(e.details);
            console.log('Passer à l\'étape des conditions générale d\'utilisation');
            currentStep.value++;
        },
        onPrevious(e) {
            console.log(e.details);
            console.log('Retour à l\'étape de choix du pays');
            currentStep.value--;
        }
    },
    {
        component: GeneralConditionsStep,
        onNext(e) {
            console.log(e.details);
            console.log('Passer à l\'étape de création de compte');
            currentStep.value++;
        },
        onPrevious(e) {
            console.log(e.details);
            console.log('Retour à l\'étape de récap des langues');
            currentStep.value--;
        }
    },
    {
        component: CreateAccountStep,
        onNext(e) {
            console.log(e.details);
            console.log('Passer à l\'étape de choix du style du mac');
            currentStep.value++;
        },
        onPrevious(e) {
            console.log(e.details);
            console.log('Revenir à l\'étape des conditions générale d\'utilisation');
            currentStep.value--;
        }
    },
    {
        component: ChooseStyleStep,
        onNext(e) {
            console.log(e.details);
            console.log('Passer à l\'étape de configuration');
            currentStep.value++;
        },
        onPrevious(e) {
            console.log(e.details);
            console.log('Revenir à l\'étape de création du compte');
            currentStep.value--;
        }
    },
    {
        component: ConfigurationStep,
        onNext(e) {
            console.log(e.details);
            console.log('Passer à l\'étape de reboot');
            currentStep.value++;
        }
    },
    {
        component: RebootSystemStep,
        onNext(e) {
            console.log(e.details);
            console.log('Finir le process et aller sur le bureau');
            emit('installed');
        }
    }
];
const CurrentStep = computed(() => components[currentStep.value].component);
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

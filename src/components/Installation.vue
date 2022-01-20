<template>
    <CurrentStep 
        @nextStep="components[currentStep]?.onNext($event)" 
        @previousStep="components[currentStep]?.onPrevious($event)" />
</template>

<script setup>
import { computed, ref } from 'vue';

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
            console.log('passer à \'étape de récapitulation de \'installation pour pouvoir commencer');
            currentStep.value++;
        }
    },
    {
        component: InstallRecapStep,
        onNext(e) {
            console.log(e.details);
            console.log('passer à \'étape d\'accéptation de la licence');
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
            console.log('étape suivante');
        },
        onPrevious(e) {
            console.log(e.details);
            console.log('Revenir à l\'étape des conditions générale d\'utilisation');
            currentStep.value--;
        }
    }
];
const CurrentStep = computed(() => components[currentStep.value].component);
</script>

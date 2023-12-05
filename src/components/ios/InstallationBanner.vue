<template>
  <Notification
      v-if="show"
      :icon="installIcon"
      :date="formattedDate"
  >
    <template #title>
      Mise à jour système
    </template>

    <p> Une mise à jour du portefolio est disponible ! </p>
    <p> Veuillez rafraichir </p>

    <template #actions>
      <button v-if="deferredPrompt"
              @click="handleInstall"
      >
          Installer
      </button>
      <button @click="handleCancel">
          Annuler
      </button>
    </template>
  </Notification>
</template>

<script setup>
import Notification from "@/components/ios/UnlockScreenNotification.vue";
import installIcon from "@/assets/icon-cd-install-mac.png";
import {watch} from "vue";
import {usePwa} from "@/hooks/pwa.js";

const emit = defineEmits(['close']);

const {
    authorizedInstallation: show,
    deferredPrompt,
    onInstall: handleInstall,
    onCancel: handleCancel
} = usePwa();

// watch([deferredPrompt, show], ([d, s]) => console.log(d, s))

const date = new Date();
const formattedDate = `${date.getHours() < 10 ? '0' : ''}${date.getHours()}:${date.getMinutes() < 10 ? '0' : ''}${date.getMinutes()}`

watch(show, s => !s && emit('close'));
</script>

<style scoped lang="scss">
  p {
    margin: 0;
  }
</style>
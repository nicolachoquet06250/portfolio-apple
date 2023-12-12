<template>
  <Notification
      v-if="showRefreshPageNotification"
      :icon="installIcon"
      :date="formattedDate"
  >
      <template #title>
        Mise à jour système
      </template>

      <p> Une mise à jour du portefolio est disponible ! </p>
      <p> Veuillez rafraichir </p>

      <template #actions>
          <button @click="handleRefresh">
              Rafraichir
          </button>
      </template>
  </Notification>
</template>

<script setup lang="ts">
import Notification from "@/components/ios/UnlockScreenNotification.vue";
import installIcon from "@/assets/icon-cd-install-mac.png";
import {showRefreshPageNotification} from '@/hooks/pwa';

const date = new Date();
const formattedDate = `${date.getHours() < 10 ? '0' : ''}${date.getHours()}:${date.getMinutes() < 10 ? '0' : ''}${date.getMinutes()}`

const handleRefresh = () => window.location.reload();
</script>

<style scoped lang="scss">

</style>
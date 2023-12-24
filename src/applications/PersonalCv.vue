<template>
  <component :is="component" v-if="component" />
</template>

<script setup lang="ts">
import {useCv} from '@/hooks/my-cv';
import {useNotifications} from '@/hooks/notifications';
import {onMounted, ref} from 'vue';
import {InformationsType, usePersonalInformations} from '@/hooks/personal-informations';

const {component} = useCv();
const { createNotification } = useNotifications();

const {profilePicture} = usePersonalInformations(InformationsType.ALL);
const notificationOpened = ref(true);

onMounted(() => {
  createNotification({
    title: 'Mon CV',
    image: profilePicture,
    content: 'Cette application est encore en cours de développement.',
    opened: notificationOpened,
    buttons: [
      {
        text: 'OK',
        click() {
          notificationOpened.value = false;
        }
      }
    ]
  })
})
</script>

<style scoped lang="scss">

</style>
<template>
  <template v-for="({image, index, title, content, autoClose = false, buttons}, i) of notifications"
            :key="`${title}-${index}`">
    <Notification v-model:opened="notifications[i].opened"
                  :index="index" :i="i"
                  :image="image" :latence="2000"
                  :auto-close="autoClose"
                  @closed="closeNotification(i)"
    >
      <template v-slot:title>
        <span> {{ title }} </span>
      </template>

      <template v-slot:content>
        <span> {{ content }} </span>
      </template>

      <template v-slot:button>
        <button v-for="(button, b) of buttons" :key="b"
                @click="(e) => {
                    // console.log(e, button.click)
                    button.click(e)
                }">
          {{ button.text }}
        </button>
      </template>
    </Notification>
  </template>
</template>

<script setup lang="ts">
import Notification from '@/components/utilities/macos/Notification.vue';
import {useNotifications} from '@/hooks/notifications';

const { notifications, closeNotification } = useNotifications();
</script>

<style scoped lang="scss">

</style>
<template>
  <Notification v-if="show" :icon="installIcon" :date="formattedDate">
    <template #title>
      Mise à jour système
    </template>

    <p> Une mise à jour du portefolio est disponible ! </p>
    <p> Veuillez rafraichir </p>

    <template #actions>
      <button @click="handleInstall" v-if="deferredPrompt">Installer</button>
      <button @click="handleCancel">Annuler</button>
    </template>
  </Notification>
</template>

<script setup>
import Notification from "@/components/ios/UnlockScreenNotification.vue";
import installIcon from "@/assets/icon-cd-install-mac.png";
import {onBeforeUnmount, onMounted, ref, watch} from "vue";

const emit = defineEmits(['close']);

const date = new Date();
const formattedDate = `${date.getHours() < 10 ? '0' : ''}${date.getHours()}:${date.getMinutes() < 10 ? '0' : ''}${date.getMinutes()}`

const show = ref(false);
const deferredPrompt = ref(null);

const handleInstall = () => {
  deferredPrompt.value.prompt();
}
const handleCancel = () => {
  show.value = false;
}
// ------------------------
function setCookie(cname, cvalue, exdays) {
  var d = new Date();
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
  var expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
  const name = cname + "=";
  const decodedCookie = decodeURIComponent(document.cookie);
  const ca = decodedCookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function checkCookie() {
  let user = getCookie("username");
  if (user !== "") {
    alert("Welcome again " + user);
  } else {
    user = prompt("Please enter your name:", "");
    if (user !== "" && user != null) {
      setCookie("username", user, 365);
    }
  }
}

const handleBeforeInstallPrompt = event => {
  // Don't display the standard one
  event.preventDefault();

  // We check if the user has the Don't Show Cookie stored. If not, we'll show him the banner.
  let cookieBlockInstallCookieHide = getCookie("BlockInstallCookieHide");
  if (!cookieBlockInstallCookieHide) {
    show.value = true;
  }

  // Save the event to use it later
  deferredPrompt.value = event;
};

const handleAppInstalled = () => {
  // Hide the app-provided install promotion
  show.value = false;
  // Clear the deferredPrompt so it can be garbage collected
  deferredPrompt.value = null;
  // Optionally, send analytics event to indicate successful install
  console.log('PWA was installed');
}

onMounted(() => {
  window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
  window.addEventListener('appinstalled', handleAppInstalled);
});

onBeforeUnmount(() => {
  window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
  window.removeEventListener('appinstalled', handleAppInstalled);
});

watch(show, (show) => {
  if (!show) {
    emit('close');
  }
});
</script>

<style scoped lang="scss">
  p {
    margin: 0;
  }
</style>
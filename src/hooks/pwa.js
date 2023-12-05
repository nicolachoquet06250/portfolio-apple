import {computed, onBeforeUnmount, onMounted, ref, watch} from "vue";

const authorizedInstallation = ref(false);
const deferredPrompt = ref(window.deferredPrompt ?? null);

export const usePwa = () => {
    const firstMount = ref(true);

    watch(deferredPrompt, (prompt) => {
        window.deferredPrompt = prompt;
    });

    const handleInstall = async () => {
        deferredPrompt.value.prompt();
        const { outcome } = await deferredPrompt.value.userChoice;

        if (outcome === 'accepted') {
            deferredPrompt.value = null;
            window.deferredPrompt = null;
        }
    }
    const handleCancel = () => {
        authorizedInstallation.value = false;
    }

    const handleBeforeInstallPrompt = event => {
        // Don't display the standard one
        event.preventDefault();

        // We check if the user has the Don't Show Cookie stored. If not, we'll show him the banner.
        authorizedInstallation.value = 'getInstalledRelatedApps' in navigator;

        // Save the event to use it later
        deferredPrompt.value = event;
    };

    const handleAppInstalled = () => {
        // Hide the app-provided install promotion
        authorizedInstallation.value = false;
        // Clear the deferredPrompt so it can be garbage collected
        deferredPrompt.value = null;
        window.deferredPrompt = null;
        // Optionally, send analytics event to indicate successful install
        console.log('PWA was installed');
    }

    onMounted(() => {
        if (window.deferredPrompt) {
            deferredPrompt.value = window.deferredPrompt;
        }

        window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
        window.addEventListener('appinstalled', handleAppInstalled);

        if (firstMount.value) {
            firstMount.value = false;
        }
    });

    onBeforeUnmount(() => {
        window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
        window.removeEventListener('appinstalled', handleAppInstalled);
    });

    return {
        authorizedInstallation: computed(() => authorizedInstallation.value || deferredPrompt.value),
        deferredPrompt: computed(() => deferredPrompt.value),

        onInstall: handleInstall,
        onCancel: handleCancel
    }
};
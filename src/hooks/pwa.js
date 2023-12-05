import {computed, onBeforeUnmount, onMounted, ref, watch} from "vue";

export const usePwa = () => {
    const authorizedInstallation = ref(false);
    const deferredPrompt = ref(window.deferredPrompt ?? null);
    const firstMount = ref(true);

    watch(deferredPrompt, (prompt) => {
        window.deferredPrompt = prompt;
    });

    const handleInstall = async () => {
        deferredPrompt.value.prompt();
        // const { outcome } = await deferredPrompt.value.userChoice;

        // if (outcome === 'accepted') {
        //     localStorage.setItem('pwa-installed', '1');
        // } else {
        //     localStorage.removeItem('pwa-installed');
        // }
    }
    const handleCancel = () => {
        // localStorage.removeItem('pwa-installed');
        authorizedInstallation.value = false;
    }

    const handleBeforeInstallPrompt = event => {
        // Don't display the standard one
        event.preventDefault();

        // We check if the user has the Don't Show Cookie stored. If not, we'll show him the banner.
        authorizedInstallation.value =
            /*!localStorage.getItem('pwa-installed') && */
            'getInstalledRelatedApps' in navigator;

        // Save the event to use it later
        deferredPrompt.value = event;
    };

    const handleAppInstalled = () => {
        // localStorage.setItem('pwa-installed', '1');
        // Hide the app-provided install promotion
        authorizedInstallation.value = false;
        // Clear the deferredPrompt so it can be garbage collected
        deferredPrompt.value = null;
        // Optionally, send analytics event to indicate successful install
        console.log('PWA was installed');
    }

    onMounted(() => {
        // if (firstMount.value) {
        //     localStorage.setItem('pwa-installed', '1');
        //     authorizedInstallation.value = false;
        // }
        //
        // // if (!firstMount.value && 'getInstalledRelatedApps' in navigator && !localStorage.getItem('pwa-installed'))
        // if ('getInstalledRelatedApps' in navigator) {
        //     authorizedInstallation.value = true;
        // }

        console.log('mounted');

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
        authorizedInstallation: computed(() => authorizedInstallation.value),
        deferredPrompt: computed(() => deferredPrompt.value),

        onInstall: handleInstall,
        onCancel: handleCancel
    }
};
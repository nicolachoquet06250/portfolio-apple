import {computed, onBeforeUnmount, onMounted, ref, watch} from "vue";

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

export const usePwa = () => {
    const authorizedInstallation = ref(false);
    const deferredPrompt = ref(window.deferredPrompt ?? null);

    watch(deferredPrompt, (prompt) => {
        window.deferredPrompt = prompt;
    });

    const handleInstall = async () => {
        deferredPrompt.value.prompt();
        const { outcome } = await deferredPrompt.value.userChoice;

        if (outcome === 'accepted') {
            localStorage.setItem('pwa-installed', '1');
        } else {
            localStorage.removeItem('pwa-installed');
        }
    }
    const handleCancel = () => {
        localStorage.removeItem('pwa-installed');
        authorizedInstallation.value = false;
    }

    const handleBeforeInstallPrompt = event => {
        // Don't display the standard one
        event.preventDefault();

        // We check if the user has the Don't Show Cookie stored. If not, we'll show him the banner.
        if (!localStorage.getItem('pwa-installed')) {
            authorizedInstallation.value = true;
        }

        // Save the event to use it later
        deferredPrompt.value = event;
    };

    const handleAppInstalled = () => {
        localStorage.setItem('pwa-installed', '1');
        // Hide the app-provided install promotion
        authorizedInstallation.value = false;
        // Clear the deferredPrompt so it can be garbage collected
        deferredPrompt.value = null;
        // Optionally, send analytics event to indicate successful install
        console.log('PWA was installed');
    }

    onMounted(() => {
        if (!localStorage.getItem('pwa-installed') && 'getInstalledRelatedApps' in navigator) {
            authorizedInstallation.value = true;
        }

        window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
        window.addEventListener('appinstalled', handleAppInstalled);
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
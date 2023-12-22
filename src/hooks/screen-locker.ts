import {onMounted, onUnmounted} from "vue";
import {useScreenOrientation} from "@vueuse/core";

export const useScreenLocker = () => {
    const {
        isSupported,
        lockOrientation,
        unlockOrientation,
    } = useScreenOrientation()

    onMounted(() => {
        if (isSupported) {
            lockOrientation('portrait');
        }
        // if (screen && screen.orientation && screen.orientation.lock) {
        //     screen.orientation.lock('portrait')
        //         .then(() => console.log('L\'ecran à été bloqué en portrait !'))
        //         .catch((error) => console.error(error.message));
        // }
    });
    onUnmounted(() => {
        if (isSupported) {
            unlockOrientation();
        }
        // if (screen && screen.orientation && screen.orientation.unlock) {
        //     screen.orientation.unlock();
        //
        //     console.log('L\'ecran à été débloqué !');
        // }
    });
};
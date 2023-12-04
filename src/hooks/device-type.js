import MobileDetect from "mobile-detect";
import {computed, ref} from "vue";

export const IS_MOBILE = 'mobile'
export const IS_TABLET = 'tablet'
export const IS_DESKTOP = 'desktop'

export const useDeviceType = () => {
    const md = new MobileDetect(navigator.userAgent);
    const isMobile = ref(md.phone() !== null || md.mobile() === 'UnknownMobile');
    const isTablet = ref(md.tablet() !== null || md.mobile() === 'UnknownTablet');

    return computed(() => {
        if (isMobile.value) {
            return 'mobile'
        }
        else if (isTablet.value) {
            return 'tablet'
        }

        return 'desktop'
    })
}
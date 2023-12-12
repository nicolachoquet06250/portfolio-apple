import MobileDetect from "mobile-detect";
import {computed, onMounted, ref} from "vue";

export enum DEVICE_TYPE {
    MOBILE = 'mobile',
    TABLET = 'tablet',
    DESKTOP = 'desktop'
}
export const IS_MOBILE = 'mobile'
export const IS_TABLET = 'tablet'
export const IS_DESKTOP = 'desktop'

export const useDeviceType = () => {
    const md = new MobileDetect(navigator.userAgent);
    const isMobile = ref((md.phone() !== null || md.mobile() === 'UnknownMobile') && navigator.maxTouchPoints !== 1);
    const isTablet = ref((md.tablet() !== null || md.mobile() === 'UnknownTablet') && navigator.maxTouchPoints !== 1);

    onMounted(() => {
        const handleResize = () => {
            isMobile.value = (md.phone() !== null || md.mobile() === 'UnknownMobile') && navigator.maxTouchPoints !== 1;
            isTablet.value = (md.tablet() !== null || md.mobile() === 'UnknownTablet') && navigator.maxTouchPoints !== 1;
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        }
    });

    return computed<DEVICE_TYPE>(() => {
        if (isMobile.value) {
            return DEVICE_TYPE.MOBILE
        }
        else if (isTablet.value) {
            return DEVICE_TYPE.TABLET
        }

        return DEVICE_TYPE.DESKTOP
    });
}

export const useMobile = () => {
    const deviceType = useDeviceType();

    return computed(() => deviceType.value === DEVICE_TYPE.MOBILE);
}

export const useTablet = () => {
    const deviceType = useDeviceType();

    return computed(() => deviceType.value === DEVICE_TYPE.TABLET);
}

export const useDesktop = () => {
    const isMobile = useMobile();
    const isTablet = useTablet();

    return computed(() => !isMobile.value && !isTablet.value);
}
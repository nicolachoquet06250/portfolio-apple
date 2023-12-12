import { computed } from "vue";
import MobileSwiper from '@/components/ios/Swiper/MobileSwiper.vue';
import DesktopSwiper from '@/components/ios/Swiper/DesktopSwiper.vue';
import MobileInstallSwiper from '@/install/ios/swiper/MobileSwiper.vue';
import DesktopInstallSwiper from '@/install/ios/swiper/DesktopSwiper.vue';
import { DEVICE_TYPE, useDeviceType } from "@/hooks/device-type";

export const useIosSwiper = () => {
    const deviceType = useDeviceType();
    
    return computed(() => deviceType.value === DEVICE_TYPE.MOBILE || deviceType.value === DEVICE_TYPE.TABLET
        ? MobileSwiper : DesktopSwiper);
};

export const useIosOpenInstallerSwiper = () => {
    const deviceType = useDeviceType();

    return computed(() => deviceType.value === DEVICE_TYPE.MOBILE || deviceType.value === DEVICE_TYPE.TABLET
        ? MobileInstallSwiper : DesktopInstallSwiper);
};
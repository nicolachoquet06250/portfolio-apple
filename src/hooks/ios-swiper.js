import { computed } from "vue";
import MobileSwiper from '@/components/ios/Swiper/MobileSwiper.vue';
import DesktopSwiper from '@/components/ios/Swiper/DesktopSwiper.vue';
import MobileInstallSwiper from '@/install/ios/swiper/MobileSwiper.vue';
import DesktopInstallSwiper from '@/install/ios/swiper/DesktopSwiper.vue';
import { IS_MOBILE, IS_TABLET, useDeviceType } from "@/hooks/device-type.js";

export const useIosSwiper = () => {
    const deviceType = useDeviceType();
    
    return computed(() => deviceType.value === IS_MOBILE || deviceType.value === IS_TABLET
        ? MobileSwiper : DesktopSwiper);
};

export const useIosOpenInstallerSwiper = () => {
    const deviceType = useDeviceType();

    return computed(() => deviceType.value === IS_MOBILE || deviceType.value === IS_TABLET
        ? MobileInstallSwiper : DesktopInstallSwiper);
};
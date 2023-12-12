import { computed } from "vue";
import MobileSwiper from '@/components/ios/Swiper/MobileSwiper.vue';
import DesktopSwiper from '@/components/ios/Swiper/DesktopSwiper.vue';
import MobileInstallSwiper from '@/install/ios/swiper/MobileSwiper.vue';
import DesktopInstallSwiper from '@/install/ios/swiper/DesktopSwiper.vue';
import {useMobile, useTablet} from "@/hooks/device-type";

export const useIosSwiper = () => {
    const isMobile = useMobile();
    const isTablet = useTablet();
    
    return computed(() => isMobile.value || isTablet.value ? MobileSwiper : DesktopSwiper);
};

export const useIosOpenInstallerSwiper = () => {
    const isMobile = useMobile();
    const isTablet = useTablet();

    return computed(() => isMobile.value || isTablet.value ? MobileInstallSwiper : DesktopInstallSwiper);
};
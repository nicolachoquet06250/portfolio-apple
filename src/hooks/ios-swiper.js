import MobileDetect from "mobile-detect";
import { ref, computed } from "vue";
import MobileSwiper from '@/components/ios/Swiper/MobileSwiper.vue';
import DesktopSwiper from '@/components/ios/Swiper/DesktopSwiper.vue';
import MobileInstallSwiper from '@/install/ios/swiper/MobileSwiper.vue';
import DesktopInstallSwiper from '@/install/ios/swiper/DesktopSwiper.vue';

export const useIosSwiper = () => {
    const md = new MobileDetect(navigator.userAgent);
    const isMobile = ref(md.phone() !== null || md.mobile() === 'UnknownMobile');
    const isTablet = ref(md.tablet() !== null || md.mobile() === 'UnknownTablet');
    
    return computed(() => isMobile.value || isTablet.value ? MobileSwiper : DesktopSwiper);
};

export const useIosOpenInstallerSwiper = () => {
    const md = new MobileDetect(navigator.userAgent);
    const isMobile = ref(md.phone() !== null || md.mobile() === 'UnknownMobile');
    const isTablet = ref(md.tablet() !== null || md.mobile() === 'UnknownTablet');

    return computed(() => isMobile.value || isTablet.value ? MobileInstallSwiper : DesktopInstallSwiper);
};
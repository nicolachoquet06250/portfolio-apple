import {useNetwork as useNetworkFromVueUse} from '@vueuse/core';
import {useMobile} from '@/hooks/device-type';
import {toComputed} from '@/macros/vue';

export const useNetwork = () => {
    const isMobile = useMobile();

    const {
        isSupported,
        isOnline,
        offlineAt,
        downlink,
        downlinkMax,
        // NetworkEffectType: "slow-2g" | "2g" | "3g" | "4g" | undefined
        effectiveType,
        rtt,
        saveData,
        // NetworkType: "bluetooth" | "cellular" | "ethernet" | "none" | "wifi" | "wimax" | "other" | "unknown"
        type
    } = useNetworkFromVueUse();

    const _downlink = toComputed(() => downlink.value ?? 0);

    return {
        isSupported: toComputed(isSupported),
        isOnline: toComputed(isOnline),
        offlineAt: toComputed(() => offlineAt.value ?? 0),
        downlink: toComputed(_downlink),
        downlinkMax: toComputed(() => downlinkMax.value ?? _downlink.value),
        effectiveType: toComputed(effectiveType),
        rtt: toComputed(() => rtt.value ?? 0),
        saveData: toComputed(() => saveData.value ?? false),
        type: toComputed(() => type.value ?? (isMobile.value ? 'cellular' : 'wifi'))
    };
};
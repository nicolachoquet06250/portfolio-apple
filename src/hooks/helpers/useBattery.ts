import { computed, ComputedRef, ref } from "vue";
import { BatteryManager } from "@vueuse/core";

type Computed<T> = {
    [K in keyof T]: ComputedRef<T[K]>
}

type UseBatteryReturn = Omit<
    Computed<
        BatteryManager & {
            isSupported: boolean
        }
    >,
    'addEventListener'|'removeEventListener'|'dispatchEvent'
>;

export const useBattery = (): UseBatteryReturn => {
    const isSupported = ref(false);
    const charging = ref(false);
    const chargingTime = ref(0);
    const dischargingTime = ref(0);
    const level = ref(1);
    
    if ('getBattery' in navigator && navigator.getBattery instanceof Function) {
        isSupported.value = true;
        
        navigator.getBattery().then((battery: BatteryManager) => {
            charging.value = battery.charging;
            
            battery.addEventListener('chargingchange', () => {
                charging.value = battery.charging;
            });
            
            battery.addEventListener('chargingtimechange', () => {
                chargingTime.value = battery.chargingTime;
            });
            
            battery.addEventListener('chargingtimechange', () => {
                dischargingTime.value = battery.dischargingTime;
            });
            
            battery.addEventListener('levelchange', () => {
                level.value = battery.level;
            });
        });
    }
    
    return {
        isSupported: computed(() => isSupported.value),
        charging: computed(() => charging.value),
        chargingTime: computed(() => chargingTime.value),
        dischargingTime: computed(() => dischargingTime.value),
        level: computed(() => level.value)
    }
};
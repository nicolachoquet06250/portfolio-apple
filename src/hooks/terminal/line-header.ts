import {useAccount} from "@/hooks/installation/account";
import {computed, ComputedRef} from "vue";

type UseTerminalLineHeader = (location: ComputedRef<string>) => ComputedRef<string>;

export const useTerminalLineHeader: UseTerminalLineHeader = (location) => {
    const { accountName } = useAccount();

    const username = computed(() => accountName.value === '' ? 'anonymous' : accountName.value);
    const deviceName = 'macos-portfolio-nchoquet';

    return computed(() => `${username.value}@${deviceName} $~${location.value} `)
}